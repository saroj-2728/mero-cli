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
        },
        {
            type: 'input',
            name: 'password',
            message: 'Enter your password:',
        },
        {
            type: 'input',
            name: 'dp',
            message: 'Enter your Depository Participant ID:',
        }, 
        {
            type: 'input',
            name: 'crnNumber',
            message: 'Enter your CRN Number:',
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
    const credentials = await getUserInfo();

    await saveCredentials(credentials);

    console.log(chalk.green('Login information saved successfully!'));
}