"use client";
import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";
import piecesData from "../data/pieces.json";
import { addPiece } from "../store/wingState";

/**
 * AddMenu
 * Overlay HTML ancorato al ConnectorAdd cliccato.
 * Mostra i pezzi compatibili col tipo di connettore e li aggiunge allo store.
 *
 * Props:
 *  connectorType  — es. "A1", "A2"
 *  parentPath     — path del nodo padre nel tree (es. [0, 1])
 *  connectorIndex — indice del connettore nel nodo padre
 *  onClose        — callback per chiudere il menu
 */
export default function AddMenu({
  connectorType,
  parentPath,
  connectorIndex,
  onClose,
}) {
  const menuRef = useRef();

  // Chiudi cliccando fuori
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  // Pezzi compatibili per questo tipo di connettore
  const compatiblePieceIds = piecesData.connectors[connectorType] ?? [];
  const compatiblePieces = compatiblePieceIds
    .map((id) => ({ id, info: piecesData.pieces[id] }))
    .filter(({ info }) => !!info);

  const handleSelect = (pieceId) => {
    // Il path del nuovo nodo è parentPath + connectorIndex
    let targetPath;
    if (connectorIndex !== -1) targetPath = [...parentPath, connectorIndex];
    else targetPath = parentPath;
    addPiece(targetPath, pieceId);
    onClose();
  };

  return (
    <Html center zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
      <div
        ref={menuRef}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          pointerEvents: "auto",
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "10px",
          padding: "12px",
          minWidth: "180px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          userSelect: "none",
        }}
      >
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
              fontSize: "10px",
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
              fontSize: "14px",
              lineHeight: 1,
              padding: "0 2px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Griglia pezzi */}
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
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px",
            }}
          >
            {compatiblePieces.map(({ id, info }) => (
              <button
                key={id}
                onPointerDown={() => handleSelect(id)}
                style={{
                  background: "#242424",
                  border: "1px solid #383838",
                  borderRadius: "7px",
                  color: "#ddd",
                  cursor: "pointer",
                  padding: "10px 8px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  textAlign: "center",
                  lineHeight: 1.4,
                  transition: "background 0.15s, border-color 0.15s",
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
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>⬡</div>
                <div style={{ color: "#aaa", fontSize: "10px" }}>{id}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Html>
  );
}
