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
import { cn } from "@/lib/utils";

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
  const [stats, setStats] = useState<DetectionStats>({
    fps: 0,
    totalDetections: 0,
    uniqueObjects: {},
    inferenceTime: 0,
  });
  const [cameraReady, setCameraReady] = useState(false);

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

  // Detection loop
  useEffect(() => {
    if (!isReady || !cameraReady) return;

    let cancelled = false;

    async function detect() {
      if (cancelled) return;

      const modelInstance = model.current;
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;

      if (!modelInstance || !video || !canvas || video.readyState !== 4) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const startTime = performance.now();
      const predictions = await modelInstance.detect(
        video,
        undefined,
        settings.confidenceThreshold
      );
      const inferenceTime = performance.now() - startTime;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { hasPerson } = renderPredictions(predictions as DetectedObject[], ctx, {
        showLabels: settings.showLabels,
        showBoundingBoxes: settings.showBoundingBoxes,
        mirror: settings.mirror,
      });

      if (hasPerson && settings.audioAlerts) {
        playAlertSound(settings.funMode ? "/public_pols-aagyi-pols.mp3" : undefined);
      }

      // Update FPS & stats every second
      frameCountRef.current += 1;
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
          inferenceTime: Math.round(inferenceTime * 100) / 100,
        });
      }

      rafRef.current = requestAnimationFrame(detect);
    }

    rafRef.current = requestAnimationFrame(detect);

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, cameraReady, model, settings, webcamRef]);

  const loadingSteps = [
    { label: "Initialize TensorFlow.js", done: !isLoading || isReady },
    { label: "Load COCO-SSD Model", done: isReady },
    { label: "Start Camera Feed", done: cameraReady },
  ];

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center backdrop-blur-md"
      >
        <AlertTriangle className="h-10 w-10 text-red-400" />
        <h3 className="text-lg font-semibold text-red-300">Model Load Failed</h3>
        <p className="text-sm text-red-200/70">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/30"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {isLoading || !cameraReady ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-lg rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl"
          >
            <LoadingScreen steps={loadingSteps} />
          </motion.div>
        ) : (
          <motion.div
            key="detector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full flex-col items-center gap-4"
          >
            <ControlBar
              settings={settings}
              onToggle={toggleSetting}
              onCapture={handleCapture}
              onThresholdChange={handleThresholdChange}
            />

            <div className="relative w-full overflow-hidden rounded-2xl border border-slate-700/50 bg-black shadow-2xl shadow-cyan-500/5">
              <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={settings.mirror}
                screenshotFormat="image/png"
                videoConstraints={{
                  facingMode: "user",
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }}
                onUserMedia={() => setCameraReady(true)}
                className="block w-full"
              />
              <canvas
                ref={canvasRef}
                className={cn(
                  "pointer-events-none absolute left-0 top-0 h-full w-full",
                  settings.mirror && "scale-x-[-1]"
                )}
              />
              <StatsPanel stats={stats} isActive={cameraReady} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

