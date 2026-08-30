import {
  createReceipt,
  toHtml,
  toMarkdown,
  withFingerprint,
} from "./receipt.mjs";

const quoteInput = document.querySelector("#quote");
const titleInput = document.querySelector("#title");
const urlInput = document.querySelector("#url");
const status = document.querySelector("#status");
const badge = document.querySelector("#badge");
const previewQuote = document.querySelector("#preview-quote");
const previewSource = document.querySelector("#preview-source");
const previewTime = document.querySelector("#preview-time");
const previewFingerprint = document.querySelector("#preview-fingerprint");
const refreshButton = document.querySelector("#refresh");
const exportButtons = [
  document.querySelector("#copy-markdown"),
  document.querySelector("#copy-html"),
  document.querySelector("#download"),
];

let activeTabId;
let currentReceipt;
let updateSequence = 0;

function setStatus(message, kind = "") {
  status.textContent = message;
  status.className = `status ${kind}`.trim();
}

function setExportState(enabled) {
  for (const button of exportButtons) button.disabled = !enabled;
}

function readSelection() {
  return {
    quote: window.getSelection()?.toString() || "",
    title: document.title || "",
    url: window.location.href || "",
  };
}

async function inspectActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("No active tab is available");
  activeTabId = tab.id;

  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: readSelection,
    });
    return result?.result || { quote: "", title: tab.title || "", url: tab.url || "" };
  } catch {
    return { quote: "", title: tab.title || "", url: tab.url || "" };
  }
}

async function makeReceipt() {
  const receipt = createReceipt({
    quote: quoteInput.value,
    title: titleInput.value,
    url: urlInput.value,
    capturedAt: previewTime.dataset.iso || new Date().toISOString(),
  });
  return withFingerprint(receipt);
}

function renderReceipt(receipt) {
  currentReceipt = receipt;
  previewQuote.textContent = receipt.quote;
  previewSource.textContent = receipt.title;
  previewSource.href = receipt.url;
  previewTime.textContent = receipt.capturedAt;
  previewFingerprint.textContent = receipt.fingerprint;
  badge.textContent = "Ready to export";
  badge.classList.add("ready");
  setExportState(true);
}

async function updatePreview() {
  const sequence = ++updateSequence;
  currentReceipt = undefined;
  setExportState(false);
  badge.textContent = "Checking fields";
  badge.classList.remove("ready");

  try {
    const receipt = await makeReceipt();
    if (sequence !== updateSequence) return;
    renderReceipt(receipt);
    setStatus("Receipt is local-only. Choose an export when you are ready.");
  } catch (error) {
    if (sequence !== updateSequence) return;
    setStatus(error.message, "error");
    previewQuote.textContent = quoteInput.value.trim() || "Select a sentence to see the receipt.";
  }
}

async function refreshSelection() {
  refreshButton.disabled = true;
  setStatus("Reading the active tab…");
  try {
    const selection = await inspectActiveTab();
    quoteInput.value = selection.quote;
    titleInput.value = selection.title;
    urlInput.value = selection.url;
    previewTime.dataset.iso = new Date().toISOString();
    await updatePreview();
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    refreshButton.disabled = false;
  }
}

async function ensureReceipt() {
  if (!currentReceipt) await updatePreview();
  if (!currentReceipt) throw new Error("Add a quote and an http(s) source URL first");
  return currentReceipt;
}

async function copyMarkdown() {
  const receipt = await ensureReceipt();
  await navigator.clipboard.writeText(toMarkdown(receipt));
  setStatus("Markdown copied with the source attached.", "success");
}

async function copyHtml() {
  const receipt = await ensureReceipt();
  const markdown = toMarkdown(receipt);
  const html = toHtml(receipt);
  if (navigator.clipboard.write && window.ClipboardItem) {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([markdown], { type: "text/plain" }),
      }),
    ]);
  } else {
    await navigator.clipboard.writeText(markdown);
  }
  setStatus("Rich text copied with a plain-text fallback.", "success");
}

async function downloadMarkdown() {
  const receipt = await ensureReceipt();
  const blob = new Blob([toMarkdown(receipt)], { type: "text/markdown;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sourcestamp-receipt.md";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
  setStatus("Receipt downloaded. It was never uploaded.", "success");
}

for (const input of [quoteInput, titleInput, urlInput]) {
  input.addEventListener("input", () => {
    previewTime.dataset.iso = previewTime.dataset.iso || new Date().toISOString();
    updatePreview();
  });
}

refreshButton.addEventListener("click", refreshSelection);
exportButtons[0].addEventListener("click", () => copyMarkdown().catch((error) => setStatus(error.message, "error")));
exportButtons[1].addEventListener("click", () => copyHtml().catch((error) => setStatus(error.message, "error")));
exportButtons[2].addEventListener("click", () => downloadMarkdown().catch((error) => setStatus(error.message, "error")));

refreshSelection();
