"use client";
import { useState } from "react";

export default function Calculadora() {
  const [monto, setMonto] = useState("");
  const [cuotas, setCuotas] = useState("");

  const m = parseFloat(String(monto).replace(",", "."));
  const lista = cuotas.replace(/,/g, ".").split(/\s+/).map(parseFloat).filter((n) => n > 1);
  const total = lista.length ? lista.reduce((a, b) => a * b, 1) : 0;
  const ok = m > 0 && total > 0;

  return (
    <section id="calculadora" className="mx-auto max-w-5xl px-5 py-10">
      <h2 className="mb-1 text-2xl font-bold">Calculadora de ganancia</h2>
      <p className="mb-4 text-sm text-neutral-400">Para una apuesta o una combinada: escribe las cuotas separadas por espacio.</p>
      <div className="grid gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:grid-cols-2">
        <label className="text-sm">Monto (Bs)
          <input value={monto} onChange={(e) => setMonto(e.target.value)} inputMode="decimal" placeholder="50"
            className="mt-1 w-full rounded-lg bg-neutral-950 p-3 text-white outline-none ring-1 ring-neutral-800 focus:ring-green-500" />
        </label>
        <label className="text-sm">Cuotas
          <input value={cuotas} onChange={(e) => setCuotas(e.target.value)} inputMode="decimal" placeholder="1.85 2.10 1.60"
            className="mt-1 w-full rounded-lg bg-neutral-950 p-3 text-white outline-none ring-1 ring-neutral-800 focus:ring-green-500" />
        </label>
        <div className="rounded-xl bg-neutral-950 p-3 text-center">
          <p className="text-xs text-neutral-500">Cuota total</p>
          <p className="text-xl font-bold text-green-400">{total ? total.toFixed(2) : "—"}</p>
        </div>
        <div className="rounded-xl bg-neutral-950 p-3 text-center">
          <p className="text-xs text-neutral-500">Pago posible (Bs)</p>
          <p className="text-xl font-bold text-green-400">{ok ? (m * total).toFixed(2) : "—"}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-neutral-500">Es solo un cálculo. No garantiza ganar.</p>
    </section>
  );
}
