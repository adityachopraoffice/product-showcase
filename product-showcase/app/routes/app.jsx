import { Outlet, useLoaderData, useRouteError, useNavigate } from "react-router";
import { useEffect } from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const shopPlan = await db.shopPlan.findUnique({
    where: { shop: session.shop },
  });
  const plan = shopPlan?.plan || "free";

  // Save plan to metafield every time app loads
  try {
    await admin.graphql(`
      mutation {
        metafieldsSet(metafields: [{
          namespace: "product_showcase",
          key: "plan",
          value: "${plan}",
          type: "single_line_text_field",
          ownerType: SHOP
        }]) {
          metafields { id }
          userErrors { message }
        }
      }
    `);
  } catch (e) {
    console.log("Metafield save failed:", e.message);
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