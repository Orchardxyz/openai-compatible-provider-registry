import type { ThemedTokenWithVariants } from "shiki"

export type SiteSyntaxLanguage = "typescript" | "html" | "json"

export type SiteThemeName = "light" | "dark"

export type HighlightedToken = {
  content: string
  lightColorKey: string | null
  darkColorKey: string | null
  lightBackgroundKey: string | null
  darkBackgroundKey: string | null
  isItalic: boolean
  isBold: boolean
  isUnderline: boolean
}

export type HighlightedLine = {
  tokens: HighlightedToken[]
}

export type HighlightedSnippet = {
  lines: HighlightedLine[]
}

export const SHIKI_LIGHT_THEME = "github-light-default"
export const SHIKI_DARK_THEME = "github-dark-default"

export const SHIKI_LANGUAGES: readonly SiteSyntaxLanguage[] = [
  "typescript",
  "html",
  "json"
]

const FONT_STYLE_ITALIC = 1
const FONT_STYLE_BOLD = 2
const FONT_STYLE_UNDERLINE = 4

export function normalizeColorKey(color?: string): string | null {
  if (!color) {
    return null
  }

  return color.replace(/^#/, "").toLowerCase()
}

export function createHighlightedSnippet(
  lines: ThemedTokenWithVariants[][]
): HighlightedSnippet {
  return {
    lines: lines.map((line) => ({
      tokens: line.map((token) => {
        const lightVariant = token.variants.light
        const darkVariant = token.variants.dark
        const fontStyle = lightVariant?.fontStyle ?? darkVariant?.fontStyle ?? 0

        return {
          content: token.content,
          lightColorKey: normalizeColorKey(lightVariant?.color),
          darkColorKey: normalizeColorKey(darkVariant?.color),
          lightBackgroundKey: normalizeColorKey(lightVariant?.bgColor),
          darkBackgroundKey: normalizeColorKey(darkVariant?.bgColor),
          isItalic: (fontStyle & FONT_STYLE_ITALIC) !== 0,
          isBold: (fontStyle & FONT_STYLE_BOLD) !== 0,
          isUnderline: (fontStyle & FONT_STYLE_UNDERLINE) !== 0
        }
      })
    }))
  }
}
