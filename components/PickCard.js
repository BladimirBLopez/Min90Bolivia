import ShareButton from "@/components/ShareButton";
const colores = {
  Pendiente: "bg-yellow-500/15 text-yellow-700",
  Acertado: "bg-green-500/15 text-green-700",
  Fallado: "bg-red-500/15 text-red-600",
};

export default function PickCard({ p, grande = false }) {
  const estrellas = "★".repeat(p.confianza) + "☆".repeat(3 - p.confianza);
  return (
    <article className={`rounded-2xl border p-4 ${grande ? "border-oro-500/60 bg-oro-50" : "border-slate-200 bg-slate-50"}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-oro-700">{p.liga}</p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colores[p.estado]}`}>{p.estado}</span>
      </div>
      <h3 className={`mt-2 font-bold ${grande ? "text-2xl" : "text-lg"}`}>{p.partido}</h3>
      <p className="text-sm text-slate-600">{p.fecha} (hora Bolivia)</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div><p className="text-slate-500">Pronóstico</p><p className="font-semibold text-oro-700">{p.pick}</p></div>
        <div><p className="text-slate-500">Cuota</p><p className="font-semibold">{p.cuota}</p></div>
        <div><p className="text-slate-500">Confianza</p><p className="text-yellow-700">{estrellas}</p></div>
      </div>
      <p className="mt-3 text-sm text-slate-700">{p.analisis}</p>
      <div className="flex flex-wrap items-center gap-3">
        <ShareButton texto={`Pronóstico Min90: ${p.partido} - ${p.pick} (cuota ${p.cuota})`} />
        {p.href && (<a href={p.href} className="mt-3 text-xs font-semibold text-oro-700 underline">Ver estadísticas →</a>)}
      </div>
    </article>
  );
}
