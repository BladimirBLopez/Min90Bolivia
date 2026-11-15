"use client";
import { useState } from "react";
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
    return <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-bold">{t.nombre[0]}</span>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={t.logo} alt={t.nombre} width={44} height={44} loading="lazy" className="h-11 w-11 object-contain" />;
}

function Tarjeta({ m }) {
  const fin = m.goles.local !== null && m.goles.visitante !== null && !m.pick && m.terminado;
  const c = m.pick ? m.pick.confianza || 0 : 0;
  const texto = m.pick
    ? `Hola, quiero cargar y jugar "${m.pick.pick}" en ${m.local.nombre} vs ${m.visitante.nombre}. Vi el pronóstico en Min90 Bolivia`
    : `Hola, quiero cargar y jugar ${m.local.nombre} vs ${m.visitante.nombre}. Vi el partido en Min90 Bolivia`;
  return (
    <article className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 p-4">
      <p className="text-xs text-neutral-400">
        {fmt(m.fecha)}{m.hora ? ` · ${m.hora}` : ""} · Ronda {m.ronda}
        {m.estadio ? <span className="block text-neutral-600">{m.estadio}</span> : null}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 text-center">
        <div className="flex flex-1 flex-col items-center"><Escudito t={m.local} /><span className="mt-1 text-sm font-semibold">{m.local.nombre}</span></div>
        {m.terminado
          ? <span className="text-xl font-black text-green-400">{m.goles.local} - {m.goles.visitante}</span>
          : <span className="text-sm font-bold text-neutral-500">vs</span>}
        <div className="flex flex-1 flex-col items-center"><Escudito t={m.visitante} /><span className="mt-1 text-sm font-semibold">{m.visitante.nombre}</span></div>
      </div>
      {m.pick ? (
        <div className="mt-3 rounded-xl border border-green-500/40 bg-green-950/30 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] uppercase tracking-wide text-green-400">Pronóstico Min90{m.pick.mercado ? ` · ${m.pick.mercado}` : ""}</p>
            <span className="rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-black text-amber-300 ring-1 ring-amber-400/30">Cuota {m.pick.cuota}</span>
          </div>
          <p className="mt-1 text-lg font-extrabold">{m.pick.pick}</p>
          <p className="text-xs text-yellow-400">{"★".repeat(c)}{"☆".repeat(3 - c)}</p>
          {m.pick.analisis ? <p className="mt-1 text-sm text-neutral-300">{m.pick.analisis}</p> : null}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Chip tono="verde">Ambos marcan {m.ambos}%</Chip>
          <Chip tono="amarillo">Más de 2.5 goles {m.o25}%</Chip>
        </div>
      )}
      <div className="mt-4 flex items-center justify-center gap-3">
        <a href={`/partido/${m.slug}`} className="text-sm font-semibold text-green-400 hover:underline">Ver análisis</a>
        {m.terminado ? null : (
          <a href={waLinkDe(texto)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-black hover:bg-green-400">Jugar este partido</a>
        )}
      </div>
    </article>
  );
}

export default function PartidosLista({ pendientes, terminados }) {
  const [tab, setTab] = useState("proximos");
  const [n, setN] = useState(8);
  const pend = pendientes.map((m) => ({ ...m, terminado: false }));
  const term = terminados.map((m) => ({ ...m, terminado: true }));
  let lista;
  if (tab === "proximos") lista = pend;
  else if (tab === "terminados") lista = term;
  else {
    const d = tab === "hoy" ? hoy() : manana();
    lista = [...term, ...pend].filter((m) => m.fecha === d).sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));
  }
  const cambiar = (k) => { setTab(k); setN(8); };

  return (
    <>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {tabs.map(([k, t]) => (
          <button key={k} onClick={() => cambiar(k)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${tab === k ? "bg-green-500 text-black" : "bg-neutral-900 text-neutral-300"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {lista.slice(0, n).map((m) => <Tarjeta key={m.id} m={m} />)}
      </div>
      {lista.length === 0 && (
        <div className="rounded-xl bg-neutral-900 p-4 text-center text-sm text-neutral-400">
          No hay partidos en esta categoría.
          <button onClick={() => cambiar("proximos")} className="ml-2 font-semibold text-green-400 underline">Ver próximos</button>
        </div>
      )}
      {lista.length > n && (
        <div className="mt-4 text-center">
          <button onClick={() => setN(n + 8)} className="rounded-full border border-green-500 px-5 py-2 text-sm font-bold text-green-400 hover:bg-green-500/10">Ver más partidos</button>
        </div>
      )}
      <p className="mt-4 text-xs text-neutral-500">Las tendencias son el promedio de ambos equipos en 2026 y no garantizan resultados. Solo +18.</p>
    </>
  );
}
