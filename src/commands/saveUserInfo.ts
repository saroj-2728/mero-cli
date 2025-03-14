import chalk from "chalk";
import inquirer from "inquirer";

import type { Credentials } from "../types/credentials.js";
import { saveCredentials } from "../config.js";

export const getUserInfo = async (): Promise<Credentials> => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: 'Enter your username:',
            validate: (input) => input ? true : 'Username cannot be empty.',
        },
        {
            type: 'input',
            name: 'password',
            message: 'Enter your password:',
            validate: (input) => input ? true : 'Password cannot be empty.',
        },
        {
            type: 'input',
            name: 'dp',
            message: 'Enter your Depository Participant ID:',
            validate: (input) => input ? true : 'Depository Participant ID cannot be empty.',
        },
        {
            type: 'input',
            name: 'crnNumber',
            message: 'Enter your CRN Number:',
            validate: (input) => input ? true : 'CRN Number cannot be empty.',
        },
        {
            type: 'input',
            name: 'pin',
            message: 'Enter your transaction PIN:',
            validate: (input) => {
                if (input.length !== 4) {
                    return 'PIN must be exactly 4 digits long.';
                }
                return true;
            }
        }
    ]);
    return answers;
};

export const saveUserInfo = async (): Promise<void> => {
    try {
        const credentials = await getUserInfo();

        await saveCredentials(credentials);

        console.log(chalk.green('Login information saved successfully!'));
    }
    catch (err: any) {
        console.log(chalk.red('Error saving login information:'), err?.message);
    }
}