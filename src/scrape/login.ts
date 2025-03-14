import puppeteer from 'puppeteer';

export const login = async (
  username: string, password: string, dp: string
): Promise<{
  page: puppeteer.Page;
  browser: puppeteer.Browser
} | undefined> => {
  try {
    // Launch browser with headless:false to see what's happening
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Add user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    await page.goto("https://meroshare.cdsc.com.np/#/login", {
      waitUntil: "networkidle2",
      timeout: 60000 // Extend timeout to 60 seconds
    });

    await page.type('#username', username);
    await page.type('#password', password);

    await page.waitForSelector('.select2-container');
    await page.click('.select2-container');

    await page.waitForSelector('.select2-search__field');
    await page.type('.select2-search__field', dp);

    await page.waitForSelector('.select2-results__option');
    await page.click('.select2-results__option');

    console.log('Logging in...');
    await page.waitForSelector('.sign-in', { visible: true });

    await page.click('.sign-in'),
      await page.waitForNavigation({ waitUntil: 'networkidle0' })

    return { page, browser };
  }
  catch (err: any) {
    console.error('Login automation error:', err?.message);
    return undefined;
  }
};