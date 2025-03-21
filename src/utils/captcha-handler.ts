import chalk from 'chalk';
import { Page } from 'puppeteer';
import inquirer from 'inquirer';

/**
 * Handles captcha by displaying it in the terminal and getting user input
 * @param page Puppeteer page instance
 * @returns User entered captcha text
 */
export async function handleCaptcha(page: Page): Promise<string> {
    try {
        await page.waitForSelector('img[alt="captcha"]');

        // Extract the base64 image data
        const captchaBase64 = await page.evaluate(() => {
            const imgElement = document.querySelector('img[alt="captcha"]') as HTMLImageElement;
            return imgElement?.src || '';
        });

        if (!captchaBase64) {
            console.log(chalk.red('Captcha image not found'));
            return "";
        }

        try {
            // Dynamic import to avoid requiring it if not available
            const terminalImage = await import('terminal-image');

            // Convert base64 to buffer
            const imageBuffer = Buffer.from(
                captchaBase64.replace(/^data:image\/png;base64,/, ''),
                'base64'
            );

            // Display in terminal with adjusted size and improved clarity
            console.log('Captcha:');

            // Adjust these options to control the size and quality
            const renderedImage = await terminalImage.default.buffer(imageBuffer, {
                width: '40%',
                height: '40%',
                preserveAspectRatio: true,
            });

            console.log(renderedImage);
        }
        catch (err) {
            console.log(chalk.red('Could not display image in terminal.'));
            console.log('Captcha base64 (for debugging):', captchaBase64.substring(0, 50) + '...');
        }

        // await sleep(20000);
        return await getCaptchaText();
    }
    catch (err) {
        console.log(chalk.red('Could not display image in terminal.'));
        return ""
    }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getCaptchaText = async () => {
    const captchaAnswer = await inquirer.prompt([{
        type: 'input',
        name: 'captcha',
        message: 'Enter the captcha text:',
        validate: (value: string) => {
            if (value.length === 5) {
                return true;
            }
            return 'Captcha should be 5 characters long';
        }
    }]);

    return captchaAnswer.captcha;
}