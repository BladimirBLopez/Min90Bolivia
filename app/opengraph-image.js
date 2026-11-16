import { ImageResponse } from "next/og";
import CanchaFondo from "@/lib/ogCancha";

export const alt = "Min90 Bolivia - Pronósticos del fútbol boliviano";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const pildora = { display: "flex", padding: "10px 30px", borderRadius: 999, background: "white", border: "3px solid #C9A227", fontSize: 34, fontWeight: 800, color: "#334155" };

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative", background: "#103522", color: "white" }}>
        <CanchaFondo />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 84, background: "#C9A227", fontSize: 36, fontWeight: 900, color: "#0f172a" }}>PRIMERA DIVISIÓN DE BOLIVIA · 2026</div>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 900, letterSpacing: -4 }}>
            <span>Min</span>
            <span style={{ color: "#C9A227" }}>90</span>
            <span style={{ marginLeft: 24 }}>Bolivia</span>
          </div>
          <div style={{ display: "flex", fontSize: 50, fontWeight: 800, marginTop: 6, color: "#F4E19C" }}>Pronósticos del fútbol boliviano</div>
          <div style={{ display: "flex", marginTop: 34 }}>
            <div style={pildora}>Partidos de hoy</div>
            <div style={{ ...pildora, marginLeft: 16 }}>Estadísticas</div>
            <div style={{ ...pildora, marginLeft: 16 }}>Picks gratis</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 26 }}>
          <div style={{ display: "flex", padding: "14px 40px", borderRadius: 999, background: "#22c55e", color: "black", fontSize: 36, fontWeight: 800 }}>Cargar saldo por WhatsApp</div>
          <div style={{ display: "flex", marginLeft: 22, fontSize: 26, color: "#f1f5f9" }}>+18 · Juega con responsabilidad</div>
        </div>
      </div>
    ),
    size
  );
}
