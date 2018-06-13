'use strict'

const tty = require('tty')

exports.last = -1
exports.colors = [31, 32, 33, 34, 35, 36]

exports.next = () => {
  return tty.isatty(process.stderr.fd) ? exports.colors[Date.now() % exports.colors.length] : null
}

exports.colorize = (color, text) => {
  if (!color) {
    return text
  }

  return `\u001b[${color};1m${text}\u001b[0m`
}
