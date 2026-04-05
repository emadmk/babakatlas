# 17 - Deployment

## Server Requirements

- **OS**: Ubuntu 20.04+ / Debian 11+ / any Linux
- **Node.js**: 18+ LTS
- **npm**: 9+
- **RAM**: 512MB minimum, 1GB+ recommended
- **Storage**: 1GB+ for app + node_modules + uploads
- **Ports**: 3000 (or custom) for the app

Optional:
- **Nginx**: Reverse proxy (recommended for production)
- **Certbot**: SSL/HTTPS certificates
- **PostgreSQL 14+**: If migrating from file-based store

## Build and Deploy

### 1. Clone & Install

```bash
cd /var/www
git clone <repo-url> babakatlas
cd babakatlas
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

Critical production settings:

```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NODE_ENV=production
```

### 3. Build

```bash
npm run build
```

This creates an optimized production build in `.next/`.

### 4. Start with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start npm --name "babakatlas" -- start

# Save the process list
pm2 save

# Generate startup script (auto-restart on server reboot)
pm2 startup
```

### Custom Port

By default Next.js starts on port 3000. To use a different port:

```bash
pm2 start npm --name "babakatlas" -- start -- -p 3002
```

Or set in `package.json`:
```json
"scripts": {
  "start": "next start -p 3002"
}
```

## PM2 Configuration

### Process Management

```bash
pm2 status                # View all processes
pm2 restart babakatlas    # Restart
pm2 stop babakatlas       # Stop
pm2 delete babakatlas     # Remove
pm2 reload babakatlas     # Zero-downtime reload
```

### Monitoring

```bash
pm2 logs babakatlas       # View logs (stdout + stderr)
pm2 logs babakatlas --lines 200  # Last 200 lines
pm2 monit                 # Real-time monitoring dashboard
pm2 info babakatlas       # Process details
```

### PM2 Ecosystem File (Optional)

Create `ecosystem.config.js` for advanced configuration:

```javascript
module.exports = {
  apps: [{
    name: 'babakatlas',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/babakatlas',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
    },
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }],
};
```

Start with: `pm2 start ecosystem.config.js`

## Nginx Reverse Proxy (Optional)

### Installation

```bash
sudo apt install nginx
```

### Configuration

Create `/etc/nginx/sites-available/babakatlas`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploaded images
    location /uploads/ {
        alias /var/www/babakatlas/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Static assets
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3002;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 10M;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/babakatlas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL/HTTPS Setup (Optional)

### With Certbot (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot auto-configures Nginx for HTTPS and sets up auto-renewal.

### Update Environment

After enabling HTTPS, update `.env`:

```env
NEXTAUTH_URL=https://yourdomain.com
```

## Updating the Site

### Standard Update

```bash
cd /var/www/babakatlas
git pull origin main
npm install
npm run build
pm2 restart babakatlas
```

### Zero-Downtime Update

```bash
cd /var/www/babakatlas
git pull origin main
npm install
npm run build
pm2 reload babakatlas
```

## Backup Strategy

### Data Store

The primary data file is `data/store.json`. Back it up regularly:

```bash
# Manual backup
cp data/store.json data/store.json.backup.$(date +%Y%m%d)

# Cron job (daily at 2 AM)
echo "0 2 * * * cp /var/www/babakatlas/data/store.json /var/backups/babakatlas/store.json.$(date +\%Y\%m\%d)" | crontab -
```

### Uploaded Images

Back up `public/uploads/`:

```bash
tar czf /var/backups/babakatlas/uploads-$(date +%Y%m%d).tar.gz -C /var/www/babakatlas/public uploads/
```

### Full Application Backup

```bash
tar czf /var/backups/babakatlas-full-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  -C /var/www babakatlas/
```

## Stripe Webhook Configuration

For production, configure the Stripe webhook endpoint:

1. Go to Stripe Dashboard -> Developers -> Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET` in `.env`

## Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| Port already in use | `pm2 delete babakatlas` then restart, or use different port |
| Build fails | Check Node.js version (18+), check for TypeScript errors |
| 502 Bad Gateway | Check if PM2 process is running: `pm2 status` |
| Images not loading | Check `public/uploads/` permissions, Nginx `client_max_body_size` |
| Data not persisting | Check `data/` directory permissions, ensure write access |
| PM2 not starting on reboot | Run `pm2 save` then `pm2 startup` |
