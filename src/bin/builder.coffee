program = require 'commander'
pkg = require '../../package.json'

program
  .version(pkg.version)
  .usage('<keywords>')
  .description('Currently supports CoffeeScript, JSX, Jade, SCSS and Markdown.')


collect = (val, memo) ->
  memo.push(val)
  memo

program
  .command('build [source] [dist]')
  .description('build dist from source')
  .option('--tmp [dir]', 'Temporary dir')
  .option('--ext [ext]', 'Touch this type of files only', collect, [])
  .action (src, dist, opts) ->
    Core = require '../core'

    if opts.tmp
      new Core(src, dist, opts.tmp, opts.ext).build()
    else
      tmp = require 'tmp'
      tmp.dir (err, dir) ->
        new Core(src, dist, dir, opts.ext).build()

program.parse(process.argv)

return program.help() unless program.args.length
