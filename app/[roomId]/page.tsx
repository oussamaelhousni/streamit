"use client";
import { useSocket } from "@/contexts/socketProvider";
import useMediaStream from "@/hooks/useMediaStream";
import usePeer from "@/hooks/usePeer";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import { IoMicOffSharp, IoMicSharp } from "react-icons/io5";
import { BsCameraVideoFill, BsCameraVideoOffFill } from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";

function Room({ params }: { params: { roomId: string } }) {
  const [players, setPlayers] = useState<any>({});
  const { roomId } = params;
  const socket = useSocket();
  const [peer, peerId] = usePeer(roomId);
  const stream = useMediaStream();

  useEffect(() => {
    if (!socket || !peer) return;
    function onUserConnected(newUser: any) {
      console.log("user connected", newUser);
      // when the other user join, we should call him
      const call = peer.call(newUser, stream);
      call?.on("stream", (incomingStream: any) => {
        setPlayers((prev: any) => {
          return {
            ...prev,
            [newUser]: {
              stream: incomingStream,
              muted: false,
              playing: true,
            },
          };
        });
      });
    }
    socket?.on("user-connected", onUserConnected);

    return () => {
      socket?.off("user-connected", onUserConnected);
    };
  }, [socket, peer, stream]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer?.on("call", (call: any) => {
      const { peer: callerId } = call;
      call.answer(stream);
      call.on("stream", (incomingStream: any) => {
        setPlayers((prev: any) => {
          return {
            ...prev,
            [callerId]: {
              stream: incomingStream,
              muted: false,
              playing: true,
            },
          };
        });
      });
    });
    return () => {
      peer?.off("call", (call: any) => {
        const { peer: callerId } = call;
        call.answer(stream);
        call.on("stream", (incomingStream: any) => {
          setPlayers((prev: any) => {
            return {
              ...prev,
              [callerId]: {
                stream: incomingStream,
                muted: false,
                playing: true,
              },
            };
          });
        });
      });
    };
  }, [peer, stream]);

  useEffect(() => {
    console.log("set my own stream", peerId);
    if (!peerId || !stream) return;
    setPlayers((prev: any) => {
      return {
        ...prev,
        [peerId]: {
          stream,
          muted: false,
          playing: true,
        },
      };
    });
  }, [peerId, stream]);

  // handle toggleAudio
  useEffect(() => {
    function onToggleMute(userId: string) {
      console.log("toggle mute");
      setPlayers((prev: any) => {
        return {
          ...prev,
          [userId]: {
            ...prev[userId],
            muted: !prev[userId].muted,
          },
        };
      });
    }

    socket?.on("toggle-mute", onToggleMute);

    function onToggleVideo(userId: string) {
      console.log("toggle video");
      setPlayers((prev: any) => {
        return {
          ...prev,
          [userId]: {
            ...prev[userId],
            playing: !prev[userId].playing,
          },
        };
      });
    }

    socket?.on("toggle-video", onToggleVideo);

    return () => {
      socket?.off("toggle-mute", onToggleMute);
      socket?.off("toggle-video", onToggleVideo);
    };
  }, [socket]);

  const handleToggleMute = () => {
    socket?.emit("toggle-mute", peerId, roomId);
    setPlayers((prev: any) => {
      return {
        ...prev,
        [peerId]: {
          ...prev[peerId],
          muted: !prev[peerId].muted,
        },
      };
    });
  };

  const handleToggleVideo = () => {
    socket?.emit("toggle-video", peerId, roomId);
    setPlayers((prev: any) => {
      return {
        ...prev,
        [peerId]: {
          ...prev[peerId],
          playing: !prev[peerId].playing,
        },
      };
    });
  };

  return (
    <div className="w-screen h-screen bg-zinc-900 relative">
      {Object.keys(players).map((id) => {
        return (
          <div
            key={id}
            className={`border ${
              id === peerId
                ? "w-screen h-screen"
                : "border-white w-32 h-32 top-8 right-8 absolute rounded-full overflow-hidden"
            }`}
          >
            {players[id].playing ? (
              <ReactPlayer
                url={players[id].stream}
                muted={players[id].muted}
                playing={players[id].playing}
                key={id}
                width={"100%"}
                height={"100%"}
              />
            ) : (
              <div className="bg-zinc-900 w-full h-full"></div>
            )}
          </div>
        );
      })}

      <div className="w-64 absolute bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 flex items-center justify-between px-4 py-2 rounded-md">
        <button
          className={`p-4 rounded-full flex items-center justify-center ${
            !players[peerId]?.muted === true ? "bg-zinc-600" : "bg-red-600"
          }`}
          onClick={handleToggleMute}
        >
          {!players[peerId]?.muted && <IoMicSharp size={18} color="white" />}
          {players[peerId]?.muted && <IoMicOffSharp size={18} color="white" />}
        </button>
        <button
          className={`p-4 rounded-full flex items-center justify-center ${
            players[peerId]?.playing === true ? "bg-zinc-600" : "bg-red-600"
          }`}
          onClick={handleToggleVideo}
        >
          {players[peerId]?.playing && (
            <BsCameraVideoFill size={18} color="white" />
          )}
          {!players[peerId]?.playing && (
            <BsCameraVideoOffFill size={18} color="white" />
          )}
        </button>
        <button
          className={`bg-red-600 p-4 rounded-full flex items-center justify-center`}
          onClick={() => setVideoOn((prev) => !prev)}
        >
          <MdCallEnd size={18} color="white" />
        </button>
      </div>
    </div>
  );
}

export default Room;
