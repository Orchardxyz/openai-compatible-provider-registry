import type { FetchProviderModelsResult, ProviderId } from "@registry/index";

export type RequestStatus = "idle" | "loading" | "success" | "error";

export type ResultTab = "models" | "raw";
export type ThemeName = "light" | "dark";

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

export type PlaygroundState = {
  providerId: ProviderId;
  baseUrl: string;
  apiKey: string;
  isKeyVisible: boolean;
  theme: ThemeName;
  status: RequestStatus;
  activeTab: ResultTab;
  latestResult: FetchProviderModelsResult | null;
  latestError: UiErrorState | null;
};
