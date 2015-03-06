var Bundler, Promise, browserifyInc, buffer, fs, gulp, gulpFilter, path, source, sourcemaps, through;

fs = require('fs');

Promise = require('bluebird');

path = require('path');

gulpFilter = require('gulp-filter');

through = require('through2');

browserifyInc = require('browserify-incremental');

source = require('vinyl-source-stream');

buffer = require('vinyl-buffer');

sourcemaps = require('gulp-sourcemaps');

gulp = require('gulp');

module.exports = Bundler = (function() {
  function Bundler(tmp, tmp_app) {
    this.tmp = tmp;
    this.tmp_app = tmp_app;
  }

  Bundler.prototype.bundle = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.tmp_app, '**/*.js')).pipe(_this.minFilter()).pipe(_this.exec(resolve, reject).on('error', reject));
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
        var bundle, relative;
        if (file.isNull()) {
          cb(null, file);
          return;
        }
        bundle = browserifyInc({
          entries: [file.path],
          debug: true,
          standalone: 'CloseheatStandaloneModule',
          cacheFile: path.join(_this.tmp, 'browserify-cache.json')
        }).bundle().on('error', reject);
        relative = path.relative(_this.tmp_app, file.path);
        return bundle.pipe(source(relative)).pipe(buffer()).pipe(sourcemaps.init({
          loadMaps: true
        })).pipe(sourcemaps.write('./')).pipe(gulp.dest(_this.tmp_app)).on('error', reject).on('end', cb);
      };
    })(this), resolve);
  };

  return Bundler;

})();
