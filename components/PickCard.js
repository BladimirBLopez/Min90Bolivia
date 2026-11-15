import ShareButton from "@/components/ShareButton";
const colores = {
  Pendiente: "bg-yellow-500/15 text-yellow-400",
  Acertado: "bg-green-500/15 text-green-400",
  Fallado: "bg-red-500/15 text-red-400",
};

export default function PickCard({ p, grande = false }) {
  const estrellas = "★".repeat(p.confianza) + "☆".repeat(3 - p.confianza);
  return (
    <article className={`rounded-2xl border p-4 ${grande ? "border-green-500/60 bg-green-950/30" : "border-slate-800 bg-slate-900"}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-green-400">{p.liga}</p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colores[p.estado]}`}>{p.estado}</span>
      </div>
      <h3 className={`mt-2 font-bold ${grande ? "text-2xl" : "text-lg"}`}>{p.partido}</h3>
      <p className="text-sm text-slate-400">{p.fecha} (hora Bolivia)</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div><p className="text-slate-500">Pronóstico</p><p className="font-semibold text-green-400">{p.pick}</p></div>
        <div><p className="text-slate-500">Cuota</p><p className="font-semibold">{p.cuota}</p></div>
        <div><p className="text-slate-500">Confianza</p><p className="text-yellow-400">{estrellas}</p></div>
      </div>
      <p className="mt-3 text-sm text-slate-300">{p.analisis}</p>
      <div className="flex flex-wrap items-center gap-3">
        <ShareButton texto={`Pronóstico Min90: ${p.partido} - ${p.pick} (cuota ${p.cuota})`} />
        {p.href && (<a href={p.href} className="mt-3 text-xs font-semibold text-green-400 underline">Ver estadísticas →</a>)}
      </div>
    </article>
  );
}
