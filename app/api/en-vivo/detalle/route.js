import { NextResponse } from "next/server";
import { partidoPorId } from "@/lib/ligas";
import { claveSeleccion } from "@/lib/nombresSelecciones";

export const dynamic = "auto";


const instante = (s) => {
  if (!s || !s.includes("T")) return NaN;
  return Date.parse(/Z$|[+-]\d\d:\d\d$/.test(s) ? s : s + "Z");
};

const numero = (n) => n === null || n === undefined || n === ""
  ? null : Number.isFinite(Number(n)) ? Number(n) : null;

async function pedir(url) {
  const r = await fetch(url, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(12000),
  });
  if (!r.ok) throw new Error(`ESPN HTTP ${r.status}`);
  return r.json();
}

export async function GET(request) {
  const idLocal = new URL(request.url).searchParams.get("id");
  if (!/^\d{5,12}$/.test(idLocal || "")) {
    return NextResponse.json({ error: "Identificador inválido" }, { status: 400 });
  }

  const m = partidoPorId("nations-league-2026", idLocal);
  if (!m || !Number.isFinite(instante(m.ts))) {
    return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
  }

  try {
    const fechaUTC = new Date(instante(m.ts)).toISOString().slice(0, 10).replace(/-/g, "");
    const base = "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.nations/";
    const marcador = await pedir(`${base}scoreboard?dates=${fechaUTC}&limit=100`);
    const encontrados = (marcador.events || []).filter((e) => {
      const equipos = e.competitions?.[0]?.competitors || [];
      const local = equipos.find((x) => x.homeAway === "home");
      const visita = equipos.find((x) => x.homeAway === "away");
      return claveSeleccion(local?.team?.displayName) === claveSeleccion(m.local.nombre) &&
        claveSeleccion(visita?.team?.displayName) === claveSeleccion(m.visitante.nombre) &&
        Math.abs(instante(e.date) - instante(m.ts)) <= 900000;
    });

    if (encontrados.length !== 1) {
      return NextResponse.json({ error: "No hay una coincidencia única en ESPN" }, { status: 404 });
    }

    const e = encontrados[0];
    const competidores = e.competitions?.[0]?.competitors || [];
    const local = competidores.find((x) => x.homeAway === "home");
    const visita = competidores.find((x) => x.homeAway === "away");
    const fase = e.status?.type?.state || "";
    let detalle = null;
    try {
      detalle = await pedir(`${base}summary?event=${encodeURIComponent(e.id)}`);
    } catch (error) {
      console.error("Detalles ESPN:", error.message);
    }

    const equipoStats = (nombre) => (detalle?.boxscore?.teams || []).find(
      (t) => claveSeleccion(t.team?.displayName) === claveSeleccion(nombre)
    );
    const a = equipoStats(m.local.nombre);
    const b = equipoStats(m.visitante.nombre);
    const estadistica = (t, nombre) => {
      const dato = (t?.statistics || []).find((s) => s.label === nombre);
      return dato?.displayValue ?? dato?.value ?? null;
    };
    const tipos = [
      ["Possession", "Posesión", "%"],
      ["SHOTS", "Tiros", ""],
      ["ON GOAL", "Tiros al arco", ""],
      ["Corner Kicks", "Córners", ""],
      ["Fouls", "Faltas", ""],
      ["Yellow Cards", "Tarjetas amarillas", ""],
      ["Red Cards", "Tarjetas rojas", ""],
      ["Offsides", "Fueras de juego", ""],
      ["Saves", "Atajadas", ""],
      ["Passes", "Pases", ""],
    ];
    const estadisticas = tipos.map(([clave, titulo, unidad]) => ({
      clave, titulo, unidad,
      local: estadistica(a, clave),
      visitante: estadistica(b, clave),
    })).filter((s) => s.local !== null || s.visitante !== null);

    const clasificar = (t) => {
      const tipo = String(t || "").toLowerCase();
      if (tipo.includes("goal")) return "Gol";
      if (tipo.includes("yellow card")) return "Tarjeta amarilla";
      if (tipo.includes("red card")) return "Tarjeta roja";
      if (tipo.includes("substitution")) return "Cambio";
      if (tipo.includes("halftime")) return "Descanso";
      if (tipo.includes("full time") || tipo.includes("fulltime")) return "Final";
      return null;
    };
    const eventos = (detalle?.keyEvents || []).map((v) => ({
      id: String(v.id || ""),
      minuto: v.clock?.displayValue || "",
      tipo: clasificar(v.type?.text),
      equipo: v.team?.displayName || "",
      jugadores: (v.participants || []).map((p) => p.athlete?.displayName).filter(Boolean),
      descripcion: String(v.text || "").slice(0, 250),
    })).filter((v) => v.tipo);

    const alineaciones = (detalle?.rosters || []).map((r) => ({
      equipo: r.team?.displayName || "",
      formacion: r.formation || "",
      titulares: (r.roster || []).filter((p) => p.starter === true).map((p) => ({
        nombre: p.athlete?.displayName || "",
        dorsal: p.jersey || "",
        posicion: p.position?.abbreviation || "",
      })),
      suplentes: (r.roster || []).filter((p) => p.starter === false).map((p) => ({
        nombre: p.athlete?.displayName || "",
        dorsal: p.jersey || "",
        posicion: p.position?.abbreviation || "",
      })),
    }));

    return NextResponse.json({
      idLocal: String(m.id),
      idESPN: String(e.id),
      fase,
      estado: e.status?.type?.name || "",
      minuto: e.status?.displayClock || "",
      estadoTexto: e.status?.type?.shortDetail || "",
      goles: {
        local: fase === "pre" ? null : numero(local?.score),
        visitante: fase === "pre" ? null : numero(visita?.score),
      },
      detallesDisponibles: detalle !== null,
      estadisticas,
      eventos,
      alineaciones,
      actualizado: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API detalle en vivo:", error.message);
    return NextResponse.json({ error: "No se pudo consultar el partido" }, { status: 502 });
  }
}
