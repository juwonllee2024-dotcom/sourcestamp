# Security policy

## Scope

SourceStamp is a local Chrome extension. The main risks are accidental source disclosure, unsafe links in exported receipts, and future permission creep.

The current build:

- requests only `activeTab` and `scripting`;
- has no host permissions, background service worker, storage permission, or network client;
- reads selection text only after the user opens the popup;
- allows exports only after the user reviews the visible receipt;
- accepts only `http` and `https` source URLs;
- escapes quote, title, URL, and fingerprint values in HTML output.

## Reporting a vulnerability

Please do not open a public issue for a vulnerability that could expose private page content. Use GitHub's private vulnerability reporting for this repository when available, or contact the repository owner through the account profile with:

1. a short description and impact;
2. affected version and browser;
3. reproducible steps or a minimal proof of concept;
4. a suggested mitigation, if known.

Do not include real secrets, private page contents, or personal data in a report.

## Release hygiene

Before a release, run the commands in `docs/verification.md`, review the permission list in `manifest.json`, and inspect the final diff. Releases must never contain credentials or unreviewed generated files.
