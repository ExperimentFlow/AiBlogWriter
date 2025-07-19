import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

// Get encryption key from environment variable
function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required for encryption');
  }
  if (key.length < 32) {
    throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
  }
  return key;
}

/**
 * Encrypts a string value
 * @param text - The text to encrypt
 * @param context - Optional context for additional authentication (default: 'general')
 * @returns Encrypted string in format: salt:iv:tag:encryptedData
 */
export function encrypt(text: string, context: string = 'general'): string {
  try {
    if (!text) return '';
    
    const key = getEncryptionKey();
    
    // Generate a random salt
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    // Generate a random IV
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Derive key from password using PBKDF2
    const derivedKey = crypto.pbkdf2Sync(key, salt, ITERATIONS, KEY_LENGTH, 'sha512');
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
    cipher.setAAD(Buffer.from(context, 'utf8')); // Additional authenticated data
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get the auth tag
    const tag = cipher.getAuthTag();
    
    // Combine salt:iv:tag:encryptedData
    return `${salt.toString('hex')}:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts an encrypted string
 * @param encryptedText - The encrypted text in format: salt:iv:tag:encryptedData
 * @param context - Optional context for additional authentication (default: 'general')
 * @returns Decrypted string
 */
export function decrypt(encryptedText: string, context: string = 'general'): string {
  try {
    if (!encryptedText) return '';
    
    const key = getEncryptionKey();
    
    // Split the encrypted text into its components
    const parts = encryptedText.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted data format');
    }
    
    const [saltHex, ivHex, tagHex, encryptedData] = parts;
    
    // Convert hex strings back to buffers
    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    
    // Derive key from password using PBKDF2
    const derivedKey = crypto.pbkdf2Sync(key, salt, ITERATIONS, KEY_LENGTH, 'sha512');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
    decipher.setAAD(Buffer.from(context, 'utf8')); // Additional authenticated data
    decipher.setAuthTag(tag);
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Checks if a string is encrypted
 * @param text - The text to check
 * @returns True if the text appears to be encrypted
 */
export function isEncrypted(text: string): boolean {
  if (!text) return false;
  
  // Check if the text follows the encrypted format: salt:iv:tag:encryptedData
  const parts = text.split(':');
  if (parts.length !== 4) return false;
  
  // Check if all parts are valid hex strings
  const [saltHex, ivHex, tagHex] = parts;
  const hexRegex = /^[0-9a-fA-F]+$/;
  
  return hexRegex.test(saltHex) && hexRegex.test(ivHex) && hexRegex.test(tagHex);
}

/**
 * Safely encrypts a value only if it's not already encrypted
 * @param value - The value to encrypt
 * @param context - Optional context for additional authentication (default: 'general')
 * @returns Encrypted value
 */
export function safeEncrypt(value: string, context: string = 'general'): string {
  if (!value) return '';
  
  // If already encrypted, return as is
  if (isEncrypted(value)) {
    return value;
  }
  
  // Encrypt the value
  return encrypt(value, context);
}

/**
 * Safely decrypts a value only if it's encrypted
 * @param value - The value to decrypt
 * @param context - Optional context for additional authentication (default: 'general')
 * @returns Decrypted value
 */
export function safeDecrypt(value: string, context: string = 'general'): string {
  if (!value) return '';
  
  // If not encrypted, return as is
  if (!isEncrypted(value)) {
    return value;
  }
  
  // Decrypt the value
  return decrypt(value, context);
}

/**
 * Generates a secure encryption key
 * @returns A secure encryption key
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
} 