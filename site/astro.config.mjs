import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import { fileURLToPath } from "node:url";

function resolveBase() {
  const repository = process.env.GITHUB_REPOSITORY;

  if (!repository) {
    return "/";
  }

  const [, repoName] = repository.split("/");

  if (!repoName) {
    return "/";
  }

  return `/${repoName}/`;
}

const registryAlias = fileURLToPath(new URL("./../src/", import.meta.url));

export default defineConfig({
  root: ".",
  base: resolveBase(),
  output: "static",
  trailingSlash: "ignore",
  build: {
    format: "directory",
    assets: "assets"
  },
  integrations: [preact()],
  vite: {
    resolve: {
      alias: {
        "@registry": registryAlias
      }
    }
  }
});