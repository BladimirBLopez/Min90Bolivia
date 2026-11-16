import fs from "fs";
import path from "path";
import { porSlug2026 } from "@/lib/liga2026";
import { imagenEquipoBase, imagenGenerica } from "@/lib/ogLiga";

export const alt = "Equipo | Min90 Bolivia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const e = porSlug2026(slug);
  if (!e) return imagenGenerica();
  let src = null;
  try {
    const f = path.join(process.cwd(), "public", "escudos", `${slug}.png`);
    if (fs.existsSync(f)) src = "data:image/png;base64," + fs.readFileSync(f).toString("base64");
  } catch {}
  return imagenEquipoBase({ nombre: e.nombre, src, liga: "Primera División 2026", sub: "Tabla, forma y próximos partidos" });
}
