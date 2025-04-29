import chalk from "chalk";
import { loadCredentials } from "../lib/credentials.js";
import type { Credentials } from "../types/credentials.js";

export const showUserInfo = async (): Promise<void> => {
    try {
        const credentials: Credentials[] = await loadCredentials();
        if (credentials && Array.isArray(credentials) && credentials.length > 0) {
                credentials.forEach((credential) => {
                    credential.password = '********';
                    credential.pin = '****';
                    credential.crnNumber = '********'
                });
            console.log(chalk.green('Saved Credentials:'));
            console.table(credentials)
        }
        else {
            console.log(chalk.red('No saved credentials found. Use the command: mero-cli save to save credentials.'));
        }
    }
    catch (err: any) {
        console.log(chalk.red('Error loading credentials:', err?.message));
    }
}