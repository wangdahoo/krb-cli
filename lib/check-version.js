const request = require('request')
const semver = require('semver')
const chalk = require('chalk')
const pkg = require('../package.json')

const program = 'krb'

module.exports = function (done) {
  // Ensure minimum supported node version is used
  if (!semver.satisfies(process.version, pkg.engines.node)) {
    return console.log(chalk.red(
      `  You must upgrade node to >=' + pkg.engines.node + '.x to use ${program}`
    ))
  }

  request({
    url: `https://registry.npmjs.org/@wangdahoo/${program}`,
    timeout: 1000
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      var latestVersion = JSON.parse(body)['dist-tags'].latest
      var localVersion = pkg.version
      if (semver.lt(localVersion, latestVersion)) {
        console.log(chalk.yellow(`  A newer version of ${program} is available.`))
        console.log()
        console.log('  latest:    ' + chalk.green(latestVersion))
        console.log('  installed: ' + chalk.red(localVersion))
        console.log()
      }
    }
    done()
  })
}
