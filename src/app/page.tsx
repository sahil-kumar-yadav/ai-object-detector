"use client";

import { motion } from "framer-motion";
import { ScanEye } from "lucide-react";
import ObjectDetection from "@/components/ObjectDetection";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center gap-8 overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-3 text-center"
      >
        <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400">
          <ScanEye className="h-4 w-4" />
          <span>Powered by TensorFlow.js COCO-SSD</span>
        </div>
        <h1 className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
          AI Object Detector
        </h1>
        <p className="max-w-lg text-slate-400">
          Real-time object detection directly in your browser. No server required —
          all processing happens locally using machine learning.
        </p>
      </motion.header>

      <ObjectDetection />

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-auto text-xs text-slate-600"
      >
        Built with Next.js 14 · TypeScript · TensorFlow.js · Tailwind CSS
      </motion.footer>
    </main>
  );
}

