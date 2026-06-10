# Whaatachi — Premium Habesha Compatibility Platform

Whaatachi is Ethiopia's premium dating platform built for Habesha singles seeking authentic relationships. It features a **React + Vite** frontend with a full-stack **Express + MySQL** backend, real payment receipt verification (Telebirr/CBE Birr), an admin control panel, and PWA support.

---

## Architecture

```
whaatachi/
├── src/              # React frontend (Vite + Tailwind v4)
├── backend/          # Express API server + MySQL
├── public/           # Static assets, PWA icons, service worker
└── vite.config.ts    # Dev proxy (/api → localhost:3001)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion |
| Backend | Express 4, TypeScript, MySQL2, JWT, bcryptjs, Helmet, Morgan |
| Database | MySQL 8+ (via mysql2) |
| Auth | JWT tokens + bcrypt password hashing |
| Payments | Telebirr / CBE Birr receipt verification flow |
| PWA | Service worker + manifest + SVG icons |

---

## Features

### Frontend
- **Landing Page** — Hero section, featured profiles, pricing tiers, trust signals
- **Profile Discovery** — Browse/filter profiles by gender, city, intent, age
- **Profile Detail** — Edit your own profile, view unlocked contacts
- **Payment Flow** — Submit Telebirr/CBE Birr receipts to unlock contact info
- **Unlock History** — View all unlocked profiles with direct contact details
- **Success Stories** — Community engagement section
- **FAQ** — Searchable frequently asked questions
- **Dark Mode** — Full theme toggle with persistent preference
- **PWA** — Installable, offline-capable via service worker
- **i18n** — Multi-language support (Amharic, English, Afan Oromo)

### Backend
- **RESTful API** — Full CRUD for profiles, payments, stories, articles, FAQs
- **Auth** — Register/login with JWT, admin authentication
- **Payments** — Submit, approve, reject with receipt image support
- **Admin** — Stats dashboard, passcode-protected
- **Seeder** — 60 deterministic users + stories + articles + FAQs, `--force` flag

### Admin Panel (`/admin`)
- **Metrics Dashboard** — Revenue, pending verifications, member counts, demographic charts
- **Payment Queue** — Table with receipt thumbnails + detail modal showing receipt image
- **Member Management** — CRUD profiles, filter/search, verify/unverify, ban
- **Success Stories** — Publish/remove community stories
- **Help Desk** — Simulated ticket resolution system
- **Settings** — Match fee control, passcode change, maintenance mode

---

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+
- npm

### 1. Clone & Install

```bash
git clone https://github.com/xobiya/whaatachi-V2.git
cd whaatachi-V2

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=whaatachi
JWT_SECRET=your-secret-key-change-in-production
ADMIN_PASSCODE=admin123
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### 3. Initialize Database

```bash
cd backend && npx tsx src/config/schema.ts
```

This creates the `whaatachi` database and all tables.

### 4. Seed Data (Optional)

```bash
cd backend

# Normal seed (if DB is empty)
npm run seed

# Force re-seed (drops existing data first)
npm run seed:force
```

Seeds 60 users (20M + 20F + 10M + 10F), 3 success stories, 3 articles, 7 FAQs.

### 5. Start Development Servers

```bash
# Terminal 1: Backend (port 3001)
cd backend && npm run dev

# Terminal 2: Frontend (port 3000)
npm run dev
```

The Vite dev server proxies `/api/*` requests to `http://localhost:3001`.

### 6. Access the App

- **Frontend**: http://localhost:3000
- **Admin Panel**: Navigate to `/admin` and enter passcode `admin123`

---

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (name + phone) |
| GET | `/api/auth/me` | Get current user |

