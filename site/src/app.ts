import { fetchModels, getProvider, type ProviderId } from "@registry/index";

import {
  PROVIDER_LIST,
  classifyError,
  formatCreated,
  formatRawJson,
  getDefaultBaseUrl,
  getDefaultProviderId,
  getStatusLabel,
} from "./provider-ui";
import type { PlaygroundState, ResultTab, ThemeName } from "./types";

const PACKAGE_NAME = "openai-compatible-provider-registry";
const GITHUB_URL = "https://github.com/Orchardxyz/openai-compatible-provider-registry";
const THEME_STORAGE_KEY = "provider-registry-theme";

export function createApp(root: HTMLElement): void {
  const initialProviderId = getDefaultProviderId();
  const initialTheme = getInitialTheme();
  const state: PlaygroundState = {
    providerId: initialProviderId,
    baseUrl: getDefaultBaseUrl(initialProviderId),
    apiKey: "",
    isKeyVisible: false,
    theme: initialTheme,
    status: "idle",
    activeTab: "models",
    latestResult: null,
    latestError: null,
  };

  let providerQuery = "";
  applyTheme(initialTheme);

  function setProvider(providerId: ProviderId): void {
    state.providerId = providerId;
    state.baseUrl = getDefaultBaseUrl(providerId);
    state.apiKey = "";
    state.isKeyVisible = false;
    state.status = "idle";
    state.activeTab = "models";
    state.latestResult = null;
    state.latestError = null;
    render();
  }

  function setActiveTab(tab: ResultTab): void {
    state.activeTab = tab;
    render();
  }

  function setTheme(theme: ThemeName): void {
    if (state.theme === theme) {
      return;
    }

    state.theme = theme;
    applyTheme(theme);
    persistTheme(theme);
    render();
  }

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (!state.apiKey.trim()) {
      state.status = "error";
      state.latestError = {
        kind: "auth",
        title: "API key required",
        message:
          "Enter a temporary test key before sending a browser-direct request.",
      };
      render();
      return;
    }

    state.status = "loading";
    state.latestError = null;
    render();

    try {
      const result = await fetchModels(state.providerId, {
        apiKey: state.apiKey,
        baseUrl: state.baseUrl,
      });

      state.latestResult = result;
      state.status = "success";
      state.latestError = null;
      state.activeTab = "models";
      render();
    } catch (error) {
      state.status = "error";
      state.latestError = classifyError(error);
      render();
    }
  }

  function render(): void {
    const provider = getProvider(state.providerId);
    const filteredProviders = PROVIDER_LIST.filter((entry) => {
      const haystack =
        `${entry.displayName} ${entry.id} ${entry.baseUrl}`.toLowerCase();

      return haystack.includes(providerQuery.trim().toLowerCase());
    });
    root.innerHTML = `
      <div class="shell">
        <header class="topbar">
          <a class="topbar__brand" href="./" aria-label="${PACKAGE_NAME} home">
            ${PACKAGE_NAME}
          </a>
          <div class="topbar__actions">
            <div class="theme-toggle" role="group" aria-label="Theme switcher">
              ${renderThemeButton("light", "Light", state.theme)}
              ${renderThemeButton("dark", "Dark", state.theme)}
            </div>
            <a
              class="icon-link"
              href="${GITHUB_URL}"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Open GitHub repository"
              title="GitHub"
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
              <p class="eyebrow">Usage</p>
              <p class="hero__usage-note">
                Same API shape, two common runtime entry points.
              </p>
            </div>
            <div class="usage-grid">
              <article class="usage-card">
                <p class="usage-card__label">Node / Browser ESM</p>
                <pre class="usage-card__code">import { fetchModels } from "${PACKAGE_NAME}";

const result = await fetchModels("openai", { apiKey });
console.log(result.models.map((model) =&gt; model.id));</pre>
              </article>
              <article class="usage-card">
                <p class="usage-card__label">HTML Script CDN</p>
                <pre class="usage-card__code">&lt;script type="module"&gt;
  import { fetchModels } from "https://esm.sh/${PACKAGE_NAME}";

  const result = await fetchModels("openai", { apiKey });
  console.log(result.models);
&lt;/script&gt;</pre>
              </article>
            </div>
          </div>
        </section>

        <main class="workspace">
          <section class="panel panel--providers">
            <div class="panel__header">
              <h2>Supported Providers (${PROVIDER_LIST.length})</h2>
            </div>

            <label class="field">
              <span class="field__label">Filter providers</span>
              <input
                id="provider-filter"
                class="field__input"
                type="search"
                value="${escapeHtml(providerQuery)}"
                placeholder="Search by name, id, or base URL"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
              />
            </label>

            <div class="provider-list">
              ${filteredProviders
                .map((entry) => {
                  const isActive = entry.id === state.providerId;

                  return `
                    <div class="provider-card${isActive ? " provider-card--active" : ""}">
                      <button
                        type="button"
                        class="provider-card__main"
                        data-provider-id="${entry.id}"
                      >
                        <span class="provider-card__title-row">
                          <span class="provider-card__title">${escapeHtml(entry.displayName)}</span>
                          <span class="provider-card__meta">
                            <span class="provider-card__badge">${escapeHtml(entry.id)}</span>
                          </span>
                        </span>
                        <span class="provider-card__url">${escapeHtml(entry.baseUrl)}</span>
                      </button>
                      <a
                        class="provider-card__docs"
                        href="${escapeAttribute(entry.docsUrl)}"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Open docs for ${escapeAttribute(entry.displayName)}"
                        title="Open docs"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          focusable="false"
                        >
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
                  `;
                })
                .join("")}
            </div>
          </section>

          <section class="panel panel--workbench">
            <div class="stack">
              <div class="panel__header panel__header--workbench">
                <p class="panel__eyebrow">Request workbench</p>
                <div class="workbench-heading">
                  <h2>${escapeHtml(provider?.displayName ?? state.providerId)}</h2>
                  <div class="status-strip status-strip--${state.status}">
                    <span class="status-strip__dot"></span>
                    <span>${escapeHtml(getStatusLabel(state.status))}</span>
                  </div>
                </div>
              </div>

              <form id="request-form" class="request-form">
                <label class="field">
                  <span class="field__label">Provider ID</span>
                  <input
                    class="field__input field__input--mono"
                    value="${escapeHtml(state.providerId)}"
                    disabled
                  />
                </label>

                <label class="field">
                  <span class="field__label">Base URL override</span>
                  <input
                    id="base-url"
                    class="field__input field__input--mono"
                    type="url"
                    value="${escapeAttribute(state.baseUrl)}"
                    placeholder="https://api.example.com/v1/"
                    autocomplete="off"
                    autocapitalize="off"
                    spellcheck="false"
                  />
                </label>

                <label class="field">
                  <span class="field__label">Temporary API key</span>
                  <div class="key-input">
                    <input
                      id="api-key"
                      class="field__input field__input--mono"
                      type="${state.isKeyVisible ? "text" : "password"}"
                      value="${escapeAttribute(state.apiKey)}"
                      placeholder="Paste a revocable low-quota test key"
                      autocomplete="off"
                      autocapitalize="off"
                      spellcheck="false"
                    />
                    <button
                      id="key-visibility-toggle"
                      class="ghost-button"
                      type="button"
                    >
                      ${state.isKeyVisible ? "Hide" : "Reveal"}
                    </button>
                  </div>
                </label>

                <div class="security-note">
                  Sent only to the selected provider over HTTPS. Never stored by
                  this page.
                </div>

                <button
                  class="primary-button"
                  type="submit"
                  ${state.status === "loading" ? "disabled" : ""}
                >
                  ${state.status === "loading" ? "Fetching models..." : "Fetch Models"}
                </button>
              </form>

              <section class="panel panel--results">
                ${renderErrorNotice(state)}
                <div class="tab-row">
                  ${renderTabButton("models", "Normalized Models", state.activeTab)}
                  ${renderTabButton("raw", "Raw JSON", state.activeTab)}
                </div>

                <div class="results-frame">
                  ${renderTabPanel(state.activeTab, state)}
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    `;

    root.querySelectorAll<HTMLButtonElement>("[data-provider-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextProvider = button.dataset.providerId as ProviderId | undefined;

        if (nextProvider) {
          setProvider(nextProvider);
        }
      });
    });

    root.querySelector<HTMLFormElement>("#request-form")?.addEventListener("submit", (event) => {
      handleSubmit(event).catch((error: unknown) => {
        state.status = "error";
        state.latestError = classifyError(error);
        render();
      });
    });

    root.querySelector<HTMLInputElement>("#provider-filter")?.addEventListener("input", (event) => {
      providerQuery = (event.currentTarget as HTMLInputElement).value;
      render();
    });

    root.querySelector<HTMLInputElement>("#base-url")?.addEventListener("input", (event) => {
      state.baseUrl = (event.currentTarget as HTMLInputElement).value;
    });

    root.querySelector<HTMLInputElement>("#api-key")?.addEventListener("input", (event) => {
      state.apiKey = (event.currentTarget as HTMLInputElement).value;
    });

    root.querySelector<HTMLButtonElement>("#key-visibility-toggle")?.addEventListener("click", () => {
      state.isKeyVisible = !state.isKeyVisible;
      render();
    });

    root.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.tab as ResultTab | undefined;

        if (tab) {
          setActiveTab(tab);
        }
      });
    });

    root.querySelectorAll<HTMLButtonElement>("[data-theme-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const theme = button.dataset.themeChoice as ThemeName | undefined;

        if (theme) {
          setTheme(theme);
        }
      });
    });
  }

  render();
}

