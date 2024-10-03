"use client";
import React, { useEffect, useReducer, useRef, useState } from "react";
import peer, { Peer } from "peerjs";
import { useSocket } from "@/contexts/socketProvider";
function usePeer(roomId: string) {
  const socket = useSocket();
  const [peer, setPeer] = useState<any>();
  const [peerId, setPeerId] = useState("");
  const isPeerSet = useRef<any>();
  useEffect(() => {
    if (isPeerSet.current || !socket) return;
    isPeerSet.current = true;
    const peer = new Peer({
      host: "roots-wins-myanmar-rain.trycloudflare.com",
      secure: true,
      port: 443,
    });
    setPeer(peer);
    peer.on("open", (id) => {
      setPeerId(id);
      console.log("peer id", id);
      socket?.emit("join-room", roomId, id);
      console.log("emit socket", socket.connected);
    });

    return () => {
      peer.off("open", (id) => {
        console.log("peer id", id);
        socket?.emit("join-room", roomId, id);
        console.log("emit", socket);
      });
    };
  }, [socket, roomId]);

  return [peer, peerId];
}

export default usePeer;
