import { type CSSProperties } from "react";
import { getStatisticsData } from "./mockPlatformData";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "clamp(1.25rem, 3vw, 2.5rem)",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  background: "radial-gradient(circle at top, #111827 0%, #020617 70%)",
};

const panelStyle: CSSProperties = {
  width: "100%",
  maxWidth: "1100px",
  padding: "clamp(1.4rem, 3vw, 2.2rem)",
  borderRadius: "1.5rem",
  background: "rgba(15, 23, 42, 0.96)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  boxShadow: "0 32px 80px rgba(0, 0, 0, 0.24)",
};

const sectionStyle: CSSProperties = {
  padding: "1.1rem",
  borderRadius: "1rem",
  background: "rgba(15, 23, 42, 0.72)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
};

const buttonStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "rgba(15, 23, 42, 0.95)",
  color: "#f8fafc",
  padding: "0.9rem 1.2rem",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: 700,
};

interface StatisticsProps {
  onBack: () => void;
}

export default function Statistics({ onBack }: StatisticsProps) {
  const { overview, topPlayers, pixelOwners, recentHistory } = getStatisticsData();

  return (
    <div style={pageStyle}>
      <div style={panelStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "flex-start",
            marginBottom: "1.75rem",
          }}
        >
          <div style={{ maxWidth: "34rem" }}>
            <p style={{ margin: 0, color: "#7c93b4", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.78rem" }}>
              Statistics
            </p>
            <h1 style={{ margin: "0.55rem 0 0.75rem", color: "#f8fafc", fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>
              Board activity at a glance
            </h1>
            <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.7 }}>
              Minimal overview of competitive activity, pixel ownership, and the players currently leading the board.
            </p>
          </div>
          <button style={buttonStyle} onClick={onBack}>
            Back to Board
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          {overview.map((item) => (
            <div key={item.label} style={sectionStyle}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.84rem" }}>{item.label}</p>
              <div style={{ marginTop: "0.55rem", fontSize: "1.8rem", fontWeight: 700, color: "#f8fafc" }}>{item.value}</div>
              <p style={{ margin: "0.45rem 0 0", color: "#7c93b4", fontSize: "0.84rem", lineHeight: 1.5 }}>{item.note}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <section style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.05rem" }}>Top players</h2>
                <p style={{ margin: "0.35rem 0 0", color: "#7c93b4", fontSize: "0.9rem" }}>
                  Ranked by solved challenges and consistent performance.
                </p>
              </div>
              <div style={{ color: "#7c93b4", fontSize: "0.85rem" }}>Default frontend snapshot</div>
            </div>

            <div style={{ display: "grid", gap: "0.8rem" }}>
              {topPlayers.map((player) => (
                <div
                  key={player.username}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto auto",
                    gap: "0.85rem",
                    alignItems: "center",
                    padding: "0.9rem 1rem",
                    borderRadius: "0.95rem",
                    background: "rgba(30, 41, 59, 0.56)",
                  }}
                >
                  <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: "1rem" }}>#{player.rank}</div>
                  <div>
                    <div style={{ color: "#f8fafc", fontWeight: 600 }}>@{player.username}</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.84rem" }}>{player.solvedChallenges} solved challenges</div>
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: "0.84rem" }}>{player.submissions} submissions</div>
                  <div style={{ color: "#38bdf8", fontWeight: 700 }}>{player.accuracy}%</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ display: "grid", gap: "1rem" }}>
            <div style={sectionStyle}>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.05rem" }}>Most pixel owners</h2>
              <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
                {pixelOwners.map((player) => (
                  <div key={player.username} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#f8fafc", fontWeight: 600 }}>@{player.username}</div>
                      <div style={{ color: "#94a3b8", fontSize: "0.82rem" }}>{player.solvedChallenges} wins</div>
                    </div>
                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>{player.ownedPixels} px</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={sectionStyle}>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.05rem" }}>Recent ownership changes</h2>
              <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
                {recentHistory.map((entry) => (
                  <div key={`${entry.label}-${entry.time}`} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", color: "#cbd5e1" }}>
                    <span>{entry.label}</span>
                    <span style={{ color: "#7c93b4", whiteSpace: "nowrap" }}>{entry.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
