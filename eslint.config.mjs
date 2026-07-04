import oryz from "@oryz/eslint-config";
import globals from "globals";

export default oryz(
  {
    allowDefaultProject: ["tsup.config.ts"]
  },
  {
    ignores: ["site/.astro/**", "site/src/env.d.ts", "site/dist/**", "**/*.astro"]
  },
  {
    files: ["site/astro.config.mjs", "site/eslint.config.mjs", "*.mjs"],
    languageOptions: {
      globals: { ...globals.node }
    }
  }
);