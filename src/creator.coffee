module.exports =
class Creator
  create: (name) ->
    url = 'https://api.github.com/search/repositories?sort=stars&order=desc&q=closeheat'

    request = require 'request'

    Spinner = require './spinner'
    Spinner.start('Creating a directory')

    request {
      method: 'GET'
      headers: 'User-Agent': 'closeheat'
      url: url
    }, (error, response, body) ->
      chalk = require('chalk')
      util = require('util')

      Spinner.stop("App with name \"#{chalk.yellow(name)}\" is ready.")

      start_cmd = chalk.yellow("cd #{name} && closeheat server")
      util.puts "  Run \"#{start_cmd}\" to start it."

      process.exit(0)
