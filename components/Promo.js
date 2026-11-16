import WhatsAppButton from "@/components/WhatsAppButton";
import { CANAL, promos } from "@/app/data/promo";
import { EJEMPLO } from "@/app/data/pronosticos";

export default function Promo() {
  return (
    <section id="promos" className="mx-auto max-w-5xl px-5 py-10">
      <div className="rounded-3xl border border-oro-500/50 bg-gradient-to-br from-oro-50 to-white p-6">
        <h2 className="text-2xl font-bold titulo-oro">Promos y canal de WhatsApp</h2>
        <p className="mt-1 text-sm text-slate-700">
          Recibe el pronóstico del día antes de los partidos y las promos para quienes cargan conmigo.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {promos.map((p) => (
            <div key={p.t} className="rounded-2xl bg-white/70 p-4">
              <h3 className="font-semibold text-oro-700">{p.t}</h3>
              <p className="mt-1 text-sm text-slate-700">{p.d}</p>
            </div>
          ))}
        </div>
        {EJEMPLO && <p className="mt-3 text-xs text-yellow-700">Textos de ejemplo.</p>}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton>Quiero cargar</WhatsAppButton>
          {CANAL && (
            <a href={CANAL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-oro-500 px-6 py-3 font-bold text-oro-700 hover:bg-oro-500/10">
              Unirme al canal
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
