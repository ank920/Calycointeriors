"use client";

import { useState } from "react";

type RoomItem = {
  id: string;
  name: string;
  image: string;
  bottom: string;
  width: string;
};

type RoomCategory = {
  key: string;
  label: string;
  items: RoomItem[];
};

const BEDROOM = {
  base: "/view/bedroom/base.png",
  categories: [
    {
      key: "bed",
      label: "Bed",
      items: [
        { id: "bed-1", name: "Tufted Cream", image: "/view/bedroom/bed-1.png", bottom: "11%", width: "44%" },
        { id: "bed-2", name: "Arched Tufted", image: "/view/bedroom/bed-2.png", bottom: "11%", width: "44%" }
      ]
    },
    { key: "table", label: "Side Table", items: [] },
    { key: "wardrobe", label: "Wardrobe", items: [] }
  ] as RoomCategory[]
};

export function RoomVisualizer() {
  const [activeKey, setActiveKey] = useState(BEDROOM.categories[0].key);
  const [selected, setSelected] = useState<Record<string, string>>({
    bed: BEDROOM.categories[0].items[0]?.id ?? ""
  });

  const active = BEDROOM.categories.find((c) => c.key === activeKey) ?? BEDROOM.categories[0];

  return (
    <div className="room-viz">
      <div className="room-viz-stage">
        <img src={BEDROOM.base} alt="Bedroom" className="room-viz-base" />
        {BEDROOM.categories.map((cat) => {
          const item = cat.items.find((i) => i.id === selected[cat.key]);
          if (!item) return null;
          return (
            <img
              key={cat.key}
              src={item.image}
              alt={item.name}
              className="room-viz-item"
              style={{ bottom: item.bottom, width: item.width }}
            />
          );
        })}
      </div>

      <div className="room-viz-panel">
        <p className="room-viz-eyebrow">Bedroom</p>
        <div className="room-viz-tabs">
          {BEDROOM.categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={"room-viz-tab" + (activeKey === cat.key ? " active" : "")}
              disabled={cat.items.length === 0}
              onClick={() => setActiveKey(cat.key)}
            >
              {cat.label}
              {cat.items.length === 0 && <span className="room-viz-soon">Soon</span>}
            </button>
          ))}
        </div>

        <div className="room-viz-options">
          {active.items.length === 0 && (
            <p className="room-viz-empty">More {active.label.toLowerCase()} options coming soon.</p>
          )}
          {active.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={"room-viz-option" + (selected[active.key] === item.id ? " selected" : "")}
              onClick={() => setSelected((s) => ({ ...s, [active.key]: item.id }))}
            >
              <img src={item.image} alt={item.name} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
