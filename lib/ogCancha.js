
export default function CanchaFondo() {
  const linea = "rgba(238,255,244,0.23)";

  return (
    <div style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      overflow: "hidden",
      background: "linear-gradient(90deg, #103522 0%, #103522 12.5%, #17402a 12.5%, #17402a 25%, #103522 25%, #103522 37.5%, #17402a 37.5%, #17402a 50%, #103522 50%, #103522 62.5%, #17402a 62.5%, #17402a 75%, #103522 75%, #103522 87.5%, #17402a 87.5%, #17402a 100%)"
    }}>
      <div style={{
        position: "absolute", left: 66, top: 48,
        width: 1068, height: 534,
        border: "3px solid " + linea
      }} />
      <div style={{
        position: "absolute", left: 598, top: 48,
        width: 3, height: 534, background: linea
      }} />
      <div style={{
        position: "absolute", left: 505, top: 221,
        width: 190, height: 190,
        borderRadius: 100,
        border: "3px solid " + linea
      }} />
      <div style={{
        position: "absolute", left: 66, top: 175,
        width: 188, height: 280,
        border: "3px solid " + linea,
        borderLeft: "none"
      }} />
      <div style={{
        position: "absolute", right: 66, top: 175,
        width: 188, height: 280,
        border: "3px solid " + linea,
        borderRight: "none"
      }} />
      <div style={{
        position: "absolute", left: 66, top: 243,
        width: 70, height: 144,
        border: "3px solid " + linea,
        borderLeft: "none"
      }} />
      <div style={{
        position: "absolute", right: 66, top: 243,
        width: 70, height: 144,
        border: "3px solid " + linea,
        borderRight: "none"
      }} />
    </div>
  );
}
