import type { HighlightedSnippet, HighlightedToken } from "../lib/code-highlighting"

type CodeBlockProps = {
  snippet?: HighlightedSnippet | null
  fallbackText?: string
  className?: string
}

export function CodeBlock({
  snippet,
  fallbackText = "",
  className
}: CodeBlockProps) {
  const classes = ["syntax-block", className].filter(Boolean).join(" ")

  return (
    <pre class={classes}>
      <code>
        {snippet ? (
          snippet.lines.map((line, lineIndex) => (
            <span class="syntax-line" key={`line-${lineIndex}`}>
              {line.tokens.length > 0
                ? line.tokens.map((token, tokenIndex) => (
                    <HighlightedTokenSpan
                      key={`token-${lineIndex}-${tokenIndex}`}
                      token={token}
                    />
                  ))
                : "\u200b"}
            </span>
          ))
        ) : (
          fallbackText
        )}
      </code>
    </pre>
  )
}

function HighlightedTokenSpan({ token }: { token: HighlightedToken }) {
  const classes = [
    "syntax-token",
    token.isItalic ? "syntax-token--italic" : "",
    token.isBold ? "syntax-token--bold" : "",
    token.isUnderline ? "syntax-token--underline" : ""
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <span
      class={classes}
      data-syntax-light={token.lightColorKey ?? undefined}
      data-syntax-dark={token.darkColorKey ?? undefined}
      data-syntax-light-bg={token.lightBackgroundKey ?? undefined}
      data-syntax-dark-bg={token.darkBackgroundKey ?? undefined}
    >
      {token.content}
    </span>
  )
}
