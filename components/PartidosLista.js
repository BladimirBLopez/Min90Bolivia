"use client";
import { useState, useEffect } from "react";
import { Chip } from "@/components/Ui";
import { waLinkDe } from "@/components/WhatsAppButton";
import { esPartidoFuturo } from "@/lib/fechaPartidos";

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => {
  const [y, m, d] = String(f).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} ${MESES[m - 1]}`;
};
const tabs = [["vivo", "🔴 En vivo"], ["proximos", "Próximos"], ["hoy", "Hoy"], ["manana", "Mañana"], ["terminados", "Terminados"]];
const ICONOS_VIVO = {
  "Amistosos Internacionales": "🌎",
  "Copa Libertadores": "🏆",
  "Copa Sudamericana": "🏆",
  "UEFA Champions League": "🏆",
  "Nations League": "🌍",
  "Bolivia": "🇧🇴",
  "Brasil": "🇧🇷",
};

const hoy = () => new Date(Date.now() - 4 * 3600 * 1000).toISOString().slice(0, 10);
const manana = () => new Date(Date.now() + 20 * 3600 * 1000).toISOString().slice(0, 10);

function Escudito({ t }) {
  if (!t.logo) {
    return <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">{t.nombre[0]}</span>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={t.logo} alt={t.nombre} width={56} height={56} loading="lazy" className="h-14 w-14 object-contain" />;
}

const esNations = (m) =>
  m.liga === "Nations League" ||
  (typeof m.href === "string" &&
   m.href.startsWith("/liga/nations-league-2026/partido/"));

function Tarjeta({ m }) {
  const mostrarMarcador =
    (m.terminado || m.enVivo) &&
    m.goles.local !== null &&
    m.goles.visitante !== null;
  const c = m.pick ? m.pick.confianza || 0 : 0;
  const texto = m.pick
    ? `Hola, quiero cargar y jugar "${m.pick.pick}" en ${m.local.nombre} vs ${m.visitante.nombre}. Vi el pronóstico en Min90 Bolivia`
    : `Hola, quiero cargar y jugar ${m.local.nombre} vs ${m.visitante.nombre}. Vi el partido en Min90 Bolivia`;
  return (
    <article className="relative rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-4 shadow-md shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lg">
      {m.slug || m.href ? <a href={m.href || `/partido/${m.slug}`} aria-label={`Ver análisis de ${m.local.nombre} vs ${m.visitante.nombre}`} className="absolute inset-0 z-0 rounded-2xl" /> : null}
      {m.slug || m.href ? <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 text-xl text-slate-500">›</span> : null}
      {m.enVivo ? (
        <div className="mb-2 flex justify-end" aria-live="polite">
          <span className={"rounded-full px-3 py-1 text-xs font-extrabold " +
            (m.estadoVivo === "HT"
              ? "bg-amber-100 text-amber-800"
              : "bg-red-600 text-white")}>
            {m.estadoVivo === "HT"
              ? "DESCANSO · HT"
              : "🔴 EN VIVO" +
                (m.minutoVivo ? " · " + m.minutoVivo : "")}
          </span>
        </div>
      ) : m.finESPN ? (
        <div className="mb-2 flex justify-end">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            FINAL
          </span>
        </div>
      ) : null}
      <p className="text-xs text-slate-600">
        {m.liga ? <span className="block font-bold text-oro-700">{m.liga}</span> : null}{fmt(m.fecha)}{m.hora ? ` · ${m.hora}` : ""}{m.ronda ? ` · ${m.ronda === "Amistoso" ? "Amistoso" : `Ronda ${m.ronda}`}` : ""}
        {m.estadio ? <span className="block text-slate-400">{m.estadio}</span> : null}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 text-center">
        <div className="flex flex-1 flex-col items-center"><Escudito t={m.local} /><span className="mt-2 text-sm font-bold text-slate-900">{m.local.nombre}</span></div>
        {mostrarMarcador
          ? <span className="text-xl font-black text-oro-700">{m.goles.local} - {m.goles.visitante}</span>
          : <span className="text-sm font-bold text-slate-500">vs</span>}
        <div className="flex flex-1 flex-col items-center"><Escudito t={m.visitante} /><span className="mt-2 text-sm font-bold text-slate-900">{m.visitante.nombre}</span></div>
      </div>
      {m.pick ? (
        <div className="mt-3 rounded-xl border border-oro-500/50 bg-oro-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] uppercase tracking-wide text-oro-700">Pronóstico Min90{m.pick.mercado ? ` · ${m.pick.mercado}` : ""}</p>
            <span className="rounded-full bg-oro-400 px-2.5 py-0.5 text-xs font-black text-slate-900">Cuota {m.pick.cuota}</span>
          </div>
          <p className="mt-1 text-lg font-extrabold">{m.pick.pick}</p>
          <p className="text-xs text-yellow-700">{"★".repeat(c)}{"☆".repeat(3 - c)}</p>
          {m.pick.analisis ? <p className="mt-1 text-sm text-slate-700">{m.pick.analisis}</p> : null}
        </div>
      ) : m.ambos == null || m.o25 == null ? (
        <p className="mt-3 text-center text-xs text-slate-500">
          Estadísticas sujetas a disponibilidad de ESPN.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Chip tono="verde">Ambos marcan {m.ambos}%</Chip>
          <Chip tono="amarillo">Más de 2.5 goles {m.o25}%</Chip>
        </div>
      )}
      {m.terminado || (!m.enVivo && !esPartidoFuturo(m))
        ? null
        : (
        <div className="mt-4 flex justify-center">
          <a href={waLinkDe(texto)} target="_blank" rel="noopener noreferrer" className="relative z-10 rounded-full bg-green-500 px-6 py-2.5 text-sm font-bold text-black shadow-sm hover:bg-green-400">Jugar este partido</a>
        </div>
      )}
    </article>
  );
}

export default function PartidosLista({ pendientes = [], terminados = [], ligas, habilitarVivoESPN = false }) {
  const [tab, setTab] = useState(() =>
    pendientes.some((m) => m.enVivo) ? "vivo" : "proximos"
  );
  const [n, setN] = useState(8);
  const opciones = ligas && ligas.length ? ligas : [{ k: "unica", nombre: "", pendientes, terminados }];
  const [lk, setLk] = useState(opciones[0].k);
  const [ref, setRef] = useState(null);
  const [datosEnVivo, setDatosEnVivo] = useState({});
  const [errorEnVivo, setErrorEnVivo] = useState(false);
  const [datosVivoESPN, setDatosVivoESPN] = useState(null);
  const [errorVivoESPN, setErrorVivoESPN] = useState(false);
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    const reloj = setInterval(() => {
      setAhora(Date.now());
    }, 30000);

    return () => clearInterval(reloj);
  }, []);
  useEffect(() => { setRef({ h: hoy(), m: manana() }); }, []);

  // Actualizar partidos activos de todas las competiciones
  // ESPN sin depender de la caché HTML de la portada.
  useEffect(() => {
    // Solo la portada consulta todas las competiciones.
    if (!habilitarVivoESPN) return;

    let activo = true;

    const actualizarESPN = async () => {
      if (document.hidden) return;

      try {
        const respuesta = await fetch("/api/en-vivo-espn", {
          cache: "no-store",
        });

        if (!respuesta.ok) {
          throw new Error("ESPN HTTP " + respuesta.status);
        }

        const datos = await respuesta.json();

        if (
          !Array.isArray(datos.partidos) ||
          !Array.isArray(datos.consultadas)
        ) {
          throw new Error("Respuesta ESPN inválida");
        }

        if (activo) {
          setDatosVivoESPN(datos);
          setErrorVivoESPN(
            Array.isArray(datos.fallidas) &&
            datos.fallidas.length > 0
          );
        }
      } catch {
        if (activo) {
          setErrorVivoESPN(true);
        }
      }
    };

    actualizarESPN();

    const reloj = setInterval(actualizarESPN, 60000);

    const alVolver = () => {
      if (!document.hidden) actualizarESPN();
    };

    document.addEventListener("visibilitychange", alVolver);

    return () => {
      activo = false;
      clearInterval(reloj);
      document.removeEventListener(
        "visibilitychange",
        alVolver
      );
    };
  }, [habilitarVivoESPN]);

  const hayNationsHoy = opciones.some((o) =>
    [...o.pendientes, ...o.terminados].some(
      (m) => esNations(m) && m.fecha === hoy()
    )
  );

  useEffect(() => {
    if (!hayNationsHoy) return;

    let activo = true;

    const actualizar = async () => {
      try {
        const r = await fetch("/api/en-vivo", {
          cache: "no-store"
        });

        if (!r.ok) throw new Error("API HTTP " + r.status);

        const d = await r.json();

        if (d.fecha !== hoy() || !Array.isArray(d.partidos)) {
          throw new Error("Respuesta inválida");
        }

        const mapa = Object.fromEntries(
          d.partidos
            .filter((p) =>
              p.liga === "nations-league-2026" &&
              p.idLocal != null
            )
            .map((p) => [String(p.idLocal), p])
        );

        if (activo) {
          setDatosEnVivo(mapa);
          setErrorEnVivo(false);
        }
      } catch {
        if (activo) {
          setDatosEnVivo({});
          setErrorEnVivo(true);
        }
      }
    };

    actualizar();

    const reloj = setInterval(actualizar, 60000);

    return () => {
      activo = false;
      clearInterval(reloj);
    };
  }, [hayNationsHoy]);
  const actual = opciones.find((x) => x.k === lk) || opciones[0];
  const combinar = (m, terminado) => {
    const p = esNations(m) && m.fecha === hoy()
      ? datosEnVivo[String(m.id)]
      : null;

    if (!p) {
      return {
        ...m,
        terminado: terminado || m.terminado === true,
        enVivo: m.enVivo === true,
      };
    }

    const golesValidos =
      Number.isFinite(p.goles?.local) &&
      Number.isFinite(p.goles?.visitante);

    const enVivo = p.fase === "in";
    const finESPN = p.fase === "post" && golesValidos;

    return {
      ...m,
      terminado: terminado || finESPN,
      enVivo,
      finESPN,
      estadoVivo: p.detalle,
      minutoVivo: p.minuto,
      goles: golesValidos ? p.goles : m.goles,
    };
  };

  const todos = [
    ...actual.pendientes.map((m) => combinar(m, false)),
    ...actual.terminados.map((m) => combinar(m, true)),
  ];

  const pend = todos.filter((m) =>
    !m.terminado &&
    !m.enVivo &&
    esPartidoFuturo(m, ahora)
  );
  const term = todos.filter((m) => m.terminado);
  // La API actualiza exclusivamente la pestaña En vivo.
  // Conservamos los datos originales de las otras pestañas.
  const fuentesActualizadas = new Set(
    datosVivoESPN?.consultadas || []
  );

  const slugFuente = (m) =>
    typeof m.href === "string"
      ? m.href.match(
          /^\/mas-ligas\/([^/]+)\/partido\//
        )?.[1] || null
      : null;

  const vivos = [
    ...todos.filter((m) => {
      if (!m.enVivo) return false;

      const slug = slugFuente(m);

      // Cuando ESPN responde correctamente, sus datos
      // nuevos sustituyen el estado antiguo del servidor.
      return !slug || !fuentesActualizadas.has(slug);
    }),
    ...(datosVivoESPN?.partidos || []),
  ];
  let lista;
  if (tab === "vivo") {
    lista = [...vivos].sort((a, b) =>
      (a.liga || "").localeCompare(b.liga || "", "es") ||
      `${a.fecha || ""} ${a.hora || ""}`.localeCompare(
        `${b.fecha || ""} ${b.hora || ""}`
      )
    );
  }
  else if (tab === "proximos") lista = [...pend].sort((x, y) => `${x.fecha || ""} ${x.hora || ""}`.localeCompare(`${y.fecha || ""} ${y.hora || ""}`));
  else if (tab === "terminados") lista = term;
  else {
    const d = tab === "hoy" ? hoy() : manana();
    lista = todos.filter((m) => m.fecha === d).sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));
  }
  const cambiar = (k) => { setTab(k); setN(8); };
  const cambiarLiga = (k) => { setLk(k); setTab("proximos"); setN(8); };
  const etiqueta = (f) => (ref && f === ref.h ? "Hoy" : ref && f === ref.m ? "Mañana" : fmt(f));
  const grupos = [];
  const visibles = tab === "vivo"
    ? lista
    : lista.slice(0, n);

  visibles.forEach((m) => {
    const claveGrupo = tab === "vivo"
      ? m.liga || "Otros partidos"
      : m.fecha;

    const g = grupos[grupos.length - 1];

    if (g && g.f === claveGrupo) {
      g.items.push(m);
    } else {
      grupos.push({ f: claveGrupo, items: [m] });
    }
  });

  return (
    <>
      {opciones.length > 1 ? (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {opciones.map((o) => (
            <button key={o.k} onClick={() => cambiarLiga(o.k)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${lk === o.k ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700"}`}>
              {o.nombre}
            </button>
          ))}
        </div>
      ) : null}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.filter(([k]) =>
          k !== "vivo" ||
          habilitarVivoESPN ||
          vivos.length > 0 ||
          todos.some((m) => m.enVivo || esNations(m))
        ).map(([k, t]) => (
          <button key={k} onClick={() => cambiar(k)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${tab === k ? "border border-oro-500 bg-oro-400 text-slate-900 shadow-sm" : "border border-slate-300 bg-white text-slate-700 hover:border-oro-500"}`}>
            {k === "vivo" && vivos.length ? `${t} (${vivos.length})` : t}
          </button>
        ))}
      </div>
      {tab === "vivo" && errorVivoESPN ? (
        <p className="mb-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          No se pudieron actualizar todas las competiciones
          en vivo. Algunos datos podrían estar desactualizados.
        </p>
      ) : null}
      <div>
        {grupos.map((g) => (
          <div key={g.f} className="mb-4">
            {tab === "vivo" ? (
              <h3 className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm font-extrabold text-oro-700">
                <span>{ICONOS_VIVO[g.f] || "⚽"} {g.f}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {g.items.length} {g.items.length === 1 ? "partido" : "partidos"}
                </span>
              </h3>
            ) : tab === "hoy" || tab === "manana" ? null : (
              <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-oro-700">{etiqueta(g.f)}</h3>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {g.items.map((m) => <Tarjeta key={`${m.liga || ""}-${m.id}`} m={m} />)}
            </div>
          </div>
        ))}
      </div>
      {lista.length === 0 && (
        <div className="rounded-xl bg-white p-4 text-center text-sm text-slate-600">
          {tab === "vivo"
            ? errorEnVivo || errorVivoESPN
              ? "No se pudieron confirmar todos los partidos en vivo."
              : "No hay partidos en vivo en este momento."
            : "No hay partidos en esta categoría."}
          <button onClick={() => cambiar("proximos")} className="ml-2 font-semibold text-oro-700 underline">Ver próximos</button>
        </div>
      )}
      {tab !== "vivo" && lista.length > n && (
        <div className="mt-4 text-center">
          <button onClick={() => setN(n + 8)} className="rounded-full border border-oro-500 px-5 py-2 text-sm font-bold text-oro-700 hover:bg-oro-500/10">Ver más partidos</button>
        </div>
      )}
      <p className="mt-4 text-xs text-slate-500">Las tendencias son el promedio de ambos equipos en 2026 y no garantizan resultados. Solo +18.</p>
    </>
  );
}
