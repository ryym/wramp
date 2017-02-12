#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * 1. Install this package using a relative path in each package
 *    (yarn add --dev --force file:../../root-bin)
 * 2. Run the `root` command to use packages in the root `node_modules`
 *    ($(npm bin)/root eslint src)
 */

const path = require('path');
const spawn = require('child_process').spawn;

const REPO_TO_ROOT_PATH = '../../';
const NPM_BIN_PATH = 'node_modules/.bin';
const toRepoPath = binPath => path.resolve(binPath, '../../../');
const toRootRepoPath = repoPath => path.resolve(repoPath, REPO_TO_ROOT_PATH);

const binPath = process.argv[1];  // A path like `/xx/packages/repo/node_modules/.bin/root`
const command = process.argv[2];
const options = process.argv.slice(3);

const rootPath = toRootRepoPath(toRepoPath(binPath));
const commandPath = `${rootPath}/${NPM_BIN_PATH}/${command}`;

console.log(`${commandPath} ${options.join(' ')}`);
spawn(commandPath, options, {
  stdio: 'inherit',
});
