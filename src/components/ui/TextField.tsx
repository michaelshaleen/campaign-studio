import { useId, type InputHTMLAttributes } from "react";
import styles from "./Field.module.css";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
}

/** Labeled input with hint and error text wired up via aria-describedby. */
export function TextField({ label, hint, error, ...rest }: TextFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      {hint && <p id={hintId} className={styles.hint}>{hint}</p>}
      <input
        {...rest}
        id={id}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
      />
      {error && <p id={errorId} className={styles.error}>{error}</p>}
    </div>
  );
}
