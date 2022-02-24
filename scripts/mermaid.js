#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const error = chalk.bold.red;
const cli = require('mermaid-cli/lib/cli');
const lib = require('mermaid-cli/lib');

cli.parse(process.argv.slice(2), (err, message, options) => {
  if (err) {
    console.error(error('\nYou had errors in your syntax. Use --help for further information.'));
    err.forEach(e => {
      console.error(e.message);
    });

    return;
  }
  if (message) {
    console.log(message);

    return;
  }

  lib.process(options.files, options);
});
