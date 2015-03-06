#!/usr/bin/env node

var pkg, program;

program = require('commander');

pkg = require('../../package.json');

program.version(pkg.version).usage('<keywords>').description('Currently supports CoffeeScript, JSX, Jade, SCSS and Markdown.');

program.command('build [source] [dist]').description('build dist from source').option('--tmp [dir]', 'Temporary dir').action(function(src, dist, opts) {
  var Core, tmp;
  Core = require('../core');
  if (opts.tmp) {
    return new Core(src, dist, opts.tmp).build();
  } else {
    tmp = require('tmp');
    return tmp.dir(function(err, dir) {
      return new Core(src, dist, dir).build();
    });
  }
});

program.parse(process.argv);

if (!program.args.length) {
  return program.help();
}
