import { ligaPorSlug } from "@/lib/ligas";
import { imagenLiga } from "@/lib/ogLiga";

export const alt = "Liga | Min90 Bolivia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  return imagenLiga(ligaPorSlug(slug));
}
