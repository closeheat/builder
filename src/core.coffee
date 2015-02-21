gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
path = require 'path'
jade = require 'gulp-jade'
sass = require 'gulp-sass'
markdown = require 'gulp-markdown'
marked = require 'marked'
Promise = require 'bluebird'
_ = require 'lodash'

Requirer = require './requirer'

module.exports =
class Core
  constructor: (@src, @dist) ->
    @dist_app = path.join(@dist, 'app')
    @events = {}

  build: ->
    @transform().then =>
      new Requirer(@dist, @dist_app, @emit).install()

  on: (event_name, cb) =>
    @events[event_name] = cb
    @

  emit: (event_name, data) =>
    @events[event_name]?(data)

  transform: ->
    Promise.all([
      @buildCoffee()
      @buildJade()
      @buildSCSS()
      @buildMd()
      @transferOther()
    ])

  buildCoffee: ->
    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.coffee'))
        .pipe(coffee(bare: true).on('error', reject))
        .pipe(gulp.dest(path.join(@dist_app)))
        .on('error', reject)
        .on('end', resolve)

  buildJade: ->
    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.jade'))
        .pipe(jade().on('error', reject))
        .pipe(gulp.dest(path.join(@dist_app)))
        .on('error', reject)
        .on('end', resolve)

  buildSCSS: ->
    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.scss'))
        .pipe(sass().on('error', reject))
        .pipe(gulp.dest(path.join(@dist_app)))
        .on('error', reject)
        .on('end', resolve)

  buildMd: ->
    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.md'))
        .pipe(markdown().on('error', reject))
        .pipe(gulp.dest(path.join(@dist_app)))
        .on('error', reject)
        .on('end', resolve)

  transferOther: ->
    new Promise (resolve, reject) =>
      gulp
        .src([
          path.join(@src, '/**/*'),
          "!#{path.join(@src, '/**/*.coffee')}",
          "!#{path.join(@src, '/**/*.jade')}",
          "!#{path.join(@src, '/**/*.scss')}",
          "!#{path.join(@src, '/**/*.md')}",
        ])
        .pipe(gulp.dest(path.join(@dist_app)))
        .on('error', reject)
        .on('end', resolve)
