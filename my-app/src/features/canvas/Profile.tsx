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
  maxWidth: "700px",
  padding: "2.5rem",
  borderRadius: "1.5rem",
  background: "rgba(15, 23, 42, 0.98)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  boxShadow: "0 32px 80px rgba(0, 0, 0, 0.24)",
};

const headerStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: "2.5rem",
  paddingBottom: "2rem",
  borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
};

const avatarStyle: CSSProperties = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #0ea5e9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#f8fafc",
  margin: "0 auto 1rem",
};

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "1rem",
  marginBottom: "2rem",
};

const statCardStyle: CSSProperties = {
  background: "rgba(30, 41, 59, 0.5)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  borderRadius: "0.75rem",
  padding: "1.25rem",
  textAlign: "center",
};

const statNumberStyle: CSSProperties = {
  fontSize: "1.75rem",
  fontWeight: "700",
  color: "#7c6af5",
  marginBottom: "0.25rem",
};

const statLabelStyle: CSSProperties = {
  fontSize: "0.75rem",
  color: "#7a7a95",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const buttonsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
  marginBottom: "1rem",
};

const actionButtonStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "rgba(15, 23, 42, 0.95)",
  color: "#f8fafc",
  padding: "0.9rem 1.25rem",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.9rem",
  transition: "all 0.2s ease",
};

const backButtonStyle: CSSProperties = {
  ...actionButtonStyle,
  width: "100%",
  background: "rgba(124, 106, 245, 0.1)",
  border: "1px solid rgba(124, 106, 245, 0.3)",
  color: "#7c6af5",
};

interface ProfileProps {
  onBack: () => void;
  setPage?: (page: "home" | "login" | "signup" | "board" | "statistics" | "aboutus" | "profile" | "pixels") => void;
}

export default function Profile({ onBack, setPage }: ProfileProps) {
  const username = localStorage.getItem("username") || "User";
  const avatarLetter = username.charAt(0).toUpperCase();
  const email = localStorage.getItem("userEmail") || "user@example.com";

  const handleNavigate = (page: "pixels") => {
    window.history.pushState(null, "", `/${page}`);
    setPage?.(page);
  };

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={avatarStyle}>{avatarLetter}</div>
          <h1 style={{ color: "#f8fafc", marginBottom: "0.5rem" }}>{username}</h1>
          <p style={{ color: "#7a7a95", fontSize: "0.9rem" }}>{email}</p>
        </div>

        {/* Stats */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>0</div>
            <div style={statLabelStyle}>Owned Pixels</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>0</div>
            <div style={statLabelStyle}>Submissions</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>0</div>
            <div style={statLabelStyle}>Rank</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={buttonsGridStyle}>
          <button style={actionButtonStyle} onClick={() => handleNavigate("pixels")}>
            Current Tasks
          </button>
          <button style={actionButtonStyle}>
            Submissions
          </button>
          <button style={actionButtonStyle}>
            Results
          </button>
          <button style={actionButtonStyle}>
            Settings
          </button>
        </div>

        {/* Back Button */}
        <button style={backButtonStyle} onClick={onBack}>
          Back to Board
        </button>
      </div>
    </div>
  );
}