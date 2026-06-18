export const PROVIDER_IDS = {
  OPENAI: "openai",
  DEEPSEEK: "deepseek",
  SILICON: "silicon",
  GROQ: "groq",
  MISTRAL: "mistral",
  MOONSHOT: "moonshot",
  ZHIPU: "zhipu",
  ZAI: "zai",
  DASHSCOPE: "dashscope",
  MINIMAX: "minimax",
  MINIMAX_GLOBAL: "minimax-global",
  DOUBAO: "doubao",
  MODELSCOPE: "modelscope"
} as const;

export type ProviderId = (typeof PROVIDER_IDS)[keyof typeof PROVIDER_IDS];

export type ProviderRegistryEntry = {
  id: ProviderId;
  displayName: string;
  baseUrl: string;
  modelsPath: string;
  docsUrl: string;
};

export type FetchProviderModelsOptions = {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
  signal?: AbortSignal;
};

export type ProviderModel = {
  id: string;
  object?: string;
  created?: number;
  ownedBy?: string;
  raw: unknown;
};

export type FetchProviderModelsResult = {
  provider: ProviderId;
  baseUrl: string;
  modelsUrl: string;
  fetchedAt: string;
  models: ProviderModel[];
};
