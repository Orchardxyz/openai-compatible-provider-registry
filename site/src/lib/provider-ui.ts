import {
  PROVIDERS,
  getProvider,
  type FetchProviderModelsResult,
  type ProviderId
} from "@registry/index";
import type { ErrorCopy, StatusLabels } from "../i18n/messages";

export type UiErrorKind =
  | "auth"
  | "cors"
  | "network"
  | "response"
  | "unknown";

export type UiErrorState = {
  kind: UiErrorKind;
  title: string;
  message: string;
  detail?: string;
};

export const PROVIDER_LIST = [...PROVIDERS];

export function getDefaultProviderId(): ProviderId {
  return PROVIDER_LIST[0]?.id ?? "openai";
}

export function getDefaultBaseUrl(providerId: ProviderId): string {
  return getProvider(providerId)?.baseUrl ?? "";
}

export function getProviderDocsUrl(providerId: ProviderId): string {
  return getProvider(providerId)?.docsUrl ?? "#";
}

export function getStatusLabel(
  status: string,
  labels: StatusLabels
): string {
  switch (status) {
    case "loading":
      return labels.loading;
    case "success":
      return labels.success;
    case "error":
      return labels.error;
    default:
      return labels.idle;
  }
}

export function redactApiKey(apiKey: string): string {
  if (!apiKey) {
    return "Not provided";
  }

  if (apiKey.length <= 8) {
    return `${apiKey.slice(0, 2)}...`;
  }

  return `${apiKey.slice(0, 3)}...${apiKey.slice(-4)}`;
}

export function classifyError(error: unknown, copy: ErrorCopy): UiErrorState {
  if (error instanceof TypeError) {
    return {
      kind: "cors",
      title: copy.corsTitle,
      message: copy.corsMessage,
      detail: error.message
    };
  }

  if (error instanceof Error) {
    const message = error.message;

    if (message.includes("401") || message.includes("403")) {
      return {
        kind: "auth",
        title: copy.authTitle,
        message: copy.authMessage,
        detail: message
      };
    }

    if (
      message.includes("Invalid models response") ||
      message.includes("Unexpected token")
    ) {
      return {
        kind: "response",
        title: copy.responseTitle,
        message: copy.responseMessage,
        detail: message
      };
    }

    if (message.includes("Failed to fetch")) {
      return {
        kind: "network",
        title: copy.networkTitle,
        message: copy.networkMessage,
        detail: message
      };
    }

    return {
      kind: "unknown",
      title: copy.unknownTitle,
      message: copy.unknownMessage,
      detail: message
    };
  }

  return {
    kind: "unknown",
    title: copy.unknownTitle,
    message: copy.nonErrorMessage
  };
}

export function formatCreated(value: number | undefined): string {
  if (!value) {
    return "n/a";
  }

  return new Date(value * 1000).toISOString().slice(0, 10);
}

export function formatRawJson(
  result: FetchProviderModelsResult | null,
  fallback: string
): string {
  if (!result) {
    return fallback;
  }

  return JSON.stringify(result.models.map((model) => model.raw), null, 2);
}