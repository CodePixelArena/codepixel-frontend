import { useEffect, useRef, useState } from "react";
import styles from "../canvas/PixelCanvas.module.css";

interface PixelToolbarProps {
  status: "connecting" | "connected" | "disconnected" | "error";
  cooldown: number;
  selectedColor: string;
  gridWidth: number;
  gridHeight: number;
  hoverCell: { x: number; y: number } | null;
  isLoggedIn?: boolean;
  setIsLoggedIn?: (value: boolean) => void;
  setPage?: (page: "home" | "login" | "signup" | "board" | "statistics" | "aboutus" | "profile" | "pixels") => void;
}

const STATUS_DOT_CLASS: Record<string, string> = {
  connected: styles.statusDotConnected,
  connecting: styles.statusDotConnecting,
  disconnected: styles.statusDotDisconnected,
  error: styles.statusDotError,
};

export default function PixelToolbar({ 
  status, 
  cooldown, 
  selectedColor, 
  gridWidth, 
  gridHeight, 
  hoverCell,
  isLoggedIn = false,
  setIsLoggedIn,
  setPage,
}: PixelToolbarProps) {
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const username = localStorage.getItem("username") || "U";
  const avatarLetter = username.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAvatarMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn?.(false);
    setIsAvatarMenuOpen(false);
  };

  return (
    <header className={styles.toolbar}>
      <div className={styles.toolbarBrand}>
        <span className={styles.toolbarTitle}>CodePixel</span>
        <span className={styles.toolbarBadge}>Board</span>
      </div>

      <div className={styles.toolbarDivider} />

      <div className={styles.toolbarNav}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => { window.history.pushState(null, "", "/statistics"); setPage?.("statistics"); }}
        >
          Statistics
        </button>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => { window.history.pushState(null, "", "/aboutus"); setPage?.("aboutus"); }}
        >
          About Us
        </button>
      </div>

      <div className={styles.toolbarDivider} />

      <div className={styles.toolbarStats}>
        <div className={styles.toolbarStat}>
          <span className={`${styles.statusDot} ${STATUS_DOT_CLASS[status] ?? ""}`} />
          <span className={styles.statValue}>{status}</span>
        </div>

        <span className={styles.toolbarStatSep} />

        <div className={styles.toolbarStat}>
          <span className={styles.statLabel}>Cooldown</span>
          <span className={`${styles.statValue} ${cooldown > 0 ? styles.statValueCooldown : ""}`}>
            {cooldown > 0 ? `${cooldown}s` : "Ready"}
          </span>
        </div>

        <span className={styles.toolbarStatSep} />

        <div className={styles.toolbarStat}>
          <span className={styles.statLabel}>Grid</span>
          <span className={styles.statValue}>{gridWidth}×{gridHeight}</span>
        </div>

        <span className={styles.toolbarStatSep} />

        <div className={styles.toolbarStat}>
          <span className={styles.statLabel}>Cursor</span>
          <span className={styles.statValue}>{hoverCell ? `${hoverCell.x}, ${hoverCell.y}` : "—"}</span>
        </div>

        <span className={styles.toolbarStatSep} />

        <div className={styles.toolbarStat}>
          <span className={styles.colorChip} style={{ background: selectedColor }} title={`Color: ${selectedColor}`} />
          <span className={styles.statValue}>{selectedColor}</span>
        </div>
      </div>

      <div className={styles.avatarWrapper} ref={menuRef}>
        {isLoggedIn ? (
          <>
            <button
              type="button"
              className={styles.avatarButton}
              onClick={() => setIsAvatarMenuOpen((current) => !current)}
              aria-label="Open avatar menu"
              aria-expanded={isAvatarMenuOpen}
            >
              {avatarLetter}
            </button>
            {isAvatarMenuOpen ? (
              <div className={styles.avatarMenu}>
                <button type="button" className={styles.avatarMenuItem} onClick={() => { window.history.pushState(null, "", "/profile"); setPage?.("profile"); setIsAvatarMenuOpen(false); }}>
                  Profile
                </button>
                <button type="button" className={styles.avatarMenuItem} onClick={() => { window.history.pushState(null, "", "/pixels"); setPage?.("pixels"); setIsAvatarMenuOpen(false); }}>
                  Pixels
                </button>
                <button type="button" className={styles.avatarMenuItem} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </header>
  );
}
