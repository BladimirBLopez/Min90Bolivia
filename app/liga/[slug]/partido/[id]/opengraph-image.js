import { ligaPorSlug, partidoPorId } from "@/lib/ligas";
import { imagenPartido, imagenGenerica } from "@/lib/ogLiga";

export const alt = "Partido | Min90 Bolivia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug, id } = await params;
  const liga = ligaPorSlug(slug);
  const m = liga && partidoPorId(slug, id);
  return m ? imagenPartido(m, liga) : imagenGenerica();
}
