![Logo](https://i.imgur.com/IYzEwxY.png)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js CI](https://github.com/Mimexe/mime-logger/actions/workflows/node.js.yml/badge.svg)](https://github.com/Mimexe/mime-logger/actions/workflows/node.js.yml)

# Mime Logger

A simple logger for Mime, used by all his projects.

## Installation

Install mime-logger with your package manager of your choice.

```bash
  npm install Mimexe/mime-logger
```

```bash
  yarn add Mimexe/mime-logger
```

```bash
  pnpm install Mimexe/mime-logger
```

## Documentation

Online documentation can be found [here](https://docs.mimedev.fr/docs/category/mime-logger)

## Usage/Examples

```javascript
import MimeLogger from "mime-logger";
const logger = new MimeLogger("MyApp"); // With a name
const logger = new MimeLogger(); // Without a name
```

```javascript
const myVariable = "world!";
logger.info("Hello %s", myVariable);
logger.warn("Hello %s", myVariable);
logger.error("Hello %s", myVariable);
logger.write("Hello %s", myVariable); // not recommended
```

### Childrens

```javascript
const child = logger.child("API");
child.info("New post with id '%s'", post.id);
child.error("Database error %s", e.stack);
```

### Development mode

```javascript
logger.setDevelopment(true);
logger.debug("A debug log"); // This log
logger.setDevelopment(false);
logger.debug("A debug log"); // This doesn't log
```

### Promises write

Use promises write to write based on promises, when i promise resolve it writes the result.

```javascript
import axios from "axios";
logger.promisesWrite(
  "Users count: %p - Posts: %p",
  new Promise((resolve) => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => e.message);
  }),
  new Promise((resolve) => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => e.message);
  })
);
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
