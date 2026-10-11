import { site } from "@/lib/site";

const image = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.fullName}, ${site.role}` };

// Per-page metadata. Next replaces (not merges) the root openGraph/twitter objects, so rebuild them here.
export function pageMeta({ title, description, path }) {
  const full = `${title} | ${site.fullName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "en_IN", siteName: site.fullName, url: path, title: full, description, images: [image] },
    twitter: { card: "summary_large_image", title: full, description, images: [image] },
  };
}
