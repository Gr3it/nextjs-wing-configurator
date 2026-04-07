"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  AlertTriangle,
  FlaskConical,
  Layers,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";
import Button from "./Button";
import { state } from "@/store/wingState";

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");
    if (!hasSeenDisclaimer) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hasSeenDisclaimer", "true");
    }
    setIsOpen(false);

    // Start tutorial when closed
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) {
      state.showTutorial = true;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto">
      <div
        className="rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-full"
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#333] bg-[#1a1a1a] flex-none">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white leading-tight">
                Important Notice
              </h3>
              <p className="text-xs font-mono text-[#888] uppercase tracking-wider mt-0.5">
                Structural considerations
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#888] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto scrollbar-hide flex-1 min-h-0">
          <div className="space-y-5 sm:space-y-6">
            {/* Intro */}
            <section>
              <p className="text-sm text-[#ccc] leading-relaxed font-sans border-l-2 border-amber-500/30 pl-4 py-1 italic">
                The wider and heavier you go, the more stress the main joints
                are going to be under. Please be thoughtful of material chosen
                for the build to avoid potential breakages.
              </p>
            </section>

            {/* Material Recommendation */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
                <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-[#888]">
                  Material Selection & Stress
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    title: "Light Builds",
                    text: "PLA: Small wings, dry environments.",
                  },
                  {
                    title: "Heavier Loads",
                    text: "PLA+: Enhanced impact resistance.",
                  },
                  {
                    title: "Large Spans",
                    text: "ASA / ABS: Better durability & stability.",
                  },
                  {
                    title: "Technical",
                    text: "PA-CF/PET-CF: For extreme demands.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#222] border border-[#333] hover:border-blue-500/30 transition-colors group"
                  >
                    <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-1.5 font-bold">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#aaa] leading-snug">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Reinforcement */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-[#888]">
                  Print Recommendations
                </h4>
              </div>

              <div className="rounded-xl border border-[#333] overflow-hidden divide-y divide-[#333]">
                {[
                  {
                    label: "Structural Integrity",
                    desc: "Increase wall count and infill density for pieces near the harness base.",
                    color: "bg-emerald-500",
                    glow: "shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                  },
                  {
                    label: "Hinge Strength",
                    desc: "Reinforce small connectors to avoid snapping under leverage.",
                    color: "bg-amber-500",
                    glow: "shadow-[0_0_8px_rgba(245,158,11,0.5)]",
                  },
                  {
                    label: "Load Awareness",
                    desc: "Adjust settings based on final cladding/feather weight.",
                    color: "bg-blue-500",
                    glow: "shadow-[0_0_8px_rgba(59,130,246,0.5)]",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 flex items-start gap-3.5 bg-[#1e1e1e]"
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${item.color} mt-2 shrink-0 ${item.glow}`}
                    />
                    <div className="space-y-1">
                      <p className="text-xs text-white font-bold">
                        {item.label}
                      </p>
                      <p className="text-xs text-[#888] leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Important Alert */}
            <section className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20 flex gap-4 items-center">
              <ShieldCheck className="w-5 h-5 text-orange-500/40 shrink-0" />
              <p className="text-xs text-[#999] leading-tight uppercase tracking-wider">
                Physical test a single joint before printing the full wing.
              </p>
            </section>
          </div>

          {/* Action Area */}
          <div className="pt-5 border-t border-[#333] flex flex-col gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer group select-none self-start">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                <div
                  className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                    dontShowAgain
                      ? "bg-[#666] border-[#777]"
                      : "bg-transparent border-[#444] group-hover:border-[#666]"
                  }`}
                >
                  {dontShowAgain && (
                    <Check className="w-3 text-white stroke-3" />
                  )}
                </div>
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#666] group-hover:text-[#aaa] transition-colors">
                Don't show again
              </span>
            </label>

            <Button
              variant="primary"
              onClick={handleClose}
              className="w-full py-2! text-xs! tracking-[0.2em]"
            >
              I Understand
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
