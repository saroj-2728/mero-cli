import chalk from "chalk";
import { loadCredentials } from "../lib/credentials.js";
import type { Credentials } from "../types/credentials.js";

export const showUserInfo = async (showPassword: string | null): Promise<void> => {
    try {
        const credentials: Credentials[] = await loadCredentials();
        if (credentials && Array.isArray(credentials) && credentials.length > 0) {
            if (!showPassword) {
                credentials.forEach((credential) => {
                    credential.password = credential.password.replace(/./g, '*');
                    credential.pin = credential.pin.replace(/./g, '*');
                });
            }
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