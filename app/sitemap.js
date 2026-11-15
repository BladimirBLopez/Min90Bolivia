import { equipos2026, partidos2026 } from "@/lib/liga2026";

const base = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export default function sitemap() {
  const ahora = new Date();
  const porId = Object.fromEntries(equipos2026.map((e) => [e.id, e]));
  const vistos = new Set();
  const cruces = partidos2026
    .map((m) => `${porId[m.local.id].slug}-vs-${porId[m.visitante.id].slug}`)
    .filter((s) => !vistos.has(s) && vistos.add(s));
  return [
    { url: base, lastModified: ahora, changeFrequency: "daily", priority: 1 },
    { url: `${base}/equipos`, lastModified: ahora, changeFrequency: "daily", priority: 0.9 },
    ...equipos2026.map((e) => ({ url: `${base}/equipo/${e.slug}`, lastModified: ahora, changeFrequency: "daily", priority: 0.8 })),
    ...cruces.map((s) => ({ url: `${base}/partido/${s}`, lastModified: ahora, changeFrequency: "weekly", priority: 0.6 })),
  ];
}
