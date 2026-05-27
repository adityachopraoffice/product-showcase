import { redirect } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  
  const plan = url.searchParams.get("plan");
  const chargeId = url.searchParams.get("charge_id");

  // If there's no charge_id, it means the merchant declined the charge
  if (!chargeId || !plan) {
    return redirect("/app/pricing");
  }

  // Update the shop plan in the database
  await db.shopPlan.upsert({
    where: { shop: session.shop },
    update: { plan },
    create: { shop: session.shop, plan },
  });

  // Redirect back to the app home page
  return redirect("/app");
};
