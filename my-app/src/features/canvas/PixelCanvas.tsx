import { useCallback, useEffect, useRef, useState, type ChangeEvent, type MouseEvent, type PointerEvent } from "react";
import { useCanvas } from "./useCanvas";
import { usePixelSocket, type PixelUpdateMessage } from "./usePixelSocket";
import { useZoomPan } from "./useZoomPan";
import { PALETTE, BASE_CELL_SIZE, GRID_HEIGHT, GRID_WIDTH, WS_URL } from "../../shared/utils/palette";
import PixelToolbar from "../pixel/PixelToolbar";
import ColorPalette from "../pixel/ColorPalette";
import styles from "./PixelCanvas.module.css";

const COOLDOWN_SECONDS = 5;

interface PixelCanvasProps {
  isLoggedIn?: boolean;
  setIsLoggedIn?: (value: boolean) => void;
  setPage?: (page: "home" | "login" | "signup" | "board" | "statistics" | "aboutus" | "profile" | "pixels") => void;
}

export default function PixelCanvas({ isLoggedIn = false, setIsLoggedIn, setPage }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pixelBufferRef = useRef<Uint8Array>(new Uint8Array(GRID_WIDTH * GRID_HEIGHT));
  const [selectedColorIndex, setSelectedColorIndex] = useState(1);
  const [cooldown, setCooldown] = useState(0);
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null);
  const [isColorPanelOpen, setIsColorPanelOpen] = useState(false);
  const renderRequestRef = useRef<() => void>(() => {});

  const { scale, offset, handleWheel, handlePointerDown, handlePointerMove, handlePointerUp, screenToGrid } = useZoomPan(canvasRef, {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    baseCellSize: BASE_CELL_SIZE,
  });

  const { status, sendPixel } = usePixelSocket(WS_URL, useCallback((update: PixelUpdateMessage) => {
    if (update.x < 0 || update.x >= GRID_WIDTH || update.y < 0 || update.y >= GRID_HEIGHT) {
      return;
    }
    const index = update.y * GRID_WIDTH + update.x;
    pixelBufferRef.current[index] = update.color;
    renderRequestRef.current();
  }, []));

  const { requestRender } = useCanvas({
    canvasRef,
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    baseCellSize: BASE_CELL_SIZE,
    pixelBufferRef,
    palette: PALETTE,
    scale,
    offset,
    hoverCell,
    selectedColor: PALETTE[selectedColorIndex],
  });

  useEffect(() => {
    renderRequestRef.current = requestRender;
  }, [requestRender]);

  const placePixel = useCallback(
    (x: number, y: number) => {
      const index = y * GRID_WIDTH + x;
      pixelBufferRef.current[index] = selectedColorIndex;
      requestRender();
      sendPixel({ x, y, color: selectedColorIndex });
    },
    [requestRender, sendPixel, selectedColorIndex],
  );

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [cooldown]);

  const onCanvasClick = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (cooldown > 0) {
        return;
      }

      const cell = screenToGrid(event.clientX, event.clientY);
      if (!cell) {
        return;
      }

      if (cell.x < 0 || cell.x >= GRID_WIDTH || cell.y < 0 || cell.y >= GRID_HEIGHT) {
        return;
      }

      placePixel(cell.x, cell.y);
      setCooldown(COOLDOWN_SECONDS);
    },
    [cooldown, placePixel, screenToGrid],
  );

  const onCanvasPointerMove = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      const cell = screenToGrid(event.clientX, event.clientY);
      if (!cell || cell.x < 0 || cell.x >= GRID_WIDTH || cell.y < 0 || cell.y >= GRID_HEIGHT) {
        setHoverCell(null);
        return;
      }
      setHoverCell(cell);
      handlePointerMove(event);
    },
    [handlePointerMove, screenToGrid],
  );

  const onCanvasPointerLeave = useCallback(() => {
    setHoverCell(null);
  }, []);

  const hexToRgb = useCallback((hex: string) => {
    const normalized = hex.replace("#", "");
    const bigint = parseInt(normalized, 16);
    if (normalized.length !== 6 || Number.isNaN(bigint)) {
      return null;
    }
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }, []);

  const colorDistance = useCallback((a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) => {
    return Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2);
  }, []);

  const paletteColors = PALETTE.slice(1);

  const handlePaletteSelect = useCallback((index: number) => {
    setSelectedColorIndex(index + 1);
  }, []);

  const onColorWheelChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedColor = event.target.value;
      const selectedRgb = hexToRgb(selectedColor);
      if (!selectedRgb) {
        return;
      }

      const nextIndex = PALETTE.reduce((best, paletteColor, index) => {
        if (index === 0) {
          return best;
        }
        const paletteRgb = hexToRgb(paletteColor);
        if (!paletteRgb) {
          return best;
        }
        const distance = colorDistance(selectedRgb, paletteRgb);
        if (best.distance === null || distance < best.distance) {
          return { index, distance };
        }
        return best;
      }, { index: 1, distance: null as number | null }).index;

      setSelectedColorIndex(nextIndex);
    },
    [colorDistance, hexToRgb],
  );

  useEffect(() => {
    requestRender();
  }, [requestRender, selectedColorIndex, scale, offset, hoverCell]);

  return (
    <div className={styles.container}>
      <PixelToolbar
        status={status}
        cooldown={cooldown}
        selectedColor={PALETTE[selectedColorIndex]}
        gridWidth={GRID_WIDTH}
        gridHeight={GRID_HEIGHT}
        hoverCell={hoverCell}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setPage={setPage}
      />

      <div className={styles.canvasArea}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onClick={onCanvasClick}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={onCanvasPointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={onCanvasPointerLeave}
        />
        {isColorPanelOpen ? (
          <div className={styles.colorWheelWrapper}>
            <div className={styles.colorPanelHeader}>
              <div className={styles.colorPanelText}>
                <div className={styles.colorPanelTitle}>Color selection</div>
                <div className={styles.colorPanelSubtitle}>Pick from the wheel or any palette swatch</div>
              </div>
              <div className={styles.colorPanelActions}>
                <div
                  className={styles.selectedPreview}
                  style={{ background: PALETTE[selectedColorIndex] }}
                  aria-label={`Selected color ${PALETTE[selectedColorIndex]}`}
                />
                <button
                  type="button"
                  className={styles.colorPanelClose}
                  onClick={() => setIsColorPanelOpen(false)}
                  aria-label="Close color palette"
                >
                  ×
                </button>
              </div>
            </div>

            <div className={styles.colorWheelRow}>
              <input
                type="color"
                aria-label="Pick a color"
                value={PALETTE[selectedColorIndex]}
                onChange={onColorWheelChange}
                className={styles.colorWheel}
              />
            </div>

            <div className={styles.colorMenu}>
              <div className={styles.paletteLabel}>Palette</div>
              <ColorPalette
                colors={paletteColors}
                selectedIndex={selectedColorIndex - 1}
                onSelect={handlePaletteSelect}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.colorButton}
            onClick={() => setIsColorPanelOpen(true)}
          >
            Colors
          </button>
        )}
      </div>
    </div>
  );
}