### Profiles
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/profiles` | List profiles (with filters, pagination) |
| GET | `/api/profiles/:id` | Get single profile |
| PUT | `/api/profiles/:id` | Update profile |

### Payments
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/payments` | Submit payment receipt |
| GET | `/api/payments` | List payments (user's own or all for admin) |
| PUT | `/api/payments/:id/approve` | Approve payment (admin) |
| PUT | `/api/payments/:id/reject` | Reject payment (admin) |
| GET | `/api/payments/check` | Check if user has paid |

### Stories
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/stories` | List success stories |
| POST | `/api/stories` | Create story (admin) |
| DELETE | `/api/stories/:id` | Delete story (admin) |

### Articles & FAQs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/articles` | List articles |
| GET | `/api/faqs` | List FAQs (grouped by category) |

### Admin
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/login` | Admin authentication |
| GET | `/api/admin/stats` | Dashboard statistics |

---

## Project Structure

```
src/
├── main.tsx                 # React entry point
├── App.tsx                  # Root component, view routing, state
├── index.css                # Tailwind v4 global styles
├── types.ts                 # TypeScript interfaces
├── env.d.ts                 # Vite env type declarations
├── i18n.ts                  # Multi-language translations
├── mockData.ts              # Empty (data migrated to backend seeder)
├── services/
│   └── api.ts               # API client (all backend calls)
├── context/
│   └── AppContext.tsx        # Global state management (reducer-based)
├── components/
│   ├── Header.tsx            # Navigation header
│   ├── Footer.tsx            # App footer
│   ├── ProfileCard.tsx       # Profile display card
│   ├── TelegramIcon.tsx      # Telegram SVG icon
│   └── PaymentModal.tsx      # Payment submission modal
└── views/
    ├── HomeLanding.tsx       # Guest landing page
    ├── OnboardingFlow.tsx    # Register/Sign-in flow
    ├── ProfileListing.tsx    # Browse profiles grid
    ├── ProfilePage.tsx       # Profile detail/edit
    ├── Dashboard.tsx         # Logged-in dashboard
    ├── UnlockHistory.tsx     # Unlocked contacts history
    ├── SuccessStories.tsx    # Community success stories
    ├── FAQSection.tsx        # FAQ page
    ├── BlogPage.tsx          # Articles/blog
    ├── SupportPanel.tsx      # Support tickets
    └── AdminPanel.tsx        # Admin control panel

backend/
├── .env                     # Environment variables
├── package.json              # Backend dependencies
├── tsconfig.json             # TypeScript config
└── src/
    ├── index.ts              # Server entry point
    ├── app.ts                # Express app setup
    ├── seed.ts               # Database seeder (--force flag)
    ├── config/
    │   ├── database.ts       # MySQL connection pool
    │   └── schema.ts         # DB schema initialization
    ├── types/
    │   └── index.ts          # Backend types
    ├── models/
    │   ├── user.model.ts     # User CRUD
    │   ├── payment.model.ts  # Payment CRUD
    │   ├── story.model.ts    # Success stories CRUD
    │   ├── article.model.ts  # Articles CRUD
    │   ├── faq.model.ts      # FAQs CRUD
    │   └── admin.model.ts    # Admin auth
    ├── routes/
    │   ├── auth.routes.ts    # Auth endpoints
    │   ├── profile.routes.ts # Profile endpoints
    │   ├── payment.routes.ts # Payment endpoints
    │   ├── story.routes.ts   # Story endpoints
    │   ├── article.routes.ts # Article endpoints
    │   ├── faq.routes.ts     # FAQ endpoints
    │   └── admin.routes.ts   # Admin endpoints
    ├── middleware/
    │   ├── auth.ts           # JWT authentication
    │   ├── validate.ts       # Request validation
    │   └── errorHandler.ts   # Global error handler
    └── utils/
        └── transform.ts      # Row-to-API shape mappers
```

---

## Scripts

### Frontend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (port 3000) |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | TypeScript type checking |
| `npm run preview` | Preview production build |

### Backend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (port 3001) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run seed` | Seed database (if empty) |
| `npm run seed:force` | Force re-seed (drop + recreate) |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL user |
| `DB_PASSWORD` | — | MySQL password |
| `DB_NAME` | `whaatachi` | Database name |
| `JWT_SECRET` | — | JWT signing secret |
| `ADMIN_PASSCODE` | — | Admin panel passcode |
| `PORT` | `3001` | Backend server port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
