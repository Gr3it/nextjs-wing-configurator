"use client";
import piecesData from "../data/pieces.json";
import { Html } from "@react-three/drei";

export default function SelectionMenu({ connectorType, onSelect, onClose }) {
  // Use the compatibility map directly from pieces.json
  const compatiblePieceIds = piecesData.connectors[connectorType] || [];

  return (
    <Html center distanceFactor={10}>
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-slate-200 min-w-[200px]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Attach Piece ({connectorType})
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            ×
          </button>
        </div>
        <div className="space-y-1">
          {compatiblePieceIds.length > 0 ? (
            compatiblePieceIds.map((id) => {
              const piece = piecesData.pieces[id];
              return (
                <button
                  key={id}
                  onClick={() => onSelect(id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium text-slate-700 transition-colors border border-transparent hover:border-blue-200"
                >
                  {piece.name || id.replace(/_/g, " ")}
                </button>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 italic py-2">
              No compatible pieces for type {connectorType}
            </p>
          )}
        </div>
      </div>
    </Html>
  );
}
