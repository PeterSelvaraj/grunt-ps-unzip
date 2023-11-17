/*
 * Unzip Service
 *
 * Copyright (c) 2023 Peter Selvaraj
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

class UnzipSvc {
  #fileIndex = 0;

  #createFilePath(filePath) {
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async #unzipFile(opts, done) {
    const jsZip = new JSZip();
    const zipData = fs.readFileSync(opts.file);

    await jsZip.loadAsync(zipData);

    let fileCount = 0;
    let writeCount = 0;

    jsZip.forEach(async (fileName, data) => {
      if (data.dir) { return }

      const filePath = path.join(opts.dest, fileName);

      this.#createFilePath(filePath);

      fileCount++;

      data.async('nodebuffer').then(fileContent => {
        writeCount++;
        fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' });
        if (fileCount === writeCount) { done(); }
      });
    });
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
