import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`Received compliance webhook: ${topic} for ${shop}`);

  switch (topic) {
    case "CUSTOMERS_DATA_REQUEST":
    case "customers/data_request":
      // Customers request their data from the store owner.
      // Since this app does not store or process any customer personal data,
      // there is no data to return.
      console.log("Handling CUSTOMERS_DATA_REQUEST: No customer data stored by the app.");
      break;

    case "CUSTOMERS_REDACT":
    case "customers/redact":
      // Store owners request to delete customer data.
      // Since this app does not store or process any customer personal data,
      // no action is required.
      console.log("Handling CUSTOMERS_REDACT: No customer data stored by the app.");
      break;

    case "SHOP_REDACT":
    case "shop/redact":
      // Store owners request to delete shop data after uninstalling the app.
      // Any persistent shop data (like showcases or billing plans) stored in the database
      // can be cleaned up here if necessary.
      console.log(`Handling SHOP_REDACT: Cleaning up database records for shop ${shop}`);
      try {
        // Delete all showcases associated with this shop if the model exists in the DB client
        if (db.showcase) {
          await db.showcase.deleteMany({
            where: { shop }
          });
        }
        // Delete the shop plan record if the model exists in the DB client
        if (db.shopPlan) {
          await db.shopPlan.deleteMany({
            where: { shop }
          });
        }
        console.log(`Successfully redacted data for shop ${shop}`);
      } catch (error) {
        console.error(`Error during shop redact for ${shop}:`, error);
      }
      break;

    default:
      console.log(`Unhandled topic: ${topic}`);
      return new Response("Unhandled webhook topic", { status: 404 });
  }

  return new Response("Webhook processed successfully", { status: 200 });
};
