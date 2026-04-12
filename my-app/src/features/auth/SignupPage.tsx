import { useState, useEffect, type CSSProperties } from "react";

interface SignupPageProps {
  onLoginComplete: (username: string) => void;
  onBack: () => void;
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
};

const frameStyle: CSSProperties = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  background: "radial-gradient(circle at top, #111827 0%, #020617 70%)",
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
  borderRight: "1px solid rgba(148,163,184,0.1)",
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

export default function SignupPage({ onLoginComplete, onBack }: SignupPageProps) {
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const isEmailTaken = (email: string) =>
    getUsers().some((u: any) => u.email.toLowerCase() === email.toLowerCase());

  const isNicknameTaken = (nickname: string) =>
    getUsers().some(
      (u: any) => u.nickname.toLowerCase() === nickname.toLowerCase()
    );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nickname.trim()) {
      newErrors.nickname = "Nickname is required";
    } else if (formData.nickname.length < 3) {
      newErrors.nickname = "At least 3 characters";
    } else if (isNicknameTaken(formData.nickname)) {
      newErrors.nickname = "Nickname already taken";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email";
    } else if (isEmailTaken(formData.email)) {
      newErrors.email = "Email already registered";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const users = getUsers();

      const newUser = {
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password,
      };

      users.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(users));

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", formData.nickname);
      localStorage.setItem("userEmail", formData.email);

      onLoginComplete(formData.nickname);
      setIsSubmitting(false);
    }, 400);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
              Register once, solve challenges, and track your colors, submissions, and pixel history from one place.
            </p>
          </div>
        </div>
      )}

      <div style={panelWrapStyle}>
        <form
          onSubmit={handleSubmit}
          style={{
            ...panelStyle,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ marginBottom: "0.8rem", textAlign: "center" }}>
            <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.76rem", color: "#7c93b4" }}>
              Sign up
            </p>
            <h1 style={{ color: "#f8fafc", fontSize: "2rem", margin: "0.7rem 0 0" }}>
              Create account
            </h1>
            <p style={{ color: "#cbd5e1", marginTop: "0.7rem" }}>Set up your account and join the canvas.</p>
          </div>

          <input
            name="nickname"
            placeholder="Nickname"
            value={formData.nickname}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.nickname && <div style={errorStyle}>{errors.nickname}</div>}

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.email && <div style={errorStyle}>{errors.email}</div>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.password && <div style={errorStyle}>{errors.password}</div>}

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.confirmPassword && (
            <div style={errorStyle}>{errors.confirmPassword}</div>
          )}

          <button type="submit" disabled={isSubmitting} style={buttonStyle}>
            {isSubmitting ? "Creating..." : "Create account"}
          </button>

          <div style={{ textAlign: "center", marginTop: "0.4rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(148, 163, 184, 0.12)" }}>
            <p style={{ color: "#cbd5e1" }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={onBack}
                style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", fontWeight: 700 }}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
