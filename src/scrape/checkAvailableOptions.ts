import chalk from "chalk";
import puppeteer from "puppeteer";
import inquirer from "inquirer";
import * as cheerio from "cheerio";

import { login } from "./login.js";
import { showUserInfo } from "../commands/showUserInfo.js";
import { loadCredentials } from "../lib/credentials.js";

import type { CompanyInfo } from "../types/companyInfo.js";
import { Credentials } from "../types/credentials.js";


export const checkAvailableOptions = async (): Promise<{
    page: puppeteer.Page;
    browser: puppeteer.Browser;
    companies: CompanyInfo[];
    creds: { crnNumber: string; pin: string; }
} | undefined> => {
    try {
        await showUserInfo(null);

        const credentials = await loadCredentials();

        if (!credentials || credentials.length === 0) {
            console.log(chalk.red("No saved credentials found. Please save credentials first."));
            console.log("Help:\n Use the command: mero-cli save");
            return;
        }

        const { selectedIndex } = await inquirer.prompt([
            {
                type: "number",
                name: "selectedIndex",
                message: "Enter the number of the account you want to use (Enter index):",
                validate: (input) => {
                    const num = Number(input);
                    return num >= 0 && num < credentials?.length ? true : "Invalid selection.";
                },
            },
        ]);

        const session = await listCompanies(credentials[selectedIndex]);
        return session
    }
    catch (err: any) {
        console.error('Error checking available options:', err?.message);
        return;
    }
}


export const listCompanies = async (credentials: Credentials): Promise<{
    page: puppeteer.Page;
    browser: puppeteer.Browser;
    companies: CompanyInfo[];
    creds: { crnNumber: string; pin: string; }
} | undefined> => {
    try {
        const session = await login(credentials.username, credentials.password, credentials.dp);
        const creds = { crnNumber: credentials.crnNumber, pin: credentials.pin };

        if (!session) {
            console.log(chalk.red('Login failed. Please check your credentials and try again.'));
            return;
        }

        const { page, browser } = session

        await page.goto('https://meroshare.cdsc.com.np/#/asba', {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        await page.waitForSelector('body', { visible: true });

        // Check if company-list elements exist
        const hasCompanyList = await page.evaluate(() => {
            return document.querySelectorAll('.company-list').length > 0;
        });

        if (!hasCompanyList) {
            console.log(chalk.red('No companies found. No Available IPOs.'));
            await browser.close();
            return;
        }

        const html = await page.content();
        const companies = await parseCompanies(html);

        console.log(chalk.green('Companies: '));
        console.table(companies);

        return { creds, page, browser, companies };

    }
    catch (err) {
        console.error('Error checking available options:', err);
        return;
    }
}


export const parseCompanies = async (html: string): Promise<CompanyInfo[]> => {
    try {
        const $ = cheerio.load(html);
        const companies: CompanyInfo[] = [];

        // Select all divs with class "company-list"
        const companyListElements = $('.company-list');

        if (companyListElements.length === 0) {
            console.log(chalk.red('No companies found. No Available IPOs.'));
            return companies;
        }

        companyListElements.each((_, element) => {
            try {
                // Extract company name
                const name = $(element).find('span[tooltip="Company Name"]').text().trim();

                // Extract subgroup information (includes code in parentheses)
                const subGroup = $(element).find('span[tooltip="Sub Group"]').text().trim();

                // Extract share type
                const shareType = $(element).find('span[tooltip="Share Type"]').text().trim();

                // Extract share group
                const shareGroup = $(element).find('span[tooltip="Share Group"]').text().trim();

                // Check if apply button exists
                const hasApplyButton = $(element).find('button.btn-issue').length > 0;

                companies.push({
                    name,
                    subGroup,
                    shareType,
                    shareGroup,
                    hasApplyButton
                });
            }
            catch (error) {
                console.error('Error parsing company element:', error);
            }
        });

        return companies;
    }
    catch (err: any) {
        console.error('Error parsing companies:', err?.message);
        return [];
    }
};
