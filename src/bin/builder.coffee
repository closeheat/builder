program = require 'commander'
pkg = require '../../package.json'

program
  .version(pkg.version)
  .usage('<keywords>')
  .description('Currently supports CoffeeScript, JSX, Jade, SCSS and Markdown.')

program
  .command('build [source] [dist]')
  .description('build dist from source')
  .option('--tmp [dir]', 'Temporary dir')
  .action (src, dist, opts) ->
    Core = require '../core'

    if opts.tmp
      new Core(src, dist, opts.tmp).build()
    else
      tmp = require 'tmp'
      tmp.dir (err, dir) ->
        new Core(src, dist, dir).build()

program.parse(process.argv)

return program.help() unless program.args.length
