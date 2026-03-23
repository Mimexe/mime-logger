![Logo](https://i.imgur.com/IYzEwxY.png)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js CI](https://github.com/Mimexe/mime-logger/actions/workflows/node.js.yml/badge.svg)](https://github.com/Mimexe/mime-logger/actions/workflows/node.js.yml)

# Mime Logger

A simple logger for Mime, used by all his projects.

## Installation

You need ES6 support to use this package.

Install mime-logger with your package manager of your choice.

```bash
  npm install mime-logger
```

```bash
  yarn add mime-logger
```

```bash
  pnpm install mime-logger
```

## Documentation

Online documentation can be found [here](https://docs.mimedev.fr/docs/mime-logger/installation/)

## Simple usage

```typescript
import Logger from "mime-logger"; // For ESM
const logger = new Logger();
logger.info("Hello, world!");
```

```javascript
const { MimeLogger } = require("mime-logger"); // For CommonJS
const logger = new MimeLogger();
logger.info("Hello, world!");
```

## Development & Publishing

### Prerequisites

This project uses [Bun](https://bun.sh/) as its package manager and build tool. Make sure you have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Building the Project

To build the project:

```bash
bun run build
```

This will:
- Clean the `dist` directory
- Compile TypeScript to JavaScript (ESM and CJS)
- Generate type definitions

### Running Tests

```bash
bun test
```

### Publishing to npm

The project is configured to automatically build before publishing. To publish a new version:

1. **Update the version** in `package.json`:
   ```bash
   # For patch releases (bug fixes)
   npm version patch

   # For minor releases (new features, backwards compatible)
   npm version minor

   # For major releases (breaking changes)
   npm version major
   ```

2. **Publish to npm**:
   ```bash
   npm publish
   ```

   The `prepublishOnly` script will automatically run `bun run build` before publishing.

3. **Push the version tag**:
   ```bash
   git push && git push --tags
   ```

### Publishing Checklist

Before publishing, ensure:
- [ ] All tests pass (`bun test`)
- [ ] The build succeeds (`bun run build`)
- [ ] GitHub Actions CI is passing
- [ ] CHANGELOG.md is updated (if applicable)
- [ ] Version number follows [semantic versioning](https://semver.org/)

## License

[MIT](https://choosealicense.com/licenses/mit/)
