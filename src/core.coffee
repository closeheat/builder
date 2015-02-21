gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
path = require 'path'
jade = require 'gulp-jade'
sass = require 'gulp-sass'
markdown = require 'gulp-markdown'
marked = require 'marked'
callback = require 'gulp-callback'
Promise = require 'bluebird'
_ = require 'lodash'

module.exports =
class Core
  @build: (src, dist) ->
    Promise.all([
      @buildCoffee(src, dist)
      @buildJade(src, dist)
      @buildSCSS(src, dist)
      @buildMd(src, dist)
      @transferOther(src, dist)
    ])

  @buildCoffee: (src, dist) ->
    new Promise (resolve, reject) ->
      gulp
        .src(path.join(src, '/**/*.coffee'))
        .pipe(coffee(bare: true).on('error', reject))
        .pipe(gulp.dest(path.join(dist)))
        .on('error', reject)
        .on('end', resolve)

  @buildJade: (src, dist, _start) ->
    new Promise (resolve, reject) ->
      gulp
        .src(path.join(src, '/**/*.jade'))
        .pipe(jade().on('error', reject))
        .pipe(gulp.dest(path.join(dist)))
        .on('error', reject)
        .on('end', resolve)

  @buildSCSS: (src, dist, _start) ->
    new Promise (resolve, reject) ->
      gulp
        .src(path.join(src, '/**/*.scss'))
        .pipe(sass().on('error', reject))
        .pipe(gulp.dest(path.join(dist)))
        .on('error', reject)
        .on('end', resolve)

  @buildMd: (src, dist, _start) ->
    new Promise (resolve, reject) ->
      gulp
        .src(path.join(src, '/**/*.md'))
        .pipe(markdown().on('error', reject))
        .pipe(gulp.dest(path.join(dist)))
        .on('error', reject)
        .on('end', resolve)

  @transferOther: (src, dist, _start) ->
    new Promise (resolve, reject) ->
      gulp
        .src([
          path.join(src, '/**/*'),
          "!#{path.join(src, '/**/*.coffee')}",
          "!#{path.join(src, '/**/*.jade')}",
          "!#{path.join(src, '/**/*.scss')}",
          "!#{path.join(src, '/**/*.md')}",
        ])
        .pipe(gulp.dest(path.join(dist)))
        .on('error', reject)
        .on('end', resolve)
