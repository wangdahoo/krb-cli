#!/usr/bin/env node
const program = require('commander')
const path = require('path')
const exists = require('fs').existsSync
const shell = require('shelljs')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const ora = require('ora')
const checkVersion = require('./check-version')
const request = require('request')
const chalk = require('chalk')
const _ = require('lodash')
const fs = require('fs')
const Mustache = require('mustache')

function getRepoName (templateName) {
  return `wangdahoo/koa-rest-boilerplate#template`
}

function processTemplate (projectName, projectDir) {
  const files = [
    'package.json',
    path.join('bin', 'define'),
    path.join('config', '.default.env'),
    path.join('sql', 'db.sql')
  ].map(file => path.join(projectDir, file))

  for (let file of files) {
    const output = Mustache.render(fs.readFileSync(file).toString(), {
      name: projectName
    })

    fs.writeFileSync(file, output)
  }
}

function init (projectName, projectDir) {
  checkVersion(function () {
    shell.mkdir('-p', projectDir)
    const spinner = ora('initializing...').start()
    spinner.color = 'green'
    download(getRepoName(projectName), projectDir, function (err) {
      if (err) {
        spinner.fail('fail.')
        throw err
      }

      processTemplate(projectName, projectDir)
      spinner.succeed('done.')
    })
  })
}

program
  .version(require('../package').version)

program
  .command('init <projectName>')
  .description('init a koa-rest-boilerplate based project with a given name.')
  .action(function (projectName) {
    let projectDir = path.resolve(process.cwd(), projectName)

    if (exists(projectDir)) {
      inquirer.prompt([{
        type: 'confirm',
        message: 'Target directory exists. Continue?',
        name: 'ok'
      }]).then(function (answers) {
        if (answers.ok) init(projectName, projectDir)
      })
    } else {
      init(projectName, projectDir)
    }
  })

program
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
