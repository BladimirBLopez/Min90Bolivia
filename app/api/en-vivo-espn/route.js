import { NextResponse } from "next/server";
import {
  LIGAS_ESPN,
  partidosDiaESPN,
} from "@/lib/ligasESPN";

export const dynamic = "force-dynamic";

const cabeceras = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET() {
  const respuestas = await Promise.all(
    LIGAS_ESPN.map(async (liga) => {
      try {
        const datos = await partidosDiaESPN(liga);

        return {
          liga,
          error: datos.error,
          partidos: datos.partidos,
        };
      } catch (error) {
        console.error(
          "[API en vivo ESPN]",
          liga.slug,
          error?.message || String(error)
        );

        return {
          liga,
          error: true,
          partidos: [],
        };
      }
    })
  );

  const consultadas = respuestas
    .filter((r) => !r.error)
    .map((r) => r.liga.slug);

  const fallidas = respuestas
    .filter((r) => r.error)
    .map((r) => r.liga.slug);

  if (!consultadas.length) {
    return NextResponse.json(
      { error: "ESPN no disponible" },
      { status: 502, headers: cabeceras }
    );
  }

  const partidos = respuestas
    .filter((r) => !r.error)
    .flatMap((r) =>
      r.partidos
        .filter((p) => p.fase === "in")
        .map((p) => {
          const inicio = Date.parse(p.fecha);

          if (!Number.isFinite(inicio)) return null;

          const fechaHora = new Date(
            inicio - 4 * 3600000
          ).toISOString();

          return {
            id: p.id,
            liga: r.liga.nombre,
            fecha: fechaHora.slice(0, 10),
            hora: fechaHora.slice(11, 16),
            ronda: null,
            estadio: p.estadio || null,
            goles: {
              local: Number.isFinite(p.local.goles)
                ? p.local.goles : null,
              visitante: Number.isFinite(p.visitante.goles)
                ? p.visitante.goles : null,
            },
            local: {
              nombre: p.local.nombre,
              logo: p.local.logo,
            },
            visitante: {
              nombre: p.visitante.nombre,
              logo: p.visitante.logo,
            },
            href: `/mas-ligas/${r.liga.slug}/partido/${p.id}`,
            ambos: null,
            o25: null,
            pick: null,
            enVivo: true,
            terminado: false,
            minutoVivo: p.minuto || "",
            estadoVivo: p.estado || "",
          };
        })
        .filter(Boolean)
    );

  return NextResponse.json(
    {
      actualizacion: new Date().toISOString(),
      consultadas,
      fallidas,
      partidos,
    },
    { headers: cabeceras }
  );
}
