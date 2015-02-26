Promise = require 'bluebird'
program = require 'commander'
tmp = require 'tmp'

Core = require '../core'

program
  .version('0.3.0')
  .usage('<keywords>')
  .description('Currently supports CoffeeScript, JSX, Jade, SCSS and Markdown.')

program
  .command('build [source] [dist]')
  .description('build dist from source')
  .option('--tmp [dir]', 'Temporary dir')
  .action (src, dist, opts) ->
    if opts.tmp
      new Core(src, dist, opts.tmp).build()
    else
      tmp.dir (err, dir) ->
        new Core(src, dist, dir).build()

program.parse(process.argv)

return program.help() unless program.args.length
