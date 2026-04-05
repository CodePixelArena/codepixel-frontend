import { useEffect, useState, type CSSProperties } from "react";
import PixelCanvas from "./features/canvas/PixelCanvas";

const buttonStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "rgba(15, 23, 42, 0.95)",
  color: "#f8fafc",
  padding: "0.95rem 1.25rem",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: 700,
};

function App() {
  const getCurrentPage = () => {
    const normalizedPath = window.location.pathname.replace(/\/$/, "");
    return normalizedPath === "/board" ? "board" : "home";
  };

  const [page, setPage] = useState<"home" | "board">(getCurrentPage);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  useEffect(() => {
    // TODO: future token validation via ping/pong auth requests

    const handlePopState = () => {
      setPage(getCurrentPage());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openBoard = () => {
    window.history.pushState(null, "", "/board");
    setPage("board");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top, #111827 0%, #020617 70%)",
      }}
    >
      {page === "home" ? (
        <main
          style={{
            width: "100%",
            maxWidth: "760px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            padding: "1rem",
          }}
        >
          <section
            style={{
              position: "relative",
              width: "100%",
              padding: "2rem",
              borderRadius: "1.5rem",
              background: "rgba(15, 23, 42, 0.98)",
              border: "1px solid rgba(148, 163, 184, 0.12)",
              boxShadow: "0 32px 80px rgba(0, 0, 0, 0.24)",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              textAlign: "left",
              gap: "1.75rem",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
                paddingBottom: "1rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "0.78rem", color: "#7c93b4" }}>
                  Welcome
                </p>
                <h1 style={{ margin: "0.6rem 0 0", fontSize: "clamp(2rem, 3vw, 3rem)", color: "#f8fafc", lineHeight: 1.05 }}>
                  CodePixel
                </h1>
                <p style={{ margin: "1rem 0 0", color: "#cbd5e1", lineHeight: 1.7, maxWidth: "40rem" }}>
                  Jump into the board and start painting pixels.
                </p>
              </div>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setIsAvatarMenuOpen((current) => !current)}
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "999px",
                    background: "linear-gradient(135deg, #4f46e5, #0ea5e9)",
                    display: "grid",
                    placeItems: "center",
                    color: "#f8fafc",
                    fontWeight: 700,
                    boxShadow: "0 14px 28px rgba(0, 0, 0, 0.28)",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-label="Open avatar menu"
                >
                  U
                </button>
                {isAvatarMenuOpen ? (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      marginTop: "0.85rem",
                      width: "11rem",
                      borderRadius: "1rem",
                      background: "rgba(15, 23, 42, 0.98)",
                      border: "1px solid rgba(148, 163, 184, 0.15)",
                      boxShadow: "0 16px 35px rgba(0, 0, 0, 0.2)",
                      zIndex: 10,
                      overflow: "hidden",
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem",
                        border: "none",
                        background: "transparent",
                        color: "#f8fafc",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                      onClick={() => setIsAvatarMenuOpen(false)}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem",
                        border: "none",
                        background: "transparent",
                        color: "#f8fafc",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                      onClick={() => setIsAvatarMenuOpen(false)}
                    >
                      Sign in
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "22rem", alignSelf: "center" }}>
              <button
                type="button"
                style={buttonStyle}
                onClick={openBoard}
              >
                Play
              </button>
            </div>
          </section>

        </main>
      ) : (
        <div style={{ width: "100%", maxWidth: "100%" }}>
          <PixelCanvas />
        </div>
      )}
    </div>
  );
}

export default App;
