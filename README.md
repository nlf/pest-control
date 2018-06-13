## Pest Control

A (hopefully) useful debug logger designed as a drop-in replacement for [debug](https://github.com/visionmedia/debug) with some extra bells and whistles.

### Similarities

As mentioned above, pest control can be used as a drop-in replacement for debug. If you use debug and you like it, you probably have no reason to change.

### Differences

Pest control adds a few extra features:

#### `logger.log()`

A simple alias to the top-level function to print logs.

#### `logger.child(name)`

Create a child of `logger` with the given name. This is useful for things like creating a logger in your main module and passing it to sub modules, these sub modules can than use a child of the original logger rather than creating their own with no record of inheritance.

For example:

```js
const pc = require('pest-control')
const logger = pc('my-module')

logger('loading child')
require('./child')(logger)
```

Meanwhile in `child.js`:

```js
module.exports = function (parentLogger) {
  const logger = parentLogger.child('child')
  logger('child loaded')
}
```

Which would yield something like the following output (assuming, of course, `DEBUG` is set to `my-module*`):

```
  my-module loading child
  my-module:child child loaded
```

#### `logger.start(label)`

Start an explicit timer with a label, this stores a timestamp and also immediately prints a start message, for example:

```js
const logger = pc('my-module')

logger.start('loading dependencies')
```

Which would print:

```
  my-module loading dependencies start
```

#### `logger.finish(label)`

End an explicit timer. If the given label has not been passed to `start()` this is a no-op.

```js
const logger = pc('my-module')

logger.start('loading')
setTimeout(() => {
  logger.finish('loading')
}, 100)
```

Which would print:

```
  my-module loading start
  my-module loading +100ms
```

#### `logger.count(label)`

Count how many times a thing happens, for example:

```js
const logger = pc('my-module')

logger.count('did something')
logger.count('did something')
logger.count('did something')
```

Which would print something like:

```
  my-module did something #1
  my-module did something #2
  my-module did something #3
```
