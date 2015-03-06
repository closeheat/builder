NpmDownloader = require './npm_downloader'
Bundler = require './bundler'
RequireScanner = require './require_scanner'

module.exports =
class Requirer
  constructor: (@dist, @tmp, @tmp_app, @emit) ->
    @require_scanner = new RequireScanner(@tmp_app)
    @bundler = new Bundler(@tmp, @tmp_app)

  install: =>
    @require_scanner.getRequires().then (modules) =>
      new NpmDownloader(@tmp, modules, @emit).downloadAll().then =>
        @bundler.bundle()
