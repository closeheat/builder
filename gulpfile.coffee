gulp = require 'gulp'
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
shell = require 'gulp-shell'
fs = require 'fs'
mocha = require 'gulp-mocha'
watch = require 'gulp-watch'
replace = require 'gulp-replace'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
insert = require 'gulp-insert'
acorn = require 'acorn'

gulp.task 'default', ['coffee']

gulp.task 'watch', ->
  gulp.watch('./src/**/*.coffee', ['default'])

gulp.task 'coffee', ->
  gulp
    .src('./src/*.coffee')
    .pipe(coffee(bare: true)
    .on('error', gutil.log))
    .pipe gulp.dest('./dist/')

  gulp
    .src('./src/bin/closeheat.coffee')
    .pipe(coffee(bare: true)
    .on('error', gutil.log))
    .pipe(insert.prepend('#!/usr/bin/env node\n\n'))
    .pipe gulp.dest('./dist/bin/')

gulp.task 'requires', ->
  fs.readFile './dist/creator.js', 'utf-8', (err, data) ->
    ast = acorn.parse(data)
    walk = require('acorn/util/walk')
    walkall = require('walkall')

    walk.simple(ast, walkall.makeVisitors((node) ->
      return unless node.type == 'CallExpression'
      return unless node.callee.name == 'require'

      module_name = node.arguments[0].value
      return unless module_name.match(/^[a-zA-Z]/)

      console.log module_name
    ), walkall.traversers)
