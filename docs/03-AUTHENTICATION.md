# 03 - Authentication

## Overview

Authentication is handled by **NextAuth.js v4** with JWT-based sessions. The configuration lives in `src/lib/auth.ts`.

## Providers

### 1. Credentials Provider

The primary login method. Users authenticate with email + password.

**Admin user** is hardcoded:
```
Email:    admin@atlasadaptive.com
Password: Atlas2026!
Role:     admin
```

**Registered users** are checked against the file-based data store (`adminData.ts`). Passwords are currently stored in **plain text** (production should use bcrypt).

```typescript
// src/lib/auth.ts - authorize function
const user = getAdminUserByEmail(credentials.email);
if (user && user.status === "active") {
  if (user.password === credentials.password) {
    return { id: user.id, name: user.name, email: user.email, role: "user" };
  }
}
```

### 2. Google OAuth Provider

Only added if `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in the environment. If these are missing, the Google login button should not be shown (or will fail gracefully).

```typescript
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({ ... }));
}
```

## User Registration Flow

**Endpoint**: `POST /api/auth/register`  
**File**: `src/app/api/auth/register/route.ts`

1. Client submits `{ name, email, password, country?, phone? }`
2. Server validates required fields and password length (min 8 chars)
3. Checks for duplicate email in data store
4. Creates user via `createAdminUser()` in `adminData.ts`
5. Fires `sendWelcomeEmail()` (non-blocking)
6. Returns `{ success: true, data: { id, name, email } }`

The new user can then log in via the Credentials provider.

## Login Flow

**Page**: `/auth/login` (`src/app/auth/login/page.tsx`)

1. User enters email and password
2. Client calls `signIn("credentials", { email, password, redirect: false })`
3. NextAuth calls the `authorize()` function in `src/lib/auth.ts`
4. On success, a JWT is created with `id` and `role` claims
5. User is redirected to `/dashboard` (or `/admin` if admin)

## Password Reset Flow

**Endpoint**: `POST /api/auth/forgot-password`  
**File**: `src/app/api/auth/forgot-password/route.ts`

Generates a reset token and sends a password reset email via `sendPasswordResetEmail()`.

## Roles

| Role | Access |
|------|--------|
| `admin` | Full access to `/admin` panel, all API endpoints |
| `user` | Access to `/dashboard`, own orders, own profile |
| Unauthenticated | Public pages, configurator, checkout |

## Session Management

### JWT Strategy

```typescript
session: { strategy: "jwt" }
```

Sessions are stored as signed JWTs in cookies. No server-side session storage is needed.

### JWT Callbacks

The `jwt` callback adds `role` and `id` to the token:

```typescript
async jwt({ token, user }) {
  if (user) {
    token.role = user.role || "user";
    token.id = user.id;
  }
  return token;
}
```

The `session` callback copies these to the session object:

```typescript
async session({ session, token }) {
  session.user.role = token.role;
  session.user.id = token.id;
  return session;
}
```

### Type Augmentation

`src/types/next-auth.d.ts` extends the NextAuth types:

```typescript
declare module "next-auth" {
  interface Session {
    user: { id: string; role: string } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT { id: string; role: string }
}
```

## Protected Routes

### Admin Layout (`src/app/admin/layout.tsx`)

The admin layout checks authentication and role:

1. If `status === "loading"` -- shows spinner
2. If `status === "unauthenticated"` -- redirects to `/auth/login`
3. If `session.user.role !== "admin"` -- shows "Access Denied" page
4. Otherwise, renders the admin sidebar + content

### Dashboard Layout (`src/app/dashboard/layout.tsx`)

Wraps children in `<AuthGuard>`, which:

1. If `status === "loading"` -- shows spinner
2. If `status === "unauthenticated"` -- redirects to `/auth/login`
3. Otherwise, renders children

### AuthGuard Component (`src/components/auth/AuthGuard.tsx`)

A reusable wrapper that redirects unauthenticated users to login:

```typescript
export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") return fallback ?? <LoadingSpinner />;
  if (status === "unauthenticated") return null;
  return <>{children}</>;
}
```

## Custom Sign-In Page

The NextAuth config specifies a custom sign-in page:

```typescript
pages: { signIn: "/auth/login" }
```

This prevents the default NextAuth login form from appearing.
