import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({ variant = "primary", loading = false, disabled, children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={[styles.button, styles[variant], className].filter(Boolean).join(" ")}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? "Saving…" : children}
    </button>
  );
}
