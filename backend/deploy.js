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

import('./dist/server.js').catch(err => {
  log('Server crashed: ' + (err?.stack || err?.message || err));
  process.exit(1);
});
