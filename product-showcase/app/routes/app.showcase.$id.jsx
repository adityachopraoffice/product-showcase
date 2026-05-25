import { useLoaderData, Link } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { TEMPLATES } from "../data/templates";
import { useState } from "react";

function TemplateShowcaseLogo({ width = 300 }) {
  return (
    <svg
      width={width}
      viewBox="0 0 340 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Template Showcase Logo"
    >
      <defs>
        <linearGradient id="logoGradient" x1="16" y1="16" x2="124" y2="92" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#22C55E" />
        </linearGradient>
        <linearGradient id="badgeGradient" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>

      <rect width="340" height="110" rx="24" fill="#0F172A" />

      <rect x="18" y="18" width="74" height="74" rx="22" fill="url(#logoGradient)" />
      <rect x="30" y="30" width="50" height="50" rx="18" fill="#0F172A" opacity="0.22" />
      <path d="M44 56C52 44 66 38 78 38C86 38 92.5 40.5 98 45" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" />
      <path d="M52 70C58 64 68 60 79 60C88 60 95.5 62.5 102 67" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" opacity="0.8" />

      <rect x="116" y="28" width="196" height="16" rx="8" fill="url(#badgeGradient)" />
      <rect x="116" y="52" width="140" height="10" rx="5" fill="#CBD5E1" opacity="0.95" />
      <rect x="116" y="70" width="110" height="10" rx="5" fill="#94A3B8" opacity="0.8" />

      <circle cx="296" cy="34" r="10" fill="#38BDF8" opacity="0.9" />
      <circle cx="312" cy="34" r="4" fill="#22C55E" opacity="0.9" />
    </svg>
  );
}

const PLAN_ORDER = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 2,
};

const PLAN_LABELS = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

const PLAN_COLORS = {
  free: "#50B83C",
  starter: "#00BCD4",
  pro: "#9C6ADE",
  enterprise: "#9C6ADE",
};

function resolveUserPlan(planParam) {
  if (["free", "starter", "pro", "enterprise"].includes(planParam)) {
    return planParam;
  }

  return "free";
}

function isTemplateUnlocked(templateTier, userPlan) {
  if (templateTier === "free") return true;

  return PLAN_ORDER[userPlan] >= PLAN_ORDER[templateTier];
}

function getUpgradeTarget(templateTier) {
  return templateTier === "starter" ? "starter" : "pro";
}

function getPlanRequirementCopy(templateTier) {
  if (templateTier === "free") return "Available on all plans";
  if (templateTier === "starter") return "Starter, Pro, or Enterprise";
  return "Pro or Enterprise";
}

function getCtaStyles(tier) {
  const accent = PLAN_COLORS[tier];

  return {
    background: accent,
    color: "#fff",
    border: "none",
    boxShadow: tier === "starter"
      ? "0 4px 12px rgba(0, 188, 212, 0.25)"
      : "0 4px 12px rgba(156, 110, 222, 0.25)",
  };
}

export const loader = async ({ request, params }) => {
  await authenticate.admin(request);
  const template = TEMPLATES.find((t) => t.id === params.id);
  if (!template) throw new Response("Template not found", { status: 404 });

  const searchParams = new URL(request.url).searchParams;
  return {
    template,
    userPlan: resolveUserPlan(searchParams.get("plan")),
  };
};

