#!/usr/bin/env node

var collect, pkg, program;

program = require('commander');

pkg = require('../../package.json');

program.version(pkg.version).usage('<keywords>').description('Currently supports CoffeeScript, JSX, Jade, SCSS and Markdown.');

collect = function(val, memo) {
  memo.push(val);
  return memo;
};

program.command('build [source] [dist]').description('build dist from source').option('--tmp [dir]', 'Temporary dir').option('--ext [ext]', 'Touch this type of files only', collect, []).action(function(src, dist, opts) {
  var Core, tmp;
  Core = require('../core');
  if (opts.tmp) {
    return new Core(src, dist, opts.tmp, opts.ext).build();
  } else {
    tmp = require('tmp');
    return tmp.dir(function(err, dir) {
      return new Core(src, dist, dir, opts.ext).build();
    });
  }
});

program.parse(process.argv);

if (!program.args.length) {
  return program.help();
}
