import { redirect } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");
  const chargeId = url.searchParams.get("charge_id");
  const shop = url.searchParams.get("shop");

  if (!chargeId || !plan || !shop) {
    return redirect("/app/pricing");
  }

  try {
    const { session } = await authenticate.admin(request);
    await db.shopPlan.upsert({
      where: { shop: session.shop },
      update: { plan },
      create: { shop: session.shop, plan },
    });
    return redirect("/app");
  } catch (e) {
    // If auth fails, save using shop from URL params
    await db.shopPlan.upsert({
      where: { shop },
      update: { plan },
      create: { shop, plan },
    });
    return redirect(`/app?shop=${shop}`);
  }
};