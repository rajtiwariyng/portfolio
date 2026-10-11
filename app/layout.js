import { Fraunces, Inter, Space_Grotesk } from "next/font/google";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

const title = `${site.fullName} | ${site.role}`;

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.fullName}` },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "en_IN",
    url: "/",
    siteName: site.fullName,
    title,
    description: site.description,
    firstName: site.brand.first,
    lastName: site.brand.second,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#141714" },
  ],
};

// Structured data so search engines can show name, role, email and phone.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.fullName,
  jobTitle: site.role,
  description: site.description,
  url: site.url,
  image: `${site.url}${site.photo}`,
  email: `mailto:${site.email}`,
  telephone: `+${site.phone}`,
  address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
  sameAs: Object.values(site.socials),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "business enquiries",
    email: site.email,
    telephone: `+${site.phone}`,
    availableLanguage: ["English", "Hindi"],
  },
};

// Applies a saved theme before paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${grotesk.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
