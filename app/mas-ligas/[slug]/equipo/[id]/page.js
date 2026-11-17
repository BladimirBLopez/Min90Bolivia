import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ligaESPN, horaBolivia } from "@/lib/ligasESPN";
import { fichaEquipoESPN } from "@/lib/equiposESPN";

export const revalidate = 600;

function Partido({ partido, slug }) {
  const marcador =
    partido.fase !== "pre" &&
    Number.isFinite(partido.local.goles) &&
    Number.isFinite(partido.visitante.goles)
      ? `${partido.local.goles} - ${partido.visitante.goles}`
      : "VS";

  return (
    <Link
      href={`/mas-ligas/${slug}/partido/${partido.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-oro-500"
    >
      <p className="text-xs text-slate-500">
        {horaBolivia(partido.fecha)}
      </p>

      <div className="mt-2 flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 flex-1 font-semibold">
          {partido.local.nombre}
        </span>

        <b className="shrink-0 text-oro-700">{marcador}</b>

        <span className="min-w-0 flex-1 text-right font-semibold">
          {partido.visitante.nombre}
        </span>
      </div>
    </Link>
  );
}

export default async function EquipoESPN({ params }) {
  const { slug, id } = await params;
  const liga = ligaESPN(slug);

  if (!liga || !/^\d{1,12}$/.test(id)) {
    notFound();
  }

  const ficha = await fichaEquipoESPN(liga, id);

  if (!ficha) notFound();

  const { equipo, partidos, estadisticas } = ficha;

  const finalizados = partidos
    .filter((p) =>
      p.fase === "post" &&
      Number.isFinite(p.local.goles) &&
      Number.isFinite(p.visitante.goles)
    )
    .slice().reverse();

  const proximos = partidos
    .filter((p) =>
      p.fase === "pre" &&
      Date.parse(p.fecha) >= Date.now() - 6 * 3600000
    );

  const indicadores = [
    ["Jugados", estadisticas.pj],
    ["Victorias", estadisticas.g],
    ["Empates", estadisticas.e],
    ["Derrotas", estadisticas.p],
    ["Goles a favor", estadisticas.gf],
    ["Goles en contra", estadisticas.gc],
  ];

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-4xl px-5 py-8">
        <Link
          href={`/mas-ligas/${slug}/equipos`}
          className="text-sm font-bold text-oro-700"
        >
          ← Equipos de {liga.nombre}
        </Link>

        <div className="mt-6 flex items-center gap-4">
          {equipo.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={equipo.logo}
              alt=""
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
            />
          ) : null}

          <div>
            <h1 className="text-2xl font-extrabold">
              {equipo.nombre}
            </h1>
            <p className="text-sm text-slate-500">
              {liga.nombre}
            </p>
          </div>
        </div>

        {ficha.datosParciales && (
          <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            Algunos datos de ESPN no están disponibles temporalmente.
          </p>
        )}

        <h2 className="mt-8 text-xl font-extrabold">
          Rendimiento en partidos disponibles
        </h2>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {indicadores.map(([nombre, valor]) => (
            <div
              key={nombre}
              className="rounded-xl border border-slate-200 bg-white p-3 text-center"
            >
              <p className="text-xl font-black text-oro-700">
                {estadisticas.pj ? valor : "—"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {nombre}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Cálculos basados únicamente en partidos con marcadores finales
          confirmados dentro de los datos consultados. No son una
          clasificación ni estadísticas oficiales de la temporada completa.
        </p>

        <h2 className="mt-8 text-xl font-extrabold">
          Últimos partidos
        </h2>

        <div className="mt-4 space-y-3">
          {finalizados.slice(0, 10).map((p) => (
            <Partido key={p.id} partido={p} slug={slug} />
          ))}
        </div>

        {!finalizados.length && (
          <p className="mt-3 rounded-xl bg-white p-4 text-sm text-slate-500">
            No hay resultados finales confirmados en la información consultada.
          </p>
        )}

        <h2 className="mt-8 text-xl font-extrabold">
          Próximos partidos
        </h2>

        <div className="mt-4 space-y-3">
          {proximos.slice(0, 10).map((p) => (
            <Partido key={p.id} partido={p} slug={slug} />
          ))}
        </div>

        {!proximos.length && (
          <p className="mt-3 rounded-xl bg-white p-4 text-sm text-slate-500">
            No hay próximos encuentros disponibles.
          </p>
        )}
      </section>
    </main>
  );
}
