import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);

// Ensure NODE_ENV is set for production if not already
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const logFile = path.join(__dirname, 'cpanel-error.log');
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(logFile, line + '\n'); } catch {}
}

log(`Starting server (NODE_ENV=${process.env.NODE_ENV}, PORT=${process.env.PORT || 'auto'})`);

import('./dist/server.js').catch(err => {
  log('Server crashed: ' + (err?.stack || err?.message || err));
  process.exit(1);
});
