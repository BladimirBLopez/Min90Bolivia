import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "data", "liga");
const slug = (t) => String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const leer = (n) => JSON.parse(fs.readFileSync(path.join(DIR, n), "utf8"));

export const equipos2024 = leer("equipos-2024.json").map((e) => ({ ...e, slug: slug(e.nombre) }));

const tramos = (obj) =>
  Object.entries(obj || {})
    .filter(([k]) => /^\d+-\d+$/.test(k))
    .map(([t, v]) => ({ t, total: (v && v.total) || 0 }))
    .filter((d) => parseInt(d.t, 10) < 90 || d.total > 0);
const suma = (o) => Object.values(o || {}).reduce((a, v) => a + ((v && v.total) || 0), 0);

export function info2024(nombre) {
  const s = slug(nombre);
  if (!s) return null;
  const eq = equipos2024.find((e) => e.slug === s) || equipos2024.find((e) => e.slug.includes(s) || s.includes(e.slug));
  if (!eq) return null;
  const f = path.join(DIR, `stats-2024-${eq.id}.json`);
  if (!fs.existsSync(f)) return { equipo: eq, stats: null };
  let raw;
  try { raw = JSON.parse(fs.readFileSync(f, "utf8")); } catch { return { equipo: eq, stats: null }; }
  const st = (Array.isArray(raw.response) ? raw.response[0] : raw.response) || raw;
  const forms = (st.lineups || []).slice().sort((a, b) => (b.played || 0) - (a.played || 0));
  const fm = forms[0];
  return {
    equipo: eq,
    stats: {
      favor: tramos(st.goals && st.goals.for && st.goals.for.minute),
      contra: tramos(st.goals && st.goals.against && st.goals.against.minute),
      formacion: fm ? { nombre: fm.formation, pj: fm.played } : null,
      amarillas: suma(st.cards && st.cards.yellow),
      rojas: suma(st.cards && st.cards.red),
      cs: st.clean_sheet ? st.clean_sheet.total : null,
      fts: st.failed_to_score ? st.failed_to_score.total : null,
      penMarcados: st.penalty && st.penalty.scored ? st.penalty.scored.total : null,
      penFallados: st.penalty && st.penalty.missed ? st.penalty.missed.total : null,
    },
  };
}
