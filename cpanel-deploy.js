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
    const srcp = path.join(src, entry.name);
    const dstp = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcp, dstp);
    } else {
      fs.copyFileSync(srcp, dstp);
    }
  }
}

if (!fs.existsSync(prismaGenSrc)) {
  log('FATAL: prisma/generated-client/ not found. Run npm run db:generate first.');
  process.exit(1);
}

// 1. Copy to project node_modules/.prisma/client (normal path)
const projectDest = path.join(__dirname, 'node_modules', '.prisma', 'client');
copyDir(prismaGenSrc, projectDest);
log('Copied to project node_modules/.prisma/client/');

// 2. Copy to global nodeenv .prisma/client (where @prisma/client actually resolves on cPanel)
try {
  const pkg = require.resolve('@prisma/client/package.json');
  const globalDotPrisma = path.resolve(pkg, '../../.prisma/client');
  if (globalDotPrisma !== projectDest) {
    copyDir(prismaGenSrc, globalDotPrisma);
    log('Copied to ' + globalDotPrisma);
  }
} catch (e) {
  log('require.resolve failed: ' + e.message);
  // Fallback: try common cPanel nodeenv path
  const nodeMajor = process.version.match(/^v(\d+)/)?.[1];
  const cpanelFallback = path.join(__dirname, '..', 'nodevenv', 'repositories', path.basename(__dirname), nodeMajor, 'lib', 'node_modules', '.prisma', 'client');
  if (fs.existsSync(cpanelFallback)) {
    copyDir(prismaGenSrc, cpanelFallback);
    log('Copied to fallback ' + cpanelFallback);
  }
}

// 3. Copy engine binary to /tmp/prisma-engines (absolute fallback)
const tmpEngines = '/tmp/prisma-engines';
for (const f of fs.readdirSync(prismaGenSrc)) {
  if (f.endsWith('.so.node')) {
    const dst = path.join(tmpEngines, f);
    if (!fs.existsSync(dst)) {
      fs.mkdirSync(tmpEngines, { recursive: true });
      fs.copyFileSync(path.join(prismaGenSrc, f), dst);
      log('Engine binary placed at ' + dst);
    }
  }
}

import('./dist/server.js').catch(err => {
  log('Server crashed: ' + (err?.stack || err?.message || err));
  process.exit(1);
});
