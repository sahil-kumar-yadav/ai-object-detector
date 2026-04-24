"use client";

import { motion } from "framer-motion";
import { Brain, Camera, Cpu } from "lucide-react";

interface LoadingScreenProps {
  steps: { label: string; done: boolean }[];
}

export function LoadingScreen({ steps }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl" />
        <div className="relative rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-4">
          <Brain className="h-10 w-10 text-white" />
        </div>
      </motion.div>

      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Initializing AI Model
        </h2>
        <p className="text-sm text-slate-400">
          Loading TensorFlow.js COCO-SSD for real-time detection
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-3"
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                step.done
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {step.done ? (
                <Cpu className="h-3.5 w-3.5" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                step.done ? "text-emerald-400" : "text-slate-300"
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

