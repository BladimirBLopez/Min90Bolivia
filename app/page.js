import Link from "next/link";
import Navbar from "@/components/Navbar";
import Calculadora from "@/components/Calculadora";
import Promo from "@/components/Promo";
import Partidos from "@/components/Partidos";
import TablaInicio from "@/components/TablaInicio";
import WhatsAppButton from "@/components/WhatsAppButton";
import { EJEMPLO, historial, faq } from "@/app/data/pronosticos";

export const revalidate = 60;

const pasos = [
  { n: "1", t: "Escríbenos por WhatsApp", d: "Dinos cuánto quieres cargar." },
  { n: "2", t: "Paga por QR", d: "Te mandamos el QR. Pagas y nos envías el comprobante." },
  { n: "3", t: "Recibe tu saldo", d: "Cargamos tu cuenta y te avisamos. Ya puedes jugar." },
];
const porque = [
  EJEMPLO ? "Partidos y estadísticas todos los días" : "Pronósticos todos los días",
  EJEMPLO ? "Tendencias de Bolivia, Brasil y Nations League" : "Historial público de aciertos y fallos",
  "Atención las 24 horas por WhatsApp",
  "Recargas al instante",
];

export default function Home() {
  const acertados = historial.filter((h) => h.estado === "Acertado").length;
  const total = historial.length;
  const pct = total ? Math.round((acertados / total) * 100) + "%" : "—";

  return (
    <main className="min-h-screen bg-crema text-slate-900">
      <Navbar />
      

      <section id="inicio" className="bg-gradient-to-b from-[#1c1500] to-[#0b0b0b] text-white">
      <div className="mx-auto max-w-5xl px-5 pb-12 pt-14 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-oro-300">Bolivia · Brasil · Nations League</p>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          {EJEMPLO ? "Partidos, estadísticas y tendencias de fútbol, todos los días" : "Pronósticos de fútbol, todos los días"}
        </h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-oro-400" />
        <p className="mx-auto mt-4 max-w-xl text-slate-200">
          Estadísticas y tendencias de la liga boliviana, la liga de Brasil y la UEFA Nations League. Si quieres jugar, te cargo Metabet por WhatsApp al instante.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#pronosticos" className="rounded-full border border-oro-400 px-6 py-3 font-bold text-oro-300 hover:bg-white/10">
            Ver partidos de hoy
          </a>
          <WhatsAppButton>Recargar ahora</WhatsAppButton>
        </div>
        <p className="mt-4 text-xs text-oro-300">Pago por QR · Atención 24 horas · Recargas al instante</p>
        {!EJEMPLO && (
          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-white/10 p-3"><p className="text-2xl font-bold text-green-400">{acertados}</p><p className="text-xs text-slate-300">Acertados</p></div>
          <div className="rounded-xl bg-white/10 p-3"><p className="text-2xl font-bold">{total}</p><p className="text-xs text-slate-300">Registrados</p></div>
          <div className="rounded-xl bg-white/10 p-3"><p className="text-2xl font-bold text-oro-300">{pct}</p><p className="text-xs text-slate-300">Efectividad</p></div>
        </div>
        )}
      </div>
      </section>

      <Partidos />

      <section className="mx-auto max-w-5xl px-5 pb-4">
        <div className="rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-5 text-center text-white shadow-md">
          <p className="text-lg font-extrabold">¿Quieres jugar un partido?</p>
          <p className="mt-1 text-sm text-green-50">Recarga Metabet por WhatsApp · Pago por QR · Atención 24 horas</p>
          <div className="mt-3"><WhatsAppButton className="!bg-white !text-green-800 hover:!bg-green-50">Recargar ahora</WhatsAppButton></div>
        </div>
      </section>

      <Promo />

      <section id="resultados" className={`mx-auto max-w-5xl px-5 py-10${EJEMPLO ? " hidden" : ""}`}>
        <h2 className="mb-1 text-2xl font-bold titulo-oro">Transparencia total</h2>
        <p className="mb-4 text-sm text-slate-600">Aquí queda registrado cada pronóstico y si acertó o no. Sin borrar los fallos.</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-white text-slate-600">
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
        <h2 className="mb-4 text-2xl font-bold titulo-oro">Cómo cargar</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {pasos.map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-oro-500 font-bold text-white">{s.n}</span>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
        <h2 className="mb-4 mt-10 text-2xl font-bold titulo-oro">Por qué Min90</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {porque.map((x) => (
            <li key={x} className="rounded-xl bg-white p-3 text-sm"><span className="mr-2 text-oro-700">✔</span>{x}</li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-slate-600">¿Primera vez? Nosotros te creamos la cuenta de Metabet. ¿Ya tienes una? Escríbenos tu usuario y el monto.</p>
        <div className="mt-6 text-center">
          <WhatsAppButton>Quiero cargar ahora</WhatsAppButton>
          <Link href="/recarga-ahora" className="mt-4 block text-sm font-semibold text-oro-700 underline">Ver cómo funciona</Link>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-5 py-10">
        <h2 className="mb-4 text-2xl font-bold titulo-oro">Preguntas frecuentes</h2>
        <div className="space-y-2">
          {faq.map((f) => (
            <details key={f.q} className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-sm text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="bg-[#14100a] px-5 pb-28 pt-10 text-center text-xs text-slate-400">
        <p>Solo +18. Juega con responsabilidad.</p>
        <p className="mt-1">Las estadísticas y los pronósticos son informativos y no garantizan resultados.</p>
        <p className="mt-3">© Min90 Bolivia</p>
      </footer>


    </main>
  );
}
