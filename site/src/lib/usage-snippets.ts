import { PACKAGE_NAME } from "./site-constants"

export const USAGE_ESM_SNIPPET = `import { fetchModels } from "${PACKAGE_NAME}";

const result = await fetchModels("openai", { apiKey });
console.log(result.models.map((model) => model.id));`

export const USAGE_CDN_SNIPPET = `<script type="module">
  import { fetchModels } from "https://esm.sh/${PACKAGE_NAME}";

  const result = await fetchModels("openai", { apiKey });
  console.log(result.models);
</script>`
