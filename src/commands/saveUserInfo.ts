import chalk from "chalk";
import type { Credentials } from "../types/credentials.js";
import { saveCredentials } from "../config.js";

export const saveUserInfo = async (credentials: Credentials): Promise<void> => {
    if (!credentials.username || !credentials.password || !credentials.dp) {
        console.log(chalk.red('Error: Username, password and depository participant id are required!'));
        process.exit(1);
    }

    await saveCredentials(credentials.username, credentials.password, credentials.dp);
    console.log(chalk.green('Login information saved successfully!'));
}