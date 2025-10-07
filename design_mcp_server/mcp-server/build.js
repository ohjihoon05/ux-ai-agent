/**
 * Build script for MCP server
 *
 * Bundles all files into dist/ directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, 'dist');
const SRC_DIR = path.join(__dirname, 'src');

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Make file executable
 */
function makeExecutable(file) {
  fs.chmodSync(file, 0o755);
}

/**
 * Build
 */
async function build() {
  console.log('🔨 Building MCP server...');

  // Clean dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }

  // Copy source files
  console.log('📦 Copying source files...');
  copyDir(SRC_DIR, DIST_DIR);

  // Make index.js executable
  const indexPath = path.join(DIST_DIR, 'index.js');
  makeExecutable(indexPath);

  // Add shebang to index.js
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  if (!indexContent.startsWith('#!/usr/bin/env node')) {
    fs.writeFileSync(indexPath, `#!/usr/bin/env node\n\n${indexContent}`);
  }

  console.log('✅ Build complete!');
  console.log(`📂 Output: ${DIST_DIR}`);
  console.log('\n🚀 To run: node dist/index.js');
  console.log('📦 To install globally: npm link');
}

build().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
