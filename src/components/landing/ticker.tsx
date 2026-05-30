"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const events = [
  { type: "sync", message: "GA4 synced — Acme Corp", time: "2 min ago", color: "emerald" },
  { type: "alert", message: "Meta Ads degraded — Beta Agency", time: "5 min ago", color: "amber" },
  { type: "open", message: "Report opened — Gamma Inc", time: "12 min ago", color: "indigo" },
  { type: "sync", message: "Google Ads synced — Delta Co", time: "18 min ago", color: "emerald" },
  { type: "anomaly", message: "↓ 34% sessions — Acme Corp", time: "1 hr ago", color: "red" },
  { type: "sync", message: "Search Console synced — Echo Ltd", time: "2 hr ago", color: "emerald" },
  { type: "open", message: "Report opened — Foxtrot Agency", time: "3 hr ago", color: "indigo" },
  { type: "alert", message: "GA4 reconnected — Golf Media", time: "4 hr ago", color: "emerald" },
];

const colorMap = {
  emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
  amber: "text-amber-600 bg-amber-50 border-amber-200",
  indigo: "text-indigo-600 bg-indigo-50 border-indigo-200",
  red: "text-red-600 bg-red-50 border-red-200",
};

const dotMap = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500 animate-pulse",
  indigo: "bg-indigo-500",
  red: "bg-red-500 animate-pulse",
};

export function Ticker() {
  const items = [...events, ...events]; // duplicate for seamless loop

  return (
    <div className="relative bg-white border-y border-gray-100 py-4 overflow-hidden">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {items.map((event, i) => (
          <div
            key={i}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shrink-0 ${
              colorMap[event.color as keyof typeof colorMap]
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                dotMap[event.color as keyof typeof dotMap]
              }`}
            />
            <span>{event.message}</span>
            <span className="opacity-50">·</span>
            <span className="opacity-50">{event.time}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
