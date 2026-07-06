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
  pageTitle: "Provider Registry 调试页",
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
  heroUsageNote: "同一套 API，两种常见接入方式。",
  usageCardEsmLabel: "Node / 浏览器 ESM",
  usageCardCdnLabel: "HTML Script CDN",
  supportedProviders: "支持的服务商",
  filterLabel: "筛选服务商",
  filterPlaceholder: "按名称、ID 或 Base URL 搜索",
  docsAriaLabelPrefix: "打开 ",
  docsAriaLabelSuffix: " 文档",
  docsTitle: "打开文档",
  workbenchEyebrow: "调试面板",
  providerIdLabel: "Provider ID",
  baseUrlLabel: "自定义 Base URL",
  baseUrlPlaceholder: "https://api.example.com/v1/",
  apiKeyLabel: "临时 API key",
  apiKeyPlaceholder: "粘贴一个可随时撤销、额度较低的测试 key",
  securityNote: "仅会通过 HTTPS 发送给当前服务商，本页面不会存储你的 key。",
  fetchButton: "获取模型列表",
  fetchButtonLoading: "正在获取模型...",
  revealButton: "显示 key",
  hideButton: "隐藏 key",
  statusLabels: {
    idle: "等待手动发起请求",
    loading: "请求进行中",
    success: "模型已加载",
    error: "请求异常"
  },
  tabModels: "标准化结果",
  tabRaw: "原始 JSON",
  emptyTitle: "还没有获取到模型列表。",
  emptyBody: "选择一个服务商，填入可撤销的测试 key，然后手动发起一次浏览器直连请求。",
  tableId: "ID",
  tableOwnedBy: "所属方",
  tableCreated: "创建时间",
  rawJsonEmpty: "还没有响应内容。",
  errors: {
    corsTitle: "浏览器请求被拦截或中断",
    corsMessage:
      "请求没有在浏览器里顺利完成。常见原因包括 CORS 限制、本地网络中断，或浏览器扩展、代理带来的干扰。",
    authTitle: "认证未通过",
    authMessage: "服务商已经返回响应，但当前 key 被拒绝，或没有读取模型列表的权限。",
    responseTitle: "响应格式不是预期的 /models 结果",
    responseMessage:
      "接口已经返回内容，但结果不是这个调试页预期的 OpenAI 风格模型列表格式。",
    networkTitle: "无法连接到服务商",
    networkMessage:
      "浏览器没能完成这次请求。请检查当前 Base URL 配置，以及本地网络环境是否正常。",
    unknownTitle: "请求失败",
    unknownMessage: "这次请求没有成功完成。请先查看下方详情，再对照服务商文档继续排查。",
    nonErrorMessage: "请求过程中抛出了一个不符合 Error 结构的异常值。",
    authRequiredTitle: "请先填写 API key",
    authRequiredMessage: "发起浏览器直连请求前，请先输入一个临时测试 key。"
  }
};

export const SITE_MESSAGES: Record<SiteLocale, SiteMessages> = {
  en: enMessages,
  "zh-CN": zhCnMessages
};

export function getMessages(locale: SiteLocale): SiteMessages {
  return SITE_MESSAGES[locale];
}
