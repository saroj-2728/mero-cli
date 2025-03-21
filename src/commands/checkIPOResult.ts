import puppeteer from "puppeteer";
import { handleCaptcha } from "../utils/captcha-handler.js";

export async function checkIPOResult() {
    console.log('Check the alloted shares');

    try{
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        await page.goto("https://iporesult.cdsc.com.np/", {
            waitUntil: "networkidle2",
            timeout: 60000
        });

        await page.waitForSelector('#userCaptcha');

        const captchaText = await handleCaptcha(page);
        console.log('Captcha text:', captchaText);

        await page.type('#userCaptcha', captchaText);

        await sleep(10000)

    }
    catch (err: any) {
        console.error('Check alloted shares error:', err?.message);
    }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));