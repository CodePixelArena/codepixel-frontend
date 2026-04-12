import { useState, useEffect, type CSSProperties } from "react";

interface LoginPageProps {
  onLoginComplete: (username: string) => void;
  onSignup: () => void;
}

const buttonStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "rgba(15, 23, 42, 0.95)",
  color: "#f8fafc",
  padding: "clamp(0.75rem, 2vw, 0.95rem) clamp(1rem, 3vw, 1.25rem)",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "clamp(0.9rem, 2vw, 1rem)",
  transition: "all 0.2s ease",
  width: "100%",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "clamp(0.65rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)",
  borderRadius: "0.75rem",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  background: "rgba(30, 41, 59, 0.8)",
  color: "#f8fafc",
  fontSize: "clamp(0.9rem, 2vw, 1rem)",
  fontFamily: "inherit",
  transition: "border-color 0.2s ease",
  boxSizing: "border-box",
};

const errorStyle: CSSProperties = {
  color: "#ff6b6b",
  fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
  marginTop: "0.25rem",
};

const frameStyle: CSSProperties = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  background: "radial-gradient(circle at top, #111827 0%, #020617 70%)",
  overflow: "hidden",
  position: "fixed",
  inset: 0,
  zIndex: 9999,
};

const sideStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "clamp(2rem, 4vw, 3rem)",
  background: "linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(14, 165, 233, 0.05))",
  borderRight: "1px solid rgba(148, 163, 184, 0.1)",
  minHeight: "100vh",
};

const sideCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "420px",
  padding: "2rem",
  borderRadius: "1.5rem",
  background: "rgba(15, 23, 42, 0.45)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.18)",
  textAlign: "left",
};

const markStyle: CSSProperties = {
  width: "3.5rem",
  height: "3.5rem",
  borderRadius: "1rem",
  display: "grid",
  placeItems: "center",
  marginBottom: "1.25rem",
  background: "linear-gradient(135deg, rgba(79, 70, 229, 0.92), rgba(14, 165, 233, 0.88))",
  boxShadow: "0 12px 30px rgba(14, 165, 233, 0.18)",
};

const markBarsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 9px)",
  gap: "6px",
};

const markBarStyle = (height: string): CSSProperties => ({
  width: "9px",
  height,
  borderRadius: "999px",
  background: "#f8fafc",
  opacity: 0.95,
});

const panelWrapStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "clamp(1rem, 4vw, 3rem)",
  overflowY: "auto",
};

const panelStyle: CSSProperties = {
  width: "100%",
  maxWidth: "420px",
  padding: "2rem",
  borderRadius: "1.5rem",
  background: "rgba(15, 23, 42, 0.72)",
  border: "1px solid rgba(148, 163, 184, 0.14)",
  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.22)",
  backdropFilter: "blur(12px)",
};

export default function LoginPage({ onLoginComplete, onSignup }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const isMobile = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getUsers = () =>
    JSON.parse(localStorage.getItem("registeredUsers") || "[]");

  const validateLogin = () => {
    const users = getUsers();
    return users.find(
      (u: any) => u.email.toLowerCase() === formData.email.toLowerCase()
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    const user = validateLogin();

    if (!newErrors.email && !newErrors.password) {
      if (!user || user.password !== formData.password) {
        newErrors.general = "Invalid email or password";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const user = validateLogin();
      const username = user.nickname || formData.email.split("@")[0];

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("userEmail", user.email || formData.email);

      onLoginComplete(username);
      setIsSubmitting(false);
    }, 400);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div style={frameStyle}>
      {!isMobile && (
        <div style={sideStyle}>
          <div style={sideCardStyle}>
            <div style={markStyle}>
              <div style={markBarsStyle}>
                <span style={markBarStyle("16px")} />
                <span style={markBarStyle("22px")} />
                <span style={markBarStyle("22px")} />
                <span style={markBarStyle("16px")} />
              </div>
            </div>
            <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "0.78rem", color: "#7c93b4" }}>
              CodePixel
            </p>
            <p style={{ color: "#cbd5e1", marginTop: "1rem", lineHeight: 1.7 }}>
              Solve coding challenges, claim pixels, and keep your progress, colors, and rankings in one place.
            </p>
          </div>
        </div>
      )}

      <div style={panelWrapStyle}>
        <div style={panelStyle}>
          <div style={{ marginBottom: "clamp(2rem, 5vw, 3rem)", textAlign: "center" }}>
            <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.76rem", color: "#7c93b4" }}>
              Sign in
            </p>
            <h1 style={{ color: "#f8fafc", margin: "0.7rem 0 0" }}>Welcome back</h1>
            <p style={{ color: "#cbd5e1", marginTop: "0.7rem" }}>Continue your journey on the canvas.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                style={inputStyle}
              />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                style={inputStyle}
              />
              {errors.password && <div style={errorStyle}>{errors.password}</div>}
            </div>

            {/* ERROR BOX RESTORED */}
            {errors.general && (
              <div
                style={{
                  background: "rgba(255, 107, 107, 0.1)",
                  border: "1px solid rgba(255, 107, 107, 0.3)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                }}
              >
                <div style={errorStyle}>{errors.general}</div>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} style={buttonStyle}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(148, 163, 184, 0.12)" }}>
            <p style={{ color: "#cbd5e1" }}>
              Don't have an account?{" "}
              <button
                onClick={onSignup}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4f46e5",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
