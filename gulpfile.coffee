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
modConcat = require("node-module-concat")

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
    .src('./src/bin/builder.coffee')
    .pipe(coffee(bare: true)
    .on('error', gutil.log))
    .pipe(insert.prepend('#!/usr/bin/env node\n\n'))
    .pipe gulp.dest('./dist/bin/')

gulp.task 'concat', ->
  outputFile = "./concatenated.js"
  modConcat "./dist/bin/builder.js", outputFile, (err, files) ->
    if (err)
      throw err
    console.log(files.length + " were combined into " + outputFile)
