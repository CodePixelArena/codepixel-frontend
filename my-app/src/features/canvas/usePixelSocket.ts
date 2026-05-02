import { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, HubConnectionState, LogLevel, type HubConnection } from "@microsoft/signalr";
import { getAuthToken } from "../../api";

export type PixelUpdateMessage = {
  id?: number;
  x: number;
  y: number;
  color: string;
  userId?: string;
  placedAt?: string;
};

export type PixelSocketStatus = "connecting" | "connected" | "disconnected" | "error";

export function usePixelSocket(
  url: string,
  onRemotePixel: (update: PixelUpdateMessage) => void,
) {
  const [status, setStatus] = useState<PixelSocketStatus>("connecting");
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    let active = true;

    const connection = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => getAuthToken() ?? "",
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;
    connection.on("PixelUpdated", (update: PixelUpdateMessage) => {
      if (active) {
        onRemotePixel(update);
      }
    });

    connection.onreconnecting(() => {
      if (active) {
        setStatus("connecting");
      }
    });

    connection.onreconnected(() => {
      if (active) {
        setStatus("connected");
      }
    });

    connection.onclose(() => {
      if (active) {
        setStatus("disconnected");
      }
    });

    void connection
      .start()
      .then(() => {
        if (active) {
          setStatus("connected");
        }
      })
      .catch(() => {
        if (active) {
          setStatus("error");
        }
      });

    return () => {
      active = false;
      if (connection.state !== HubConnectionState.Disconnected) {
        void connection.stop();
      }
    };
  }, [url, onRemotePixel]);

  return { status } as const;
}
