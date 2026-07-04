import type { SiteLocale } from "../i18n/config";
import type { SiteMessages } from "../i18n/messages";

type LanguageSwitcherProps = {
  locale: SiteLocale;
  messages: SiteMessages;
  basePath: string;
};

export function LanguageSwitcher({
  locale,
  messages,
  basePath
}: LanguageSwitcherProps) {
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const enHref = `${normalizedBase}`;
  const zhHref = `${normalizedBase}zh-cn/`;

  return (
    <div
      class="language-switcher"
      role="group"
      aria-label={messages.languageSwitcherAriaLabel}
    >
      <a
        class={`language-switcher__link${locale === "en" ? " language-switcher__link--active" : ""}`}
        href={enHref}
        aria-current={locale === "en" ? "true" : undefined}
      >
        {messages.languageEn}
      </a>
      <a
        class={`language-switcher__link${locale === "zh-CN" ? " language-switcher__link--active" : ""}`}
        href={zhHref}
        aria-current={locale === "zh-CN" ? "true" : undefined}
      >
        {messages.languageZh}
      </a>
    </div>
  );
}