import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Credentials } from './types/credentials.js';

// Get the directory name using import.meta.url in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const configFilePath = path.join(__dirname, 'config.json');


// Function to save credentials for a specific user
export const saveCredentials = async (newCreds: Credentials) => {
  try {
    let credentials = await loadCredentials(); // Load existing credentials
    const newCredential = { ...newCreds };

    // If there are no credentials saved yet, create an empty array
    if (!Array.isArray(credentials)) {
      credentials = [];
    }

    const existingIndex = credentials.findIndex((user: { username: string }) => user.username === newCredential.username);

    if (existingIndex !== -1) {
      // Update the existing user's credentials
      credentials[existingIndex] = newCredential;
    }
    else {
      // Add new user
      credentials.push(newCredential);
    }

    await fs.writeJson(configFilePath, credentials, { spaces: 2 });
    console.log('Credentials saved!');
  }
  catch (err) {
    console.error('Error saving credentials:', err);
  }
};

// Function to load credentials (returns an array of users)
export const loadCredentials = async () => {
  try {
    if (await fs.pathExists(configFilePath)) {
      const credentials = await fs.readJson(configFilePath);
      return credentials;
    }
    return null; // If no credentials are stored
  }
  catch (err) {
    console.error('Error loading credentials:', err);
    return null;
  }
};

// Function to get specific user credentials by username
export const getCredentialsByUsername = async (username: string) => {
  const credentials = await loadCredentials();
  return credentials?.find((user: { username: string }) => user.username === username) || null;
};
