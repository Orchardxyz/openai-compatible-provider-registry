import type { SiteLocale } from "./config";

export type ErrorCopy = {
  corsTitle: string;
  corsMessage: string;
  authTitle: string;
  authMessage: string;
  responseTitle: string;
  responseMessage: string;
  networkTitle: string;
  networkMessage: string;
  unknownTitle: string;
  unknownMessage: string;
  nonErrorMessage: string;
  authRequiredTitle: string;
  authRequiredMessage: string;
};

export type StatusLabels = {
  idle: string;
  loading: string;
  success: string;
  error: string;
};

export type SiteMessages = {
  pageTitle: string;
  brandAriaLabel: string;
  githubAriaLabel: string;
  githubTitle: string;
  languageSwitcherAriaLabel: string;
  languageEn: string;
  languageZh: string;
  themeSwitcherAriaLabel: string;
  themeLight: string;
  themeDark: string;
  heroEyebrow: string;
  heroUsageNote: string;
  usageCardEsmLabel: string;
  usageCardCdnLabel: string;
  supportedProviders: string;
  filterLabel: string;
  filterPlaceholder: string;
  docsAriaLabelPrefix: string;
  docsAriaLabelSuffix: string;
  docsTitle: string;
  workbenchEyebrow: string;
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
  statusLabels: StatusLabels;
  tabModels: string;
  tabRaw: string;
  emptyTitle: string;
  emptyBody: string;
  tableId: string;
  tableOwnedBy: string;
  tableCreated: string;
  rawJsonEmpty: string;
  errors: ErrorCopy;
};

const enMessages: SiteMessages = {
  pageTitle: "Provider Registry Playground",
  brandAriaLabel: "openai-compatible-provider-registry home",
  githubAriaLabel: "Open GitHub repository",
  githubTitle: "GitHub",
  languageSwitcherAriaLabel: "Language switcher",
  languageEn: "EN",
  languageZh: "中文",
  themeSwitcherAriaLabel: "Theme switcher",
  themeLight: "Light",
  themeDark: "Dark",
  heroEyebrow: "Usage",
  heroUsageNote: "Same API shape, two common runtime entry points.",
  usageCardEsmLabel: "Node / Browser ESM",
  usageCardCdnLabel: "HTML Script CDN",
  supportedProviders: "Supported Providers",
  filterLabel: "Filter providers",
  filterPlaceholder: "Search by name, id, or base URL",
  docsAriaLabelPrefix: "Open docs for ",
  docsAriaLabelSuffix: "",
  docsTitle: "Open docs",
  workbenchEyebrow: "Request workbench",
  providerIdLabel: "Provider ID",
  baseUrlLabel: "Base URL override",
  baseUrlPlaceholder: "https://api.example.com/v1/",
  apiKeyLabel: "Temporary API key",
  apiKeyPlaceholder: "Paste a revocable low-quota test key",
  securityNote:
    "Sent only to the selected provider over HTTPS. Never stored by this page.",
  fetchButton: "Fetch Models",
  fetchButtonLoading: "Fetching models...",
  revealButton: "Reveal",
  hideButton: "Hide",
  statusLabels: {
    idle: "Ready for a manual request",
    loading: "Request in flight",
    success: "Models loaded",
    error: "Needs attention"
  },
  tabModels: "Normalized Models",
  tabRaw: "Raw JSON",
  emptyTitle: "No model list captured yet.",
  emptyBody:
    "Pick a provider, paste a revocable test key, and send a manual browser-direct request.",
  tableId: "ID",
  tableOwnedBy: "Owned By",
  tableCreated: "Created",
  rawJsonEmpty: "No response captured yet.",
  errors: {
    corsTitle: "Browser request blocked or interrupted",
    corsMessage:
      "The request did not complete in the browser. This often means a CORS policy block, a local network interruption, or an extension/proxy conflict.",
    authTitle: "Authentication was rejected",
    authMessage:
      "The provider responded, but the supplied key was rejected or does not have access to list models.",
    responseTitle: "Response shape did not match the expected /models format",
    responseMessage:
      "The endpoint answered, but the payload was not the OpenAI-style model list shape this playground expects.",
    networkTitle: "The request could not reach the provider",
    networkMessage:
      "The browser could not complete the request. Check the selected base URL and local network environment.",
    unknownTitle: "The request failed",
    unknownMessage:
      "The request did not complete successfully. Review the detail below and compare with the provider docs.",
    nonErrorMessage:
      "An unexpected non-Error value was thrown during the request.",
    authRequiredTitle: "API key required",
    authRequiredMessage:
      "Enter a temporary test key before sending a browser-direct request."
  }
};

