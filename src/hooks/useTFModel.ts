"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { ObjectDetection } from "@tensorflow-models/coco-ssd";
import { ModelState } from "@/types";

export function useTFModel() {
  const [state, setState] = useState<ModelState>({
    isLoading: true,
    isReady: false,
    error: null,
    backend: "cpu",
  });

  const modelRef = useRef<ObjectDetection | null>(null);

  const initializeBackend = useCallback(async () => {
    try {
      await tf.setBackend("webgl");
      await tf.ready();
      const backend = tf.getBackend();
      console.log(`TensorFlow.js backend: ${backend}`);
      return backend;
    } catch {
      console.warn("WebGL backend failed, falling back to CPU");
      await tf.setBackend("cpu");
      await tf.ready();
      return "cpu";
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadModel() {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const backend = await initializeBackend();

        if (cancelled) return;

        const model = await cocoSSDLoad();

        if (cancelled) {
          model.dispose();
          return;
        }

        modelRef.current = model;
        setState({
          isLoading: false,
          isReady: true,
          error: null,
          backend: backend ?? "cpu",
        });
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load model";
        console.error("Model loading error:", message);
        setState({
          isLoading: false,
          isReady: false,
          error: message,
          backend: "cpu",
        });
      }
    }

    loadModel();

    return () => {
      cancelled = true;
      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
      }
    };
  }, [initializeBackend]);

  return { ...state, model: modelRef };
}

