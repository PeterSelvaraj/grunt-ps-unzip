/*
 * grunt-ps-unzip
 *
 * Copyright (c) 2023 Peter Selvaraj
 * Licensed under the MIT license.
 */

'use strict';

const glob = require('fast-glob');
const { log } = require('console');
const fileSvc = require('grunt-ps-file');

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js'
      ],

      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['tmp']
    },

    psUnzip: {
      demoTask1: {
        options: {

        },
        files: {
          'tmp': 'test/fixtures/test1.zip'
        }
      },

      demoTask2: {
        options: {

        },
        dest: 'tmp',
        src: 'test/fixtures/test2.zip'
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('psUnzipTest', () => {
    let success = true;
    let files = glob.sync('test/expected/**');

    files.forEach(file => {
        const outFile = file.replace('test/expected', 'tmp');
        const expData = fileSvc.read(file).trim();
        const outData = fileSvc.read(outFile).trim();

        if (expData !== outData) {
            success = false;
            log(`Output file ${outFile} is invalid!`);
        }
    });

    if (success) {
        log('All tests passed successfully!');
    }
  });

  // Whenever the "dev" task is run, first lint, then run this
  // plugin's task(s).
  grunt.registerTask('dev', ['jshint', 'psUnzip']);

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'psUnzip', 'psUnzipTest']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['psUnzip']);
};
