NpmDownloader = require './npm_downloader'
Bundler = require './bundler'
RequireScanner = require './require_scanner'

module.exports =
class Requirer
  constructor: (@dist, @dist_app, @emit) ->
    @bundler = new Bundler(@dist_app)
    @require_scanner = new RequireScanner(@dist_app)

  install: =>
    @require_scanner.getRequires().then (modules) =>
      new NpmDownloader(@dist, modules, @emit).downloadAll().then =>
        @bundler.bundle()
