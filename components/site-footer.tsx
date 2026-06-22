"use client";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8 21l3-10" />
      <path d="M9.5 14c-1-.6-1.5-1.7-1.5-3 0-2.8 2.2-5 5.3-5 3 0 5.2 2 5.2 4.7 0 2.9-1.7 5.3-4.3 5.3-1.2 0-2.1-.6-2.4-1.4" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10.5" x2="7.5" y2="17" />
      <circle cx="7.5" cy="7" r="0.4" fill="currentColor" />
      <path d="M11.5 17v-3.6c0-1.6 1-2.4 2.2-2.4 1.2 0 2 .8 2 2.4V17" />
      <line x1="11.5" y1="10.5" x2="11.5" y2="17" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer
      className="site-footer"
      style={{
        background: "var(--primary)",
        color: "var(--white)",
        padding: "clamp(30px,3.2vw,44px) clamp(20px,4.5vw,70px) clamp(18px,2.2vw,26px)"
      }}
    >
      <div style={{ maxWidth: "1680px", margin: "0 auto" }}>
        <div className="footer-grid">
          <div className="footer-col footer-col-brand" data-reveal="up">
            <img src="/assets/logo/calyco-logo.png" alt="Calyco Interiors" className="footer-logo" />
            <p className="footer-tagline">
              Designing homes people love living in. Premium interiors with complete transparency.
            </p>
            <p className="footer-heading" style={{ marginTop: "30px" }}>Newsletter</p>
            <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" required aria-label="Email address" />
              <button type="submit" aria-label="Subscribe">
                <SendIcon />
              </button>
            </form>
          </div>
          <div className="footer-col" data-reveal="up" data-delay="80">
            <p className="footer-heading">Explore</p>
            <a href="/design" className="footer-link">Design</a>
            <a href="/about" className="footer-link">About Us</a>
            <a href="/ai-design" className="footer-link">AI Design</a>
          </div>
          <div className="footer-col" data-reveal="up" data-delay="140">
            <p className="footer-heading">Cities</p>
            <a href="/#work" className="footer-link">Delhi</a>
            <a href="/#work" className="footer-link">Mumbai</a>
            <a href="/#work" className="footer-link">Pune</a>
            <a href="/#work" className="footer-link">Bengaluru</a>
          </div>
          <div className="footer-col" data-reveal="up" data-delay="200">
            <p className="footer-heading">Connect</p>
            <a href="mailto:info@calyco.interiors" className="footer-link">info@calyco.interiors</a>
            <div className="footer-social-row">
              <a href="#" className="footer-social-btn" title="Instagram" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="#" className="footer-social-btn" title="Pinterest" aria-label="Pinterest">
                <PinterestIcon />
              </a>
              <a href="#" className="footer-social-btn" title="LinkedIn" aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>

        <div
          className="footer-bottom-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            paddingTop: "clamp(16px,2vw,22px)",
            fontSize: "13px",
            letterSpacing: ".04em",
            color: "rgba(255,255,255,.5)"
          }}
        >
          <span>© 2025 Calyco Interiors. All rights reserved.</span>
          <a href="/#hero" className="footer-link">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
