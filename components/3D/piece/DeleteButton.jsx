"use client";
import { useState, useCallback } from "react";
import { Html } from "@react-three/drei";
import { removePiece } from "@/store/wingState";
import ConnectorVisual from "./ConnectorVisual";

export default function DeleteButton({ path, isActive, position = [0, 0, 0] }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = useCallback(() => {
    setShowConfirm(false);
    removePiece(path);
  }, [path]);

  if (!isActive) return null;

  return (
    <group position={position}>
      <ConnectorVisual
        type="delete"
        active={isActive}
        onClick={(e) => {
          e.stopPropagation();
          setShowConfirm(true);
        }}
      />

      {showConfirm && (
        <Html
          center
          zIndexRange={[100, 100]}
          style={{ pointerEvents: "none" }}
          distanceFactor={1.5}
          position={[0, 0.05, 0]} // Offset upward slightly to not overlap the sphere
        >
          <style>{`
            @keyframes prFadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
          `}</style>
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#dc2626")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#ef4444")
              }
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e2e8f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#f1f5f9")
              }
            >
              No
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
