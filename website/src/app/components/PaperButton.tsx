import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  children: ReactNode;
};

export function PaperButton({ variant = "primary", children, className = "", ...rest }: Props) {
  const base =
    "group relative inline-flex items-center gap-2 px-6 py-3 font-display italic tracking-tight transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] active:translate-y-[1px]";
  const styles =
    variant === "primary"
      ? "bg-[var(--ink)] text-[var(--paper)] shadow-[0_2px_0_var(--ink),0_10px_24px_-12px_rgba(15,27,45,0.5)] hover:-translate-y-[2px]"
      : "bg-[var(--card)] text-[var(--ink)] border border-[var(--ink)]/20 shadow-[0_2px_0_rgba(15,27,45,0.15),0_8px_18px_-12px_rgba(15,27,45,0.35)] hover:-translate-y-[2px]";
  return (
    <button {...rest} className={`${base} ${styles} ${className}`}>
      <span style={{ fontSize: 18 }}>{children}</span>
    </button>
  );
}
