export type SiteLocale = "en" | "zh-CN";

export const DEFAULT_SITE_LOCALE: SiteLocale = "en";

export const LOCALE_ROUTES: ReadonlyMap<SiteLocale, string> = new Map([
  ["en", ""],
  ["zh-CN", "zh-cn"]
]);

export const ROUTE_TO_LOCALE: ReadonlyMap<string, SiteLocale> = new Map([
  ["", "en"],
  ["zh-cn", "zh-CN"]
]);

export function localeFromRoute(segment: string | undefined): SiteLocale {
  if (typeof segment !== "string") {
    return DEFAULT_SITE_LOCALE;
  }

  return ROUTE_TO_LOCALE.get(segment) ?? DEFAULT_SITE_LOCALE;
}

export function htmlLangFor(locale: SiteLocale): string {
  return locale;
}

export function homePathFor(locale: SiteLocale, basePath: string): string {
  const segment = LOCALE_ROUTES.get(locale) ?? "";
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;

  return `${normalizedBase}${segment}`;
}

export function altPathFor(locale: SiteLocale, basePath: string): string {
  const segment = LOCALE_ROUTES.get(locale) ?? "";
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;

  return `${normalizedBase}${segment}`;
}