"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { ObjectDetection } from "@tensorflow-models/coco-ssd";
import { DetectedObject, DetectionStats } from "@/types";

export function useObjectDetection(
  modelRef: React.MutableRefObject<ObjectDetection | null>,
  videoRef: React.MutableRefObject<HTMLVideoElement | null>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  confidenceThreshold: number,
  isRunning: boolean
) {
  const [stats, setStats] = useState<DetectionStats>({
    fps: 0,
    totalDetections: 0,
    uniqueObjects: {},
    inferenceTime: 0,
  });

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsTimeRef = useRef<number>(0);

  const runDetection = useCallback(async () => {
    const model = modelRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!model || !video || !canvas) return;
    if (video.readyState !== 4) return;

    const startTime = performance.now();

    // Sync canvas size to video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const predictions = await model.detect(video, undefined, confidenceThreshold);

    const inferenceTime = performance.now() - startTime;

    // Update FPS
    frameCountRef.current += 1;
    const now = performance.now();
    if (now - fpsTimeRef.current >= 1000) {
      const fps = frameCountRef.current;
      frameCountRef.current = 0;
      fpsTimeRef.current = now;

      const uniqueObjects: Record<string, number> = {};
      let totalDetections = 0;
      predictions.forEach((p) => {
        uniqueObjects[p.class] = (uniqueObjects[p.class] || 0) + 1;
        totalDetections += 1;
      });

      setStats({
        fps,
        totalDetections,
        uniqueObjects,
        inferenceTime: Math.round(inferenceTime * 100) / 100,
      });
    }

    lastTimeRef.current = now;

    // Return predictions for external rendering
    return predictions as DetectedObject[];
  }, [modelRef, videoRef, canvasRef, confidenceThreshold]);

  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    let cancelled = false;

    async function loop() {
      if (cancelled) return;
      await runDetection();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isRunning, runDetection]);

  return { stats };
}

