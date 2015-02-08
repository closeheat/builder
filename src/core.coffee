gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
path = require 'path'
jade = require 'gulp-jade'
sass = require 'gulp-sass'
Orchestrator = require('orchestrator')
orchestrator = new Orchestrator()
callback = require 'gulp-callback'
Q = require('q')

module.exports =
class Core
  @build: (src, dist) ->
    deferredCoffee = Q.defer()
    deferredJade = Q.defer()
    deferredSCSS = Q.defer()
    deferredTransfer = Q.defer()

    @buildCoffee(src, dist, deferredCoffee)
    @buildJade(src, dist, deferredJade)
    @buildSCSS(src, dist, deferredSCSS)
    @transferOther(src, dist, deferredTransfer)

    Q.when(
      deferredCoffee.promise,
      deferredJade.promise,
      deferredSCSS.promise,
      deferredTransfer.promise
    )

  @buildCoffee: (src, dist, promise) ->
    gulp
      .src(path.join(src, '/**/*.coffee'))
      .pipe(coffee(bare: true)
      .on('error', gutil.log))
      .pipe(gulp.dest(path.join(dist)))
      .pipe(callback(promise.resolve))

  @buildJade: (src, dist, promise) ->
    gulp
      .src(path.join(src, '/**/*.jade'))
      .pipe(jade()
      .on('error', gutil.log))
      .pipe gulp.dest(path.join(dist))
      .pipe(callback(promise.resolve))

  @buildSCSS: (src, dist, promise) ->
    gulp
      .src(path.join(src, '/**/*.scss'))
      .pipe(sass()
      .on('error', gutil.log))
      .pipe gulp.dest(path.join(dist))
      .pipe(callback(promise.resolve))

  @transferOther: (src, dist, promise) ->
    gulp
      .src([
        path.join(src, '/**/*'),
        "!#{path.join(src, '/**/*.coffee')}",
        "!#{path.join(src, '/**/*.jade')}",
        "!#{path.join(src, '/**/*.scss')}",
      ])
      .pipe gulp.dest(path.join(dist))
      .pipe(callback(promise.resolve))
