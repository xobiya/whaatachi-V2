import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);

const logFile = path.join(__dirname, 'cpanel-error.log');
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(logFile, line + '\n'); } catch {}
}

const require = createRequire(import.meta.url);
const prismaGenSrc = path.join(__dirname, 'prisma', 'generated-client');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      const sub = fs.readdirSync(srcPath, { withFileTypes: true });
      for (const s of sub) {
        fs.copyFileSync(path.join(srcPath, s.name), path.join(destPath, s.name));
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(prismaGenSrc)) {
  const projectDest = path.join(__dirname, 'node_modules', '.prisma', 'client');
  copyDir(prismaGenSrc, projectDest);
  log('Copied to project node_modules/.prisma/client/');

  try {
    const prismaClientPkg = require.resolve('@prisma/client/package.json');
    const prismaClientDir = path.dirname(prismaClientPkg);
    const globalDest = path.resolve(prismaClientDir, '..', '.prisma', 'client');
    if (globalDest !== projectDest) {
      copyDir(prismaGenSrc, globalDest);
      log('Copied to global path: ' + globalDest);
    }
  } catch (e) {
    log('Could not resolve @prisma/client: ' + e.message);
  }
} else {
  log('prisma/generated-client/ not found (pull latest code or run npm run db:generate)');
}

import('./dist/server.js').catch(err => {
  log('Server crashed: ' + (err?.stack || err?.message || err));
  process.exit(1);
});
