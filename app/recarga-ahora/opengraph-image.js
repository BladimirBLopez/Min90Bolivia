import { ImageResponse } from "next/og";
import CanchaFondo from "@/lib/ogCancha";
import BadgeVivo from "@/lib/ogBadgeVivo";

export const alt = "Recarga ahora en Metabet | Min90 Bolivia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "56px 64px",
          background: "#103522",
          color: "white",
        }}
      >
        <CanchaFondo />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", flex: 1 }}>
          <BadgeVivo size={28} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 118, fontWeight: 800, lineHeight: 1, color: "#D4AF37" }}>Recarga ahora</div>
            <div style={{ display: "flex", fontSize: 54, fontWeight: 700, marginTop: 14 }}>y juega en Metabet</div>
            <div style={{ display: "flex", fontSize: 32, color: "#e5e7eb", marginTop: 18 }}>Al instante · Atención 24 horas</div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                padding: "16px 38px",
                borderRadius: 999,
                background: "#D4AF37",
                color: "#111",
                fontSize: 32,
                fontWeight: 800,
              }}
            >
              Escríbenos por WhatsApp
            </div>
            <div style={{ display: "flex", marginLeft: 24, fontSize: 28, color: "#9ca3af" }}>Solo +18</div>
          </div>
        </div>

        <div style={{ display: "flex", width: 400, marginLeft: 30, alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 380,
              borderRadius: 28,
              overflow: "hidden",
              background: "#ECE5DD",
              transform: "rotate(3deg)",
            }}
          >
            <div style={{ display: "flex", background: "#075E54", color: "white", padding: "16px 22px", fontSize: 26, fontWeight: 700 }}>
              Min90 Bolivia
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-end",
                  background: "#DCF8C6",
                  color: "#111",
                  padding: "12px 18px",
                  borderRadius: 18,
                  fontSize: 26,
                }}
              >
                Hola, quiero recargar ahora
              </div>
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  maxWidth: 310,
                  marginTop: 14,
                  background: "white",
                  color: "#111",
                  padding: "12px 18px",
                  borderRadius: 18,
                  fontSize: 26,
                }}
              >
                Te enviamos el QR para pagar
              </div>
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  maxWidth: 310,
                  marginTop: 14,
                  background: "white",
                  color: "#111",
                  padding: "12px 18px",
                  borderRadius: 18,
                  fontSize: 26,
                }}
              >
                Listo, ya tienes saldo para jugar
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
