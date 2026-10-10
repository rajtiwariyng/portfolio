import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { Snake, Memory } from "@/components/Games";
import { site } from "@/lib/site";

export const metadata = { title: `Game Room | ${site.fullName}` };

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
