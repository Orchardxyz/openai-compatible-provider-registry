import { useMemo } from "preact/hooks";
import { tokenizeJson, type JsonToken } from "../lib/json-highlighting";

type CodeBlockProps = {
  code: string;
  className?: string;
  json?: boolean;
};

export function CodeBlock({ code, className, json }: CodeBlockProps) {
  const classes = ["syntax-block", className].filter(Boolean).join(" ");

  const tokens = useMemo<JsonToken[] | null>(() => {
    if (!json) {
      return null;
    }

    return tokenizeJson(code);
  }, [code, json]);

  if (!json || !tokens) {
    return (
      <pre class={classes}>
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <pre class={classes}>
      <code>
        {tokens.map((token, index) => (
          <span key={index} class={`json-token json-token--${token.kind}`}>
            {token.value}
          </span>
        ))}
      </code>
    </pre>
  );
}