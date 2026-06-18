# Deploy Whaatachi API to cPanel

This guide covers deploying the Whaatachi backend (Express API) and MySQL database to cPanel hosting with a subdomain.

## Prerequisites

- cPanel access with **Node.js Selector** (available in most modern cPanel installations)
- SSH access to the cPanel server (for Git push)
- MySQL database access (via phpMyAdmin or cPanel MySQL Wizard)
- A domain with subdomain (e.g., `api.mydomain.com`)

---

## Step 1: Create a MySQL Database in cPanel

1. Log into cPanel
2. Go to **MySQL Databases** (or **MySQL Database Wizard**)
3. Create a database (e.g., `whaatachi_db`)
4. Create a database user (e.g., `whaatachi_user`) with a strong password
5. Add the user to the database with **ALL PRIVILEGES**
6. Note the connection details:
   - Database name: `whaatachi_db`
   - Username: `whaatachi_user`
   - Password: `<your-password>`
   - Host: `localhost` (usually, unless using remote MySQL)
   - Connection string: `mysql://whaatachi_user:password@localhost/whaatachi_db`

---

## Step 2: Set Up the Subdomain

1. In cPanel, go to **Domains** → **Zone Editor** (or **Simple DNS Zone Editor**)
2. Add an **A record** for your subdomain:
   - Name: `api`
   - Points to: your server IP address
3. Wait a few minutes for DNS propagation

---

## Step 3: Set Up the Node.js App in cPanel

1. In cPanel, go to **Setup Node.js App** (or **Node.js Selector**)
2. Click **Create Application**
3. Fill in:
   - **Node.js version**: Select **22.x.x** or **20.x.x** (LTS)
   - **Application mode**: `Production`
   - **Application root**: `/home/username/repositories/whaatachi` (or wherever you upload the app)
   - **Application URL**: `api.mydomain.com`
   - **Application startup file**: `cpanel-deploy.js`
   - **Application port**: Leave as **random port** (cPanel assigns one automatically)
   - **App environment variables**: Add these:
     ```
     NODE_ENV=production
     DATABASE_URL=mysql://whaatachi_user:<password>@localhost/whaatachi_db
     JWT_SECRET=<your-strong-jwt-secret>
     ADMIN_PASSCODE=<your-admin-passcode>
     CORS_ORIGIN=https://whaatachi.vercel.app,https://your-frontend-domain.com
      # PORT is automatically assigned by cPanel — do not set it here
     RUN_SEED=true
     ```

4. Click **Create**

---

## Step 4: Deploy the Code via Git (SSH)

### Option A: Direct Git Push to cPanel

```bash
# On your local machine:
# Add the cPanel server as a remote
git remote add cpanel ssh://username@your-domain.com/home/username/repositories/whaatachi

# Push the code
git push cpanel main
```

### Option B: Upload via Git + cPanel Git Version Control

1. Push your code to GitHub
2. In cPanel, go to **Git Version Control**
3. Click **Create Repository**
4. Clone your GitHub repository to `/home/username/repositories/whaatachi`
5. Set up a deployment hook or manually pull updates

### Option C: Manual Upload (Fallback)

1. On your local machine, run `npm run build` to create the `dist/` folder
2. Zip the entire project folder (excluding `node_modules/`)
3. Upload via cPanel **File Manager** → Extract in `/home/username/repositories/whaatachi/`

---

## Step 5: Install Dependencies & Build

After the code is uploaded to cPanel:

```bash
# SSH into your cPanel server
ssh username@your-domain.com
cd ~/repositories/whaatachi

# Install npm dependencies
npm install

# Run database migration to create tables
npx prisma db push

# Verify Prisma client is generated
npx prisma generate

# Build the project
npm run build
```

The Node.js app should automatically start after setup. If not, restart it from cPanel's **Setup Node.js App** interface.

---

## Step 6: Configure the Frontend (Vercel)

If your frontend is on Vercel, set the environment variable:

```
VITE_API_URL=https://api.mydomain.com
```

This tells the frontend to make API calls to your cPanel-hosted backend.

> If you're NOT using Vercel (no separate frontend), the Express server serves the built frontend from the `dist/` directory at `api.mydomain.com`. In that case, skip the Vite build step (`npm run build:server` only) and the Vercel config.

