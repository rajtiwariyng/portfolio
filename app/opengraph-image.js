import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.fullName}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social preview card used by WhatsApp, LinkedIn, X, Slack etc. Inherited by every page.
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(160deg, #e4ede1, #bcd5b8)", color: "#2a2622", fontFamily: "serif" }}>
        <div style={{ display: "flex", fontSize: 28, color: "#336b4b", letterSpacing: 2 }}>PORTFOLIO · {site.location.toUpperCase()}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 1 }}>{site.fullName}</div>
          <div style={{ fontSize: 40, marginTop: 20, color: "#5d5750" }}>{site.role}</div>
          <div style={{ fontSize: 30, marginTop: 28, color: "#336b4b" }}>{site.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 28, color: "#2a2622" }}>
          <span>✉ {site.email}</span>
          <span>☎ {site.phoneDisplay}</span>
        </div>
      </div>
    ),
    size
  );
}
