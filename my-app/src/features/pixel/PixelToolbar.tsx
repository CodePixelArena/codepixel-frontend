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
    <section className={styles.toolbar}>
      <div className={styles.toolbarHeader}>
        <div className={styles.toolbarBrand}>
          <div className={styles.toolbarTitle}>Pixel board</div>
          <div className={styles.toolbarSubtitle}>Live pixel painting with realtime controls</div>
        </div>
        <div className={styles.avatarWrapper} ref={menuRef}>
          <button
            type="button"
            className={styles.avatarButton}
            onClick={() => setIsAvatarMenuOpen((current) => !current)}
            aria-label="Open avatar menu"
            aria-expanded={isAvatarMenuOpen}
          >
            @
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
      </div>
      <div className={styles.toolbarItem}>
        <span className={styles.toolbarLabel}>Connection</span>
        <span className={styles.toolbarValue}>{status}</span>
      </div>
      <div className={styles.toolbarItem}>
        <span className={styles.toolbarLabel}>Cooldown</span>
        <span className={styles.toolbarValue}>{cooldown > 0 ? `${cooldown}s` : "Ready"}</span>
      </div>
      <div className={styles.toolbarItem}>
        <span className={styles.toolbarLabel}>Selected color</span>
        <span className={styles.colorPreview} style={{ background: selectedColor }} />
      </div>
      <div className={styles.toolbarItem}>
        <span className={styles.toolbarLabel}>Grid</span>
        <span className={styles.toolbarValue}>{gridWidth} x {gridHeight}</span>
      </div>
      <div className={styles.toolbarItem}>
        <span className={styles.toolbarLabel}>Hover</span>
        <span className={styles.toolbarValue}>{hoverCell ? `${hoverCell.x}, ${hoverCell.y}` : "—"}</span>
      </div>
    </section>
  );
}
