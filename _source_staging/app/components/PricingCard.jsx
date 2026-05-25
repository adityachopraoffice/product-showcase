import { Card, Badge, Button, Text, BlockStack, InlineStack, Icon, List } from "@shopify/polaris";
import { CheckIcon, StarIcon } from "@shopify/polaris-icons";

export function PricingCard({ plan, currentPlan, onUpgrade }) {
  const isCurrentPlan = plan.id === currentPlan;

  return (
    <div className={`pricing-card-wrapper${plan.highlighted ? " pricing-card--highlighted" : ""}`}>
      {plan.highlighted && (
        <div className="pricing-popular-badge">Most Popular</div>
      )}
      <Card padding="600">
        <BlockStack gap="400">
          {/* Header */}
          <BlockStack gap="100">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="headingLg" as="h3" fontWeight="bold">
                {plan.name}
              </Text>
              {isCurrentPlan && <Badge tone="success">Current</Badge>}
            </InlineStack>
            <Text variant="bodySm" as="p" tone="subdued">
              {plan.description}
            </Text>
          </BlockStack>

          {/* Price */}
          <div className="pricing-price-block">
            <span className="pricing-currency">$</span>
            <span className="pricing-amount">{plan.price}</span>
            <span className="pricing-period">/{plan.period}</span>
          </div>

          {/* Divider */}
          <div className="pricing-divider" />

          {/* Features */}
          <BlockStack gap="200">
            <Text variant="bodyMd" as="p" fontWeight="semibold">
              What's included:
            </Text>
            <List type="bullet" gap="extraTight">
              {plan.features.map((feature) => (
                <List.Item key={feature}>
                  <InlineStack gap="150" blockAlign="center" wrap={false}>
                    <span className="feature-check" style={{ color: plan.color }}>✓</span>
                    <Text variant="bodySm" as="span">{feature}</Text>
                  </InlineStack>
                </List.Item>
              ))}
            </List>
          </BlockStack>

          {/* CTA */}
          <Button
            variant={plan.highlighted ? "primary" : "secondary"}
            size="large"
            fullWidth
            disabled={isCurrentPlan}
            onClick={() => onUpgrade && onUpgrade(plan.id)}
            url={plan.id === "enterprise" ? "mailto:sales@example.com" : undefined}
          >
            {isCurrentPlan ? "Current Plan" : plan.cta}
          </Button>
        </BlockStack>
      </Card>
    </div>
  );
}
