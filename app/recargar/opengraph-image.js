import { ImageResponse } from "next/og";

export const alt = "Recarga ahora en Metabet con atención directa por WhatsApp | Min90 Bolivia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const chips = ["Te creamos la cuenta", "Pagas por QR", "Picks gratis"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "linear-gradient(135deg, #1c1500, #0b0b0b)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", fontSize: 46, fontWeight: 800 }}>
          <span>Min</span>
          <span style={{ color: "#D4AF37" }}>90</span>
          <span style={{ marginLeft: 12 }}>Bolivia</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>Recarga ahora</div>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, lineHeight: 1.05, color: "#D4AF37" }}>y juega en Metabet</div>
          <div style={{ display: "flex", marginTop: 28 }}>
            {chips.map((c, i) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  padding: "10px 24px",
                  borderRadius: 999,
                  border: "2px solid #D4AF37",
                  color: "#F4E19C",
                  fontSize: 30,
                  fontWeight: 700,
                  marginLeft: i ? 14 : 0,
                }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              padding: "16px 40px",
              borderRadius: 999,
              background: "#D4AF37",
              color: "black",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            Recarga ahora por WhatsApp
          </div>
          <div style={{ display: "flex", marginLeft: 28, fontSize: 26, color: "#9ca3af" }}>+18 · Juega con responsabilidad</div>
        </div>
      </div>
    ),
    size
  );
}
