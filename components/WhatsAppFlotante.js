"use client";

import { useEffect, useRef, useState } from "react";
import { WHATSAPP } from "@/app/data/pronosticos";
import { GRUPO_WHATSAPP } from "@/app/data/links";

function LogoWhatsApp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="38"
      height="38"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.76-1.653-2.058-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.1-.198.05-.372-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.58-.487-.502-.669-.512-.173-.009-.372-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.875 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.365h-.004a9.876 9.876 0 0 1-5.031-1.378l-.361-.214-3.741.98.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26C2.17 6.39 6.594 1.965 12.056 1.965c2.634 0 5.11 1.027 6.971 2.889a9.8 9.8 0 0 1 2.888 6.972c-.003 5.462-4.428 9.887-9.864 9.887m8.384-18.263A11.817 11.817 0 0 0 12.056 0C5.495 0 .16 5.335.157 11.896a11.85 11.85 0 0 0 1.59 5.939L.057 24l6.299-1.652a11.86 11.86 0 0 0 5.693 1.451h.005c6.56 0 11.895-5.335 11.898-11.896a11.818 11.818 0 0 0-3.497-8.399z" />
    </svg>
  );
}

export default function WhatsAppFlotante() {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);

  const mensaje =
    "Hola, quiero apostar en Min90 Bolivia. " +
    "Soy mayor de 18 años. ¿Cómo puedo hacerlo?";

  const enlace = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

  useEffect(() => {
    if (!abierto) return undefined;

    const cerrarFuera = (evento) => {
      if (
        contenedor.current &&
        !contenedor.current.contains(evento.target)
      ) {
        setAbierto(false);
      }
    };

    const cerrarEscape = (evento) => {
      if (evento.key === "Escape") {
        setAbierto(false);
      }
    };

    document.addEventListener("pointerdown", cerrarFuera);
    document.addEventListener("keydown", cerrarEscape);

    return () => {
      document.removeEventListener("pointerdown", cerrarFuera);
      document.removeEventListener("keydown", cerrarEscape);
    };
  }, [abierto]);

  return (
    <div
      ref={contenedor}
      className="fixed right-4 z-[80] flex flex-col items-end gap-2"
      style={{
        bottom: "max(16px, env(safe-area-inset-bottom))",
      }}
    >
      {abierto && (
        <div
          id="modal-whatsapp-min90"
          role="dialog"
          aria-label="Opciones de WhatsApp"
          className="mb-2 w-[calc(100vw-2rem)] max-w-xs rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl"
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-extrabold">
              ¿Qué deseas hacer?
            </h2>

            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar opciones"
              className="rounded-full px-2 py-1 text-xl text-slate-500 hover:bg-slate-100"
            >
              ×
            </button>
          </div>

          <div className="space-y-2">
            <a
              href={enlace}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAbierto(false)}
              className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 font-bold text-green-900 transition hover:bg-green-100"
            >
              <span className="text-[#25D366]">
                <LogoWhatsApp />
              </span>
              <span>Quiero apostar</span>
            </a>

            <a
              href={GRUPO_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAbierto(false)}
              className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-800 transition hover:bg-slate-200"
            >
              <span aria-hidden="true" className="text-2xl">
                👥
              </span>
              <span>Unirme al grupo de WhatsApp</span>
            </a>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Solo mayores de 18 años. Apuesta con responsabilidad.
          </p>
        </div>
      )}

      <span
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-extrabold text-slate-900 shadow-lg"
      >
        ¿Quieres apostar?
      </span>

      <button
        type="button"
        onClick={() => setAbierto((valor) => !valor)}
        aria-expanded={abierto}
        aria-controls="modal-whatsapp-min90"
        aria-label="Abrir opciones de WhatsApp"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-900/30 transition hover:scale-105 hover:bg-[#20BD5A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
      >
        <LogoWhatsApp />
      </button>
    </div>
  );
}
