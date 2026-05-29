import { redirect } from "react-router";
import db from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");
  const chargeId = url.searchParams.get("charge_id");
  const shop = url.searchParams.get("shop");

  if (!chargeId || !plan || !shop) {
    return redirect(`https://${shop}/admin/apps`);
  }

  await db.shopPlan.upsert({
    where: { shop },
    update: { plan },
    create: { shop, plan },
  });

  return redirect(`https://${shop}/admin/apps/product-showcase-14`);
};