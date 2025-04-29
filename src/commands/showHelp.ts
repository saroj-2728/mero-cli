import chalk from "chalk";

export function showDetailedHelp() {
        console.log('Mero-CLI is a command line tool to automate the process of filling IPO forms, checking available IPOs and other related things.\n');

        console.log('Usage: mero-cli [command] [options]\n');
        console.log('Commands:');

        console.log(chalk.green('Save credentials:'), '\n\t mero-cli save (Values will be prompted)');
        console.log(chalk.green('Update credentials:'), '\n\t mero-cli update (Values will be prompted)');
        console.log(chalk.green('Show credentials:'),'\n\t mero-cli show');
        // console.log(chalk.green('Show credentials with password:'), '\n\t mero-cli show -p');

        console.log(chalk.green('Show detailed help:'), '\n\t mero-cli help -d');
        console.log(chalk.green('Check available IPOs:'), '\n\t mero-cli aipos');
        console.log(chalk.green('Apply for IPO:'), '\n\t mero-cli apply');
        console.log(chalk.green('Apply an IPO with all the saved credentials:'), '\n\t mero-cli apply -a');
}