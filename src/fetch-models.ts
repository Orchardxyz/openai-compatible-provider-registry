import { getProvider } from "./providers";
import type {
  FetchProviderModelsOptions,
  FetchProviderModelsResult,
  ProviderId,
  ProviderModel
} from "./types";
import { isRecord, joinUrl, readOptionalNumber, readOptionalString } from "./utils";

type ModelsResponse = {
  data: unknown;
};

export async function fetchModels(
  provider: ProviderId,
  options: FetchProviderModelsOptions
): Promise<FetchProviderModelsResult> {
  const entry = getProvider(provider);

  if (!entry) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  const fetchImpl = options.fetch ?? globalThis.fetch;

  if (typeof fetchImpl !== "function") {
    throw new Error(`No fetch implementation available for provider: ${provider}`);
  }

  const baseUrl = options.baseUrl ?? entry.baseUrl;
  const modelsUrl = joinUrl(baseUrl, entry.modelsPath);
  const response = await fetchImpl(modelsUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${options.apiKey}`
    },
    signal: options.signal
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch models for provider "${provider}": ${response.status} ${response.statusText}`
    );
  }

  const payload = (await response.json()) as ModelsResponse;

  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    throw new Error(`Invalid models response for provider "${provider}": expected data array`);
  }

  return {
    provider,
    baseUrl,
    modelsUrl,
    fetchedAt: new Date().toISOString(),
    models: payload.data.flatMap((model) => normalizeModel(model))
  };
}

function normalizeModel(model: unknown): ProviderModel[] {
  if (!isRecord(model)) {
    return [];
  }

  const id = readOptionalString(model.id);

  if (!id) {
    return [];
  }

  const ownedBy = readOptionalString(model.owned_by) ?? readOptionalString(model.ownedBy);

  return [
    {
      id,
      object: readOptionalString(model.object),
      created: readOptionalNumber(model.created),
      ownedBy,
      raw: model
    }
  ];
}
