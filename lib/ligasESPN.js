export const LIGAS_ESPN = [
  { slug: "libertadores", nombre: "Copa Libertadores", codigo: "conmebol.libertadores", zona: "Sudamérica" },
  { slug: "sudamericana", nombre: "Copa Sudamericana", codigo: "conmebol.sudamericana", zona: "Sudamérica" },
  { slug: "champions", nombre: "UEFA Champions League", codigo: "uefa.champions", zona: "Europa" },
  { slug: "amistosos-internacionales", nombre: "Amistosos Internacionales", codigo: "fifa.friendly", zona: "Selecciones nacionales" },
];

export const ligaESPN = (slug) => LIGAS_ESPN.find((l) => l.slug === slug) || null;

const BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/";

const numero = (v) => {
  const n = typeof v === "object" && v !== null ? (v.value ?? v.displayValue) : v;
  if (n === null || n === undefined || n === "") return null;
  const x = Number(n);
  return Number.isFinite(x) ? x : null;
};

const equipo = (c) => ({
  id: String(c?.team?.id || ""),
  nombre: c?.team?.displayName || c?.team?.name || "Equipo por confirmar",
  logo: /^https:\/\//.test(c?.team?.logo || "")
    ? c.team.logo
    : (Array.isArray(c?.team?.logos)
        ? c.team.logos.find((l) =>
            l?.rel?.includes("default") &&
            /^https:\/\//.test(l?.href || ""))?.href ||
          c.team.logos.find((l) =>
            /^https:\/\//.test(l?.href || ""))?.href
        : null) || null,
  goles: numero(c?.score),
});

export function normalizarPartido(e) {
  const c = e?.competitions?.[0];
  const competidores = c?.competitors || [];
  const local = competidores.find((x) => x.homeAway === "home");
  const visita = competidores.find((x) => x.homeAway === "away");

  if (!e?.id || !local || !visita) return null;

  const fase = e.status?.type?.state || c.status?.type?.state || "pre";

  return {
    id: String(e.id),
    fecha: e.date || c.date || "",
    fase,
    minuto: e.status?.displayClock || c.status?.displayClock || "",
    estado: e.status?.type?.shortDetail || c.status?.type?.shortDetail || "",
    estadio: c.venue?.fullName || "",
    local: equipo(local),
    visitante: equipo(visita),
  };
}

async function pedir(codigo, ruta, segundos) {
  const r = await fetch(`${BASE}${codigo}/${ruta}`, {
    next: { revalidate: segundos },
    signal: AbortSignal.timeout(12000),
  });

  if (!r.ok) throw new Error(`ESPN HTTP ${r.status}`);

  return r.json();
}

// Consultar el marcador diario para detectar partidos activos.
// Cerca de la medianoche UTC se incluyen días adyacentes.
export async function partidosDiaESPN(liga) {
  const ahora = Date.now();
  const horaUTC = new Date(ahora).getUTCHours();

  const fechaUTC = (valor) =>
    new Date(valor).toISOString().slice(0, 10)
      .replaceAll("-", "");

  const dias = [fechaUTC(ahora)];

  if (horaUTC < 6) {
    dias.unshift(fechaUTC(ahora - 86400000));
  }

  if (horaUTC >= 22) {
    dias.push(fechaUTC(ahora + 86400000));
  }

  const respuestas = await Promise.all(
    dias.map(async (dia) => {
      try {
        const datos = await pedir(
          liga.codigo,
          `scoreboard?dates=${dia}&limit=200`,
          60
        );

        return {
          ok: true,
          eventos: Array.isArray(datos.events)
            ? datos.events : [],
        };
      } catch (error) {
        console.error(
          "[ESPN portada]",
          liga.slug,
          dia,
          error?.message || String(error)
        );

        return { ok: false, eventos: [] };
      }
    })
  );

  const vistos = new Set();

  const partidos = respuestas
    .flatMap((r) => r.eventos)
    .filter((e) => {
      const id = String(e?.id || "");

      if (!id || vistos.has(id)) return false;

      vistos.add(id);
      return true;
    })
    .map(normalizarPartido)
    .filter(Boolean);

  return {
    partidos,
    error: respuestas.every((r) => !r.ok),
  };
}

export async function partidosESPN(liga) {
  // Mes actual en Bolivia, mas el anterior y el siguiente.
  const ahoraBolivia = new Date(
    Date.now() - 4 * 60 * 60 * 1000
  );

  const mes = (desplazamiento) => {
    const fecha = new Date(Date.UTC(
      ahoraBolivia.getUTCFullYear(),
      ahoraBolivia.getUTCMonth() + desplazamiento,
      1
    ));

    return fecha.toISOString().slice(0, 7).replace("-", "");
  };

  const meses = [-1, 0, 1].map(mes);

  const respuestas = await Promise.all(meses.map(async (m) => {
    try {
      const d = await pedir(liga.codigo, `scoreboard?dates=${m}&limit=200`, 90);
      return { mes: m, ok: true, eventos: Array.isArray(d.events) ? d.events : [] };
    } catch (error) {
      console.error("[mas-ligas ESPN] mensual", liga.slug, m, error?.message || String(error));
      return { mes: m, ok: false, eventos: [] };
    }
  }));

  let respondio = respuestas.some((r) => r.ok);
  let eventos = respuestas.flatMap((r) => r.eventos);

  if (!eventos.length) {
    try {
      const d = await pedir(liga.codigo, "scoreboard?limit=100", 90);
      respondio = true;
      eventos = Array.isArray(d.events) ? d.events : [];
    } catch (error) {
      console.error("[mas-ligas ESPN] respaldo", liga.slug, error?.message || String(error));
      // Conservar las respuestas mensuales disponibles.
    }
  }

  const vistos = new Set();
  const partidos = eventos
    .filter((e) => {
      if (!e?.id || vistos.has(String(e.id))) return false;
      vistos.add(String(e.id));
      return true;
    })
    .map(normalizarPartido)
    .filter(Boolean)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  return {
    partidos,
    error: !respondio,
    mesesNoDisponibles: respuestas
      .filter((r) => !r.ok)
      .map((r) => r.mes),
  };
}

export async function detalleESPN(liga, id) {
  if (!/^\d{6,12}$/.test(String(id))) return null;

  const d = await pedir(liga.codigo, `summary?event=${id}`, 60);
  const competencia = d.header?.competitions?.[0];

  if (!competencia) return null;

  const partido = normalizarPartido({
    id,
    date: competencia.date || d.header?.date,
    status: competencia.status || d.header?.status,
    competitions: [competencia],
  });

  if (!partido) return null;

  const equipos = d.boxscore?.teams || [];

  const buscar = (idEquipo) => equipos.find(
    (x) => String(x.team?.id) === idEquipo
  );

  const a = buscar(partido.local.id);
  const b = buscar(partido.visitante.id);

  const traducciones = {
    "possession": "Posesión",
    "shots": "Tiros",
    "on goal": "Tiros al arco",
    "on target %": "Precisión de tiros",
    "corner kicks": "Córners",
    "fouls": "Faltas",
    "yellow cards": "Tarjetas amarillas",
    "red cards": "Tarjetas rojas",
    "offsides": "Fueras de juego",
    "saves": "Atajadas",
    "passes": "Pases",
    "accurate passes": "Pases acertados",
    "pass completion %": "Precisión de pases",
    "penalty goals": "Goles de penal",
    "penalty kicks taken": "Penales ejecutados",
    "crosses": "Centros",
    "accurate crosses": "Centros acertados",
    "cross %": "Precisión de centros",
    "long balls": "Pases largos",
    "accurate long balls": "Pases largos acertados",
    "long balls %": "Precisión de pases largos",
    "blocked shots": "Tiros bloqueados",
    "tackles": "Entradas",
    "effective tackles": "Entradas efectivas",
    "tackle %": "Precisión de entradas",
    "interceptions": "Intercepciones",
    "clearances": "Despejes",
    "effective clearances": "Despejes efectivos",
  };

  const campos = new Map();

  for (const equipo of [a, b]) {
    for (const s of equipo?.statistics || []) {
      const nombre = String(
        s.label || s.name || ""
      ).trim();

      if (nombre) {
        campos.set(nombre.toLowerCase(), nombre);
      }
    }
  }

  const valor = (equipo, clave) => {
    const s = (equipo?.statistics || []).find(
      (x) => String(x.label || x.name || "")
        .trim().toLowerCase() === clave
    );

    const v = s?.displayValue ?? s?.value;

    return v === null || v === undefined || v === ""
      ? null : String(v);
  };

  const estadisticas = partido.fase === "pre"
    ? []
    : [...campos.entries()]
        .map(([clave, nombre]) => ({
          titulo: traducciones[clave] || nombre,
          local: valor(a, clave),
          visitante: valor(b, clave),
        }))
        .filter((s) =>
          s.local !== null || s.visitante !== null
        );

  const eventos = (d.keyEvents || []).map((e) => ({
    id: String(e.id || ""),
    minuto: e.clock?.displayValue || "",
    tipo: e.type?.text || "Incidencia",
    equipo: e.team?.displayName || "",
    descripcion: String(e.text || ""),
  }));

  const jugador = (p) => ({
    nombre: p?.athlete?.displayName || "Nombre no disponible",
    dorsal: p?.jersey || "",
  });

  const alineaciones = (d.rosters || [])
    .map((r) => {
      const plantilla = Array.isArray(r.roster)
        ? r.roster : [];

      return {
        equipo: r.team?.displayName || "Equipo",
        formacion: r.formation || "",
        titulares: plantilla
          .filter((p) => p.starter === true)
          .map(jugador),
        suplentes: plantilla
          .filter((p) => p.starter !== true)
          .map(jugador),
      };
    })
    .filter((r) =>
      r.titulares.length || r.suplentes.length
    );

  return { partido, estadisticas, eventos, alineaciones };
}

export function horaBolivia(valor) {
  const d = new Date(valor);

  if (!Number.isFinite(d.getTime())) return "Horario por confirmar";

  return new Intl.DateTimeFormat("es-BO", {
    timeZone: "America/La_Paz",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d) + " (Bolivia)";
}
