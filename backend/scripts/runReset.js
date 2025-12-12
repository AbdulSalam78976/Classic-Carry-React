import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting database reset and seeding...\n');

try {
  // Run the reset script
  execSync('node resetAndSeedDB.js', {
    cwd: __dirname,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('❌ Failed to run database reset script:', error.message);
  process.exit(1);
}