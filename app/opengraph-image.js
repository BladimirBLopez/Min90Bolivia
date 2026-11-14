import { ImageResponse } from "next/og";

export const alt = "Min90 Bolivia - Pronósticos del fútbol boliviano";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #052e16, #0a0a0a)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", fontSize: 120, fontWeight: 800 }}>
          <span>Min</span>
          <span style={{ color: "#22c55e" }}>90</span>
          <span style={{ marginLeft: 24 }}>Bolivia</span>
        </div>
        <div style={{ display: "flex", fontSize: 48, marginTop: 24, color: "#d4d4d4" }}>
          Pronósticos del fútbol boliviano
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            padding: "16px 40px",
            borderRadius: 999,
            background: "#22c55e",
            color: "black",
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          Escríbenos por WhatsApp
        </div>
      </div>
    ),
    size
  );
}
