# AI Modification Log

This file tracks all files changed, the context behind the changes, and what steps were taken. This ensures multiple AI models working on the application remain aligned and avoid conflicts.

---

## [2026-05-27] Fix Billing API Distribution Issue

### Problem
When attempting to upgrade plans using the Billing API in production (Vercel), the following error occurred:
`Error: Apps without a public distribution cannot use the Billing API`

### Cause
The Shopify configuration in `app/shopify.server.js` was using `AppDistribution.SingleMerchant`. Shopify restricts the use of the Billing API (recurring subscriptions / `appSubscriptionCreate` mutation) to apps configured for **Public** distribution. Single-merchant/custom apps are expected to handle billing outside Shopify.

### Solution
1. **Codebase Change:**
   - Modified [shopify.server.js](file:///d:/new%20trial/product-showcase/app/shopify.server.js) to set `distribution: AppDistribution.AppStore`.
2. **Shopify Partner Dashboard Requirement:**
   - The app's distribution method must be set to **Public distribution** in the Shopify Partner Dashboard (under App > Distribution). *Note: The app can remain as an unlisted/draft public app while testing.*

### Changed Files
- **[shopify.server.js](file:///d:/new%20trial/product-showcase/app/shopify.server.js)**:
  ```diff
  -  distribution: AppDistribution.SingleMerchant,
  +  distribution: AppDistribution.AppStore,
  ```

---

## [2026-05-27] Fix Billing Confirm 404 Error

### Problem
After approving payment on Shopify's billing page, it redirected to a preview Vercel deployment URL (`product-showcase-l1lg1a2ci-aditya-chopra-s-projects.vercel.app/billing/confirm`) instead of the production URL, causing a 404.

### Cause
`SHOPIFY_APP_URL` environment variable in Vercel was set to a preview deployment URL instead of the production URL.

### Solution
Updated `SHOPIFY_APP_URL` in Vercel Environment Variables to:
`https://product-showcase-ten-blond.vercel.app`

### Changed Files
- No code changes — only Vercel environment variable update.


## [2026-05-28] Add Real Showcase CRUD

### What was done
- Added `Showcase` model to both `prisma/schema.prisma` and `prisma/schema.postgres.prisma`
- Ran migration `20260527104354_add_showcase` on Neon Postgres
- Created `app/routes/app.showcases.jsx` with create, update, delete, toggleStatus actions
- Updated `app/routes/app._index.jsx` loader to fetch real showcases from DB
- Replaced mock data in Manage tab with real CRUD UI
- Added empty state when no showcases exist

### New Files
- `app/routes/app.showcases.jsx`

### Changed Files
- `prisma/schema.prisma`
- `prisma/schema.postgres.prisma`
- `app/routes/app._index.jsx`


## [2026-05-28] Add Onboarding Flow

### What was done
- Added `onboarded` boolean field to `ShopPlan` model in both schema files
- Ran migration `20260528041546_add_onboarding` on Neon Postgres
- Created `app/routes/app.onboarding.jsx` with 3-step onboarding flow:
  - Step 1: Welcome screen
  - Step 2: Pick a free template
  - Step 3: Name your showcase
- On completion, sets `onboarded = true` and creates first showcase
- Updated `app/routes/app.jsx` to check onboarding status and redirect if not onboarded
- Onboarding only shows once per shop

### New Files
- `app/routes/app.onboarding.jsx`

### Changed Files
- `prisma/schema.prisma`
- `prisma/schema.postgres.prisma`
- `app/routes/app.jsx`