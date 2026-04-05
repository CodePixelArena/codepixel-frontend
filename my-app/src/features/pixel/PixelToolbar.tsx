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
  return (
    <section className={styles.toolbar}>
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
