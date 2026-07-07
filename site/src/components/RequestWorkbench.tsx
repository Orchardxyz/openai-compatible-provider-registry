import type { ProviderId, ProviderRegistryEntry } from "@registry/index";
import type { ReadonlySignal } from "@preact/signals";
import type { ComponentChildren } from "preact";
import type { RequestStatus } from "../state/playground";

type RequestWorkbenchProps = {
  providerId: ProviderId;
  selectedProvider: ReadonlySignal<ProviderRegistryEntry | null>;
  baseUrl: string;
  apiKey: string;
  isKeyVisible: boolean;
  status: RequestStatus;
  statusLabel: ReadonlySignal<string>;
  eyebrow: string;
  providerIdLabel: string;
  baseUrlLabel: string;
  baseUrlPlaceholder: string;
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  securityNote: string;
  fetchButton: string;
  fetchButtonLoading: string;
  revealButton: string;
  hideButton: string;
  onBaseUrlChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onToggleKeyVisibility: () => void;
  onSubmit: () => void;
  children?: ComponentChildren;
};

export function RequestWorkbench({
  providerId,
  selectedProvider,
  baseUrl,
  apiKey,
  isKeyVisible,
  status,
  statusLabel,
  eyebrow,
  providerIdLabel,
  baseUrlLabel,
  baseUrlPlaceholder,
  apiKeyLabel,
  apiKeyPlaceholder,
  securityNote,
  fetchButton,
  fetchButtonLoading,
  revealButton,
  hideButton,
  onBaseUrlChange,
  onApiKeyChange,
  onToggleKeyVisibility,
  onSubmit,
  children
}: RequestWorkbenchProps) {
  const providerName = selectedProvider.value?.displayName ?? providerId;
  const isLoading = status === "loading";

  return (
    <section class="panel panel--workbench">
      <div class="stack">
        <div class="panel__header panel__header--workbench">
          <p class="panel__eyebrow">{eyebrow}</p>
          <div class="workbench-heading">
            <h2>{providerName}</h2>
            <div class={`status-strip status-strip--${status}`}>
              <span class="status-strip__dot"></span>
              <span>{statusLabel.value}</span>
            </div>
          </div>
        </div>

        <form
          class="request-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div class="request-form__row">
            <label class="field request-form__field request-form__field--provider-id">
              <span class="field__label">{providerIdLabel}</span>
              <input
                class="field__input field__input--mono"
                value={providerId}
                disabled
              />
            </label>

            <label class="field request-form__field request-form__field--base-url">
              <span class="field__label">{baseUrlLabel}</span>
              <input
                class="field__input field__input--mono"
                type="url"
                value={baseUrl}
                onInput={(event) =>
                  onBaseUrlChange((event.currentTarget as HTMLInputElement).value)
                }
                placeholder={baseUrlPlaceholder}
                autocomplete="off"
                autocapitalize="off"
                spellcheck={false}
              />
            </label>
          </div>

          <label class="field">
            <span class="field__label">{apiKeyLabel}</span>
            <div class="request-form__key-row">
              <input
                class="field__input field__input--mono"
                type={isKeyVisible ? "text" : "password"}
                value={apiKey}
                onInput={(event) =>
                  onApiKeyChange((event.currentTarget as HTMLInputElement).value)
                }
                placeholder={apiKeyPlaceholder}
                autocomplete="off"
                autocapitalize="off"
                spellcheck={false}
              />

              <button
                class="ghost-button request-form__toggle"
                type="button"
                onClick={onToggleKeyVisibility}
              >
                {isKeyVisible ? hideButton : revealButton}
              </button>

              <button
                class="primary-button request-form__submit"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? fetchButtonLoading : fetchButton}
              </button>
            </div>
          </label>

          <div class="security-note">{securityNote}</div>
        </form>

        {children}
      </div>
    </section>
  );
}
