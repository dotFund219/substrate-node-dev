// Copyright 2024 @substrate-dev/dev-test Your Name

import { browser } from './browser.js';
import { expect } from './expect.js';
import { jest } from './jest.js';
import { lifecycle } from './lifecycle.js';
import { suite } from './suite.js';

/**
 * Exposes the jest-y environment via globals.
 */
export function exposeEnv (isBrowser: boolean): void {
  [expect, jest, lifecycle, suite, isBrowser && browser].forEach((env) => {
    env && Object
      .entries(env())
      .forEach(([key, fn]) => {
        globalThis[key as 'undefined'] ??= fn;
      });
  });
}
