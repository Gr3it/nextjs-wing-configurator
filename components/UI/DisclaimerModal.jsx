"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  AlertTriangle,
  Save,
  Coffee,
  Heart,
  ExternalLink,
  Check,
} from "lucide-react";
import Button from "./Button";

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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto">
      <div
        className="rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#333] bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <div>
              <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-white leading-tight">
                Important Notice
              </h3>
              <p className="text-xs font-mono text-[#888] uppercase tracking-wider mt-1">
                Please read before proceeding
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#888] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh] scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#aaa] flex items-center gap-2">
                <div className="w-1 h-1 bg-amber-500 rounded-full" />
                Build & Material Strength
              </h4>
              <p className="text-xs text-[#ccc] leading-relaxed font-sans">
                You have to check yourself the duality of the build material and
                strength wise, because that is also based on the weight you add
                to the skeleton and different materials for prints have
                different strength.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#aaa] flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full" />
                Local Save Recommended
              </h4>
              <div className="flex gap-3 items-start p-4 rounded-xl bg-[#222] border border-[#333]">
                <Save className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-[#ccc] leading-relaxed">
                  After finishing a build, it is{" "}
                  <strong>highly recommended</strong> to export it to have a
                  local save of your configuration.
                </p>
              </div>
            </section>
          </div>

          <section className="space-y-4 pt-4 border-t border-[#222]">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#aaa]">
              Support the Creators
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Greit Support */}
              <div className="flex flex-col justify-between space-y-3">
                <p className="text-xs text-[#888] leading-relaxed font-sans">
                  Website created by <strong>Greit</strong>. Your coffee
                  contribution directly supports the host and the ongoing
                  development of this tool.
                </p>
                <a
                  href="https://ko-fi.com/R6R23OSRW"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#2a2a2a] border border-[#383838] hover:bg-[#333] hover:border-[#444] transition-all group mt-auto"
                >
                  <div className="flex items-center gap-3">
                    <Coffee className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-mono uppercase text-white">
                      Buy the dev a coffee
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#666] group-hover:text-white" />
                </a>
              </div>

              {/* bzioo Support */}
              <div className="flex flex-col justify-between space-y-3">
                <p className="text-xs text-[#888] leading-relaxed font-sans">
                  3D models created by <strong>Bzioo</strong>. Support him by
                  joining his Patreon community.
                </p>
                <a
                  href="https://patreon.com/cw/bzioo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#2a2a2a] border border-[#383838] hover:bg-[#333] hover:border-[#444] transition-all group mt-auto"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <span className="text-xs font-mono uppercase text-white">
                      Support bzioo
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#666] group-hover:text-white" />
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#333] bg-[#1a1a1a] flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <div
                className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                  dontShowAgain
                    ? "bg-[#666] border-[#777]"
                    : "bg-transparent border-[#444] group-hover:border-[#666]"
                }`}
              >
                {dontShowAgain && (
                  <Check className="w-3.5 h-3.5 text-white stroke-3" />
                )}
              </div>
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#888] group-hover:text-[#ccc] transition-colors">
              Don't show this message again
            </span>
          </label>

          <Button
            variant="primary"
            onClick={handleClose}
            className="w-full py-3! text-sm! tracking-[0.2em]"
          >
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
}
