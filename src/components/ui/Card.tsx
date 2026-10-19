import styles from "./Card.module.css";

export function Card({ children, as: Tag = "section", ...rest }: { children: React.ReactNode; as?: "section" | "div" | "article" } & React.HTMLAttributes<HTMLElement>) {
  return <Tag {...rest} className={styles.card}>{children}</Tag>;
}

export function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <dt className={styles.statLabel}>{label}</dt>
      <dd className={styles.statValue}>{value}</dd>
    </div>
  );
}
