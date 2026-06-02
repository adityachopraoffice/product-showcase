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

export async function updatePlanMetafield(admin, planId) {
  const response = await admin.graphql(`
    mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          key
          namespace
          value
          createdAt
          updatedAt
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `, {
    variables: {
      metafields: [
        {
          namespace: "product_showcase",
          key: "plan",
          type: "single_line_text_field",
          value: planId,
          ownerId: (await getAppInstallationId(admin)),
        },
      ],
    },
  });

  const data = await response.json();
  if (data?.data?.metafieldsSet?.userErrors?.length > 0) {
    console.error("Failed to update plan metafield:", data.data.metafieldsSet.userErrors);
  }
}

async function getAppInstallationId(admin) {
  const response = await admin.graphql(`
    query {
      currentAppInstallation {
        id
      }
    }
  `);
  const data = await response.json();
  return data?.data?.currentAppInstallation?.id;
}

export async function getPlanMetafield(admin) {
  const response = await admin.graphql(`
    query {
      currentAppInstallation {
        metafield(namespace: "product_showcase", key: "plan") {
          value
        }
      }
    }
  `);
  const data = await response.json();
  return data?.data?.currentAppInstallation?.metafield?.value;
}

export async function cancelActiveBilling(admin) {
  const response = await admin.graphql(`
    query {
      currentAppInstallation {
        activeSubscriptions {
          id
        }
      }
    }
  `);
  const data = await response.json();
  const subs = data?.data?.currentAppInstallation?.activeSubscriptions || [];
  
  if (subs.length > 0) {
    for (const sub of subs) {
      await admin.graphql(`
        mutation AppSubscriptionCancel($id: ID!) {
          appSubscriptionCancel(id: $id) {
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: { id: sub.id }
      });
    }
  }
}