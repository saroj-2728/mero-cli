import chalk from "chalk";
import inquirer from "inquirer";

import { checkAvailableOptions, listCompanies } from "../scrape/checkAvailableOptions.js"
import { loadCredentials } from "../config.js";
import { CompanyInfo } from "../types/companyInfo.js";

import type { Session } from "../types/scraper.d.ts";


export const applyForIPO = async (opts: any) => {
    try {
        if (!opts?.all) {
            const session = await checkAvailableOptions();

            if (!session) {
                console.log(chalk.red('Process stopped due to an error. Please check the error message above.'));
                return
            }

            const { companies } = session;

            console.log();

            const selectedIndex = await getUserInput(companies.length);

            const company = companies[selectedIndex];

            // console.log(`"Selected Index" is ${selectedIndex}, Company name: ${companyName}`);

            await applyForIPOCommand(session, company);

        }
        else {
            const credentials = await loadCredentials();
            for (const credential of credentials) {
                const session = await listCompanies(credential);
                if (!session) {
                    console.log(chalk.red('Login failed. Please check your credentials and try again.'));
                    return
                }

                const { companies } = session;
                const selectedIndex = await getUserInput(companies.length);

                const company = companies[selectedIndex];

                await applyForIPOCommand(session, company);
            }
        }
    }
    catch (error: any) {
        console.error(chalk.red("An error occurred: ", error?.message));
    }
}


const getUserInput = async (companyLength: number): Promise<number> => {
    const { selectedIndex } = await inquirer.prompt([
        {
            type: "number",
            name: "selectedIndex",
            message: "Enter the number of the company you want to apply to (Enter index):",
            validate: (input) => {
                const num = Number(input);
                return (num >= 0 && num < companyLength) ? true : "Invalid selection.";
            },
        },
    ]);

    return +selectedIndex
}

const applyForIPOCommand = async (session: Session, company: CompanyInfo) => {
    const { creds, page, browser } = session;

    try {
        const { kitta } = await inquirer.prompt([
            {
                type: "input",
                name: "kitta",
                message: "Enter the number of kitta you want to apply for (default: 10, press Enter to skip):",
                default: "10",
                validate: (input) => {
                    if (input.trim() === "") return true; // Allow skipping
                    const num = Number(input);
                    return num > 0 && num <= 100 ? true : "Please enter a number between 1 and 100.";
                },
            },
        ]);


        if (company.hasApplyButton && company.shareType === 'IPO' && company.subGroup.includes('For General Public') && company.shareGroup === 'Ordinary Shares') {
            console.log(`Applying for ${company.name}...`);

            // Loop through all .company-list elements
            const companyElems = await page.$$('.company-list');

            let companyElemFound = false;

            for (const companyElem of companyElems) {
                // Get the company name from the current element
                const companyName = await companyElem.$eval('.company-name span[tooltip="Company Name"]', (el) => el.textContent?.trim());

                if (companyName === company.name) {
                    // Once the company is found, click the "Apply" button
                    const applyButton = await companyElem.$('.btn-issue');
                    if (applyButton) {
                        await applyButton.click();
                        await page.waitForNavigation({ waitUntil: 'networkidle0' });

                        console.log(`${company.name} applied successfully!`);
                        companyElemFound = true;
                    }
                }
            }

            if (!companyElemFound) {
                console.log(chalk.red(`Company ${company.name} not found`));
            }
        }

        await page.waitForSelector('#selectBank');
        await page.waitForSelector('#selectBank option:not(:first-child)');
        const options = await page.$$('#selectBank option:not(:first-child)');
        const value = await options[0].evaluate(option => option.value);
        await page.select('#selectBank', value);

        await page.waitForSelector('#accountNumber')
        await page.waitForSelector('#accountNumber option:not(:first-child)');
        const accountOptions = await page.$$('#accountNumber option:not(:first-child)');
        const accountValue = await accountOptions[0].evaluate(option => option.value);
        await page.select('#accountNumber', accountValue);

        await page.waitForSelector('#appliedKitta')
        await page.type('#appliedKitta', kitta)

        await page.waitForSelector('#crnNumber')
        await page.type('#crnNumber', creds.crnNumber)

        await page.waitForSelector('#disclaimer')
        await page.click('#disclaimer')


        // Wait for the card-footer and then click the "Proceed" button inside it
        await page.waitForSelector('.card-footer button.btn-primary:enabled'); // Ensure it's enabled
        const proceedButton = await page.$('.card-footer button.btn-primary:enabled');

        if (proceedButton) {
            await proceedButton.click();
        }
        else {
            console.error('Proceed button not found or is disabled');
        }

        // await page.waitForNavigation({ waitUntil: 'networkidle0' });

        await page.waitForSelector('#transactionPIN')
        await page.type('#transactionPIN', creds.pin);


        await page.waitForSelector('.confirm-page-btn button.btn-primary:enabled');
        const applyButton = await page.$('.confirm-page-btn button.btn-primary:enabled');


        if (applyButton) {
            await applyButton.click();
        }
        else {
            console.error('Apply button not found or is disabled');
        }

        await browser.close();
    }
    catch (error: any) {
        console.error(chalk.red("Error while applying for IPO application: ", error?.message));
        await browser.close();
    }
}