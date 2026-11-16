import { TEMPORADA, DE_PRUEBA, porId } from "@/lib/liga";

export const fmtFecha = (iso) =>
  new Date(iso).toLocaleDateString("es-BO", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/La_Paz" });

export function Escudo({ e, size = 48 }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={e.logo} alt={e.nombre} width={size} height={size} loading="lazy" className="object-contain" />;
}

const col = { G: "bg-green-500 text-black", E: "bg-yellow-500 text-black", P: "bg-red-500 text-white" };

export function Forma({ lista }) {
  return (
    <div className="flex gap-1">
      {lista.map((r, i) => (
        <span key={i} className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${col[r]}`}>{r}</span>
      ))}
    </div>
  );
}

export function Barra({ label, a, b, suf = "" }) {
  const total = a + b || 1;
  const pa = Math.round((a / total) * 100);
  return (
    <div className="py-2">
      <div className="flex justify-between text-sm">
        <span className="font-semibold">{a}{suf}</span>
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold">{b}{suf}</span>
      </div>
      <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="bg-green-500" style={{ width: `${pa}%` }} />
        <div className="bg-yellow-500" style={{ width: `${100 - pa}%` }} />
      </div>
    </div>
  );
}

export function AvisoPrueba() {
  if (!DE_PRUEBA) return null;
  return (
    <div className="bg-yellow-500 p-2 text-center text-xs font-bold text-black">
      TEMPORADA {TEMPORADA} DE PRUEBA: datos reales de ese año, no de la temporada actual
    </div>
  );
}

export function FilaPartido({ m, id }) {
  const r = resultado2(m, id);
  return (
    <tr className="border-t border-slate-200">
      <td className="p-3 text-slate-500">{fmtFecha(m.fecha)}</td>
      <td className={`p-3 ${m.local.id === id ? "font-bold" : ""}`}>{linkEq(m.local)}</td>
      <td className="p-3 font-bold text-amber-700">{m.goles.local}-{m.goles.visitante}</td>
      <td className={`p-3 ${m.visitante.id === id ? "font-bold" : ""}`}>{linkEq(m.visitante)}</td>
      <td className="p-3"><span className={`rounded px-2 py-0.5 text-xs font-bold ${col[r]}`}>{r}</span></td>
    </tr>
  );
}

function linkEq(t) {
  const e = porId(t.id);
  if (!e || !e.slug) return t.nombre;
  return <a href={`/equipo/${e.slug}`} className="hover:text-amber-700">{t.nombre}</a>;
}

function resultado2(m, id) {
  const loc = m.local.id === id;
  const a = loc ? m.goles.local : m.goles.visitante;
  const b = loc ? m.goles.visitante : m.goles.local;
  return a > b ? "G" : a === b ? "E" : "P";
}
