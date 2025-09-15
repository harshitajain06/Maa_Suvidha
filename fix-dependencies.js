// Script to fix dependency issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing dependency issues...');

try {
  // Remove node_modules and package-lock.json
  console.log('1. Removing node_modules and package-lock.json...');
  if (fs.existsSync('node_modules')) {
    execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
  }

  // Clear npm cache
  console.log('2. Clearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });

  // Reinstall dependencies
  console.log('3. Reinstalling dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('✅ Dependencies fixed! Now run: npm run dev');
} catch (error) {
  console.error('❌ Error fixing dependencies:', error.message);
}
