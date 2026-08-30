import test from "node:test";
import assert from "node:assert/strict";

import {
  createReceipt,
  sha256Hex,
  toHtml,
  toMarkdown,
} from "../src/receipt.mjs";

const capturedAt = "2026-08-29T17:00:00.000Z";

test("creates a normalized, portable receipt from a web selection", () => {
  const receipt = createReceipt({
    quote: "  First line\r\nSecond line  ",
    title: "  Example page  ",
    url: "https://example.com/article#part",
    capturedAt,
  });

  assert.deepEqual(receipt, {
    version: 1,
    quote: "First line\nSecond line",
    title: "Example page",
    url: "https://example.com/article#part",
    capturedAt,
  });
});

test("rejects empty selections and unsafe source URLs", () => {
  assert.throws(
    () => createReceipt({ quote: "   ", title: "Page", url: "https://example.com", capturedAt }),
    /quote/i,
  );
  assert.throws(
    () => createReceipt({ quote: "text", title: "Page", url: "javascript:alert(1)", capturedAt }),
    /http/i,
  );
});

test("renders Markdown as a block quote with a source and fingerprint", () => {
  const receipt = createReceipt({
    quote: "A useful sentence",
    title: "Example page",
    url: "https://example.com/article",
    capturedAt,
  });
  const markdown = toMarkdown({ ...receipt, fingerprint: "sha256:abc123" });

  assert.match(markdown, /^> A useful sentence/m);
  assert.match(markdown, /\[Example page\]\(<https:\/\/example\.com\/article>\)/);
  assert.match(markdown, /Fingerprint: `sha256:abc123`/);
});

test("escapes untrusted content in HTML output", () => {
  const receipt = createReceipt({
    quote: "<script>alert(1)</script>",
    title: "A & B",
    url: "https://example.com/?q=1&x=2",
    capturedAt,
  });
  const html = toHtml({ ...receipt, fingerprint: "sha256:abc123" });

  assert.doesNotMatch(html, /<script>/i);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /A &amp; B/);
});

test("hashes the canonical receipt payload deterministically", async () => {
  assert.equal(
    await sha256Hex("hello"),
    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  );
});
