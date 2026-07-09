export type JsonTokenKind =
  | "key"
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "punctuation";

export type JsonToken = {
  kind: JsonTokenKind;
  value: string;
};

const PUNCTUATION = new Set(["{", "}", "[", "]", ":", ","]);

export function tokenizeJson(input: string): JsonToken[] | null {
  if (!input.trim()) {
    return [];
  }

  try {
    JSON.parse(input);
  } catch {
    return null;
  }

  const tokens: JsonToken[] = [];
  let i = 0;
  const len = input.length;

  while (i < len) {
    const ch = input[i];

    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      tokens.push({ kind: "punctuation", value: ch });
      i++;
      continue;
    }

    if (PUNCTUATION.has(ch)) {
      tokens.push({ kind: "punctuation", value: ch });
      i++;
      continue;
    }

    if (ch === '"') {
      const start = i;
      i++;
      let escaped = false;

      while (i < len) {
        const c = input[i];

        if (escaped) {
          escaped = false;
          i++;
          continue;
        }

        if (c === "\\") {
          escaped = true;
          i++;
          continue;
        }

        if (c === '"') {
          i++;
          break;
        }

        i++;
      }

      if (i > len) {
        return null;
      }

      const raw = input.slice(start, i);
      const isKey = isKeyContext(tokens);

      tokens.push({ kind: isKey ? "key" : "string", value: raw });
      continue;
    }

    if (ch === "-" || (ch >= "0" && ch <= "9") || ch === "." || ch === "+") {
      const start = i;
      i++;

      while (i < len) {
        const c = input[i];

        if (
          (c >= "0" && c <= "9") ||
          c === "." ||
          c === "-" ||
          c === "+" ||
          c === "e" ||
          c === "E"
        ) {
          i++;
          continue;
        }

        break;
      }

      const raw = input.slice(start, i);
      tokens.push({ kind: "number", value: raw });
      continue;
    }

    if (input.startsWith("true", i)) {
      tokens.push({ kind: "boolean", value: "true" });
      i += 4;
      continue;
    }

    if (input.startsWith("false", i)) {
      tokens.push({ kind: "boolean", value: "false" });
      i += 5;
      continue;
    }

    if (input.startsWith("null", i)) {
      tokens.push({ kind: "null", value: "null" });
      i += 4;
      continue;
    }

    return null;
  }

  return tokens;
}

function isKeyContext(tokens: JsonToken[]): boolean {
  for (let j = tokens.length - 1; j >= 0; j--) {
    const t = tokens[j];

    if (t.kind !== "punctuation") {
      return false;
    }

    if (t.value === "{") {
      return true;
    }

    if (t.value === ",") {
      return true;
    }

    if (t.value === "}" || t.value === "]" || t.value === ":") {
      return false;
    }
  }

  return true;
}