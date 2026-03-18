"use client";
import { useEffect } from "react";
import { clearActive } from "@/store/wingState";

export default function EscDeselect() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") clearActive();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
