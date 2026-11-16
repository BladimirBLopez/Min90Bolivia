"use client";
import { useState, useEffect } from "react";
import { Chip } from "@/components/Ui";
import { waLinkDe } from "@/components/WhatsAppButton";

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, m, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[m - 1]}`;
};
const tabs = [["proximos", "Próximos"], ["hoy", "Hoy"], ["manana", "Mañana"], ["terminados", "Terminados"]];
const hoy = () => new Date(Date.now() - 4 * 3600 * 1000).toISOString().slice(0, 10);
const manana = () => new Date(Date.now() + 20 * 3600 * 1000).toISOString().slice(0, 10);

function Escudito({ t }) {
  if (!t.logo) {
    return <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">{t.nombre[0]}</span>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={t.logo} alt={t.nombre} width={56} height={56} loading="lazy" className="h-14 w-14 object-contain" />;
}

function Tarjeta({ m }) {
  const fin = m.goles.local !== null && m.goles.visitante !== null && !m.pick && m.terminado;
  const c = m.pick ? m.pick.confianza || 0 : 0;
  const texto = m.pick
    ? `Hola, quiero cargar y jugar "${m.pick.pick}" en ${m.local.nombre} vs ${m.visitante.nombre}. Vi el pronóstico en Min90 Bolivia`
    : `Hola, quiero cargar y jugar ${m.local.nombre} vs ${m.visitante.nombre}. Vi el partido en Min90 Bolivia`;
  return (
    <article className="relative rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-4 shadow-md shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lg">
      {m.slug || m.href ? <a href={m.href || `/partido/${m.slug}`} aria-label={`Ver análisis de ${m.local.nombre} vs ${m.visitante.nombre}`} className="absolute inset-0 z-0 rounded-2xl" /> : null}
      {m.slug || m.href ? <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 text-xl text-slate-500">›</span> : null}
      <p className="text-xs text-slate-600">
        {m.liga ? <span className="block font-bold text-oro-700">{m.liga}</span> : null}{fmt(m.fecha)}{m.hora ? ` · ${m.hora}` : ""} · Ronda {m.ronda}
        {m.estadio ? <span className="block text-slate-400">{m.estadio}</span> : null}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 text-center">
        <div className="flex flex-1 flex-col items-center"><Escudito t={m.local} /><span className="mt-2 text-sm font-bold text-slate-900">{m.local.nombre}</span></div>
        {m.terminado
          ? <span className="text-xl font-black text-oro-700">{m.goles.local} - {m.goles.visitante}</span>
          : <span className="text-sm font-bold text-slate-500">vs</span>}
        <div className="flex flex-1 flex-col items-center"><Escudito t={m.visitante} /><span className="mt-2 text-sm font-bold text-slate-900">{m.visitante.nombre}</span></div>
      </div>
      {m.pick ? (
        <div className="mt-3 rounded-xl border border-oro-500/50 bg-oro-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] uppercase tracking-wide text-oro-700">Pronóstico Min90{m.pick.mercado ? ` · ${m.pick.mercado}` : ""}</p>
            <span className="rounded-full bg-oro-400 px-2.5 py-0.5 text-xs font-black text-slate-900">Cuota {m.pick.cuota}</span>
          </div>
          <p className="mt-1 text-lg font-extrabold">{m.pick.pick}</p>
          <p className="text-xs text-yellow-700">{"★".repeat(c)}{"☆".repeat(3 - c)}</p>
          {m.pick.analisis ? <p className="mt-1 text-sm text-slate-700">{m.pick.analisis}</p> : null}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Chip tono="verde">Ambos marcan {m.ambos}%</Chip>
          <Chip tono="amarillo">Más de 2.5 goles {m.o25}%</Chip>
        </div>
      )}
      {m.terminado ? null : (
        <div className="mt-4 flex justify-center">
          <a href={waLinkDe(texto)} target="_blank" rel="noopener noreferrer" className="relative z-10 rounded-full bg-green-500 px-6 py-2.5 text-sm font-bold text-black shadow-sm hover:bg-green-400">Jugar este partido</a>
        </div>
      )}
    </article>
  );
}

export default function PartidosLista({ pendientes = [], terminados = [], ligas }) {
  const [tab, setTab] = useState("proximos");
  const [n, setN] = useState(8);
  const opciones = ligas && ligas.length ? ligas : [{ k: "unica", nombre: "", pendientes, terminados }];
  const [lk, setLk] = useState(opciones[0].k);
  const [ref, setRef] = useState(null);
  useEffect(() => { setRef({ h: hoy(), m: manana() }); }, []);
  const actual = opciones.find((x) => x.k === lk) || opciones[0];
  const pend = actual.pendientes.map((m) => ({ ...m, terminado: false }));
  const term = actual.terminados.map((m) => ({ ...m, terminado: true }));
  let lista;
  if (tab === "proximos") lista = [...pend].sort((x, y) => `${x.fecha || ""} ${x.hora || ""}`.localeCompare(`${y.fecha || ""} ${y.hora || ""}`));
  else if (tab === "terminados") lista = term;
  else {
    const d = tab === "hoy" ? hoy() : manana();
    lista = [...term, ...pend].filter((m) => m.fecha === d).sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));
  }
  const cambiar = (k) => { setTab(k); setN(8); };
  const cambiarLiga = (k) => { setLk(k); setTab("proximos"); setN(8); };
  const etiqueta = (f) => (ref && f === ref.h ? "Hoy" : ref && f === ref.m ? "Mañana" : fmt(f));
  const grupos = [];
  lista.slice(0, n).forEach((m) => {
    const g = grupos[grupos.length - 1];
    if (g && g.f === m.fecha) g.items.push(m);
    else grupos.push({ f: m.fecha, items: [m] });
  });

  return (
    <>
      {opciones.length > 1 ? (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {opciones.map((o) => (
            <button key={o.k} onClick={() => cambiarLiga(o.k)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${lk === o.k ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700"}`}>
              {o.nombre}
            </button>
          ))}
        </div>
      ) : null}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(([k, t]) => (
          <button key={k} onClick={() => cambiar(k)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${tab === k ? "border border-oro-500 bg-oro-400 text-slate-900 shadow-sm" : "border border-slate-300 bg-white text-slate-700 hover:border-oro-500"}`}>
            {t}
          </button>
        ))}
      </div>
      <div>
        {grupos.map((g) => (
          <div key={g.f} className="mb-4">
            {tab === "hoy" || tab === "manana" ? null : (
              <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-oro-700">{etiqueta(g.f)}</h3>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {g.items.map((m) => <Tarjeta key={`${m.liga || ""}-${m.id}`} m={m} />)}
            </div>
          </div>
        ))}
      </div>
      {lista.length === 0 && (
        <div className="rounded-xl bg-white p-4 text-center text-sm text-slate-600">
          No hay partidos en esta categoría.
          <button onClick={() => cambiar("proximos")} className="ml-2 font-semibold text-oro-700 underline">Ver próximos</button>
        </div>
      )}
      {lista.length > n && (
        <div className="mt-4 text-center">
          <button onClick={() => setN(n + 8)} className="rounded-full border border-oro-500 px-5 py-2 text-sm font-bold text-oro-700 hover:bg-oro-500/10">Ver más partidos</button>
        </div>
      )}
      <p className="mt-4 text-xs text-slate-500">Las tendencias son el promedio de ambos equipos en 2026 y no garantizan resultados. Solo +18.</p>
    </>
  );
}
