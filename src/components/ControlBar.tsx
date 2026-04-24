"use client";

import { motion } from "framer-motion";
import {
  FlipHorizontal,
  Type,
  BoxSelect,
  Volume2,
  VolumeX,
  Camera,
  Laugh,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { AppSettings } from "@/types";
import { cn } from "@/lib/utils";

interface ControlBarProps {
  settings: AppSettings;
  onToggle: (key: keyof AppSettings) => void;
  onCapture: () => void;
  onThresholdChange: (value: number) => void;
}

export function ControlBar({
  settings,
  onToggle,
  onCapture,
  onThresholdChange,
}: ControlBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-700/50 bg-slate-900/80 p-3 backdrop-blur-xl"
    >
      <ControlButton
        active={settings.mirror}
        onClick={() => onToggle("mirror")}
        icon={<FlipHorizontal className="h-4 w-4" />}
        label="Mirror"
      />
      <ControlButton
        active={settings.showLabels}
        onClick={() => onToggle("showLabels")}
        icon={<Type className="h-4 w-4" />}
        label="Labels"
      />
      <ControlButton
        active={settings.showBoundingBoxes}
        onClick={() => onToggle("showBoundingBoxes")}
        icon={<BoxSelect className="h-4 w-4" />}
        label="Boxes"
      />
      <ControlButton
        active={settings.audioAlerts}
        onClick={() => onToggle("audioAlerts")}
        icon={settings.audioAlerts ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        label="Audio"
      />
      <ControlButton
        active={settings.funMode}
        onClick={() => onToggle("funMode")}
        icon={<Laugh className="h-4 w-4" />}
        label="Fun"
      />

      <div className="mx-1 h-6 w-px bg-slate-700" />

      <button
        onClick={onCapture}
        className="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
      >
        <Camera className="h-4 w-4" />
        Capture
      </button>

      <div className="mx-1 h-6 w-px bg-slate-700" />

      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-slate-500" />
        <span className="text-xs text-slate-400">Conf</span>
        <input
          type="range"
          min={0.1}
          max={0.9}
          step={0.05}
          value={settings.confidenceThreshold}
          onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
          className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-500"
          aria-label="Confidence threshold"
        />
        <span className="w-8 text-right text-xs font-mono text-slate-300">
          {Math.round(settings.confidenceThreshold * 100)}%
        </span>
      </div>
    </motion.div>
  );
}

function ControlButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30"
          : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      )}
      aria-pressed={active}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

