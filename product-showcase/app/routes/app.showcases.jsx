import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    const showcase = await db.showcase.create({
      data: {
        shop: session.shop,
        name: formData.get("name"),
        templateId: formData.get("templateId"),
        status: "draft",
      },
    });
    return { success: true, showcase };
  }

  if (intent === "update") {
    const showcase = await db.showcase.update({
      where: { id: formData.get("id") },
      data: {
        name: formData.get("name"),
        templateId: formData.get("templateId"),
        status: formData.get("status"),
      },
    });
    return { success: true, showcase };
  }

  if (intent === "delete") {
    await db.showcase.delete({
      where: { id: formData.get("id") },
    });
    return { success: true };
  }

  if (intent === "toggleStatus") {
    const existing = await db.showcase.findUnique({
      where: { id: formData.get("id") },
    });
    const showcase = await db.showcase.update({
      where: { id: formData.get("id") },
      data: { status: existing.status === "active" ? "draft" : "active" },
    });
    return { success: true, showcase };
  }

  return { error: "Unknown intent" };
};

export const headers = (headersArgs) => boundary.headers(headersArgs);