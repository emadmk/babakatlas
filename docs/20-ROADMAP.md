# 20 - Roadmap

## Current State Summary

AtlasAdaptive is a functional MVP e-commerce platform for automotive window tint films. The core flow works end-to-end:

1. Browse products on the homepage
2. Configure tint in the 5-step wizard
3. Checkout with Stripe
4. Receive order confirmation email
5. Admin manages orders, products, and content

**What works well**:
- Full admin CMS for all site content
- 5-step configurator with per-window tint/shade selection
- Dynamic pricing with admin-configurable rates
- Bilingual support (EN/TL)
- Stripe payment integration
- Email notification system
- Responsive dark theme UI

## Known Limitations

### Critical

1. **File-based storage**: All data is stored in `data/store.json`. This is not suitable for production:
   - No concurrent access safety
   - No query optimization
   - Risk of data corruption under heavy load
   - Single-server only

2. **No password hashing**: User passwords are stored in plain text in the data store. Production requires bcrypt or argon2.

3. **No rate limiting**: API endpoints have no rate limiting, vulnerable to abuse.

### Functional

4. **Cart store unused**: `cartStore.ts` exists but the main flow uses the configurator store. The cart badge in the Navbar shows configured window count, not a traditional cart.

5. **No order email notifications on admin status change**: When admin changes order status (e.g., to "shipped"), no email is automatically sent. The email functions exist (`sendOrderShippedEmail`, etc.) but are not called from the admin order update API.

6. **No real-time updates**: Admin panel requires page refresh to see new orders. No WebSocket or polling.

7. **No order editing**: Once an order is created, items cannot be modified. Only status and notes can be changed.

8. **No refund processing**: The `refunded` payment status exists but there is no Stripe refund API integration.

9. **No inventory management**: Products don't have stock levels.

10. **Guest checkout limitations**: Guest orders are linked by email only, not to a user account. Users cannot see orders placed before registration.

### Technical

11. **No API authentication on admin routes**: Admin API routes don't verify the session. They rely on the admin layout for UI protection, but the APIs themselves could be called directly.

12. **In-memory order store**: `ordersStore.ts` keeps orders in a Map that resets on server restart. Orders are also saved to `adminData.ts`, but the `ordersStore` map loses data.

13. **No image optimization**: Uploaded images are served as-is with no resizing or format conversion.

14. **No test suite**: No unit tests, integration tests, or e2e tests.

## Future Improvements

### Phase 1: Production Readiness

- [ ] **PostgreSQL migration**: Replace file-based store with Prisma + PostgreSQL
  - Migrate all CRUD functions in `adminData.ts`
  - Add connection pooling
  - Add database migrations
- [ ] **Password hashing**: Implement bcrypt for user passwords
- [ ] **API authentication middleware**: Add session verification to all `/api/admin/*` routes
- [ ] **Rate limiting**: Add rate limiting to auth and public API endpoints
- [ ] **Input sanitization**: Add proper validation (zod or joi) to all API routes
- [ ] **Error monitoring**: Integrate Sentry or similar

### Phase 2: Feature Enhancements

- [ ] **Auto-send status emails**: Trigger email when admin changes order status
- [ ] **Stripe refund integration**: Allow admin to process refunds through the panel
- [ ] **Order tracking page**: Public order tracking by order number
- [ ] **Invoice PDF generation**: Generate PDF invoices for orders
- [ ] **Multi-currency display**: Show prices in PHP for PH customers and AUD for AU customers
- [ ] **Saved configurations**: Let logged-in users save and resume configurations
- [ ] **Wishlist / Favorites**: Save preferred tint products
- [ ] **Coupon / Discount codes**: Admin-configurable promo codes

### Phase 3: Scale & Performance

- [ ] **Redis caching**: Cache frequently accessed data (products, config, content)
- [ ] **CDN for images**: Serve uploaded images via Cloudflare or S3+CloudFront
- [ ] **Image optimization**: Resize and convert uploads to WebP on upload
- [ ] **Search**: Elasticsearch or Algolia for product search
- [ ] **ISR (Incremental Static Regeneration)**: Statically generate content pages with revalidation
- [ ] **Database connection pooling**: PgBouncer or Prisma Accelerate

### Phase 4: Business Features

- [ ] **Analytics dashboard**: Admin analytics with charts (revenue trends, popular products, conversion rates)
- [ ] **Customer reviews**: Verified purchase reviews on products
- [ ] **Affiliate / Referral program**: Referral tracking and commissions
- [ ] **B2B pricing**: Wholesale pricing for installers
- [ ] **Subscription model**: Recurring tint maintenance plans
- [ ] **Multi-region expansion**: Add more countries (SG, MY, NZ, etc.)

### Phase 5: Technical Excellence

- [ ] **Test suite**: Jest + React Testing Library for unit tests, Playwright for e2e
- [ ] **CI/CD pipeline**: GitHub Actions for automated testing and deployment
- [ ] **PWA support**: Service worker, offline mode, push notifications
- [ ] **Real-time updates**: WebSocket for admin dashboard (new orders, status changes)
- [ ] **API documentation**: OpenAPI/Swagger spec for all endpoints
- [ ] **Accessibility audit**: WCAG 2.1 AA compliance
- [ ] **Performance audit**: Lighthouse optimization, Core Web Vitals
- [ ] **Containerization**: Docker + docker-compose for consistent environments
