import React from "react";

const variants = {
  primary: {
    bg: "#242424",
    border: "#383838",
    color: "#fff",
    hoverBg: "#2e2e2e",
    hoverBorder: "#555",
  },
  danger: {
    bg: "#3d1a1a",
    border: "#6b2020",
    color: "#ff4d4d",
    hoverBg: "#522222",
    hoverBorder: "#991b1b",
  },
};

export default function Button({
  children,
  variant = "primary",
  icon: Icon,
  className = "",
  fullWidth = true,
  style = {},
  ...props
}) {
  const v = variants[variant] || variants.primary;

  return (
    <button
      className={`
        ${fullWidth ? "w-full" : "w-auto"} 
        flex items-center justify-center gap-2 py-2 px-4 rounded-lg 
        transition-all text-sm cursor-pointer 
        disabled:cursor-not-allowed disabled:opacity-50
        font-mono uppercase tracking-wider text-[11px]
        bg-(--bg) border border-(--br) text-(--color)
        hover:bg-(--hbg) hover:border-(--hbr)
        ${className}
      `}
      style={{
        "--bg": v.bg,
        "--hbg": v.hoverBg,
        "--br": v.border,
        "--hbr": v.hoverBorder,
        "--color": v.color,
        ...style,
      }}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </button>
  );
}
