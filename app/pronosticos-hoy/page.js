import Link from "next/link";
import Navbar from "@/components/Navbar";
import CtaRecarga from "@/components/CtaRecarga";
import { GRUPO_WHATSAPP } from "@/app/data/links";
import { proximosTodos2026, equipos2026 } from "@/lib/liga2026";

export const metadata = {
  title: "Pronósticos y próximos partidos del fútbol boliviano | Min90 Bolivia",
  description: "Próximos partidos de la Primera División de Bolivia con estadísticas y forma de cada equipo. Los picks gratis los lanzamos en nuestro grupo de WhatsApp.",
};

const GRUPO = GRUPO_WHATSAPP;
const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, m, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[m - 1]}`;
};
const slugDe = (id) => equipos2026.find((x) => x.id === id)?.slug;

export default function PronosticosHoy() {
  const lista = proximosTodos2026(8);
  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-3xl font-extrabold">Próximos partidos y pronósticos</h1>
        <p className="mt-2 text-slate-700">
          Toca un partido para ver la forma, las estadísticas y el cara a cara de ambos equipos.
        </p>
        <a
          href={GRUPO}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 block rounded-full bg-green-500 px-6 py-4 text-center text-lg font-bold text-black"
        >
          Recibir los picks gratis en el grupo
        </a>

        <div className="mt-8 space-y-3">
          {lista.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 p-4 text-center text-slate-600">
              Pronto publicaremos los próximos partidos.
            </p>
          ) : null}
          {lista.map((m) => {
            const sl = slugDe(m.local.id);
            const sv = slugDe(m.visitante.id);
            const href = sl && sv ? `/partido/${sl}-vs-${sv}` : null;
            const cuerpo = (
              <>
                <p className="text-xs text-slate-500">
                  {fmt(m.fecha)}{m.hora ? ` · ${m.hora}` : ""} · Ronda {m.ronda}
                </p>
                <p className="mt-1 text-lg font-bold">{m.local.nombre} vs {m.visitante.nombre}</p>
                {m.estadio ? <p className="text-xs text-slate-500">{m.estadio}</p> : null}
                {href ? <p className="mt-2 text-sm font-semibold text-oro-700">Ver estadísticas del partido →</p> : null}
              </>
            );
            return href ? (
              <Link key={m.id} href={href} className="block rounded-2xl border border-slate-200 bg-white p-4 hover:border-oro-500">
                {cuerpo}
              </Link>
            ) : (
              <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4">{cuerpo}</div>
            );
          })}
        </div>
      </section>

      <CtaRecarga />

      <footer className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-center text-xs text-slate-500">
        <p>Solo +18. Juega con responsabilidad.</p>
        <p className="mt-1">Los pronósticos son opiniones y no garantizan resultados.</p>
      </footer>
    </main>
  );
}
