import React, { useState } from "react";
import { Bug, X, Send, AlertCircle, CheckCircle } from "lucide-react";
import Button from "./Button";

export default function BugReport() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [formData, setFormData] = useState({ email: "", message: "" });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setStatus("idle");
    setFormData({ email: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("https://formspree.io/f/mpqowdbo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setTimeout(() => handleClose(), 2000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="primary"
        icon={Bug}
        fullWidth={false}
      >
        Report A Bug
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto">
          <div
            className="rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 text-left"
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-[#333] bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <Bug className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-white leading-tight">
                    Bug Report
                  </h3>
                  <p className="text-[10px] font-mono text-[#888] uppercase tracking-wider mt-1">
                    Help us improve the experience
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-[#888] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {status === "success" ? (
                <div className="py-8 flex flex-col items-center text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                  <div>
                    <h4 className="text-white font-mono uppercase tracking-widest">
                      Sent Successfully
                    </h4>
                    <p className="text-xs text-[#888] mt-2">
                      Thanks for the feedback! We'll look into it.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-[#888] tracking-widest block">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-[#888] tracking-widest block">
                      Description of the bug
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="What happened? How can we reproduce it?"
                      rows={5}
                      className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors font-sans resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-mono tracking-wider">
                      <AlertCircle className="w-4 h-4" />
                      Failed to send. Please try again or check your connection.
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === "loading"}
                    icon={status === "loading" ? undefined : Send}
                    className="w-full py-3! text-[11px]! tracking-[0.2em]!"
                  >
                    {status === "loading" ? "Sending..." : "Submit Report"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
