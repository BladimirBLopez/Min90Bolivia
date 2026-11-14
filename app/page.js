import WhatsAppButton from "@/components/WhatsAppButton";
import { pronosticos } from "@/app/data/pronosticos";

const pasos = [
  { n: "1", t: "Escríbeme", d: "Toca el botón y salúdame por WhatsApp." },
  { n: "2", t: "Haz tu pago", d: "Te paso los datos para pagar." },
  { n: "3", t: "Recibe tu carga", d: "Te cargo y listo para jugar." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto max-w-3xl px-5 pb-12 pt-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
          Fútbol boliviano
        </p>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          Min<span className="text-green-500">90</span> Bolivia
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-300">
          Pronósticos del fútbol boliviano todos los días. Escríbeme y te
          ayudo a cargar tu cuenta rápido.
        </p>
        <WhatsAppButton className="mt-8 text-lg" />
      </section>

      <section className="mx-auto max-w-3xl px-5 py-10">
        <h2 className="mb-6 text-2xl font-bold">Pronósticos de hoy</h2>
        <div className="space-y-3">
          {pronosticos.map((p, i) => (
            <article key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
              <p className="text-xs uppercase tracking-wide text-green-400">{p.liga}</p>
              <h3 className="mt-1 text-lg font-semibold">{p.partido}</h3>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div><p className="text-neutral-500">Hora</p><p>{p.hora}</p></div>
                <div><p className="text-neutral-500">Pronóstico</p><p className="font-semibold text-green-400">{p.pick}</p></div>
                <div><p className="text-neutral-500">Cuota</p><p>{p.cuota}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-10">
        <h2 className="mb-6 text-2xl font-bold">Cómo cargar</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {pasos.map((s) => (
            <div key={s.n} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 font-bold text-black">{s.n}</span>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-neutral-400">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <WhatsAppButton>Quiero cargar ahora</WhatsAppButton>
        </div>
      </section>

      <footer className="mx-auto max-w-3xl px-5 pb-28 pt-10 text-center text-xs text-neutral-500">
        <p>Solo mayores de 18 años. Juega con responsabilidad.</p>
        <p className="mt-1">Los pronósticos son opiniones y no garantizan resultados.</p>
        <p className="mt-3">© Min90 Bolivia</p>
      </footer>

      <WhatsAppButton className="fixed bottom-4 right-4 z-50 shadow-lg shadow-black/50">
        WhatsApp
      </WhatsAppButton>
    </main>
  );
}
