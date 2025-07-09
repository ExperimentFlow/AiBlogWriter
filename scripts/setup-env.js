#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '..', '.env');
const exampleEnvPath = path.join(__dirname, '..', '.env.example');

// Generate a secure encryption key
const encryptionKey = crypto.randomBytes(32).toString('hex');

// Generate a secure NextAuth secret
const nextAuthSecret = crypto.randomBytes(32).toString('hex');

// Default environment content
const envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# Encryption
ENCRYPTION_KEY=${encryptionKey}

# Next.js
NEXTAUTH_SECRET=${nextAuthSecret}
NEXTAUTH_URL=http://localhost:3000

# Stripe (optional - for testing)
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Other environment variables as needed
`;

// Example environment content
const exampleEnvContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# Encryption
ENCRYPTION_KEY=your_64_character_encryption_key_here

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Stripe (optional - for testing)
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Other environment variables as needed
`;

try {
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    console.log('📝 Current encryption key in .env:');
    
    const currentEnv = fs.readFileSync(envPath, 'utf8');
    const encryptionKeyMatch = currentEnv.match(/ENCRYPTION_KEY=([^\n]+)/);
    
    if (encryptionKeyMatch) {
      console.log(`   ${encryptionKeyMatch[1]}`);
    } else {
      console.log('   No encryption key found');
    }
    
    console.log('');
    console.log('🔐 New encryption key generated:');
    console.log(`   ${encryptionKey}`);
    console.log('');
    console.log('📝 You can manually update your .env file with the new key above');
  } else {
    // Create .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with encryption key');
    console.log(`🔐 Encryption Key: ${encryptionKey}`);
  }
  
  // Create .env.example if it doesn't exist
  if (!fs.existsSync(exampleEnvPath)) {
    fs.writeFileSync(exampleEnvPath, exampleEnvContent);
    console.log('✅ Created .env.example file');
  }
  
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Update DATABASE_URL in .env with your actual database connection');
  console.log('2. Update other environment variables as needed');
  console.log('3. Run: node scripts/encrypt-existing-keys.js (if you have existing data)');
  console.log('');
  console.log('⚠️  Important:');
  console.log('- Keep your .env file secure and never commit it to version control');
  console.log('- Use the same encryption key across all environments for data consistency');
  console.log('- If you change the encryption key, existing encrypted data will not be decryptable');
  
} catch (error) {
  console.error('❌ Error creating environment files:', error.message);
  console.log('');
  console.log('🔐 Generated Encryption Key:');
  console.log(`   ${encryptionKey}`);
  console.log('');
  console.log('📝 Please manually create a .env file with the content above');
} 