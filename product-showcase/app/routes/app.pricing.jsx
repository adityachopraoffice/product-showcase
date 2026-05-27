import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { useLoaderData, useSubmit, useNavigate, useActionData } from "react-router";
import { PLANS } from "../data/templates";
import { useState, useEffect } from "react";
import db from "../db.server";

const validPlan = (plan) => ["free", "starter", "pro", "enterprise"].includes(plan) ? plan : "free";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopPlan = await db.shopPlan.findUnique({
    where: { shop: session.shop },
  });
  return { plans: PLANS, currentPlan: shopPlan?.plan || "free" };
};

export const action = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = validPlan(formData.get("plan"));

  if (plan === "free") {
    await db.shopPlan.upsert({
      where: { shop: session.shop },
      update: { plan },
      create: { shop: session.shop, plan },
    });
    return { success: true, plan };
  }

  const returnUrl = `${process.env.SHOPIFY_APP_URL}/billing/confirm?plan=${plan}&shop=${session.shop}`;
  const { createBillingCharge } = await import("../billing.server");
  const confirmationUrl = await createBillingCharge(admin, plan, returnUrl);

  return { confirmationUrl };
};

export default function Pricing() {
  const { plans, currentPlan: initialPlan } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState(initialPlan);
  useEffect(() => {
    if (actionData?.confirmationUrl) {
      window.open(actionData.confirmationUrl, "_top");
    }
    if (actionData?.success) {
      setCurrentPlan(actionData.plan);
      window.shopify?.toast.show(`Switched to ${actionData.plan.toUpperCase()} plan!`);
      setTimeout(() => navigate("/app"), 1500);
    }
  }, [actionData]);
  const handleUpgrade = (planId) => {
    if (planId === "free") {
      setCurrentPlan(planId);
      const formData = new FormData();
      formData.append("plan", planId);
      submit(formData, { method: "post" });
      setTimeout(() => navigate("/app"), 1500);
      return;
    }
    const formData = new FormData();
    formData.append("plan", planId);
    submit(formData, { method: "post" });
  };

  return (
    <s-page heading="Pricing Plans">
      <s-section>
        <div style={{ textAlign: "center", margin: "20px 0 40px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#202223", marginBottom: "8px" }}>
            Choose the Right Plan for Your Store
          </h1>
          <p style={{ fontSize: "16px", color: "#6d7175", maxWidth: "600px", margin: "0 auto" }}>
            Unlock professional templates, advanced customization, and grow your sales with our premium Product Showcase layouts.
          </p>
        </div>
      </s-section>

      <s-section>
        <div style={gridStyle}>
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            return (
              <div
                key={plan.id}
                style={{
                  ...cardStyle,
                  border: plan.highlighted ? `2px solid ${plan.color}` : "1px solid #e1e3e5",
                  boxShadow: plan.highlighted ? `0 8px 24px ${plan.color}25` : "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {plan.highlighted && (
                  <div style={{ ...popularBadgeStyle, background: plan.color }}>Most Popular</div>
                )}
                <div style={{ padding: "32px 24px", textAlign: "center" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#202223", margin: "0 0 8px" }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#6d7175", margin: "0 0 24px" }}>
                    {plan.description}
                  </p>
                  <div style={{ margin: "24px 0" }}>
                    <span style={{ fontSize: "20px", fontWeight: 600, verticalAlign: "top" }}>$</span>
                    <span style={{ fontSize: "48px", fontWeight: 800, color: "#202223", lineHeight: 1 }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: "14px", color: "#6d7175" }}>
                      /{plan.period === "forever" ? "forever" : "mo"}
                    </span>
                  </div>
                  <div style={{ height: "1px", background: "#f1f1f1", margin: "24px 0" }} />
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", textAlign: "left" }}>
                    {plan.features.map((feature, index) => (
                      <li key={index} style={{ fontSize: "14px", color: "#202223", margin: "12px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ color: plan.color, fontWeight: "bold", fontSize: "16px" }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent}
                    style={{
                      ...btnStyle,
                      background: isCurrent ? "#f1f1f1" : plan.id === "pro" ? "#9C6ADE" : plan.id === "starter" ? "#00BCD4" : "#202223",
                      color: isCurrent ? "#8c9196" : "#fff",
                      cursor: isCurrent ? "default" : "pointer",
                      boxShadow: !isCurrent ? plan.id === "pro" ? "0 4px 12px rgba(156, 110, 222, 0.25)" : plan.id === "starter" ? "0 4px 12px rgba(0, 188, 212, 0.25)" : "none" : "none",
                    }}
                  >
                    {isCurrent ? "Current Plan" : plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </s-section>

      <s-section heading="Frequently Asked Questions">
        <s-stack direction="block" gap="base">
          <div style={faqStyle}>
            <h4 style={{ fontWeight: 700, margin: "0 0 6px" }}>Can I change plans at any time?</h4>
            <p style={{ color: "#6d7175", margin: 0, fontSize: "14px" }}>
              Yes, you can upgrade, downgrade, or cancel your plan at any time directly through the app settings or your Shopify Admin dashboard.
            </p>
          </div>
          <div style={faqStyle}>
            <h4 style={{ fontWeight: 700, margin: "0 0 6px" }}>How are templates unlocked?</h4>
            <p style={{ color: "#6d7175", margin: 0, fontSize: "14px" }}>
              Upgrading to the Starter plan unlocks the Bold Hero and Carousel Spotlight templates. Upgrading to the Pro plan unlocks all templates including Masonry Gallery and Compact List.
            </p>
          </div>
        </s-stack>
      </s-section>
    </s-page>
  );
}

const gridStyle = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", margin: "0 0 40px" };
const cardStyle = { background: "#fff", borderRadius: "12px", overflow: "hidden", position: "relative" };
const popularBadgeStyle = { position: "absolute", top: 0, left: "50%", transform: "translate(-50%, -50%)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 16px", borderRadius: "20px", textTransform: "uppercase" };
const btnStyle = { display: "block", width: "100%", textAlign: "center", padding: "12px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: 600, border: "none", boxSizing: "border-box" };
const faqStyle = { background: "#fff", borderRadius: "8px", padding: "16px 20px", border: "1px solid #e1e3e5" };

export const headers = (headersArgs) => boundary.headers(headersArgs);