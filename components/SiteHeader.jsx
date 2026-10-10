"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const LINKS = [
  ["Home", "/"],
  ["Work", "/profile#case-studies"],
  ["Services", "/profile#services"],
  ["Experience", "/profile#experience"],
  ["Skills", "/profile#techstack"],
  ["About", "/profile#about"],
  ["Free Tools", "/tools"],
  ["Blog", "/blog"],
  ["Contact", "/profile#contact"],
];

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    setDark(t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setDark(!dark);
  };

  return (
    <header className="hdr">
      <div className="wrap-wide hdr-in">
        <Link href="/" className="logo">
          {site.brand.first} <span>{site.brand.second}</span>
        </Link>
        <nav className={`hdr-nav${open ? " open" : ""}`} aria-label="Main" onClick={() => setOpen(false)}>
          {LINKS.map(([label, href]) => (
            <Link key={href} href={href} className={href === path ? "on" : ""}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="hdr-right">
          <Link href="/profile#contact" className="hire">
            Hire me
          </Link>
          <button className="icon-btn" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
          <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
