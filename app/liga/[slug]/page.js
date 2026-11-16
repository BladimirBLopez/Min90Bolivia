import Link from "next/link";
import { notFound } from "next/navigation";
import { conSocial } from "@/lib/ogLiga";
import Navbar from "@/components/Navbar";
import PartidosLista from "@/components/PartidosLista";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LIGAS, ligaPorSlug, listasLiga, tablaLiga, equiposLiga, slugEquipo } from "@/lib/ligas";
import EscudoLiga from "@/components/EscudoLiga";
import LigaTabs from "@/components/LigaTabs";

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
  const equipos = equiposLiga(slug);
  const cuenta = (x) => (Array.isArray(x) ? x.length : 0);

  const tabs = [
    {
      id: "partidos",
      titulo: "Partidos",
      contenido: <PartidosLista pendientes={pendientes} terminados={terminados} />,
    },
  ];

  if (tabla.length > 0) {
    tabs.push({
      id: "tabla",
      titulo: "Tabla",
      contenido: (
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
      ),
    });
  }

  tabs.push({
    id: "equipos",
    titulo: "Equipos",
    cuenta: equipos.length,
    contenido: (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {equipos.map((q) => (
          <Link
            key={q.id}
            href={`/liga/${slug}/equipo/${q.slug}`}
            className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-oro-500 hover:shadow-md"
          >
            <EscudoLiga e={q} size={44} />
            <span className="mt-2 text-sm font-semibold text-slate-900">{q.nombre}</span>
          </Link>
        ))}
      </div>
    ),
  });

  const datos = [
    ["Equipos", equipos.length],
    ["Por jugar", cuenta(pendientes)],
    ["Jugados", cuenta(terminados)],
  ].filter(([, n]) => n > 0);

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-5xl px-5 py-8">
        <Link href="/ligas" className="text-sm font-semibold text-oro-700 hover:underline">← Todas las ligas</Link>
        <h1 className="mt-3 text-3xl font-extrabold titulo-oro">{liga.nombre} {liga.temporada}</h1>
        <p className="mt-2 text-sm text-slate-600">{liga.pais} · hora de Bolivia.</p>

        {datos.length > 0 ? (
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {datos.map(([t, n]) => (
              <div key={t} className="rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-3 shadow-sm">
                <p className="text-2xl font-extrabold text-oro-700">{n}</p>
                <p className="text-xs text-slate-600">{t}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          <LigaTabs tabs={tabs} />
        </div>

        <div className="mt-10 flex justify-center">
          <WhatsAppButton texto={`Hola, quiero recargar para jugar ${liga.nombre}. Soy mayor de 18 años.`}>Recarga ahora</WhatsAppButton>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">Solo +18. Juega con responsabilidad.</p>
      </section>
    </main>
  );
}
