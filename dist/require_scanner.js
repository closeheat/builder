var Promise, RequireScanner, _, acorn, gulp, path, through,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

Promise = require('bluebird');

_ = require('lodash');

path = require('path');

through = require('through2');

gulp = require('gulp');

acorn = require('acorn/dist/acorn_loose');

module.exports = RequireScanner = (function() {
  function RequireScanner(dist_app) {
    this.dist_app = dist_app;
    this.finish = bind(this.finish, this);
    this.modules = {};
  }

  RequireScanner.prototype.register = function(name, version) {
    return this.modules[name] = version;
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
        var ast, e, error, walk, walkall;
        try {
          if (file.isNull()) {
            cb(null, file);
            return;
          }
          ast = acorn.parse_dammit(file.contents.toString());
          walk = require('acorn/dist/walk');
          walkall = require('walkall');
          walk.simple(ast, walkall.makeVisitors(function(node) {
            var module, module_name, name, ref, ref1, submodules, version;
            if (node.type !== 'CallExpression') {
              return;
            }
            if (node.callee.name !== 'require') {
              return;
            }
            module_name = node["arguments"][0].value;
            if (!(module_name != null ? module_name.match(/^[a-zA-Z]/) : void 0)) {
              return;
            }
            ref = module_name.split('/'), module = ref[0], submodules = 2 <= ref.length ? slice.call(ref, 1) : [];
            ref1 = module.split('@'), name = ref1[0], version = ref1[1];
            return _this.register(name, version);
          }), walkall.traversers);
          return cb();
        } catch (error) {
          e = error;
          return reject(e.stack);
        }
      };
    })(this), _.partial(this.finish, resolve));
  };

  return RequireScanner;

})();
