import React from "react";
import { Loader2, type LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "rounded-lg font-semibold transition flex items-center gap-2 shadow-lg";

  const variants = {
    primary: "bg-dota-dire hover:bg-opacity-90 text-white",
    secondary: "bg-dota-border hover:bg-dota-border/80 text-white border border-dota-border/50",
    danger: "bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 hover:border-red-500/70 text-red-300",
    outline: "bg-transparent border-2 border-dota-border hover:bg-dota-border/20 text-dota-text",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};
