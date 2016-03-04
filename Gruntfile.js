'use strict';

module.exports = function (grunt) {
  // init config
  grunt.initConfig({
    // default package
    pkg       : grunt.file.readJSON('package.json'),
    // Uglify content
    uglify    : {
      api : {
        files : [{
          expand  : true,
          cwd     : 'src/',
          src     : '**/*.js',
          dest    : 'dist/'
        }]
      }
    },
    // Unit test
    mochacli  : {
      options : {
        'reporter'       : 'spec',
        'inline-diffs'   : false,
        'no-exit'        : true,
        'force'          : false,
        'check-leaks'    : true,
        'bail'           : false
      },
      all     : [ 'test/*.js' ]
    },
    // hint code
    yoctohint : {
      all : [ 'Gruntfile.js', 'src/**/*.js' ]
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('yocto-hint');

  // register tasks
  grunt.registerTask('hint', 'yoctohint');
  grunt.registerTask('test', 'mochacli');
  grunt.registerTask('build', [ 'hint', 'uglify' ]);
  grunt.registerTask('default', [ 'build', 'test' ]);
};
