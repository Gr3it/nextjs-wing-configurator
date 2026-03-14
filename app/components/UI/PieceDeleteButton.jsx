"use client";
import { useState, useCallback } from "react";
import { Html } from "@react-three/drei";
import { removePiece } from "../../store/wingState";

export default function PieceDeleteButton({
  path,
  isActive,
  position = [0, -0.1, 0],
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = useCallback(() => {
    setShowConfirm(false);
    removePiece(path);
  }, [path]);

  if (!isActive) return null;

  return (
    <Html
      position={position}
      center
      zIndexRange={[100, 100]}
      style={{ pointerEvents: "none" }}
      distanceFactor={2}
    >
      <style>{`
        @keyframes prFadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {!showConfirm ? (
        // ── Delete button ──
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 1)",
            background: "rgba(255, 255, 255, 0.8)",
            color: "#ef4444",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            animation: "prFadeIn 0.15s ease",
            whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 240, 240, 0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 22 22" fill="none">
            <path
              d="M4 6h14M9 6V4h4v2M9.5 10v6M12.5 10v6M5 6l1 12h10l1-12"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          DELETE
        </button>
      ) : (
        // ── Inline confirm ──
        <div
          style={{
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 8px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 1)",
            background: "rgba(255, 255, 255, 0.95)",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            animation: "prFadeIn 0.15s ease",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#64748b",
              marginRight: "2px",
              textTransform: "uppercase",
            }}
          >
            Sure?
          </span>
          <button
            onClick={handleConfirm}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              border: "none",
              background: "#ef4444",
              color: "white",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
          >
            Yes
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              background: "#f1f5f9",
              color: "#475569",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          >
            No
          </button>
        </div>
      )}
    </Html>
  );
}
