// Config file used as example: https://github.com/angular/angular.js/blob/master/karma-shared.conf.js

var package = require('./package.json')
var debug = require('logdown')('Karma')

//
// SauceLabs conf
//

var sauceLabsConf = {
  sauceLabs: {
    testName: package.name,
    username: process.env.SAUCELABS_USERNAME,
    accessKey: process.env.SAUCELABS_ACCESS_KEY
  },
  customLaunchers: {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest',
      platform: 'Windows 10'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
      platform: 'Windows 10'
    },
    sl_safari_ios_latest: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.10',
      version: 'latest',
      deviceName: 'iPhone 6 Plus'
    }
  }
}

//
// Export
//

module.exports = function(config) {
  if (!process.env.SAUCELABS_USERNAME || !process.env.SAUCELABS_ACCESS_KEY) {
    debug.error('Set env variables `SAUCELABS_USERNAME` and `SAUCELABS_ACCESS_KEY` with your SauceLabs credentials.')
    throw new Error()
  }

  var confOptions = {
    plugins: [
      require('karma-webpack'),
      require('karma-tap'),
      require('karma-sauce-launcher')
    ],
    basePath: '',
    frameworks: [ 'tap' ],
    files: [ 'test/*.js' ],
    preprocessors: {
      'test/*.js': [ 'webpack' ]
    },
    webpack: {
      node : {
        fs: 'empty'
      }
    },
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['dots', 'saucelabs'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    singleRun: false,

    // To avoid DISCONNECTED messages
    browserDisconnectTimeout : 10000,
    browserDisconnectTolerance : 1,
    browserNoActivityTimeout : 60000,
  }

  // Add SauceLabs browsers
  Object.assign(confOptions, sauceLabsConf)
  confOptions.browsers.push(...Object.keys(sauceLabsConf.customLaunchers))

  config.set(confOptions)
};