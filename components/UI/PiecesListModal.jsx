"use client";
import React from "react";
import { X, Package, Weight } from "lucide-react";
import Button from "./Button";
import piecesData from "../../data/pieces.json";

export default function PiecesListModal({ isOpen, onClose, rightWingRoot }) {
  if (!isOpen) return null;

  const pieceCounts = {};
  let totalWeight = 0;

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
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 md:p-10 pointer-events-auto">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl h-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-200">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 leading-tight">
                Pieces List
              </h3>
              <p className="text-sm text-slate-500">
                Summary of all parts needed for the build
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-all hover:rotate-90 duration-300 cursor-pointer bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-100 shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse border-spacing-0">
            <thead className="sticky top-0 z-10 bg-slate-100 border-b border-slate-200">
              <tr className="text-slate-600 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-8 py-3.5">Piece</th>
                <th className="px-8 py-3.5 text-center">Count</th>
                <th className="px-8 py-3.5 text-right">Weight (gr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedLabels.map((label) => (
                <tr
                  key={label}
                  className="group hover:bg-white transition-all duration-200"
                >
                  <td className="px-8 py-4">
                    <div className="text-slate-700 font-semibold group-hover:text-blue-600 transition-colors">
                      {label}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="inline-flex items-center justify-center bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 font-bold px-3 py-1 rounded-lg text-xs transition-colors border border-slate-200 group-hover:border-blue-200">
                      {pieceCounts[label].count}x
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right font-mono text-sm text-slate-500 group-hover:text-slate-800">
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
        <div className="p-6 border-t border-slate-200 bg-slate-50/80 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-orange-100 rounded-lg">
                <Weight className="w-5 h-5 text-orange-600" />
              </span>
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-tight block">
                  Estimated Total Weight
                </span>
                <span className="text-2xl font-black text-slate-800">
                  {totalWeight.toLocaleString()}{" "}
                  <span className="text-lg font-normal text-slate-500">gr</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="dark"
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
