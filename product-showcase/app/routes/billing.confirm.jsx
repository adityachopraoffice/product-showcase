import { redirect } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");
  const chargeId = url.searchParams.get("charge_id");
  const shop = url.searchParams.get("shop");

  if (!chargeId || !plan || !shop) {
    return redirect(`https://${shop}/admin/apps`);
  }

  // Save to your database
  await db.shopPlan.upsert({
    where: { shop },
    update: { plan },
    create: { shop, plan },
  });

  // Get the real shop GID
  const shopResponse = await admin.graphql(`query { shop { id } }`);
  const shopData = await shopResponse.json();
  const shopId = shopData.data.shop.id;

  // Write to Shopify metafield so the liquid block can read it
  await admin.graphql(`
    mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { key value }
        userErrors { field message }
      }
    }
  `, {
    variables: {
      metafields: [{
        namespace: "product_showcase",
        key: "plan",
        value: plan,
        type: "single_line_text_field",
        ownerId: shopId,
      }],
    },
  });

  return redirect(`https://${shop}/admin/apps/product-showcase-14`);
};