import '../styles/Landing.css'
import saloonyLogo from '../assets/images/saloony-logo.jpg'
import heroBg from '../components/landingpageimages/image1.jpg'
import aboutImg from '../components/landingpageimages/about.jpg'
import servicesImg from '../components/landingpageimages/services.jpg'
import LandingVanScroll from '../components/LandingVanScroll'
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  WhatsAppIcon,
} from '../components/social-logos/SocialIcons'

function Landing() {
  return (

    <div className="landing-page">
      <header className="landing-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <LandingVanScroll />

        <div className="landing-hero-inner">
          <div className="landing-brand">
            <img className="landing-logo" src={saloonyLogo} alt="Saloony logo" />
            <div>
              <div className="landing-title">Saloony</div>
              <div className="landing-subtitle">Beauty & essentials delivered — shop with confidence</div>
            </div>
          </div>

          <div className="landing-cta">
            <a className="landing-cta-primary" href="/login">
              Login
            </a>
            <a className="landing-cta-secondary" href="/signup">
              Create account
            </a>
          </div>
        </div>
      </header>


      <main className="landing-main">
        <section className="landing-section landing-about-section">
          <div className="landing-about-grid">
            <div className="landing-about-imageWrap">
              <img className="landing-about-image" src={aboutImg} alt="About the shop" />
            </div>
            <div className="landing-about-content">
              <h2>About the shop</h2>
              <p>
                <strong>Saloony</strong> is a simple, fast way to order beauty products for home use. We’re focused on a
                clean catalogue, clear pricing, and reliable fulfillment.
              </p>
              <p>
                Whether you’re restocking hair care, skincare, or cosmetics, you’ll find what you need in a few clicks.
              </p>
            </div>
          </div>
        </section>


        <section className="landing-section">
          <h2>Services offered</h2>

          <div className="landing-services-layout">
            <div className="landing-services-left">
              <div className="landing-services-u-grid landing-services-grid">
                <div className="landing-card landing-card-u-left">
                  <div className="landing-card-icon">🚚</div>
                  <h3>Quick delivery workflow</h3>
                  <p>Order checkout updates inventory and moves orders through status tracking.</p>
                </div>




                <div className="landing-card landing-card-u-bottom">
                  <div className="landing-card-icon">🛍️</div>
                  <h3>Online shopping</h3>
                  <p>Browse products, view details, and add items to your cart.</p>
                </div>

















              </div>
            </div>

            <div className="landing-services-imageWrap">
              <img className="landing-services-image" src={servicesImg} alt="Services" />
            </div>
          </div>

          <div className="landing-locations-block">
            <h3>Locations</h3>
            <div className="landing-services-subgrid">
              <div className="landing-card">
                <div className="landing-card-icon">🏬</div>
                <h3>Physical van shop (Mombasa)</h3>
                <p>Visit our van shop across Mombasa and pick up essentials fast.</p>
              </div>
              <div className="landing-card">
                <div className="landing-card-icon">📍</div>
                <h3>Locations in Mombasa</h3>
                <p>Nyali • Tudor • Mtwapa • Bamburi • Ganjoni • Majengo • Kisauni • Changamwe</p>
              </div>
            </div>
          </div>

        </section>


        <section className="landing-section landing-testimonials">
          <h2>Testimonials</h2>
          <div className="landing-testimonial-grid">
            <div className="landing-testimonial">
              <p className="quote">“The checkout is quick and my items always arrive on time.”</p>
              <div className="who">— Njeri</div>
            </div>
            <div className="landing-testimonial">
              <p className="quote">“Great product variety and clear updates on my order status.”</p>
              <div className="who">— Maina</div>
            </div>
            <div className="landing-testimonial">
              <p className="quote">“Customer experience is smooth. I love how easy it is to reorder.”</p>
              <div className="who">— Amina</div>
            </div>
          </div>
        </section>
      </main>

      <section className="landing-contact">
        <div className="landing-contact-inner">
          <h2 className="landing-contact-title">Contact us</h2>
          <div className="landing-contact-cards">
            <div className="landing-contact-card">
              <div className="landing-contact-card-heading">Our Socials</div>
              <div className="landing-contact-links">
                <a href="#" target="_blank" rel="noreferrer">
                  <FacebookIcon className="landing-social-icon" title="Facebook" /> Facebook
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  <InstagramIcon className="landing-social-icon" title="Instagram" /> Instagram
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  <TikTokIcon className="landing-social-icon" title="TikTok" /> TikTok
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  <XIcon className="landing-social-icon" title="X" /> Twitter/X
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  <WhatsAppIcon className="landing-social-icon" title="WhatsApp" /> WhatsApp
                </a>
              </div>
            </div>

            <div className="landing-contact-card">
              <div className="landing-contact-card-heading">Email & Address</div>
              <div className="landing-contact-links">
                <a href="mailto:hello@saloony.com">hello@saloony.com</a>
                <a href="mailto:support@saloony.com">support@saloony.com</a>
                <span className="landing-contact-muted">Physical address:</span>
                <span className="landing-contact-address">Saloony Van Shop, Mombasa, Kenya</span>
              </div>
            </div>

            <div className="landing-contact-card">
              <div className="landing-contact-card-heading">Quick Links</div>
              <div className="landing-contact-links">
                <a href="/blog">Blog</a>

                <a href="/faqs">FAQs</a>
                <a href="/terms-conditions" >Terms & Conditions</a>
                <a href="/terms-conditions#privacy-policy" >Privacy Policy</a>
                <a href="/" >Browser Settings</a>

              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <span>© {new Date().getFullYear()} Saloony. All rights reserved.</span>
          <span className="landing-footer-links">
            <a href="/login">Login</a>
            <span className="sep">•</span>
            <a href="/signup">Signup</a>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default Landing


