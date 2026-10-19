import type { Metadata } from "next";
import Link from "next/link";
import { WebVitals } from "@/components/WebVitals";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: { default: "Campaign Studio", template: "%s · Campaign Studio" },
  description: "Self-service ad campaign management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <WebVitals />
        <header className={styles.header}>
          <Link href="/campaigns" className={styles.brand}>
            <span aria-hidden="true" className={styles.mark}>◆</span> Campaign Studio
          </Link>
          <nav aria-label="Primary">
            <Link href="/campaigns">Campaigns</Link>
          </nav>
        </header>
        <main id="main" className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
