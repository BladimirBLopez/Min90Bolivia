import { NextResponse } from "next/server";
import { cargarLiga } from "@/lib/ligas";

export const dynamic = "auto";

const normalizar = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

const tiempo = (s) => {
  if (!s || !s.includes("T")) return NaN;
  return Date.parse(
    /Z$|[+-]\d\d:\d\d$/.test(s) ? s : s + "Z"
  );
};

const marcador = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
};

export async function GET(request) {
  const hoyBolivia = new Date(Date.now() - 14400000)
    .toISOString().slice(0, 10);

  const fecha = new URL(request.url)
    .searchParams.get("fecha") || hoyBolivia;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
      Number.isNaN(Date.parse(fecha))) {
    return NextResponse.json(
      { error: "Fecha no válida" },
      { status: 400 }
    );
  }

  try {
    const url =
      "https://site.api.espn.com/apis/site/v2/sports/" +
      "soccer/uefa.nations/scoreboard?dates=" +
      fecha.replace(/-/g, "") + "&limit=100";

    const respuesta = await fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(12000)
    });

    if (!respuesta.ok) {
      throw new Error("ESPN HTTP " + respuesta.status);
    }

    const datos = await respuesta.json();
    const locales = cargarLiga("nations-league-2026");

    const partidos = (datos.events || []).map((e) => {
      const equipos = e.competitions?.[0]?.competitors || [];
      const home = equipos.find(x => x.homeAway === "home");
      const away = equipos.find(x => x.homeAway === "away");

      const local = locales.find(m =>
        normalizar(m.local.nombre) ===
          normalizar(home?.team?.displayName) &&
        normalizar(m.visitante.nombre) ===
          normalizar(away?.team?.displayName) &&
        Number.isFinite(tiempo(m.ts)) &&
        Math.abs(tiempo(m.ts) - tiempo(e.date)) <= 900000
      );

      const estado = e.status?.type || {};
      const iniciado = estado.state !== "pre";

      return {
        idESPN: e.id,
        idLocal: local?.id || null,
        liga: "nations-league-2026",
        local: home?.team?.displayName || "",
        visitante: away?.team?.displayName || "",
        fecha: e.date,
        estado: estado.name || "",
        fase: estado.state || "",
        detalle: estado.shortDetail || "",
        minuto: e.status?.displayClock || "",
        goles: {
          local: iniciado ? marcador(home?.score) : null,
          visitante: iniciado ? marcador(away?.score) : null
        }
      };
    });

    return NextResponse.json({
      liga: "UEFA Nations League",
      fecha,
      actualizacion: new Date().toISOString(),
      total: partidos.length,
      relacionados: partidos.filter(p => p.idLocal).length,
      partidos
    });

  } catch (error) {
    console.error("API en vivo:", error.message);
    return NextResponse.json(
      { error: "No se pudieron consultar los resultados" },
      { status: 502 }
    );
  }
}
