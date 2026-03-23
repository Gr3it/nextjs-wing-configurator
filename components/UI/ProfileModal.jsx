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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 pointer-events-auto">
      {/* Modal Container */}
      <div 
        className="rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all"
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#333]">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-white">{title}</h3>
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

        <form onSubmit={handleSubmit} className="p-4">
          <p className="text-[#aaa] font-mono text-[10px] uppercase tracking-wider mb-4 leading-relaxed">
            {description}
          </p>

          {type === "rename" && (
            <div className="mb-6">
              <label className="text-[10px] font-mono text-[#ccc] uppercase tracking-widest block mb-2">
                New Name
              </label>
              <input 
                autoFocus
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#444] text-white py-2.5 px-3 rounded-lg outline-none focus:border-[#666] font-mono text-[11px] uppercase tracking-widest"
                placeholder="PROFILENAME"
              />
            </div>
          )}

          <div className="flex gap-3">
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
