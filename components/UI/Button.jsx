import React from "react";

const variants = {
  primary: "bg-blue-500 text-white hover:bg-blue-600 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none",
  dark: "bg-slate-800 text-white hover:bg-slate-900 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none",
  ghost: "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-50",
  secondary: "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50",
};

export default function Button({
  children,
  variant = "primary",
  icon: Icon,
  className = "",
  fullWidth = true,
  ...props
}) {
  const variantStyles = variants[variant] || variants.primary;

  return (
    <button
      className={`
        ${fullWidth ? "flex-1" : ""} 
        flex items-center justify-center gap-2 py-2 px-4 rounded-lg 
        transition-all text-sm font-medium cursor-pointer 
        disabled:cursor-not-allowed
        ${variantStyles}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
