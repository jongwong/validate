// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

let webpackConfig = require('./webpack.config');
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter',
      'karma-coverage',
      'karma-webpack',
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: ['./test/**/*.spec.ts'],
    preprocessors: {
      './test/**/*.spec.ts': ['webpack'],
    },
    exclude: ['karma.conf.js','webpack.config.js'],
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
    webpack: webpackConfig({"NODE_ENV": "development"}),
  });
};
