export const WHATSAPP = "59169356292";
export const MENSAJE = "Hola, vi Min90 Bolivia y quiero cargar";

// Pronóstico estrella del día (edita aquí)
export const estrella = {
  liga: "División Profesional",
  partido: "Por confirmar",
  fecha: "Por confirmar",
  pick: "Por confirmar",
  cuota: "—",
  confianza: 3,
  analisis: "Análisis por confirmar.",
  estado: "Pendiente",
};

// estado: "Pendiente" | "Acertado" | "Fallado"
export const pronosticos = [
  { liga: "División Profesional", partido: "Bolívar vs The Strongest", fecha: "Por confirmar", pick: "Por confirmar", cuota: "—", confianza: 2, analisis: "Análisis por confirmar.", estado: "Pendiente", mercado: "1X2", dia: "hoy" },
  { liga: "División Profesional", partido: "Always Ready vs Blooming", fecha: "Por confirmar", pick: "Por confirmar", cuota: "—", confianza: 2, analisis: "Análisis por confirmar.", estado: "Pendiente", mercado: "1X2", dia: "hoy" },
  { liga: "División Profesional", partido: "Oriente Petrolero vs Wilstermann", fecha: "Por confirmar", pick: "Por confirmar", cuota: "—", confianza: 1, analisis: "Análisis por confirmar.", estado: "Pendiente", mercado: "1X2", dia: "hoy" },
];

// Historial: { fecha, partido, pick, resultado, estado }
export const historial = [];

// Tabla: { pos, equipo, pj, dg, pts } (luego se llena con API)
export const tabla = [];

export const faq = [
  { q: "¿Los pronósticos son seguros?", a: "No. Son análisis y ninguno garantiza resultado." },
  { q: "¿Es gratis ver los pronósticos?", a: "Te lo confirmo por WhatsApp." },
  { q: "¿Cuánto tarda la carga?", a: "Te lo confirmo por WhatsApp." },
  { q: "¿Desde qué edad?", a: "Solo mayores de 18 años." },
];
