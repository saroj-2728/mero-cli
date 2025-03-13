import chalk from "chalk";

import { checkAvailableOptions } from "../scrape/checkAvailableOptions.js"


export const applyForIPO = async () => {
    const session = await checkAvailableOptions();
    if (!session) {
        console.log(chalk.red('Login failed. Please check your credentials and try again.'));
        return
    }

    const { companies, page, browser } = session

    for (const company of companies) {
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
                        await sleep(6000);

                        console.log(`${company.name} applied successfully!`);
                        companyElemFound = true;
                        break; // Exit the loop after applying
                    }
                }
            }

            if (!companyElemFound) {
                console.error(`Company ${company.name} not found`);
            }
        }
    }


}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));