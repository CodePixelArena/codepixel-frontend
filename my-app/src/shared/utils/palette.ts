export const PALETTE = [
  "#1f2937",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#0ea5e9",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f9a8d4",
  "#a78bfa",
  "#38bdf8",
  "#34d399",
  "#fcd34d",
  "#fb7185",
  "#a3e635",
  "#f97316",
  "#2563eb",
  "#0f766e",
  "#7c3aed",
  "#22c55e",
  "#bef264",
  "#f472b6",
  "#60a5fa",
  "#f59e0b",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#c084fc",
  "#fb7185",
  "#38bdf8",
  "#000000",
  "#ffffff",
];

export const DEFAULT_COLOR_INDEX = 1;
export const GRID_WIDTH = parseInt(import.meta.env.VITE_GRID_WIDTH as string, 10) || 1000;
export const GRID_HEIGHT = parseInt(import.meta.env.VITE_GRID_HEIGHT as string, 10) || 1000;
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
export const BASE_CELL_SIZE = 10;
