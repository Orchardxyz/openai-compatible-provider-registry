import { createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import htmlLanguage from "shiki/langs/html.mjs"
import jsonLanguage from "shiki/langs/json.mjs"
import typescriptLanguage from "shiki/langs/typescript.mjs"
import githubDarkDefault from "shiki/themes/github-dark-default.mjs"
import githubLightDefault from "shiki/themes/github-light-default.mjs"
import {
  createHighlightedSnippet,
  SHIKI_DARK_THEME,
  SHIKI_LIGHT_THEME,
  type HighlightedSnippet,
  type SiteSyntaxLanguage
} from "./code-highlighting"

let highlighterPromise:
  | Promise<Awaited<ReturnType<typeof createHighlighterCore>>>
  | undefined

async function getServerHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      engine: createJavaScriptRegexEngine(),
      themes: [githubLightDefault, githubDarkDefault],
      langs: [typescriptLanguage, htmlLanguage, jsonLanguage]
    })
  }

  return highlighterPromise
}

export async function highlightSnippetOnServer(
  code: string,
  lang: SiteSyntaxLanguage
): Promise<HighlightedSnippet> {
  const highlighter = await getServerHighlighter()
  const tokens = highlighter.codeToTokensWithThemes(code, {
    lang,
    themes: {
      light: SHIKI_LIGHT_THEME,
      dark: SHIKI_DARK_THEME
    }
  })

  return createHighlightedSnippet(tokens)
}
