"use client";

import { useState } from "react";

export function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div className="ba-frame">
      <img className="ba-before" src={before} alt={beforeAlt} />
      <img className="ba-after" src={after} alt={afterAlt} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <span className="ba-tag ba-tag-before">Before</span>
      <span className="ba-tag ba-tag-after">After</span>
      <div className="ba-handle" style={{ left: `${pos}%` }} />
      <input
        type="range"
        className="ba-range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Drag to compare before and after"
      />
    </div>
  );
}
