import { Outlet, useLoaderData, useRouteError, useNavigate } from "react-router";
import { useEffect } from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  let shopPlan = await db.shopPlan.findUnique({
    where: { shop: session.shop },
  });

  // Sync plan with Shopify billing state to catch reinstallations
  const { checkActiveBilling, updatePlanMetafield, getPlanMetafield } = await import("../billing.server");
  const actualPlan = await checkActiveBilling(admin, session.shop);
  
  if (!shopPlan || shopPlan.plan !== actualPlan) {
    shopPlan = await db.shopPlan.upsert({
      where: { shop: session.shop },
      create: { shop: session.shop, plan: actualPlan },
      update: { plan: actualPlan },
    });
    try {
      await updatePlanMetafield(admin, actualPlan);
    } catch (e) {
      console.error("Failed to update metafield in app loader", e);
    }
  } else {
    // Metafield safety check for users who upgraded before the metafield feature was added
    try {
      const currentMetafieldPlan = await getPlanMetafield(admin);
      if (currentMetafieldPlan !== actualPlan) {
        await updatePlanMetafield(admin, actualPlan);
      }
    } catch (e) {
      console.error("Failed to sync missing metafield in app loader", e);
    }
  }

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    onboarded: shopPlan?.onboarded ?? false,
  };
};

export default function App() {
  const { apiKey, onboarded } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!onboarded) {
      navigate("/app/onboarding");
    }
  }, [onboarded]);

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app"> Home</s-link>
        <s-link href="/app/showcase"> Showcase Gallery</s-link>
        <s-link href="/app/pricing"> Pricing</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};