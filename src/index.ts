#!/usr/bin/env node
import { Command } from 'commander';

import { checkAvailableOptions } from './scrape/checkAvailableOptions.js';
import { showUserInfo } from './commands/showUserInfo.js';
import { saveUserInfo } from './commands/saveUserInfo.js';
import { applyForIPO } from './commands/applyForIPO.js';
import { updateUserInfo } from './commands/updateUserInfo.js';
import { showDetailedHelp } from './commands/showHelp.js';
import { checkIPOResult } from './commands/checkIPOResult.js';

const program = new Command();

program
  .command('help')
  .description('Display help information')
  .option('-d, --details', 'Display detailed help information')
  .action((opts) => {
    if (opts.details) {
      showDetailedHelp()
    }
    else {
      console.log('For detailed help, use mero-cli help -d\n');
      program.help();
    }
  });


// Command to save login information
program
  .command('save')
  .description('Save credentials. Values will be prompted')
  .action(async (opts) => {
    await saveUserInfo()
  });


// Command to show saved login information
program
  .command('show')
  .description('Show saved credentials')
  .option('-p, --password', 'Show password')
  .action(async (otps) => {
    await showUserInfo(otps?.password);
  });


// Command to update login information
program
  .command('update')
  .description('Update saved credentials. Values will be prompted')
  .action(async () => {
    await updateUserInfo();
  });


// Command to check the available options
program
  .command('aipos')
  .description('Check the available IPOs')
  .action(async () => {
    await checkAvailableOptions();
    process.exit(0);
  });


// Command to apply
program
  .command('apply')
  .description('Apply for IPO')
  .option('-a, --all', 'Apply for all available users')
  .action(async (opts) => {
    await applyForIPO(opts);
  });


// Command to check the alloted shares
program
  .command('ripos')
  .description('Check the IPO result')
  .action(async () => {
    await checkIPOResult();
    process.exit(0);
  });


// Parse the arguments
program.parse(process.argv);