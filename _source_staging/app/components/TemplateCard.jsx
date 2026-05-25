import { Link } from "@remix-run/react";
import {
  Card,
  Badge,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Tag,
} from "@shopify/polaris";
import { LockIcon } from "@shopify/polaris-icons";

export function TemplateCard({ template, isUnlocked }) {
  const isPro = template.tier === "pro";
  const locked = isPro && !isUnlocked;

  return (
    <div className="template-card-wrapper">
      <Card padding="0">
        {/* Preview thumbnail */}
        <div
          className="template-thumbnail"
          style={{ background: template.previewBg }}
        >
          {locked && (
            <div className="lock-overlay">
              <div className="lock-badge">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M14 8V6a4 4 0 10-8 0v2H4v10h12V8h-2zM8 6a2 2 0 114 0v2H8V6z" />
                </svg>
                <span>PRO</span>
              </div>
            </div>
          )}
          <div className="thumbnail-mockup">
            <TemplateMiniMockup id={template.id} accent={template.accent} />
          </div>
        </div>

        {/* Card content */}
        <div style={{ padding: "16px" }}>
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                {template.name}
              </Text>
              <Badge tone={isPro ? "attention" : "success"}>
                {isPro ? "Pro" : "Free"}
              </Badge>
            </InlineStack>

            <Text variant="bodySm" as="p" tone="subdued">
              {template.description}
            </Text>

            <InlineStack gap="100" wrap>
              {template.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </InlineStack>

            <InlineStack gap="200" align="end">
              {locked ? (
                <Button
                  variant="primary"
                  tone="success"
                  url="/app/pricing"
                  icon={LockIcon}
                >
                  Unlock
                </Button>
              ) : (
                <Button
                  variant="primary"
                  url={`/app/showcase/${template.id}`}
                >
                  Preview
                </Button>
              )}
            </InlineStack>
          </BlockStack>
        </div>
      </Card>
    </div>
  );
}

/** Tiny SVG mockup rendered inside the thumbnail */
function TemplateMiniMockup({ id, accent }) {
  const mockups = {
    "modern-showcase": (
      <svg viewBox="0 0 160 90" className="mockup-svg">
        <rect x="8" y="8" width="65" height="74" rx="4" fill="rgba(255,255,255,0.3)" />
        <rect x="82" y="14" width="70" height="8" rx="3" fill="rgba(255,255,255,0.7)" />
        <rect x="82" y="28" width="50" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="82" y="37" width="60" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="82" y="46" width="45" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="82" y="62" width="40" height="14" rx="4" fill="rgba(255,255,255,0.8)" />
      </svg>
    ),
    "minimal-grid": (
      <svg viewBox="0 0 160 90" className="mockup-svg">
        {[0,1,2].map(i => (
          [0,1].map(j => (
            <rect key={`${i}-${j}`} x={8 + i*52} y={8 + j*44} width="46" height="38" rx="4" fill="rgba(255,255,255,0.4)" />
          ))
        ))}
      </svg>
    ),
    "bold-hero": (
      <svg viewBox="0 0 160 90" className="mockup-svg">
        <rect x="0" y="0" width="160" height="55" rx="0" fill="rgba(0,0,0,0.2)" />
        <rect x="16" y="14" width="80" height="10" rx="3" fill="rgba(255,255,255,0.9)" />
        <rect x="16" y="30" width="55" height="6" rx="2" fill="rgba(255,255,255,0.6)" />
        <rect x="8" y="64" width="44" height="18" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="58" y="64" width="44" height="18" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="108" y="64" width="44" height="18" rx="4" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
    "carousel-spotlight": (
      <svg viewBox="0 0 160 90" className="mockup-svg">
        <rect x="30" y="5" width="100" height="65" rx="6" fill="rgba(255,255,255,0.4)" />
        <rect x="5" y="20" width="22" height="35" rx="4" fill="rgba(255,255,255,0.2)" />
        <rect x="133" y="20" width="22" height="35" rx="4" fill="rgba(255,255,255,0.2)" />
        {[0,1,2,3,4].map(i => (
          <circle key={i} cx={62 + i*10} cy="80" r="3" fill={i===2 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)"} />
        ))}
      </svg>
    ),
    "masonry-gallery": (
      <svg viewBox="0 0 160 90" className="mockup-svg">
        <rect x="8" y="8" width="44" height="50" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="58" y="8" width="44" height="30" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="108" y="8" width="44" height="44" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="8" y="64" width="44" height="22" rx="4" fill="rgba(255,255,255,0.3)" />
        <rect x="58" y="44" width="44" height="42" rx="4" fill="rgba(255,255,255,0.3)" />
        <rect x="108" y="58" width="44" height="28" rx="4" fill="rgba(255,255,255,0.3)" />
      </svg>
    ),
    "compact-list": (
      <svg viewBox="0 0 160 90" className="mockup-svg">
        {[0,1,2,3,4].map(i => (
          <g key={i}>
            <rect x="8" y={8 + i*16} width="16" height="12" rx="2" fill="rgba(255,255,255,0.4)" />
            <rect x="30" y={10 + i*16} width="70" height="4" rx="2" fill="rgba(255,255,255,0.6)" />
            <rect x="30" y={16 + i*16} width="45" height="3" rx="2" fill="rgba(255,255,255,0.3)" />
            <rect x="126" y={9 + i*16} width="26" height="12" rx="3" fill="rgba(255,255,255,0.5)" />
          </g>
        ))}
      </svg>
    ),
  };

  return mockups[id] || mockups["modern-showcase"];
}
