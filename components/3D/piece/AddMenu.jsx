"use client";
import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import piecesData from "@/data/pieces.json";
import { addPiece, state } from "@/store/wingState";

/**
 * AddMenu — HTML overlay anchored to a ConnectorButton.
 * Shows compatible pieces for the connector type and adds them to the store.
 *
 * Props:
 *  connectorType  — e.g. "A1", "A2", "B"
 *  parentPath     — path of the parent node in the tree (e.g. [0, 1])
 *  connectorIndex — index of the connector on the parent (-1 = root)
 *  onClose        — callback to dismiss the menu
 */
export default function AddMenu({
  connectorType,
  parentPath,
  connectorIndex,
  onClose,
}) {
  const menuRef = useRef(null);
  const pointerStart = useRef(null);

  // Dismiss when tapping outside
  useEffect(() => {
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [onClose]);

  const snap = useSnapshot(state);

  const compatiblePieces = (piecesData.connectors[connectorType] ?? [])
    .map((id) => ({ id, piece: piecesData.pieces[id] }))
    .filter(({ piece }) => {
      if (!piece) return false;
      if (snap.a1MiniOnly && piece.requiresLargeBed) return false;
      return true;
    });

  const handleSelect = (pieceId) => {
    const targetPath =
      connectorIndex !== -1 ? [...parentPath, connectorIndex] : parentPath;
    addPiece(targetPath, pieceId);
    onClose();
  };

  // Distinguish tap from scroll: only select if pointer barely moved
  const onPiecePointerDown = (e, id) => {
    e.stopPropagation();
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPiecePointerUp = (e, id) => {
    e.stopPropagation();
    if (!pointerStart.current) return;
    const moved =
      Math.abs(e.clientX - pointerStart.current.x) < 8 &&
      Math.abs(e.clientY - pointerStart.current.y) < 8;
    if (moved) handleSelect(id);
    pointerStart.current = null;
  };

  const isWide = connectorType === "B";
  const cols = isWide ? 4 : 3;

  return (
    <Html center zIndexRange={[800, 900]} style={{ pointerEvents: "none" }}>
      {/* Scrollbar-hide utility — Tailwind has no built-in for this */}
      <style>{`
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        ref={menuRef}
        className="no-scrollbar rounded-xl border border-[#333] bg-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,0.6)] select-none overflow-y-auto overflow-x-hidden"
        style={{
          pointerEvents: "auto",
          touchAction: "pan-y", // allow native scroll, block canvas gestures
          width: isWide ? "min(650px, 60vw)" : "min(500px, 60vw)",
          maxHeight: "65vh",
          padding: "14px",
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#888]">
            {connectorType} — add piece
          </span>
          <button
            className="shrink-0 cursor-pointer bg-transparent border-none text-[#555] text-base leading-none px-0.5"
            onPointerDown={onClose}
          >
            ✕
          </button>
        </div>

        {/* Grid */}
        {compatiblePieces.length === 0 ? (
          <p className="font-mono text-[11px] text-[#555]">
            No compatible pieces
          </p>
        ) : (
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {compatiblePieces.map(({ id, piece }) => (
              <button
                key={id}
                className="flex flex-col items-center justify-between gap-1.5 w-full min-h-[140px] rounded-lg border border-[#383838] bg-[#242424] px-2.5 py-3 font-mono text-[13px] text-[#ddd] cursor-pointer transition-colors duration-150 hover:bg-[#2e2e2e] hover:border-[#555] active:bg-[#2e2e2e] active:border-[#555] max-sm:min-h-[80px] max-sm:px-1 max-sm:py-1.5 max-sm:gap-1"
                style={{ touchAction: "pan-y", boxSizing: "border-box" }}
                onPointerDown={(e) => onPiecePointerDown(e, id)}
                onPointerUp={(e) => onPiecePointerUp(e, id)}
                onPointerCancel={() => {
                  pointerStart.current = null;
                }}
              >
                <div className="w-full flex items-center justify-center shrink-0">
                  {piece.previewImg ? (
                    <img
                      src={piece.previewImg}
                      alt={piece.label}
                      className="w-full h-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                    />
                  ) : (
                    <span className="text-[32px]">⬡</span>
                  )}
                </div>
                <span className="text-[#aaa] text-[11px] wrap-break-word text-center max-sm:text-[9px]">
                  {piece.labelnameOverride || piece.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Html>
  );
}
