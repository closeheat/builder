Promise = require 'bluebird'
_ = require 'lodash'
path = require 'path'
through = require 'through2'
gulp = require 'gulp'
acorn = require 'acorn/dist/acorn_loose'

module.exports =
class RequireScanner
  constructor: (@dist_app) ->
    @modules = {}

  register: (name, version) ->
    @modules[name] = version

  getRequires: ->
    new Promise (resolve, reject) =>
      gulp
        .src(path.join(@dist_app, '**/*.js'))
        .pipe(@scan(resolve, reject).on('error', reject))

  finish: (resolve, _done) =>
    resolve(@modules)

  scan: (resolve, reject) ->
    through.obj((file, enc, cb) =>
      try
        if (file.isNull())
          cb(null, file)
          return

        ast = acorn.parse_dammit(file.contents.toString())
        walk = require('acorn/dist/walk')
        walkall = require('walkall')

        walk.simple(ast, walkall.makeVisitors((node) =>
          return unless node.type == 'CallExpression'
          return unless node.callee.name == 'require'

          module_name = node.arguments[0].value
          return unless module_name?.match(/^[a-zA-Z]/)

          [module, submodules...] = module_name.split('/')
          [name, version] = module.split('@')
          @register(name, version)
        ), walkall.traversers)

        cb()

      catch e
        reject(e.stack)
    , _.partial(@finish, resolve))
