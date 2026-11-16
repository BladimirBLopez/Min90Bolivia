"use client";
import { useEffect, useState } from "react";

const dos = (n) => String(n).padStart(2, "0");

export default function Cuenta({ inicio }) {
  const [ahora, setAhora] = useState(null);
  useEffect(() => {
    setAhora(Date.now());
    const t = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!inicio || ahora === null) return null;
  const falta = new Date(inicio).getTime() - ahora;
  if (Number.isNaN(falta) || falta <= 0) return null;
  const d = Math.floor(falta / 86400000);
  const h = Math.floor((falta % 86400000) / 3600000);
  const mi = Math.floor((falta % 3600000) / 60000);
  const s = Math.floor((falta % 60000) / 1000);
  const cajas = [...(d > 0 ? [[String(d), "días"]] : []), [dos(h), "h"], [dos(mi), "min"], [dos(s), "seg"]];
  return (
    <div className="mt-4 text-center">
      <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Empieza en</p>
      <div className="flex justify-center gap-2">
        {cajas.map(([v, l]) => (
          <div key={l} className="min-w-[52px] rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
            <p className="text-xl font-black leading-none text-slate-900">{v}</p>
            <p className="mt-1 text-[10px] uppercase text-slate-500">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
