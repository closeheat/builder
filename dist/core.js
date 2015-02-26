var Core, Promise, Requirer, coffee, dirmr, gulp, gutil, jade, markdown, marked, path, reactify, sass, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

gulp = require('gulp');

gutil = require('gulp-util');

coffee = require('gulp-coffee');

path = require('path');

jade = require('gulp-jade');

sass = require('gulp-sass');

markdown = require('gulp-markdown');

marked = require('marked');

reactify = require('gulp-reactify');

Promise = require('bluebird');

_ = require('lodash');

dirmr = require('dirmr');

Requirer = require('./requirer');

module.exports = Core = (function() {
  function Core(src, dist, tmp) {
    this.src = src;
    this.dist = dist;
    this.tmp = tmp;
    this.emit = __bind(this.emit, this);
    this.on = __bind(this.on, this);
    this.tmp_app = path.join(this.tmp, 'app');
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
    return dirmr([this.tmp_app]).join(this.dist).complete(function(err, result) {
      return process.exit(0);
    });
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

  Core.prototype.buildCoffee = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.coffee')).pipe(coffee({
          bare: true
        }).on('error', reject)).pipe(gulp.dest(path.join(_this.tmp_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.buildJSX = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.jsx')).pipe(reactify().on('error', reject)).pipe(gulp.dest(path.join(_this.tmp_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.buildJade = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.jade')).pipe(jade().on('error', reject)).pipe(gulp.dest(path.join(_this.tmp_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.buildSCSS = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.scss')).pipe(sass().on('error', reject)).pipe(gulp.dest(path.join(_this.tmp_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.buildMd = function() {
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
