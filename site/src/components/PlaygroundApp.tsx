import { useEffect, useMemo } from "preact/hooks";
import { createPlaygroundActions, createPlaygroundState } from "../state/playground";
import { CodeBlock } from "./CodeBlock";
import type { SiteMessages } from "../i18n/messages";
import type { SiteLocale } from "../i18n/config";
import type { HighlightedSnippet } from "../lib/code-highlighting";
import { GITHUB_URL, PACKAGE_NAME } from "../lib/site-constants";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ProviderList } from "./ProviderList";
import { RequestWorkbench } from "./RequestWorkbench";
import { ResultsPanel } from "./ResultsPanel";
import { ThemeToggle } from "./ThemeToggle";

type PlaygroundAppProps = {
  locale: SiteLocale;
  messages: SiteMessages;
  basePath: string;
  usageEsmSnippet: HighlightedSnippet;
  usageCdnSnippet: HighlightedSnippet;
};

export function PlaygroundApp({
  locale,
  messages,
  basePath,
  usageEsmSnippet,
  usageCdnSnippet
}: PlaygroundAppProps) {
  const state = useMemo(() => createPlaygroundState(messages), [messages]);
  const actions = useMemo(
    () => createPlaygroundActions(state, messages),
    [state, messages]
  );

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme.value;
  }, [state]);

  return (
    <div class="shell">
      <header class="topbar">
        <a class="topbar__brand" href="./" aria-label={messages.brandAriaLabel}>
          {PACKAGE_NAME}
        </a>
        <div class="topbar__actions">
          <LanguageSwitcher
            locale={locale}
            messages={messages}
            basePath={basePath}
          />
          <ThemeToggle
            theme={state.theme.value}
            lightLabel={messages.themeLight}
            darkLabel={messages.themeDark}
            ariaLabel={messages.themeSwitcherAriaLabel}
            onSelect={actions.setTheme}
          />
          <a
            class="icon-link"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={messages.githubAriaLabel}
            title={messages.githubTitle}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.36 1.12 2.94.85.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.09 0-1.13.39-2.06 1.03-2.78-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.06A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.06 2.74-1.06.56 1.42.21 2.47.1 2.73.64.72 1.03 1.65 1.03 2.78 0 3.96-2.34 4.82-4.57 5.08.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.6.69.49A10.24 10.24 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </header>

      <section class="hero">
        <div class="hero__usage">
          <div class="hero__usage-header">
            <p class="eyebrow">{messages.heroEyebrow}</p>
          </div>
          <div class="usage-grid">
            <article class="usage-card">
              <p class="usage-card__label">{messages.usageCardEsmLabel}</p>
              <CodeBlock snippet={usageEsmSnippet} className="usage-card__code" />
            </article>
            <article class="usage-card">
              <p class="usage-card__label">{messages.usageCardCdnLabel}</p>
              <CodeBlock snippet={usageCdnSnippet} className="usage-card__code" />
            </article>
          </div>
        </div>
      </section>

      <main class="workspace">
        <ProviderList
          providerId={state.providerId.value}
          providerQuery={state.providerQuery.value}
          filteredProviders={state.filteredProviders}
          heading={messages.supportedProviders}
          filterPlaceholder={messages.filterPlaceholder}
          docsAriaLabelPrefix={messages.docsAriaLabelPrefix}
          docsAriaLabelSuffix={messages.docsAriaLabelSuffix}
          docsTitle={messages.docsTitle}
          onProviderQueryChange={actions.setProviderQuery}
          onProviderSelect={actions.setProvider}
        />
        <RequestWorkbench
          providerId={state.providerId.value}
          selectedProvider={state.selectedProvider}
          baseUrl={state.baseUrl.value}
          apiKey={state.apiKey.value}
          isKeyVisible={state.isKeyVisible.value}
          status={state.status.value}
          statusLabel={state.statusLabel}
          eyebrow={messages.workbenchEyebrow}
          providerIdLabel={messages.providerIdLabel}
          baseUrlLabel={messages.baseUrlLabel}
          baseUrlPlaceholder={messages.baseUrlPlaceholder}
          apiKeyLabel={messages.apiKeyLabel}
          apiKeyPlaceholder={messages.apiKeyPlaceholder}
          securityNote={messages.securityNote}
          fetchButton={messages.fetchButton}
          fetchButtonLoading={messages.fetchButtonLoading}
          revealButton={messages.revealButton}
          hideButton={messages.hideButton}
          onBaseUrlChange={actions.setBaseUrl}
          onApiKeyChange={actions.setApiKey}
          onToggleKeyVisibility={actions.toggleKeyVisibility}
          onSubmit={() => {
            actions.submitRequest();
          }}
        >
          <ResultsPanel
            activeTab={state.activeTab.value}
            latestResult={state.latestResult.value}
            latestError={state.latestError.value}
            rawJsonPreview={state.rawJsonPreview}
            tabModels={messages.tabModels}
            tabRaw={messages.tabRaw}
            emptyTitle={messages.emptyTitle}
            emptyBody={messages.emptyBody}
            tableId={messages.tableId}
            tableOwnedBy={messages.tableOwnedBy}
            tableCreated={messages.tableCreated}
            onTabChange={actions.setActiveTab}
          />
        </RequestWorkbench>
      </main>
    </div>
  );
}
