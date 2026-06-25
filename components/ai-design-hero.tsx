"use client";

import { motion } from "motion/react";

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function AIHeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="ai-hero-badge"
    >
      <SparkleIcon />
      <span>AI Design — In Development</span>
    </motion.div>
  );
}

function AIHeroStatCard() {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="ai-hero-stat-card"
    >
      <div>
        <p className="ai-hero-stat-num">Live Now</p>
        <p className="ai-hero-stat-label">Estimator &amp; Visualizer</p>
      </div>
      <motion.a href="#estimator" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="ai-hero-stat-btn">
        <span className="ai-hero-stat-btn-icon">
          <ArrowUpRightIcon className="ai-hero-icon-sm" />
        </span>
        Try It Now
      </motion.a>
    </motion.div>
  );
}

function AIHeroCorner() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="ai-hero-corner"
    >
      <div className="ai-hero-corner-mask ai-hero-corner-mask-top" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none">
          <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" style={{ fill: "var(--bg)" }} />
        </svg>
      </div>
      <div className="ai-hero-corner-mask ai-hero-corner-mask-left" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none">
          <path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" style={{ fill: "var(--bg)" }} />
        </svg>
      </div>

      <div className="ai-hero-corner-icon">
        <ArrowUpRightIcon className="ai-hero-icon-lg" />
      </div>
      <div>
        <p className="ai-hero-corner-title">Our Process</p>
        <a href="/design" className="ai-hero-corner-link">
          <span>Explore</span>
          <ChevronRightIcon className="ai-hero-icon-sm" />
        </a>
      </div>
    </motion.div>
  );
}

export function AIDesignHero() {
  return (
    <div className="ai-hero-wrap">
      <section className="ai-hero-section">
        <img
          src="/assets/images/Luxurious%20home%20theater%20with%20ambient%20lighting.png"
          alt="A luxurious home theater with ambient starlit ceiling lighting"
          className="ai-hero-bg"
          style={{ objectPosition: "62% 32%" }}
        />
        <div className="ai-hero-scrim" />
        <div className="ai-hero-content">
          <div className="ai-hero-text">
            <AIHeroBadge />
            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="ai-hero-heading"
            >
              Design Intelligence, Tuned To Your Space.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="ai-hero-sub">
              A brief, a few reference images and your room dimensions — turned into mood boards, material palettes
              and layout options, refined by our studio before anything reaches site.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="ai-hero-actions"
            >
              <a href="/#contact" className="btn-solid">Join the Waitlist</a>
              <a href="/#work" className="btn-ghost">See Studio Work</a>
            </motion.div>
          </div>

          <AIHeroStatCard />
          <AIHeroCorner />
        </div>
      </section>
    </div>
  );
}
