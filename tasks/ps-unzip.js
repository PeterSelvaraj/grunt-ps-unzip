/*
 * grunt-ps-unzip
 *
 * Copyright (c) 2023 Peter Selvaraj
 * Licensed under the MIT license.
 */

'use strict';

const log = require('grunt-ps-log');
const unzipSvc = require('./services/unzip');

module.exports = function (grunt) {
  grunt.registerMultiTask('psUnzip', 'Unzips archives in zip format', function () {
    const files = [];
    const done = this.async();

    log.log(`Starting ${this.target} task...`);

    this.files.forEach(item => {
      item.src.forEach(src => {
        files.push({
          src,
          dest: item.dest
        });
      });
    });

    unzipSvc.unzipFiles(files, () => {
      log.ok(`Task ${this.target} is complete!`);
      done();
    });
  });
};
