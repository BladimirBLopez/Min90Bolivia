import Navbar from "@/components/Navbar";
import Calculadora from "@/components/Calculadora";
import Promo from "@/components/Promo";
import Partidos from "@/components/Partidos";
import TablaInicio from "@/components/TablaInicio";
import WhatsAppButton from "@/components/WhatsAppButton";
import { EJEMPLO, historial, faq } from "@/app/data/pronosticos";

const pasos = [
  { n: "1", t: "Escríbeme", d: "Toca el botón y salúdame por WhatsApp." },
  { n: "2", t: "Haz tu pago", d: "Te paso los datos para pagar." },
  { n: "3", t: "Recibe tu carga", d: "Te cargo y listo para jugar." },
];
const porque = [
  "Pronósticos todos los días",
  "Historial público de aciertos y fallos",
  "Atención directa por WhatsApp",
  "Carga rápida",
];

export default function Home() {
  const acertados = historial.filter((h) => h.estado === "Acertado").length;
  const total = historial.length;
  const pct = total ? Math.round((acertados / total) * 100) + "%" : "—";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      {EJEMPLO && <div className="bg-yellow-500 p-2 text-center text-xs font-bold text-black">DATOS DE EJEMPLO: solo para ver el diseño</div>}

      <section id="inicio" className="mx-auto max-w-5xl px-5 pb-12 pt-14 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-700">Fútbol boliviano</p>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          Pronósticos del fútbol boliviano, todos los días
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-700">
          Análisis de la División Profesional y más. Y si quieres jugar, te cargo por WhatsApp en minutos.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#pronosticos" className="rounded-full border border-amber-500 px-6 py-3 font-bold text-amber-700 hover:bg-amber-500/10">
            Ver partidos y pronósticos
          </a>
          <WhatsAppButton>Escríbeme por WhatsApp</WhatsAppButton>
        </div>
        {!EJEMPLO && (
          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-slate-50 p-3"><p className="text-2xl font-bold text-green-700">{acertados}</p><p className="text-xs text-slate-600">Acertados</p></div>
          <div className="rounded-xl bg-slate-50 p-3"><p className="text-2xl font-bold">{total}</p><p className="text-xs text-slate-600">Registrados</p></div>
          <div className="rounded-xl bg-slate-50 p-3"><p className="text-2xl font-bold text-amber-700">{pct}</p><p className="text-xs text-slate-600">Efectividad</p></div>
        </div>
        )}
      </section>

      <Partidos />


      <Promo />

      <section id="resultados" className="mx-auto max-w-5xl px-5 py-10">
        <h2 className="mb-1 text-2xl font-bold">Transparencia total</h2>
        <p className="mb-4 text-sm text-slate-600">Aquí queda registrado cada pronóstico y si acertó o no. Sin borrar los fallos.</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr><th className="p-3">Fecha</th><th className="p-3">Partido</th><th className="p-3">Pronóstico</th><th className="p-3">Resultado</th><th className="p-3">Estado</th></tr>
            </thead>
            <tbody>
              {(EJEMPLO || historial.length === 0) && (
                <tr><td colSpan={5} className="p-4 text-center text-slate-500">Aún sin registros. Aquí aparecerán los resultados.</td></tr>
              )}
              {(EJEMPLO ? [] : historial).map((h, i) => (
                <tr key={i} className="border-t border-slate-200">
                  <td className="p-3">{h.fecha}</td><td className="p-3">{h.partido}</td><td className="p-3">{h.pick}</td><td className="p-3">{h.resultado}</td>
                  <td className={`p-3 font-semibold ${h.estado === "Acertado" ? "text-green-700" : "text-red-600"}`}>{h.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <TablaInicio />

      <Calculadora />

      <section id="cargar" className="mx-auto max-w-5xl px-5 py-10">
        <h2 className="mb-4 text-2xl font-bold">Cómo cargar</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {pasos.map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 font-bold text-black">{s.n}</span>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
        <h2 className="mb-4 mt-10 text-2xl font-bold">Por qué Min90</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {porque.map((x) => (
            <li key={x} className="rounded-xl bg-slate-50 p-3 text-sm"><span className="mr-2 text-amber-700">✔</span>{x}</li>
          ))}
        </ul>
        <div className="mt-8 text-center"><WhatsAppButton>Quiero cargar ahora</WhatsAppButton></div>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-5 py-10">
        <h2 className="mb-4 text-2xl font-bold">Preguntas frecuentes</h2>
        <div className="space-y-2">
          {faq.map((f) => (
            <details key={f.q} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-sm text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-5 pb-28 pt-10 text-center text-xs text-slate-500">
        <p>Solo +18. Juega con responsabilidad.</p>
        <p className="mt-1">Los pronósticos son opiniones y no garantizan resultados.</p>
        <p className="mt-3">© Min90 Bolivia</p>
      </footer>

      <WhatsAppButton className="fixed bottom-4 right-4 z-50 shadow-lg shadow-slate-400/50">WhatsApp</WhatsAppButton>
    </main>
  );
}
