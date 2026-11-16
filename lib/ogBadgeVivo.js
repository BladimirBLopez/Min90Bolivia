export default function BadgeVivo({ size = 28 }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", width: 12, height: 12, borderRadius: 6, background: "#EF4444" }} />
      <div style={{ display: "flex", marginLeft: 10, fontSize: size, fontWeight: 900, color: "#F4E19C", letterSpacing: 1 }}>PARTIDO EN VIVO</div>
    </div>
  );
}