export default function TemplateDetail() {
  const { template, userPlan } = useLoaderData();
  const isUnlocked = isTemplateUnlocked(template.tier, userPlan);
  const upgradeTarget = getUpgradeTarget(template.tier);
  const currentPlanLabel = PLAN_LABELS[userPlan] || "Free";

  return (
    <s-page heading={template.name}>
      <Link
        slot="primary-action"
        to="/app/showcase"
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
          background: "#fff",
          border: "1px solid #cbd5e0",
          borderRadius: "6px",
          padding: "8px 16px",
          color: "#202223",
          fontWeight: 600,
          fontSize: "13px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          cursor: "pointer",
        }}
      >
        ← Back to Gallery
      </Link>

      <s-section>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "24px",
          padding: "22px 20px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.14), rgba(59, 130, 246, 0.14))",
          border: "1px solid rgba(139, 92, 246, 0.18)",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        }}>
          <TemplateShowcaseLogo width={320} />
          <div style={{
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#475569",
          }}>
            Curated product showcase templates
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
          <span style={{
            background: PLAN_COLORS[template.tier],
            color: "#fff",
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 14px",
            borderRadius: "20px",
            textTransform: "uppercase",
            letterSpacing: "0.3px",
          }}>
            {template.tier === "free" ? "✓ FREE" : `⭐ ${template.tier.toUpperCase()}`}
          </span>
          {template.tags.map((tag) => (
            <span key={tag} style={{
              background: `${template.accent}15`,
              color: template.accent,
              fontSize: "12px",
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: "20px",
              border: `1px solid ${template.accent}25`,
            }}>
              {tag}
            </span>
          ))}
        </div>
        <s-paragraph>{template.description}</s-paragraph>
        <div style={{
          marginTop: "12px",
          fontSize: "13px",
          color: "#6d7175",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}>
          <span style={{ fontWeight: 700, color: "#202223" }}>Current plan:</span>
          <span>{currentPlanLabel}</span>
          <span style={{ color: "#c1c7d0" }}>•</span>
          <span>{getPlanRequirementCopy(template.tier)}</span>
        </div>

        {!isUnlocked && (
          <div style={{
            background: template.tier === "starter"
              ? "linear-gradient(135deg, rgba(0, 188, 212, 0.12), rgba(0, 151, 167, 0.1))"
              : "linear-gradient(135deg, rgba(156, 106, 222, 0.14), rgba(92, 106, 196, 0.12))",
            border: `1px solid ${PLAN_COLORS[upgradeTarget]}40`,
            borderRadius: "10px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "12px",
          }}>
            <span style={{ fontSize: "28px" }}>🔒</span>
            <div>
              <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                Unlock {PLAN_LABELS[upgradeTarget]} features for this layout
              </div>
              <div style={{ fontSize: "13px", color: "#6d7175" }}>
                Upgrade to {PLAN_LABELS[upgradeTarget]} to use this template in your store. {" "}
                <a href={`/app/pricing?plan=${upgradeTarget}`} style={{ color: PLAN_COLORS[upgradeTarget], fontWeight: 700, textDecoration: "none" }}>
                  View pricing →
                </a>
              </div>
            </div>
          </div>
        )}
      </s-section>

      <s-section heading="Live Preview">
        <div style={{
          border: "1px solid #e1e3e5",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#f6f6f7",
        }}>
          <div style={{
            background: "#e1e3e5",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28CA41", display: "inline-block" }} />
            <div style={{
              flex: 1,
              background: "#fff",
              borderRadius: "4px",
              padding: "4px 12px",
              fontSize: "12px",
              color: "#8c9196",
              marginLeft: "8px",
            }}>
              your-store.myshopify.com/collections
            </div>
          </div>

          <div style={{ padding: "24px", minHeight: "420px" }}>
            <TemplatePreview
              id={template.id}
              accent={template.accent}
              locked={!isUnlocked}
              tier={template.tier}
            />
          </div>
        </div>
      </s-section>

      <s-section slot="aside" heading="Template Details">
        <s-stack direction="block" gap="base">
          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Template</span>
            <span style={detailValueStyle}>{template.name}</span>
          </div>
          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Plan Required</span>
            <span style={{
              ...detailValueStyle,
              color: PLAN_COLORS[template.tier],
              fontWeight: 700,
            }}>
              {getPlanRequirementCopy(template.tier)}
            </span>
          </div>
          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Best for</span>
            <span style={detailValueStyle}>{template.tags.join(", ")}</span>
          </div>
          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Responsive</span>
            <span style={{ ...detailValueStyle, color: "#50B83C" }}>✓ Yes</span>
          </div>
          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Customizable</span>
            <span style={{ ...detailValueStyle, color: "#50B83C" }}>✓ Yes</span>
          </div>
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Template Highlights">
        <s-stack direction="block" gap="base">
          <div style={{ ...detailRowStyle, borderBottom: "none", alignItems: "flex-start" }}>
            <span style={detailLabelStyle}>Preview</span>
            <span style={detailValueStyle}>{isUnlocked ? "Live preview available" : "Preview is locked until you upgrade"}</span>
          </div>
          <div style={{ ...detailRowStyle, borderBottom: "none", alignItems: "flex-start" }}>
            <span style={detailLabelStyle}>Upgrade path</span>
            <span style={detailValueStyle}>{upgradeTarget === "starter" ? "Starter unlocks this layout" : "Pro unlocks this layout"}</span>
          </div>
          <div style={{ ...detailRowStyle, borderBottom: "none", alignItems: "flex-start" }}>
            <span style={detailLabelStyle}>Ideal for</span>
            <span style={detailValueStyle}>{template.description}</span>
          </div>
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Actions">
        {isUnlocked ? (
          <s-stack direction="block" gap="tight">
            <s-button variant="primary">Apply This Template</s-button>
            <Link
              to="/app/showcase"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                background: "#fff",
                border: "1px solid #cbd5e0",
                borderRadius: "6px",
                padding: "8px 16px",
                color: "#202223",
                fontWeight: 600,
                fontSize: "13px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                cursor: "pointer",
              }}
            >
              Browse Other Templates
            </Link>
          </s-stack>
        ) : (
          <s-stack direction="block" gap="tight">
            <Link
              to={`/app/pricing?plan=${upgradeTarget}`}
              style={{
                ...getCtaStyles(upgradeTarget),
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              🔒 Unlock with {PLAN_LABELS[upgradeTarget]}
            </Link>
            <Link
              to="/app/showcase"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                background: "#fff",
                border: "1px solid #cbd5e0",
                borderRadius: "6px",
                padding: "8px 16px",
                color: "#202223",
                fontWeight: 600,
                fontSize: "13px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                cursor: "pointer",
              }}
            >
              Browse Free Templates
            </Link>
          </s-stack>
        )}
      </s-section>
    </s-page>
  );
}

