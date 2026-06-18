import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prismaGenSrc = path.join(__dirname, 'prisma', 'generated-client');
const prismaGenDest = path.join(__dirname, 'node_modules', '.prisma', 'client');

if (fs.existsSync(prismaGenSrc)) {
  if (!fs.existsSync(prismaGenDest)) {
    fs.mkdirSync(prismaGenDest, { recursive: true });
  }

  function copyRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  copyRecursive(prismaGenSrc, prismaGenDest);
  console.log('Prisma Client copied to node_modules/.prisma/client/');
} else {
  console.warn('prisma/generated-client/ not found; Prisma Client must be available via node_modules/.prisma/client/');
}

import('./dist/server.js');
