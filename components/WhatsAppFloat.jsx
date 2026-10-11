"use client";

import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { WaIcon } from "@/components/ContactForm";

// Floating "chat on WhatsApp" button. Hidden on the home page, where the 3D office uses the bottom corners.
export default function WhatsAppFloat() {
  if (usePathname() === "/") return null;
  const text = encodeURIComponent(`Hi ${site.name}, I found you on your portfolio.`);
  return (
    <a href={`https://wa.me/${site.phone}?text=${text}`} className="wa-float" target="_blank" rel="noreferrer" aria-label={`Chat with ${site.name} on WhatsApp`}>
      <WaIcon size={26} />
    </a>
  );
}
