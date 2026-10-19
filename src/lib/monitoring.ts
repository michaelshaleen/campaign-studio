/**
 * Minimal observability layer. Every event is a structured JSON log line, which
 * tools like Datadog, Splunk, or Grafana Loki can ingest directly. Swap the
 * `transport` for a vendor SDK (e.g. Sentry) without touching call sites.
 */
type Level = "info" | "warn" | "error";

export interface LogEvent {
  level: Level;
  event: string;
  timestamp: string;
  [key: string]: unknown;
}

type Transport = (e: LogEvent) => void;

let transport: Transport = (e) => {
  const line = JSON.stringify(e);
  if (e.level === "error") console.error(line);
  else if (e.level === "warn") console.warn(line);
  else console.info(line);
};

export function setTransport(t: Transport) {
  transport = t;
}

export function logEvent(event: string, data: Record<string, unknown> = {}, level: Level = "info") {
  transport({ level, event, timestamp: new Date().toISOString(), ...data });
}

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  const err = error instanceof Error ? error : new Error(String(error));
  logEvent("error", { message: err.message, stack: err.stack, ...context }, "error");
}

/** Wraps an async handler and records latency + failures. */
export async function withTiming<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    logEvent("timing", { name, ms: Math.round(performance.now() - start), ok: true });
    return result;
  } catch (e) {
    logEvent("timing", { name, ms: Math.round(performance.now() - start), ok: false }, "warn");
    reportError(e, { name });
    throw e;
  }
}
