export async function savePlanToMetafield(admin, plan) {
  await admin.graphql(`
    mutation SetShopMetafield($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id key value }
        userErrors { field message }
      }
    }
  `, {
    variables: {
      metafields: [{
        namespace: "product_showcase",
        key: "plan",
        value: plan,
        type: "single_line_text_field",
        ownerType: "SHOP"
      }]
    }
  });
}