"use client";
import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { socket } from "@/src/services/socket-setup";
import { SOCKET } from "@/src/constants/socket";
import { useSocketHandler } from "@/src/utils/hooks/useSocketHandler";

interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userId = session?.user?.id; // Assuming user id is in session.user.id, need to verify type

  useSocketHandler();

  useEffect(() => {
    if (isAuthenticated && userId) {
      if (!socket.connected) {
        socket.connect();
      }

      const handleConnect = () => {
        console.log("Socket connected");
        socket.emit(SOCKET.Emitters.Join_Room, userId);
        socket.emit(SOCKET.Emitters.Set_Online);
        socket.emit(SOCKET.Emitters.Request_Status_Update);
      };

      const handleConnectError = (error: Error) => {
        console.error("Socket connection failed:", error);
      };

      const handleDisconnect = (reason: string) => {
        console.log("Socket disconnected:", reason);
      };

      socket.on("connect", handleConnect);
      socket.on("connect_error", handleConnectError);
      socket.on("disconnect", handleDisconnect);

      // If already connected manually or by autoConnect (false here), emit join
      if (socket.connected) {
        socket.emit(SOCKET.Emitters.Join_Room, userId);
      }

      return () => {
        socket.off("connect", handleConnect);
        socket.off("connect_error", handleConnectError);
        socket.off("disconnect", handleDisconnect);
      };
    } else {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [isAuthenticated, userId]);

  return <>{children}</>;
};

export default SocketProvider;
