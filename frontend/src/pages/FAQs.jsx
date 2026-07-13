import '../styles/FAQs.css'

function FAQs() {
  return (
    <div className="faqs-page">
      <header className="faqs-hero">
        <div className="faqs-hero-inner">
          <div>
            <h1 className="faqs-title">FAQs: Cosmetics &amp; Product Safety</h1>
            <p className="faqs-subtitle">
              Everything you want to know about cosmetics—benefits, risks of unregulated products, services,
              import policies, and how to check product safety.
            </p>
          </div>

          <div className="faqs-toc" aria-label="Jump to section">
            <a href="#benefits">Benefits of cosmetics</a>
            <a href="#unregulated-risks">Side effects of unregulated cosmetics</a>
            <a href="#services">Services offered by our shops</a>
            <a href="#import-policy">Our import policies</a>
            <a href="#check-safety">How to check for product safety</a>
            <a href="#patch-test">How to patch test &amp; use safely</a>
            <a href="#when-irritated">What to do if you get irritation</a>
          </div>
        </div>
      </header>

      <main className="faqs-main">
        <section className="faqs-section" id="benefits">
          <h2>1. What are the benefits of cosmetics?</h2>
          <div className="faqs-card">
            <p>
              Cosmetics can help improve your appearance and confidence, and many products are formulated with
              ingredients that can moisturize, cleanse, exfoliate, or protect.
            </p>
            <ul>
              <li>
                <strong>Skincare (cleansers, moisturizers, serums):</strong> supports hydration, comfort, and a
                healthier-looking skin barrier.
              </li>
              <li>
                <strong>Hair care (shampoo, conditioners, masks):</strong> helps manage dryness, frizz, and
                scalp concerns.
              </li>
              <li>
                <strong>Cosmetics (lip, face, nails):</strong> adds color/finish and can help you express
                your style.
              </li>
            </ul>
            <p className="faqs-muted">
              Note: Results vary by skin type, hair type, and routine consistency.
            </p>
          </div>
        </section>

        <section className="faqs-section" id="unregulated-risks">
          <h2>2. What side effects can happen with unregulated cosmetics?</h2>
          <div className="faqs-card">
            <p>
              Unregulated products (or counterfeit products) may contain incorrect ingredients, unsafe chemicals,
              poor preservation, or inaccurate labeling.
            </p>
            <ul>
              <li>
                <strong>Irritation:</strong> redness, itching, burning, or stinging—especially around eyes and
                sensitive areas.
              </li>
              <li>
                <strong>Allergic reactions:</strong> swelling, hives, or persistent rash.
              </li>
              <li>
                <strong>Breakouts:</strong> clogged pores or worsening acne.
              </li>
              <li>
                <strong>Serious reactions:</strong> blistering or severe dermatitis (stop use immediately and
                seek medical advice).
              </li>
              <li>
                <strong>Inconsistent quality:</strong> texture, smell, or effectiveness that doesn’t match what’s
                advertised.
              </li>
            </ul>
            <p className="faqs-muted">
              If you experience severe symptoms, stop using the product and consult a healthcare professional.
            </p>
          </div>
        </section>

        <section className="faqs-section" id="services">
          <h2>3. What services do our shops offer?</h2>
          <div className="faqs-card">
            <ul>
              <li>
                <strong>Product selection support:</strong> help choosing products based on your needs (skin type,
                hair type, usage goals).
              </li>
              <li>
                <strong>After-sales support:</strong> help with usage guidance and troubleshooting in case of
                irritation.
              </li>
              <li>
                <strong>Store/van assistance:</strong> physical shop visits for faster help and demonstration.
              </li>
              <li>
                <strong>Guidance for safe routines:</strong> simple recommendations for cleansing, moisturizing,
                and applying cosmetics responsibly.
              </li>
            </ul>
          </div>
        </section>

        <section className="faqs-section" id="import-policy">
          <h2>4. What is your import policy?</h2>
          <div className="faqs-card">
            <p>
              Our goal is to supply cosmetics that are suitable for safe consumer use. While specific regulations
              can vary by country, our approach focuses on quality, traceability, and documentation.
            </p>
            <ul>
              <li>
                <strong>Supplier screening:</strong> we source from reputable channels and require product documentation
                where applicable.
              </li>
              <li>
                <strong>Batch traceability:</strong> keeping lot/batch information to help track and investigate
                issues.
              </li>
              <li>
                <strong>Packaging &amp; labeling checks:</strong> ensuring items have required labeling and appear in
                good condition.
              </li>
              <li>
                <strong>Storage considerations:</strong> avoiding heat/direct sunlight exposure to preserve product
                quality.
              </li>
            </ul>
            <p className="faqs-muted">
              Replace this section with your official policy text if you have one.
            </p>
          </div>
        </section>

        <section className="faqs-section" id="check-safety">
          <h2>5. How can I check if a cosmetic product is safe?</h2>
          <div className="faqs-card">
            <p>Use this checklist before buying and before first use:</p>
            <ul>
              <li>
                <strong>Check the expiration date:</strong> don’t use past the expiry, and be cautious with products that
                show separation or unusual changes.
              </li>
              <li>
                <strong>Look for batch/lot numbers:</strong> helps trace the product if there’s an issue.
              </li>
              <li>
                <strong>Read the ingredients list:</strong> identify allergens/sensitizers and confirm it matches the
                product type.
              </li>
              <li>
                <strong>Inspect packaging:</strong> avoid damaged containers, missing seals, or poor labeling.
              </li>
              <li>
                <strong>Be careful with claims:</strong> avoid products that promise “instant permanent” results or
                bypass common safety steps.
              </li>
              <li>
                <strong>Avoid suspicious offers:</strong> extremely cheap items or “new” products without proper info can be
                counterfeit.
              </li>
              <li>
                <strong>Patch test:</strong> always test a small amount before full use (see below).
              </li>
            </ul>
          </div>
        </section>

        <section className="faqs-section" id="patch-test">
          <h2>6. How do I patch test and use cosmetics safely?</h2>
          <div className="faqs-card">
            <ol className="faqs-steps">
              <li>Apply a small amount to a discreet area (e.g., inner arm or behind the ear).</li>
              <li>Wait 24–48 hours and observe for redness, itching, swelling, or burning.</li>
              <li>If no reaction occurs, use according to instructions.</li>
              <li>Start slowly if you have sensitive skin or are trying a strong active ingredient product.</li>
            </ol>
            <p className="faqs-muted">
              Stop immediately if you notice irritation. If symptoms continue, seek medical advice.
            </p>
          </div>
        </section>

        <section className="faqs-section" id="when-irritated">
          <h2>7. What should I do if I experience irritation?</h2>
          <div className="faqs-card">
            <ul>
              <li><strong>Stop using the product right away.</strong></li>
              <li>Rinse the affected area gently with lukewarm water.</li>
              <li>Avoid using other products on the same area until the skin calms down.</li>
              <li>
                <strong>Contact support:</strong> share the product name and batch/lot number so we can advise
                properly.
              </li>
              <li>
                If you have severe symptoms (swelling, breathing difficulty, widespread rash), <strong>seek urgent medical care</strong>.
              </li>
            </ul>
            <p className="faqs-muted">
              For this demo app, contact channels can be updated to match your real support email/number.
            </p>
          </div>
        </section>
      </main>

      <footer className="faqs-footer">
        <div className="faqs-footer-inner">
          <span>© {new Date().getFullYear()} Saloony. All rights reserved.</span>
          <span className="faqs-footer-links">
            <a href="/">Back to home</a>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default FAQs

