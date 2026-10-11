import { site } from "@/lib/site";

export default function sitemap() {
  return [
    ["", 1],
    ["/profile", 0.9],
    ["/tools", 0.7],
    ["/blog", 0.6],
    ["/games", 0.4],
  ].map(([path, priority]) => ({ url: `${site.url}${path}`, lastModified: new Date(), changeFrequency: "monthly", priority }));
}
