import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import Button from "./Button";

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  type, // "rename" or "delete"
  initialValue = "", 
  onSubmit, 
  actionLabel 
}) {
  const [inputValue, setInputValue] = useState(initialValue);

  // Sync initial value when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "rename" && !inputValue.trim()) return;
    onSubmit(type === "rename" ? inputValue.trim() : null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4 pointer-events-auto">
      {/* Modal Container */}
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all border border-slate-100"
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <p className="text-slate-600 text-sm mb-4">
            {description}
          </p>

          {type === "rename" && (
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                New Name
              </label>
              <input 
                autoFocus
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter profile name..."
              />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={type === "delete" ? "danger" : "primary"}
              disabled={type === "rename" && !inputValue.trim()}
            >
              {actionLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
