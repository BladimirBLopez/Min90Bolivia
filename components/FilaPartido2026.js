import { Escudo } from "@/components/LigaUI";
import { resultado2026, slug2026 } from "@/lib/liga2026";

const barra = { G: "bg-green-500", E: "bg-slate-500", P: "bg-red-500" };

const fechaCorta = (f) => {
  const [y, mo, d] = String(f).split("-");
  return d && mo && y ? `${d}.${mo}.${y.slice(2)}` : f;
};

function Equipo({ t, id }) {
  return (
    <a
      href={`/equipo/${slug2026(t.nombre)}`}
      className={`flex min-w-0 items-center gap-2 py-0.5 hover:text-green-400 ${t.id === id ? "font-bold text-white" : "text-slate-300"}`}
    >
      <Escudo e={t} size={22} />
      <span className="truncate">{t.nombre}</span>
    </a>
  );
}

export function FilaPartido2026({ m, id }) {
  const r = resultado2026(m, id);
  const href = `/partido/${slug2026(m.local.nombre)}-vs-${slug2026(m.visitante.nombre)}`;
  return (
    <div className="flex items-stretch gap-3 border-t border-slate-800 py-3">
      <div className={`w-1 shrink-0 rounded-full ${barra[r]}`} />
      <div className="min-w-0 flex-1">
        <a href={href} className="mb-1 block text-xs text-slate-500 hover:text-green-400">{fechaCorta(m.fecha)} · Ronda {m.ronda}</a>
        <Equipo t={m.local} id={id} />
        <Equipo t={m.visitante} id={id} />
      </div>
      <a href={href} className="flex w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-800 text-sm font-bold hover:bg-slate-700">
        <span>{m.goles.local}</span>
        <span>{m.goles.visitante}</span>
      </a>
    </div>
  );
}

export function ListaPartidos2026({ lista, id, visibles = 5 }) {
  const primeros = lista.slice(0, visibles);
  const resto = lista.slice(visibles);
  return (
    <div className="rounded-2xl bg-slate-900 px-4 ring-1 ring-white/5">
      {primeros.map((m) => (
        <FilaPartido2026 key={m.id} m={m} id={id} />
      ))}
      {resto.length > 0 ? (
        <details className="group">
          <summary className="cursor-pointer list-none border-t border-slate-800 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-400 hover:text-green-400 group-open:hidden">
            Mostrar más
          </summary>
          {resto.map((m) => (
            <FilaPartido2026 key={m.id} m={m} id={id} />
          ))}
        </details>
      ) : null}
    </div>
  );
}
