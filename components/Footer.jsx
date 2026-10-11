import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="wrap foot">
      <div className="foot-reach">
        <a href={`mailto:${site.email}`}>✉ {site.email}</a>
        <a href={`tel:+${site.phone}`}>☎ {site.phoneDisplay}</a>
        <a href={`https://wa.me/${site.phone}`} target="_blank" rel="noreferrer">
          💬 WhatsApp
        </a>
        <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
      © {new Date().getFullYear()} {site.fullName} · <Link href="/profile">Full profile</Link> · <Link href="/tools">Free tools</Link> ·{" "}
      <Link href="/blog">Blog</Link> · <Link href="/games">Games</Link> · <Link href="/profile#contact">Contact</Link>
    </footer>
  );
}
