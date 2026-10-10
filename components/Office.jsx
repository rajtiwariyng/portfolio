"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { rooms, site } from "@/lib/site";

const OfficeScene = dynamic(() => import("./OfficeScene"), { ssr: false });

const roomById = Object.fromEntries(rooms.map((r) => [r.id, r]));

export default function Office() {
  const router = useRouter();
  const api = useRef(null);
  const [deskOpen, setDeskOpen] = useState(true);
  const [zone, setZone] = useState(null);
  const [heading, setHeading] = useState(null);

  const go = (id) => {
    setDeskOpen(false);
    if (api.current) api.current.walkToRoom(id);
    else router.push(roomById[id].href);
  };

  const onDepart = useCallback((id) => {
    setHeading(id);
    setDeskOpen(false);
  }, []);
  const onCancel = useCallback(() => setHeading(null), []);
  const onArrive = useCallback(
    (id) => {
      setHeading(null);
      router.push(roomById[id].href);
    },
    [router]
  );

  const shown = heading ? null : zone && roomById[zone];

  return (
    <section className="of-hero" id="office" aria-label={`${site.brand.first}'s 3D office`}>
      <OfficeScene apiRef={api} onZoneChange={setZone} onArrive={onArrive} onDepart={onDepart} onCancel={onCancel} />

      <header className="of-top">
        <Link href="/" className="of-brand">
          {site.brand.first}
          <span>{site.brand.second}</span>
        </Link>
        <nav className="of-nav" aria-label="Main">
          <Link href="/profile#case-studies">Work</Link>
          <Link href="/tools">Tools</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/games">Games</Link>
          <Link href="/profile" className="cta">
            Full profile →
          </Link>
        </nav>
      </header>

      <div className={`of-desk${deskOpen ? "" : " hidden"}`} role="dialog" aria-label="Receptionist">
        <p className="eyebrow">Receptionist</p>
        <h2>How can I help you?</h2>
        <p>Welcome in! Make yourself at home.</p>
        <div className="grid">
          {rooms
            .filter((r) => r.id !== "cabin")
            .map((r) => (
              <button key={r.id} className="of-room-btn" onClick={() => go(r.id)}>
                {r.name} <span className="arr">↗</span>
              </button>
            ))}
          <button className="of-room-btn of-knock" onClick={() => go("cabin")}>
            Meet {site.brand.first} · knock first <span>↗</span>
          </button>
        </div>
        <button className="of-explore" onClick={() => setDeskOpen(false)}>
          Just exploring
        </button>
      </div>

      {heading && (
        <div className="of-toast" role="status">
          Walking to the {roomById[heading].name}…
          <Link className="btn btn-primary" href={roomById[heading].href}>
            Skip →
          </Link>
        </div>
      )}
      {shown && (
        <div className="of-toast" role="status">
          You&apos;re in the {shown.name}
          <Link className="btn btn-primary" href={shown.href}>
            Enter →
          </Link>
        </div>
      )}

      {!deskOpen && (
        <button className="of-reopen" onClick={() => setDeskOpen(true)}>
          Ask reception
        </button>
      )}
      <p className="of-hint">Click the floor or use WASD to walk · click a room sign to go there</p>
      <a href="#details" className="of-details">
        Details ↓
      </a>
    </section>
  );
}
