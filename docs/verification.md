# Verification record

Run date: 2026-08-29 PDT / 2026-08-30 UTC

## Fresh commands

| Command | Result |
| --- | --- |
| `npm ci` | pass; 1 package audited, 0 vulnerabilities |
| `npm test` | pass; 5 tests |
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npm run build` | pass; 5 extension files copied to `dist/` |
| `npm run smoke` | pass |
| `npm audit --omit=dev --audit-level=high` | pass; 0 vulnerabilities |
| `git diff --check` | pass |

## End-to-end data record

The smoke run passed this input through the real receipt pipeline:

- quote: `A source should travel with the claim.`
- title: `Example`
- URL: `https://example.com/`
- capturedAt: `2026-08-29T17:00:00.000Z`
- output: Markdown receipt containing the quote, source link, capture time, and `sha256:540da7c152315d1cf717baae1666e0a6ee4f143e4bb217e3c127c423767389e2`

No browser account, page upload, or external API was used during verification. Manual browser loading is documented in the README; the extension has no network permission and no background service worker.
