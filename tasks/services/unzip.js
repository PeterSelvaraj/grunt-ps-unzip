/*
 * Unzip Service
 *
 * Copyright (c) 2023 Peter Selvaraj
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const { log } = require('console');
const unzipper = require('unzipper');

class UnzipSvc {
  #fileIndex = 0;

  #createDest(dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
  }

  #unzipFile(opts, done) {
    if (fs.existsSync(opts.file)) {
      this.#createDest(opts.dest);
      const stream = fs.createReadStream(opts.file);
      const pipe = unzipper.Extract({ path: opts.dest });
      stream.pipe(pipe).on('close', done);
    } else {
      log(`File ${opts.file} does not exist!`);
      done();
    }
  }

  unzipFiles(files, done) {
    if (this.#fileIndex === files.length) {
      this.#fileIndex = 0;
      done();
      return;
    }

    const file = files[this.#fileIndex];

    const opts = {
      file: file.src,
      dest: file.dest
    };

    this.#unzipFile(opts, () => {
      this.#fileIndex++
      this.unzipFiles(files, done);
    });
  }
}

module.exports = new UnzipSvc();
