"use client";

import { useEffect, useState } from "react";

type RoomId = "bedroom" | "living" | "kitchen";

type Room = {
  id: RoomId;
  label: string;
  sub: string;
  images: { src: string; alt: string }[];
};

type FurnitureItem = {
  id: string;
  label: string;
  sub: string;
  stageImg: string;
  cardImg: string;
};

type FurnitureGroup = {
  id: string;
  label: string;
  items: FurnitureItem[];
};

const ROOMS: Room[] = [
  {
    id: "bedroom",
    label: "Bedroom",
    sub: "Rest, reimagined",
    images: [
      { src: "/assets/home%20page/Bedroom.webp", alt: "A warm, city-view bedroom suite designed by Calyco" },
      { src: "/assets/images/bedroom%20with%20city%20view.png", alt: "A luxury bedroom with emerald velvet accent wall" },
      { src: "/assets/home%20page/Wardrobe.webp", alt: "A bedroom suite walk-in wardrobe and dressing area" }
    ]
  },
  {
    id: "living",
    label: "Living Room",
    sub: "Where the day unwinds",
    images: [
      { src: "/assets/home%20page/Living%20Room.webp", alt: "A moody living room with a marble feature wall" },
      { src: "/assets/home%20page/extra.webp", alt: "A living room lounge with a dusk skyline view" },
      { src: "/before%20and%20after/s2,2.png", alt: "A bright, daylight living room with a fireplace" }
    ]
  },
  {
    id: "kitchen",
    label: "Kitchen",
    sub: "The heart of the home",
    images: [
      { src: "/assets/home%20page/Kitchen.webp", alt: "A minimalist kitchen with a marble waterfall island" },
      { src: "/assets/images/Modern%20kitchen.png", alt: "A sage-green galley kitchen with brass pendant lights" },
      { src: "/before%20and%20after/s3,2.png", alt: "An open-plan sage kitchen with a marble island" }
    ]
  }
];

const WARDROBE_ITEMS: FurnitureItem[] = Array.from({ length: 7 }, (_, i) => {
  const n = i + 1;
  return {
    id: `w${n}`,
    label: n === 1 ? "Modern Wardrobe" : `Style ${n} Wardrobe`,
    sub: n === 1 ? "New imported wardrobe asset" : "AI Generated Wardrobe Asset",
    stageImg: `/view/bedroom/wardrobe/w${n}.1.png`,
    cardImg: `/view/bedroom/wardrobe/w${n}.2.png`
  };
});

const BED_ITEMS: FurnitureItem[] = Array.from({ length: 4 }, (_, i) => {
  const n = i + 1;
  return {
    id: `b${n}`,
    label: n === 1 ? "Modern Bed" : `Style ${n} Bed`,
    sub: n === 1 ? "New imported bed asset" : "AI Generated Bed Asset",
    stageImg: `/view/bedroom/bed/b${n}.1.png`,
    cardImg: `/view/bedroom/bed/b${n}.2.png`
  };
});

