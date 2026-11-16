import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";

const GRUPO = "https://chat.whatsapp.com/CB3GeNfmOqe31XQGjjDVwN?s=cl&p=a&iam=2";

export default function CtaRecarga({ texto = "Hola, quiero jugar en Metabet y cargar saldo. Soy mayor de 18 años." }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-6">
      <div className="rounded-3xl border border-oro-500/50 bg-gradient-to-br from-oro-50 to-white p-6 text-center">
        <h2 className="text-xl font-extrabold">¿Quieres jugar?</h2>
        <p className="mt-2 text-sm text-slate-700">
          Recarga tu saldo en Metabet pagando por QR y recibe los pronósticos gratis en nuestro grupo de WhatsApp.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <WhatsAppButton texto={texto}>Crear mi cuenta por WhatsApp</WhatsAppButton>
          <a
            href={GRUPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-oro-500 px-6 py-3 font-bold text-oro-700 hover:bg-oro-500/10"
          >
            Picks gratis en el grupo
          </a>
        </div>
        <Link href="/recargar" className="mt-4 inline-block text-sm text-slate-600 underline">
          Ver cómo recargar paso a paso
        </Link>
      </div>
    </section>
  );
}
