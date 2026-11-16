"use client";

import { createContext, useContext, useEffect, useState } from "react";

const Contexto = createContext(null);

export function ProveedorPartidoEnVivo({ habilitado, idLocal, inicio, children }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(habilitado);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!habilitado) return;
    let activo = true;
    let consultando = false;

    async function actualizar() {
      if (consultando) return;
      consultando = true;
      try {
        const respuesta = await fetch(
          `/api/en-vivo/detalle?id=${encodeURIComponent(idLocal)}`,
          { cache: "no-store" }
        );
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const nuevo = await respuesta.json();
        if (String(nuevo.idLocal) !== String(idLocal)) {
          throw new Error("Identificador no coincide");
        }
        if (activo) {
          setDatos(nuevo);
          setError(false);
        }
      } catch {
        if (activo) {
          setDatos(null);
          setError(true);
        }
      } finally {
        consultando = false;
        if (activo) setCargando(false);
      }
    }

    actualizar();
    const fecha = Date.parse(/Z$|[+-]\d\d:\d\d$/.test(inicio || "") ? inicio : `${inicio}Z`);
    const cercaDelPartido = () => Number.isFinite(fecha) &&
      Date.now() >= fecha - 3 * 3600000 &&
      Date.now() <= fecha + 7 * 3600000;
    const reloj = setInterval(() => {
      if (!document.hidden && cercaDelPartido()) actualizar();
    }, 60000);
    const visible = () => {
      if (!document.hidden && cercaDelPartido()) actualizar();
    };
    document.addEventListener("visibilitychange", visible);

    return () => {
      activo = false;
      clearInterval(reloj);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [habilitado, idLocal, inicio]);

  return (
    <Contexto.Provider value={{ datos, cargando, error }}>
      {children}
    </Contexto.Provider>
  );
}

