"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ActualizadorESPN({
  fechas = "",
  intervalo = 120000
}) {
  const router = useRouter();
  const ultimo = useRef(0);

  useEffect(() => {
    const inicios = fechas
      .split("|")
      .map((fecha) => Date.parse(fecha))
      .filter((valor) => Number.isFinite(valor));

    if (!inicios.length) return;

    ultimo.current = Date.now();

    const cercaDelPartido = () => {
      const ahora = Date.now();

      return inicios.some((inicio) =>
        ahora >= inicio - 2 * 60 * 60 * 1000 &&
        ahora <= inicio + 5 * 60 * 60 * 1000
      );
    };

    const actualizar = () => {
      if (document.hidden || !cercaDelPartido()) return;

      const ahora = Date.now();

      if (ahora - ultimo.current < intervalo) return;

      ultimo.current = ahora;
      router.refresh();
    };

    const reloj = setInterval(actualizar, 30000);

    const alVolver = () => {
      if (!document.hidden) actualizar();
    };

    document.addEventListener("visibilitychange", alVolver);

    return () => {
      clearInterval(reloj);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [fechas, intervalo, router]);

  return null;
}
