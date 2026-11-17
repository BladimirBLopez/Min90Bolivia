// Los horarios de los partidos se muestran en Bolivia (UTC-4).
// No depende de la zona horaria del celular del visitante.

export function fechaActualBolivia(ahora = Date.now()) {
  return new Date(ahora - 4 * 3600000)
    .toISOString()
    .slice(0, 10);
}

export function esPartidoFuturo(m, ahora = Date.now()) {
  const fecha = typeof m?.fecha === "string"
    ? m.fecha : "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const hora = typeof m?.hora === "string"
    ? m.hora.trim() : "";

  if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    const inicio = Date.parse(
      `${fecha}T${hora}:00-04:00`
    );

    return Number.isFinite(inicio) && inicio > ahora;
  }

  // Si falta la hora, no mostrar como proximo
  // un partido del dia actual o de dias anteriores.
  return fecha > fechaActualBolivia(ahora);
}
