"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useTFModel } from "@/hooks/useTFModel";
import { LoadingScreen } from "./LoadingScreen";
import { ControlBar } from "./ControlBar";
import { StatsPanel } from "./StatsPanel";
import { renderPredictions } from "@/utils/render-predictions";
import { playAlertSound, takeScreenshot } from "@/utils/detections";
import { AppSettings, DetectedObject, DetectionStats } from "@/types";

const DEFAULT_SETTINGS: AppSettings = {
  mirror: true,
  showLabels: true,
  showBoundingBoxes: true,
  audioAlerts: false,
  funMode: true,
  confidenceThreshold: 0.6,
};

export default function ObjectDetection() {
  const { isLoading, isReady, error, model } = useTFModel();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [cameraReady, setCameraReady] = useState(false);
  const [debugMsg, setDebugMsg] = useState("Initializing...");

  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const [stats, setStats] = useState<DetectionStats>({
    fps: 0,
    totalDetections: 0,
    uniqueObjects: {},
    inferenceTime: 0,
  });

  const frameCountRef = useRef(0);
  const fpsTimeRef = useRef(performance.now());

  const toggleSetting = useCallback((key: keyof AppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleThresholdChange = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, confidenceThreshold: value }));
  }, []);

  const handleCapture = useCallback(() => {
    if (canvasRef.current) {
      takeScreenshot(canvasRef.current);
    }
  }, []);

  // 🔍 Detection loop
  useEffect(() => {
    if (!isReady || !cameraReady) {
      console.log("Waiting for model or camera...");
      return;
    }

    console.log("Starting detection loop");

    let cancelled = false;

    async function detect() {
      if (cancelled) return;

      const modelInstance = model.current;
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;

      if (!modelInstance) {
        setDebugMsg("Model not ready");
        return;
      }

      if (!video) {
        setDebugMsg("Video not found");
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      if (!canvas) {
        setDebugMsg("Canvas not found");
        return;
      }

      // Relaxed readyState check
      if (video.readyState < 2) {
        setDebugMsg("Video not ready yet...");
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setDebugMsg("Video has no dimensions");
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      // Sync canvas size
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setDebugMsg("Canvas context failed");
        return;
      }

      const currentSettings = settingsRef.current;

      const startTime = performance.now();

      let predictions: DetectedObject[] = [];

      try {
        predictions = await modelInstance.detect(
          video,
          undefined,
          currentSettings.confidenceThreshold
        );
      } catch (err) {
        console.error("Detection error:", err);
        setDebugMsg("Detection failed");
        return;
      }

      const inferenceTime = performance.now() - startTime;

      const { hasPerson } = renderPredictions(predictions, ctx, {
        showLabels: currentSettings.showLabels,
        showBoundingBoxes: currentSettings.showBoundingBoxes,
        mirror: currentSettings.mirror,
      });

      if (hasPerson && currentSettings.audioAlerts) {
        playAlertSound();
      }

      // FPS
      frameCountRef.current++;
      const now = performance.now();

      if (now - fpsTimeRef.current >= 1000) {
        const fps = frameCountRef.current;
        frameCountRef.current = 0;
        fpsTimeRef.current = now;

        const uniqueObjects: Record<string, number> = {};
        predictions.forEach((p) => {
          uniqueObjects[p.class] = (uniqueObjects[p.class] || 0) + 1;
        });

        setStats({
          fps,
          totalDetections: predictions.length,
          uniqueObjects,
          inferenceTime: Math.round(inferenceTime),
        });

        setDebugMsg(`Running | FPS: ${fps}`);
      }

      rafRef.current = requestAnimationFrame(detect);
    }

    rafRef.current = requestAnimationFrame(detect);

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, cameraReady]);

  // 🚨 Error UI
  if (error) {
    return (
      <div className="text-red-400">
        Model error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">

      {/* DEBUG PANEL */}
      <div className="text-xs text-yellow-400 bg-black p-2 rounded">
        {debugMsg} <br />
        Model Ready: {String(isReady)} <br />
        Camera Ready: {String(cameraReady)}
      </div>

      <AnimatePresence mode="wait">
        {isLoading || !cameraReady ? (
          <LoadingScreen
            steps={[
              { label: "Loading Model", done: isReady },
              { label: "Starting Camera", done: cameraReady },
            ]}
          />
        ) : (
          <div className="relative w-full max-w-2xl">
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={settings.mirror}
              screenshotFormat="image/png"
              videoConstraints={{
                facingMode: "user",
              }}
              onUserMedia={() => {
                console.log("✅ Camera started");
                setDebugMsg("Camera started");
                setCameraReady(true);
              }}
              onUserMediaError={(err) => {
                console.error("❌ Camera error:", err);
                setDebugMsg("Camera error: " + err.message);
              }}
              className="w-full bg-black"
            />

            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />

            <StatsPanel stats={stats} isActive={cameraReady} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}