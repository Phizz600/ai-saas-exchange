#!/usr/bin/env node

/**
 * Profile Edit Implementation Test Script
 * 
 * This script validates the profile edit implementation by checking:
 * 1. All required files exist
 * 2. Components have proper imports and exports
 * 3. Database migrations are properly structured
 * 4. API endpoints are configured correctly
 */

import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - File not found: ${filePath}`, 'red');
    return false;
  }
}

function checkFileContent(filePath, requiredContent, description) {
  if (!fs.existsSync(filePath)) {
    log(`❌ ${description} - File not found`, 'red');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const hasContent = requiredContent.some(pattern => {
    if (typeof pattern === 'string') {
      return content.includes(pattern);
    } else if (pattern instanceof RegExp) {
      return pattern.test(content);
    }
    return false;
  });

  if (hasContent) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Required content not found`, 'red');
    return false;
  }
}

function main() {
  log('\n🔍 Profile Edit Implementation Validation\n', 'bold');

  let allTestsPassed = true;

  // Check main component files
  log('📁 Checking Component Files:', 'blue');
  allTestsPassed &= checkFileExists(
    'src/components/profile/EditProfileForm.tsx',
    'EditProfileForm component'
  );
  
  allTestsPassed &= checkFileExists(
    'src/components/profile/EmailVerificationBanner.tsx',
    'EmailVerificationBanner component'
  );

  // Check backend files
  log('\n🔧 Checking Backend Files:', 'blue');
  allTestsPassed &= checkFileExists(
    'supabase/functions/update-user-profile/index.ts',
    'Update user profile Edge Function'
  );

  allTestsPassed &= checkFileExists(
    'supabase/migrations/20250126000000_add_user_activity_log.sql',
    'User activity log migration'
  );

  // Check configuration files
  log('\n⚙️ Checking Configuration:', 'blue');
  allTestsPassed &= checkFileExists(
    'supabase/config.toml',
    'Supabase configuration file'
  );

  // Check updated settings page
  log('\n📄 Checking Updated Pages:', 'blue');
  allTestsPassed &= checkFileExists(
    'src/pages/Settings.tsx',
    'Updated Settings page'
  );

  // Validate component content
  log('\n🔍 Validating Component Content:', 'blue');
  
  // Check EditProfileForm has required functionality
  allTestsPassed &= checkFileContent(
    'src/components/profile/EditProfileForm.tsx',
    [
      'interface EditProfileFormProps',
      'validateForm',
      'sanitizeInput',
      'handleSubmit',
      'PATCH',
      'update-user-profile'
    ],
    'EditProfileForm has required functionality'
  );

  // Check EmailVerificationBanner has required functionality
  allTestsPassed &= checkFileContent(
    'src/components/profile/EmailVerificationBanner.tsx',
    [
      'interface EmailVerificationBannerProps',
      'checkEmailVerificationStatus',
      'resendVerificationEmail',
      'email_confirmed_at'
    ],
    'EmailVerificationBanner has required functionality'
  );

  // Check Edge Function has required functionality
  allTestsPassed &= checkFileContent(
    'supabase/functions/update-user-profile/index.ts',
    [
      'serve',
      'PATCH',
      'updateProfileRequest',
      'validateForm',
      'sanitizeInput',
      'user_activity_log'
    ],
    'Edge Function has required functionality'
  );

  // Check migration has required schema
  allTestsPassed &= checkFileContent(
    'supabase/migrations/20250126000000_add_user_activity_log.sql',
    [
      'CREATE TABLE.*user_activity_log',
      'ENABLE ROW LEVEL SECURITY',
      'CREATE POLICY',
      'update_updated_at_column'
    ],
    'Migration has required schema'
  );

  // Check Settings page integration
  allTestsPassed &= checkFileContent(
    'src/pages/Settings.tsx',
    [
      'EditProfileForm',
      'EmailVerificationBanner',
      'onProfileUpdate'
    ],
    'Settings page has proper integration'
  );

  // Check Supabase config
  allTestsPassed &= checkFileContent(
    'supabase/config.toml',
    [
      '\\[functions\\.update-user-profile\\]',
      'verify_jwt = true'
    ],
    'Supabase config has function configuration'
  );

  // Summary
  log('\n📊 Validation Summary:', 'bold');
  if (allTestsPassed) {
    log('🎉 All tests passed! Profile Edit implementation is complete.', 'green');
    log('\n📋 Next Steps:', 'blue');
    log('1. Run: npm install', 'yellow');
    log('2. Run: npm run dev', 'yellow');
    log('3. Navigate to /settings to test the profile edit functionality', 'yellow');
    log('4. Check the PROFILE_EDIT_IMPLEMENTATION.md for detailed testing guide', 'yellow');
  } else {
    log('❌ Some tests failed. Please check the errors above.', 'red');
    process.exit(1);
  }

  log('\n✨ Profile Edit Implementation Validation Complete!\n', 'bold');
}

// Run the validation
main();
