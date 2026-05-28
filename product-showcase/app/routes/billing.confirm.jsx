import { redirect } from "react-router";
import db from "../db.server";
import shopify from "../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");
  const chargeId = url.searchParams.get("charge_id");
  const shop = url.searchParams.get("shop");

  if (!chargeId || !plan || !shop) {
    return redirect("/app/pricing");
  }

  await db.shopPlan.upsert({
    where: { shop },
    update: { plan },
    create: { shop, plan },
  });

  try {
    const { admin } = await shopify.authenticate.admin(request);
    const { savePlanToMetafield } = await import("../plan.server");
    await savePlanToMetafield(admin, plan);
  } catch (e) {
    console.log("Could not save metafield:", e.message);
  }

  return redirect("/app");
};