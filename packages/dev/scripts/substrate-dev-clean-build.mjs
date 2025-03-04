#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import path from 'node:path';

import { logBin, PATHS_BUILD, rimrafSync } from './util.mjs';

const PKGS = path.join(process.cwd(), 'packages');
const DIRS = PATHS_BUILD.map((d) => `build${d}`);

logBin('substrate-dev-clean-build');

/**
 * @internal
 *
 * Retrieves all the files containing tsconfig.*.tsbuildinfo contained withing the directory
 *
 * @param {string} dir
 * @returns {string[]}
 */
function getPaths (dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .reduce((all, p) => {
      if (p.startsWith('tsconfig.') && p.endsWith('.tsbuildinfo')) {
        all.push(path.join(dir, p));
      }

      return all;
    }, DIRS.map((p) => path.join(dir, p)));
}

/**
 * @internal
 *
 * Removes all the specified directories
 *
 * @param {string[]} dirs
 */
function cleanDirs (dirs) {
  dirs.forEach((d) => rimrafSync(d));
}

cleanDirs(getPaths(process.cwd()));

if (fs.existsSync(PKGS)) {
  cleanDirs(getPaths(PKGS));
  cleanDirs(
    fs
      .readdirSync(PKGS)
      .map((f) => path.join(PKGS, f))
      .filter((f) => fs.statSync(f).isDirectory())
      .reduce((/** @type {string[]} */ res, d) => res.concat(getPaths(d)), [])
  );
}
