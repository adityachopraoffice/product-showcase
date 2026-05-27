import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { TEMPLATES } from "../data/templates";
import { TemplatePreview } from "./app.showcase.$id";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session?.shop || "test-store.myshopify.com";
  const shopPlan = await db.shopPlan.findUnique({
    where: { shop: session.shop },
  });
  const userPlan = shopPlan?.plan || "free";
  return { templates: TEMPLATES, shop, userPlan };
};

const validPlan = (plan) => ["free", "starter", "pro", "enterprise"].includes(plan) ? plan : "free";

const getPlanFromSearch = (search) => validPlan(new URLSearchParams(search).get("plan"));

const isTemplateLocked = (templateTier, plan) => {
  if (templateTier === "free") return false;
  if (templateTier === "starter") return plan === "free";
  if (templateTier === "pro") return plan === "free" || plan === "starter";
  return false;
};

export default function Index() {
  const { templates, shop, userPlan } = useLoaderData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [customizer, setCustomizer] = useState({
    primaryColor: "#5C6AC4",
    fontFamily: "Inter",
    showRating: true,
    autoplay: false,
  });

  const handleUpgrade = (plan) => {
    navigate(`/app/pricing?currentPlan=${userPlan}&selectedPlan=${plan}`);
  };

  const handleApplyDesign = (templateName) => {
    if (typeof window !== "undefined" && window.shopify) {
      window.shopify.toast.show(`Applied "${templateName}" template to store!`);
    }
  };

  // Mock showcases for "Manage" tab
  const mockShowcases = [
    { id: 1, name: "Summer Arrivals Showcase", template: "Modern Showcase", status: "Active", views: "1,245", orders: "42" },
    { id: 2, name: "Sidebar Quick Add", template: "Compact List", status: "Draft", views: "0", orders: "0" },
  ];

  return (
    <div style={{ backgroundColor: "#f6f6f7", minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Dynamic App Header Frame */}
      <s-page>
        {/* Banner Section */}
        <s-section>
          <div style={bannerStyle}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "0.5px" }}>Product Showcase</span>
                <span style={{
                  ...planBadgeStyle,
                  background: userPlan === "free" ? "#FFC700" : userPlan === "starter" ? "#00BCD4" : "#9C6ADE",
                  color: "#fff"
                }}>
                  {userPlan.toUpperCase()} PLAN
                </span>
              </div>
              <h1 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#fff" }}>
                Product Showcase Dashboard
              </h1>
              <p style={{ margin: 0, fontSize: "14px", opacity: 0.8, color: "#e1e3e5" }}>
                Manage your premium showcase templates, customize styles, and boost your sales.
              </p>
            </div>
            <div style={storeBadgeStyle}>
              <span style={{ fontSize: "12px", opacity: 0.8 }}>Store: {shop}</span>
            </div>
          </div>
        </s-section>

        {/* Tab Navigation */}
        <s-section>
          <div style={tabNavWrapper}>
            <button
              onClick={() => setActiveTab("templates")}
              style={activeTab === "templates" ? activeTabStyle : tabButtonStyle}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              style={activeTab === "manage" ? activeTabStyle : tabButtonStyle}
            >
              Manage Showcases
            </button>
            <button
              onClick={() => setActiveTab("customization")}
              style={activeTab === "customization" ? activeTabStyle : tabButtonStyle}
            >
              Customization
            </button>
          </div>
        </s-section>

        {/* Dynamic Tab Body */}
        <s-section>
          {activeTab === "templates" && (
            <div>
              <div style={templatesGrid}>
                {templates.map((template) => {
                  const isLocked = isTemplateLocked(template.tier, userPlan);

                  return (
                    <div
                      key={template.id}
                      style={templateCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                      }}
                    >
                      {/* Card Preview Container */}
                      <div style={{ ...previewContainer, background: template.previewBg }}>
                        <div style={{
                          ...mockupMini,
                          filter: isLocked ? "blur(1.5px)" : "none",
                          opacity: isLocked ? 0.75 : 1,
                          transition: "filter 0.2s, opacity 0.2s"
                        }}>
                          <MiniMockup id={template.id} accent={template.accent} />
                        </div>
                        {isLocked && (
                          <div style={lockOverlayStyle}>
                            <div style={{
                              ...lockBadgeStyleDashboard,
                              background: template.tier === "starter"
                                ? "linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)"
                                : "linear-gradient(135deg, #9C6ADE 0%, #764ba2 100%)",
                              boxShadow: template.tier === "starter"
                                ? "0 4px 10px rgba(0, 188, 212, 0.3)"
                                : "0 4px 10px rgba(156, 110, 222, 0.3)"
                            }}>
                              <span> {template.tier.toUpperCase()}</span>
                            </div>
                          </div>
                        )}
                        <span style={templateBadge(template.tier)}>
                          {template.tier.toUpperCase()}
                        </span>
                      </div>

                      {/* Card Details */}
                      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={cardTitle}>{template.name}</span>
                          <span style={cardTierText(template.tier)}>
                            {template.tier.toUpperCase()}
                          </span>
                        </div>

                        {/* Live Preview Button */}
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <button
                            onClick={() => setSelectedPreview(template)}
                            style={livePreviewButton}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
                                <ellipse cx="10" cy="10" rx="8" ry="5" stroke="#6d7175" strokeWidth="1.5" fill="none" />
                                <circle cx="10" cy="10" r="2.5" fill="#6d7175" />
                              </svg>
                              Live Preview
                            </span>
                          </button>
                        </div>

                        {/* Action CTA Button */}
                        {isLocked ? (
                          <button
                            onClick={() => handleUpgrade(template.tier)}
                            style={{
                              ...upgradeBtnStyle,
                              background: template.tier === "starter" ? "#00BCD4" : "#9C6ADE",
                              boxShadow: template.tier === "starter"
                                ? "0 4px 12px rgba(0, 188, 212, 0.25)"
                                : "0 4px 12px rgba(156, 110, 222, 0.25)"
                            }}
                          >
                             Upgrade to {template.tier.toUpperCase()}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApplyDesign(template.name)}
                            style={applyBtnStyle}
                          >
                            Apply Design
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "manage" && (
            <div style={tableContainer}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#202223" }}>
                Active Storefront Showcases
              </h2>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeaderRow}>
                    <th style={tableHeaderCell}>Showcase Name</th>
                    <th style={tableHeaderCell}>Selected Template</th>
                    <th style={tableHeaderCell}>Status</th>
                    <th style={tableHeaderCell}>Views</th>
                    <th style={tableHeaderCell}>Orders Boost</th>
                    <th style={tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockShowcases.map((showcase) => (
                    <tr key={showcase.id} style={tableRow}>
                      <td style={tableCell}><strong>{showcase.name}</strong></td>
                      <td style={tableCell}>{showcase.template}</td>
                      <td style={tableCell}>
                        <span style={statusBadge(showcase.status)}>
                          {showcase.status}
                        </span>
                      </td>
                      <td style={tableCell}>{showcase.views}</td>
                      <td style={tableCell}>{showcase.orders}</td>
                      <td style={tableCell}>
                        <button
                          onClick={() => alert(`Editing: ${showcase.name}`)}
                          style={actionLinkStyle}
                        >
                          Edit
                        </button>
                        {" | "}
                        <button
                          onClick={() => alert(`Deleting: ${showcase.name}`)}
                          style={{ ...actionLinkStyle, color: "#d82c0d" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "customization" && (
            <div style={customizerWrapper}>
              <div style={customizerSidebar}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Global Showcase Theme Settings</h3>
                
                <div style={formGroup}>
                  <label style={labelStyle}>Primary Theme Color</label>
                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    {["#5C6AC4", "#00BCD4", "#FF6B6B", "#FFA94D", "#51CF66", "#CC5DE8"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCustomizer({ ...customizer, primaryColor: c })}
                        style={{
                          width: "30px", height: "30px", borderRadius: "50%",
                          backgroundColor: c, border: customizer.primaryColor === c ? "2px solid #202223" : "2px solid transparent",
                          cursor: "pointer", outline: "none", transition: "transform 0.1s",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Typography Font Family</label>
                  <select
                    value={customizer.fontFamily}
                    onChange={(e) => setCustomizer({ ...customizer, fontFamily: e.target.value })}
                    style={selectStyle}
                  >
                    <option value="Inter">Inter (Sans-Serif)</option>
                    <option value="Roboto">Roboto (Clean)</option>
                    <option value="Georgia">Georgia (Serif Elegance)</option>
                    <option value="Courier New">Courier New (Monospace)</option>
                  </select>
                </div>

                <div style={formGroup}>
                  <label style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={customizer.showRating}
                      onChange={(e) => setCustomizer({ ...customizer, showRating: e.target.checked })}
                      style={{ marginRight: "8px" }}
                    />
                    Show Product Star Ratings
                  </label>
                </div>

                <div style={formGroup}>
                  <label style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={customizer.autoplay}
                      onChange={(e) => setCustomizer({ ...customizer, autoplay: e.target.checked })}
                      style={{ marginRight: "8px" }}
                    />
                    Autoplay Carousels
                  </label>
                </div>

                <button
                  onClick={() => {
                    if (typeof window !== "undefined" && window.shopify) {
                      window.shopify.toast.show("Customizations saved successfully!");
                    }
                  }}
                  style={saveButtonStyle}
                >
                  Save Style Settings
                </button>
              </div>

              {/* Real-time Theme Preview Frame */}
              <div style={customizerPreview}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#6d7175", marginBottom: "12px" }}>Style Preview</h3>
                <div style={{
                  border: "1px solid #e1e3e5", borderRadius: "8px", background: "#fff",
                  padding: "20px", fontFamily: customizer.fontFamily,
                }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{
                      width: "64px", height: "64px", borderRadius: "8px",
                      backgroundColor: `${customizer.primaryColor}20`, display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: "24px",
                    }}>📱</div>
                    <div>
                      <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700 }}>Exclusive Headphones Pro</h4>
                      {customizer.showRating && <div style={{ color: "#FFC700", fontSize: "12px", marginBottom: "6px" }}>★★★★★ <span style={{ color: "#6d7175" }}>(48 reviews)</span></div>}
                      <span style={{ fontSize: "16px", fontWeight: 800, color: customizer.primaryColor }}>$249.00</span>
                    </div>
                  </div>
                  <button style={{
                    width: "100%", marginTop: "16px", padding: "10px", borderRadius: "6px",
                    backgroundColor: customizer.primaryColor, color: "#fff", border: "none",
                    fontWeight: 700, cursor: "pointer",
                  }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </s-section>
      </s-page>

      {/* Beautiful Interactive Preview Modal */}
      {selectedPreview && (
        <div
          style={modalBackdrop}
          onClick={() => setSelectedPreview(null)}
        >
          <div
            style={modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky header always visible */}
            <div style={modalHeader}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
                Live Mockup: {selectedPreview.name}
              </h2>
              <button
                onClick={() => setSelectedPreview(null)}
                style={closeBtnStyle}
                title="Close preview"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content area */}
            <div style={modalContent}>
              <p style={{ color: "#6d7175", fontSize: "14px", marginBottom: "16px" }}>
                {selectedPreview.description}
              </p>

              <div style={{
                border: "1px solid #e1e3e5", borderRadius: "10px", overflow: "hidden",
                background: "#f6f6f7", padding: "20px",
              }}>
                <TemplatePreview
                  id={selectedPreview.id}
                  accent={selectedPreview.accent}
                  locked={false}
                />
              </div>
            </div>

            {/* Sticky footer always visible */}
            <div style={modalFooter}>
              <button onClick={() => setSelectedPreview(null)} style={secondaryModalBtn}>
                ✕ Close Preview
              </button>
              {isTemplateLocked(selectedPreview.tier, userPlan) ? (
                <button
                  onClick={() => {
                    handleUpgrade(selectedPreview.tier);
                    setSelectedPreview(null);
                  }}
                  style={{
                    ...primaryModalBtn,
                    backgroundColor: selectedPreview.tier === "starter" ? "#00BCD4" : "#9C6ADE",
                    boxShadow: selectedPreview.tier === "starter"
                      ? "0 4px 12px rgba(0, 188, 212, 0.25)"
                      : "0 4px 12px rgba(156, 110, 222, 0.25)"
                  }}
                >
                   Upgrade to {selectedPreview.tier.toUpperCase()} to Use
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleApplyDesign(selectedPreview.name);
                    setSelectedPreview(null);
                  }}
                  style={{ ...primaryModalBtn, backgroundColor: selectedPreview.accent }}
                >
                  Apply Design
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mini Outline Mockups for Cards
function MiniMockup({ id, accent }) {
  const layouts = {
    "modern-showcase": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        <rect x="8" y="10" width="55" height="70" rx="4" fill="rgba(255,255,255,0.3)" />
        <rect x="74" y="16" width="75" height="8" rx="3" fill="rgba(255,255,255,0.8)" />
        <rect x="74" y="28" width="50" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="74" y="37" width="60" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="74" y="60" width="50" height="15" rx="4" fill="rgba(255,255,255,0.9)" />
      </svg>
    ),
    "minimal-grid": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        {[0, 1, 2].flatMap((i) =>
          [0, 1].map((j) => (
            <rect key={`${i}-${j}`} x={8 + i * 51} y={8 + j * 40} width="43" height="34" rx="3" fill="rgba(255,255,255,0.4)" />
          ))
        )}
      </svg>
    ),
    "bold-hero": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        <rect x="0" y="0" width="160" height="50" fill="rgba(0,0,0,0.15)" />
        <rect x="12" y="12" width="90" height="10" rx="2" fill="rgba(255,255,255,0.9)" />
        <rect x="12" y="28" width="50" height="6" rx="2" fill="rgba(255,255,255,0.6)" />
        <rect x="8" y="58" width="44" height="24" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="58" y="58" width="44" height="24" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="108" y="58" width="44" height="24" rx="4" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
    "carousel-spotlight": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        <rect x="35" y="6" width="90" height="64" rx="5" fill="rgba(255,255,255,0.4)" />
        <rect x="6" y="20" width="22" height="36" rx="3" fill="rgba(255,255,255,0.2)" />
        <rect x="132" y="20" width="22" height="36" rx="3" fill="rgba(255,255,255,0.2)" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={65 + i * 10} cy="80" r="3" fill={i === 1 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)"} />
        ))}
      </svg>
    ),
    "masonry-gallery": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        <rect x="8" y="8" width="44" height="50" rx="3" fill="rgba(255,255,255,0.4)" />
        <rect x="58" y="8" width="44" height="30" rx="3" fill="rgba(255,255,255,0.4)" />
        <rect x="108" y="8" width="44" height="42" rx="3" fill="rgba(255,255,255,0.4)" />
        <rect x="8" y="64" width="44" height="20" rx="3" fill="rgba(255,255,255,0.3)" />
        <rect x="58" y="44" width="44" height="40" rx="3" fill="rgba(255,255,255,0.3)" />
      </svg>
    ),
    "compact-list": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <circle cx="16" cy={14 + i * 20} r="7" fill="rgba(255,255,255,0.4)" />
            <rect x="32" y={11 + i * 20} width="70" height="4" rx="2" fill="rgba(255,255,255,0.7)" />
            <rect x="122" y={8 + i * 20} width="30" height="12" rx="3" fill="rgba(255,255,255,0.5)" />
          </g>
        ))}
      </svg>
    ),
  };
  return layouts[id] || layouts["modern-showcase"];
}

// Mock View for the Preview Modal
function MockProductView({ id, accent }) {
  return (
    <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
      <div style={{ fontSize: "40px", marginBottom: "8px" }}>📦</div>
      <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px" }}>Sample Premium Product</h3>
      <div style={{ color: "#6d7175", fontSize: "13px", marginBottom: "12px" }}>Beautifully laid out using {id.replace("-", " ")}</div>
      <span style={{ fontSize: "18px", fontWeight: 800, color: accent }}>$129.99</span>
      <button style={{
        display: "block", width: "100%", marginTop: "16px", padding: "10px",
        borderRadius: "6px", backgroundColor: accent, color: "#fff", border: "none",
        fontWeight: 600, cursor: "pointer",
      }}>
        Add to Cart
      </button>
    </div>
  );
}

// Aesthetic Stylings
const bannerStyle = {
  background: "#1a1c1e",
  borderRadius: "12px",
  padding: "24px 32px",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  marginBottom: "12px",
};

const planBadgeStyle = {
  background: "#FFC700",
  color: "#1a1c1e",
  fontSize: "11px",
  fontWeight: 800,
  padding: "4px 12px",
  borderRadius: "20px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const storeBadgeStyle = {
  background: "rgba(255,255,255,0.1)",
  padding: "8px 16px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.15)",
};

const tabNavWrapper = {
  display: "flex",
  background: "#fff",
  padding: "6px",
  borderRadius: "8px",
  border: "1px solid #e1e3e5",
  marginBottom: "24px",
  gap: "4px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

const tabButtonStyle = {
  padding: "8px 24px",
  background: "none",
  border: "none",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#6d7175",
  cursor: "pointer",
  transition: "all 0.15s ease",
};

const activeTabStyle = {
  ...tabButtonStyle,
  background: "#f1f1f1",
  color: "#202223",
};

const templatesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "24px",
};

const templateCard = {
  background: "#fff",
  borderRadius: "12px",
  border: "1px solid #e1e3e5",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const previewContainer = {
  height: "170px",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  padding: "16px",
};

const mockupMini = {
  width: "100%",
  height: "100%",
};

const lockOverlayStyle = {
  position: "absolute",
  inset: 0,
  background: "rgba(246, 246, 247, 0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(1.5px)",
};

const lockBadgeStyleDashboard = {
  background: "linear-gradient(135deg, #9C6ADE 0%, #764ba2 100%)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "20px",
  padding: "6px 12px",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "11px",
  fontWeight: 700,
  boxShadow: "0 4px 10px rgba(156, 110, 222, 0.3)",
};

const templateBadge = (tier) => ({
  position: "absolute",
  bottom: "12px",
  right: "12px",
  background: tier === "pro"
    ? "rgba(156, 110, 222, 0.9)"
    : tier === "starter"
    ? "rgba(0, 188, 212, 0.9)"
    : "rgba(80, 184, 60, 0.9)",
  color: "#fff",
  fontSize: "10px",
  fontWeight: 800,
  padding: "3px 10px",
  borderRadius: "20px",
  letterSpacing: "0.5px",
});

const cardTitle = {
  fontSize: "15px",
  fontWeight: 700,
  color: "#202223",
};

const cardTierText = (tier) => ({
  fontSize: "11px",
  fontWeight: 700,
  color: tier === "pro" ? "#9C6ADE" : tier === "starter" ? "#00BCD4" : "#50B83C",
  letterSpacing: "0.5px",
});

const livePreviewButton = {
  background: "none",
  border: "none",
  fontSize: "13px",
  fontWeight: 600,
  color: "#6d7175",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 8px",
};

const applyBtnStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  background: "#1c2237",
  color: "#fff",
  border: "none",
  fontWeight: 700,
  fontSize: "13px",
  cursor: "pointer",
};

const upgradeBtnStyle = {
  ...applyBtnStyle,
  background: "#008080",
};

// Table style for Manage showcases tab
const tableContainer = {
  background: "#fff",
  padding: "24px",
  borderRadius: "12px",
  border: "1px solid #e1e3e5",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};

const tableHeaderRow = {
  borderBottom: "2px solid #f1f1f1",
};

const tableHeaderCell = {
  padding: "12px 16px",
  fontSize: "12px",
  fontWeight: 700,
  color: "#6d7175",
  textTransform: "uppercase",
};

const tableRow = {
  borderBottom: "1px solid #f1f1f1",
  transition: "background-color 0.15s",
};

const tableCell = {
  padding: "16px",
  fontSize: "14px",
  color: "#202223",
};

const actionLinkStyle = {
  background: "none",
  border: "none",
  color: "#5C6AC4",
  fontWeight: 600,
  cursor: "pointer",
  padding: 0,
  fontSize: "13px",
};

const statusBadge = (status) => ({
  background: status === "Active" ? "#e3fcef" : "#e4e6e7",
  color: status === "Active" ? "#007F5F" : "#5c5f62",
  fontSize: "11px",
  fontWeight: 700,
  padding: "4px 10px",
  borderRadius: "12px",
});

// Customizer styles
const customizerWrapper = {
  display: "flex",
  gap: "24px",
  alignItems: "flex-start",
};

const customizerSidebar = {
  flex: 1,
  background: "#fff",
  padding: "24px",
  borderRadius: "12px",
  border: "1px solid #e1e3e5",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const customizerPreview = {
  width: "360px",
  background: "#fafafa",
  padding: "24px",
  borderRadius: "12px",
  border: "1px solid #e1e3e5",
  position: "sticky",
  top: "20px",
};

const formGroup = {
  marginBottom: "20px",
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#202223",
  display: "block",
  marginBottom: "6px",
};

const checkboxLabelStyle = {
  fontSize: "14px",
  color: "#202223",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
};

const selectStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #c9cccf",
  fontSize: "14px",
  outline: "none",
  background: "#fff",
};

const saveButtonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "6px",
  background: "#5C6AC4",
  color: "#fff",
  border: "none",
  fontWeight: 700,
  fontSize: "14px",
  cursor: "pointer",
};

// Modal styles
const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: "20px",
};

const modalContainer = {
  background: "#fff",
  borderRadius: "12px",
  width: "720px",
  maxWidth: "95%",
  maxHeight: "85vh",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const modalHeader = {
  padding: "16px 24px",
  borderBottom: "1px solid #e1e3e5",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const closeBtnStyle = {
  background: "#f1f3f5",
  border: "1px solid #dee2e6",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  lineHeight: 1,
  cursor: "pointer",
  color: "#495057",
  fontWeight: 700,
  flexShrink: 0,
  transition: "background 0.15s, color 0.15s",
};

const modalContent = {
  padding: "24px",
  overflowY: "auto",
  flex: 1,
};

const modalFooter = {
  padding: "16px 24px",
  borderTop: "1px solid #e1e3e5",
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
};

const secondaryModalBtn = {
  padding: "10px 16px",
  background: "#f1f1f1",
  color: "#202223",
  border: "none",
  borderRadius: "6px",
  fontWeight: 600,
  cursor: "pointer",
};

const primaryModalBtn = {
  padding: "10px 20px",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: 600,
  cursor: "pointer",
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
