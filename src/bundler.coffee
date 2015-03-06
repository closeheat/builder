fs = require 'fs'
Promise = require 'bluebird'
path = require 'path'
gulpFilter = require('gulp-filter')
through = require('through2')
browserifyInc = require('browserify-incremental')
source = require('vinyl-source-stream')
buffer = require('vinyl-buffer')
sourcemaps = require('gulp-sourcemaps')
gulp = require 'gulp'

module.exports =
class Bundler
  constructor: (@tmp, @tmp_app) ->

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

      bundle = browserifyInc(
        entries: [file.path]
        debug: true
        standalone: 'CloseheatStandaloneModule'
        cacheFile: path.join(@tmp, 'browserify-cache.json')
      ).bundle().on('error', reject)

      relative = path.relative(@tmp_app, file.path)
      bundle
        .pipe(source(relative))
        .pipe(buffer())
        .pipe(sourcemaps.init(loadMaps: true))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(@tmp_app))
        .on('error', reject)
        .on('end', cb)

    , resolve)
