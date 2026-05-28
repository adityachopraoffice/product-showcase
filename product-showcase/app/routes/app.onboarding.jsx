import { redirect } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import db from "../db.server";
import { TEMPLATES } from "../data/templates";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopPlan = await db.shopPlan.findUnique({
    where: { shop: session.shop },
  });
  if (shopPlan?.onboarded) {
    return redirect("/app");
  }
  return { shop: session.shop, templates: TEMPLATES.filter(t => t.tier === "free") };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const templateId = formData.get("templateId");
  const showcaseName = formData.get("showcaseName");

  await db.shopPlan.upsert({
    where: { shop: session.shop },
    update: { onboarded: true },
    create: { shop: session.shop, plan: "free", onboarded: true },
  });

  if (showcaseName && templateId) {
    await db.showcase.create({
      data: {
        shop: session.shop,
        name: showcaseName,
        templateId,
        status: "active",
      },
    });
  }

  return redirect("/app");
};

export default function Onboarding() {
  const { shop, templates } = useLoaderData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id || "");
  const [showcaseName, setShowcaseName] = useState("My First Showcase");

  const handleFinish = async () => {
    const formData = new FormData();
    formData.append("templateId", selectedTemplate);
    formData.append("showcaseName", showcaseName);
    const response = await fetch("/app/onboarding", {
      method: "POST",
      body: formData,
    });
    if (response.ok) navigate("/app");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0faf4 0%, #e8f5e9 50%, #e0f2f1 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "2rem" }}>
      <div style={{ background: "white", borderRadius: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", padding: "3rem", width: "100%", maxWidth: "560px" }}>
        
        {/* Progress */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "2rem" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: "4px", borderRadius: "2px", background: s <= step ? "#5cb85c" : "#e8f5e9", transition: "background 0.3s" }} />
          ))}
        </div>

        {/* Step 1 - Welcome */}
        {step === 1 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "1rem" }}>👋</div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1a2e1a", marginBottom: "0.5rem" }}>
              Welcome to <span style={{ color: "#5cb85c" }}>Product Showcase</span>
            </h1>
            <p style={{ color: "#6b7c6b", fontSize: "1rem", marginBottom: "2rem" }}>
              Let's get your store set up in just 3 quick steps. It'll only take 2 minutes!
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "2rem", textAlign: "left" }}>
              {[
                ["01", "Pick a template", "Choose how your products will look"],
                ["02", "Name your showcase", "Give it a memorable name"],
                ["03", "Go live!", "Your showcase is ready"],
              ].map(([num, title, desc]) => (
                <div key={num} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px", background: "#f0faf4", borderRadius: "10px" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#5cb85c", minWidth: "20px" }}>{num}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1a2e1a", fontSize: "0.9rem" }}>{title}</div>
                    <div style={{ color: "#6b7c6b", fontSize: "0.8rem" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} style={btnStyle}>Let's Get Started →</button>
          </div>
        )}

        {/* Step 2 - Pick Template */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1a2e1a", marginBottom: "0.5rem" }}>Pick a template</h2>
            <p style={{ color: "#6b7c6b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Choose how your products will be displayed. You can change this later.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "2rem" }}>
              {templates.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{ padding: "16px", borderRadius: "12px", border: `2px solid ${selectedTemplate === t.id ? "#5cb85c" : "#e8f5e9"}`, background: selectedTemplate === t.id ? "#f0faf4" : "white", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <div style={{ fontWeight: 600, color: "#1a2e1a" }}>{t.name}</div>
                  <div style={{ color: "#6b7c6b", fontSize: "0.85rem", marginTop: "4px" }}>{t.description}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setStep(1)} style={secondaryBtnStyle}>← Back</button>
              <button onClick={() => setStep(3)} style={btnStyle}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3 - Name Showcase */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1a2e1a", marginBottom: "0.5rem" }}>Name your showcase</h2>
            <p style={{ color: "#6b7c6b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Give your showcase a name so you can identify it later.</p>
            <input
              type="text"
              value={showcaseName}
              onChange={(e) => setShowcaseName(e.target.value)}
              placeholder="e.g. Summer Collection"
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "10px", border: "1.5px solid #c8e6c9", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", color: "#1a2e1a", marginBottom: "1.5rem" }}
            />
            <div style={{ padding: "16px", background: "#f0faf4", borderRadius: "10px", marginBottom: "2rem" }}>
              <div style={{ fontSize: "0.85rem", color: "#6b7c6b", marginBottom: "4px" }}>Your showcase will use:</div>
              <div style={{ fontWeight: 600, color: "#1a2e1a" }}>{templates.find(t => t.id === selectedTemplate)?.name}</div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setStep(2)} style={secondaryBtnStyle}>← Back</button>
              <button onClick={handleFinish} style={btnStyle}>🎉 Launch Showcase!</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const btnStyle = { flex: 1, padding: "0.85rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #5cb85c, #2e7d32)", color: "white", fontSize: "1rem", fontWeight: 600, cursor: "pointer" };
const secondaryBtnStyle = { padding: "0.85rem 1.5rem", borderRadius: "10px", border: "1.5px solid #c8e6c9", background: "white", color: "#2d4a2d", fontSize: "1rem", fontWeight: 600, cursor: "pointer" };

export const headers = (headersArgs) => boundary.headers(headersArgs);