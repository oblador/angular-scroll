var gulp   = require('gulp');
var clean  = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngmin  = require('gulp-ngmin');
var rename = require('gulp-rename');
var karma = require('gulp-karma');
var karmaConfPath = './test/karma.conf.js';
var karmaConf = require(karmaConfPath);

var sources = [
  'src/module.js', 
  'src/helpers.js',
  'src/services/request-animation.js',
  'src/services/spy-api.js',
  'src/services/scroll-container-api.js',
  'src/directives/smooth-scroll.js',
  'src/directives/spy-context.js',
  'src/directives/scroll-container.js',
  'src/directives/scrollspy.js'
];

var targets = 'angular-scroll.{js,min.js,min.js.map}';

gulp.task('clean', function() {
  gulp.src(targets)
    .pipe(clean());
});

gulp.task('lint', function() {
  gulp.src(sources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
  return gulp.src(karmaConf.testFiles)
    .pipe(karma({
      configFile: karmaConfPath,
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('compress', function() {
  gulp.src(sources)
    .pipe(concat('angular-scroll.js', { newLine: '\n\n' }))
    .pipe(ngmin())
    .pipe(gulp.dest('./'))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(uglify({ outSourceMap: true }))
    .pipe(gulp.dest('./'))
});

gulp.task('default', ['lint', 'test', 'clean', 'compress']);
