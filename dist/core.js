var Core, Promise, Requirer, coffee, gulp, gutil, jade, markdown, marked, path, sass, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

gulp = require('gulp');

gutil = require('gulp-util');

coffee = require('gulp-coffee');

path = require('path');

jade = require('gulp-jade');

sass = require('gulp-sass');

markdown = require('gulp-markdown');

marked = require('marked');

Promise = require('bluebird');

_ = require('lodash');

Requirer = require('./requirer');

module.exports = Core = (function() {
  function Core(src, dist) {
    this.src = src;
    this.dist = dist;
    this.emit = __bind(this.emit, this);
    this.on = __bind(this.on, this);
    this.dist_app = path.join(this.dist, 'app');
    this.events = {};
  }

  Core.prototype.build = function() {
    return this.transform().then((function(_this) {
      return function() {
        return new Requirer(_this.dist, _this.dist_app, _this.emit).install();
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
    return Promise.all([this.buildCoffee(), this.buildJade(), this.buildSCSS(), this.buildMd(), this.transferOther()]);
  };

  Core.prototype.buildCoffee = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.coffee')).pipe(coffee({
          bare: true
        }).on('error', reject)).pipe(gulp.dest(path.join(_this.dist_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.buildJade = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.jade')).pipe(jade().on('error', reject)).pipe(gulp.dest(path.join(_this.dist_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.buildSCSS = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.scss')).pipe(sass().on('error', reject)).pipe(gulp.dest(path.join(_this.dist_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.buildMd = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.src, '/**/*.md')).pipe(markdown().on('error', reject)).pipe(gulp.dest(path.join(_this.dist_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  Core.prototype.transferOther = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src([path.join(_this.src, '/**/*'), "!" + (path.join(_this.src, '/**/*.coffee')), "!" + (path.join(_this.src, '/**/*.jade')), "!" + (path.join(_this.src, '/**/*.scss')), "!" + (path.join(_this.src, '/**/*.md'))]).pipe(gulp.dest(path.join(_this.dist_app))).on('error', reject).on('end', resolve);
      };
    })(this));
  };

  return Core;

})();
