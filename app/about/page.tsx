import type { Metadata } from "next";
import { CustomCursor, SiteInteractions } from "@/components/site-interactions";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AboutHero } from "@/components/about-hero";
import { AboutContent } from "@/components/about-content";

export const metadata: Metadata = {
  title: "About Calyco Interiors | Interior Design & Execution Company",
  description: "Calyco Interiors is an independent interior solutions company created to make home and office interiors more organized, transparent, and execution-focused."
};

export default function AboutPage() {
  return (
    <>
      <CustomCursor />
      <SiteInteractions />
      <SiteHeader />
      <AboutHero />
      <AboutContent />
      <SiteFooter />
    </>
  );
}
