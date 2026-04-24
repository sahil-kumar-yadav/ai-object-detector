"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, Box, Clock } from "lucide-react";
import { DetectionStats } from "@/types";
import { cn } from "@/lib/utils";

interface StatsPanelProps {
  stats: DetectionStats;
  isActive: boolean;
}

export function StatsPanel({ stats, isActive }: StatsPanelProps) {
  const uniqueCount = Object.keys(stats.uniqueObjects).length;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-end justify-between gap-3 md:bottom-6 md:left-6 md:right-auto"
        >
          <div className="flex flex-wrap gap-2">
            <StatBadge
              icon={<Activity className="h-3.5 w-3.5" />}
              label="FPS"
              value={stats.fps}
              color="emerald"
            />
            <StatBadge
              icon={<Clock className="h-3.5 w-3.5" />}
              label="Latency"
              value={`${stats.inferenceTime}ms`}
              color="amber"
            />
            <StatBadge
              icon={<Box className="h-3.5 w-3.5" />}
              label="Objects"
              value={stats.totalDetections}
              color="cyan"
            />
            <StatBadge
              icon={<Zap className="h-3.5 w-3.5" />}
              label="Classes"
              value={uniqueCount}
              color="purple"
            />
          </div>

          {uniqueCount > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-xl border border-slate-700/50 bg-slate-900/80 px-3 py-2 backdrop-blur-md"
            >
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(stats.uniqueObjects).map(([cls, count]) => (
                  <span
                    key={cls}
                    className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300"
                  >
                    {cls} <span className="ml-1 text-slate-500">{count}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatBadge({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "emerald" | "amber" | "cyan" | "purple";
}) {
  const colorClasses = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 backdrop-blur-md",
        colorClasses[color]
      )}
    >
      {icon}
      <div className="flex flex-col leading-none">
        <span className="text-[10px] uppercase tracking-wider opacity-70">{label}</span>
        <span className="text-sm font-bold">{value}</span>
      </div>
    </div>
  );
}

