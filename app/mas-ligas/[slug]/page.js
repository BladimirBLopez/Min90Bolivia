import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ActualizadorESPN from "@/components/ActualizadorESPN";
import { ligaESPN, partidosESPN, horaBolivia } from "@/lib/ligasESPN";

export const revalidate = 90;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const liga = ligaESPN(slug);
  return liga ? { title: `${liga.nombre}: partidos y resultados | Min90 Bolivia` } : {};
}

function Escudo({ equipo }) {
  return equipo.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={equipo.logo} alt="" width={56} height={56} loading="lazy" className="h-14 w-14 object-contain" />
  ) : (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 font-black">
      {equipo.nombre.slice(0, 1)}
    </div>
  );
}

function Tarjeta({ partido, slug }) {
  const marcador = partido.fase !== "pre" &&
    partido.local.goles !== null &&
    partido.visitante.goles !== null
      ? `${partido.local.goles} - ${partido.visitante.goles}`
      : "VS";

  return (
    <Link
      href={`/mas-ligas/${slug}/partido/${partido.id}`}
      className="block rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
        <span>{horaBolivia(partido.fecha)}</span>
        <span className={partido.fase === "in"
          ? "rounded-full bg-red-600 px-3 py-1 font-bold text-white"
          : "font-semibold text-slate-600"}>
          {partido.fase === "in"
            ? `🔴 EN VIVO ${partido.minuto}`
            : partido.fase === "post" ? "FINAL" : "PRÓXIMO"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
        <div className="flex min-w-0 flex-col items-center gap-2">
          <Escudo equipo={partido.local} />
          <span className="text-sm font-bold leading-tight">{partido.local.nombre}</span>
        </div>

        <span className="whitespace-nowrap text-2xl font-black text-oro-700">{marcador}</span>

        <div className="flex min-w-0 flex-col items-center gap-2">
          <Escudo equipo={partido.visitante} />
          <span className="text-sm font-bold leading-tight">{partido.visitante.nombre}</span>
        </div>
      </div>

      <p className="mt-4 text-center text-xs font-semibold text-oro-700">Ver detalles y estadísticas ›</p>
    </Link>
  );
}

export default async function LigaExtra({ params }) {
  const { slug } = await params;
  const liga = ligaESPN(slug);
  if (!liga) notFound();

  const { partidos, error } = await partidosESPN(liga);

  const grupos = [
    { titulo: "En vivo", lista: partidos.filter((p) => p.fase === "in") },
    { titulo: "Próximos", lista: partidos.filter((p) => p.fase === "pre").slice(0, 36) },
    { titulo: "Finalizados", lista: partidos.filter((p) => p.fase === "post").reverse().slice(0, 20) },
  ];

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-5xl px-5 py-8">
        <ActualizadorESPN
          fechas={partidos.map((p) => p.fecha).filter(Boolean).join("|")}
          intervalo={120000}
        />
        <Link href="/mas-ligas" className="text-sm font-semibold text-oro-700">← Más ligas</Link>
        <h1 className="mt-3 text-3xl font-extrabold titulo-oro">{liga.nombre}</h1>
        <p className="mt-2 text-sm text-slate-600">Resultados y próximos encuentros · hora de Bolivia</p>

        {error && (
          <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            Los partidos no están disponibles en la fuente en este momento. Intenta más tarde.
          </p>
        )}

        {!error && !partidos.length && (
          <p className="mt-5 text-sm text-slate-600">
            No hay encuentros disponibles en la ventana consultada.
          </p>
        )}

        {grupos.map((grupo) => grupo.lista.length ? (
          <section key={grupo.titulo} className="mt-8">
            <h2 className="mb-4 text-xl font-extrabold">{grupo.titulo}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {grupo.lista.map((partido) => (
                <Tarjeta key={partido.id} partido={partido} slug={slug} />
              ))}
            </div>
          </section>
        ) : null)}

        <p className="mt-10 text-xs text-slate-500">
          La información depende de la cobertura de ESPN y puede sufrir demoras. No se muestran estadísticas inexistentes.
        </p>
      </section>
    </main>
  );
}
