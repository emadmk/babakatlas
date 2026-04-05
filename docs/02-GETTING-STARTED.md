# 02 - Getting Started

## Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+ (comes with Node.js)
- **PostgreSQL** 14+ (only needed if migrating to DB-backed storage)
- **Git** for version control

## Installation

```bash
# Clone the repository
git clone <repo-url> babakatlas
cd babakatlas

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
# ── NextAuth ─────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key-at-least-32-chars

# ── Google OAuth (optional) ──────────────────────────────
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ── Stripe (optional - enables payment processing) ──────
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ── Shippo (optional - enables real shipping rates) ──────
SHIPPO_API_KEY=shippo_test_...

# ── SMTP / Email (optional - enables email sending) ─────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=AtlasAdaptive <noreply@atlasadaptive.com>

# ── PostgreSQL (only needed for Prisma/DB migration) ─────
DATABASE_URL=postgresql://user:password@localhost:5432/babakatlas
```

### Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_URL` | Yes | Base URL of the app (e.g., `http://localhost:3002` for dev) |
| `NEXTAUTH_SECRET` | Yes | Secret for JWT signing. Generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID. If omitted, Google login is disabled |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `STRIPE_SECRET_KEY` | No | Stripe server-side API key. If omitted, checkout uses fallback mode |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe client-side key for Stripe.js |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signature verification secret |
| `SHIPPO_API_KEY` | No | Shippo API key for real shipping rates. If omitted, manual rates are used |
| `SMTP_HOST` | No | SMTP server hostname (default: `smtp.gmail.com`) |
| `SMTP_PORT` | No | SMTP port (default: `587`) |
| `SMTP_USER` | No | SMTP username (email address) |
| `SMTP_PASS` | No | SMTP password (Gmail App Password) |
| `SMTP_FROM` | No | From address for outgoing emails |
| `DATABASE_URL` | No | PostgreSQL connection string (only for Prisma) |

## Running Locally

### Development Mode

```bash
npm run dev
```

The app starts at `http://localhost:3000` by default. If port 3000 is busy, Next.js picks the next available port.

### Production Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Default Credentials

### Admin Account

| Field | Value |
|-------|-------|
| Email | `admin@atlasadaptive.com` |
| Password | `Atlas2026!` |

This account is hardcoded in `src/lib/auth.ts` and has the `admin` role, granting access to `/admin`.

### Demo Users

All seed users have the password `demo1234`. See `src/lib/adminData.ts` for the full list:

| Email | Name | Country |
|-------|------|---------|
| `juan@example.com` | Juan Dela Cruz | PH |
| `sarah@example.com` | Sarah Thompson | AU |
| `maria@example.com` | Maria Santos | PH |
| `james@example.com` | James Wilson | AU |

## Database Setup (Optional)

The project currently uses file-based storage (`data/store.json`). To use PostgreSQL:

### 1. Create Database

```bash
createdb babakatlas
```

### 2. Run Migrations

```bash
npx prisma migrate dev --name init
```

### 3. Seed Data

```bash
npm run prisma:seed
# or
npx prisma db seed
```

### 4. View Data

```bash
npx prisma studio
```

> **Note**: The application does not currently read from the database at runtime. All data flows through `src/lib/adminData.ts`. Database integration requires modifying the CRUD functions in that file to use Prisma instead of the in-memory Maps.

## Deploying to Server with PM2

### Install PM2 globally

```bash
npm install -g pm2
```

### Build and Start

```bash
cd /path/to/babakatlas
npm run build
pm2 start npm --name "babakatlas" -- start
```

### Common PM2 Commands

```bash
pm2 status              # Check process status
pm2 logs babakatlas     # View logs
pm2 restart babakatlas  # Restart the app
pm2 stop babakatlas     # Stop the app
pm2 delete babakatlas   # Remove from PM2
pm2 save                # Save process list for auto-restart
pm2 startup             # Generate auto-start script
```

## First-Time Setup Checklist

1. Install dependencies: `npm install`
2. Create `.env` file with at minimum `NEXTAUTH_URL` and `NEXTAUTH_SECRET`
3. Run `npm run dev`
4. Visit `http://localhost:3000`
5. Log in as admin: `admin@atlasadaptive.com` / `Atlas2026!`
6. Explore the admin panel at `/admin`
7. Try the configurator at `/configurator`
