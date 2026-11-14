import WhatsAppButton from "@/components/WhatsAppButton";
import { CANAL, promos } from "@/app/data/promo";
import { EJEMPLO } from "@/app/data/pronosticos";

export default function Promo() {
  return (
    <section id="promos" className="mx-auto max-w-5xl px-5 py-10">
      <div className="rounded-3xl border border-green-500/40 bg-gradient-to-br from-green-950/60 to-neutral-900 p-6">
        <h2 className="text-2xl font-bold">Promos y canal de WhatsApp</h2>
        <p className="mt-1 text-sm text-neutral-300">
          Recibe el pronóstico del día antes de los partidos y las promos para quienes cargan conmigo.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {promos.map((p) => (
            <div key={p.t} className="rounded-2xl bg-neutral-950/70 p-4">
              <h3 className="font-semibold text-green-400">{p.t}</h3>
              <p className="mt-1 text-sm text-neutral-300">{p.d}</p>
            </div>
          ))}
        </div>
        {EJEMPLO && <p className="mt-3 text-xs text-yellow-400">Textos de ejemplo.</p>}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton>Quiero cargar</WhatsAppButton>
          {CANAL && (
            <a href={CANAL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-green-500 px-6 py-3 font-bold text-green-400 hover:bg-green-500/10">
              Unirme al canal
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
