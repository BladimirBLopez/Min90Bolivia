"use client";
import { useEffect, useState } from "react";

export default function LigaTabs({ tabs }) {
  const [activa, setActiva] = useState(tabs[0].id);

  useEffect(() => {
    const leer = () => {
      const h = window.location.hash.replace("#", "");
      if (tabs.some((t) => t.id === h)) setActiva(h);
    };
    leer();
    window.addEventListener("hashchange", leer);
    return () => window.removeEventListener("hashchange", leer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const elegir = (id) => {
    setActiva(id);
    try {
      window.history.replaceState(null, "", "#" + id);
    } catch (e) {}
  };

  return (
    <div>
      <div role="tablist" aria-label="Secciones de la liga" className="flex border-b border-slate-300">
        {tabs.map((t) => {
          const on = t.id === activa;
          return (
            <button
              key={t.id}
              id={"tab-" + t.id}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={"panel-" + t.id}
              onClick={() => elegir(t.id)}
              className={
                "-mb-px flex-1 border-b-4 px-3 py-3 text-center text-sm font-bold transition sm:flex-none sm:px-6 " +
                (on ? "border-oro-500 text-oro-700" : "border-transparent text-slate-500 hover:text-slate-800")
              }
            >
              {t.titulo}
              {t.cuenta ? <span className="ml-1.5 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{t.cuenta}</span> : null}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div key={t.id} id={"panel-" + t.id} role="tabpanel" aria-labelledby={"tab-" + t.id} hidden={t.id !== activa} className="pt-6">
          {t.contenido}
        </div>
      ))}
    </div>
  );
}
