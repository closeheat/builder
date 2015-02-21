var Promise, RequireScanner, acorn, gulp, path, through, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

Promise = require('bluebird');

_ = require('lodash');

path = require('path');

through = require('through2');

gulp = require('gulp');

acorn = require('acorn');

module.exports = RequireScanner = (function() {
  function RequireScanner(dist_app) {
    this.dist_app = dist_app;
    this.finish = __bind(this.finish, this);
    this.modules = [];
  }

  RequireScanner.prototype.register = function(module) {
    return this.modules.push(module);
  };

  RequireScanner.prototype.getRequires = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return gulp.src(path.join(_this.dist_app, '**/*.js')).pipe(_this.scan(resolve, reject).on('error', reject));
      };
    })(this));
  };

  RequireScanner.prototype.finish = function(resolve, _done) {
    return resolve(this.modules);
  };

  RequireScanner.prototype.scan = function(resolve, reject) {
    return through.obj((function(_this) {
      return function(file, enc, cb) {
        var ast, e, walk, walkall;
        try {
          if (file.isNull()) {
            cb(null, file);
            return;
          }
          ast = acorn.parse(file.contents.toString());
          walk = require('acorn/util/walk');
          walkall = require('walkall');
          walk.simple(ast, walkall.makeVisitors(function(node) {
            var module, module_name, submodules, _ref;
            if (node.type !== 'CallExpression') {
              return;
            }
            if (node.callee.name !== 'require') {
              return;
            }
            module_name = node["arguments"][0].value;
            if (!module_name.match(/^[a-zA-Z]/)) {
              return;
            }
            _ref = module_name.split('/'), module = _ref[0], submodules = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
            return _this.register(module);
          }), walkall.traversers);
          return cb();
        } catch (_error) {
          e = _error;
          return reject(e.stack);
        }
      };
    })(this), _.partial(this.finish, resolve));
  };

  return RequireScanner;

})();
