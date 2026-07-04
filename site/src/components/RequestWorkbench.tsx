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
          <p class="panel__eyebrow">Request workbench</p>
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
          <label class="field">
            <span class="field__label">Provider ID</span>
            <input
              class="field__input field__input--mono"
              value={providerId}
              disabled
            />
          </label>

          <label class="field">
            <span class="field__label">Base URL override</span>
            <input
              class="field__input field__input--mono"
              type="url"
              value={baseUrl}
              onInput={(event) =>
                onBaseUrlChange((event.currentTarget as HTMLInputElement).value)
              }
              placeholder="https://api.example.com/v1/"
              autocomplete="off"
              autocapitalize="off"
              spellcheck={false}
            />
          </label>

          <label class="field">
            <span class="field__label">Temporary API key</span>
            <div class="key-input">
              <input
                class="field__input field__input--mono"
                type={isKeyVisible ? "text" : "password"}
                value={apiKey}
                onInput={(event) =>
                  onApiKeyChange((event.currentTarget as HTMLInputElement).value)
                }
                placeholder="Paste a revocable low-quota test key"
                autocomplete="off"
                autocapitalize="off"
                spellcheck={false}
              />
              <button
                class="ghost-button"
                type="button"
                onClick={onToggleKeyVisibility}
              >
                {isKeyVisible ? "Hide" : "Reveal"}
              </button>
            </div>
          </label>

          <div class="security-note">
            Sent only to the selected provider over HTTPS. Never stored by
            this page.
          </div>

          <button class="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? "Fetching models..." : "Fetch Models"}
          </button>
        </form>

        {children}
      </div>
    </section>
  );
}