const zhCnMessages: SiteMessages = {
  pageTitle: "Provider Registry Playground",
  brandAriaLabel: "openai-compatible-provider-registry 主页",
  githubAriaLabel: "打开 GitHub 仓库",
  githubTitle: "GitHub",
  languageSwitcherAriaLabel: "语言切换",
  languageEn: "EN",
  languageZh: "中文",
  themeSwitcherAriaLabel: "主题切换",
  themeLight: "浅色",
  themeDark: "深色",
  heroEyebrow: "用法",
  heroUsageNote: "相同的 API 形态，两种常见运行时入口。",
  usageCardEsmLabel: "Node / 浏览器 ESM",
  usageCardCdnLabel: "HTML Script CDN",
  supportedProviders: "支持的提供商",
  filterLabel: "筛选提供商",
  filterPlaceholder: "按名称、ID 或 Base URL 搜索",
  docsAriaLabelPrefix: "打开 ",
  docsAriaLabelSuffix: " 的文档",
  docsTitle: "打开文档",
  workbenchEyebrow: "请求工作台",
  providerIdLabel: "Provider ID",
  baseUrlLabel: "Base URL 覆盖",
  baseUrlPlaceholder: "https://api.example.com/v1/",
  apiKeyLabel: "临时 API key",
  apiKeyPlaceholder: "粘贴一个可撤销的低额度测试 key",
  securityNote: "仅通过 HTTPS 发送到所选提供商，本页面不会存储。",
  fetchButton: "获取模型列表",
  fetchButtonLoading: "正在获取模型...",
  revealButton: "显示",
  hideButton: "隐藏",
  statusLabels: {
    idle: "可发起手动请求",
    loading: "请求进行中",
    success: "模型已加载",
    error: "需要关注"
  },
  tabModels: "标准化模型",
  tabRaw: "原始 JSON",
  emptyTitle: "尚未获取到模型列表。",
  emptyBody: "选择一个提供商，粘贴一个可撤销的测试 key，发起一次手动浏览器直连请求。",
  tableId: "ID",
  tableOwnedBy: "归属",
  tableCreated: "创建时间",
  rawJsonEmpty: "尚未捕获到响应。",
  errors: {
    corsTitle: "浏览器请求被阻止或中断",
    corsMessage:
      "请求未在浏览器中完成。通常意味着 CORS 策略拦截、本地网络中断，或浏览器扩展/代理冲突。",
    authTitle: "认证被拒绝",
    authMessage: "提供商已响应，但提供的 key 被拒绝或没有列出模型的权限。",
    responseTitle: "响应结构不符合预期的 /models 格式",
    responseMessage:
      "端点已应答，但返回内容不是本 playground 期望的 OpenAI 风格模型列表结构。",
    networkTitle: "无法连接到该提供商",
    networkMessage:
      "浏览器无法完成该请求。请检查所选的 Base URL 和本地网络环境。",
    unknownTitle: "请求失败",
    unknownMessage: "请求未成功完成。请查看下方详情并对照提供商文档。",
    nonErrorMessage: "请求过程中抛出了一个非 Error 类型的异常值。",
    authRequiredTitle: "需要 API key",
    authRequiredMessage: "在发起浏览器直连请求前，请输入一个临时测试 key。"
  }
};

export const SITE_MESSAGES: Record<SiteLocale, SiteMessages> = {
  en: enMessages,
  "zh-CN": zhCnMessages
};

export function getMessages(locale: SiteLocale): SiteMessages {
  return SITE_MESSAGES[locale];
}