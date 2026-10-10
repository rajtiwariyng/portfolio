import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="wrap foot">
      © {new Date().getFullYear()} {site.fullName} · <Link href="/profile">Full profile</Link> · <Link href="/tools">Free tools</Link> ·{" "}
      <Link href="/blog">Blog</Link> · <Link href="/games">Games</Link> · <a href={`mailto:${site.email}`}>{site.email}</a>
    </footer>
  );
}
