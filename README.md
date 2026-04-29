![Logo](https://i.imgur.com/IYzEwxY.png)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js CI](https://github.com/Mimexe/mime-logger/actions/workflows/node.js.yml/badge.svg)](https://github.com/Mimexe/mime-logger/actions/workflows/node.js.yml)

# Mime Logger

> **Note:** "Mime" refers to my username (weird I know), not the [MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) internet standard.

A simple logger for Node.js, used by all Mime's projects.

## Installation

```bash
npm install mime-logger
```

```bash
pnpm add mime-logger
```

```bash
yarn add mime-logger
```

## Usage

```typescript
import Logger from "mime-logger"; // ESM default import
const logger = new Logger();
logger.info("Hello, world!");
```

```typescript
import { MimeLogger } from "mime-logger"; // ESM named import
const logger = new MimeLogger("app");
logger.info("Hello, world!");
```

```javascript
const { MimeLogger } = require("mime-logger"); // CommonJS
const logger = new MimeLogger();
logger.info("Hello, world!");
```

## Documentation

Online documentation: [docs.mimedev.fr](https://docs.mimedev.fr/en/docs/mime-logger)

## Development

**Requirements:** Node.js, pnpm

```bash
pnpm install       # install dependencies
pnpm run build     # build ESM + CJS + types
pnpm test          # run tests
```

### Publishing

1. Bump version: `npm version patch|minor|major`
2. Publish: `pnpm publish` — runs `prepublishOnly` (build) automatically
3. Push tags: `git push && git push --tags`

**Pre-publish checklist:**
- [ ] Tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm run build`)
- [ ] CI passing
- [ ] Version follows [semver](https://semver.org/)

## License

[MIT](https://choosealicense.com/licenses/mit/)
