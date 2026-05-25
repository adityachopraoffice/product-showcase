import { TemplateCard } from "./TemplateCard";
import { Text, BlockStack, InlineStack } from "@shopify/polaris";

export function TemplateGrid({ templates, userPlan = "free" }) {
  const isUnlocked = userPlan === "pro" || userPlan === "enterprise";

  return (
    <BlockStack gap="400">
      <div className="template-grid">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isUnlocked={isUnlocked}
          />
        ))}
      </div>
    </BlockStack>
  );
}
