import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { Point } from "./useZoomPan";

interface UseCanvasOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
  baseCellSize: number;
  pixelBufferRef: RefObject<Uint8Array>;
  palette: readonly string[];
  scale: number;
  offset: Point;
  hoverCell: Point | null;
  selectedColor: string;
}

export function useCanvas(options: UseCanvasOptions) {
  const { canvasRef, width, height, baseCellSize, pixelBufferRef, palette, scale, offset, hoverCell, selectedColor } = options;

  const dirtyRef = useRef(true);
  const rafRef = useRef<number | null>(null);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const targetWidth = Math.floor(rect.width * dpr);
    const targetHeight = Math.floor(rect.height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pixelSize = baseCellSize * scale;
    const widthPx = rect.width;
    const heightPx = rect.height;
    ctx.clearRect(0, 0, widthPx, heightPx);
    ctx.fillStyle = "#08121f";
    ctx.fillRect(0, 0, widthPx, heightPx);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.imageSmoothingEnabled = false;

    const xStart = Math.max(0, Math.floor(-offset.x / pixelSize));
    const yStart = Math.max(0, Math.floor(-offset.y / pixelSize));
    const xEnd = Math.min(width, Math.ceil((widthPx - offset.x) / pixelSize));
    const yEnd = Math.min(height, Math.ceil((heightPx - offset.y) / pixelSize));

    const buffer = pixelBufferRef.current;
    for (let y = yStart; y < yEnd; y += 1) {
      const rowIndex = y * width;
      for (let x = xStart; x < xEnd; x += 1) {
        const paletteIndex = buffer[rowIndex + x];
        if (paletteIndex === 0) continue;
        ctx.fillStyle = palette[paletteIndex];
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    if (pixelSize >= 3) {
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let x = xStart; x <= xEnd; x += 1) {
        const xPos = x * pixelSize;
        ctx.beginPath();
        ctx.moveTo(xPos, yStart * pixelSize);
        ctx.lineTo(xPos, yEnd * pixelSize);
        ctx.stroke();
      }
      for (let y = yStart; y <= yEnd; y += 1) {
        const yPos = y * pixelSize;
        ctx.beginPath();
        ctx.moveTo(xStart * pixelSize, yPos);
        ctx.lineTo(xEnd * pixelSize, yPos);
        ctx.stroke();
      }
    }

    if (hoverCell) {
      const hoverX = hoverCell.x;
      const hoverY = hoverCell.y;
      if (hoverX >= xStart && hoverX < xEnd && hoverY >= yStart && hoverY < yEnd) {
        ctx.fillStyle = `${selectedColor}33`;
        ctx.fillRect(hoverX * pixelSize, hoverY * pixelSize, pixelSize, pixelSize);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(hoverX * pixelSize + 1, hoverY * pixelSize + 1, pixelSize - 2, pixelSize - 2);
      }
    }

    ctx.restore();
  }, [canvasRef, width, height, pixelBufferRef, palette, scale, offset, hoverCell, selectedColor]);

  useEffect(() => {
    dirtyRef.current = true;
  }, [palette, scale, offset, hoverCell, selectedColor]);

  useEffect(() => {
    const renderFrame = () => {
      if (dirtyRef.current) {
        drawScene();
        dirtyRef.current = false;
      }
      rafRef.current = window.requestAnimationFrame(renderFrame);
    };

    renderFrame();
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [drawScene]);

  const requestRender = useCallback(() => {
    dirtyRef.current = true;
  }, []);

  return { requestRender } as const;
}
