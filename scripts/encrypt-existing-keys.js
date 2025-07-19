#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Encryption configuration (same as in lib/encryption.ts)
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

// Get encryption key from environment variable
function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required for encryption');
  }
  if (key.length < 32) {
    throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
  }
  return key;
}

// Check if a string is encrypted
function isEncrypted(text) {
  if (!text) return false;
  
  // Check if the text follows the encrypted format: salt:iv:tag:encryptedData
  const parts = text.split(':');
  if (parts.length !== 4) return false;
  
  // Check if all parts are valid hex strings
  const [saltHex, ivHex, tagHex] = parts;
  const hexRegex = /^[0-9a-fA-F]+$/;
  
  return hexRegex.test(saltHex) && hexRegex.test(ivHex) && hexRegex.test(tagHex);
}

// Encrypt a string
function encrypt(text) {
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
    const cipher = crypto.createCipherGCM(ALGORITHM, derivedKey);
    cipher.setAAD(Buffer.from('payment-gateway', 'utf8')); // Additional authenticated data
    
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

// Safely encrypt a value only if it's not already encrypted
function safeEncrypt(value) {
  if (!value) return '';
  
  // If already encrypted, return as is
  if (isEncrypted(value)) {
    return value;
  }
  
  // Encrypt the value
  return encrypt(value);
}

async function encryptExistingKeys() {
  try {
    console.log('🔐 Starting encryption of existing secret keys...');
    
    // Check if ENCRYPTION_KEY is set
    if (!process.env.ENCRYPTION_KEY) {
      console.error('❌ ENCRYPTION_KEY environment variable is not set');
      console.log('Please set ENCRYPTION_KEY in your .env file and run this script again');
      process.exit(1);
    }

    // Get all gateway settings
    const gatewaySettings = await prisma.gatewaySetting.findMany({
      select: {
        id: true,
        secretKey: true,
        webhookSecret: true,
        tenantId: true,
      }
    });

    console.log(`📊 Found ${gatewaySettings.length} gateway settings to process`);

    let encryptedCount = 0;
    let skippedCount = 0;

    for (const setting of gatewaySettings) {
      let needsUpdate = false;
      const updateData = {};

      // Check and encrypt secretKey if needed
      if (setting.secretKey && !isEncrypted(setting.secretKey)) {
        updateData.secretKey = safeEncrypt(setting.secretKey);
        needsUpdate = true;
        console.log(`🔒 Encrypting secret key for tenant ${setting.tenantId}`);
      }

      // Check and encrypt webhookSecret if needed
      if (setting.webhookSecret && !isEncrypted(setting.webhookSecret)) {
        updateData.webhookSecret = safeEncrypt(setting.webhookSecret);
        needsUpdate = true;
        console.log(`🔒 Encrypting webhook secret for tenant ${setting.tenantId}`);
      }

      if (needsUpdate) {
        await prisma.gatewaySetting.update({
          where: { id: setting.id },
          data: updateData
        });
        encryptedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log('');
    console.log('✅ Encryption completed!');
    console.log(`📈 Encrypted: ${encryptedCount} settings`);
    console.log(`⏭️  Skipped (already encrypted): ${skippedCount} settings`);
    console.log(`📊 Total processed: ${gatewaySettings.length} settings`);

  } catch (error) {
    console.error('❌ Error during encryption:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
encryptExistingKeys(); 