import { NextResponse } from "next/server";

/** Liveness check for load balancers, uptime monitors, and the Playwright web server. */
export function GET() {
  return NextResponse.json({ status: "ok", uptimeSeconds: Math.round(process.uptime()) });
}
