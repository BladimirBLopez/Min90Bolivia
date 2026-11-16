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
      <p className="mb-4 text-sm text-slate-600">Para una apuesta o una combinada: escribe las cuotas separadas por espacio.</p>
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <label className="text-sm">Monto (Bs)
          <input value={monto} onChange={(e) => setMonto(e.target.value)} inputMode="decimal" placeholder="50"
            className="mt-1 w-full rounded-lg bg-white p-3 text-slate-900 outline-none ring-1 ring-slate-200 focus:ring-amber-500" />
        </label>
        <label className="text-sm">Cuotas
          <input value={cuotas} onChange={(e) => setCuotas(e.target.value)} inputMode="decimal" placeholder="1.85 2.10 1.60"
            className="mt-1 w-full rounded-lg bg-white p-3 text-slate-900 outline-none ring-1 ring-slate-200 focus:ring-amber-500" />
        </label>
        <div className="rounded-xl bg-white p-3 text-center">
          <p className="text-xs text-slate-500">Cuota total</p>
          <p className="text-xl font-bold text-amber-700">{total ? total.toFixed(2) : "—"}</p>
        </div>
        <div className="rounded-xl bg-white p-3 text-center">
          <p className="text-xs text-slate-500">Pago posible (Bs)</p>
          <p className="text-xl font-bold text-amber-700">{ok ? (m * total).toFixed(2) : "—"}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">Es solo un cálculo. No garantiza ganar.</p>
    </section>
  );
}
