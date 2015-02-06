program = require 'commander'
Core = require '../core'

program
  .version('0.0.1')
  .usage('<keywords>')

program
  .command('build [source] [dist]')
  .description('build dist from source')
  .action (source, dist) ->
    new Core().build(source, dist)

program.parse(process.argv)

return program.help() unless program.args.length