const ROOM_GROUPS: Record<RoomId, FurnitureGroup[]> = {
  bedroom: [
    { id: "bed", label: "Bed", items: BED_ITEMS },
    { id: "sidetable", label: "Side Table", items: [] },
    { id: "wardrobe", label: "Wardrobe", items: WARDROBE_ITEMS }
  ],
  living: [
    { id: "sofa", label: "Sofa", items: [] },
    { id: "wall", label: "Wall", items: [] },
    { id: "coffeetable", label: "Coffee Table", items: [] },
    { id: "chair", label: "Chair", items: [] }
  ],
  kitchen: [
    { id: "kitchentype", label: "Kitchen Type", items: [] },
    { id: "diningtable", label: "Dining Table", items: [] }
  ]
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function RoomRow({ room, active, onSelect }: { room: Room; active: boolean; onSelect: (id: RoomId) => void }) {
  return (
    <button type="button" className={"ai-room-row" + (active ? " active" : "")} onClick={() => onSelect(room.id)}>
      <img src={room.images[0].src} alt={room.images[0].alt} className="ai-room-row-thumb" />
      <span className="ai-room-row-text">
        <span className="ai-room-row-label">{room.label}</span>
        <span className="ai-room-row-sub">{room.sub}</span>
      </span>
      <span className="ai-room-row-check">{active && <CheckIcon className="ai-room-icon-sm" />}</span>
    </button>
  );
}

function FurnitureCard({ item, active, onSelect }: { item: FurnitureItem; active: boolean; onSelect: (id: string) => void }) {
  return (
    <button type="button" className={"ai-fc-card" + (active ? " active" : "")} onClick={() => onSelect(item.id)}>
      <span className="ai-fc-card-imgwrap">
        <img src={item.cardImg} alt={item.label} className="ai-fc-card-img" />
      </span>
      <span className="ai-fc-card-label">{item.label}</span>
    </button>
  );
}

function firstStockedGroup(groups: FurnitureGroup[]): FurnitureGroup {
  return groups.find((g) => g.items.length > 0) ?? groups[0];
}

const ALL_IMAGE_URLS = [
  ...ROOMS.flatMap((r) => r.images.map((img) => img.src)),
  ...Object.values(ROOM_GROUPS).flatMap((groups) =>
    groups.flatMap((g) => g.items.flatMap((item) => [item.stageImg, item.cardImg]))
  )
];

export function AIDesignRoomPicker() {
  const [selected, setSelected] = useState<RoomId>(ROOMS[0].id);
  const [step, setStep] = useState<"select" | "customize">("select");

  const room = ROOMS.find((r) => r.id === selected) ?? ROOMS[0];
  const groups = ROOM_GROUPS[selected];

  const [activeGroupId, setActiveGroupId] = useState<string>(() => firstStockedGroup(groups).id);
  const [activeItemId, setActiveItemId] = useState<string | null>(() => firstStockedGroup(groups).items[0]?.id ?? null);

  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? groups[0];
  const activeItem = activeGroup.items.find((it) => it.id === activeItemId) ?? activeGroup.items[0] ?? null;

  const stageImg = step === "customize" && activeItem ? activeItem.stageImg : room.images[0].src;
  const stageAlt = step === "customize" && activeItem ? activeItem.label : room.images[0].alt;

  const handleContinue = () => {
    const initial = firstStockedGroup(groups);
    setActiveGroupId(initial.id);
    setActiveItemId(initial.items[0]?.id ?? null);
    setStep("customize");
  };

  const handleSelectGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    const g = groups.find((x) => x.id === groupId);
    setActiveItemId(g?.items[0]?.id ?? null);
  };

  useEffect(() => {
    ALL_IMAGE_URLS.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  return (
    <section className="ai-room-picker">
      <div className="ai-room-picker-stage">
        <h2 className="ai-room-picker-stage-heading">
          {step === "select" ? "Choose Your Space" : `Style Your ${room.label}`}
        </h2>
        <div className="ai-room-picker-stage-frame">
          <img src={stageImg} alt={stageAlt} className="ai-room-picker-stage-img" />
        </div>
      </div>

      <div className="ai-room-picker-panel">
        {step === "select" ? (
          <>
            <div className="ai-room-picker-panel-top">
              <div className="ai-room-picker-panel-head">
                <h3 className="ai-room-picker-panel-title">Select Space</h3>
                <p className="ai-room-picker-panel-sub">You can refine the details in the next step.</p>
              </div>

              <div className="ai-room-picker-panel-list">
                {ROOMS.map((r) => (
                  <RoomRow key={r.id} room={r} active={r.id === selected} onSelect={setSelected} />
                ))}
              </div>
            </div>

            <button type="button" className="ai-room-picker-cta" onClick={handleContinue}>
              Continue to Visualize <ArrowRightIcon className="ai-room-icon-sm" />
            </button>
          </>
        ) : (
          <div className="ai-fc">
            <button type="button" className="ai-fc-back" onClick={() => setStep("select")}>
              <ArrowLeftIcon className="ai-room-icon-sm" /> All Spaces
            </button>

            <div className="ai-fc-tabs">
              {groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={"ai-fc-tab" + (g.id === activeGroupId ? " active" : "")}
                  onClick={() => handleSelectGroup(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div className="ai-fc-grid">
              {activeGroup.items.length > 0 ? (
                activeGroup.items.map((item) => (
                  <FurnitureCard key={item.id} item={item} active={item.id === activeItemId} onSelect={setActiveItemId} />
                ))
              ) : (
                <p className="ai-fc-empty">More {activeGroup.label.toLowerCase()} designs are on the way.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
