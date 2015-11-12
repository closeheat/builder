gulp = require 'gulp'
path = require 'path'
Promise = require 'bluebird'
dirmr = require 'dirmr'
fs = require 'fs.extra'
_ = require 'lodash'
plumber = require('gulp-plumber')

Requirer = require './requirer'

module.exports =
class Core
  constructor: (@src, @dist, @tmp, @extensions) ->
    @tmp_app = path.join(@tmp, 'app')
    fs.rmrfSync(@tmp_app)
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

  donePromise: ->
    new Promise (resolve, reject) =>
      resolve()

  execExtension: (ext) ->
    return true if _.isEmpty(@extensions)
    return true if _.include(@extensions, ext)

    false

  buildCoffee: ->
    return @donePromise() unless @execExtension('coffee')
    coffee = require 'gulp-coffee'

    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.coffee'))
        .pipe(coffee(bare: true).on('error', reject))
        .pipe(gulp.dest(path.join(@tmp_app)))
        .on('error', reject)
        .on('end', resolve)

  buildJSX: ->
    return @donePromise() unless @execExtension('jsx')
    reactify = require 'gulp-reactify'

    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.jsx'))
        .pipe(reactify().on('error', reject))
        .pipe(gulp.dest(path.join(@tmp_app)))
        .on('error', reject)
        .on('end', resolve)

  buildJade: ->
    return @donePromise() unless @execExtension('jade')
    jade = require 'gulp-jade'

    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.jade'))
        .pipe(jade().on('error', reject))
        .pipe(gulp.dest(path.join(@tmp_app)))
        .on('error', reject)
        .on('end', resolve)

  buildSCSS: ->
    return @donePromise() unless @execExtension('scss')
    sass = require 'gulp-sass'

    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@src, '/**/*.scss'))
        .pipe(plumber())
        .pipe(sass())
        .on('error', resolve)
        .on('end', resolve)
        .pipe(gulp.dest(path.join(@tmp_app)))

  buildMd: ->
    return @donePromise() unless @execExtension('md')
    markdown = require 'gulp-markdown'

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
