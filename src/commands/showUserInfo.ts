import chalk from "chalk";
import { loadCredentials } from "../config.js";
import type { Credentials } from "../types/credentials.js";

export const showUserInfo = async (): Promise<void> => {
    const credentials: Credentials[] = await loadCredentials();
    if (credentials) {
        console.log(chalk.green('Saved Login Information:'));
        console.table(credentials)
    }
    else {
        console.log(chalk.red('No login information found.'));
    }
}