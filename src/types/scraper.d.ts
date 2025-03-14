import type { Page } from 'puppeteer';
import type { Browser } from 'puppeteer';
import type { CompanyInfo } from './companyInfo';

export interface Session {
    page: Page;
    browser: Browser;
    companies: CompanyInfo[];
    creds: { crnNumber: string; pin: string; }
}