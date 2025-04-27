import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const secretKeyFilePath = path.join(__dirname, '..', 'assets', 'secret.key');


// Constants
const algorithm = 'aes-256-cbc'; // AES encryption
const keyLength = 32; // 256 bits
const ivLength = 16;  // 128 bits


// Function to generate or load secret key
export const getSecretKey = async () => {
    try {
        if (await fs.pathExists(secretKeyFilePath)) {
            // Load existing key
            return await fs.readFile(secretKeyFilePath);
        } 
        else {
            // Generate new key
            const newKey = crypto.randomBytes(keyLength);
            await fs.ensureDir(path.dirname(secretKeyFilePath));
            await fs.writeFile(secretKeyFilePath, newKey);
            return newKey;
        }
    } 
    catch (error) {
        console.error('Error handling secret key:', error);
        throw error;
    }
};


// Function to encrypt text
export const encryptText = async (text: string): Promise<string> => {
    const key = await getSecretKey();
    const iv = crypto.randomBytes(ivLength);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return IV + encrypted data
    return iv.toString('hex') + ':' + encrypted;
};


// Function to decrypt text
export const decryptText = async (data: string): Promise<string> => {
    const key = await getSecretKey();
    const [ivHex, encryptedText] = data.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};