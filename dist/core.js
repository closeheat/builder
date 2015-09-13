var Core, Promise, Requirer, dirmr, fs, gulp, path, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

gulp = require('gulp');

path = require('path');

Promise = require('bluebird');

dirmr = require('dirmr');

fs = require('fs.extra');

_ = require('lodash');

Requirer = require('./requirer');

module.exports = Core = (function() {
  function Core(src, dist, tmp, extensions) {
    this.src = src;
    this.dist = dist;
    this.tmp = tmp;
    this.extensions = extensions;
    this.emit = __bind(this.emit, this);
    this.on = __bind(this.on, this);
    this.tmp_app = path.join(this.tmp, 'app');
    fs.rmrfSync(this.tmp_app);
    this.events = {};
  }

  Core.prototype.build = function() {
    return this.transform().then((function(_this) {
      return function() {
        return new Requirer(_this.dist, _this.tmp, _this.tmp_app, _this.emit).install().then(function() {
          return _this.moveToDist();
        });
      };
    })(this));
  };

  Core.prototype.moveToDist = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return dirmr([_this.tmp_app]).join(_this.dist).complete(function(err, result) {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      };
    })(this));
  };

  Core.prototype.on = function(event_name, cb) {
    this.events[event_name] = cb;
    return this;
  };

  Core.prototype.emit = function(event_name, data) {
    var _base;
    return typeof (_base = this.events)[event_name] === "function" ? _base[event_name](data) : void 0;
  };

  Core.prototype.transform = function() {
    return Promise.all([this.buildCoffee(), this.buildJade(), this.buildSCSS(), this.buildMd(), this.buildJSX(), this.transferOther()]);
  };

  Core.prototype.donePromise = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return resolve();
      };
    })(this));
  };

  Core.prototype.execExtension = function(ext) {
    if (_.isEmpty(this.extensions)) {
      return true;
    }
    if (_.include(this.extensions, ext)) {
      return true;
    }
    return false;
  };

  Core.prototype.buildCoffee = function() {
    var coffee;
    if (!this.execExtension('coffee')) {
      return this.donePromise();
    }
    coffee = require('gulp-coffee');
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.coffee')).pipe(coffee({
          bare: true
        }).on('error', reject)).pipe(gulp.dest(path.join(_this.tmp_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.buildJSX = function() {
    var reactify;
    if (!this.execExtension('jsx')) {
      return this.donePromise();
    }
    reactify = require('gulp-reactify');
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.jsx')).pipe(reactify().on('error', reject)).pipe(gulp.dest(path.join(_this.tmp_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.buildJade = function() {
    var jade;
    if (!this.execExtension('jade')) {
      return this.donePromise();
    }
    jade = require('gulp-jade');
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.jade')).pipe(jade().on('error', reject)).pipe(gulp.dest(path.join(_this.tmp_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.buildSCSS = function() {
    var sass;
    if (!this.execExtension('scss')) {
      return this.donePromise();
    }
    sass = require('gulp-sass');
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.scss')).pipe(sass().on('error', reject)).pipe(gulp.dest(path.join(_this.tmp_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.buildMd = function() {
    var markdown;
    if (!this.execExtension('md')) {
      return this.donePromise();
    }
    markdown = require('gulp-markdown');
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.md')).pipe(markdown().on('error', reject)).pipe(gulp.dest(path.join(_this.tmp_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.transferOther = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src([path.join(_this.src, '/**/*'), "!" + (path.join(_this.src, '/**/*.coffee')), "!" + (path.join(_this.src, '/**/*.jade')), "!" + (path.join(_this.src, '/**/*.scss')), "!" + (path.join(_this.src, '/**/*.md')), "!" + (path.join(_this.src, '.git/**/*.*'))]).pipe(gulp.dest(path.join(_this.tmp_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  return Core;

})();
