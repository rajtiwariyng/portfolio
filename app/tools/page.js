import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Tools from "@/components/Tools";
import { site } from "@/lib/site";

export const metadata = { title: `Free browser tools | ${site.fullName}` };

export default function ToolsPage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <header className="page-head">
          <p className="eyebrow">Tool Shop</p>
          <h1>Free tools that run in your browser</h1>
          <p>Nothing is uploaded. Your text stays on your device.</p>
        </header>
        <Tools />
      </main>
      <Footer />
    </>
  );
}
