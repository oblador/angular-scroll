var path = require('path');

var testFiles = [
  'bower_components/angular/angular.js',
  'bower_components/angular-mocks/angular-mocks.js',
  'src/**/*.js',
  'test/unit/**/*.js'
];

module.exports = function(config){
  var options = {
    basePath : path.dirname(__dirname),
    files : testFiles,
    autoWatch : true,
    frameworks: ['jasmine'],
    browsers : ['Firefox', 'Chrome'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],
    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  };
  if(process.env.TRAVIS){
    options.browsers = ['Chrome_travis_ci'];
  }
  config.set(options);
};

module.exports.testFiles = testFiles;
