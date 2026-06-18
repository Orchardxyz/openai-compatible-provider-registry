import { PROVIDER_IDS, type ProviderId, type ProviderRegistryEntry } from "./types";

export const PROVIDERS = [
  {
    id: PROVIDER_IDS.DASHSCOPE,
    displayName: "Bailian / DashScope",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1/",
    modelsPath: "models",
    docsUrl: "https://help.aliyun.com/zh/model-studio/get-api-key"
  },
  {
    id: PROVIDER_IDS.DEEPSEEK,
    displayName: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    modelsPath: "models",
    docsUrl: "https://platform.deepseek.com/api-docs/"
  },
  {
    id: PROVIDER_IDS.DOUBAO,
    displayName: "Doubao",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3/",
    modelsPath: "models",
    docsUrl: "https://www.volcengine.com/docs/82379/1182403"
  },
  {
    id: PROVIDER_IDS.GROQ,
    displayName: "Groq",
    baseUrl: "https://api.groq.com/openai",
    modelsPath: "models",
    docsUrl: "https://console.groq.com/docs/openai"
  },
  {
    id: PROVIDER_IDS.MINIMAX,
    displayName: "MiniMax",
    baseUrl: "https://api.minimaxi.com/v1/",
    modelsPath: "models",
    docsUrl: "https://platform.minimaxi.com/docs/api-reference/text-openai-api"
  },
  {
    id: PROVIDER_IDS.MINIMAX_GLOBAL,
    displayName: "MiniMax Global",
    baseUrl: "https://api.minimax.io/v1/",
    modelsPath: "models",
    docsUrl: "https://platform.minimax.io/docs/api-reference/text-openai-api"
  },
  {
    id: PROVIDER_IDS.MISTRAL,
    displayName: "Mistral",
    baseUrl: "https://api.mistral.ai",
    modelsPath: "models",
    docsUrl: "https://docs.mistral.ai/getting-started/models/models_overview"
  },
  {
    id: PROVIDER_IDS.MODELSCOPE,
    displayName: "ModelScope",
    baseUrl: "https://api-inference.modelscope.cn/v1/",
    modelsPath: "models",
    docsUrl: "https://modelscope.cn/docs/model-service/API-Inference/intro"
  },
  {
    id: PROVIDER_IDS.MOONSHOT,
    displayName: "Moonshot AI",
    baseUrl: "https://api.moonshot.cn",
    modelsPath: "models",
    docsUrl: "https://platform.kimi.com/docs/api/list-models"
  },
  {
    id: PROVIDER_IDS.OPENAI,
    displayName: "OpenAI",
    baseUrl: "https://api.openai.com",
    modelsPath: "models",
    docsUrl: "https://platform.openai.com/docs/api-reference/models/list"
  },
  {
    id: PROVIDER_IDS.SILICON,
    displayName: "Silicon",
    baseUrl: "https://api.siliconflow.cn",
    modelsPath: "models",
    docsUrl: "https://docs.siliconflow.cn/"
  },
  {
    id: PROVIDER_IDS.ZAI,
    displayName: "Z.ai",
    baseUrl: "https://api.z.ai/api/paas/v4/",
    modelsPath: "models",
    docsUrl: "https://docs.z.ai/api-reference/introduction"
  },
  {
    id: PROVIDER_IDS.ZHIPU,
    displayName: "ZhiPu",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4/",
    modelsPath: "models",
    docsUrl: "https://docs.bigmodel.cn/cn/api/introduction"
  }
] as const satisfies readonly ProviderRegistryEntry[];

const providerMap = new Map<ProviderId, ProviderRegistryEntry>(
  PROVIDERS.map((provider) => [provider.id, provider])
);

export function listProviders(): readonly ProviderRegistryEntry[] {
  return PROVIDERS;
}

export function getProvider(id: ProviderId): ProviderRegistryEntry | undefined {
  return providerMap.get(id);
}