---

## Step 7: Verify the Deployment

```bash
# Test health endpoint
curl https://api.mydomain.com/api/health

# Expected response:
# {"status":"ok","database":"connected","timestamp":"..."}
```

Open `https://api.mydomain.com` in a browser — you should see the Whaatachi app.

---

## cPanel Node.js App Configuration Summary

| Setting | Value |
|---------|-------|
| **App root** | `/home/username/repositories/whaatachi` |
| **Startup file** | `cpanel-deploy.js` |
| **Node version** | 22.x.x (LTS) |
| **App URL** | `api.mydomain.com` |
| **Process type** | `Production` |

---

## Environment Variables (cPanel)

Set these in the cPanel **Setup Node.js App** → **Environment Variables** section:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@localhost/db` |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) | `your-strong-secret-key-here` |
| `ADMIN_PASSCODE` | Admin panel passcode | `secure-admin-code` |
| `CORS_ORIGIN` | Comma-separated allowed origins | `https://whaatachi.vercel.app,http://localhost:3000` |
| `NODE_ENV` | Environment mode | `production` |
| `RUN_SEED` | Seed data on first run (set to `true` initially, then remove) | `true` |

---

## Database Migration Commands

```bash
# Push schema to MySQL (creates/updates tables)
npm run db:push

# Generate Prisma client (runs automatically on postinstall)
npm run db:generate

# Run Prisma migrations (if using migration files)
npm run db:migrate
```

For initial deployment, `npm run db:push` is simplest. For ongoing schema changes, use `prisma migrate dev` locally and `prisma migrate deploy` on cPanel.

---

## Troubleshooting

### "502 Bad Gateway" when accessing the subdomain
- The Node.js app may not be running. Go to cPanel → **Setup Node.js App** → **Restart**
- Check the app log: cPanel → **Setup Node.js App** → **Logs**

### "Cannot find module '@prisma/client'"
- Run `npm run db:generate` to regenerate the Prisma client
- Or check that `postinstall` ran correctly in your `package.json`

### "ECONNREFUSED" database errors
- Verify MySQL is running in cPanel → **MySQL Databases**
- Check the `DATABASE_URL` environment variable is set correctly
- Make sure the database user has the correct privileges

### App not starting after Git push
- SSH into the server and check: `node -e "require('./dist/server.js')"`
- Look for syntax errors or missing modules
- Verify the startup file path in cPanel matches `cpanel-deploy.js`

### CORS errors from the frontend
- Verify `CORS_ORIGIN` includes your frontend domain
- Check cPanel logs in **Setup Node.js App** → **Logs**
- Test with: `curl -H "Origin: https://your-frontend.com" -I https://api.mydomain.com/api/health`

---

## Architecture After Migration

```
┌─────────────────────────┐
│   Vercel (Frontend)     │
│   React SPA             │
│   VITE_API_URL=https:// │
│   api.mydomain.com      │
└──────────┬──────────────┘
           │ HTTPS
           ▼
┌─────────────────────────┐
│   cPanel (Node.js App)  │
│   Express API           │
│   api.mydomain.com      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   MySQL (cPanel)        │
│   Prisma ORM            │
│   whaatachi_db          │
└─────────────────────────┘
```

## File Changes Summary

| File | Change |
|------|--------|
| `prisma/schema.prisma` | **New** — MySQL schema definition |
| `api-src/lib/prisma.ts` | **New** — Prisma client singleton |
| `cpanel-deploy.js` | **New** — cPanel startup entry point |
| `api-src/models/*.ts` | **Rewritten** — Mongoose → Prisma |
| `api-src/config/seed-data.ts` | **Rewritten** — Prisma-based seeding |
| `api-src/config/database.ts` | **Updated** — Mongoose → Prisma |
| `api-src/app.ts` | **Updated** — MySQL health check, no Mongoose |
| `server.ts` | **Updated** — Prisma init, no Mongoose |
| `api-src/routes/*.ts` | **Updated** — Removed Mongoose `toObject()` patterns |
| `package.json` | **Updated** — Prisma scripts, removed Mongoose |
| `.env.example` | **Updated** — `DATABASE_URL` replaces `MONGODB_URI` |
| `.gitignore` | **Updated** — Added `prisma/migrations/` |
