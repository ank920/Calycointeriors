"use client";

import { useState } from "react";

type BASet = { room: string; project: string; before: string; after: string };

const SETS: BASet[] = [
  { room: "Living Room", project: "City-View Apartment", before: "/before%20and%20after/s1,1.png", after: "/before%20and%20after/s1,2.png" },
  { room: "Family Room", project: "Suburban Residence", before: "/before%20and%20after/s2,1.png", after: "/before%20and%20after/s2,2.png" },
  { room: "Kitchen", project: "Modern Villa", before: "/before%20and%20after/s3,1.png", after: "/before%20and%20after/s3,2.png" },
  { room: "Bathroom", project: "Spa-Inspired Retreat", before: "/before%20and%20after/s4,1.png", after: "/before%20and%20after/s4,2.png" }
];

export function BeforeAfterSlider() {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(50);
  const [dragged, setDragged] = useState(false);
  const current = SETS[active];

  return (
    <div className="ba-showcase">
      <div className="ba-tabs" role="tablist" aria-label="Choose a room to compare">
        {SETS.map((s, i) => (
          <button
            key={s.room}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={"ba-tab" + (i === active ? " active" : "")}
            onClick={() => {
              setActive(i);
              setPos(50);
            }}
          >
            {s.room}
          </button>
        ))}
      </div>

      <div className="ba-frame" key={active}>
        {/* "after" sits underneath, fully visible; "before" sits on top but is
            clipped to its left pos% — so the divider's left side (matching the
            "Before" tag's left position) always shows the before image, and the
            right side (matching "After") shows after. */}
        <img className="ba-after" src={current.after} alt={`${current.room} after the Calyco renovation`} />
        <img
          className="ba-before"
          src={current.before}
          alt={`${current.room} before the Calyco renovation`}
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <span className="ba-tag ba-tag-before">Before</span>
        <span className="ba-tag ba-tag-after">After</span>

        <div className="ba-caption-card">
          <p className="ba-caption-room">{current.room}</p>
          <p className="ba-caption-project">{current.project}</p>
        </div>

        <div className={"ba-handle" + (dragged ? "" : " ba-handle-hint")} style={{ left: `${pos}%` }}>
          <span className="ba-handle-grip">↔</span>
        </div>
        <input
          type="range"
          className="ba-range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => {
            setPos(Number(e.target.value));
            setDragged(true);
          }}
          onPointerDown={() => setDragged(true)}
          aria-label="Drag to compare before and after"
        />
      </div>
    </div>
  );
}
