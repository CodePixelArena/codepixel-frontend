import { useState, type CSSProperties } from "react";
import { getProfileData } from "./mockPlatformData";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "clamp(1.25rem, 3vw, 2.5rem)",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  background: "radial-gradient(circle at top, #111827 0%, #020617 70%)",
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: "1160px",
  display: "grid",
  gridTemplateColumns: "minmax(0, 320px) minmax(0, 1fr)",
  gap: "1rem",
};

const cardStyle: CSSProperties = {
  padding: "1.25rem",
  borderRadius: "1.2rem",
  background: "rgba(15, 23, 42, 0.96)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.2)",
};

const sectionStyle: CSSProperties = {
  ...cardStyle,
  boxShadow: "none",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.85rem 0.95rem",
  borderRadius: "0.85rem",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "rgba(30, 41, 59, 0.65)",
  color: "#f8fafc",
  fontSize: "0.95rem",
};

const buttonStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "rgba(15, 23, 42, 0.95)",
  color: "#f8fafc",
  padding: "0.9rem 1.15rem",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: 700,
};

interface ProfileProps {
  onBack: () => void;
  setPage?: (page: "home" | "login" | "signup" | "board" | "statistics" | "aboutus" | "profile") => void;
}

export default function Profile({ onBack, setPage }: ProfileProps) {
  const profile = getProfileData();
  const [displayName, setDisplayName] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const openStatistics = () => {
    window.history.pushState(null, "", "/statistics");
    setPage?.("statistics");
  };

  return (
    <div style={pageStyle}>
      <div style={shellStyle}>
        <aside style={cardStyle}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(148, 163, 184, 0.12)" }}>
            <div
              style={{
                width: "82px",
                height: "82px",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: "#f8fafc",
                fontSize: "1.9rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #4f46e5, #0ea5e9)",
                marginBottom: "0.9rem",
              }}
            >
              {avatarLetter}
            </div>
            <h1 style={{ margin: 0, color: "#f8fafc", fontSize: "1.65rem" }}>{displayName}</h1>
            <p style={{ margin: "0.4rem 0 0", color: "#94a3b8" }}>{email}</p>
            <p style={{ margin: "0.6rem 0 0", color: "#7c93b4", fontSize: "0.86rem" }}>{profile.joinedLabel}</p>
          </div>

          <div style={{ display: "grid", gap: "0.8rem", marginTop: "1.15rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
              <div style={{ padding: "0.95rem", borderRadius: "0.95rem", background: "rgba(30, 41, 59, 0.55)" }}>
                <div style={{ color: "#94a3b8", fontSize: "0.82rem" }}>Owned pixels</div>
                <div style={{ color: "#f8fafc", fontSize: "1.55rem", fontWeight: 700, marginTop: "0.35rem" }}>{profile.ownedPixels.length}</div>
              </div>
              <div style={{ padding: "0.95rem", borderRadius: "0.95rem", background: "rgba(30, 41, 59, 0.55)" }}>
                <div style={{ color: "#94a3b8", fontSize: "0.82rem" }}>Rank</div>
                <div style={{ color: "#f8fafc", fontSize: "1.55rem", fontWeight: 700, marginTop: "0.35rem" }}>#{profile.rank}</div>
              </div>
            </div>
            <div style={{ padding: "1rem", borderRadius: "0.95rem", background: "rgba(30, 41, 59, 0.55)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <span style={{ color: "#94a3b8" }}>Accepted rate</span>
                <span style={{ color: "#38bdf8", fontWeight: 700 }}>{profile.acceptedRate}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "0.55rem" }}>
                <span style={{ color: "#94a3b8" }}>Evaluation score</span>
                <span style={{ color: "#f8fafc", fontWeight: 700 }}>{profile.evaluationScore}/100</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "0.55rem" }}>
                <span style={{ color: "#94a3b8" }}>Solved challenges</span>
                <span style={{ color: "#f8fafc", fontWeight: 700 }}>{profile.solvedChallenges}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.75rem", marginTop: "1.15rem" }}>
            <button style={buttonStyle} onClick={openStatistics}>
              Open Statistics
            </button>
            <button style={buttonStyle} onClick={onBack}>
              Back to Board
            </button>
          </div>
        </aside>

        <main style={{ display: "grid", gap: "1rem" }}>
          <section style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <div>
                <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.1rem" }}>Minimal settings</h2>
                <p style={{ margin: "0.35rem 0 0", color: "#7c93b4" }}>Basic profile details and lightweight preferences.</p>
              </div>
              <div style={{ color: "#7c93b4", fontSize: "0.85rem" }}>Frontend-only draft</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem" }}>
              <label style={{ display: "grid", gap: "0.5rem" }}>
                <span style={{ color: "#cbd5e1", fontSize: "0.88rem" }}>Display name</span>
                <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} style={inputStyle} />
              </label>
              <label style={{ display: "grid", gap: "0.5rem" }}>
                <span style={{ color: "#cbd5e1", fontSize: "0.88rem" }}>Email</span>
                <input value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} />
              </label>
            </div>

            <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
              <label style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", padding: "0.95rem 1rem", borderRadius: "0.95rem", background: "rgba(30, 41, 59, 0.55)" }}>
                <span style={{ color: "#f8fafc" }}>Challenge result notifications</span>
                <input type="checkbox" checked={notifications} onChange={() => setNotifications((value) => !value)} />
              </label>
              <label style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", padding: "0.95rem 1rem", borderRadius: "0.95rem", background: "rgba(30, 41, 59, 0.55)" }}>
                <span style={{ color: "#f8fafc" }}>Public profile visibility</span>
                <input type="checkbox" checked={publicProfile} onChange={() => setPublicProfile((value) => !value)} />
              </label>
            </div>
          </section>

          <section style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <div>
                <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.1rem" }}>Managing pixels</h2>
                <p style={{ margin: "0.35rem 0 0", color: "#7c93b4" }}>Owned pixel coordinates, linked challenge, and current color.</p>
              </div>
              <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{profile.ownedPixels.length} tracked cells</div>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              {profile.ownedPixels.map((pixel) => (
                <div
                  key={pixel.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto minmax(0, 1fr) auto auto",
                    gap: "0.9rem",
                    alignItems: "center",
                    padding: "0.95rem 1rem",
                    borderRadius: "0.95rem",
                    background: "rgba(30, 41, 59, 0.55)",
                  }}
                >
                  <div style={{ width: "20px", height: "20px", borderRadius: "999px", background: pixel.color, border: "1px solid rgba(255, 255, 255, 0.2)" }} />
                  <div>
                    <div style={{ color: "#f8fafc", fontWeight: 600 }}>
                      ({pixel.x}, {pixel.y}) · {pixel.challenge}
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "0.83rem" }}>Updated {pixel.updatedAt}</div>
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: "0.84rem" }}>{pixel.color}</div>
                  <div style={{ color: pixel.status === "Contested" ? "#f97316" : "#38bdf8", fontWeight: 700, fontSize: "0.84rem" }}>{pixel.status}</div>
                </div>
              ))}
            </div>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "1rem" }}>
            <section style={sectionStyle}>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.1rem" }}>Statistics</h2>
              <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                  <span style={{ color: "#94a3b8" }}>Successful submissions</span>
                  <span style={{ color: "#f8fafc", fontWeight: 700 }}>{profile.evaluations.filter((entry) => entry.verdict === "Accepted").length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                  <span style={{ color: "#94a3b8" }}>Total submissions</span>
                  <span style={{ color: "#f8fafc", fontWeight: 700 }}>{profile.submissions}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                  <span style={{ color: "#94a3b8" }}>Board ownership share</span>
                  <span style={{ color: "#f8fafc", fontWeight: 700 }}>4.2%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                  <span style={{ color: "#94a3b8" }}>Current streak</span>
                  <span style={{ color: "#f8fafc", fontWeight: 700 }}>3 accepted</span>
                </div>
              </div>
            </section>

            <section style={sectionStyle}>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.1rem" }}>Pixel history</h2>
              <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
                {profile.history.map((entry) => (
                  <div key={entry.id} style={{ padding: "0.85rem 0.95rem", borderRadius: "0.9rem", background: "rgba(30, 41, 59, 0.55)" }}>
                    <div style={{ color: "#f8fafc", fontWeight: 600 }}>
                      {entry.pixel} · {entry.challenge}
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "0.84rem", marginTop: "0.3rem" }}>
                      {entry.previousOwner} → {entry.newOwner}
                    </div>
                    <div style={{ color: "#7c93b4", fontSize: "0.8rem", marginTop: "0.3rem" }}>{entry.changedAt}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section style={sectionStyle}>
            <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.1rem" }}>Evaluations</h2>
            <p style={{ margin: "0.35rem 0 1rem", color: "#7c93b4" }}>Recent submission history with verdict and runtime snapshot.</p>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {profile.evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1.2fr) auto auto auto",
                    gap: "0.8rem",
                    alignItems: "center",
                    padding: "0.95rem 1rem",
                    borderRadius: "0.95rem",
                    background: "rgba(30, 41, 59, 0.55)",
                  }}
                >
                  <div>
                    <div style={{ color: "#f8fafc", fontWeight: 600 }}>{evaluation.challenge}</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.83rem" }}>{evaluation.submittedAt}</div>
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: "0.84rem" }}>{evaluation.difficulty}</div>
                  <div style={{ color: evaluation.verdict === "Accepted" ? "#22c55e" : "#f97316", fontWeight: 700, fontSize: "0.84rem" }}>{evaluation.verdict}</div>
                  <div style={{ color: "#f8fafc", fontSize: "0.84rem", textAlign: "right" }}>
                    {evaluation.runtime} · {evaluation.score}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
