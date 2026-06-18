import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);

const logFile = path.join(__dirname, 'cpanel-error.log');
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(logFile, line + '\n'); } catch {}
}

const prismaGenSrc = path.join(__dirname, 'prisma', 'generated-client');
const prismaGenDest = path.join(__dirname, 'node_modules', '.prisma', 'client');

if (fs.existsSync(prismaGenSrc)) {
  if (!fs.existsSync(prismaGenDest)) {
    fs.mkdirSync(prismaGenDest, { recursive: true });
    log('Created node_modules/.prisma/client/');
  }
  const entries = fs.readdirSync(prismaGenSrc, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(prismaGenSrc, entry.name);
    const destPath = path.join(prismaGenDest, entry.name);
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
  log('Prisma Client copied');
} else {
  log('prisma/generated-client/ not found');
}

import('./dist/server.js').catch(err => {
  log('Server crashed: ' + (err?.stack || err?.message || err));
  process.exit(1);
});
