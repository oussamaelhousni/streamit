"use client";
import {
  useEffect,
  createContext,
  useState,
  ReactNode,
  useContext,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const first = useRef(false);
  useEffect(() => {
    if (first.current) return;
    first.current = true;
    const connection = io();
    setSocket(connection);
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
