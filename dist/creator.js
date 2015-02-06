var Creator;

module.exports = Creator = (function() {
  function Creator() {}

  Creator.prototype.create = function(name) {
    var Spinner, request, url;
    url = 'https://api.github.com/search/repositories?sort=stars&order=desc&q=closeheat';
    request = require('request');
    Spinner = require('./spinner');
    Spinner.start('Creating a directory');
    return request({
      method: 'GET',
      headers: {
        'User-Agent': 'closeheat'
      },
      url: url
    }, function(error, response, body) {
      var chalk, start_cmd, util;
      chalk = require('chalk');
      util = require('util');
      Spinner.stop("App with name \"" + (chalk.yellow(name)) + "\" is ready.");
      start_cmd = chalk.yellow("cd " + name + " && closeheat server");
      util.puts("  Run \"" + start_cmd + "\" to start it.");
      return process.exit(0);
    });
  };

  return Creator;

})();
