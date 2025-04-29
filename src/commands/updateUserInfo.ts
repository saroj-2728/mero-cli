import chalk from "chalk"
import inquirer from "inquirer"

import type { Credentials } from "../types/credentials.js"
import { showUserInfo } from "./showUserInfo.js"
import { loadCredentials, saveCredentials } from "../lib/credentials.js"


export const updateUserInfo = async (): Promise<void> => {
    await showUserInfo();

    const credentials: Credentials[] = await loadCredentials();

    if (!credentials || credentials.length === 0) {
        console.log(chalk.red('No saved credentials found. Please save credentials first.'));
        console.log('Help:\n Use the command: mero-cli save to save your credentials.');
        return;
    }

    const { selectedIndex } = await inquirer.prompt([
        {
            type: 'number',
            name: 'selectedIndex',
            message: 'Which information would you like to update? (Enter index number)',
            validate: (input) => {
                const num = Number(input);
                return num >= 0 && num < credentials?.length ? true : "Invalid selection.";
            },
        }
    ])

    const selectedCredential = credentials[selectedIndex];

    console.log("Enter the new information:")
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: 'Enter your username:',
            default: selectedCredential.username,
            validate: (input) => input ? true : 'Username cannot be empty.',
        },
        {
            type: 'input',
            name: 'password',
            message: 'Enter your password:',
            default: selectedCredential.password,
            validate: (input) => input ? true : 'Password cannot be empty.',
        },
        {
            type: 'input',
            name: 'dp',
            message: 'Enter your Depository Participant ID:',
            default: selectedCredential.dp,
            validate: (input) => input ? true : 'Depository Participant ID cannot be empty.',
        },
        {
            type: 'input',
            name: 'crnNumber',
            message: 'Enter your CRN Number:',
            default: selectedCredential.crnNumber,
            validate: (input) => input ? true : 'CRN Number cannot be empty.',
        },
        {
            type: 'input',
            name: 'pin',
            message: 'Enter your transaction PIN:',
            default: selectedCredential.pin,
            validate: (input) => {
                if (input.length !== 4) {
                    return 'PIN must be exactly 4 digits long.';
                }
                return true;
            }
        }
    ]);

    console.log(chalk.green('Updated information:'));
    console.table(answers);

    try {
        await saveCredentials(answers);
        console.log(chalk.green('Credentials updated successfully!'));
    }
    catch (err: any) {
        console.log(chalk.red('Error updating credentials!', err?.message));
    }
}