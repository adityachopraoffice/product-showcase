import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { useState } from "react";
import { Form, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const loader = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export const action = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;

  return (
    <AppProvider embedded={false}>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0faf4 0%, #e8f5e9 50%, #e0f2f1 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        padding: "2rem",
      }}>
        <div style={{
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          padding: "3rem",
          width: "100%",
          maxWidth: "420px",
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <img
              src="/logo.png"
              alt="Product Showcase"
              style={{ height: "90px", marginBottom: "1rem" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <h1 style={{
              fontSize: "1.6rem",
              fontWeight: "700",
              margin: "0",
              color: "#1a2e1a",
            }}>
              <span style={{ color: "#1a2e1a" }}>product</span>{" "}
              <span style={{ color: "#5cb85c" }}>showcase</span>
            </h1>
            <p style={{
              color: "#6b7c6b",
              fontSize: "0.9rem",
              marginTop: "0.4rem",
            }}>
              Connect your Shopify store to get started
            </p>
          </div>

          {/* Form */}
          <Form method="post">
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#2d4a2d",
                marginBottom: "0.5rem",
              }}>
                Shop domain
              </label>
              <input
                name="shop"
                type="text"
                placeholder="your-store.myshopify.com"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                autoComplete="on"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: errors?.shop
                    ? "1.5px solid #e53935"
                    : "1.5px solid #c8e6c9",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#1a2e1a",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => e.target.style.border = "1.5px solid #5cb85c"}
                onBlur={(e) => e.target.style.border = errors?.shop ? "1.5px solid #e53935" : "1.5px solid #c8e6c9"}
              />
              {errors?.shop && (
                <p style={{ color: "#e53935", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                  {errors.shop}
                </p>
              )}
              <p style={{ color: "#8a9e8a", fontSize: "0.78rem", marginTop: "0.4rem" }}>
                e.g. my-shop.myshopify.com
              </p>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #5cb85c, #2e7d32)",
                color: "white",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "opacity 0.2s, transform 0.1s",
              }}
              onMouseEnter={(e) => e.target.style.opacity = "0.9"}
              onMouseLeave={(e) => e.target.style.opacity = "1"}
              onMouseDown={(e) => e.target.style.transform = "scale(0.98)"}
              onMouseUp={(e) => e.target.style.transform = "scale(1)"}
            >
              Log in with Shopify →
            </button>
          </Form>

          <p style={{
            textAlign: "center",
            color: "#9aad9a",
            fontSize: "0.75rem",
            marginTop: "1.5rem",
          }}>
            Secure OAuth authentication via Shopify
          </p>
        </div>
      </div>
    </AppProvider>
  );
}