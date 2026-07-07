import type { ProviderId, ProviderRegistryEntry } from "@registry/index";
import type { ReadonlySignal } from "@preact/signals";

type ProviderListProps = {
  providerId: ProviderId;
  providerQuery: string;
  filteredProviders: ReadonlySignal<readonly ProviderRegistryEntry[]>;
  heading: string;
  filterPlaceholder: string;
  docsAriaLabelPrefix: string;
  docsAriaLabelSuffix: string;
  docsTitle: string;
  onProviderQueryChange: (value: string) => void;
  onProviderSelect: (id: ProviderId) => void;
};

export function ProviderList({
  providerId,
  providerQuery,
  filteredProviders,
  heading,
  filterPlaceholder,
  docsAriaLabelPrefix,
  docsAriaLabelSuffix,
  docsTitle,
  onProviderQueryChange,
  onProviderSelect
}: ProviderListProps) {
  return (
    <section class="panel panel--providers">
      <div class="panel__header">
        <h2>{heading} ({filteredProviders.value.length})</h2>
      </div>

      <label class="field">
        <input
          class="field__input"
          type="search"
          value={providerQuery}
          onInput={(event) =>
            onProviderQueryChange((event.currentTarget as HTMLInputElement).value)
          }
          placeholder={filterPlaceholder}
          aria-label={filterPlaceholder}
          autocomplete="off"
          autocapitalize="off"
          spellcheck={false}
        />
      </label>

      <div class="provider-list">
        {filteredProviders.value.map((entry) => (
          <ProviderCard
            key={entry.id}
            entry={entry}
            isActive={entry.id === providerId}
            docsAriaLabelPrefix={docsAriaLabelPrefix}
            docsAriaLabelSuffix={docsAriaLabelSuffix}
            docsTitle={docsTitle}
            onSelect={onProviderSelect}
          />
        ))}
      </div>
    </section>
  );
}

type ProviderCardProps = {
  entry: ProviderRegistryEntry;
  isActive: boolean;
  docsAriaLabelPrefix: string;
  docsAriaLabelSuffix: string;
  docsTitle: string;
  onSelect: (id: ProviderId) => void;
};

function ProviderCard({
  entry,
  isActive,
  docsAriaLabelPrefix,
  docsAriaLabelSuffix,
  docsTitle,
  onSelect
}: ProviderCardProps) {
  const docsAriaLabel = `${docsAriaLabelPrefix}${entry.displayName}${docsAriaLabelSuffix}`;

  return (
    <div class={`provider-card${isActive ? " provider-card--active" : ""}`}>
      <button
        type="button"
        class="provider-card__main"
        onClick={() => onSelect(entry.id)}
      >
        <span class="provider-card__title-row">
          <span class="provider-card__title">{entry.displayName}</span>
          <span class="provider-card__meta">
            <span class="provider-card__badge">{entry.id}</span>
          </span>
        </span>
        <span class="provider-card__url">{entry.baseUrl}</span>
      </button>
      <a
        class="provider-card__docs"
        href={entry.docsUrl}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={docsAriaLabel}
        title={docsTitle}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path
            d="M6 14 14 6M8 6h6v6"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
          />
        </svg>
      </a>
    </div>
  );
}
