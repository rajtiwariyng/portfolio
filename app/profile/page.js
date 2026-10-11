import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { pageMeta } from "@/lib/seo";
import Icon from "@/components/Icon";
import LocalTime from "@/components/LocalTime";
import ContactForm from "@/components/ContactForm";
import { experience, services, site, techStack, work, workflow } from "@/lib/site";

export const metadata = pageMeta({
  title: `Full Profile | ${site.role}`,
  description: `Experience, services, tech stack and 16 live platforms built by ${site.fullName}. Contact: ${site.email} · ${site.phoneDisplay}.`,
  path: "/profile",
});

const Tags = ({ items }) => (
  <div className="tags">
    {items.map((t) => (
      <span key={t} className="tag">
        {t}
      </span>
    ))}
  </div>
);

export default function Profile() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="pf-hero" id="hero">
          <div className="wrap-wide">
            <div className="pf-hero-grid">
              <div>
                <p className="pf-hi">Hi, I&apos;m</p>
                <h1 className="pf-name">{site.fullName}</h1>
                <div className="pf-badges">
                  {site.badges.map((b) => (
                    <span key={b} className="chip" style={{ fontWeight: 600 }}>
                      {b}
                    </span>
                  ))}
                </div>
                <blockquote className="pf-quote">{site.tagline}</blockquote>
                <div className="pf-meta">
                  <span className="chip">
                    <Icon name="pin" size={15} /> {site.location}
                  </span>
                  <span className="chip">
                    <span className="dot" /> {site.status}
                  </span>
                  <LocalTime />
                </div>
                <div className="pf-cta">
                  <a href={site.cv} className="btn btn-dark" target="_blank" rel="noreferrer">
                    <Icon name="download" /> Download CV
                  </a>
                  <a href="#contact" className="btn btn-outline">
                    <Icon name="mail" /> Hire me
                  </a>
                </div>
                <p className="pf-reach">
                  <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={`tel:+${site.phone}`}>{site.phoneDisplay}</a>
                </p>
              </div>
              <div className="pf-photo">
                {site.photo ? (
                  <img src={site.photo} alt={`Portrait of ${site.fullName}`} />
                ) : (
                  <span className="pf-initial" aria-hidden="true">
                    {site.name[0]}
                  </span>
                )}
              </div>
            </div>
            <div className="pf-stats">
              {site.stats.map((s) => (
                <div key={s.label} className="pf-stat">
                  <Icon name={s.icon} />
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="wrap-wide">
          <section className="sec" id="case-studies">
            <p className="eyebrow">Work Studio</p>
            <h2 className="sec-h">Platforms I&apos;ve helped build and keep running</h2>
            <p className="sec-sub">
              E-commerce storefronts, corporate platforms and enterprise systems delivered across a decade of client work. Each one is live. Follow
              any card to the running site.
            </p>
            <div className="work-grid">
              {work.map((w) => (
                <a key={w.name} href={w.url} className="work-card" target="_blank" rel="noreferrer">
                  <img src={w.img} alt={`${w.name} website`} loading="lazy" width="640" height="400" />
                  <div className="work-body">
                    <span className="meta">{w.type}</span>
                    <h3>{w.name}</h3>
                    {w.desc && <p>{w.desc}</p>}
                    <span className="more">Visit site ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="sec" id="services">
            <h2 className="sec-h">Six things I get asked to build</h2>
            <p className="sec-sub">Hire me for a project, a retainer, or a full-time role.</p>
            <div className="cards">
              {services.map((s, i) => (
                <div key={s.title} className="card">
                  <p className="meta">0{i + 1}</p>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <Tags items={s.tags} />
                </div>
              ))}
            </div>
          </section>

          <section className="sec" id="experience">
            <h2 className="sec-h">Ten years, five teams, one discipline</h2>
            <p className="sec-sub">Where I&apos;ve worked and what I delivered.</p>
            <div className="timeline">
              {experience.map((e) => (
                <div key={e.role + e.period} className="tl-item">
                  <h3>{e.role}</h3>
                  <p className="meta">
                    {e.company} · {e.period}
                  </p>
                  {e.points.length > 0 && (
                    <ul>
                      {e.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="sec" id="techstack">
            <h2 className="sec-h">Tech stack</h2>
            <p className="sec-sub">The tools, grouped by the layer they serve.</p>
            <div className="stack">
              {Object.entries(techStack).map(([group, items]) => (
                <div key={group} className="card">
                  <h3>{group}</h3>
                  <Tags items={items} />
                </div>
              ))}
            </div>
          </section>

          <section className="sec" id="process">
            <h2 className="sec-h">Understand first. Ship what holds up.</h2>
            <p className="sec-sub">How every project runs, from the first call to after launch.</p>
            <div className="cards">
              {workflow.map((p, i) => (
                <div key={p.title} className="card">
                  <p className="meta">0{i + 1}</p>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="sec" id="about">
            <h2 className="sec-h">Clean code, clear architecture, practical solutions</h2>
            <div className="about">
              {site.about.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
          </section>

          <section className="sec" id="contact">
            <div className="contact-box">
              <div>
                <h2 className="sec-h">Have a complex system to build?</h2>
                <p className="sec-sub" style={{ marginBottom: 0 }}>
                  Whether it&apos;s a platform that needs re-architecting, an integration nobody wants to touch, or a process that should have been
                  automated years ago, send the details.
                </p>
                <div className="contact-links">
                  <a href={`mailto:${site.email}`}>✉ {site.email}</a>
                  <a href={`tel:+${site.phone}`}>☎ {site.phoneDisplay}</a>
                  <a href={`https://wa.me/${site.phone}`} target="_blank" rel="noreferrer">
                    💬 WhatsApp {site.phoneDisplay}
                  </a>
                  <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
                    in LinkedIn
                  </a>
                  <a href={site.socials.github} target="_blank" rel="noreferrer">
                    ⌥ GitHub
                  </a>
                  <a href={site.cv} target="_blank" rel="noreferrer">
                    ⬇ Résumé (PDF)
                  </a>
                </div>
              </div>
              <ContactForm />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
