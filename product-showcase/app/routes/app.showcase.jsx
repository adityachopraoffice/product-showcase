import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { useLoaderData, Link } from "react-router";
import { TEMPLATES } from "../data/templates";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return { templates: TEMPLATES, userPlan: "free" };
};

export default function ShowcaseGallery() {
  const { templates, userPlan } = useLoaderData();
  const freeTemplates = templates.filter((t) => t.tier === "free");
  const starterTemplates = templates.filter((t) => t.tier === "starter");
  const proTemplates = templates.filter((t) => t.tier === "pro");

  return (
    <s-page heading="Product Showcase Gallery">
      <Link
        slot="primary-action"
        to="/app/pricing"
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
          background: "linear-gradient(135deg, #9C6ADE 0%, #764ba2 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "8px 16px",
          fontWeight: 700,
          fontSize: "13px",
          boxShadow: "0 4px 15px rgba(156, 110, 222, 0.2)",
          cursor: "pointer",
        }}
      >
        Upgrade to Pro
      </Link>

      <s-section>
        <s-paragraph>
          Choose from {templates.length} professionally designed showcase templates.
          Upgrade your plan to unlock more layouts and start customizing your storefront.
        </s-paragraph>
      </s-section>

      {/* Free Templates */}
      <s-section heading={`Free Templates (${freeTemplates.length})`}>
        <div style={gridStyle}>
          {freeTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} locked={false} />
          ))}
        </div>
      </s-section>

      {/* Starter Templates */}
      <s-section heading={`Starter Templates (${starterTemplates.length})`}>
        <s-paragraph>
          <s-link href="/app/pricing">Upgrade to Starter</s-link> to unlock these templates.
        </s-paragraph>
        <div style={gridStyle}>
          {starterTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              locked={userPlan === "free"}
            />
          ))}
        </div>
      </s-section>

      {/* Pro Templates */}
      <s-section heading={`Pro Templates (${proTemplates.length})`}>
        <s-paragraph>
          <s-link href="/app/pricing">Upgrade to Pro</s-link> to unlock these premium templates.
        </s-paragraph>
        <div style={gridStyle}>
          {proTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              locked={userPlan === "free" || userPlan === "starter"}
            />
          ))}
        </div>
      </s-section>
    </s-page>
  );
}

