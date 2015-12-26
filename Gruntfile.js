/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
      // Task configuration.
      jshint: {
        options: {
          "globals": {
            "jasmine": false,
            "spyOn": false,
            "it": false,
            "console": false,
            "describe": false,
            "expect": false,
            "beforeEach": false,
            "waits": false,
            "waitsFor": false,
            "runs": false
          },

          "node": true,
          "esnext": true,
          "browser": true,

          "boss": false,
          "curly": false,
          "debug": false,
          "devel": false,
          "eqeqeq": true,
          "evil": true,
          "forin": false,
          "immed": true,
          "laxbreak": false,
          "newcap": true,
          "noarg": true,
          "noempty": false,
          "nonew": false,
          "nomen": false,
          "onevar": true,
          "plusplus": false,
          "regexp": false,
          "undef": true,
          "sub": true,
          "strict": false,
          "white": true,
          "unused": true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'nodeunit']
      }
    },
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['test/**/*.js']
      }
    }
  });

// These plugins provide necessary tasks.
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
// Add the grunt-mocha-test tasks.
grunt.loadNpmTasks('grunt-mocha-test');

// Default task.
grunt.registerTask('default', ['jshint', 'mochaTest']);
grunt.registerTask('test', 'mochaTest');

};