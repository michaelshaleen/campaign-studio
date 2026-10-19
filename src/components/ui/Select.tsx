import { useId, type SelectHTMLAttributes } from "react";
import styles from "./Field.module.css";

export interface SelectOption { value: string; label: string }

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export function Select({ label, options, placeholder, error, ...rest }: SelectProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <select
        {...rest}
        id={id}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p id={errorId} className={styles.error}>{error}</p>}
    </div>
  );
}
