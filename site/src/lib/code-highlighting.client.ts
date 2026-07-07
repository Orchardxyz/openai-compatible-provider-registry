import { createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import jsonLanguage from "shiki/langs/json.mjs"
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

async function getBrowserHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      engine: createJavaScriptRegexEngine(),
      themes: [githubLightDefault, githubDarkDefault],
      langs: [jsonLanguage]
    })
  }

  return highlighterPromise
}

export async function highlightSnippetInBrowser(
  code: string,
  lang: SiteSyntaxLanguage
): Promise<HighlightedSnippet> {
  const highlighter = await getBrowserHighlighter()
  const tokens = highlighter.codeToTokensWithThemes(code, {
    lang,
    themes: {
      light: SHIKI_LIGHT_THEME,
      dark: SHIKI_DARK_THEME
    }
  })

  return createHighlightedSnippet(tokens)
}
