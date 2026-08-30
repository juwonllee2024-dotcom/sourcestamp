const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

function asText(value) {
  return typeof value === "string" ? value : String(value ?? "");
}

export function normalizeQuote(value) {
  return asText(value)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[^\S\n]+/g, " ").trim())
    .join("\n")
    .trim();
}

function normalizeTitle(value) {
  return asText(value).replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim() || "(untitled page)";
}

function normalizeCapturedAt(value) {
  if (value === undefined || value === null || value === "") {
    return new Date().toISOString();
  }

  const date = new Date(asText(value));
  if (Number.isNaN(date.getTime())) {
    throw new TypeError("capturedAt must be a valid date");
  }
  return date.toISOString();
}

export function safeWebUrl(value) {
  const raw = asText(value).trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    return HTTP_PROTOCOLS.has(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

export function createReceipt({ quote, title, url, capturedAt } = {}) {
  const normalizedQuote = normalizeQuote(quote);
  if (!normalizedQuote) {
    throw new TypeError("quote must not be empty");
  }

  const normalizedUrl = safeWebUrl(url);
  if (!normalizedUrl) {
    throw new TypeError("url must be an http(s) URL");
  }

  return {
    version: 1,
    quote: normalizedQuote,
    title: normalizeTitle(title),
    url: normalizedUrl,
    capturedAt: normalizeCapturedAt(capturedAt),
  };
}

export function canonicalPayload(receipt) {
  return JSON.stringify({
    version: 1,
    quote: normalizeQuote(receipt?.quote),
    title: normalizeTitle(receipt?.title),
    url: safeWebUrl(receipt?.url),
    capturedAt: normalizeCapturedAt(receipt?.capturedAt),
  });
}

export async function sha256Hex(value) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto is unavailable");
  }

  const bytes = new TextEncoder().encode(asText(value));
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function withFingerprint(receipt) {
  const fingerprint = await sha256Hex(canonicalPayload(receipt));
  return { ...receipt, fingerprint: `sha256:${fingerprint}` };
}

function markdownText(value) {
  return asText(value).replaceAll("\\", "\\\\").replaceAll("[", "\\[").replaceAll("]", "\\]");
}

function markdownQuote(value) {
  return normalizeQuote(value)
    .split("\n")
    .map((line) => `> ${line || ">"}`)
    .join("\n");
}

export function toMarkdown(receipt) {
  const sourceUrl = safeWebUrl(receipt?.url);
  const title = markdownText(receipt?.title || "(untitled page)");
  const sourceLine = sourceUrl ? `— [${title}](<${sourceUrl}>)` : `— ${title}`;
  const fingerprint = asText(receipt?.fingerprint) || "sha256:pending";

  return [
    markdownQuote(receipt?.quote),
    "",
    sourceLine,
    `Captured: ${asText(receipt?.capturedAt)}`,
    `Fingerprint: \`${fingerprint}\``,
    "",
    "<!-- Generated locally by SourceStamp. No source content was uploaded. -->",
  ].join("\n");
}

function escapeHtml(value) {
  return asText(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export function toHtml(receipt) {
  const sourceUrl = safeWebUrl(receipt?.url);
  const quote = normalizeQuote(receipt?.quote)
    .split("\n")
    .map(escapeHtml)
    .join("<br>");
  const title = escapeHtml(receipt?.title || "(untitled page)");
  const source = sourceUrl
    ? `<a href="${escapeHtml(sourceUrl)}" rel="noreferrer noopener">${title}</a>`
    : title;
  const fingerprint = escapeHtml(receipt?.fingerprint || "sha256:pending");

  return [
    '<article data-sourcestamp="1">',
    `  <blockquote>${quote}</blockquote>`,
    `  <p>— ${source}</p>`,
    `  <p><small>Captured: ${escapeHtml(receipt?.capturedAt)}</small></p>`,
    `  <p><small>Fingerprint: <code>${fingerprint}</code></small></p>`,
    "</article>",
  ].join("\n");
}

export { escapeHtml };
