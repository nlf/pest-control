'use strict'

const colors = require('./colors')

const createLogger = module.exports = (name, options) => {
  const logger = new PestControl(name, options)
  return Object.assign(logger.log.bind(logger), {
    child: logger.child.bind(logger),
    log: logger.log.bind(logger),
    start: logger.start.bind(logger),
    finish: logger.finish.bind(logger),
    count: logger.count.bind(logger)
  })
}

class PestControl {
  constructor (name = 'debug', options = {}) {
    this.name = options.parent ? `${options.parent}:${name}` : name

    if (!process.env.DEBUG) {
      this.enabled = false
    } else {
      const allowed = new RegExp(`^${process.env.DEBUG.replace(/\*/g, '.*')}$`)
      this.enabled = allowed.test(this.name)
    }

    this.color = colors.next()
    const fancyName = colors.colorize(this.color, name)
    this.prefix = options.prefix ? `${options.prefix}:${fancyName}` : fancyName

    if (this.enabled) {
      this.timers = new Map()
      this.counters = new Map()
    }
  }

  child (name) {
    return createLogger(name, { parent: this.name, color: this.color, prefix: this.prefix })
  }

  log (...data) {
    if (this.enabled) {
      console.error(' ', this.prefix, ...data)
    }
  }

  start (label) {
    if (this.enabled) {
      this.timers.set(label, Date.now())
      console.error(' ', this.prefix, label, colors.colorize(this.color, 'start'))
    }
  }

  finish (label) {
    if (this.enabled && this.timers.has(label)) {
      const delay = Date.now() - this.timers.get(label)
      this.timers.delete(label)
      console.error(' ', this.prefix, label, colors.colorize(this.color, `+${delay}ms`))
    }
  }

  count (label) {
    const count = (this.counters.has(label) ? this.counters.get(label) : 0) + 1
    this.counters.set(label, count)
    console.error(' ', this.prefix, label, colors.colorize(this.color, `#${count}`))
  }
}
