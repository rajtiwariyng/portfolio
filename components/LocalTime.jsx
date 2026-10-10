"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export default function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: site.timezone }));
    fmt();
    const id = setInterval(fmt, 30000);
    return () => clearInterval(id);
  }, []);
  if (!time) return null;
  return (
    <span className="chip">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      It&apos;s {time} for {site.name} in {site.location} ({site.tzLabel})
    </span>
  );
}
