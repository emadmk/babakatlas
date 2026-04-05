# 19 - Troubleshooting

## Common Errors and Fixes

### 405 Method Not Allowed

**Symptom**: API route returns 405 on GET/POST requests.

**Cause**: Next.js is statically caching the route at build time.

**Fix**: Add `export const dynamic = "force-dynamic"` at the top of the route file:

```typescript
// src/app/api/some-route/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
// ...
```

This forces the route to be handled dynamically on every request.

---

### Cannot Read Properties of Undefined (API Data Unwrapping)

**Symptom**: `TypeError: Cannot read properties of undefined (reading 'map')` when rendering API data.

**Cause**: API responses are wrapped in `{ success: true, data: [...] }` but the component is trying to access the array directly.

**Fix**: Always unwrap the `data` property:

```typescript
// Wrong
const res = await fetch('/api/products/tints');
const tints = await res.json();
tints.map(...); // Error!

// Correct
const res = await fetch('/api/products/tints');
const json = await res.json();
const tints = json.data || json;
(Array.isArray(tints) ? tints : []).map(...);
```

---

### Google OAuth Crash (Missing client_id)

**Symptom**: App crashes on login page with "client_id is required" error.

**Cause**: `GOOGLE_CLIENT_ID` is not set but Google OAuth is somehow being invoked.

**Fix**: The Google provider is only added conditionally:

```typescript
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({ ... }));
}
```

Ensure you either:
1. Set both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
2. Or leave both unset (Google login will be disabled)

Do NOT set just one of the two.

---

### Image 400 Errors (next/image vs img)

**Symptom**: Images from admin uploads return 400 or fail to load.

**Cause**: `next/image` requires remote domains to be whitelisted in `next.config.mjs`.

**Fix**: For admin-uploaded images (stored in `/public/uploads/`), they are served as local static files and should work. For remote images (Unsplash, etc.), check `next.config.mjs`:

```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
  ],
}
```

If using images from other domains, add them to `remotePatterns`. Alternatively, use a plain `<img>` tag instead of `next/image` for user-uploaded URLs.

---

### SMTP Not Connecting

**Symptom**: Test email fails, emails not sending.

**Possible causes**:

1. **Wrong App Password**: Gmail requires an App Password (not your regular password). Enable 2FA first, then generate App Password.

2. **Less secure apps blocked**: Gmail may block the connection. Use App Password instead.

3. **Wrong port**: Port 587 with `secure: false` (STARTTLS). Port 465 requires `secure: true`.

4. **Firewall**: Server firewall may block outbound port 587. Check with:
   ```bash
   telnet smtp.gmail.com 587
   ```

5. **Environment variables not loaded**: Restart the server after changing `.env`.

**Debug**: Check PM2 logs for the specific error:
```bash
pm2 logs babakatlas --lines 50
```

---

### Data Not Persisting

**Symptom**: Changes made in admin panel are lost after server restart.

**Possible causes**:

1. **File permissions**: The `data/` directory must be writable:
   ```bash
   chmod 755 data/
   chmod 644 data/store.json
   ```

2. **data/ directory doesn't exist**: The system creates it automatically, but check permissions on the parent directory.

3. **Corrupt store.json**: If the JSON is malformed, the system falls back to seed data. Delete and restart:
   ```bash
   rm data/store.json
   pm2 restart babakatlas
   ```

4. **Multiple instances**: If running multiple PM2 instances, each has its own in-memory state. Use `instances: 1` in PM2 config.

---

### Build Errors (Unused Variables, Type Mismatches)

**Symptom**: `npm run build` fails with TypeScript or ESLint errors.

**Common fixes**:

1. **Unused variables**: Prefix with underscore (`_unused`) or remove them.

2. **Type assertions**: Use explicit type casts:
   ```typescript
   const user = session?.user as { role?: string; id?: string };
   ```

3. **Missing force-dynamic**: Some routes that use server-side features need the export.

4. **Import order**: Ensure `"use client"` is the first line in client components.

---

### Stripe Webhook Not Working

**Symptom**: Payments succeed but order status doesn't update.

**Checklist**:

1. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
2. Check webhook endpoint URL in Stripe Dashboard
3. Verify the webhook is receiving events (Stripe Dashboard -> Webhooks -> Events)
4. Check server logs for signature verification errors
5. Ensure the server can make requests to itself (webhook calls internal API)

**Local development**: Use Stripe CLI:
```bash
stripe listen --forward-to localhost:3002/api/webhooks/stripe
# Use the printed webhook secret
```

---

### Configurator Shows $0 Prices

**Symptom**: All prices show as $0 in the configurator.

**Cause**: Config failed to load from API.

**Fix**:
1. Check if the API is responding: `curl http://localhost:3002/api/config/pricing`
2. Check if `data/store.json` exists and has valid product data
3. Check browser console for fetch errors
4. Ensure `loadConfig()` is being called (it runs on configurator page mount)

---

### "Module not found" After Pulling Changes

**Symptom**: Build fails with module not found errors after `git pull`.

**Fix**:
```bash
rm -rf node_modules .next
npm install
npm run build
```

---

## Debugging Tips

### Check API Responses

```bash
# Check public APIs
curl http://localhost:3002/api/products/tints | jq
curl http://localhost:3002/api/config/pricing | jq
curl http://localhost:3002/api/content/homepage | jq

# Check admin APIs (requires auth cookie, easier to test in browser)
```

### View Server Logs

```bash
# PM2 logs
pm2 logs babakatlas

# Follow logs in real-time
pm2 logs babakatlas --follow

# Last N lines
pm2 logs babakatlas --lines 100
```

### Inspect Data Store

```bash
# Pretty-print store.json
cat data/store.json | jq '.products | length'
cat data/store.json | jq '.adminOrders | length'
cat data/store.json | jq '.siteSettings'
```

### Reset Everything

```bash
# Reset data to seed defaults
rm data/store.json

# Clear Next.js cache
rm -rf .next

# Rebuild and restart
npm run build
pm2 restart babakatlas
```

### Check Environment Variables

```bash
# Verify .env is loaded (from the app directory)
node -e "require('dotenv').config(); console.log(process.env.NEXTAUTH_URL)"
```

### Browser DevTools

- **Network tab**: Check API response status codes and bodies
- **Console**: Look for fetch errors or JavaScript errors
- **Application tab**: Check localStorage for `babakatlas-cart` and `babakatlas-locale`
