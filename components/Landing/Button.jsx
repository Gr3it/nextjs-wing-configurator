import React from "react";
import Link from "next/link";

const variants = {
  primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200/50",
  secondary: "bg-slate-100 hover:bg-slate-200 text-slate-900",
  accent: "bg-(--color-accent) hover:opacity-90 text-slate-900",
  outline: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-900",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-xl gap-2",
  md: "px-6 py-3 text-base rounded-2xl gap-3",
  lg: "px-8 py-4 text-sm rounded-3xl gap-3 font-black", 
  xl: "px-10 py-5 text-base rounded-3xl gap-3 font-black",
};

export function Button({
  href,
  icon: Icon,
  rightIcon: RightIcon,
  iconClassName = "",
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) {
  const isExternal = href?.startsWith("http");
  const baseClasses = "group inline-flex items-center justify-center font-bold transition-all active:scale-98 whitespace-nowrap cursor-pointer";
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;

  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  const iconStyles = `w-5 h-5 shrink-0 transition-transform ${iconClassName}`;

  const content = (
    <>
      {Icon && (
        <Icon className={`${iconStyles} group-hover:-translate-y-0.5`} />
      )}
      {children}
      {RightIcon && (
        <RightIcon className={`${iconStyles} group-hover:translate-x-1`} />
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
