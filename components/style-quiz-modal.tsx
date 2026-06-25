"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

const SEEN_KEY = "calyco-style-quiz-seen";
const LEADS_KEY = "calyco-style-quiz-leads";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.15-3.1-.42-4.6H24v8.7h11.85c-.5 2.8-2.07 5.2-4.42 6.8v5.6h6.4c3.75-3.45 5.27-8.55 5.27-16.5z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.85-1.95 14.5-5.3l-6.4-5.6c-1.95 1.3-4.5 2.1-8.1 2.1-6.2 0-11.45-4.2-13.3-9.9H4.05v6.05C7.75 41.05 15.25 46 24 46z" />
      <path fill="#FBBC05" d="M10.7 27.3c-.45-1.35-.7-2.8-.7-4.3s.25-2.95.7-4.3v-6.05H4.05A21.9 21.9 0 0 0 2 23c0 3.55.85 6.9 2.05 9.85z" />
      <path fill="#EA4335" d="M24 10.4c3.2 0 5.95 1.1 8.2 3.2l5.7-5.7C34.85 4.4 29.9 2 24 2 15.25 2 7.75 6.95 4.05 14.65l6.65 5.05C12.55 14.6 17.8 10.4 24 10.4z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-7H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.88h-2.34v7C18.34 21.13 22 16.99 22 12z" />
    </svg>
  );
}

export function StyleQuizModal() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(SEEN_KEY)) return;
    const timer = setTimeout(() => {
      setOpen(true);
      window.localStorage.setItem(SEEN_KEY, "1");
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const leads = JSON.parse(window.localStorage.getItem(LEADS_KEY) || "[]");
    leads.push({ email, date: new Date().toISOString() });
    window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    close();
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="style-quiz-overlay">
      <div className="style-quiz-card">
        <button type="button" className="style-quiz-close" aria-label="Close" onClick={close}>
          ×
        </button>
        <h2 className="style-quiz-heading">Enter Your Email To Get Your Style!</h2>
        <p className="style-quiz-sub">
          You&apos;ll receive our complimentary detailed style descriptions and top AI recommended furniture picks!
        </p>
        <form onSubmit={handleSubmit}>
          <label className="style-quiz-label" htmlFor="style-quiz-email">
            Enter your email below to save and continue.
          </label>
          <input
            id="style-quiz-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Enter your email to continue"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="style-quiz-input"
          />
          <button type="submit" className="style-quiz-submit">
            Save &amp; Continue
          </button>
        </form>
        <div className="style-quiz-divider">
          <span />
          <p>Or</p>
          <span />
        </div>
        <button type="button" className="style-quiz-social">
          <GoogleIcon /> Continue With Google
        </button>
        <button type="button" className="style-quiz-social">
          <FacebookIcon /> Continue With Facebook
        </button>
        <p className="style-quiz-privacy">We will never share or use your email inappropriately</p>
        <p className="style-quiz-terms">
          By signing up, you agree to our <a href="#">Terms and Conditions</a>
        </p>
      </div>
    </div>,
    document.body
  );
}

export type QuizSubmissionPayload = {
  sessionId: string;
  answers: unknown[];
  scores: unknown;
  mainStyle: string;
  subStyle: string | null;
};

// Final step of the 7-question style quiz — not skippable, because the quiz
// answers themselves are only persisted once this form is submitted: email
// and the full quiz payload go out together as one record.
export function StyleQuizEmailGate({
  quizData,
  onSubmit
}: {
  quizData: QuizSubmissionPayload;
  onSubmit: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.documentElement.classList.add("lenis-stopped");
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const leads = JSON.parse(window.localStorage.getItem(LEADS_KEY) || "[]");
    leads.push({ ...quizData, email, submittedAt: new Date().toISOString() });
    window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    onSubmit();
  };

  if (!mounted) return null;

  return createPortal(
    <div className="style-quiz-overlay">
      <div className="style-quiz-card">
        <h2 className="style-quiz-heading">Enter Your Email To Get Your Style!</h2>
        <p className="style-quiz-sub">
          You&apos;ve answered all 7 questions &mdash; enter your email to submit the quiz and reveal your Calyco
          style.
        </p>
        <form onSubmit={handleSubmit}>
          <label className="style-quiz-label" htmlFor="style-quiz-gate-email">
            Enter your email below to save and continue.
          </label>
          <input
            id="style-quiz-gate-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Enter your email to continue"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="style-quiz-input"
          />
          <button type="submit" className="style-quiz-submit">
            Save &amp; Continue
          </button>
        </form>
        <p className="style-quiz-privacy">We will never share or use your email inappropriately</p>
        <p className="style-quiz-terms">
          By signing up, you agree to our <a href="#">Terms and Conditions</a>
        </p>
      </div>
    </div>,
    document.body
  );
}
