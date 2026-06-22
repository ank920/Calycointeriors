"use client";

import { useEffect, useRef, useState } from "react";

const CITIES = ["Delhi", "Mumbai", "Pune", "Bengaluru"];

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
    </svg>
  );
}

export function SiteHeader() {
  const [citiesOpen, setCitiesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCitiesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header id="header">
      <a href="/" className="logo-link">
        <img id="logo" src="/assets/logo/calyco-logo.png" alt="Calyco Interiors" />
      </a>
      <nav>
        <a href="/design">Design</a>
        <div ref={dropdownRef} className={"nav-dropdown" + (citiesOpen ? " open" : "")}>
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
    </header>
  );
}
