import { PLANS } from "./data/templates";

export const BILLING_PLANS = {
  starter: {
    amount: 49,
    currencyCode: "USD",
    interval: "EVERY_30_DAYS",
    trialDays: 7,
  },
  pro: {
    amount: 90,
    currencyCode: "USD",
    interval: "EVERY_30_DAYS",
    trialDays: 7,
  },
};

export async function checkActiveBilling(admin, shop) {
  const response = await admin.graphql(`
    query {
      currentAppInstallation {
        activeSubscriptions {
          name
          status
          currentPeriodEnd
          trialDays
        }
      }
    }
  `);
  const data = await response.json();
  const subs = data?.data?.currentAppInstallation?.activeSubscriptions || [];
  if (subs.length === 0) return "free";
  const activeSub = subs[0];
  if (activeSub.name.toLowerCase().includes("starter")) return "starter";
  if (activeSub.name.toLowerCase().includes("pro")) return "pro";
  return "free";
}

export async function createBillingCharge(admin, planId, returnUrl) {
  const plan = BILLING_PLANS[planId];
  if (!plan) throw new Error(`Unknown plan: ${planId}`);

  const response = await admin.graphql(`
    mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int) {
      appSubscriptionCreate(
        name: $name
        returnUrl: $returnUrl
        trialDays: $trialDays
        lineItems: $lineItems
        test: true
      ) {
        userErrors {
          field
          message
        }
        confirmationUrl
        appSubscription {
          id
          status
        }
      }
    }
  `, {
    variables: {
      name: `Product Showcase ${planId.charAt(0).toUpperCase() + planId.slice(1)}`,
      returnUrl,
      trialDays: plan.trialDays,
      lineItems: [{
        plan: {
          appRecurringPricingDetails: {
            price: {
              amount: plan.amount,
              currencyCode: plan.currencyCode,
            },
            interval: plan.interval,
          },
        },
      }],
    },
  });

  const data = await response.json();
  const result = data?.data?.appSubscriptionCreate;

  if (result?.userErrors?.length > 0) {
    throw new Error(result.userErrors[0].message);
  }

  return result?.confirmationUrl;
}