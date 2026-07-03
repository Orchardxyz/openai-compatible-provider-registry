import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const productionCsp =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src https:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';";

function resolveBase(): string {
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

export default defineConfig(({ command }) => ({
  base: resolveBase(),
  plugins: [
    {
      name: "inject-production-csp",
      transformIndexHtml(html) {
        if (command !== "build") {
          return html.replace("<!-- SITE_CSP -->", "");
        }

        return html.replace(
          "<!-- SITE_CSP -->",
          `<meta http-equiv="Content-Security-Policy" content="${productionCsp}" />`,
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@registry": fileURLToPath(new URL("./../src/", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    host: "127.0.0.1",
  },
  envPrefix: "SITE_",
  root: rootDir + "site",
}));
