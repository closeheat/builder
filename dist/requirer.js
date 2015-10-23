var Bundler, NpmDownloader, RequireScanner, Requirer,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

NpmDownloader = require('./npm_downloader');

Bundler = require('./bundler');

RequireScanner = require('./require_scanner');

module.exports = Requirer = (function() {
  function Requirer(dist, tmp, tmp_app, emit) {
    this.dist = dist;
    this.tmp = tmp;
    this.tmp_app = tmp_app;
    this.emit = emit;
    this.install = bind(this.install, this);
    this.require_scanner = new RequireScanner(this.tmp_app);
    this.bundler = new Bundler(this.tmp, this.tmp_app);
  }

  Requirer.prototype.install = function() {
    return this.require_scanner.getRequires().then((function(_this) {
      return function(modules) {
        return new NpmDownloader(_this.tmp, modules, _this.emit).downloadAll().then(function() {
          return _this.bundler.bundle();
        });
      };
    })(this));
  };

  return Requirer;

})();
