"use client";
import React from "react";
import { X, Package, Weight } from "lucide-react";
import Button from "./Button";
import piecesData from "../../data/pieces.json";

export default function PiecesListModal({ isOpen, onClose, rightWingRoot }) {
  if (!isOpen) return null;

  const pieceCounts = {};
  let totalWeight = 0;
  let totalPieces = 0;

  /**
   * Adds a piece and its extras to the count.
   * If the piece is symmetrical and we are adding a pair (multiplier > 1),
   * it splits the count between the piece and its symmetrical counterpart.
   */
  function addPieceToCounts(pieceId, multiplier = 1) {
    const pieceInfo = piecesData.pieces[pieceId];
    if (!pieceInfo) return;

    if (pieceInfo.symmetrical && multiplier > 1) {
      const half = multiplier / 2;
      processSinglePiece(pieceId, half);
      processSinglePiece(pieceInfo.symmetrical, half);
    } else {
      processSinglePiece(pieceId, multiplier);
    }
  }

  /**
   * Internal helper to update counts and handle extras.
   */
  function processSinglePiece(pieceId, multiplier) {
    const pieceInfo = piecesData.pieces[pieceId];
    if (!pieceInfo) return;

    const label = pieceInfo.label;
    const weight = pieceInfo.printWeight || 0;

    if (!pieceCounts[label]) {
      pieceCounts[label] = { count: 0, weight: weight };
    }
    pieceCounts[label].count += multiplier;
    totalWeight += weight * multiplier;
    totalPieces += multiplier;

    // Extra pieces: they should also respect symmetry if they have it
    if (pieceInfo.extra) {
      pieceInfo.extra.forEach((extraId) => {
        addPieceToCounts(extraId, multiplier);
      });
    }
  }

  // 1. Backplate (1x)
  addPieceToCounts("backplate", 1);

  // 2. Wings (2x - assuming rightWingRoot represents one side, we add 2x for both sides)
  function traverse(node) {
    if (!node) return;
    addPieceToCounts(node.piece, 2);
    if (node.children) {
      node.children.forEach((child) => traverse(child));
    }
  }
  traverse(rightWingRoot);

  const sortedLabels = Object.keys(pieceCounts).sort();

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 pointer-events-auto">
      {/* Modal Container */}
      <div
        className="rounded-2xl shadow-2xl w-full max-w-xl h-full max-h-[90vh] flex flex-col overflow-hidden"
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{ borderColor: "#333", background: "#1a1a1a" }}
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-[#888]" />
            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-[0.15em] text-white leading-tight mb-0.5">
                Pieces List
              </h3>
              <p className="text-[9px] font-mono text-[#888] uppercase tracking-wider">
                Build summary & weight
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
              fontSize: "18px",
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          <table className="w-full text-left border-collapse border-spacing-0">
            <thead className="sticky top-0 z-10" style={{ background: "#222" }}>
              <tr
                className="text-[#888] uppercase text-[9px] font-mono tracking-widest border-b"
                style={{ borderColor: "#333" }}
              >
                <th className="px-6 py-2.5">Piece</th>
                <th className="px-6 py-2.5 text-center">Qty</th>
                <th className="px-6 py-2.5 text-right">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {sortedLabels.map((label) => (
                <tr
                  key={label}
                  className="group hover:bg-[#222] transition-all duration-150"
                  style={{ borderBottom: "1px solid #222" }}
                >
                  <td className="px-6 py-2">
                    <div className="text-white font-mono text-[11px] uppercase tracking-wide transition-colors">
                      {label}
                    </div>
                  </td>
                  <td className="px-6 py-2 text-center">
                    <span
                      className="inline-flex items-center justify-center font-mono text-white px-2 py-0.5 rounded border text-[10px]"
                      style={{ background: "#222", borderColor: "#444" }}
                    >
                      {pieceCounts[label].count}x
                    </span>
                  </td>
                  <td className="px-6 py-2 text-right font-mono text-[10px] text-[#aaa] group-hover:text-white">
                    {(
                      pieceCounts[label].weight * pieceCounts[label].count
                    ).toLocaleString()}
                    g
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with Totals */}
        <div
          className="p-4 border-t flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ borderColor: "#333", background: "#1a1a1a" }}
        >
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <Weight className="w-4 h-4 text-[#888]" />
              <div>
                <span className="text-[9px] text-[#888] uppercase font-mono tracking-widest block mb-0.5">
                  Build Weight
                </span>
                <span className="text-lg font-mono text-white">
                  {totalWeight.toLocaleString()}{" "}
                  <span className="text-xs text-[#888]">GR</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#888]" />
              <div>
                <span className="text-[9px] text-[#888] uppercase font-mono tracking-widest block mb-0.5">
                  Total Pieces
                </span>
                <span className="text-lg font-mono text-white">
                  {totalPieces} <span className="text-xs text-[#888]">PCS</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={onClose}
              fullWidth={false}
              className="px-10"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
