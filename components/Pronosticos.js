"use client";
import { useState } from "react";
import PickCard from "@/components/PickCard";

const mercados = ["Todos", "1X2", "Más/Menos 2.5", "Ambos marcan", "Doble oportunidad", "Hándicap"];
const tabs = [["hoy", "Hoy"], ["manana", "Mañana"], ["terminados", "Terminados"]];

export default function Pronosticos({ estrella, lista }) {
  const [mercado, setMercado] = useState("Todos");
  const [tab, setTab] = useState("hoy");

  const filtrados = lista.filter((p) => {
    const okTab = tab === "terminados" ? p.estado !== "Pendiente" : p.estado === "Pendiente" && p.dia === tab;
    const okMercado = mercado === "Todos" || p.mercado === mercado;
    return okTab && okMercado;
  });

  return (
    <section id="pronosticos" className="mx-auto max-w-5xl px-5 py-10">
      <h2 className="mb-1 text-2xl font-bold">Pronóstico estrella del día</h2>
      <p className="mb-4 text-sm text-slate-600">Nuestra mejor opción de la jornada.</p>
      <PickCard p={estrella} grande />

      <h2 className="mb-4 mt-10 text-2xl font-bold">Pronósticos</h2>
      <div className="mb-3 flex gap-2">
        {tabs.map(([k, t]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === k ? "bg-amber-400 text-black" : "bg-slate-50 text-slate-700"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {mercados.map((m) => (
          <button key={m} onClick={() => setMercado(m)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs ${mercado === m ? "border-amber-500 text-amber-700" : "border-slate-200 text-slate-600"}`}>
            {m}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {filtrados.map((p, i) => <PickCard key={i} p={p} />)}
      </div>
      {filtrados.length === 0 && (
        <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
          No hay pronósticos en esta categoría todavía.
        </p>
      )}
    </section>
  );
}