/** Star rating helper */
function StarRating({ rating, reviews }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#FFC700", fontSize: "12px" }}>
      <span>
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < fullStars) return "★";
          if (i === fullStars && hasHalf) return "½";
          return "☆";
        }).join("")}
      </span>
      {reviews && <span style={{ color: "#6d7175", fontSize: "11px" }}>({reviews})</span>}
    </div>
  );
}

/** Premium custom product SVGs vector graphics */
export function ProductSvg({ type, size = 64 }) {
  switch (type) {
    case "headphones":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
          <defs>
            <linearGradient id="headbandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a1c1e" />
              <stop offset="50%" stopColor="#3a3d40" />
              <stop offset="100%" stopColor="#1a1c1e" />
            </linearGradient>
            <linearGradient id="cupGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c3e50" />
              <stop offset="100%" stopColor="#0f171e" />
            </linearGradient>
          </defs>
          <path d="M 20,55 A 32,32 0 0,1 80,55" fill="none" stroke="url(#headbandGrad)" strokeWidth="7" strokeLinecap="round" />
          <path d="M 17,55 A 35,35 0 0,1 83,55" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
          <rect x="15" y="48" width="6" height="12" rx="2" fill="#95a5a6" />
          <rect x="79" y="48" width="6" height="12" rx="2" fill="#95a5a6" />
          <rect x="8" y="52" width="20" height="28" rx="10" fill="url(#cupGrad)" filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.35))" />
          <rect x="72" y="52" width="20" height="28" rx="10" fill="url(#cupGrad)" filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.35))" />
          <rect x="11" y="56" width="14" height="20" rx="7" fill="#00e676" opacity="0.1" />
          <rect x="75" y="56" width="14" height="20" rx="7" fill="#00e676" opacity="0.1" />
          <circle cx="18" cy="70" r="2" fill="#00e676" filter="drop-shadow(0px 0px 3px #00e676)" />
        </svg>
      );
    case "watch":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
          <defs>
            <linearGradient id="strapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4f5b66" />
              <stop offset="50%" stopColor="#8090a0" />
              <stop offset="100%" stopColor="#4f5b66" />
            </linearGradient>
            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e272c" />
              <stop offset="100%" stopColor="#050708" />
            </linearGradient>
          </defs>
          <path d="M 38,12 L 62,12 L 58,35 L 42,35 Z" fill="url(#strapGrad)" />
          <path d="M 38,88 L 62,88 L 58,65 L 42,65 Z" fill="url(#strapGrad)" />
          <rect x="28" y="28" width="44" height="44" rx="12" fill="#1e2022" stroke="#5a6268" strokeWidth="2.5" filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.3))" />
          <rect x="32" y="32" width="36" height="36" rx="9" fill="url(#screenGrad)" />
          <text x="50" y="47" fontSize="10" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.5">09:41</text>
          <circle cx="50" cy="58" r="6" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.8" />
          <circle cx="50" cy="58" r="6" fill="none" stroke="#e91e63" strokeWidth="1.8" strokeDasharray="26 38" strokeLinecap="round" />
          <circle cx="50" cy="58" r="4.2" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.4" />
          <circle cx="50" cy="58" r="4.2" fill="none" stroke="#00e676" strokeWidth="1.4" strokeDasharray="16 26" strokeLinecap="round" />
        </svg>
      );
    case "wallet":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
          <defs>
            <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a0522d" />
              <stop offset="100%" stopColor="#5c2e16" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#f3e5ab" />
            </linearGradient>
          </defs>
          <rect x="20" y="32" width="60" height="42" rx="7" fill="url(#leatherGrad)" filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.3))" />
          <rect x="23" y="35" width="54" height="36" rx="5" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="3 2" />
          <path d="M 20,53 C 40,57 60,57 80,53 L 80,74 L 20,74 Z" fill="#4d240e" opacity="0.9" />
          <path d="M 23,55 C 40,59 60,59 77,55" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx="68" cy="63" r="3.5" fill="url(#goldGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <rect x="32" y="20" width="36" height="22" rx="3.5" fill="#1b2a4a" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.25))" />
          <rect x="36" y="25" width="8" height="6" rx="1.5" fill="url(#goldGrad)" />
        </svg>
      );
    case "shoes":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
          <defs>
            <linearGradient id="shoeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff416c" />
              <stop offset="100%" stopColor="#ff4b2b" />
            </linearGradient>
          </defs>
          <path d="M 16,66 C 20,48 30,30 46,30 C 55,30 62,39 70,47 C 78,51 88,51 92,55 C 94,57 93,65 86,67 C 72,68 35,68 16,66 Z" fill="url(#shoeBodyGrad)" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.22))" />
          <path d="M 12,65 C 28,69 58,69 88,69 C 90,69 92,67 92,65 C 92,63 90,63 88,63 C 58,63 28,65 12,63 C 11,63 11,65 12,65 Z" fill="#ffffff" />
          <path d="M 44,36 L 52,46" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
          <path d="M 49,32 L 58,43" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
          <path d="M 54,28 L 64,40" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
          <path d="M 26,52 C 34,44 42,56 50,48" fill="none" stroke="#2c3e50" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
        </svg>
      );
    case "sunglasses":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
          <defs>
            <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00c6ff" />
              <stop offset="100%" stopColor="#0072ff" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f39c12" />
              <stop offset="50%" stopColor="#f1c40f" />
              <stop offset="100%" stopColor="#f39c12" />
            </linearGradient>
          </defs>
          <path d="M 12,48 L 22,42 C 24,41 26,41 28,42 L 32,48" fill="none" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 88,48 L 78,42 C 76,41 74,41 72,42 L 68,48" fill="none" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="33" cy="52" r="16" fill="url(#lensGrad)" stroke="url(#goldGrad)" strokeWidth="3" filter="drop-shadow(0px 4px 7px rgba(0,0,0,0.25))" />
          <circle cx="67" cy="52" r="16" fill="url(#lensGrad)" stroke="url(#goldGrad)" strokeWidth="3" filter="drop-shadow(0px 4px 7px rgba(0,0,0,0.25))" />
          <path d="M 22,46 A 13,13 0 0,1 40,43" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 56,46 A 13,13 0 0,1 74,43" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 45,46 C 48,43 52,43 55,46" fill="none" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "bag":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
          <defs>
            <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a5668" />
              <stop offset="100%" stopColor="#2d3748" />
            </linearGradient>
            <linearGradient id="leatherStrap" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cd853f" />
              <stop offset="100%" stopColor="#8b5a2b" />
            </linearGradient>
          </defs>
          <path d="M 22,38 C 22,32 30,30 50,30 C 70,30 78,32 78,38 L 82,62 C 82,67 76,70 50,70 C 24,70 18,67 18,62 Z" fill="url(#bagGrad)" filter="drop-shadow(0px 5px 8px rgba(0,0,0,0.3))" />
          <path d="M 18,44 A 8,13 0 0,0 18,62 Z" fill="#1a202c" opacity="0.6" />
          <path d="M 82,44 A 8,13 0 0,1 82,62 Z" fill="#1a202c" opacity="0.6" />
          <rect x="32" y="32" width="6" height="38" fill="url(#leatherStrap)" />
          <rect x="62" y="32" width="6" height="38" fill="url(#leatherStrap)" />
          <line x1="28" y1="31" x2="72" y2="31" stroke="#cbd5e0" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="47" y="28" width="6" height="5" rx="1.5" fill="#ecc94b" />
          <path d="M 35,32 A 16,16 0 0,1 65,32" fill="none" stroke="url(#leatherStrap)" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 35,32 A 16,16 0 0,1 65,32" fill="none" stroke="#ecc94b" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" />
        </svg>
      );
    default:
      return (
        <div style={{ fontSize: "36px" }}>🛍️</div>
      );
  }
}

