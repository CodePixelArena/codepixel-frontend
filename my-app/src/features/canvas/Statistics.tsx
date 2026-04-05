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
  maxWidth: "760px",
  padding: "2rem",
  borderRadius: "1.5rem",
  background: "rgba(15, 23, 42, 0.98)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  boxShadow: "0 32px 80px rgba(0, 0, 0, 0.24)",
  textAlign: "center",
};

const buttonStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "rgba(15, 23, 42, 0.95)",
  color: "#f8fafc",
  padding: "0.95rem 1.25rem",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: 700,
  margin: "0.5rem",
};

interface StatisticsProps {
  onBack: () => void;
}

export default function Statistics({ onBack }: StatisticsProps) {
  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <h1 style={{ color: "#f8fafc", marginBottom: "1rem" }}>Statistics</h1>
        <p style={{ color: "#cbd5e1", marginBottom: "2rem" }}>
          Here you can view statistics about the pixel art canvas, user activity, and more.
        </p>
        {/* Add actual statistics here */}
        <p style={{ color: "#cbd5e1" }}>Total pixels placed: Coming soon...</p>
        <p style={{ color: "#cbd5e1" }}>Active users: Coming soon...</p>
        <button style={buttonStyle} onClick={onBack}>
          Back to Board
        </button>
      </div>
    </div>
  );
}