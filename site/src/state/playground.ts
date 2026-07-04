import {
  batch,
  computed,
  signal,
  type ReadonlySignal,
  type Signal
} from "@preact/signals";
import {
  fetchModels,
  type FetchProviderModelsResult,
  type ProviderId,
  type ProviderRegistryEntry
} from "@registry/index";

import {
  PROVIDER_LIST,
  classifyError,
  getDefaultBaseUrl,
  getDefaultProviderId,
  getStatusLabel,
  formatRawJson,
  type UiErrorState
} from "../lib/provider-ui";
import type { SiteMessages } from "../i18n/messages";

export type RequestStatus = "idle" | "loading" | "success" | "error";
export type ResultTab = "models" | "raw";
export type ThemeName = "light" | "dark";

const THEME_STORAGE_KEY = "provider-registry-theme";

export type PlaygroundState = {
  providerId: Signal<ProviderId>;
  providerQuery: Signal<string>;
  baseUrl: Signal<string>;
  apiKey: Signal<string>;
  isKeyVisible: Signal<boolean>;
  theme: Signal<ThemeName>;
  status: Signal<RequestStatus>;
  activeTab: Signal<ResultTab>;
  latestResult: Signal<FetchProviderModelsResult | null>;
  latestError: Signal<UiErrorState | null>;
  selectedProvider: ReadonlySignal<ProviderRegistryEntry | null>;
  filteredProviders: ReadonlySignal<readonly ProviderRegistryEntry[]>;
  statusLabel: ReadonlySignal<string>;
  rawJsonPreview: ReadonlySignal<string>;
};

function getSelectedProvider(id: ProviderId): ProviderRegistryEntry | null {
  return PROVIDER_LIST.find((entry) => entry.id === id) ?? null;
}

function readInitialTheme(): ThemeName {
  if (typeof document !== "undefined") {
    const themeFromDom = document.documentElement.dataset.theme;

    if (themeFromDom === "light" || themeFromDom === "dark") {
      return themeFromDom;
    }
  }

  if (typeof window === "undefined") {
    return "light";
  }

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
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
}

function persistTheme(theme: ThemeName): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage access failures in restricted environments.
  }
}

export function createPlaygroundState(messages: SiteMessages): PlaygroundState {
  const initialProviderId = getDefaultProviderId();
  const initialTheme = readInitialTheme();
  applyTheme(initialTheme);

  const providerId = signal<ProviderId>(initialProviderId);
  const providerQuery = signal("");
  const baseUrl = signal(getDefaultBaseUrl(initialProviderId));
  const apiKey = signal("");
  const isKeyVisible = signal(false);
  const theme = signal<ThemeName>(initialTheme);
  const status = signal<RequestStatus>("idle");
  const activeTab = signal<ResultTab>("models");
  const latestResult = signal<FetchProviderModelsResult | null>(null);
  const latestError = signal<UiErrorState | null>(null);

  const selectedProvider = computed(() => getSelectedProvider(providerId.value));
  const filteredProviders = computed(() => {
    const query = providerQuery.value.trim().toLowerCase();

    if (!query) {
      return PROVIDER_LIST;
    }

    return PROVIDER_LIST.filter((entry) => {
      const haystack =
        `${entry.displayName} ${entry.id} ${entry.baseUrl}`.toLowerCase();

      return haystack.includes(query);
    });
  });
  const statusLabel = computed(() =>
    getStatusLabel(status.value, messages.statusLabels)
  );
  const rawJsonPreview = computed(() =>
    formatRawJson(latestResult.value, messages.rawJsonEmpty)
  );

  return {
    providerId,
    providerQuery,
    baseUrl,
    apiKey,
    isKeyVisible,
    theme,
    status,
    activeTab,
    latestResult,
    latestError,
    selectedProvider,
    filteredProviders,
    statusLabel,
    rawJsonPreview
  };
}

export type PlaygroundActions = {
  setProvider: (id: ProviderId) => void;
  setActiveTab: (tab: ResultTab) => void;
  setTheme: (theme: ThemeName) => void;
  setBaseUrl: (value: string) => void;
  setApiKey: (value: string) => void;
  setProviderQuery: (value: string) => void;
  toggleKeyVisibility: () => void;
  submitRequest: () => Promise<void>;
};

export function createPlaygroundActions(
  state: PlaygroundState,
  messages: SiteMessages
): PlaygroundActions {
  function setProvider(id: ProviderId): void {
    batch(() => {
      state.providerId.value = id;
      state.baseUrl.value = getDefaultBaseUrl(id);
      state.apiKey.value = "";
      state.isKeyVisible.value = false;
      state.status.value = "idle";
      state.activeTab.value = "models";
      state.latestResult.value = null;
      state.latestError.value = null;
    });
  }

  function setActiveTab(tab: ResultTab): void {
    state.activeTab.value = tab;
  }

  function setTheme(next: ThemeName): void {
    if (state.theme.value === next) {
      return;
    }

    batch(() => {
      state.theme.value = next;
      applyTheme(next);
      persistTheme(next);
    });
  }

  function setBaseUrl(value: string): void {
    state.baseUrl.value = value;
  }

  function setApiKey(value: string): void {
    state.apiKey.value = value;
  }

  function setProviderQuery(value: string): void {
    state.providerQuery.value = value;
  }

  function toggleKeyVisibility(): void {
    state.isKeyVisible.value = !state.isKeyVisible.value;
  }

  async function submitRequest(): Promise<void> {
    if (state.status.value === "loading") {
      return;
    }

    if (!state.apiKey.value.trim()) {
      batch(() => {
        state.status.value = "error";
        state.latestError.value = {
          kind: "auth",
          title: messages.errors.authRequiredTitle,
          message: messages.errors.authRequiredMessage
        };
      });
      return;
    }

    batch(() => {
      state.status.value = "loading";
      state.latestError.value = null;
    });

    try {
      const result = await fetchModels(state.providerId.value, {
        apiKey: state.apiKey.value,
        baseUrl: state.baseUrl.value
      });

      batch(() => {
        state.latestResult.value = result;
        state.status.value = "success";
        state.latestError.value = null;
        state.activeTab.value = "models";
      });
    } catch (error) {
      batch(() => {
        state.status.value = "error";
        state.latestError.value = classifyError(error, messages.errors);
      });
    }
  }

  return {
    setProvider,
    setActiveTab,
    setTheme,
    setBaseUrl,
    setApiKey,
    setProviderQuery,
    toggleKeyVisibility,
    submitRequest
  };
}