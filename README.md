# Whaatachi

> **Ethiopia's Premier Dating Platform** — Connecting people across Ethiopia with a modern, bilingual (English & Amharic) experience.

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.6-2D3748?logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Pages & Views](#pages--views)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development](#development)
  - [Production Build](#production-build)
- [Deployment](#deployment)
- [Testing](#testing)
- [Architecture Highlights](#architecture-highlights)
- [License](#license)

---

## Overview

Whaatachi is a full-stack dating platform tailored for the Ethiopian market. It provides a secure and intuitive environment for users to discover profiles, connect through verified contact details, and engage with a community-driven platform. The application features a unique **contact unlock system** where men pay to access contact information while women receive complimentary access, all managed through an integrated payment approval workflow with Ethiopian mobile money services (Telebirr & CBE Birr).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS v4, Framer Motion |
| **Backend** | Express.js 4, TypeScript, esbuild |
| **Database** | MySQL (via Prisma ORM 6) |
| **Authentication** | JWT + bcryptjs |
| **State Management** | React Context + useReducer |
| **Internationalization** | Custom English / Amharic (አማርኛ) translation layer (580+ keys) |
| **Testing** | Vitest + @testing-library/jest-dom |
| **Hosting** | Vercel (frontend) + cPanel (API server) |

---

## Features

- **Profile Discovery** — Browse, filter, and search member profiles with in-memory caching (5-minute refresh) for optimal performance.
- **Contact Unlock System** — Contact details (phone, Telegram, Instagram) are visually blurred and only revealed after identity verification and payment approval. Men pay per unlock; women get complimentary access.
- **Authentication** — Register and login via name, phone, Telegram, or Instagram. No traditional password — login is by matching verified contact details.
- **Admin Panel** — Comprehensive dashboard with platform statistics (user counts by gender, verified users), profile verification toggle, payment approval workflow, and passcode-protected access.
- **Content Management** — Full CRUD for blog articles, FAQs, and success stories via the admin interface.
- **Bilingual Interface** — Complete English and Amharic (አማርኛ) language support with a custom translation dictionary.
- **Payment Integration** — Integrated payment requests through Ethiopian mobile money services (Telebirr and CBE Birr) with admin approval workflow. Users submit transaction IDs and optional receipt screenshots.
- **Security** — Input sanitization (client + server), rate limiting (300 requests/15 min), Helmet.js HTTP headers, CORS, request timeout (30s), inflight request deduplication.
- **Progressive Web App** — Service worker for offline asset caching, manifest.json for installable app experience.

---

## Pages & Views

| Route | View | Description |
|-------|------|-------------|
| `/` | OnboardingFlow | Landing page & registration |
| `/browse` | ProfileListing | Browse all profiles |
| `/profile/:id` | ProfilePage | Individual profile detail |
| `/dashboard` | Dashboard | Logged-in user home |
| `/blog` | BlogPage | Articles & posts |
| `/stories` | SuccessStories | Community success stories |
| `/faq` | FAQSection | Frequently asked questions |
| `/support` | SupportPanel | Contact & help |
| `/admin` | AdminPanel | Administrative dashboard |
| `/history` | UnlockHistory | Past contact unlocks |

---

## API Endpoints

### Auth

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login by name, phone, Telegram, or Instagram |
| POST | `/api/auth/logout` | Logout current session |
| GET | `/api/auth/me` | Get current authenticated user |

### Profiles

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/profiles` | List all profiles (cached with filter support) |
| GET | `/api/profiles/:id` | Get single profile by ID |
| PUT | `/api/profiles/:id` | Update own profile |

### Payments

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/payments` | Submit a payment request |
| GET | `/api/payments` | List payments |
| PUT | `/api/payments/:id/approve` | Approve payment (admin) |
| PUT | `/api/payments/:id/reject` | Reject payment (admin) |
| GET | `/api/payments/check` | Check payment status |

### Content

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/stories` | List success stories |
| GET | `/api/articles` | List blog articles |
| GET | `/api/articles/:id` | Get single article |
| GET | `/api/faqs` | Get FAQs (grouped, cached) |

### Admin

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/admin/login` | Admin login via passcode |
| GET | `/api/admin/stats` | Platform statistics |
| PUT | `/api/admin/profiles/:id/verify` | Toggle profile verification |
| POST | `/api/admin/profiles` | Create profile (admin) |
| DELETE | `/api/admin/profiles/:id` | Delete profile |
| CRUD | `/api/admin/*` | Manage articles, stories, FAQs |

### Health

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check (MySQL connection status) |

---

## Project Structure

```
whaatachi/
├── backend/                  # Express API server
│   ├── src/
│   │   ├── config/           # Database config & seed data
│   │   ├── lib/              # Prisma client singleton
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/           # Data access layer (User, Payment, Admin)
│   │   ├── routes/           # API route handlers
│   │   ├── types/            # Shared type definitions
│   │   └── utils/            # Cache & transformation helpers
│   ├── prisma/               # Schema & migrations
│   │   └── schema.prisma
│   ├── deploy.js             # cPanel deployment entry point
│   ├── DEPLOY.md             # cPanel deployment guide
│   └── package.json
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   ├── context/          # Auth, Data, UI contexts
│   │   ├── services/         # API client layer
│   │   ├── utils/            # Sanitize, masks, contact blur
│   │   ├── views/            # Page-level components
│   │   ├── i18n.ts           # English & Amharic translations
│   │   ├── main.tsx          # Entry point
│   │   └── App.tsx           # Root component
│   ├── public/               # Static assets, PWA manifest, icons
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── .env.example
└── .gitignore
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **MySQL** 8.0+ (local or remote instance)
- **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-org>/whaatachi.git
cd whaatachi

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Return to root
cd ..
```

### Environment Variables

Copy the example environment file and configure your settings:

```bash
cp .env.example backend/.env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | MySQL connection string | `mysql://root@localhost/whaatachi` |
| `JWT_SECRET` | Secret key for JWT signing | *(required)* |
| `ADMIN_PASSCODE` | Admin panel passcode | *(required)* |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |
| `RUN_SEED` | Seed database on first run | `false` |

### Development

Run the backend and frontend concurrently from the root:

```bash
# Terminal 1 — Backend (port 3001)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001

### Database Setup

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Push schema to MySQL (creates/updates tables)
npm run db:push

# (Optional) Seed the database
npm run seed
```

### Production Build

```bash
cd backend && npm run build    # Build API server
cd ../frontend && npm run build # Build frontend SPA
```

### Linting

```bash
cd backend && npm run lint     # TypeScript type check (backend)
cd ../frontend && npm run lint # TypeScript type check (frontend)
```

---

## Deployment

| Component | Platform | Details |
|-----------|----------|---------|
| **Frontend** | Vercel | Static SPA deploy. Set `VITE_API_URL` environment variable to backend URL. |
| **API Server** | cPanel | Node.js Selector deployment. Entry point: `deploy.js`. See [`backend/DEPLOY.md`](backend/DEPLOY.md) for a complete guide. |
| **Database** | cPanel MySQL | Managed via Prisma ORM. Schema pushed with `prisma db push` or `prisma migrate deploy`. |

---

## Testing

```bash
cd frontend
npm test            # Run all tests (Vitest)
npm run test:watch  # Watch mode for development
```

---

## Architecture Highlights

- **In-Memory Profile Cache** — Frequently accessed profile listings are cached in memory with a 5-minute refresh interval, significantly reducing MySQL query load.
- **Prisma ORM** — Type-safe database access with auto-generated TypeScript types, migrations, and schema management.
- **Context-Driven State** — Three React contexts (Auth, Data, UI) manage all application state without external libraries like Redux or Zustand.
- **Dual Sanitization** — Input is sanitized both client-side (`frontend/src/utils/sanitize.ts`) and server-side (`backend/src/middleware/validate.ts`) for defense in depth.
- **Contact Blurring** — Contact details are visually obscured using CSS blur filters and only revealed after payment approval, ensuring privacy and monetization.
- **Inflight Request Deduplication** — Duplicate GET requests to the same endpoint are automatically deduplicated client-side to reduce network overhead.

---

## License

[MIT](LICENSE)
