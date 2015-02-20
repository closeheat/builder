var Core, Promise, callback, coffee, gulp, gutil, jade, path, sass, _;

gulp = require('gulp');

gutil = require('gulp-util');

coffee = require('gulp-coffee');

path = require('path');

jade = require('gulp-jade');

sass = require('gulp-sass');

callback = require('gulp-callback');

Promise = require('bluebird');

_ = require('lodash');

module.exports = Core = (function() {
  function Core() {}

  Core.build = function(src, dist) {
    return Promise.all([this.buildCoffee(src, dist), this.buildJade(src, dist), this.buildSCSS(src, dist), this.transferOther(src, dist)]);
  };

  Core.buildCoffee = function(src, dist) {
    return new Promise(function(resolve, reject) {
      return gulp.src(path.join(src, '/**/*.coffee')).pipe(coffee({
        bare: true
      }).on('error', reject)).pipe(gulp.dest(path.join(dist))).on('error', reject).on('end', resolve);
    });
  };

  Core.buildJade = function(src, dist, _start) {
    return new Promise(function(resolve, reject) {
      return gulp.src(path.join(src, '/**/*.jade')).pipe(jade().on('error', reject)).pipe(gulp.dest(path.join(dist))).on('error', reject).on('end', resolve);
    });
  };

  Core.buildSCSS = function(src, dist, _start) {
    return new Promise(function(resolve, reject) {
      return gulp.src(path.join(src, '/**/*.scss')).pipe(sass().on('error', reject)).pipe(gulp.dest(path.join(dist))).on('error', reject).on('end', resolve);
    });
  };

  Core.transferOther = function(src, dist, _start) {
    return new Promise(function(resolve, reject) {
      return gulp.src([path.join(src, '/**/*'), "!" + (path.join(src, '/**/*.coffee')), "!" + (path.join(src, '/**/*.jade')), "!" + (path.join(src, '/**/*.scss'))]).pipe(gulp.dest(path.join(dist))).on('error', reject).on('end', resolve);
    });
  };

  return Core;

})();
