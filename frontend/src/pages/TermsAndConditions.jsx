import '../styles/TermsAndConditions.css'

function TermsAndConditions() {
  return (
    <div className="terms-page">
      <header className="terms-hero">
        <div className="terms-hero-inner">
          <div>
            <h1 className="terms-title">Terms &amp; Conditions</h1>
            <p className="terms-subtitle">Updated for transparency—delivery, pricing, returns, privacy and customer support.</p>
          </div>

          <div className="terms-toc" aria-label="Jump to section">
            <a href="#business-commitments">Business commitments</a>
            <a href="#product-pricing">Product pricing</a>
            <a href="#delivery-policy">Delivery policy</a>
            <a href="#privacy-policy">Privacy policy</a>
            <a href="#customer-support">Customer support</a>
            <a href="#change-of-terms">Change of terms</a>
            <a href="#returns-refunds">Returns &amp; refunds</a>
          </div>
        </div>
      </header>

      <main className="terms-main">
        <section className="terms-section" id="business-commitments">
          <h2>1. Business commitments to customers</h2>
          <div className="terms-card">
            <p>
              We aim to provide accurate product information, clear pricing, and dependable fulfillment.
              If something is wrong with an order, we will work with you to resolve it as quickly as possible.
            </p>
            <ul>
              <li>Clear product details and pricing before checkout</li>
              <li>Order updates and status tracking where available</li>
              <li>Customer support to assist with delivery, product questions, and order issues</li>
            </ul>
          </div>
        </section>

        <section className="terms-section" id="product-pricing">
          <h2>2. Product pricing</h2>
          <div className="terms-card">
            <p>
              Prices shown on the website are in KSh and are subject to change. Promotional pricing may be time-limited.
              The price you pay is the price displayed at the time of your order checkout.
            </p>
            <ul>
              <li>Taxes, shipping, and any additional fees (if applicable) are shown during checkout</li>
              <li>In the rare event of a pricing error, we may cancel or revise the order and notify you</li>
            </ul>
          </div>
        </section>

        <section className="terms-section" id="delivery-policy">
          <h2>3. Delivery policy</h2>
          <div className="terms-card">
            <p>
              We deliver to the locations specified during checkout. Delivery timelines depend on availability and your
              address.
            </p>
            <ul>
              <li>Orders are processed after confirmation</li>
              <li>Delivery schedules can vary during peak periods</li>
              <li>If delivery is delayed, we will communicate updates where possible</li>
            </ul>
            <p className="terms-muted">
              Note: This is a general policy for this demo/app. Replace with your real courier and turnaround times.
            </p>
          </div>
        </section>

        <section className="terms-section" id="privacy-policy">
          <h2>4. Privacy policy</h2>
          <div className="terms-card">
            <p>
              We respect your privacy. We collect information you provide during signup and checkout so we can fulfill
              orders and support you.
            </p>
            <ul>
              <li>Your data is used to process orders and communicate with you about them</li>
              <li>We do not sell customer personal information</li>
              <li>We use reasonable security measures to protect user data</li>
            </ul>
            <p className="terms-muted">
              Replace this text with your real privacy terms (e.g., data retention, sharing with processors, legal basis).
            </p>
          </div>
        </section>

        <section className="terms-section" id="customer-support">
          <h2>5. Customer support</h2>
          <div className="terms-card">
            <p>
              If you have questions or issues, our support team can help you with:
              ordering, delivery status, product information, and returns/refunds.
            </p>
            <ul>
              <li>Email: support@saloony.com</li>
              <li>Response times may vary based on volume</li>
            </ul>
          </div>
        </section>

        <section className="terms-section" id="change-of-terms">
          <h2>6. Change of terms</h2>
          <div className="terms-card">
            <p>
              We may update these terms from time to time to reflect changes in our services or legal requirements.
              Updates will be posted on this page and the new effective date will apply to future orders.
            </p>
          </div>
        </section>

        <section className="terms-section" id="returns-refunds">
          <h2>7. Returns and refunds</h2>
          <div className="terms-card">
            <p>
              If an item is defective, damaged, or not as described, you may request a return or refund within a
              reasonable timeframe after delivery.
            </p>
            <ul>
              <li>Return requests must include order details</li>
              <li>We may request photos or supporting evidence</li>
              <li>Once approved, refunds will be processed to the original payment method where possible</li>
            </ul>
            <p className="terms-muted">
              This is a general returns/refunds section for the app. Update it with your exact return window,
              condition requirements, and refund method.
            </p>
          </div>
        </section>
      </main>

      <footer className="terms-footer">
        <div className="terms-footer-inner">
          <span>© {new Date().getFullYear()} Saloony. All rights reserved.</span>
          <span className="terms-footer-links">
            <a href="/">Back to home</a>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default TermsAndConditions

