program = require 'commander'
Core = require '../core'

program
  .version('0.3.0')
  .usage('<keywords>')
  .description('Currently supports CoffeeScript, JSX, Jade, SCSS and Markdown.')

program
  .command('build [source] [dist]')
  .description('build dist from source')
  .action (src, dist) ->
    new Core(src, dist).build()

program.parse(process.argv)

return program.help() unless program.args.length
