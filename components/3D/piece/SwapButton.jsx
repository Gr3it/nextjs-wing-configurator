"use client";
import { useState, useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import { useSnapshot } from "valtio";
import piecesData from "@/data/pieces.json";
import { state, swapPiece } from "@/store/wingState";
import ConnectorVisual from "./ConnectorVisual";

/**
 * SwapButton — shown when a piece is active. Opens a menu to replace the
 * current piece with a compatible alternative (same source/connector type).
 * Children are preserved; excess children are trimmed if the new piece has
 * fewer connectors.
 */
export default function SwapButton({ path, isActive, position = [0, 0, 0] }) {
  const [open, setOpen] = useState(false);

  if (!isActive) return null;

  return (
    <group position={position}>
      <ConnectorVisual
        type="swap"
        active={isActive}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      />

      {open && (
        <SwapMenu path={path} onClose={() => setOpen(false)} />
      )}
    </group>
  );
}

// ─── Swap menu overlay ───────────────────────────────────────────────

function SwapMenu({ path, onClose }) {
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

  // Get the current node to know its pieceId
  // Navigate through the snapshot to find the current piece
  let node = snap.rightWingRoot;
  for (const idx of path) {
    if (!node || !node.children[idx]) { node = null; break; }
    node = node.children[idx];
  }
  const currentPieceId = node?.piece;
  const currentPieceInfo = currentPieceId
    ? piecesData.pieces[currentPieceId]
    : null;

  // The source tells us which connector type this piece plugs into
  const sourceType = currentPieceInfo?.source;

  // Build the list of compatible alternatives (same connector type, excluding self)
  const compatiblePieces = sourceType
    ? (piecesData.connectors[sourceType] ?? [])
        .filter((id) => id !== currentPieceId)
        .map((id) => ({ id, piece: piecesData.pieces[id] }))
        .filter(({ piece }) => {
          if (!piece) return false;
          if (snap.a1MiniOnly && piece.requiresLargeBed) return false;
          return true;
        })
    : [];

  const handleSelect = (pieceId) => {
    swapPiece(path, pieceId);
    onClose();
  };

  // Distinguish tap from scroll
  const onPiecePointerDown = (e) => {
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

  const isWide = sourceType === "B";
  const cols = isWide ? 4 : 3;

  return (
    <Html center zIndexRange={[800, 900]} style={{ pointerEvents: "none" }}>
      {/* Scrollbar-hide utility */}
      <style>{`
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        ref={menuRef}
        className="no-scrollbar rounded-xl border border-[#333] bg-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,0.6)] select-none overflow-y-auto overflow-x-hidden"
        style={{
          pointerEvents: "auto",
          touchAction: "pan-y",
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
            {sourceType} — swap piece
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
            No compatible alternatives
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
                onPointerDown={(e) => onPiecePointerDown(e)}
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
