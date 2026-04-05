# 16 - Database

## Overview

The project includes a full **Prisma** schema for **PostgreSQL** but currently uses a file-based data store (`data/store.json`) at runtime. The Prisma schema is maintained as a blueprint for future production migration.

## Prisma Schema

**File**: `prisma/schema.prisma`

### Configuration

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Models

#### Auth Models

**User**
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  phone         String?
  address       String?
  city          String?
  country       String?   @default("PH")
  postalCode    String?
  accounts      Account[]
  sessions      Session[]
  orders        Order[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Account** - OAuth provider accounts (NextAuth)
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(...)
  @@unique([provider, providerAccountId])
}
```

**Session** - Database sessions (not used with JWT strategy)
```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(...)
}
```

**VerificationToken** - Email verification tokens
```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

#### Product Models

**TintProduct**
```prisma
model TintProduct {
  id           String    @id @default(cuid())
  name         String    @unique
  nameEn       String
  nameFa       String?
  nameTl       String?
  description  String?   @db.Text
  descEn       String?   @db.Text
  descFa       String?   @db.Text
  descTl       String?   @db.Text
  tintType     TintType
  vlt          Int
  uvBlock      Int
  heatReject   Int
  pricePerSqFt Float
  image        String?
  active       Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  orderItems   OrderItem[]
}
```

**CarModel**
```prisma
model CarModel {
  id           String    @id @default(cuid())
  name         String    @unique
  brand        String?
  carType      CarType
  windowCount  Int       @default(6)
  image        String?
  sqftByWindow Json?
  active       Boolean   @default(true)
  createdAt    DateTime  @default(now())
  orderItems   OrderItem[]
}
```

#### Order Models

**Order**
```prisma
model Order {
  id               String          @id @default(cuid())
  orderNumber      String          @unique
  userId           String
  user             User            @relation(...)
  status           OrderStatus     @default(PENDING)
  subtotal         Float
  shippingCost     Float
  installationCost Float           @default(0)
  tax              Float           @default(0)
  total            Float
  shippingCountry  ShippingCountry
  serviceType      ServiceType
  shippingAddress  String?         @db.Text
  city             String?
  postalCode       String?
  phone            String?
  notes            String?         @db.Text
  stripePaymentId  String?
  paidAt           DateTime?
  items            OrderItem[]
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
}
```

**OrderItem**
```prisma
model OrderItem {
  id            String      @id @default(cuid())
  orderId       String
  order         Order       @relation(...)
  tintProductId String
  tintProduct   TintProduct @relation(...)
  carModelId    String?
  carModel      CarModel?   @relation(...)
  windows       Json
  quantity      Int         @default(1)
  sqft          Float
  unitPrice     Float
  totalPrice    Float
  createdAt     DateTime    @default(now())
}
```

#### Rate Models

**ShippingRate**
```prisma
model ShippingRate {
  id        String          @id @default(cuid())
  country   ShippingCountry
  region    String?
  baseRate  Float
  perKgRate Float
  freeAbove Float?
  active    Boolean         @default(true)
}
```

**InstallationRate**
```prisma
model InstallationRate {
  id        String          @id @default(cuid())
  country   ShippingCountry
  city      String?
  carType   CarType
  baseRate  Float
  perWindow Float
  active    Boolean         @default(true)
}
```

### Enums

```prisma
enum CarType {
  SEDAN, SUV, VAN, STATION_WAGON, HATCHBACK, COUPE, TRUCK, CONVERTIBLE
}

enum WindowPosition {
  FRONT_WINDSHIELD, REAR_WINDSHIELD, FRONT_LEFT, FRONT_RIGHT,
  REAR_LEFT, REAR_RIGHT, REAR_QUARTER_LEFT, REAR_QUARTER_RIGHT, SUNROOF
}

enum TintType {
  STANDARD, CERAMIC, CARBON, ADAPTIVE, CRYSTALLINE, METALLIC
}

enum OrderStatus {
  PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
}

enum ShippingCountry {
  PH, AU
}

enum ServiceType {
  SHIPPING_ONLY, INSTALLATION
}
```

## Seed Scripts

### JavaScript Seed (Primary)

**File**: `prisma/seed.js`  
**Command**: `npm run prisma:seed` or `npx prisma db seed`

1. Clears existing data (orderItems, orders, rates, cars, products)
2. Seeds 6 tint products with Unsplash images
3. Seeds 8 car models with images
4. Seeds 2 shipping rates (PH, AU)
5. Seeds 12 installation rates (6 car types x 2 countries)

### TypeScript Seed (Reference)

**File**: `prisma/seed.ts`

Same data as JS version but uses TypeScript. Not directly executable (excluded from `tsconfig.json`).

## Migration Commands

```bash
# Generate migration from schema changes
npx prisma migrate dev --name <migration-name>

# Apply migrations to production database
npx prisma migrate deploy

# Reset database (destructive)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (visual DB editor)
npx prisma studio

# Seed database
npx prisma db seed
```

## Current State vs Future

| Aspect | Current (File-based) | Future (PostgreSQL) |
|--------|---------------------|---------------------|
| Storage | `data/store.json` | PostgreSQL database |
| Speed | Fast (in-memory) | Fast (with connection pooling) |
| Persistence | File writes on every mutation | Transaction-safe |
| Concurrency | Single process only | Multi-process safe |
| Scalability | Single server | Horizontal scaling |
| Backup | Copy `store.json` | pg_dump / managed backups |
| Querying | Manual Map filtering | SQL / Prisma queries |

### Migration Steps (Future)

1. Set `DATABASE_URL` in `.env`
2. Run `npx prisma migrate deploy`
3. Run `npx prisma db seed`
4. Replace CRUD functions in `adminData.ts` with Prisma calls
5. Add `PrismaClient` singleton pattern
6. Update API routes if needed
