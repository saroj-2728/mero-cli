import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import type { Credentials } from '../types/credentials.js';
import { encryptText, decryptText } from './encryption.js'

// Get the directory name using import.meta.url in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const configFilePath = path.join(__dirname, '..', 'assets', 'config.json');


// Encrypt sensitive fields
const encryptSensitiveFields = async (creds: Credentials): Promise<Credentials> => {
  return {
    ...creds,
    password: await encryptText(creds.password),
    pin: await encryptText(creds.pin),
    crnNumber: await encryptText(creds.crnNumber),
  };
};


// Decrypt sensitive fields
const decryptSensitiveFields = async (creds: Credentials): Promise<Credentials> => {
  return {
    ...creds,
    password: await decryptText(creds.password),
    pin: await decryptText(creds.pin),
    crnNumber: await decryptText(creds.crnNumber),
  };
};


// Function to save credentials for a specific user
export const saveCredentials = async (newCreds: Credentials) => {
  try {
    let credentials = await loadCredentials(true); // Load existing credentials

    // If there are no credentials saved yet, create an empty array
    if (!Array.isArray(credentials)) {
      credentials = [];
    }

    const existingIndex = credentials.findIndex((user: { username: string }) => user.username === newCreds.username);

    const encryptedNew = await encryptSensitiveFields(newCreds);

    if (existingIndex !== -1) {
      // Update the existing user's credentials
      credentials[existingIndex] = encryptedNew;
    }
    else {
      // Add new user
      credentials.push(encryptedNew);
    }

    const assetsDir = path.dirname(configFilePath);
    await fs.ensureDir(assetsDir); // Create the directory if it doesn't exist

    await fs.writeJson(configFilePath, credentials, { spaces: 2 });
  }
  catch (err) {
    console.error('Error saving credentials:', err);
  }
};

// Function to load credentials (returns an array of users)
export const loadCredentials = async (decrypt = false) => {
  try {
    if (!(await fs.pathExists(configFilePath))) return [];

    const storedCreds: Credentials[] = await fs.readJson(configFilePath);

    if (!decrypt) {
      return storedCreds;
    }

    return await Promise.all(storedCreds.map(decryptSensitiveFields));
  }
  catch (err) {
    console.error('Error loading credentials:', err);
    return [];
  }
};

// Function to get specific user credentials by username
export const getCredentialsByUsername = async (username: string) => {
  const credentials = await loadCredentials();
  return credentials?.find((user) => user.username === username) || null;
};
