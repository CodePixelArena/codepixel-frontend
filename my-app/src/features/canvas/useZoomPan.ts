import { useCallback, useLayoutEffect, useRef, useState, type RefObject, type WheelEvent, type PointerEvent } from "react";

const MIN_SCALE = 0.2;
const MAX_SCALE = 5.0;
const ZOOM_SENSITIVITY = 0.0015;

export type Point = {
  x: number;
  y: number;
};

interface UseZoomPanOptions {
  width: number;
  height: number;
  baseCellSize: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function useZoomPan(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseZoomPanOptions) {
  const { width, height, baseCellSize } = options;
  const [scale, setScale] = useState(0.9);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const pointerStartRef = useRef<Point | null>(null);
  const offsetStartRef = useRef<Point>({ x: 0, y: 0 });

  const getContentSize = useCallback(
    (scaleValue: number) => ({
      width: width * baseCellSize * scaleValue,
      height: height * baseCellSize * scaleValue,
    }),
    [baseCellSize, height, width],
  );

  const getMinScale = useCallback(
    (rectWidth: number, rectHeight: number) => {
      const contentSize = getContentSize(1);
      if (contentSize.width <= rectWidth && contentSize.height <= rectHeight) {
        return MIN_SCALE;
      }
      return clamp(
        Math.min(rectWidth / contentSize.width, rectHeight / contentSize.height),
        MIN_SCALE,
        MAX_SCALE,
      );
    },
    [getContentSize],
  );

  const clampScale = useCallback(
    (value: number, rectWidth: number, rectHeight: number) =>
      clamp(value, getMinScale(rectWidth, rectHeight), MAX_SCALE),
    [getMinScale],
  );

  const clampOffset = useCallback(
    (targetOffset: Point, rectWidth: number, rectHeight: number, scaleValue: number) => {
      const contentSize = getContentSize(scaleValue);
      const x = contentSize.width <= rectWidth
        ? (rectWidth - contentSize.width) / 2
        : clamp(targetOffset.x, rectWidth - contentSize.width, 0);
      const y = contentSize.height <= rectHeight
        ? (rectHeight - contentSize.height) / 2
        : clamp(targetOffset.y, rectHeight - contentSize.height, 0);

      return { x, y };
    },
    [getContentSize],
  );

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const clampToBounds = () => {
      const rect = canvas.getBoundingClientRect();
      setScale((currentScale) => {
        const nextScale = clampScale(currentScale, rect.width, rect.height);
        setOffset((currentOffset) => {
          const nextOffset = clampOffset(currentOffset, rect.width, rect.height, nextScale);
          return nextOffset.x === currentOffset.x && nextOffset.y === currentOffset.y
            ? currentOffset
            : nextOffset;
        });
        return nextScale;
      });
    };

    clampToBounds();
    window.addEventListener("resize", clampToBounds);
    return () => window.removeEventListener("resize", clampToBounds);
  }, [canvasRef, clampOffset, clampScale]);

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLCanvasElement>) => {
      event.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;
      const zoomFactor = Math.exp(-event.deltaY * ZOOM_SENSITIVITY);

      setScale((prevScale) => {
        const nextScale = clampScale(prevScale * zoomFactor, rect.width, rect.height);
        setOffset((prevOffset) => {
          const worldX = (cursorX - prevOffset.x) / prevScale;
          const worldY = (cursorY - prevOffset.y) / prevScale;
          const nextOffset = {
            x: cursorX - worldX * nextScale,
            y: cursorY - worldY * nextScale,
          };
          return clampOffset(nextOffset, rect.width, rect.height, nextScale);
        });
        return nextScale;
      });
    },
    [canvasRef, clampOffset, clampScale],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      if (event.button !== 0) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.setPointerCapture(event.pointerId);
      pointerStartRef.current = { x: event.clientX, y: event.clientY };
      offsetStartRef.current = offset;
    },
    [canvasRef, offset],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      if (!pointerStartRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const dx = event.clientX - pointerStartRef.current.x;
      const dy = event.clientY - pointerStartRef.current.y;
      const nextOffset = { x: offsetStartRef.current.x + dx, y: offsetStartRef.current.y + dy };

      setOffset(clampOffset(nextOffset, rect.width, rect.height, scale));
    },
    [canvasRef, clampOffset, scale],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      if (!pointerStartRef.current) return;
      pointerStartRef.current = null;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.releasePointerCapture(event.pointerId);
      }
    },
    [canvasRef],
  );

  const screenToGrid = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((clientX - rect.left - offset.x) / (baseCellSize * scale));
      const y = Math.floor((clientY - rect.top - offset.y) / (baseCellSize * scale));
      return { x, y };
    },
    [canvasRef, offset, scale, baseCellSize],
  );

  return {
    scale,
    offset,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    screenToGrid,
  } as const;
}
