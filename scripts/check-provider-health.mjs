#!/usr/bin/env node

import { performance } from "node:perf_hooks";
import process from "node:process";
import { URL } from "node:url";
import { writeFile } from "node:fs/promises";
import { PROVIDERS } from "../dist/index.js";

const REQUEST_TIMEOUT_MS = 10_000;
const REPORT_PATH = "provider-health.json";
const HEALTHY_STATUSES = new Set([200, 401, 403]);
const WARNING_STATUSES = new Set([429]);

const statusCounts = {
  healthy: 0,
  warning: 0,
  unhealthy: 0,
};
const results = [];

writeLine("Provider health check");
writeLine("Build output must exist before running this script.");
writeLine("");

for (const provider of PROVIDERS) {
  const result = await checkProvider(provider);
  results.push(result);
  statusCounts[result.status] += 1;
  writeLine(formatResult(result));
}

writeLine("");
writeLine(
  `Summary: ${statusCounts.healthy} healthy, ${statusCounts.warning} warning, ${statusCounts.unhealthy} unhealthy`,
);

await writeJsonReport(results, statusCounts);
await writeStepSummary(results, statusCounts);

if (statusCounts.unhealthy > 0) {
  process.exitCode = 1;
}

async function checkProvider(provider) {
  const startedAt = performance.now();

  try {
    const url = joinUrl(provider.baseUrl, provider.modelsPath);
    const response = await globalThis.fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: globalThis.AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    return {
      id: provider.id,
      url,
      status: classifyHttpStatus(response.status),
      detail: `${response.status} ${response.statusText}`.trim(),
      elapsedMs: elapsedSince(startedAt),
    };
  } catch (error) {
    return {
      id: provider.id,
      url: safeJoinUrl(provider.baseUrl, provider.modelsPath),
      status: isTimeoutError(error) ? "warning" : "unhealthy",
      detail: describeError(error),
      elapsedMs: elapsedSince(startedAt),
    };
  }
}

function classifyHttpStatus(status) {
  if (HEALTHY_STATUSES.has(status)) {
    return "healthy";
  }

  if (WARNING_STATUSES.has(status)) {
    return "warning";
  }

  if (status === 404 || status >= 500) {
    return "unhealthy";
  }

  if (status >= 400 && status < 500) {
    return "warning";
  }

  return "unhealthy";
}

function joinUrl(baseUrl, path) {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(path, base).toString();
}

function safeJoinUrl(baseUrl, path) {
  try {
    return joinUrl(baseUrl, path);
  } catch {
    return `${baseUrl} ${path}`;
  }
}

function describeError(error) {
  if (error instanceof Error) {
    if (error.cause instanceof Error) {
      return `${error.name}: ${error.message} (${error.cause.message})`;
    }

    return `${error.name}: ${error.message}`;
  }

  return String(error);
}

function isTimeoutError(error) {
  return error instanceof Error && error.name === "TimeoutError";
}

function elapsedSince(startedAt) {
  return Math.round(performance.now() - startedAt);
}

function formatResult(result) {
  return [
    result.status.padEnd(9),
    result.id.padEnd(15),
    `${result.elapsedMs}ms`.padStart(7),
    result.detail.padEnd(24),
    result.url,
  ].join("  ");
}

async function writeJsonReport(results, summary) {
  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    results,
  };

  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
}

async function writeStepSummary(results, summary) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;

  if (!summaryPath) {
    return;
  }

  const lines = [
    "## Provider Health Check",
    "",
    `Summary: **${summary.healthy} healthy**, **${summary.warning} warning**, **${summary.unhealthy} unhealthy**`,
    "",
    "| Status | Provider | Elapsed | Detail | URL |",
    "| --- | --- | ---: | --- | --- |",
    ...results.map(
      (result) =>
        `| ${result.status} | ${result.id} | ${result.elapsedMs}ms | ${escapeMarkdownTable(result.detail)} | ${result.url} |`,
    ),
    "",
  ];

  await writeFile(summaryPath, `${lines.join("\n")}\n`, { flag: "a" });
}

function escapeMarkdownTable(value) {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function writeLine(value) {
  process.stdout.write(`${value}\n`);
}
