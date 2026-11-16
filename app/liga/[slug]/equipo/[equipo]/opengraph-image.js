import { ligaPorSlug, equipoPorSlug } from "@/lib/ligas";
import { imagenEquipo, imagenGenerica } from "@/lib/ogLiga";

export const alt = "Equipo | Min90 Bolivia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug, equipo } = await params;
  const liga = ligaPorSlug(slug);
  const e = liga && equipoPorSlug(slug, equipo);
  return e ? imagenEquipo(e, liga) : imagenGenerica();
}
