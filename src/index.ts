#!/usr/bin/env node
import { Command } from 'commander';
import { checkAvailableOptions } from './scrape/checkAvailableOptions.js';

import { showUserInfo } from './commands/showUserInfo.js';
import { saveUserInfo } from './commands/saveUserInfo.js';
import { applyForIPO } from './commands/applyForIPO.js';

const program = new Command();

program
  .command('help')
  .description('Display help information')
  .option('-d, --details', 'Display detailed help information')
  .action((opts) => {
    if (opts.details) {
      console.log('Mero-CLI is a command line tool to scrape data from MeroShare website.\n');
      console.log('Usage: mero-cli [command] [options]\n');
      console.log('Commands:');
      console.log('Save login info: \n\t mero-cli save -u <username> -p <password> -d <depository-participant-id>');
      console.log('Show login info: \n\t mero-cli show');
    }
    else {
      program.help();
    }
  });


// Command to save login information
program
  .command('save')
  .description('Save login information')
  .option('-d, --dp <dp>', 'Depository Participant ID')
  .option('-u, --username <username>', 'Username for login')
  .option('-p, --password <password>', 'Password for login')
  .action(async (opts) => {
    await saveUserInfo(opts)
  });


// Command to show saved login information
program
  .command('show')
  .description('Show saved login information')
  .action(async () => {
    await showUserInfo();
  });


// Command to check the available options
program
  .command('check')
  .description('Check the available ...')
  .action(async () => {
    await checkAvailableOptions();
    process.exit(0);
  });


// Command to apply
program
  .command('apply')
  .description('Apply for IPO')
  .action(async () => {
    await applyForIPO();
  });


// Parse the arguments
program.parse(process.argv);