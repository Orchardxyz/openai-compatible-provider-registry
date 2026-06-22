import { getProvider } from "./providers";
import type {
  FetchProviderModelsOptions,
  FetchProviderModelsResult,
  ProviderId,
  ProviderModel,
} from "./types";
import {
  isRecord,
  joinUrl,
  readOptionalNumber,
  readOptionalString,
} from "./utils";

export async function fetchModels(
  provider: ProviderId,
  options: FetchProviderModelsOptions,
): Promise<FetchProviderModelsResult> {
  const entry = getProvider(provider);

  if (!entry) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  const fetchImpl = options.fetch ?? globalThis.fetch;

  if (typeof fetchImpl !== "function") {
    throw new Error(
      `No fetch implementation available for provider: ${provider}`,
    );
  }

  const baseUrl = options.baseUrl ?? entry.baseUrl;
  const modelsUrl = joinUrl(baseUrl, entry.modelsPath);
  const response = await fetchImpl(modelsUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${options.apiKey}`,
    },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch models for provider "${provider}": ${response.status} ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as unknown;
  const models = extractModelItems(payload, provider);

  return {
    provider,
    baseUrl,
    modelsUrl,
    fetchedAt: new Date().toISOString(),
    models: models.flatMap((model) => normalizeModel(model)),
  };
}

function extractModelItems(payload: unknown, provider: ProviderId): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (isRecord(payload) && Array.isArray(payload.data)) {
    return payload.data;
  }

  throw new Error(
    `Invalid models response for provider "${provider}": expected top-level array or object with data array`,
  );
}

function normalizeModel(model: unknown): ProviderModel[] {
  if (!isRecord(model)) {
    return [];
  }

  const id = readOptionalString(model.id);
  const ownedBy =
    readOptionalString(model.owned_by) ?? readOptionalString(model.ownedBy);

  if (!id) {
    return [];
  }

  return [
    {
      id,
      object: readOptionalString(model.object),
      created: readOptionalNumber(model.created),
      ownedBy,
      raw: model,
    },
  ];
}
