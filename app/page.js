import Link from "next/link";
import Office from "@/components/Office";
import Footer from "@/components/Footer";
import { rooms, site } from "@/lib/site";

export default function Home() {
  const wa = `https://wa.me/${site.phone}?text=${encodeURIComponent(`Hi ${site.name}, I visited your office on your website`)}`;
  return (
    <div className="office-page">
      <a href="#details" className="skip">
        Skip to content
      </a>
      <Office />

      <main id="details">
        <section className="of-intro wrap">
          <p className="eyebrow">Welcome to my office</p>
          <h1>
            {site.fullName}: {site.role}
          </h1>
          <p className="lead">{site.intro}</p>
          <div className="of-stats">
            {site.stats.slice(0, 4).map((s) => (
              <span key={s.label} className="of-stat">
                <b>{s.value}</b>
                {s.label}
              </span>
            ))}
          </div>
          <div className="of-actions">
            <Link href="/profile" className="btn btn-primary">
              View full profile
            </Link>
            <a href={`mailto:${site.email}`} className="btn">
              Email me
            </a>
            <a href={wa} className="btn" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={site.cv} className="btn" target="_blank" rel="noreferrer">
              Résumé
            </a>
          </div>
        </section>

        <section className="of-rooms wrap">
          <h2>Pick a room</h2>
          <div className="room-grid">
            {rooms.map((r) => (
              <Link key={r.id} href={r.href} className="room-card">
                <h3>{r.name}</h3>
                <p>{r.desc}</p>
                <span className="go">{r.cta} →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
