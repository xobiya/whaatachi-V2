/**
 * cPanel Deployment Configuration for Whaatachi API
 *
 * This script is the entry point for the cPanel Node.js app.
 * cPanel's Node.js Selector should point to this file.
 *
 * Usage in cPanel Node.js Setup:
 *   - App root: /home/user/repositories/whaatachi
 *   - App startup file: cpanel-deploy.js
 *   - App URL: api.mydomain.com
 *   - Environment vars: Set via cPanel UI (see .env.example)
 */

import './dist/server.js';
