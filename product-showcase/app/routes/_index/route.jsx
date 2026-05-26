import { redirect, Form, useLoaderData } from "react-router";
import { login } from "../../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData();

  return (
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
        maxWidth: "440px",
      }}>
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src="/logo.png"
            alt="Product Showcase"
            style={{ height: "90px", marginBottom: "1rem" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <h1 style={{ fontSize: "1.6rem", fontWeight: "700", margin: "0", color: "#1a2e1a" }}>
            <span style={{ color: "#1a2e1a" }}>product</span>{" "}
            <span style={{ color: "#5cb85c" }}>showcase</span>
          </h1>
          <p style={{ color: "#6b7c6b", fontSize: "0.9rem", marginTop: "0.4rem" }}>
            Beautifully display your Shopify products
          </p>
        </div>

        {/* Login Form */}
        {showForm && (
          <Form method="post" action="/auth/login">
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
                type="text"
                name="shop"
                placeholder="your-store.myshopify.com"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1.5px solid #c8e6c9",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#1a2e1a",
                }}
              />
              <p style={{ color: "#8a9e8a", fontSize: "0.78rem", marginTop: "0.4rem" }}>
                e.g: my-shop-domain.myshopify.com
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
              }}
            >
              Log in with Shopify →
            </button>
          </Form>
        )}

        {/* Features */}
        <div style={{ marginTop: "2rem", borderTop: "1px solid #e8f5e9", paddingTop: "1.5rem" }}>
          {[
            ["🛍️", "Smart Product Display", "Showcase your products with beautiful, customizable templates"],
            ["⚡", "Lightning Fast", "Optimized for performance and seamless Shopify integration"],
            ["🎨", "Fully Customizable", "Tailor the look and feel to match your brand perfectly"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.2rem" }}>{icon}</span>
              <div>
                <strong style={{ fontSize: "0.85rem", color: "#2d4a2d" }}>{title}</strong>
                <p style={{ fontSize: "0.8rem", color: "#6b7c6b", margin: "0.1rem 0 0" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "#9aad9a", fontSize: "0.75rem", marginTop: "1rem" }}>
          Secure OAuth authentication via Shopify
        </p>
      </div>
    </div>
  );
}