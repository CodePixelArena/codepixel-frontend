import { useCallback, useEffect, useRef, useState } from "react";

export type PixelUpdateMessage = {
  x: number;
  y: number;
  color: number;
};

export type PixelSocketStatus = "connecting" | "connected" | "disconnected" | "error";

export function usePixelSocket(
  url: string,
  onRemotePixel: (update: PixelUpdateMessage) => void,
) {
  const [status, setStatus] = useState<PixelSocketStatus>("connecting");
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const connect = () => {
      if (!active) return;
      setStatus("connecting");
      const socket = new WebSocket(url);
      socket.onopen = () => {
        if (!active) return;
        setStatus("connected");
      };

      socket.onmessage = (event) => {
        if (!active) return;
        try {
          const data = JSON.parse(event.data) as { type: string; payload: PixelUpdateMessage };
          if (data.type === "pixel") {
            onRemotePixel(data.payload);
          }
        } catch {
          // Ignore invalid messages.
        }
      };

      socket.onerror = () => {
        if (!active) return;
        setStatus("error");
      };

      socket.onclose = () => {
        if (!active) return;
        setStatus("disconnected");
        reconnectTimeout.current = window.setTimeout(connect, 3000);
      };

      socketRef.current = socket;
    };

    connect();

    return () => {
      active = false;
      if (reconnectTimeout.current !== null) {
        window.clearTimeout(reconnectTimeout.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, onRemotePixel]);

  const sendPixel = useCallback((payload: PixelUpdateMessage) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(JSON.stringify({ type: "pixel", payload }));
    return true;
  }, []);

  return { status, sendPixel } as const;
}
