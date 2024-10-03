"use client";
import React, { useEffect, useState } from "react";

function useMediaStream() {
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((cameraStream) => {
        console.log("getting stream");
        setStream(cameraStream);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }, []);

  return stream;
}

export default useMediaStream;
