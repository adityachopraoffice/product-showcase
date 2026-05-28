import { Outlet, useLoaderData, useRouteError, useNavigate } from "react-router";
import { useEffect } from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopPlan = await db.shopPlan.findUnique({
    where: { shop: session.shop },
  });
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