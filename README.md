# openai-compatible-provider-registry

`openai-compatible-provider-registry` is a dependency-free runtime library for
OpenAI-compatible provider discovery.

It provides a curated provider registry, lookup helpers, and a `fetchModels()`
helper for calling `/models` with native `fetch`.

It does not cover non-standard listing APIs, provider-specific adapters, or
model invocation features such as chat, completions, embeddings, retries,
caching, or credential management.

## Installation

```bash
pnpm add openai-compatible-provider-registry
```

## Supported Providers

| Provider            | Provider ID      | BaseUrl                                              | Source                                                                                                                                |
| ------------------- | ---------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Bailian / DashScope | `dashscope`      | `https://dashscope.aliyuncs.com/compatible-mode/v1/` | <a href="https://help.aliyun.com/zh/model-studio/get-api-key" target="_blank" rel="noopener noreferrer">Bailian / DashScope</a>       |
| DeepSeek            | `deepseek`       | `https://api.deepseek.com`                           | <a href="https://api-docs.deepseek.com/api/list-models" target="_blank" rel="noopener noreferrer">DeepSeek</a>                        |
| Doubao              | `doubao`         | `https://ark.cn-beijing.volces.com/api/v3/`          | <a href="https://www.volcengine.com/docs/82379/1330626?lang=zh" target="_blank" rel="noopener noreferrer">Doubao</a>                  |
| Groq                | `groq`           | `https://api.groq.com/openai`                        | <a href="https://console.groq.com/docs/openai" target="_blank" rel="noopener noreferrer">Groq</a>                                     |
| MiniMax             | `minimax`        | `https://api.minimaxi.com/v1/`                       | <a href="https://platform.minimaxi.com/docs/api-reference/models/openai/list-models" target="_blank" rel="noopener noreferrer">MiniMax</a> |
| MiniMax Global      | `minimax-global` | `https://api.minimax.io/v1/`                         | <a href="https://platform.minimax.io/docs/api-reference/models/openai/list-models" target="_blank" rel="noopener noreferrer">MiniMax Global</a> |
| Mistral             | `mistral`        | `https://api.mistral.ai`                             | <a href="https://docs.mistral.ai/api/endpoint/models#operation-list_models_v1_models_get" target="_blank" rel="noopener noreferrer">Mistral</a> |
| ModelScope          | `modelscope`     | `https://api-inference.modelscope.cn/v1/`            | <a href="https://modelscope.cn/docs/model-service/API-Inference/intro" target="_blank" rel="noopener noreferrer">ModelScope</a>       |
| Moonshot AI         | `moonshot`       | `https://api.moonshot.cn`                            | <a href="https://platform.kimi.com/docs/api/list-models" target="_blank" rel="noopener noreferrer">Moonshot AI</a>                    |
| OpenAI              | `openai`         | `https://api.openai.com`                             | <a href="https://platform.openai.com/docs/api-reference/models/list" target="_blank" rel="noopener noreferrer">OpenAI</a>             |
| Silicon             | `silicon`        | `https://api.siliconflow.cn`                         | <a href="https://docs.siliconflow.cn/cn/api-reference/models/get-model-list.md" target="_blank" rel="noopener noreferrer">Silicon</a> |
| Z.ai                | `zai`            | `https://api.z.ai/api/paas/v4/`                      | <a href="https://docs.z.ai/guides/develop/openai/python.md" target="_blank" rel="noopener noreferrer">Z.ai</a>                        |
| ZhiPu               | `zhipu`          | `https://open.bigmodel.cn/api/paas/v4/`              | <a href="https://docs.bigmodel.cn/cn/guide/develop/openai/introduction.md" target="_blank" rel="noopener noreferrer">ZhiPu</a>        |

Only providers with public OpenAI-compatible model list APIs are included.

## Usage

| Export            | Description                                                                                                   | Type                                                                                                | Default                                                               | Version |
| ----------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------- |
| `PROVIDERS`       | Alphabetically sorted provider registry.                                                                      | `readonly ProviderRegistryEntry[]`                                                                  | Built-in provider metadata.                                           | `v0`    |
| `PROVIDER_IDS`    | Reusable provider ID constants such as `PROVIDER_IDS.OPENAI`.                                                 | `const` object                                                                                      | Built-in provider IDs.                                                | `v0`    |
| `listProviders()` | Returns `PROVIDERS` as-is.                                                                                    | `() => readonly ProviderRegistryEntry[]`                                                            | Returns the built-in registry.                                        | `v0`    |
| `getProvider()`   | Looks up one provider by ID.                                                                                  | `(id: ProviderId) => ProviderRegistryEntry \| undefined`                                            | Returns `undefined` when not found.                                   | `v0`    |
| `fetchModels()`   | Fetches `/models` with `Authorization: Bearer {apiKey}`. Supports `baseUrl`, `fetch`, and `signal` overrides. | `(provider: ProviderId, options: FetchProviderModelsOptions) => Promise<FetchProviderModelsResult>` | Uses the provider's built-in `baseUrl` and native `globalThis.fetch`. | `v0`    |

Callers are responsible for supplying valid API keys for the providers they use.
