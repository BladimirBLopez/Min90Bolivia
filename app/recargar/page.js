import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Cómo recargar en Metabet desde Bolivia | Min90 Bolivia",
  description: "Recarga tu saldo en Metabet pagando por QR. Te guiamos paso a paso por WhatsApp.",
  openGraph: {
    title: "Cómo recargar en Metabet desde Bolivia | Min90 Bolivia",
    description: "Recarga tu saldo en Metabet pagando por QR. Te guiamos paso a paso por WhatsApp.",
    type: "website",
  },
};

const NUMERO = "59169356292";
const GRUPO = "https://chat.whatsapp.com/CB3GeNfmOqe31XQGjjDVwN?s=cl&p=a&iam=2";
const METABET = "https://metabet.tv/es/";
const MENSAJE = "Hola, quiero jugar en Metabet y cargar saldo. Soy mayor de 18 años.";
const WA = `https://wa.me/${NUMERO}?text=${encodeURIComponent(MENSAJE)}`;

const pasos = [
  { t: "Escríbenos por WhatsApp", d: "Dinos que quieres jugar y cuánto quieres cargar. Debes ser mayor de 18 años." },
  { t: "Te creamos tu cuenta en Metabet", d: "Nosotros la creamos y te enviamos tu usuario y contraseña por WhatsApp." },
  { t: "Paga por QR", d: "Te enviamos el QR y pagas desde la app de tu banco." },
  { t: "Envía tu comprobante", d: "Mándanos la captura del pago por el mismo chat." },
  { t: "Recibe tu saldo y juega", d: "Cargamos el saldo en tu cuenta y te avisamos. Ya puedes apostar." },
];

export default function Recargar() {
  return (
    <>
    <Navbar />
    <main className="mx-auto max-w-2xl px-4 py-10 text-slate-900">
      <Link href="/" className="text-sm text-oro-700">← Volver a Min90 Bolivia</Link>
      <h1 className="mt-4 text-3xl font-extrabold">Cómo recargar en Metabet desde Bolivia</h1>
      <p className="mt-3 text-slate-700">
        Recarga tu saldo con nosotros pagando por <strong>QR</strong>. Te acompañamos paso a paso por WhatsApp.
      </p>

      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 block rounded-full bg-green-500 px-6 py-4 text-center text-lg font-bold text-black"
      >
        Crear mi cuenta por WhatsApp
      </a>

      <h2 className="mt-10 text-2xl font-bold titulo-oro">Paso a paso</h2>
      <ol className="mt-4 space-y-4">
        {pasos.map((p, i) => (
          <li key={i} className="flex gap-4 rounded-xl bg-slate-100 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500 font-bold text-black">{i + 1}</span>
            <div>
              <p className="font-semibold">{p.t}</p>
              <p className="text-sm text-slate-700">{p.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-slate-700">¿Ya tienes cuenta en Metabet? Escríbenos tu usuario y el monto, y te cargamos saldo directo.</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href={METABET} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full border border-oro-500 px-6 py-3 text-center font-semibold text-oro-700">
          Ir a Metabet
        </a>
        <a href={GRUPO} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full border border-slate-500 px-6 py-3 text-center font-semibold text-slate-700">
          Unirme al grupo de WhatsApp
        </a>
      </div>

      <p className="mt-10 text-xs text-slate-600">
        +18. Juega con responsabilidad. Los pronósticos no garantizan resultados y apostar implica riesgo de perder dinero.
      </p>
    </main>
    </>
  );
}
