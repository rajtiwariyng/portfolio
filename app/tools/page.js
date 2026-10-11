import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { pageMeta } from "@/lib/seo";
import Tools from "@/components/Tools";

export const metadata = pageMeta({
  title: "Free browser tools",
  description: "Free JSON formatter, Base64 encoder, word counter and case converter. Everything runs in your browser; nothing is uploaded.",
  path: "/tools",
});

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
