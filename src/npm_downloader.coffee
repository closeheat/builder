fs = require 'fs'
Promise = require 'bluebird'
_ = require 'lodash'
path = require 'path'
NPM = require 'machinepack-npm'

module.exports =
class NpmDownloader
  constructor: (@dist, @modules, @emit) ->

  downloadAll: =>
    new Promise (resolve, reject) =>
      if _.isEmpty(@missing())
        resolve()

      Promise.each(@missing(), (module) =>
        @download(module)
      ).then ->
        resolve()

  missing: =>
    _.reject _.uniq(@modules), (module) =>
      fs.existsSync(path.join(@dist, 'node_modules', module))

  download: (module) ->
    new Promise (resolve, reject) =>
      @emit('module-detected', module)
      NPM.installPackage({
        name: module
        loglevel: 'silent'
        prefix: @dist
      }).exec({
        error: (err) ->
          @emit('error', err)
          reject(err)

        success: (name) =>
          @emit('module-installed', name)
          resolve()

          # Fill the package.json for exports
          # package_file = {
          #   name: 'closeheat-app'
          #   version: '1.0.0'
          #   dependencies: {},
          #   path: '.',
          # }
          # fs.writeFileSync(path.join(@dist, 'package.json'), JSON.stringify(package_file))
      })
