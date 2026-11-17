"use client";

import { useState } from "react";
import Link from "next/link";

const botones = [
  ["vivo", "🔴 En vivo"],
  ["hoy", "Hoy"],
  ["proximos", "Próximos"],
  ["resultados", "Resultados"],
];

const fechaBolivia = (valor) => {
  const d = new Date(valor);
  if (!Number.isFinite(d.getTime())) return "";

  return new Date(d.getTime() - 4 * 3600000)
    .toISOString().slice(0, 10);
};

const mesBolivia = (valor) => fechaBolivia(valor).slice(0, 7);

const fechaVisible = (valor) => {
  const d = new Date(valor);

  if (!Number.isFinite(d.getTime())) {
    return "Horario por confirmar";
  }

  return new Intl.DateTimeFormat("es-BO", {
    timeZone: "America/La_Paz",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
};

function Escudo({ equipo }) {
  return equipo.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={equipo.logo}
      alt=""
      width={52}
      height={52}
      loading="lazy"
      className="h-14 w-14 object-contain"
    />
  ) : (
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-bold">
      {equipo.nombre.slice(0, 1)}
    </span>
  );
}

function Equipo({ equipo, slug }) {
  const contenido = (
    <>
      <Escudo equipo={equipo} />
      <span className="mt-2 text-sm font-bold leading-tight">
        {equipo.nombre}
      </span>
    </>
  );

  return equipo.id ? (
    <Link
      href={`/mas-ligas/${slug}/equipo/${equipo.id}`}
      className="flex min-w-0 flex-col items-center hover:text-oro-700"
    >
      {contenido}
    </Link>
  ) : (
    <div className="flex min-w-0 flex-col items-center">
      {contenido}
    </div>
  );
}

function Tarjeta({ partido, slug }) {
  const hayMarcador =
    partido.fase !== "pre" &&
    Number.isFinite(partido.local.goles) &&
    Number.isFinite(partido.visitante.goles);

  const marcador = hayMarcador
    ? `${partido.local.goles} - ${partido.visitante.goles}`
    : "VS";

  return (
    <article className="rounded-2xl border border-slate-200 border-t-4 border-t-oro-500 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
        <span>{fechaVisible(partido.fecha)} · Bolivia</span>
        <span className={
          partido.fase === "in"
            ? "rounded-full bg-red-600 px-2 py-1 font-bold text-white"
            : "font-bold text-slate-600"
        }>
          {partido.fase === "in"
            ? `🔴 EN VIVO ${partido.minuto || ""}`
            : partido.fase === "post" ? "FINAL" : "PRÓXIMO"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center">
        <Equipo equipo={partido.local} slug={slug} />
        <span className="whitespace-nowrap text-xl font-black text-oro-700">
          {marcador}
        </span>
        <Equipo equipo={partido.visitante} slug={slug} />
      </div>

      <Link
        href={`/mas-ligas/${slug}/partido/${partido.id}`}
        className="mt-4 block rounded-lg bg-oro-50 px-3 py-2 text-center text-sm font-bold text-oro-700 hover:bg-oro-100"
      >
        Ver partido y estadísticas ›
      </Link>
    </article>
  );
}

export default function ExploradorESPN({ partidos, slug }) {
  const inicial = partidos.some((p) => p.fase === "in")
    ? "vivo"
    : partidos.some((p) =>
        p.fase === "pre" &&
        Date.parse(p.fecha) > Date.now()
      )
      ? "proximos"
      : "resultados";

  const [tab, setTab] = useState(inicial);
  const [mesElegido, setMesElegido] = useState("");
  const [limite, setLimite] = useState(20);

  const hoy = new Date(
    Date.now() - 4 * 3600000
  ).toISOString().slice(0, 10);

  const resultados = partidos
    .filter((p) => p.fase === "post")
    .slice().reverse();

  const meses = [...new Set(
    resultados.map((p) => mesBolivia(p.fecha)).filter(Boolean)
  )].sort().reverse();

  const mes = meses.includes(mesElegido)
    ? mesElegido : meses[0] || "";

  let lista;

  if (tab === "vivo") {
    lista = partidos.filter((p) => p.fase === "in");
  } else if (tab === "hoy") {
    lista = partidos.filter(
      (p) => fechaBolivia(p.fecha) === hoy
    );
  } else if (tab === "proximos") {
    lista = partidos.filter(
      (p) =>
        p.fase === "pre" &&
        Date.parse(p.fecha) > Date.now()
    );
  } else {
    lista = resultados.filter(
      (p) => mesBolivia(p.fecha) === mes
    );
  }

  const visibles = lista.slice(0, limite);

  const cambiar = (siguiente) => {
    setTab(siguiente);
    setLimite(20);
  };

  return (
    <div className="mt-7">
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {botones.map(([id, texto]) => (
          <button
            key={id}
            type="button"
            onClick={() => cambiar(id)}
            aria-pressed={tab === id}
            className={
              "shrink-0 rounded-full border px-4 py-2 text-sm font-bold " +
              (tab === id
                ? "border-oro-500 bg-oro-400 text-slate-900"
                : "border-slate-300 bg-white text-slate-700")
            }
          >
            {texto}
          </button>
        ))}
      </div>

      {tab === "resultados" && meses.length > 0 && (
        <div className="mb-5">
          <label
            htmlFor="mes-resultados"
            className="mb-2 block text-sm font-bold"
          >
            Mes de resultados
          </label>
          <select
            id="mes-resultados"
            value={mes}
            onChange={(e) => {
              setMesElegido(e.target.value);
              setLimite(20);
            }}
            className="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
          >
            {meses.map((m) => (
              <option key={m} value={m}>
                {new Intl.DateTimeFormat("es-BO", {
                  year: "numeric",
                  month: "long",
                  timeZone: "UTC",
                }).format(new Date(`${m}-01T12:00:00Z`))}
              </option>
            ))}
          </select>
        </div>
      )}

      <p className="mb-4 text-sm text-slate-500">
        {lista.length} encuentros disponibles
      </p>

      {visibles.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {visibles.map((partido) => (
            <Tarjeta
              key={partido.id}
              partido={partido}
              slug={slug}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white p-5 text-sm text-slate-600">
          No hay partidos disponibles en esta sección.
        </div>
      )}

      {lista.length > visibles.length && (
        <button
          type="button"
          onClick={() => setLimite((n) => n + 20)}
          className="mx-auto mt-6 block rounded-full border border-oro-500 px-6 py-3 text-sm font-bold text-oro-700"
        >
          Ver más partidos
        </button>
      )}
    </div>
  );
}
