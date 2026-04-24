"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { WebcamState } from "@/types";

export function useWebcam() {
  const [state, setState] = useState<WebcamState>({
    isReady: false,
    hasPermission: null,
    error: null,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState({
        isReady: true,
        hasPermission: true,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Camera access denied";
      console.error("Webcam error:", message);
      setState({
        isReady: false,
        hasPermission: false,
        error: message,
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return { ...state, videoRef, requestPermission };
}

