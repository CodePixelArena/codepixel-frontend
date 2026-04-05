import { useEffect, useState, type CSSProperties } from "react";
import PixelCanvas from "./features/canvas/PixelCanvas";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import Statistics from "./features/canvas/Statistics";
import AboutUs from "./features/canvas/AboutUs";
import Profile from "./features/canvas/Profile";
import Pixels from "./features/canvas/Pixels";

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
    return normalizedPath === "/board" ? "board" : normalizedPath === "/login" ? "login" : normalizedPath === "/signup" ? "signup" : normalizedPath === "/statistics" ? "statistics" : normalizedPath === "/aboutus" ? "aboutus" : normalizedPath === "/profile" ? "profile" : normalizedPath === "/pixels" ? "pixels" : "home";
  };

  const [page, setPage] = useState<"home" | "login" | "signup" | "board" | "statistics" | "aboutus" | "profile" | "pixels">(getCurrentPage);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if user is logged in from localStorage
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const username = localStorage.getItem("username") || "U";
  const avatarLetter = username.charAt(0).toUpperCase();

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

  const handleLogin = () => {
    window.history.pushState(null, "", "/login");
    setPage("login");
  };

  const handleSignup = () => {
    window.history.pushState(null, "", "/signup");
    setPage("signup");
  };

  const handleLoginComplete = (username: string) => {
    setIsLoggedIn(true);
    localStorage.setItem("username", username);
    window.history.pushState(null, "", "/");
    setPage("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    setIsAvatarMenuOpen(false);
  };


  return (
    <div
      style={
        page === "board"
          ? { width: "100%", height: "100vh", overflow: "hidden" }
          : {
              minHeight: "100vh",
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "radial-gradient(circle at top, #111827 0%, #020617 70%)",
            }
      }
    >
      {page === "login" ? (
        <LoginPage onLoginComplete={handleLoginComplete} onSignup={handleSignup} />
      ) : page === "signup" ? (
        <SignupPage onLoginComplete={handleLoginComplete} onBack={handleLogin} />
      ) : page === "home" ? (
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
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {!isLoggedIn && (
                  <button
                    type="button"
                    onClick={handleLogin}
                    style={buttonStyle}
                  >
                    Log in
                  </button>
                )}
                {isLoggedIn && (
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
                      {avatarLetter}
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
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
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
      ) : page === "board" ? (
        <PixelCanvas isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setPage={setPage} />
      ) : page === "statistics" ? (
        <Statistics onBack={openBoard} />
      ) : page === "aboutus" ? (
        <AboutUs onBack={openBoard} />
      ) : page === "profile" ? (
        <Profile onBack={openBoard} setPage={setPage} />
      ) : page === "pixels" ? (
        <Pixels onBack={openBoard} />
      ) : null}
    </div>
  );
}

export default App;
