import React from "react";

const variants = {
  h1: "text-7xl md:text-9xl font-black tracking-tight text-slate-900 leading-[0.85]",
  h2: "text-6xl md:text-8xl font-black text-slate-900 tracking-tighter",
  h3: "text-4xl font-black text-slate-900 tracking-tighter",
  accentTitle:
    "block text-xl md:text-2xl font-black text-(--color-accent) tracking-[0.3em] uppercase font-mono mt-4",
  accentItalic: "text-(--color-accent) italic",
  body: "text-xl text-slate-500 leading-relaxed font-medium",
  subtitle: "text-xl text-slate-400 font-medium",
  role: "text-(--color-accent) font-mono text-xs tracking-[0.4em] uppercase",
  footer: "text-xs text-slate-400 font-bold tracking-[0.4em] uppercase",
  footerSmall: "text-xs font-black uppercase tracking-[0.3em] text-slate-400",
  credit: "text-xs text-slate-300 font-black uppercase tracking-[0.2em]",
};

export function Text({
  variant = "bodyLarge",
  children,
  className,
  as: Component = "p",
}) {
  const baseClass = variants[variant] || variants.bodyLarge;

  return (
    <Component className={`${baseClass} ${className || ""}`}>
      {children}
    </Component>
  );
}
