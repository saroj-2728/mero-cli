import chalk from "chalk";
import inquirer from 'inquirer';
import * as cheerio from 'cheerio';

import { login } from "./login.js";

import { showUserInfo } from "../commands/showUserInfo.js";
import { loadCredentials } from "../config.js";

import type { CompanyInfo } from "../types/companyInfo.js";

export const scrapeData = async () => {
  
};