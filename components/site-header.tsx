"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CITIES = ["Delhi", "Mumbai", "Pune", "Bengaluru"];

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
    </svg>
  );
}

// Rendered via a portal straight onto <body> — #header has a backdrop-filter
// for its glass-pill look, and backdrop-filter (like transform/filter) makes
// an element a containing block for its position:fixed descendants. Nesting
// this drawer inside #header would clip "fixed; inset:0" to the pill's own
// small box instead of the viewport, so it has to live outside that subtree.
function MobileNavDrawer({
  open,
  citiesOpen,
  onToggleCities,
  onClose
}: {
  open: boolean;
  citiesOpen: boolean;
  onToggleCities: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="mobile-nav-overlay">
      <div className="mobile-nav-topbar">
        <a href="/" className="logo-link" onClick={onClose}>
          <img id="logo" src="/assets/logo/calyco-logo.png" alt="Calyco Interiors" />
        </a>
        <button type="button" className="mobile-nav-close" onClick={onClose}>
          Close
        </button>
      </div>
      <nav className="mobile-nav-list">
        <a href="/design" onClick={onClose}>Design</a>
        <div className={"mobile-nav-cities" + (citiesOpen ? " open" : "")}>
          <button type="button" className="mobile-nav-cities-trigger" aria-expanded={citiesOpen} onClick={onToggleCities}>
            Cities <span className="nav-caret">⌄</span>
          </button>
          <div className="mobile-nav-cities-panel">
            {CITIES.map((city) => (
              <a key={city} href="/#work" onClick={onClose}>
                {city}
              </a>
            ))}
          </div>
        </div>
        <a href="/about" onClick={onClose}>About Us</a>
        <a href="/#contact" onClick={onClose}>Contact Us</a>
        <a href="/ai-design" className="nav-ai" onClick={onClose}>
          AI Design <SparkleIcon />
        </a>
      </nav>
    </div>
  );
}

export function SiteHeader() {
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuOpen) return; // the mobile drawer manages its own Cities toggle via explicit taps
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCitiesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  // Reuses Lenis's own "stopped" class (already defined in globals.css) to
  // freeze background scroll while the full-screen mobile menu is open.
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", menuOpen);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 760) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const closeAll = () => {
    setMenuOpen(false);
    setCitiesOpen(false);
  };

  return (
    <header id="header">
      <a href="/" className="logo-link" onClick={closeAll}>
        <img id="logo" src="/assets/logo/calyco-logo.png" alt="Calyco Interiors" />
      </a>

      <button
        type="button"
        className={"nav-toggle" + (menuOpen ? " open" : "")}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav>
        <a href="/design">Design</a>
        <div ref={dropdownRef} className={"nav-dropdown" + (citiesOpen && !menuOpen ? " open" : "")}>
          <button
            type="button"
            className="nav-dropdown-trigger"
            aria-expanded={citiesOpen}
            onClick={() => setCitiesOpen((v) => !v)}
          >
            Cities <span className="nav-caret">⌄</span>
          </button>
          <div className="nav-dropdown-panel">
            {CITIES.map((city) => (
              <a key={city} href="/#work" onClick={() => setCitiesOpen(false)}>
                {city}
              </a>
            ))}
          </div>
        </div>
        <a href="/about">About Us</a>
        <a href="/#contact">Contact Us</a>
        <a href="/ai-design" className="nav-ai">
          AI Design <SparkleIcon />
        </a>
      </nav>

      {mounted &&
        createPortal(
          <MobileNavDrawer
            open={menuOpen}
            citiesOpen={citiesOpen}
            onToggleCities={() => setCitiesOpen((v) => !v)}
            onClose={closeAll}
          />,
          document.body
        )}
    </header>
  );
}
