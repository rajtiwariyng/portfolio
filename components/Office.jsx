"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { rooms, site } from "@/lib/site";

const OfficeScene = dynamic(() => import("./OfficeScene"), { ssr: false });

const roomById = Object.fromEntries(rooms.map((r) => [r.id, r]));

// mode: intro (walking in) · reception (desk card) · visit (being escorted) · room (arrived) · explore (free roam)
export default function Office() {
  const router = useRouter();
  const api = useRef(null);
  const [mode, setMode] = useState("intro");
  const [room, setRoom] = useState(null);
  const [zone, setZone] = useState(null);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  const go = (id) => {
    if (api.current) api.current.walkToRoom(id);
    else router.push(roomById[id].href);
  };

  const onDepart = useCallback((id) => {
    setRoom(id);
    setMode("visit");
  }, []);
  const onArrive = useCallback((id) => {
    setRoom(id);
    setMode("room");
  }, []);
  const onIntroStart = useCallback(() => setMode("intro"), []);
  const onIntroDone = useCallback(() => setMode((m) => (m === "intro" ? "reception" : m)), []);
  const onCancel = useCallback(() => setMode((m) => (m === "reception" ? m : "explore")), []);

  const backToReception = () => {
    api.current?.backToReception();
    setMode("reception");
  };
  const explore = () => {
    api.current?.exploreOffice();
    setMode("explore");
  };

  const current = room && roomById[room];
  const zoneRoom = mode === "explore" && zone && roomById[zone];

  return (
    <section className="of-hero" id="office" aria-label={`${site.brand.first}'s 3D office`}>
      <OfficeScene
        apiRef={api}
        onZoneChange={setZone}
        onArrive={onArrive}
        onDepart={onDepart}
        onCancel={onCancel}
        onIntroStart={onIntroStart}
        onIntroDone={onIntroDone}
        onReady={onReady}
      />

      {!ready && (
        <div className="of-loading" role="status">
          <span className="of-spinner" aria-hidden="true" /> Opening the office…
        </div>
      )}

      <header className="of-top">
        <Link href="/" className="of-brand">
          {site.brand.first} <span>{site.brand.second}</span>
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

      <div className={`of-desk${mode === "reception" ? "" : " hidden"}`} role="dialog" aria-label="Receptionist">
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
        <button className="of-explore" onClick={explore}>
          Just exploring
        </button>
      </div>

      {mode === "intro" && ready && (
        <div className="of-visit" role="status">
          <p className="eyebrow">Welcome to the office</p>
          <h2>{site.brand.first}&apos;s Office</h2>
          <p>Walking to reception…</p>
        </div>
      )}

      {mode === "visit" && current && (
        <div className="of-visit" role="status">
          <p className="eyebrow">Your visit</p>
          <h2>{current.name}</h2>
          <p>Follow the receptionist…</p>
        </div>
      )}

      <div className={`of-desk${mode === "room" && current ? "" : " hidden"}`} role="dialog" aria-label="Room">
        {current && (
          <>
            <p className="eyebrow">Room</p>
            <h2>{current.name}</h2>
            <p className="of-room-desc">{current.desc}</p>
            <Link href={current.href} className="btn btn-primary of-room-cta">
              {current.cta} →
            </Link>
            <div className="of-room-links">
              <button onClick={backToReception}>← Reception</button>
              <button onClick={explore}>Explore the office</button>
            </div>
          </>
        )}
      </div>

      {zoneRoom && (
        <div className="of-toast" role="status">
          You&apos;re in the {zoneRoom.name}
          <Link className="btn btn-primary" href={zoneRoom.href}>
            Enter →
          </Link>
        </div>
      )}

      <div className="of-bottom">
        {mode === "intro" && (
          <button className="of-pill" onClick={() => api.current?.skipIntro()}>
            Skip visit ⏭
          </button>
        )}
        {mode === "visit" && current && (
          <Link href={current.href} className="of-pill">
            Skip visit ⏭
          </Link>
        )}
        {mode === "room" && (
          <button className="of-pill" onClick={backToReception}>
            Back to reception
          </button>
        )}
        {mode === "explore" && (
          <button className="of-pill" onClick={backToReception}>
            Ask reception
          </button>
        )}
        <a href="#details" className="of-pill">
          Details ↓
        </a>
      </div>
      {mode === "explore" && <p className="of-hint">Click the floor or use WASD to walk · click a room sign to go there</p>}
    </section>
  );
}
