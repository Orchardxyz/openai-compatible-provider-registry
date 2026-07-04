import type { FetchProviderModelsResult } from "@registry/index";
import type { ReadonlySignal } from "@preact/signals";
import { formatCreated, type UiErrorState } from "../lib/provider-ui";
import type { ResultTab } from "../state/playground";

type ResultsPanelProps = {
  activeTab: ResultTab;
  latestResult: FetchProviderModelsResult | null;
  latestError: UiErrorState | null;
  rawJsonPreview: ReadonlySignal<string>;
  tabModels: string;
  tabRaw: string;
  emptyTitle: string;
  emptyBody: string;
  tableId: string;
  tableOwnedBy: string;
  tableCreated: string;
  onTabChange: (tab: ResultTab) => void;
};

export function ResultsPanel({
  activeTab,
  latestResult,
  latestError,
  rawJsonPreview,
  tabModels,
  tabRaw,
  emptyTitle,
  emptyBody,
  tableId,
  tableOwnedBy,
  tableCreated,
  onTabChange
}: ResultsPanelProps) {
  return (
    <section class="panel panel--results">
      {latestError ? <ErrorNotice error={latestError} /> : null}
      <div class="tab-row">
        <TabButton
          label={tabModels}
          value="models"
          isActive={activeTab === "models"}
          onSelect={onTabChange}
        />
        <TabButton
          label={tabRaw}
          value="raw"
          isActive={activeTab === "raw"}
          onSelect={onTabChange}
        />
      </div>

      <div class="results-frame">
        {activeTab === "raw" ? (
          <pre class="code-block">{rawJsonPreview.value}</pre>
        ) : (
          <ModelsTable
            latestResult={latestResult}
            emptyTitle={emptyTitle}
            emptyBody={emptyBody}
            tableId={tableId}
            tableOwnedBy={tableOwnedBy}
            tableCreated={tableCreated}
          />
        )}
      </div>
    </section>
  );
}

type TabButtonProps = {
  label: string;
  value: ResultTab;
  isActive: boolean;
  onSelect: (tab: ResultTab) => void;
};

function TabButton({ label, value, isActive, onSelect }: TabButtonProps) {
  return (
    <button
      type="button"
      class={`tab-button${isActive ? " tab-button--active" : ""}`}
      onClick={() => onSelect(value)}
    >
      {label}
    </button>
  );
}

type ModelsTableProps = {
  latestResult: FetchProviderModelsResult | null;
  emptyTitle: string;
  emptyBody: string;
  tableId: string;
  tableOwnedBy: string;
  tableCreated: string;
};

function ModelsTable({
  latestResult,
  emptyTitle,
  emptyBody,
  tableId,
  tableOwnedBy,
  tableCreated
}: ModelsTableProps) {
  if (!latestResult) {
    return (
      <div class="empty-state">
        <p>{emptyTitle}</p>
        <p>{emptyBody}</p>
      </div>
    );
  }

  return (
    <div class="table-wrap">
      <table class="models-table">
        <thead>
          <tr>
            <th>{tableId}</th>
            <th>{tableOwnedBy}</th>
            <th>{tableCreated}</th>
          </tr>
        </thead>
        <tbody>
          {latestResult.models.map((model) => (
            <tr key={model.id}>
              <td class="models-table__id">{model.id}</td>
              <td>{model.ownedBy ?? "n/a"}</td>
              <td>{formatCreated(model.created)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ErrorNotice({ error }: { error: UiErrorState }) {
  return (
    <div class="error-notice" role="alert">
      <div class="error-notice__header">
        <h3>{error.title}</h3>
      </div>
      <p>{error.message}</p>
      {error.detail ? (
        <p class="error-notice__detail">{error.detail}</p>
      ) : null}
    </div>
  );
}