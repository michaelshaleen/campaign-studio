"use client";

import { useReportWebVitals } from "next/web-vitals";
import { logEvent } from "@/lib/monitoring";

/** Reports Core Web Vitals (LCP, INP, CLS, etc.) as structured events. */
export function WebVitals() {
  useReportWebVitals((metric) => {
    logEvent("web_vital", {
      name: metric.name,
      value: Math.round(metric.value * 100) / 100,
      rating: metric.rating,
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  });
  return null;
}
