import Link from "next/link";
import { notFound } from "next/navigation";
import { conSocial } from "@/lib/ogLiga";
import Navbar from "@/components/Navbar";
import EscudoLiga from "@/components/EscudoLiga";
import FormaLiga from "@/components/FormaLiga";
import { ligaPorSlug, partidoPorId, datosEquipo, h2hLiga, slugEquipo, jugado, cargarLiga, resultadoPara } from "@/lib/ligas";
import Cuenta from "@/components/Cuenta";
import TabsAncla from "@/components/TabsAncla";
import { aPartidos, ajustar, predecir } from "@/lib/modelo";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ProveedorPartidoEnVivo, MarcadorPartidoEnVivo, DetallesPartidoEnVivo } from "@/components/DetallePartidoEnVivo";

export const revalidate = 3600;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, m, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[m - 1]}`;
};
const pct = (x, n) => (n ? Math.round((100 * x) / n) : 0);
const box = "rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white shadow-md shadow-slate-200/70";

export async function generateMetadata({ params }) {
  const { slug, id } = await params;
  const l = ligaPorSlug(slug);
  const m = l && partidoPorId(slug, id);
  if (!m) return {};
  const meta = conSocial({
    title: `${m.local.nombre} vs ${m.visitante.nombre}: ${l.nombre} | Min90 Bolivia`,
    description: `${m.local.nombre} vs ${m.visitante.nombre} (${fmt(m.fecha)}${m.hora ? ` · ${m.hora}` : ""}, hora de Bolivia). Estadísticas y tendencias de ambos equipos. Recarga Metabet por WhatsApp, pago por QR.`,
  });
  const tituloSocial = `Recarga Metabet | ${m.local.nombre} vs ${m.visitante.nombre}: ${l.nombre}`;

  return {
    ...meta,
    openGraph: { ...meta.openGraph, title: tituloSocial },
    twitter: { ...meta.twitter, title: tituloSocial },
  };
}

export default async function PartidoLiga({ params }) {
  const { slug, id } = await params;
  const liga = ligaPorSlug(slug);
  if (!liga) notFound();
  const m = partidoPorId(slug, id);
  if (!m) notFound();

  const sa = datosEquipo(slug, m.local.id);
  const sb = datosEquipo(slug, m.visitante.id);
  const duelos = h2hLiga(slug, m.local.id, m.visitante.id, 5).filter((x) => x.id !== m.id);
  const fin = jugado(m);
  const prom = (x, n) => (n ? (x / n).toFixed(2) : "—");
  const filas = [
    ["Partidos jugados", sa.pj, sb.pj],
    ["Goles a favor por partido", prom(sa.gf, sa.pj), prom(sb.gf, sb.pj)],
    ["Goles en contra por partido", prom(sa.gc, sa.pj), prom(sb.gc, sb.pj)],
    ["Ambos marcan", `${pct(sa.btts, sa.pj)}%`, `${pct(sb.btts, sb.pj)}%`],
    ["Más de 2.5 goles", `${pct(sa.o25, sa.pj)}%`, `${pct(sb.o25, sb.pj)}%`],
  ];
  const eq = (t) => `/liga/${slug}/equipo/${slugEquipo(t.nombre)}`;
  const nd = duelos.length;
  const rd = duelos.map((d) => resultadoPara(d, m.local.id));
  const dg = rd.filter((r) => r === "G").length;
  const de = rd.filter((r) => r === "E").length;
  const dp = rd.filter((r) => r === "P").length;
  const dgoles = duelos.reduce((s, d) => s + d.goles.local + d.goles.visitante, 0);
  const dbtts = duelos.filter((d) => d.goles.local > 0 && d.goles.visitante > 0).length;
  const colr = { G: "bg-green-500 text-black", E: "bg-yellow-500 text-black", P: "bg-red-500 text-white" };
  const filaUlt = (x, idEq) => {
    const r = resultadoPara(x, idEq);
    return (
      <Link key={x.id} href={`/liga/${slug}/partido/${x.id}`} className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 text-sm first:border-t-0 hover:bg-oro-50">
        <span className="w-14 shrink-0 text-xs text-slate-500">{fmt(x.fecha)}</span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <EscudoLiga e={x.local} size={18} />
            <span className={`truncate ${x.local.id === idEq ? "font-bold" : ""}`}>{x.local.nombre}</span>
          </span>
          <span className="mt-1 flex items-center gap-2">
            <EscudoLiga e={x.visitante} size={18} />
            <span className={`truncate ${x.visitante.id === idEq ? "font-bold" : ""}`}>{x.visitante.nombre}</span>
          </span>
        </span>
        <span className="text-right font-bold leading-tight">{x.goles.local}<br />{x.goles.visitante}</span>
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${colr[r]}`}>{r}</span>
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <ProveedorPartidoEnVivo habilitado={slug === "nations-league-2026"} idLocal={String(m.id)} inicio={m.ts}>
      <section className="mx-auto max-w-3xl px-5 py-8">
        <Link href={`/liga/${slug}`} className="text-sm font-semibold text-oro-700 hover:underline">← {liga.nombre}</Link>
        <div className={`${box} mt-4 px-4 pb-4 pt-5 text-center sm:px-6`}>
          <p className="text-xs font-extrabold uppercase tracking-wide text-oro-700">{liga.nombre} {liga.temporada}</p>
          <p className="mt-2 text-xs text-slate-500">
            {fmt(m.fecha)}{m.hora ? ` · ${m.hora}` : ""} · Ronda {m.ronda} · hora de Bolivia
            {m.estadio ? <span className="block text-slate-400">{m.estadio}</span> : null}
          </p>
          <div className="mt-6 flex items-center justify-between gap-2 sm:gap-4">
            <Link href={eq(m.local)} className="flex flex-1 flex-col items-center">
              <EscudoLiga e={m.local} size={76} />
              <span className="mt-3 text-sm font-extrabold leading-tight sm:text-base">{m.local.nombre}</span>
            </Link>
            {slug === "nations-league-2026" ? (
              <MarcadorPartidoEnVivo marcadorInicial={fin ? m.goles : null} />
            ) : fin ? (
              <span className="text-4xl font-black tracking-tight text-oro-700 sm:text-5xl">{m.goles.local} - {m.goles.visitante}</span>
            ) : (
              <span className="text-sm font-bold text-slate-500">vs</span>
            )}
            <Link href={eq(m.visitante)} className="flex flex-1 flex-col items-center">
              <EscudoLiga e={m.visitante} size={76} />
              <span className="mt-3 text-sm font-extrabold leading-tight sm:text-base">{m.visitante.nombre}</span>
            </Link>
          </div>
          <Cuenta inicio={!fin && m.hora ? `${m.fecha}T${m.hora}:00-04:00` : null} />
          <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-2 py-2 text-[10px] text-slate-500 sm:px-3">
            <FormaLiga lista={sa.forma} />
            <span>Forma</span>
            <FormaLiga lista={sb.forma} />
          </div>
        </div>

        <TabsAncla items={[["Información", "#info"], ...(slug === "nations-league-2026" ? [["En vivo y detalles", "#en-vivo"]] : []), ...(!fin ? [["Tendencias", "#tendencias"]] : []), ["Comparación", "#comparacion"], ["H2H", "#h2h"], ["Últimos partidos", "#ultimos"]]} />

        <h2 id="info" className="mb-3 mt-8 scroll-mt-4 text-xl font-extrabold">Información del partido</h2>
        <div className={`${box} divide-y divide-slate-100 px-4`}>
          {[["Torneo", `${liga.nombre} ${liga.temporada}`], ["Ronda", m.ronda], ["Fecha y hora (Bolivia)", `${fmt(m.fecha)}${m.hora ? ` · ${m.hora}` : ""}`], ...(m.estadio ? [["Estadio", m.estadio]] : [])].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 py-3 text-sm">
              <span className="text-slate-500">{k}</span>
              <span className="text-right font-semibold">{v}</span>
            </div>
          ))}
        </div>

        {slug === "nations-league-2026" ? <DetallesPartidoEnVivo /> : null}

        <div id="tendencias" className="scroll-mt-4" />
        {!fin && (() => {
          try {
            const p = predecir(ajustar(aPartidos(cargarLiga(slug))), m.local.id, m.visitante.id);
            if (!p) return null;
            const r = (x) => Math.round(x * 100);
            const amb = sa.pj && sb.pj ? Math.round((pct(sa.btts, sa.pj) + pct(sb.btts, sb.pj)) / 2) : null;
            const dc = p.x1 >= p.x2 ? { t: `${m.local.nombre} o empate`, v: p.x1 } : { t: `${m.visitante.nombre} o empate`, v: p.x2 };
            const gl = p.o25 >= 0.5 ? { t: "Más de 2.5 goles", v: p.o25 } : { t: "Menos de 2.5 goles", v: 1 - p.o25 };
            const lista = [["Resultado", dc], ["Goles", gl]];
            if (amb !== null) lista.push(["Ambos marcan", amb >= 50 ? { t: "Sí", v: amb / 100 } : { t: "No", v: (100 - amb) / 100 }]);
            const texto = `Hola, quiero jugar ${m.local.nombre} vs ${m.visitante.nombre} (${liga.nombre}). Vi las tendencias Min90 en la web y quiero consultar la cuota. Soy mayor de 18 años.`;
            return (
              <div className="mt-8 rounded-2xl border-2 border-oro-500 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-extrabold">Tendencias Min90</h2>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-oro-200">Confianza baja</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">En esta liga el modelo aún no supera a la tendencia general: úsalo como referencia, no como pick seguro.</p>
                <div className="mt-4 space-y-3">
                  {lista.map(([k, f]) => (
                    <div key={k}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm"><span className="mr-2 text-xs uppercase text-slate-500">{k}</span><b className={f.v >= 0.55 ? "text-slate-900" : "text-slate-500"}>{f.t}</b></p>
                        <p className={`text-lg font-black ${f.v >= 0.55 ? "text-oro-700" : "text-slate-400"}`}>{r(f.v)}%</p>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200"><div className={f.v >= 0.55 ? "h-full bg-oro-500" : "h-full bg-slate-400"} style={{ width: `${r(f.v)}%` }} /></div>
                      {f.v < 0.55 ? <p className="mt-0.5 text-[11px] text-slate-500">Sin ventaja clara</p> : null}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <WhatsAppButton texto={texto}>Consultar cuota</WhatsAppButton>
                </div>
                <p className="mt-3 text-[11px] text-slate-500">Estimación estadística de confianza baja, no una garantía de resultado. Solo +18. Juega con responsabilidad.</p>
              </div>
            );
          } catch (e) {
            return null;
          }
        })()}

        <h2 id="comparacion" className="mb-3 mt-8 scroll-mt-4 text-xl font-extrabold">Comparación</h2>
        <div className={`${box} divide-y divide-slate-100 px-4`}>
          {filas.map(([k, a, b]) => (
            <div key={k} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-3 text-sm">
              <span className="font-semibold">{a}</span>
              <span className="text-center text-xs text-slate-500">{k}</span>
              <span className="text-right font-semibold">{b}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Estadísticas de la temporada, no son pronósticos. Los pronósticos Min90 van en el grupo de WhatsApp.</p>

        <h2 id="h2h" className="mb-3 mt-8 scroll-mt-4 text-xl font-extrabold">Cara a cara (H2H)</h2>
        {duelos.length === 0 ? <p className="text-sm text-slate-500">Todavía no se enfrentaron en los partidos de esta temporada que tenemos guardados.</p> : null}
        {duelos.length > 0 && (
          <>
            <div className={`${box} mb-3 p-4`}>
              <div className="flex h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="bg-green-500" style={{ width: `${pct(dg, nd)}%` }} />
                <div className="bg-slate-400" style={{ width: `${pct(de, nd)}%` }} />
                <div className="bg-blue-500" style={{ width: `${pct(dp, nd)}%` }} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div><p className="text-xl font-black text-green-600">{pct(dg, nd)}%</p><p className="text-[11px] leading-tight text-slate-500">{dg} gana {m.local.nombre}</p></div>
                <div><p className="text-xl font-black text-slate-500">{pct(de, nd)}%</p><p className="text-[11px] leading-tight text-slate-500">{de} empate{de === 1 ? "" : "s"}</p></div>
                <div><p className="text-xl font-black text-blue-600">{pct(dp, nd)}%</p><p className="text-[11px] leading-tight text-slate-500">{dp} gana {m.visitante.nombre}</p></div>
              </div>
              <div className="mt-4 divide-y divide-slate-100 text-sm">
                <div className="flex justify-between py-2"><span className="text-slate-600">Total de partidos</span><span className="font-semibold">{nd}</span></div>
                <div className="flex justify-between py-2"><span className="text-slate-600">Goles por partido</span><span className="font-semibold">{(dgoles / nd).toFixed(2)}</span></div>
                <div className="flex justify-between py-2"><span className="text-slate-600">Ambos equipos anotaron</span><span className="font-semibold">{pct(dbtts, nd)}%</span></div>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">Solo partidos de esta temporada guardados en la web.</p>
            </div>
            <div className={box}>
              {duelos.map((d) => (
                <Link key={d.id} href={`/liga/${slug}/partido/${d.id}`} className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm first:border-t-0 hover:bg-oro-50">
                  <span className="text-xs text-slate-500">{fmt(d.fecha)}</span>
                  <span className="min-w-0 flex-1 truncate">{d.local.nombre} <span className="text-slate-400">vs</span> {d.visitante.nombre}</span>
                  <span className="font-bold text-oro-700">{d.goles.local}-{d.goles.visitante}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
      </ProveedorPartidoEnVivo>

      <section className="mx-auto max-w-3xl px-5 pb-6">
        <h2 id="ultimos" className="mb-3 scroll-mt-4 text-xl font-extrabold">Últimos partidos</h2>
        {[[m.local, sa], [m.visitante, sb]].map(([t, s]) => (
          <div key={t.id} className="mb-4">
            <Link href={eq(t)} className="mb-2 flex items-center gap-2 font-bold hover:text-oro-700">
              <EscudoLiga e={t} size={24} />
              {t.nombre}
            </Link>
            <div className={box}>
              {s.ultimos.slice(0, 5).map((x) => filaUlt(x, t.id))}
              {s.ultimos.length === 0 ? <p className="p-4 text-sm text-slate-500">Todavía no hay partidos jugados.</p> : null}
            </div>
          </div>
        ))}
        <p className="text-xs text-slate-500">Solo resultados de esta temporada. Córners, tarjetas y xG no están disponibles en nuestros datos.</p>
      </section>

      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-slate-500">
        <p>Solo +18. Juega con responsabilidad.</p>
      </footer>
    </main>
  );
}
