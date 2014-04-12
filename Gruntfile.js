module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['src/**/*.js']
      }
    },
    clean: {
      dist:   ['angular-scroll.js', 'angular-scroll.min.js', 'angular-scroll.min.js.map']
    },
    concat: {
      options: {
        separator: "\n\n"
      },
      dist: {
        src: [
          'src/module.js', 
          'src/services/request-animation.js',
          'src/services/scroll-position.js',
          'src/services/scroller.js',
          'src/services/spy-api.js',
          'src/services/scroll-container-api.js',
          'src/directives/smooth-scroll.js',
          'src/directives/spy-context.js',
          'src/directives/scroll-container.js',
          'src/directives/scrollspy.js'
        ],
        dest: 'angular-scroll.js'
      }
    },
    ngmin: {
      dist: {
        src: ['angular-scroll.js'],
        dest: 'angular-scroll.min.js'
      }
    },
    uglify: {
      dist: {
        options: {
          report: 'gzip', 
          sourceMap: 'angular-scroll.min.js.map'
        },
        files: {
          'angular-scroll.min.js': ['angular-scroll.min.js']
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ngmin');

  grunt.registerTask('default', ['jshint', 'clean', 'concat', 'ngmin', 'uglify']);
};
