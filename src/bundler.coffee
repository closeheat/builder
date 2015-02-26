fs = require 'fs'
Promise = require 'bluebird'
_ = require 'lodash'
path = require 'path'
gulpFilter = require('gulp-filter')
through = require('through2')
browserify = require 'browserify'
source = require('vinyl-source-stream')
buffer = require('vinyl-buffer')
sourcemaps = require('gulp-sourcemaps')
gulp = require 'gulp'

module.exports =
class Bundler
  constructor: (@tmp_app) ->

  bundle: ->
    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@tmp_app, '**/*.js'))
        .pipe(@minFilter())
        .pipe(@exec(resolve, reject).on('error', reject))

  minFilter: ->
    gulpFilter (file) ->
      !/.min./.test(file.path)

  exec: (resolve, reject) ->
    through.obj((file, enc, cb) =>
      if file.isNull()
        cb(null, file)
        return

      relative = path.relative(@tmp_app, file.path)

      bundle = browserify(
        entries: [file.path]
        debug: true
        standalone: 'CloseheatStandaloneModule'
      ).bundle().on('error', reject)

      bundle
        .pipe(source(relative))
        .pipe(buffer())
        .pipe(sourcemaps.init(loadMaps: true))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(@tmp_app))
        .on('error', reject)
        .on('end', cb)

    , resolve)
