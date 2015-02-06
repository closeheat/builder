module.exports =
Spinner = do ->
  util = require('util')
  chalk = require('chalk')

  sequence = [
    chalk.blue('-')
    chalk.red('\\')
    chalk.yellow('|')
    chalk.green('/')
  ]

  index = 0
  timer = undefined

  start = (msg = '') ->
    single_spin_ms = 150
    index = 0

    util.print("#{sequence[index]} #{msg}")

    timer = setInterval((->
      util.print sequence[index].replace(/./g, "\r")
      index = if index < sequence.length - 1 then index + 1 else 0
      util.print sequence[index]
    ), single_spin_ms)

  stop = (stop_message = '') ->
    clearInterval timer

    # remove spinner
    util.print sequence[index].replace(/./g, "\r")
    # add a colored dash
    util.puts chalk.blue('-')

    util.puts "  #{stop_message}"

  {
    start: start
    stop: stop
  }
