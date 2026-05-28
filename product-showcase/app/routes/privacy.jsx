export default function Privacy() {
  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "3rem 2rem",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#202223",
      lineHeight: "1.7",
    }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Privacy Policy
      </h1>
      <p style={{ color: "#6d7175", marginBottom: "2rem" }}>
        Last updated: May 28, 2026
      </p>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.5rem" }}>1. Introduction</h2>
        <p>Product Showcase ("we", "our", or "us") is a Shopify app that helps merchants display their products beautifully. This Privacy Policy explains how we collect, use, and protect your information.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.5rem" }}>2. Information We Collect</h2>
        <p>When you install Product Showcase, we collect:</p>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>Your Shopify store domain and basic shop information</li>
          <li>Your subscription plan (free, starter, or pro)</li>
          <li>Showcase configurations you create within the app</li>
          <li>Access tokens required to interact with the Shopify API</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.5rem" }}>3. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>Provide and improve the Product Showcase service</li>
          <li>Manage your subscription and billing</li>
          <li>Display your products using your chosen templates</li>
          <li>Send important service updates</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.5rem" }}>4. Data Storage</h2>
        <p>Your data is stored securely on servers hosted by Vercel and Neon (PostgreSQL). We do not sell, trade, or transfer your data to third parties.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.5rem" }}>5. Data Retention</h2>
        <p>We retain your data for as long as your app is installed. When you uninstall Product Showcase, your data is deleted within 30 days.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.5rem" }}>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>Access the data we hold about your store</li>
          <li>Request deletion of your data</li>
          <li>Opt out of non-essential communications</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.5rem" }}>7. Shopify API</h2>
        <p>Our use of Shopify API data is governed by Shopify's API Terms of Service. We only request the minimum permissions necessary to operate the app.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.5rem" }}>8. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p style={{ color: "#5cb85c", fontWeight: 600 }}>adityachopraoffice@gmail.com</p>
      </section>

      <div style={{ borderTop: "1px solid #e1e3e5", paddingTop: "1.5rem", color: "#6d7175", fontSize: "0.9rem" }}>
        <p>Product Showcase is developed by Aditya Chopra. By using our app, you agree to this Privacy Policy.</p>
      </div>
    </div>
  );
}
