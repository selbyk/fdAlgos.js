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
        src: ['test/*.js']
      }
    },
    concat: {
      built: {
        src: ['lib/util.js', 'lib/helpers.js', 'lib/minimalCover.js', 'lib/bernstein.js', 'lib/bcnf.js', 'fdalgos-wt.js'],
        dest: 'build/fdalgos-building.js',
      },
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
    },
    replace: {
      buildreplace: {
        src: ['build/fdalgos-building.js'], // source files array (supports minimatch)
        dest: 'build/fdalgos-wt.js', // destination directory or file
        replacements: [{
          from: /^var [^ ]+ = require\('\..+$/gm, // string replacement
          to: ''
        },{
          from: /require\(\'\..+$/gm, // string replacement
          to: ''
        }, {
          from: /^module.exports = .*;$/gm, // regex replacement ('Fooo' to 'Mooo')
          to: '' //'M$2'
        }]
      }
    },
    shell: {
      deploywt: {
        command: 'wt create ./build/fdalgos-wt.js'
      }
    },
    clean: {
      js: ["build/*.js"] //, "!path/to/dir/*.min.js"]
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task.
  grunt.registerTask('default', ['jshint', 'mochaTest']);
  grunt.registerTask('buildwt', ['clean', 'concat', 'replace']);
  grunt.registerTask('deploywt', ['clean', 'concat', 'replace', 'shell:deploywt', 'clean']);
  grunt.registerTask('test', 'mochaTest');

};