function TemplateCard({ template, locked }) {
  const isPro = template.tier === "pro";
  const isStarter = template.tier === "starter";

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative" }}>
        <div style={{ ...thumbnailStyle, background: template.previewBg }}>
          <MiniMockup id={template.id} />
          {locked && (
            <div style={lockOverlayStyle}>
              <div style={lockBadgeStyle(template.tier)}>
                <span>🔒 {template.tier.toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>
        {/* Tier badge */}
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: isPro ? "#9C6ADE" : isStarter ? "#00BCD4" : "#50B83C",
          color: "#fff",
          fontSize: "11px",
          fontWeight: 700,
          padding: "3px 10px",
          borderRadius: "20px",
          letterSpacing: "0.5px",
        }}>
          {template.tier.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        <div style={{ marginBottom: "8px" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#202223", marginBottom: "6px" }}>
            {template.name}
          </div>
          <div style={{ fontSize: "13px", color: "#6d7175", lineHeight: "1.5" }}>
            {template.description}
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
          {template.tags.map((tag) => (
            <span key={tag} style={tagStyle(template.accent)}>
              {tag}
            </span>
          ))}
        </div>

        {/* Action */}
        {locked ? (
          <Link
            to="/app/pricing"
            style={{
              ...btnStyle,
              background: template.tier === "starter" ? "#00BCD4" : "#9C6ADE",
              color: "#fff",
              textDecoration: "none",
              boxShadow: template.tier === "starter"
                ? "0 4px 12px rgba(0, 188, 212, 0.25)"
                : "0 4px 12px rgba(156, 110, 222, 0.25)",
            }}
          >
            🔒 Unlock with {template.tier === "starter" ? "Starter" : "Pro"}
          </Link>
        ) : (
          <Link to={`/app/showcase/${template.id}`} style={{ ...btnStyle, background: template.accent, color: "#fff", textDecoration: "none" }}>
            Preview Template →
          </Link>
        )}
      </div>
    </div>
  );
}

function MiniMockup({ id }) {
  const mockups = {
    "modern-showcase": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        <rect x="8" y="8" width="60" height="74" rx="4" fill="rgba(255,255,255,0.3)" />
        <rect x="78" y="14" width="72" height="8" rx="3" fill="rgba(255,255,255,0.8)" />
        <rect x="78" y="28" width="52" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="78" y="37" width="62" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="78" y="46" width="42" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="78" y="62" width="44" height="14" rx="4" fill="rgba(255,255,255,0.85)" />
      </svg>
    ),
    "minimal-grid": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        {[0,1,2].flatMap(i => [0,1].map(j => (
          <rect key={`${i}-${j}`} x={8 + i*52} y={6 + j*44} width="46" height="38" rx="4" fill="rgba(255,255,255,0.4)" />
        )))}
      </svg>
    ),
    "bold-hero": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        <rect x="0" y="0" width="160" height="52" fill="rgba(0,0,0,0.2)" />
        <rect x="16" y="12" width="85" height="10" rx="3" fill="rgba(255,255,255,0.9)" />
        <rect x="16" y="28" width="58" height="6" rx="2" fill="rgba(255,255,255,0.6)" />
        <rect x="8" y="60" width="44" height="22" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="58" y="60" width="44" height="22" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="108" y="60" width="44" height="22" rx="4" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
    "carousel-spotlight": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        <rect x="30" y="5" width="100" height="65" rx="6" fill="rgba(255,255,255,0.4)" />
        <rect x="5" y="20" width="22" height="35" rx="4" fill="rgba(255,255,255,0.2)" />
        <rect x="133" y="20" width="22" height="35" rx="4" fill="rgba(255,255,255,0.2)" />
        {[0,1,2,3,4].map(i => (
          <circle key={i} cx={62 + i*9} cy="80" r="3" fill={i===2 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)"} />
        ))}
      </svg>
    ),
    "masonry-gallery": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        <rect x="8" y="8" width="44" height="52" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="58" y="8" width="44" height="30" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="108" y="8" width="44" height="44" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="8" y="66" width="44" height="20" rx="4" fill="rgba(255,255,255,0.3)" />
        <rect x="58" y="44" width="44" height="42" rx="4" fill="rgba(255,255,255,0.3)" />
        <rect x="108" y="58" width="44" height="28" rx="4" fill="rgba(255,255,255,0.3)" />
      </svg>
    ),
    "compact-list": (
      <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
        {[0,1,2,3,4].map(i => (
          <g key={i}>
            <rect x="8" y={8 + i*16} width="16" height="12" rx="2" fill="rgba(255,255,255,0.4)" />
            <rect x="30" y={10 + i*16} width="72" height="4" rx="2" fill="rgba(255,255,255,0.7)" />
            <rect x="30" y={17 + i*16} width="48" height="3" rx="2" fill="rgba(255,255,255,0.4)" />
            <rect x="126" y={9 + i*16} width="26" height="12" rx="3" fill="rgba(255,255,255,0.55)" />
          </g>
        ))}
      </svg>
    ),
  };
  return mockups[id] || mockups["modern-showcase"];
}

// Styles
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  border: "1px solid #e1e3e5",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const thumbnailStyle = {
  height: "160px",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  padding: "12px",
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

const lockBadgeStyle = (tier) => ({
  background: tier === "starter"
    ? "linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)"
    : "linear-gradient(135deg, #9C6ADE 0%, #764ba2 100%)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "20px",
  padding: "8px 16px",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "12px",
  fontWeight: 700,
  boxShadow: tier === "starter"
    ? "0 4px 12px rgba(0, 188, 212, 0.35)"
    : "0 4px 12px rgba(156, 110, 222, 0.35)",
});

const tagStyle = (accent) => ({
  background: `${accent}18`,
  color: accent,
  fontSize: "11px",
  fontWeight: 600,
  padding: "3px 9px",
  borderRadius: "20px",
  border: `1px solid ${accent}30`,
});

const btnStyle = {
  display: "block",
  textAlign: "center",
  padding: "9px 16px",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  border: "none",
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
