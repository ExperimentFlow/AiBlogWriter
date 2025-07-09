#!/usr/bin/env node

const crypto = require('crypto');

// Generate a secure encryption key
const encryptionKey = crypto.randomBytes(32).toString('hex');

console.log('🔐 Generated Encryption Key:');
console.log('=====================================');
console.log(encryptionKey);
console.log('=====================================');
console.log('');
console.log('📝 Add this to your .env file:');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log('');
console.log('⚠️  Important:');
console.log('- Keep this key secure and never commit it to version control');
console.log('- Use the same key across all environments for data consistency');
console.log('- If you change this key, existing encrypted data will not be decryptable');
console.log('- The key must be at least 32 characters long'); 