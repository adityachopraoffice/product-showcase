import db from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");
  const chargeId = url.searchParams.get("charge_id");
  const shop = url.searchParams.get("shop");

  if (!chargeId || !plan || !shop) {
    return new Response(`<html><body><script>window.top.location.href = "https://admin.shopify.com";</script></body></html>`, {
      headers: { "Content-Type": "text/html" },
    });
  }

  await db.shopPlan.upsert({
    where: { shop },
    update: { plan },
    create: { shop, plan },
  });

  const storeName = shop.replace(".myshopify.com", "");
  const destination = `https://admin.shopify.com/store/${storeName}/apps/product-showcase-14`;

  return new Response(`<html><body><script>window.top.location.href = "${destination}";</script></body></html>`, {
    headers: { "Content-Type": "text/html" },
  });
};