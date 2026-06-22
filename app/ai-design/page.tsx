import type { Metadata } from "next";
import { CustomCursor, SiteInteractions } from "@/components/site-interactions";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "AI Design — Calyco Interiors",
  description: "Calyco's AI Design tool turns a brief into mood boards, material palettes and layout options — refined by our studio."
};

const FEATURES = [
  {
    num: "01",
    title: "Instant Mood Boards",
    desc: "Upload a few reference images and your brief — get back a curated palette and material direction in minutes, not weeks."
  },
  {
    num: "02",
    title: "Material Matching",
    desc: "Our model cross-references your brief against the same vendor library our studio uses, so every suggestion is sourceable."
  },
  {
    num: "03",
    title: "Layout Drafts",
    desc: "Feed in your room dimensions and get spatial layout options to react to, before a single hour of drafting begins."
  }
];

export default function AIDesignPage() {
  return (
    <>
      <CustomCursor />
      <SiteInteractions />
      <SiteHeader />

      {/* ═══ HERO ═══ */}
      <section
        style={{
          background: "#16140F",
          color: "#F4F0E8",
          minHeight: "78vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(74px,9vw,124px) clamp(20px,4.5vw,70px) clamp(50px,6.5vw,88px)"
        }}
      >
        <span
          data-reveal="up"
          style={{
            display: "inline-block",
            marginBottom: "clamp(16px,2vw,26px)",
            fontSize: "11px",
            letterSpacing: ".34em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "rgba(244,240,232,.7)"
          }}
        >
          AI Design — In Development
        </span>
        <h1
          data-reveal="up"
          data-delay="80"
          style={{
            margin: "0 0 clamp(20px,2.6vw,32px)",
            fontFamily: "'Inter',sans-serif",
            fontWeight: 800,
            letterSpacing: "-.035em",
            lineHeight: 0.96,
            fontSize: "clamp(40px,7vw,108px)",
            maxWidth: "18ch"
          }}
        >
          Design intelligence, <em style={{ fontStyle: "italic", color: "#D4956A" }}>tuned</em> to your space.
        </h1>
        <p
          data-reveal="up"
          data-delay="160"
          style={{ margin: "0 0 clamp(28px,3.5vw,40px)", maxWidth: "54ch", fontSize: "clamp(15px,1.2vw,18px)", lineHeight: 1.7, color: "rgba(244,240,232,.8)" }}
        >
          Calyco&apos;s AI Design tool turns a brief, a few reference images and your room dimensions into mood
          boards, material palettes and layout options — refined by our studio before anything reaches site.
        </p>
        <div data-reveal="up" data-delay="240" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <a href="/#contact" className="btn-solid">Join the Waitlist</a>
          <a href="/#work" className="btn-ghost">See Studio Work</a>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section style={{ maxWidth: "1680px", margin: "0 auto", padding: "clamp(50px,7vw,100px) clamp(20px,4.5vw,70px)" }}>
        <div data-reveal="up" style={{ marginBottom: "clamp(34px,4.5vw,64px)" }}>
          <span style={{ fontSize: "11px", letterSpacing: ".24em", textTransform: "uppercase", color: "#8C8576", fontWeight: 500 }}>
            (How it helps)
          </span>
          <h2
            style={{
              margin: "14px 0 0",
              fontFamily: "'Inter',sans-serif",
              fontWeight: 800,
              letterSpacing: "-.03em",
              lineHeight: 0.95,
              fontSize: "clamp(32px,5vw,72px)"
            }}
          >
            Three ways AI speeds up the studio process
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", border: "1px solid rgba(22,20,15,.14)" }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.num}
              data-reveal="up"
              data-delay={i * 80}
              style={{
                padding: "clamp(28px,3.5vw,52px)",
                borderRight: i < FEATURES.length - 1 ? "1px solid rgba(22,20,15,.14)" : "none"
              }}
            >
              <div
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(32px,3.6vw,56px)",
                  lineHeight: 1,
                  color: "rgba(22,20,15,.18)",
                  marginBottom: "20px"
                }}
              >
                {f.num}
              </div>
              <h3 style={{ margin: "0 0 12px", fontFamily: "'Inter',sans-serif", fontSize: "clamp(17px,1.7vw,23px)", fontWeight: 700, letterSpacing: "-.01em" }}>
                {f.title}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.68, color: "#5A554B" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ background: "#ECEADE", padding: "clamp(46px,6vw,88px) clamp(20px,4.5vw,70px)" }}>
        <div
          style={{
            maxWidth: "1520px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "28px",
            borderTop: "1px solid rgba(22,20,15,.15)",
            paddingTop: "clamp(36px,4.5vw,56px)"
          }}
        >
          <h2
            data-reveal="up"
            style={{
              margin: 0,
              fontFamily: "'Inter',sans-serif",
              fontWeight: 800,
              letterSpacing: "-.03em",
              lineHeight: 0.95,
              fontSize: "clamp(26px,4vw,52px)",
              maxWidth: "20ch"
            }}
          >
            Want early access to AI Design?
          </h2>
          <a href="mailto:info@calyco.interiors" data-reveal="up" className="btn-solid">
            info@calyco.interiors <span style={{ fontSize: ".8em" }}>↗</span>
          </a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
