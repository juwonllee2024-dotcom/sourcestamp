# Contributing to SourceStamp

Thanks for helping keep source context attached to the claims people share.

## Development

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run smoke
```

The project intentionally has no runtime dependencies or bundler. Keep the extension inspectable and preserve the least-privilege manifest.

## Pull requests

- explain the user problem and the smallest behavior change;
- add or update a test before changing receipt behavior;
- do not add analytics, remote calls, storage, or permissions without a security and privacy explanation;
- include manual reproduction steps for popup changes;
- run `git diff --check` before opening the pull request.

## Commit messages

Use a short imperative subject, for example `Add context-menu capture`. Keep unrelated cleanup out of feature changes.
