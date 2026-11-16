import Link from "next/link";
import { notFound } from "next/navigation";
import { conSocial } from "@/lib/ogLiga";
import Navbar from "@/components/Navbar";
import PartidosLista from "@/components/PartidosLista";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LIGAS, ligaPorSlug, listasLiga, tablaLiga, equiposLiga, slugEquipo } from "@/lib/ligas";
import EscudoLiga from "@/components/EscudoLiga";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return LIGAS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const l = ligaPorSlug(slug);
  if (!l) return {};
  return conSocial({
    title: `${l.nombre} ${l.temporada}: partidos${l.tabla ? " y tabla" : ""} | Min90 Bolivia`,
    description: `Partidos${l.tabla ? " y tabla" : ""} de ${l.nombre} ${l.temporada}, con hora de Bolivia.`,
  });
}

export default async function LigaPage({ params }) {
  const { slug } = await params;
  const liga = ligaPorSlug(slug);
  if (!liga) notFound();
  const { pendientes, terminados } = listasLiga(slug);
  const tabla = liga.tabla ? tablaLiga(slug) : [];

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-5xl px-5 py-8">
        <Link href="/ligas" className="text-sm font-semibold text-oro-700 hover:underline">← Todas las ligas</Link>
        <h1 className="mt-3 text-3xl font-extrabold titulo-oro">{liga.nombre} {liga.temporada}</h1>
        <p className="mb-6 mt-2 text-sm text-slate-600">{liga.pais} · hora de Bolivia.</p>

        {tabla.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-extrabold">Tabla de posiciones</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white shadow-md shadow-slate-200/70">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">#</th>
                    <th className="px-2 py-3">Equipo</th>
                    <th className="px-2 py-3 text-center">PJ</th>
                    <th className="px-2 py-3 text-center">DG</th>
                    <th className="px-3 py-3 text-center">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {tabla.map((t) => (
                    <tr key={t.id} className={"border-t border-slate-100 " + (t.pos === 1 ? "bg-oro-50" : "")}>
                      <td className="px-3 py-2.5 text-slate-500">{t.pos}</td>
                      <td className="px-2 py-2.5">
                        <span className="flex items-center gap-2 font-semibold text-slate-900">
                          {t.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={t.logo} alt="" width={24} height={24} loading="lazy" className="h-6 w-6 object-contain" />
                          ) : null}
                          <Link href={`/liga/${slug}/equipo/${slugEquipo(t.nombre)}`} className="truncate hover:text-oro-700">{t.nombre}</Link>
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-center">{t.pj}</td>
                      <td className="px-2 py-2.5 text-center">{t.dif > 0 ? "+" : ""}{t.dif}</td>
                      <td className="px-3 py-2.5 text-center font-bold text-oro-700">{t.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!liga.tabla && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-extrabold">Equipos</h2>
            <div className="flex flex-wrap gap-2">
              {equiposLiga(slug).map((q) => (
                <Link key={q.id} href={`/liga/${slug}/equipo/${q.slug}`} className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:border-oro-500">
                  <EscudoLiga e={q} size={20} />
                  {q.nombre}
                </Link>
              ))}
            </div>
          </div>
        )}
        <h2 className="mb-3 text-xl font-extrabold">Partidos</h2>
        <PartidosLista pendientes={pendientes} terminados={terminados} />

        <div className="mt-8 flex justify-center">
          <WhatsAppButton>Escríbeme por WhatsApp</WhatsAppButton>
        </div>
      </section>
    </main>
  );
}
