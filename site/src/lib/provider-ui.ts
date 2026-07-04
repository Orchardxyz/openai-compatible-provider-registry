import {
  PROVIDERS,
  getProvider,
  type FetchProviderModelsResult,
  type ProviderId
} from "@registry/index";

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

export function getStatusLabel(status: string): string {
  switch (status) {
    case "loading":
      return "Request in flight";
    case "success":
      return "Models loaded";
    case "error":
      return "Needs attention";
    default:
      return "Ready for a manual request";
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

export function classifyError(error: unknown): UiErrorState {
  if (error instanceof TypeError) {
    return {
      kind: "cors",
      title: "Browser request blocked or interrupted",
      message:
        "The request did not complete in the browser. This often means a CORS policy block, a local network interruption, or an extension/proxy conflict.",
      detail: error.message
    };
  }

  if (error instanceof Error) {
    const message = error.message;

    if (message.includes("401") || message.includes("403")) {
      return {
        kind: "auth",
        title: "Authentication was rejected",
        message:
          "The provider responded, but the supplied key was rejected or does not have access to list models.",
        detail: message
      };
    }

    if (
      message.includes("Invalid models response") ||
      message.includes("Unexpected token")
    ) {
      return {
        kind: "response",
        title: "Response shape did not match the expected /models format",
        message:
          "The endpoint answered, but the payload was not the OpenAI-style model list shape this playground expects.",
        detail: message
      };
    }

    if (message.includes("Failed to fetch")) {
      return {
        kind: "network",
        title: "The request could not reach the provider",
        message:
          "The browser could not complete the request. Check the selected base URL and local network environment.",
        detail: message
      };
    }

    return {
      kind: "unknown",
      title: "The request failed",
      message:
        "The request did not complete successfully. Review the detail below and compare with the provider docs.",
      detail: message
    };
  }

  return {
    kind: "unknown",
    title: "The request failed",
    message: "An unexpected non-Error value was thrown during the request."
  };
}

export function formatCreated(value: number | undefined): string {
  if (!value) {
    return "n/a";
  }

  return new Date(value * 1000).toISOString().slice(0, 10);
}

export function formatRawJson(result: FetchProviderModelsResult | null): string {
  if (!result) {
    return "No response captured yet.";
  }

  return JSON.stringify(result.models.map((model) => model.raw), null, 2);
}