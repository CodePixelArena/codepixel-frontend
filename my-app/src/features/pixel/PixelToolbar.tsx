import { useEffect, useRef, useState } from "react";
import styles from "../canvas/PixelCanvas.module.css";

interface PixelToolbarProps {
  status: "connecting" | "connected" | "disconnected" | "error";
  cooldown: number;
  selectedColor: string;
  gridWidth: number;
  gridHeight: number;
  hoverCell: { x: number; y: number } | null;
}

const STATUS_DOT_CLASS: Record<string, string> = {
  connected: styles.statusDotConnected,
  connecting: styles.statusDotConnecting,
  disconnected: styles.statusDotDisconnected,
  error: styles.statusDotError,
};

export default function PixelToolbar({ status, cooldown, selectedColor, gridWidth, gridHeight, hoverCell }: PixelToolbarProps) {
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAvatarMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.toolbar}>
      <div className={styles.toolbarBrand}>
        <span className={styles.toolbarTitle}>CodePixel</span>
        <span className={styles.toolbarBadge}>Board</span>
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
        <button
          type="button"
          className={styles.avatarButton}
          onClick={() => setIsAvatarMenuOpen((current) => !current)}
          aria-label="Open avatar menu"
          aria-expanded={isAvatarMenuOpen}
        >
          U
        </button>
        {isAvatarMenuOpen ? (
          <div className={styles.avatarMenu}>
            <button type="button" className={styles.avatarMenuItem} onClick={() => setIsAvatarMenuOpen(false)}>
              Login
            </button>
            <button type="button" className={styles.avatarMenuItem} onClick={() => setIsAvatarMenuOpen(false)}>
              Sign in
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
