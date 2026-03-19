"use client";
import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";
import piecesData from "@/data/pieces.json";
import { addPiece } from "@/store/wingState";

/**
 * PieceAddMenu
 * HTML overlay anchored to the clicked ConnectorButton.
 * Shows compatible pieces for the connector type and adds them to the store.
 *
 * Props:
 *  connectorType  — e.g. "A1", "A2"
 *  parentPath     — path of the parent node in the tree (e.g. [0, 1])
 *  connectorIndex — index of the connector in the parent node
 *  onClose        — callback to close the menu
 */
export default function AddMenu({
  connectorType,
  parentPath,
  connectorIndex,
  onClose,
}) {
  const menuRef = useRef();

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  // Compatible pieces for this connector type
  const compatiblePieceIds = piecesData.connectors[connectorType] ?? [];
  const compatiblePieces = compatiblePieceIds
    .map((id) => ({ id, piece: piecesData.pieces[id] }))
    .filter(({ piece }) => !!piece);

  const handleSelect = (pieceId) => {
    let targetPath;
    if (connectorIndex !== -1) targetPath = [...parentPath, connectorIndex];
    else targetPath = parentPath;
    addPiece(targetPath, pieceId);
    onClose();
  };

  return (
    <Html center zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
      <div
        id="add-menu-container"
        ref={menuRef}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        style={{
          pointerEvents: "auto",
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "14px",
          minWidth: connectorType === "B" ? "650px" : "500px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          userSelect: "none",
        }}
      >
        <style>{`
          #add-menu-container {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
          }
          #add-menu-container::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}</style>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              color: "#888",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            {connectorType} — add piece
          </span>
          <button
            onPointerDown={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#555",
              cursor: "pointer",
              fontSize: "16px",
              lineHeight: 1,
              padding: "0 2px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Piece grid */}
        {compatiblePieces.length === 0 ? (
          <div
            style={{ color: "#555", fontSize: "11px", fontFamily: "monospace" }}
          >
            No compatible pieces
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${connectorType === "B" ? 4 : 3}, 1fr)`,
              gap: "10px",
            }}
          >
            {compatiblePieces.map(({ id, piece }) => (
              <button
                key={id}
                onPointerDown={() => handleSelect(id)}
                style={{
                  background: "#242424",
                  border: "1px solid #383838",
                  borderRadius: "8px",
                  color: "#ddd",
                  cursor: "pointer",
                  padding: "12px 10px",
                  fontSize: "13px",
                  fontFamily: "monospace",
                  textAlign: "center",
                  lineHeight: 1.4,
                  transition: "background 0.15s, border-color 0.15s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: "140px",
                }}
                onPointerEnter={(e) => {
                  e.currentTarget.style.background = "#2e2e2e";
                  e.currentTarget.style.borderColor = "#555";
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.background = "#242424";
                  e.currentTarget.style.borderColor = "#383838";
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "4px",
                  }}
                >
                  {piece.previewImg ? (
                    <img
                      src={piece.previewImg}
                      alt={piece.label}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "42px" }}>⬡</span>
                  )}
                </div>
                <div style={{ color: "#aaa", fontSize: "11px" }}>
                  {piece.labelnameOverride || piece.label}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Html>
  );
}
