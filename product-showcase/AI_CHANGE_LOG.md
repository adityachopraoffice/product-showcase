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
