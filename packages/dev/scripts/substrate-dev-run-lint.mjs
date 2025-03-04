#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0

import process from 'node:process';
import yargs from 'yargs';

import { __dirname, execPm, GITHUB_REPO, logBin } from './util.mjs';

const TS_CONFIG_BUILD = true;

logBin('substrate-dev-run-lint');

// Since yargs can also be a promise, we just relax the type here completely
const argv = await yargs(process.argv.slice(2))
  .options({
    'skip-eslint': {
      description: 'Skips running eslint',
      type: 'boolean'
    },
    'skip-tsc': {
      description: 'Skips running tsc',
      type: 'boolean'
    }
  })
  .strict()
  .argv;

if (!argv['skip-eslint']) {
  // We don't want to run with fix on CI
  const extra = GITHUB_REPO
    ? ''
    : '--fix';

  execPm(`substrate-exec-eslint ${extra} ${process.cwd()}`);
}

if (!argv['skip-tsc']) {
  execPm(`substrate-exec-tsc --noEmit --emitDeclarationOnly false --pretty${TS_CONFIG_BUILD ? ' --project tsconfig.build.json' : ''}`);
}
