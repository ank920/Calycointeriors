"use client";

const PROJECTS = [
  { img: "/assets/home%20page/Living%20Room.webp", title: "Living Room", city: "Mumbai Apartment" },
  { img: "/assets/home%20page/Kitchen.webp", title: "Kitchen", city: "Bengaluru Villa" },
  { img: "/assets/home%20page/Bedroom.webp", title: "Bedroom", city: "Delhi Penthouse" },
  { img: "/assets/home%20page/Wardrobe.webp", title: "Wardrobe", city: "Pune Residence" }
];

function GalleryCard({ p, hidden }: { p: (typeof PROJECTS)[number]; hidden?: boolean }) {
  return (
    <div className="gallery-card" aria-hidden={hidden}>
      <img src={p.img} alt={hidden ? "" : `${p.title} — ${p.city}`} />
      <div className="gallery-card-overlay" />
      <div className="gallery-card-caption">
        <p className="gallery-card-city">{p.city}</p>
        <h3 className="gallery-card-title">{p.title}</h3>
      </div>
    </div>
  );
}

export function ProjectGallery() {
  return (
    <div className="gallery-track-wrap">
      <div className="gallery-track">
        {PROJECTS.map((p) => (
          <GalleryCard key={p.title} p={p} />
        ))}
        {PROJECTS.map((p) => (
          <GalleryCard key={`${p.title}-dup`} p={p} hidden />
        ))}
      </div>
    </div>
  );
}
