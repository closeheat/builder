var Core, Orchestrator, Q, callback, coffee, gulp, gutil, jade, orchestrator, path, sass;

gulp = require('gulp');

gutil = require('gulp-util');

coffee = require('gulp-coffee');

path = require('path');

jade = require('gulp-jade');

sass = require('gulp-sass');

Orchestrator = require('orchestrator');

orchestrator = new Orchestrator();

callback = require('gulp-callback');

Q = require('q');

module.exports = Core = (function() {
  function Core() {}

  Core.build = function(src, dist) {
    var deferredCoffee, deferredJade, deferredSCSS, deferredTransfer;
    deferredCoffee = Q.defer();
    deferredJade = Q.defer();
    deferredSCSS = Q.defer();
    deferredTransfer = Q.defer();
    this.buildCoffee(src, dist, deferredCoffee);
    this.buildJade(src, dist, deferredJade);
    this.buildSCSS(src, dist, deferredSCSS);
    this.transferOther(src, dist, deferredTransfer);
    return Q.when(deferredCoffee.promise, deferredJade.promise, deferredSCSS.promise, deferredTransfer.promise);
  };

  Core.buildCoffee = function(src, dist, promise) {
    return gulp.src(path.join(src, '/**/*.coffee')).pipe(coffee({
      bare: true
    }).on('error', gutil.log)).pipe(gulp.dest(path.join(dist))).pipe(callback(promise.resolve));
  };

  Core.buildJade = function(src, dist, promise) {
    return gulp.src(path.join(src, '/**/*.jade')).pipe(jade().on('error', gutil.log)).pipe(gulp.dest(path.join(dist))).pipe(callback(promise.resolve));
  };

  Core.buildSCSS = function(src, dist, promise) {
    return gulp.src(path.join(src, '/**/*.scss')).pipe(sass().on('error', gutil.log)).pipe(gulp.dest(path.join(dist))).pipe(callback(promise.resolve));
  };

  Core.transferOther = function(src, dist, promise) {
    return gulp.src([path.join(src, '/**/*'), "!" + (path.join(src, '/**/*.coffee')), "!" + (path.join(src, '/**/*.jade')), "!" + (path.join(src, '/**/*.scss'))]).pipe(gulp.dest(path.join(dist))).pipe(callback(promise.resolve));
  };

  return Core;

})();
