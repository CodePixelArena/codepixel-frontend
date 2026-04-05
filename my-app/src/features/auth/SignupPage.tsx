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
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        background: "radial-gradient(circle at top, #111827 0%, #020617 70%)",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
      }}
    >
      {/* LEFT SIDE (UNCHANGED) */}
      {!isMobile && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(2rem, 4vw, 3rem)",
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.1), rgba(14,165,233,0.05))",
            borderRight: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎨</div>
            <h2 style={{ color: "#f8fafc", fontSize: "2rem" }}>CodePixel</h2>
            <p style={{ color: "#cbd5e1" }}>
              Join the creative community and paint pixel art together.
            </p>
          </div>
        </div>
      )}

      {/* RIGHT SIDE (IMPROVED) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
          }}
        >
          <h1 style={{ color: "#f8fafc", fontSize: "2rem" }}>
            Create account ✨
          </h1>

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

          <p style={{ color: "#cbd5e1", textAlign: "center" }}>
            Already have an account?{" "}
            <span
              onClick={onBack}
              style={{ color: "#4f46e5", cursor: "pointer" }}
            >
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}