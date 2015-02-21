var Bundler, Promise, browserify, buffer, fs, gulp, gulpFilter, path, source, sourcemaps, through, _;

fs = require('fs');

Promise = require('bluebird');

_ = require('lodash');

path = require('path');

gulpFilter = require('gulp-filter');

through = require('through2');

browserify = require('browserify');

source = require('vinyl-source-stream');

buffer = require('vinyl-buffer');

sourcemaps = require('gulp-sourcemaps');

gulp = require('gulp');

module.exports = Bundler = (function() {
  function Bundler(dist_app) {
    this.dist_app = dist_app;
  }

  Bundler.prototype.bundle = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.dist_app, '**/*.js')).pipe(_this.minFilter()).pipe(_this.exec(resolve, reject).on('error', reject));
      };
    })(this));
  };

  Bundler.prototype.minFilter = function() {
    return gulpFilter(function(file) {
      return !/.min./.test(file.path);
    });
  };

  Bundler.prototype.exec = function(resolve, reject) {
    return through.obj((function(_this) {
      return function(file, enc, cb) {
        var bundler, relative;
        if (file.isNull()) {
          cb(null, file);
          return;
        }
        relative = path.relative(_this.dist_app, file.path);
        bundler = browserify({
          entries: [file.path],
          debug: true,
          standalone: 'CloseheatStandaloneModule'
        });
        return bundler.bundle().on('error', reject).pipe(source(relative)).pipe(buffer()).pipe(sourcemaps.init({
          loadMaps: true
        })).pipe(sourcemaps.write('./')).pipe(gulp.dest(_this.dist_app)).on('error', reject).on('end', cb);
      };
    })(this), resolve);
  };

  return Bundler;

})();
