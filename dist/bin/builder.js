#!/usr/bin/env node

var Core, program;

program = require('commander');

Core = require('../core');

program.version('0.1.0').usage('<keywords>').description('Currently supports CoffeeScript, Jade, SCSS and Markdown.');

program.command('build [source] [dist]').description('build dist from source').action(function(src, dist) {
  return new Core(src, dist).build();
});

program.parse(process.argv);

if (!program.args.length) {
  return program.help();
}
