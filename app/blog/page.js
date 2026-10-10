import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { posts, site } from "@/lib/site";

export const metadata = { title: `Blog | ${site.fullName}` };

export default function Blog() {
  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <header className="page-head">
          <p className="eyebrow">Newsroom</p>
          <h1>Notes from the workbench</h1>
          <p>Practical write-ups on Laravel, PHP, APIs, automation and AWS.</p>
        </header>
        <div className="post-list">
          {posts.map((p) => (
            <a key={p.title} className="post" href="#">
              <div>
                <span className="meta">
                  {p.tag} · {new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <h2>{p.title}</h2>
              </div>
              <span className="meta">{p.read} read →</span>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
