"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 } from "uuid";
function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const createRoomAndJoin = () => {
    const id = v4();
    setRoomId(id);
    router.push(`/${id}`);
  };
  return (
    <div className="w-screen h-screen bg-zinc-900 flex items-center justify-center">
      <div className="border p-8 flex flex-col gap-4 min-w-[400px]">
        <h2 className="text-white text-center text-4xl">Call me</h2>
        <div>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room id"
            className="bg-transparent border py-2 px-4 w-full block text-white outline-none focus:border-blue-500"
          />
          <button
            className="px-8 py-2 bg-white text-zinc-90 w-full mt-4 hover:opacity-80"
            onClick={() => {
              if (roomId) return router.push("/" + roomId);
              alert("room id cannot be empty");
            }}
          >
            Join
          </button>
        </div>
        <div className="text-white text-center">Or</div>
        <div>
          <button
            className="px-8 py-2 bg-white text-zinc-90 w-full hover:opacity-80"
            onClick={createRoomAndJoin}
          >
            Create new room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
