gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
path = require 'path'
jade = require 'gulp-jade'
sass = require 'gulp-sass'
markdown = require 'gulp-markdown'
marked = require 'marked'
reactify = require 'gulp-reactify'
Promise = require 'bluebird'
_ = require 'lodash'
dirmr = require 'dirmr'

Requirer = require './requirer'

module.exports =
class Core
  constructor: (@src, @dist, @tmp) ->
    @tmp_app = path.join(@tmp, 'app')
    @events = {}

  build: ->
    @transform().then =>
      new Requirer(@dist, @tmp, @tmp_app, @emit).install().then =>
        @moveToDist()

  moveToDist: ->
    new Promise (resolve, reject) =>
      dirmr([@tmp_app]).join(@dist).complete (err, result) ->
        return reject(err) if err

        resolve()

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
      @buildJSX()
      @transferOther()
    ])

  buildCoffee: ->
    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.coffee'))
        .pipe(coffee(bare: true).on('error', reject))
        .pipe(gulp.dest(path.join(@tmp_app)))
        .on('error', reject)
        .on('end', resolve)

  buildJSX: ->
    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.jsx'))
        .pipe(reactify().on('error', reject))
        .pipe(gulp.dest(path.join(@tmp_app)))
        .on('error', reject)
        .on('end', resolve)

  buildJade: ->
    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.jade'))
        .pipe(jade().on('error', reject))
        .pipe(gulp.dest(path.join(@tmp_app)))
        .on('error', reject)
        .on('end', resolve)

  buildSCSS: ->
    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.scss'))
        .pipe(sass().on('error', reject))
        .pipe(gulp.dest(path.join(@tmp_app)))
        .on('error', reject)
        .on('end', resolve)

  buildMd: ->
    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.md'))
        .pipe(markdown().on('error', reject))
        .pipe(gulp.dest(path.join(@tmp_app)))
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
          "!#{path.join(@src, '.git/**/*.*')}",
        ])
        .pipe(gulp.dest(path.join(@tmp_app)))
        .on('error', reject)
        .on('end', resolve)
