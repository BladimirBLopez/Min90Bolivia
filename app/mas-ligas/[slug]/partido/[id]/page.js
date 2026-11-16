import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ligaESPN, detalleESPN, horaBolivia } from "@/lib/ligasESPN";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const liga = ligaESPN(slug);
  return liga ? { title: `Partido de ${liga.nombre}: estadísticas | Min90 Bolivia` } : {};
}

function Escudo({ equipo }) {
  return equipo.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={equipo.logo} alt="" width={74} height={74} className="h-[74px] w-[74px] object-contain" />
  ) : (
    <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-slate-100 text-xl font-black">
      {equipo.nombre.slice(0, 1)}
    </div>
  );
}

export default async function PartidoExtra({ params }) {
  const { slug, id } = await params;
  const liga = ligaESPN(slug);

  if (!liga || !/^\d{6,12}$/.test(String(id))) notFound();

  let detalle = null;

  try {
    detalle = await detalleESPN(liga, id);
  } catch (error) {
    console.error("[mas-ligas ESPN] detalle", slug, id, error?.message || String(error));
    // La fuente puede no ofrecer detalles temporalmente.
  }

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 py-8">
        <Link href={`/mas-ligas/${slug}`} className="text-sm font-semibold text-oro-700">← {liga.nombre}</Link>

        {!detalle ? (
          <div className="mt-5 rounded-2xl bg-white p-6 text-sm text-slate-600">
            Los detalles de este partido no están disponibles temporalmente.
          </div>
        ) : (
          <>
            <h1 className="mt-4 text-xl font-extrabold">
              {detalle.partido.local.nombre} vs {detalle.partido.visitante.nombre}
            </h1>

            <div className="mt-4 rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-5 text-center shadow-sm">
              <p className="text-sm font-bold text-oro-700">{liga.nombre}</p>
              <p className="mt-1 text-xs text-slate-500">{horaBolivia(detalle.partido.fecha)}</p>

              <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div className="flex min-w-0 flex-col items-center gap-2">
                  <Escudo equipo={detalle.partido.local} />
                  <span className="text-sm font-bold leading-tight">{detalle.partido.local.nombre}</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="whitespace-nowrap text-4xl font-black text-oro-700">
                    {detalle.partido.fase !== "pre" &&
                     detalle.partido.local.goles !== null &&
                     detalle.partido.visitante.goles !== null
                      ? `${detalle.partido.local.goles} - ${detalle.partido.visitante.goles}`
                      : "VS"}
                  </span>

                  <span className={detalle.partido.fase === "in"
                    ? "rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white"
                    : "text-xs font-semibold text-slate-500"}>
                    {detalle.partido.fase === "in"
                      ? `🔴 EN VIVO ${detalle.partido.minuto}`
                      : detalle.partido.fase === "post" ? "FINAL" : "PRÓXIMO"}
                  </span>
                </div>

                <div className="flex min-w-0 flex-col items-center gap-2">
                  <Escudo equipo={detalle.partido.visitante} />
                  <span className="text-sm font-bold leading-tight">{detalle.partido.visitante.nombre}</span>
                </div>
              </div>

              {detalle.partido.estadio && (
                <p className="mt-5 text-xs text-slate-500">{detalle.partido.estadio}</p>
              )}
            </div>

            <section className="mt-8">
              <h2 className="mb-3 text-xl font-extrabold">Estadísticas del partido</h2>

              {detalle.estadisticas.length ? (
                <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
                  {detalle.estadisticas.map((s) => (
                    <div key={s.titulo} className="grid grid-cols-[1fr_2fr_1fr] gap-2 border-b border-slate-100 pb-2 text-sm last:border-b-0">
                      <b>{s.local ?? "—"}</b>
                      <span className="text-center text-slate-600">{s.titulo}</span>
                      <b className="text-right">{s.visitante ?? "—"}</b>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-white p-4 text-sm text-slate-500">
                  No hay estadísticas del encuentro disponibles todavía.
                </p>
              )}
            </section>

            <section className="mt-8">
              <h2 className="mb-3 text-xl font-extrabold">Eventos</h2>

              {detalle.eventos.length ? (
                <ol className="divide-y divide-slate-100 rounded-2xl bg-white px-4 shadow-sm">
                  {detalle.eventos.map((e, i) => (
                    <li key={`${e.id}-${i}`} className="flex gap-3 py-3 text-sm">
                      <b className="w-10 shrink-0 text-oro-700">{e.minuto || "—"}</b>
                      <span>
                        {e.tipo}{e.equipo ? ` · ${e.equipo}` : ""}
                        {e.descripcion ? (
                          <span className="block text-xs text-slate-500">{e.descripcion}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="rounded-xl bg-white p-4 text-sm text-slate-500">
                  No hay eventos disponibles todavía.
                </p>
              )}
            </section>

            <section className="mt-8">
              <h2 className="mb-3 text-xl font-extrabold">Alineaciones</h2>

              {detalle.alineaciones.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {detalle.alineaciones.map((e) => (
                    <div key={e.equipo} className="rounded-2xl bg-white p-4 shadow-sm">
                      <h3 className="mb-3 font-bold">
                        {e.equipo}{e.formacion ? ` · ${e.formacion}` : ""}
                      </h3>
                      <ul className="space-y-2 text-sm">
                        {e.titulares.map((p, i) => (
                          <li key={`${p.nombre}-${i}`} className="border-b border-slate-100 pb-1">
                            {p.dorsal ? `${p.dorsal}. ` : ""}{p.nombre}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-white p-4 text-sm text-slate-500">
                  Alineaciones todavía no confirmadas.
                </p>
              )}
            </section>
          </>
        )}

        <p className="mt-8 text-xs text-slate-500">
          Información sujeta a disponibilidad de ESPN. Los datos pueden actualizarse con retraso.
        </p>
      </section>
    </main>
  );
}
