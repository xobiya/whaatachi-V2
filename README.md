# Whaatachi

**Ethiopia's Premier Dating Platform** — A full-stack web application connecting people across Ethiopia with a modern, bilingual (English & Amharic) experience.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 |
| **Backend** | Express.js, TypeScript |
| **Database** | MySQL (via Prisma ORM) |
| **Auth** | JWT + bcryptjs |
| **State** | React Context + useReducer |
| **i18n** | Custom English / Amharic translation layer |
| **Testing** | Vitest + @testing-library/jest-dom |
| **Hosting** | Vercel (frontend) + cPanel (API server) |

## Features

- **Profile Discovery** — Browse, filter, and search member profiles with real-time caching
- **Contact Unlock System** — Blurred contact details unlocked after identity verification and payment
- **Authentication** — Register/login via name, phone, Telegram, or Instagram
- **Admin Panel** — Dashboard with platform stats, profile verification, content moderation, and passcode-protected access
- **Content Management** — Blog articles, FAQs, and success stories with CRUD support
- **Bilingual Interface** — Full English and Amharic (አማርኛ) language support
- **Payments** — Integrated payment requests with admin approval workflow
- **Security** — Input sanitization (client + server), rate limiting, Helmet.js, CORS

## Pages / Views

| Route | View | Description |
|-------|------|-------------|
| `/` | `OnboardingFlow` | Landing & registration |
| `/browse` | `ProfileListing` | Browse all profiles |
| `/profile/:id` | `ProfilePage` | Individual profile detail |
| `/dashboard` | `Dashboard` | Logged-in user home |
| `/blog` | `BlogPage` | Articles & posts |
| `/stories` | `SuccessStories` | Community success stories |
| `/faq` | `FAQSection` | Frequently asked questions |
| `/support` | `SupportPanel` | Contact & help |
| `/admin` | `AdminPanel` | Administrative dashboard |
| `/history` | `UnlockHistory` | Past contact unlocks |

## Project Structure

```
whaatachi/
├── api-src/                 # Express API server
│   ├── config/              # Database & seed config
│   ├── lib/                 # Prisma client singleton
│   ├── middleware/          # Auth, validation, sanitization
│   ├── models/             # Data access layer (Prisma)
│   │   ├── admin.model.ts
│   │   ├── article.model.ts
│   │   ├── faq.model.ts
│   │   ├── payment.model.ts
│   │   ├── story.model.ts
│   │   └── user.model.ts
│   ├── routes/             # API route handlers
│   │   ├── admin.routes.ts
│   │   ├── article.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── faq.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── profile.routes.ts
│   │   └── story.routes.ts
│   ├── types/
│   └── utils/
├── prisma/                  # Prisma schema & migrations
│   └── schema.prisma
├── public/                  # Static assets
├── src/                     # React frontend
│   ├── components/         # Shared UI components
│   ├── context/            # Auth, Data, UI contexts
│   ├── services/           # API client layer
│   ├── utils/              # contactBlur, mask, sanitize
│   ├── views/              # Page-level components
│   ├── i18n.ts             # EN/AM translations
│   ├── main.tsx            # Entry point
│   └── App.tsx             # Root component
├── server.ts               # Server entry point
├── cpanel-deploy.js        # cPanel startup entry point
├── vercel.json             # Vercel deployment config
├── vite.config.ts
├── tsconfig.json
├── DEPLOY-CPANEL.md        # cPanel deployment guide
└── package.json
```

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login by name/phone/telegram/instagram |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Profiles
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/profiles` | List all profiles (cached) |
| GET | `/api/profiles/:id` | Get single profile |
| PUT | `/api/profiles/:id` | Update own profile |

### Payments
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/payments` | Submit payment request |
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
| GET | `/api/health` | Health check (MongoDB status) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

```bash
git clone https://github.com/<your-org>/whaatachi.git
cd whaatachi
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
DATABASE_URL="mysql://root@localhost/whaatachi?connection_limit=10"
JWT_SECRET=your-secret-key
ADMIN_PASSCODE=admin123
CORS_ORIGIN=http://localhost:3000
PORT=3001
RUN_SEED=true
```

### Development

Run both frontend (Vite) and API server concurrently:

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:3001`

### Production Build

```bash
npm run build          # Full build (frontend + server)
npm run start:server   # Start production server
```

### Database Commands

```bash
npm run db:generate    # Regenerate Prisma client
npm run db:push        # Push schema to MySQL (create/update tables)
npm run db:migrate     # Run Prisma migrations
```

### Testing

```bash
npm test            # Run tests
npm run test:watch  # Watch mode
```

### Lint

```bash
npm run lint
```

## Deployment

- **Frontend** deploys to **Vercel** — set `VITE_API_URL` to your backend URL
- **API Server** deploys to **cPanel** via Node.js Selector — see [`DEPLOY-CPANEL.md`](DEPLOY-CPANEL.md) for full guide
- **Database** MySQL on cPanel, managed via Prisma ORM

## Architecture Highlights

- **In-memory profile cache** with 5-minute refresh interval reduces MySQL queries for high-traffic profile listings
- **Prisma ORM** — type-safe database access with auto-generated TypeScript types
- **Context-driven state** — three React contexts (Auth, Data, UI) manage all application state without external libraries
- **Dual sanitization** — input is sanitized both client-side (`src/utils/sanitize.ts`) and server-side (`api-src/middleware/validate.ts`)
- **Contact blurring** — contact details are visually obscured until unlocked via payment approval

## License

[MIT](LICENSE)