function renderTabButton(
  tab: ResultTab,
  label: string,
  activeTab: ResultTab,
): string {
  return `
    <button
      type="button"
      class="tab-button${tab === activeTab ? " tab-button--active" : ""}"
      data-tab="${tab}"
    >
      ${label}
    </button>
  `;
}

function renderThemeButton(
  theme: ThemeName,
  label: string,
  activeTheme: ThemeName,
): string {
  return `
    <button
      type="button"
      class="theme-toggle__button${theme === activeTheme ? " theme-toggle__button--active" : ""}"
      data-theme-choice="${theme}"
      aria-pressed="${theme === activeTheme}"
    >
      ${label}
    </button>
  `;
}

function renderTabPanel(
  tab: ResultTab,
  state: PlaygroundState,
): string {
  if (tab === "raw") {
    return `
      <pre class="code-block">${escapeHtml(formatRawJson(state.latestResult))}</pre>
    `;
  }

  if (!state.latestResult) {
    return `
      <div class="empty-state">
        <p>No model list captured yet.</p>
        <p>
          Pick a provider, paste a revocable test key, and send a manual
          browser-direct request.
        </p>
      </div>
    `;
  }

  return `
    <div class="table-wrap">
      <table class="models-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Owned By</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          ${state.latestResult.models
            .map(
              (model) => `
                <tr>
                  <td class="models-table__id">${escapeHtml(model.id)}</td>
                  <td>${escapeHtml(model.ownedBy ?? "n/a")}</td>
                  <td>${escapeHtml(formatCreated(model.created))}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderErrorNotice(state: PlaygroundState): string {
  if (!state.latestError) {
    return "";
  }

  return `
    <div class="error-notice" role="alert">
      <div class="error-notice__header">
        <h3>${escapeHtml(state.latestError.title)}</h3>
      </div>
      <p>${escapeHtml(state.latestError.message)}</p>
      ${
        state.latestError.detail
          ? `<p class="error-notice__detail">${escapeHtml(state.latestError.detail)}</p>`
          : ""
      }
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

function getInitialTheme(): ThemeName {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  } catch {
    // Ignore storage access failures and fall back to system preference.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemeName): void {
  document.documentElement.dataset.theme = theme;
}

function persistTheme(theme: ThemeName): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage access failures in restricted environments.
  }
}
