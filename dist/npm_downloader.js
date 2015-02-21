var NPM, NpmDownloader, Promise, fs, path, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

fs = require('fs');

Promise = require('bluebird');

_ = require('lodash');

path = require('path');

NPM = require('machinepack-npm');

module.exports = NpmDownloader = (function() {
  function NpmDownloader(dist, modules, emit) {
    this.dist = dist;
    this.modules = modules;
    this.emit = emit;
    this.missing = __bind(this.missing, this);
    this.downloadAll = __bind(this.downloadAll, this);
  }

  NpmDownloader.prototype.downloadAll = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        if (_.isEmpty(_this.missing())) {
          resolve();
        }
        return Promise.each(_this.missing(), function(module) {
          return _this.download(module);
        }).then(function() {
          return resolve();
        });
      };
    })(this));
  };

  NpmDownloader.prototype.missing = function() {
    return _.reject(_.uniq(this.modules), (function(_this) {
      return function(module) {
        return fs.existsSync(path.join(_this.dist, 'node_modules', module));
      };
    })(this));
  };

  NpmDownloader.prototype.download = function(module) {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        _this.emit('module-detected', module);
        return NPM.installPackage({
          name: module,
          loglevel: 'silent',
          prefix: _this.dist
        }).exec({
          error: function(err) {
            this.emit('error', err);
            return reject(err);
          },
          success: function(name) {
            _this.emit('module-installed', name);
            return resolve();
          }
        });
      };
    })(this));
  };

  return NpmDownloader;

})();
