import '../styles/BlogNews.css'
import saloonyLogo from '../assets/images/saloony-logo.jpg'

function BlogNews() {
  // Static content (cosmetic products only)
  const latestAdditions = [
    {
      title: 'Argan Oil Shampoo (250ml)',
      tag: 'New',
      price: 'KSh 1,499',
      imgAlt: 'Argan Oil Shampoo',
      // Keeping images optional; if you want real product images mapped later, we can wire it.
      image: null,
    },
    {
      title: 'Sulfate-Free Shampoo (400ml)',
      tag: 'Just In',
      price: 'KSh 1,899',
      imgAlt: 'Sulfate-Free Shampoo',
      image: null,
    },
    {
      title: 'Keratin Conditioner (200ml)',
      tag: 'Trending',
      price: 'KSh 1,299',
      imgAlt: 'Keratin Conditioner',
      image: null,
    },
    {
      title: 'Lip Gloss (Matte Glow)',
      tag: 'New',
      price: 'KSh 999',
      imgAlt: 'Lip Gloss',
      image: null,
    },
  ]

  const onOffer = [
    {
      title: 'Olive Oil (Hair & Skin)',
      badge: '20% OFF',
      price: 'Was KSh 1,500',
      now: 'Now KSh 1,200',
      image: null,
      imgAlt: 'Olive Oil',
    },
    {
      title: 'Anti-Dandruff Shampoo',
      badge: '15% OFF',
      price: 'Was KSh 1,800',
      now: 'Now KSh 1,530',
      image: null,
      imgAlt: 'Anti-Dandruff Shampoo',
    },
    {
      title: 'Facial Cleanser (Gentle Foam)',
      badge: '10% OFF',
      price: 'Was KSh 1,200',
      now: 'Now KSh 1,080',
      image: null,
      imgAlt: 'Facial Cleanser',
    },
  ]

  const featuredArticles = [
    {
      product: 'Olive Oil',
      title: 'How to use olive oil for soft hair (without weighing it down)',
      readTime: '4 min read',
    },
    {
      product: 'Anti-Dandruff Shampoo',
      title: 'A quick routine to reduce flakes and keep your scalp fresh',
      readTime: '5 min read',
    },
    {
      product: 'Keratin Conditioner',
      title: 'Keratin care: what to expect after 2 weeks of use',
      readTime: '6 min read',
    },
  ]

  const usefulStuff = [
    {
      title: 'How to choose the right shampoo',
      desc: 'Match your hair needs (dryness, dandruff, volume) to the formula that fits.',
      icon: '🧴',
    },
    {
      title: 'Self-care checklist (weekly)',
      desc: 'A simple plan: cleanse, treat, moisturize, protect—done in under 30 minutes.',
      icon: '✅',
    },
    {
      title: 'Storage tips for cosmetics',
      desc: 'Keep products away from heat and direct sunlight to maintain their quality.',
      icon: '🧼',
    },
  ]

  return (
    <div className="blognews-page">
      <header className="blognews-hero">
        <div className="blognews-hero-inner">
          <div className="blognews-brand">
            <img className="blognews-logo" src={saloonyLogo} alt="Saloony logo" />
            <div>
              <div className="blognews-title">Saloony Blog</div>
              <div className="blognews-subtitle">News on cosmetics, new arrivals, offers & tips</div>
            </div>
          </div>

          <div className="blognews-hero-kpis">
            <div className="blognews-kpi">
              <div className="blognews-kpi-top">🆕 Latest</div>
              <div className="blognews-kpi-val">{latestAdditions.length} additions</div>
            </div>
            <div className="blognews-kpi">
              <div className="blognews-kpi-top">🏷️ Deals</div>
              <div className="blognews-kpi-val">{onOffer.length} offers</div>
            </div>
            <div className="blognews-kpi">
              <div className="blognews-kpi-top">📚 Guides</div>
              <div className="blognews-kpi-val">{featuredArticles.length} articles</div>
            </div>
          </div>
        </div>
      </header>

      <main className="blognews-main">
        <section className="blognews-section">
          <div className="section-head">
            <h2>Product News</h2>
            <p>Clean, practical updates to help you choose what to buy next.</p>
          </div>
          <div className="news-banner">
            <div className="news-banner-left">
              <div className="news-pill">✨ Editor’s Pick</div>
              <h3>Build a simple routine (3 steps)</h3>
              <p>
                Cleanse, treat, and protect. Start with a gentle cleanser, follow with a conditioner/mask, and
                finish with your favorite finishing product.
              </p>
            </div>
            <div className="news-banner-right">
              <div className="news-badge">Weekly routine</div>
              <div className="news-stats">
                <div className="news-stat">
                  <div className="news-stat-num">30</div>
                  <div className="news-stat-label">minutes</div>
                </div>
                <div className="news-stat">
                  <div className="news-stat-num">3</div>
                  <div className="news-stat-label">steps</div>
                </div>
                <div className="news-stat">
                  <div className="news-stat-num">1</div>
                  <div className="news-stat-label">habit</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="blognews-section">
          <div className="section-head">
            <h2>Latest Additions</h2>
            <p>Fresh cosmetics and hair care additions you can try now.</p>
          </div>

          <div className="card-grid">
            {latestAdditions.map((p) => (
              <article className="product-card" key={p.title}>
                <div className="product-card-media">
                  {p.image ? (
                    <img src={p.image} alt={p.imgAlt} />
                  ) : (
                    <div className="product-card-placeholder" aria-label={p.imgAlt}>
                      💄
                    </div>
                  )}
                  <span className="product-card-tag">{p.tag}</span>
                </div>
                <div className="product-card-body">
                  <h3 className="product-card-title">{p.title}</h3>
                  <div className="product-card-price">{p.price}</div>
                  <button className="product-card-btn" type="button" onClick={() => alert('Demo: connect to product page later')}>View details</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="blognews-section">
          <div className="section-head">
            <h2>Products on Offer</h2>
            <p>Limited discounts on popular beauty essentials.</p>
          </div>

          <div className="card-grid">
            {onOffer.map((p) => (
              <article className="offer-card" key={p.title}>
                <div className="offer-card-media">
                  {p.image ? (
                    <img src={p.image} alt={p.imgAlt} />
                  ) : (
                    <div className="offer-card-placeholder" aria-label={p.imgAlt}>
                      🛍️
                    </div>
                  )}
                  <div className="offer-card-badge">{p.badge}</div>
                </div>
                <div className="offer-card-body">
                  <h3 className="offer-card-title">{p.title}</h3>
                  <div className="offer-card-old">{p.price}</div>
                  <div className="offer-card-now">{p.now}</div>
                  <button className="offer-card-btn" type="button" onClick={() => alert('Demo: apply discount logic later')}>Get offer</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="blognews-section">
          <div className="section-head">
            <h2>Articles on Select Products</h2>
            <p>Short guides tailored to the products most customers love.</p>
          </div>

          <div className="article-list">
            {featuredArticles.map((a) => (
              <article key={a.title} className="article-row">
                <div className="article-left">
                  <div className="article-product">{a.product}</div>
                  <h3 className="article-title">{a.title}</h3>
                </div>
                <div className="article-right">
                  <div className="article-meta">{a.readTime}</div>
                  <button className="article-btn" type="button" onClick={() => alert('Demo: open article later')}>Read</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="blognews-section">
          <div className="section-head">
            <h2>More Useful Stuff</h2>
            <p>Small tips that make a big difference.</p>
          </div>

          <div className="card-grid card-grid-3">
            {usefulStuff.map((u) => (
              <article key={u.title} className="info-card">
                <div className="info-card-icon">{u.icon}</div>
                <h3 className="info-card-title">{u.title}</h3>
                <p className="info-card-desc">{u.desc}</p>
                <button className="info-card-btn" type="button" onClick={() => alert('Demo: add useful content later')}>Learn</button>
              </article>
            ))}
          </div>
        </section>

        <section className="blognews-section blognews-cta">
          <div className="cta-card">
            <div>
              <h2>Want updates on discounts?</h2>
              <p>Check back often—new offers and product news are added regularly.</p>
            </div>
            <div className="cta-actions">
              <button className="cta-primary" type="button" onClick={() => alert('Demo: connect notifications later')}>Subscribe</button>
              <button className="cta-secondary" type="button" onClick={() => (window.location.href = '/')}>
                Browse landing
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default BlogNews