/** Full interactive template previews */
export function TemplatePreview({ id, accent, locked, tier }) {
  const products = [
    { type: "headphones", name: "Wireless Headphones", price: "$89.99", badge: "Best Seller", color: "#667eea", rating: 5, reviews: 124, swatches: ["#2d3748", "#ff4b2b", "#008080"] },
    { type: "watch", name: "Smart Watch Pro", price: "$149.99", badge: "New", color: "#f093fb", rating: 4.8, reviews: 92, swatches: ["#4f5b66", "#d4af37", "#a0522d"] },
    { type: "wallet", name: "Leather Wallet", price: "$49.99", badge: "Sale", color: "#4facfe", rating: 4.5, reviews: 56, swatches: ["#a0522d", "#2d3748", "#1b2a4a"] },
    { type: "shoes", name: "Running Shoes", price: "$119.99", badge: "", color: "#43e97b", rating: 4.9, reviews: 210, swatches: ["#ff416c", "#0072ff", "#2d3748"] },
    { type: "sunglasses", name: "Sunglasses", price: "$79.99", badge: "Popular", color: "#fa709a", rating: 4.7, reviews: 88, swatches: ["#f1c40f", "#2d3748", "#cd853f"] },
    { type: "bag", name: "Travel Bag", price: "$199.99", badge: "", color: "#a18cd1", rating: 5, reviews: 34, swatches: ["#4a5668", "#a0522d", "#2d3748"] },
  ];

  const previewTier = tier === "starter" ? "starter" : "pro";
  const overlayAccent = PLAN_COLORS[previewTier];

  // State maps for micro-interactions
  const [selectedSwatches, setSelectedSwatches] = useState({});
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [quantities, setQuantities] = useState({ 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 });
  const [cartState, setCartState] = useState({});

  const handleSwatchSelect = (prodId, color) => {
    setSelectedSwatches(prev => ({ ...prev, [prodId]: color }));
  };

  const handleQtyChange = (idx, amount) => {
    setQuantities(prev => ({ ...prev, [idx]: Math.max(1, (prev[idx] || 1) + amount) }));
  };

  const handleAddToCart = (name, index) => {
    setCartState(prev => ({ ...prev, [index]: true }));
    if (typeof window !== "undefined" && window.shopify) {
      window.shopify.toast.show(`Added "${name}" to cart!`);
    } else {
      alert(`Added "${name}" to cart!`);
    }
    setTimeout(() => {
      setCartState(prev => ({ ...prev, [index]: false }));
    }, 1200);
  };

  const overlayStyle = locked ? {
    filter: "blur(2px)", pointerEvents: "none", userSelect: "none", opacity: 0.8,
  } : {};

  const previews = {
    // 1. MODERN SHOWCASE (Split layout with colors, ratings, size selectors)
    "modern-showcase": (
      <div style={{ ...overlayStyle, display: "flex", flexDirection: "column", gap: "16px" }}>
        {products.slice(0, 3).map((p, i) => {
          const selectedColor = selectedSwatches[p.type] || p.swatches[0];
          return (
            <div key={i} style={{
              display: "flex", gap: "24px", alignItems: "stretch",
              background: "#fff", borderRadius: "16px", padding: "20px",
              border: "1px solid #e1e3e5",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "default",
            }}>
              {/* Product SVG Frame */}
              <div style={{
                width: "130px", height: "130px", borderRadius: "12px",
                background: `linear-gradient(135deg, ${p.color}25, ${p.color}08)`,
                flexShrink: 0, display: "flex", alignItems: "center",
                justifyContent: "center", position: "relative",
                border: `1px solid ${p.color}15`,
              }}>
                <ProductSvg type={p.type} size={88} />
                {p.badge && (
                  <span style={{
                    position: "absolute", top: "8px", left: "8px",
                    background: accent, color: "#fff", fontSize: "9px",
                    fontWeight: 800, padding: "2px 8px", borderRadius: "20px",
                    letterSpacing: "0.5px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}>
                    {p.badge}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <h3 style={{ fontWeight: 800, fontSize: "16px", color: "#1a1c1e", margin: 0 }}>{p.name}</h3>
                    <span style={{ fontWeight: 800, fontSize: "18px", color: accent }}>{p.price}</span>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <StarRating rating={p.rating} reviews={p.reviews} />
                  </div>
                  <p style={{ color: "#6d7175", fontSize: "12px", lineHeight: "1.4", margin: "0 0 12px" }}>
                    Engineered with premium custom finishes and components. Experience unmatched aesthetics and absolute comfort.
                  </p>
                </div>

                {/* Controls */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  {/* Swatches */}
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#6d7175", fontWeight: 600 }}>Color:</span>
                    {p.swatches.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleSwatchSelect(p.type, color)}
                        style={{
                          width: "20px", height: "20px", borderRadius: "50%",
                          background: color, border: selectedColor === color ? `2px solid ${accent}` : "2px solid transparent",
                          cursor: "pointer", outline: "none", transition: "transform 0.15s",
                          transform: selectedColor === color ? "scale(1.15)" : "scale(1)",
                          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(p.name, i)}
                    style={{
                      background: cartState[i] ? "#10b981" : accent,
                      color: "#fff", border: "none", borderRadius: "8px",
                      padding: "8px 20px", fontSize: "12px", fontWeight: 700,
                      cursor: "pointer", transition: "all 0.2s",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
                      transform: cartState[i] ? "scale(0.98)" : "scale(1)",
                    }}
                  >
                    {cartState[i] ? "✓ Added!" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ),

    // 2. MINIMAL GRID (Elegant minimal fashion boutique style cards)
    "minimal-grid": (
      <div style={{ ...overlayStyle, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {products.map((p, i) => (
          <div
            key={i}
            className="showcase-card-hover"
            style={{
              background: "#fff", borderRadius: "12px", overflow: "hidden",
              border: "1px solid #e1e3e5",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            {/* Visual Header */}
            <div style={{
              height: "140px", background: `linear-gradient(135deg, ${p.color}15, ${p.color}05)`,
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
            }}>
              <ProductSvg type={p.type} size={80} />
              {p.badge && (
                <span style={{
                  position: "absolute", top: "8px", right: "8px",
                  background: "#1a1c1e", color: "#fff", fontSize: "8px",
                  fontWeight: 700, padding: "2px 8px", borderRadius: "4px",
                  letterSpacing: "0.5px", textTransform: "uppercase",
                }}>
                  {p.badge}
                </span>
              )}
            </div>

            {/* Content Details */}
            <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ minHeight: "36px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#202223", marginBottom: "2px" }}>{p.name}</div>
                <StarRating rating={p.rating} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <span style={{ fontWeight: 800, color: "#1a1c1e", fontSize: "14px" }}>{p.price}</span>
                <button
                  onClick={() => handleAddToCart(p.name, i)}
                  style={{
                    background: cartState[i] ? "#10b981" : "none",
                    color: cartState[i] ? "#fff" : "#1a1c1e",
                    border: cartState[i] ? "1px solid #10b981" : "1px solid #c9cccf",
                    borderRadius: "6px", padding: "4px 12px", fontSize: "11px",
                    fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {cartState[i] ? "✓" : "+ Add"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),

    // 3. BOLD HERO (Stunning cinematic banner drops & features grid)
    "bold-hero": (
      <div style={overlayStyle}>
        {/* Main Hero Card Banner */}
        <div style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
          borderRadius: "16px", padding: "36px 40px", color: "#fff", marginBottom: "24px",
          display: "flex", alignItems: "center", gap: "32px",
          boxShadow: `0 10px 30px ${accent}25`,
          position: "relative", overflow: "hidden",
        }}>
          {/* Subtle grid mesh overlays */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.15,
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }} />

          <div style={{ flex: 1, zIndex: 2 }}>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff", fontSize: "10px", fontWeight: 800,
              padding: "4px 12px", borderRadius: "20px", display: "inline-block",
              letterSpacing: "1.5px", marginBottom: "14px", textTransform: "uppercase",
              border: "1px solid rgba(255,255,255,0.25)",
            }}>
              EXCLUSIVE DROP '26
            </div>
            <h2 style={{ fontSize: "32px", fontWeight: 900, lineHeight: 1.1, margin: "0 0 10px", letterSpacing: "-0.5px" }}>
              Elevate Your Daily Walk
            </h2>
            <p style={{ opacity: 0.9, fontSize: "14px", lineHeight: "1.5", margin: "0 0 20px", maxWidth: "340px" }}>
              Experience the future of sports performance. Cushioned soles meets aerated dynamic fabrics.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "24px", fontWeight: 900 }}>$119.99</span>
              <button
                onClick={() => handleAddToCart("Running Shoes", 3)}
                style={{
                  background: cartState[3] ? "#10b981" : "#fff",
                  color: cartState[3] ? "#fff" : accent,
                  border: "none", borderRadius: "8px", padding: "10px 28px",
                  fontWeight: 800, fontSize: "13px", cursor: "pointer",
                  transition: "all 0.2s", boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                }}
              >
                {cartState[3] ? "✓ Instantly Added!" : "Shop Drop Now"}
              </button>
            </div>
          </div>

          {/* Epic Hero Graphic */}
          <div style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "50%", padding: "20px", flexShrink: 0,
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            zIndex: 2, transform: "rotate(-10deg) scale(1.05)",
          }}>
            <ProductSvg type="shoes" size={120} />
          </div>
        </div>

        {/* Supporting Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {products.slice(0, 3).map((p, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: "12px", padding: "16px",
              border: "1px solid #e1e3e5", textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
            }}>
              <div style={{
                width: "70px", height: "70px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${p.color}15, ${p.color}05)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ProductSvg type={p.type} size={48} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#202223", marginBottom: "2px" }}>{p.name}</div>
                <div style={{ fontWeight: 800, color: accent, fontSize: "14px" }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    // 4. CAROUSEL SPOTLIGHT (Fully functional carousel sliders with spotlights)
    "carousel-spotlight": (
      <div style={overlayStyle}>
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center" }}>
            {/* Left Button */}
            <button
              onClick={() => setCarouselIndex(prev => Math.max(0, prev - 1))}
              disabled={carouselIndex === 0}
              style={{
                background: "#fff", border: "1px solid #e1e3e5", borderRadius: "50%",
                width: "40px", height: "40px", fontSize: "18px", cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: carouselIndex === 0 ? 0.3 : 1, transition: "opacity 0.2s",
              }}
            >
              ‹
            </button>

            {/* Carousel Tracks */}
            <div style={{
              flex: 1, display: "flex", gap: "20px", overflow: "hidden",
              padding: "16px 4px", alignItems: "center",
            }}>
              {products.map((p, i) => {
                const isSpotlight = i === carouselIndex;
                return (
                  <div
                    key={i}
                    style={{
                      minWidth: isSpotlight ? "42%" : "23%",
                      background: "#fff", borderRadius: "16px", overflow: "hidden",
                      border: isSpotlight ? `2.5px solid ${accent}` : "1px solid #e1e3e5",
                      boxShadow: isSpotlight
                        ? `0 12px 30px ${accent}25`
                        : "0 2px 8px rgba(0,0,0,0.04)",
                      transform: isSpotlight ? "scale(1.04)" : "scale(0.92)",
                      opacity: isSpotlight ? 1 : 0.65,
                      transition: "all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                    onClick={() => setCarouselIndex(i)}
                  >
                    {/* Thumbnail SVG */}
                    <div style={{
                      height: isSpotlight ? "140px" : "90px",
                      background: `linear-gradient(135deg, ${p.color}20, ${p.color}05)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "height 0.35s",
                    }}>
                      <ProductSvg type={p.type} size={isSpotlight ? 84 : 54} />
                    </div>

                    {/* Meta */}
                    <div style={{ padding: isSpotlight ? "16px" : "10px" }}>
                      <div style={{
                        fontWeight: 800, color: "#1a1c1e",
                        fontSize: isSpotlight ? "14px" : "12px",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {p.name}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                        <span style={{ fontWeight: 800, color: accent, fontSize: isSpotlight ? "15px" : "13px" }}>{p.price}</span>
                        {isSpotlight && <StarRating rating={p.rating} />}
                      </div>

                      {/* CTA inside active slide */}
                      {isSpotlight && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p.name, i);
                          }}
                          style={{
                            width: "100%", marginTop: "12px", background: cartState[i] ? "#10b981" : accent,
                            color: "#fff", border: "none", borderRadius: "8px",
                            padding: "8px", fontWeight: 700, fontSize: "11px",
                            cursor: "pointer", boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                          }}
                        >
                          {cartState[i] ? "✓ Added!" : "Add to Cart"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Button */}
            <button
              onClick={() => setCarouselIndex(prev => Math.min(products.length - 1, prev + 1))}
              disabled={carouselIndex === products.length - 1}
              style={{
                background: "#fff", border: "1px solid #e1e3e5", borderRadius: "50%",
                width: "40px", height: "40px", fontSize: "18px", cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: carouselIndex === products.length - 1 ? 0.3 : 1, transition: "opacity 0.2s",
              }}
            >
              ›
            </button>
          </div>

          {/* Dots Indicator */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                style={{
                  width: idx === carouselIndex ? "24px" : "8px",
                  height: "8px", borderRadius: "4px",
                  background: idx === carouselIndex ? accent : "#e1e3e5",
                  border: "none", cursor: "pointer", padding: 0,
                  transition: "all 0.25s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),

    // 5. MASONRY GALLERY (Clean adaptively staggered cards, hover overlays)
    "masonry-gallery": (
      <div style={{ ...overlayStyle, columns: 3, columnGap: "16px" }}>
        {products.map((p, i) => {
          const heights = [160, 110, 170, 130, 190, 120];
          return (
            <div
              key={i}
              className="showcase-card-hover"
              style={{
                breakInside: "avoid", marginBottom: "16px",
                background: "#fff", borderRadius: "14px", overflow: "hidden",
                border: "1px solid #e1e3e5",
                boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
                position: "relative",
              }}
            >
              {/* Graphic container */}
              <div style={{
                height: `${heights[i]}px`,
                background: `linear-gradient(135deg, ${p.color}15, ${p.color}05)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <ProductSvg type={p.type} size={heights[i] * 0.55} />
                {p.badge && (
                  <span style={{
                    position: "absolute", top: 10, left: 10,
                    background: accent, color: "#fff", fontSize: "8px",
                    fontWeight: 800, padding: "2px 8px", borderRadius: "20px",
                  }}>
                    {p.badge}
                  </span>
                )}
              </div>

              {/* Bottom detail card */}
              <div style={{ padding: "12px", borderTop: "1px solid #f1f1f1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "12px", color: "#1a1c1e", marginBottom: "2px" }}>{p.name}</div>
                    <StarRating rating={p.rating} />
                  </div>
                  <span style={{ fontWeight: 800, color: accent, fontSize: "13px" }}>{p.price}</span>
                </div>
                
                {/* Instant overlay action buttons */}
                <button
                  onClick={() => handleAddToCart(p.name, i)}
                  style={{
                    width: "100%", marginTop: "10px",
                    background: cartState[i] ? "#10b981" : "#1a1c1e",
                    color: "#fff", border: "none", borderRadius: "6px",
                    padding: "6px", fontWeight: 700, fontSize: "10px",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  {cartState[i] ? "✓ Applied!" : "Quick Add"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    ),

    // 6. COMPACT LIST (Dense rows, image thumbs, adjusters, fast checkout adders)
    "compact-list": (
      <div style={overlayStyle}>
        <div style={{
          background: "#fff", borderRadius: "12px", border: "1px solid #e1e3e5",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)", overflow: "hidden",
        }}>
          {/* Header Row */}
          <div style={{
            display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr auto",
            gap: "10px", background: "#f6f6f7", padding: "12px 20px",
            borderBottom: "1px solid #e1e3e5",
          }}>
            {["Product Item", "SKU Identifier", "Ratings", "Subtotal", "Actions"].map((h, index) => (
              <div
                key={index}
                style={{
                  fontSize: "11px", fontWeight: 800, color: "#6d7175",
                  textTransform: "uppercase", letterSpacing: "0.5px",
                  textAlign: h === "Actions" ? "right" : "left",
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* List Rows */}
          {products.map((p, idx) => {
            const qty = quantities[idx] || 1;
            const singlePriceNum = parseFloat(p.price.replace("$", ""));
            const subtotal = `$${(singlePriceNum * qty).toFixed(2)}`;

            return (
              <div
                key={idx}
                style={{
                  display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr auto",
                  gap: "10px", padding: "14px 20px", alignItems: "center",
                  borderBottom: idx < products.length - 1 ? "1px solid #f1f1f1" : "none",
                  background: idx % 2 === 0 ? "#fff" : "#fafafa",
                  transition: "background-color 0.15s",
                }}
              >
                {/* Meta with mini thumb */}
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "8px",
                    background: `${p.color}20`, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    border: `1px solid ${p.color}15`, flexShrink: 0,
                  }}>
                    <ProductSvg type={p.type} size={28} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#1a1c1e" }}>{p.name}</div>
                    {p.badge && (
                      <span style={{
                        background: accent + "18", color: accent, fontSize: "9px",
                        padding: "1px 6px", borderRadius: "4px", fontWeight: 700,
                        display: "inline-block", marginTop: "2px",
                      }}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* SKU */}
                <div style={{ color: "#6d7175", fontSize: "12px", fontFamily: "monospace" }}>
                  SKU-88{20 + idx}
                </div>

                {/* Ratings */}
                <div>
                  <StarRating rating={p.rating} />
                </div>

                {/* Subtotal */}
                <div style={{ fontWeight: 800, color: "#1a1c1e", fontSize: "14px" }}>
                  {subtotal}
                </div>

                {/* Quantity + Quick Button */}
                <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "flex-end" }}>
                  {/* Qty selectors */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", border: "1px solid #cbd5e0",
                    borderRadius: "6px", overflow: "hidden", background: "#fff",
                  }}>
                    <button
                      onClick={() => handleQtyChange(idx, -1)}
                      style={{
                        background: "none", border: "none", width: "24px", height: "24px",
                        cursor: "pointer", fontSize: "12px", fontWeight: "bold",
                        borderRight: "1px solid #cbd5e0", color: "#6d7175",
                      }}
                    >
                      -
                    </button>
                    <span style={{ width: "24px", textAlign: "center", fontSize: "11px", fontWeight: 700 }}>{qty}</span>
                    <button
                      onClick={() => handleQtyChange(idx, 1)}
                      style={{
                        background: "none", border: "none", width: "24px", height: "24px",
                        cursor: "pointer", fontSize: "12px", fontWeight: "bold",
                        borderLeft: "1px solid #cbd5e0", color: "#6d7175",
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Add button */}
                  <button
                    onClick={() => handleAddToCart(`${qty}x ${p.name}`, idx)}
                    style={{
                      background: cartState[idx] ? "#10b981" : accent,
                      color: "#fff", border: "none", borderRadius: "6px",
                      padding: "6px 14px", fontSize: "11px", fontWeight: 700,
                      cursor: "pointer", transition: "all 0.15s",
                      minWidth: "75px",
                    }}
                  >
                    {cartState[idx] ? "✓ Added" : "+ Buy"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
  };

  const templateNames = {
    "modern-showcase": "Modern Showcase",
    "minimal-grid": "Minimal Grid",
    "bold-hero": "Bold Hero",
    "carousel-spotlight": "Carousel Spotlight",
    "masonry-gallery": "Masonry Gallery",
    "compact-list": "Compact List",
  };
  const templateName = templateNames[id] || "Premium";

  return (
    <div style={{ position: "relative" }}>
      {previews[id] || previews["modern-showcase"]}
      {locked && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(246, 246, 247, 0.4)",
          zIndex: 10,
          padding: "20px",
          textAlign: "center",
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            border: `1px solid ${overlayAccent}40`,
            borderRadius: "16px",
            padding: "24px 32px",
            boxShadow: `0 10px 30px ${overlayAccent}20`,
            maxWidth: "340px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            backdropFilter: "blur(4px)",
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: overlayAccent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#fff",
              boxShadow: `0 4px 10px ${overlayAccent}35`,
            }}>
              🔒
            </div>
            <h3 style={{ margin: "4px 0 0", fontSize: "16px", fontWeight: 700, color: "#1a1c1e" }}>
              Unlock {templateName}
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#6d7175", lineHeight: "1.4" }}>
              Get instant access to this high-converting design and upgrade your storefront experience.
            </p>
            <a href={`/app/pricing?plan=${previewTier}`} style={{
              background: overlayAccent,
              color: "#fff",
              textDecoration: "none",
              padding: "10px 24px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "13px",
              marginTop: "8px",
              boxShadow: `0 4px 12px ${overlayAccent}25`,
              transition: "transform 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              Upgrade to {PLAN_LABELS[previewTier].toUpperCase()}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const detailRowStyle = {
  display: "flex", justifyContent: "space-between",
  alignItems: "center", padding: "8px 0",
  borderBottom: "1px solid #f1f1f1",
};
const detailLabelStyle = { fontSize: "13px", color: "#6d7175" };
const detailValueStyle = { fontSize: "13px", fontWeight: 600, color: "#202223" };

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
