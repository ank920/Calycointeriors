"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  QUIZ_QUESTIONS,
  addScores,
  emptyScores,
  scoreToResult,
  type StyleId
} from "@/lib/style-quiz-data";
import { StyleQuizEmailGate } from "@/components/style-quiz-modal";

const SESSION_KEY = "calyco-style-quiz-session";

function track(event: string, detail?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event, ...detail });
}

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

type Phase = "intro" | "quiz" | "email" | "result";

type StoredAnswer = {
  questionId: string;
  optionId: string | "neither";
  timestamp: string;
};

export function StyleQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(emptyScores());
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const startedRef = useRef(false);

  const question = QUIZ_QUESTIONS[step];
  const total = QUIZ_QUESTIONS.length;

  useEffect(() => {
    if (phase === "quiz") track("style_quiz_question_viewed", { question: question.id, number: question.number });
  }, [phase, question]);

  const startQuiz = () => {
    if (!startedRef.current) {
      track("style_quiz_started");
      startedRef.current = true;
    }
    setPhase("quiz");
  };

  const recordAnswer = (optionId: string | "neither", optionScores?: Partial<Record<StyleId, number>>) => {
    const entry: StoredAnswer = { questionId: question.id, optionId, timestamp: new Date().toISOString() };
    const nextAnswers = [...answers, entry];
    setAnswers(nextAnswers);

    const nextScores = optionScores ? addScores(scores, optionScores) : scores;
    setScores(nextScores);

    if (optionId === "neither") {
      track("style_quiz_neither_selected", { question: question.id });
    } else {
      track("style_quiz_option_selected", { question: question.id, option: optionId });
    }

    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      const result = scoreToResult(nextScores);
      track("style_quiz_completed", { main: result.main.id, sub: result.sub?.id ?? null });
      setPhase("email");
    }
  };

  const result = useMemo(() => scoreToResult(scores), [scores]);

  const handleQuizSubmit = () => {
    track("style_result_viewed", { main: result.main.id, sub: result.sub?.id ?? null });
    setPhase("result");
  };

  if (phase === "intro") return <IntroScreen onStart={startQuiz} />;

  if (phase === "email")
    return (
      <StyleQuizEmailGate
        quizData={{
          sessionId: getSessionId(),
          answers,
          scores,
          mainStyle: result.main.id,
          subStyle: result.sub?.id ?? null
        }}
        onSubmit={handleQuizSubmit}
      />
    );

  if (phase === "result") return <ResultScreen main={result.main} sub={result.sub} />;

  return (
    <QuestionScreen
      key={question.id}
      number={question.number}
      total={total}
      title={question.title}
      optionA={question.optionA}
      optionB={question.optionB}
      onSelect={recordAnswer}
    />
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="sq-intro">
      <p className="sq-eyebrow">Calyco Style Quiz</p>
      <h1 className="sq-intro-title">Find Your Calyco Interior Style</h1>
      <p className="sq-intro-sub">
        Seven quick visual choices. No prices, no specs &mdash; just your taste, distilled into a style you can hand
        straight to your designer.
      </p>
      <button type="button" className="sq-btn-primary" onClick={onStart}>
        Start Style Quiz
      </button>
    </div>
  );
}

function QuestionScreen({
  number,
  total,
  title,
  optionA,
  optionB,
  onSelect
}: {
  number: number;
  total: number;
  title: string;
  optionA: { id: string; image: string; scores: Partial<Record<StyleId, number>> };
  optionB: { id: string; image: string; scores: Partial<Record<StyleId, number>> };
  onSelect: (optionId: string | "neither", scores?: Partial<Record<StyleId, number>>) => void;
}) {
  return (
    <div className="sq-question">
      <p className="sq-step-label">
        Question {number} of {total}
      </p>
      <h2 className="sq-question-title">{title}</h2>
      <p className="sq-question-sub">Click the style you prefer</p>

      <div className="sq-options">
        <button type="button" className="sq-option" onClick={() => onSelect(optionA.id, optionA.scores)}>
          <img src={optionA.image} alt="" />
        </button>
        <span className="sq-or">OR</span>
        <button type="button" className="sq-option" onClick={() => onSelect(optionB.id, optionB.scores)}>
          <img src={optionB.image} alt="" />
        </button>
      </div>

      <button type="button" className="sq-neither" onClick={() => onSelect("neither")}>
        Neither of these
      </button>

      <div className="sq-dots">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={"sq-dot" + (i < number ? " filled" : "") + (i === number - 1 ? " active" : "")} />
        ))}
      </div>
    </div>
  );
}

function ResultScreen({
  main,
  sub
}: {
  main: ReturnType<typeof scoreToResult>["main"];
  sub: ReturnType<typeof scoreToResult>["sub"];
}) {
  const shareText = `My Calyco Interior Style is ${main.name}${sub ? ` with a touch of ${sub.name}` : ""}. Find yours: https://calycointeriors.com/style-quiz`;

  const handleShare = async () => {
    track("style_shared_whatsapp", { main: main.id, sub: sub?.id ?? null });
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch {
        // user cancelled or share failed — fall through to WhatsApp link
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleDesignerClick = () => track("style_designer_cta_clicked", { main: main.id, sub: sub?.id ?? null });

  return (
    <div className="sq-result">
      <p className="sq-eyebrow">Your Calyco Style Is</p>
      <h1 className="sq-result-title">{main.name}</h1>
      {sub && <p className="sq-result-sub">Your sub-style is: {sub.name}</p>}
      <p className="sq-result-lede">{main.explanation}</p>

      <div className="sq-gallery">
        {main.images.map((src) => (
          <div className="sq-gallery-cell" key={src}>
            <img src={src} alt="" />
          </div>
        ))}
      </div>

      <div className="sq-result-grid">
        <div className="sq-result-block">
          <h3>Style Snapshot</h3>
          <ul className="sq-snapshot">
            {main.snapshot.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="sq-result-block">
          <h3>Colour Palette</h3>
          <div className="sq-palette">
            {main.palette.map((swatch) => (
              <div className="sq-swatch" key={swatch.name}>
                <span className="sq-swatch-dot" style={{ background: swatch.hex }} />
                <span>{swatch.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sq-result-block">
          <h3>Best Suited Spaces</h3>
          <div className="sq-spaces">
            {main.bestFor.map((space) => (
              <span className="sq-space-tag" key={space}>
                {space}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="sq-cta">
        <a href="/#contact" className="sq-btn-primary" onClick={handleDesignerClick}>
          Talk to a Calyco Designer
        </a>
        <button type="button" className="sq-btn-secondary" onClick={handleShare}>
          Share My Style on WhatsApp
        </button>
      </div>
    </div>
  );
}
