import { useMemo } from "preact/hooks";
import { createPlaygroundActions, createPlaygroundState } from "../state/playground";
import type { SiteMessages } from "../i18n/messages";
import { ProviderList } from "./ProviderList";
import { RequestWorkbench } from "./RequestWorkbench";
import { ResultsPanel } from "./ResultsPanel";

type PlaygroundAppProps = {
  messages: SiteMessages;
};

export function PlaygroundApp({ messages }: PlaygroundAppProps) {
  const state = useMemo(() => createPlaygroundState(messages), [messages]);
  const actions = useMemo(
    () => createPlaygroundActions(state, messages),
    [state, messages]
  );

  return (
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
  );
}