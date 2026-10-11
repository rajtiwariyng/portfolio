import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { pageMeta } from "@/lib/seo";
import { Snake, Memory } from "@/components/Games";

export const metadata = pageMeta({
  title: "Game Room",
  description: "Small, fast browser games: Snake and Memory Match. No sign-up, no ads.",
  path: "/games",
});

export default function Games() {
  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <header className="page-head">
          <p className="eyebrow">Game Room</p>
          <h1>Take a break</h1>
          <p>Small, fast games. No sign-up, no ads.</p>
        </header>
        <div className="games">
          <Snake />
          <Memory />
        </div>
      </main>
      <Footer />
    </>
  );
}
