import { type CSSProperties } from "react";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "radial-gradient(circle at top, #111827 0%, #020617 70%)",
};

const contentStyle: CSSProperties = {
  width: "100%",
  maxWidth: "800px",
  padding: "2rem",
  borderRadius: "1.5rem",
  background: "rgba(15, 23, 42, 0.98)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  boxShadow: "0 32px 80px rgba(0, 0, 0, 0.24)",
  textAlign: "center",
};

const pixelGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(10, 1fr)",
  gap: "1px",
  margin: "2rem auto",
  width: "200px",
  height: "200px",
};

const buttonStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "rgba(15, 23, 42, 0.95)",
  color: "#f8fafc",
  padding: "0.75rem 1.5rem",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontWeight: 600,
  margin: "0.5rem",
};

interface PixelsProps {
  onBack: () => void;
}

export default function Pixels({ onBack }: PixelsProps) {
  // Placeholder owned pixels - in a real app, this would come from user data

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <h1 style={{ color: "#f8fafc", marginBottom: "1rem" }}>Your Pixels</h1>
        <p style={{ color: "#cbd5e1", marginBottom: "2rem" }}>
          View the pixels you own on the canvas.
        </p>
        <div style={pixelGridStyle}>
        </div>
        <button style={buttonStyle} onClick={onBack}>
          Back to Board
        </button>
      </div>
    </div>
  );
}