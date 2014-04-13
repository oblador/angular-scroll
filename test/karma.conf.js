var testFiles = [
  'bower_components/angular/angular.js',
  'bower_components/angular-mocks/angular-mocks.js',
  'src/**/*.js',
  'test/unit/**/*.js'
];

module.exports = function(config){
  config.set({

    basePath : '../',

    files : testFiles,

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};

module.exports.testFiles = testFiles;
