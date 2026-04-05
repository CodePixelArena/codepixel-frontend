import { useCallback, useRef, type KeyboardEvent } from "react";
import styles from "../canvas/PixelCanvas.module.css";

interface ColorPaletteProps {
  colors: readonly string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function ColorPalette({ colors, selectedIndex, onSelect }: ColorPaletteProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % colors.length;
      }
      if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + colors.length) % colors.length;
      }
      if (event.key === "ArrowDown") {
        nextIndex = (index + 8) % colors.length;
      }
      if (event.key === "ArrowUp") {
        nextIndex = (index - 8 + colors.length) % colors.length;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        onSelect(nextIndex);
        buttonRefs.current[nextIndex]?.focus();
      }
    },
    [colors.length, onSelect],
  );

  if (colors.length === 0) {
    return <div className={styles.palette}>No colors available</div>;
  }

  return (
    <div className={styles.palette} role="listbox" aria-label="Color palette">
      {colors.map((color, index) => (
        <button
          key={`${color}-${index}`}
          ref={(element) => {
            buttonRefs.current[index] = element;
          }}
          type="button"
          role="option"
          aria-selected={selectedIndex === index}
          tabIndex={selectedIndex === index ? 0 : -1}
          autoFocus={selectedIndex === index}
          className={`${styles.swatch} ${selectedIndex === index ? styles.swatchSelected : ""}`}
          style={{ background: color }}
          title={`Select ${color}`}
          aria-label={`Select color ${color}`}
          onClick={() => onSelect(index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        />
      ))}
    </div>
  );
}