export function MarcadorPartidoEnVivo({ marcadorInicial }) {
  const { datos, error } = useContext(Contexto);
  const fase = datos?.fase;
  const esDescanso = datos?.estado === "STATUS_HALFTIME" || datos?.estadoTexto === "HT";
  const valido = Number.isFinite(datos?.goles?.local) && Number.isFinite(datos?.goles?.visitante);
  const goles = valido && fase !== "pre" ? datos.goles : marcadorInicial;

  let etiqueta = "";
  if (fase === "in") etiqueta = esDescanso ? "DESCANSO · HT" : `EN VIVO${datos.minuto ? ` · ${datos.minuto}` : ""}`;
  else if (fase === "post") etiqueta = "FINAL";

  return (
    <div className="flex min-w-[70px] shrink-0 flex-col items-center gap-1 text-center" aria-live="polite">
      {etiqueta && (
        <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${fase === "in" ? (esDescanso ? "bg-amber-100 text-amber-800" : "bg-red-600 text-white") : "bg-slate-100 text-slate-700"}`}>
          {fase === "in" && !esDescanso ? "🔴 " : ""}{etiqueta}
        </span>
      )}
      {goles && Number.isFinite(goles.local) && Number.isFinite(goles.visitante) ? (
        <span className="whitespace-nowrap text-3xl font-black text-oro-700">{goles.local} - {goles.visitante}</span>
      ) : (
        <span className="text-sm font-bold text-slate-500">vs</span>
      )}
      {error && <span className="text-[10px] text-slate-500">Sin datos actuales</span>}
    </div>
  );
}

const caja = "rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-4 shadow-sm";

export function DetallesPartidoEnVivo() {
  const { datos, cargando, error } = useContext(Contexto);
  const estadisticas = datos?.estadisticas || [];
  const eventos = datos?.eventos || [];
  const alineaciones = datos?.alineaciones || [];

  return (
    <div id="en-vivo" className="mt-8 scroll-mt-4">
      <h2 className="mb-3 text-xl font-extrabold">Detalles y estadísticas del partido</h2>
      {cargando ? (
        <p className={`${caja} text-sm text-slate-500`}>Consultando información del partido…</p>
      ) : error ? (
        <p className={`${caja} text-sm text-slate-600`}>Los datos en vivo no están disponibles en este momento. Puedes consultar la información histórica de Min90 más abajo.</p>
      ) : !datos ? (
        <p className={`${caja} text-sm text-slate-600`}>Sin información adicional disponible.</p>
      ) : (
        <div className="space-y-4">
          <div className={caja}>
            <h3 className="mb-3 font-extrabold">Estadísticas {datos.fase === "in" ? "en vivo" : "del encuentro"}</h3>
            {estadisticas.length ? (
              <div className="space-y-4">
                {estadisticas.map((s) => {
                  const a = Number(s.local);
                  const b = Number(s.visitante);
                  const ancho = Number.isFinite(a) && Number.isFinite(b) && a + b > 0
                    ? Math.max(0, Math.min(100, 100 * a / (a + b))) : 50;
                  const valor = (n) => n === null || n === undefined
                    ? "—" : s.unidad && !String(n).endsWith(s.unidad) ? `${n}${s.unidad}` : String(n);
                  return (
                    <div key={s.clave}>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <b className="min-w-[50px]">{valor(s.local)}</b>
                        <span className="text-center text-slate-600">{s.titulo}</span>
                        <b className="min-w-[50px] text-right">{valor(s.visitante)}</b>
                      </div>
                      <div className="mt-1 flex h-2 overflow-hidden rounded bg-slate-200">
                        <div className="bg-oro-500" style={{ width: `${ancho}%` }} />
                        <div className="bg-slate-400" style={{ width: `${100 - ancho}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-sm text-slate-500">Estadísticas no disponibles todavía.</p>}
          </div>

          <div className={caja}>
            <h3 className="mb-3 font-extrabold">Cronología: goles, tarjetas y cambios</h3>
            {eventos.length ? (
              <ol className="divide-y divide-slate-100">
                {eventos.map((e, i) => (
                  <li key={`${e.id}-${i}`} className="flex gap-3 py-2 text-sm">
                    <span className="w-14 shrink-0 font-bold text-oro-700">{e.minuto || "—"}</span>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold">{e.tipo}</span>
                      {e.equipo && <span className="text-slate-500"> · {e.equipo}</span>}
                      {e.jugadores.length > 0 && <p className="text-slate-600">{e.jugadores.join(" · ")}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            ) : <p className="text-sm text-slate-500">Sin incidencias registradas por la fuente.</p>}
          </div>

          <div className={caja}>
            <h3 className="mb-3 font-extrabold">Alineaciones</h3>
            {alineaciones.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {alineaciones.map((t) => (
                  <div key={t.equipo}>
                    <h4 className="mb-2 font-bold">{t.equipo} {t.formacion && <span className="font-normal text-slate-500">({t.formacion})</span>}</h4>
                    {t.titulares.length > 0 ? (
                      <ul className="space-y-1 text-xs">
                        {t.titulares.map((p, i) => (
                          <li key={`${p.dorsal}-${p.nombre}-${i}`} className="flex gap-2 border-b border-slate-100 py-1">
                            <span className="w-6 shrink-0 text-slate-500">{p.dorsal || "—"}</span>
                            <span className="flex-1">{p.nombre}</span>
                            <span className="text-slate-500">{p.posicion}</span>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-xs text-slate-500">Titulares no confirmados.</p>}
                    {t.suplentes.length > 0 && (
                      <details className="mt-2 text-xs">
                        <summary className="cursor-pointer font-semibold text-oro-700">Ver suplentes ({t.suplentes.length})</summary>
                        <ul className="mt-2 space-y-1">
                          {t.suplentes.map((p, i) => (
                            <li key={`${p.dorsal}-${p.nombre}-${i}`} className="flex gap-2 py-1">
                              <span className="w-6 shrink-0 text-slate-500">{p.dorsal || "—"}</span>
                              <span className="flex-1">{p.nombre}</span>
                              <span className="text-slate-500">{p.posicion}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-slate-500">Alineaciones no disponibles todavía.</p>}
          </div>
          <p className="text-xs text-slate-500">Fuente: ESPN. Los datos dependen de su cobertura y pueden tener retraso. No son pronósticos.</p>
        </div>
      )}
    </div>
  );
}
