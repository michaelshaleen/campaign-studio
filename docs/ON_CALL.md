# On-call runbook: Campaign Studio

This runbook describes how the app is monitored and what to do when something breaks.
It's written as if the app ran in production, to show how I approach operating a frontend.

## Signals

| Signal | Source | Healthy | Page someone when |
|---|---|---|---|
| Liveness | `GET /api/health` | `200 {"status":"ok"}` | 3 failed checks in a row |
| API latency | `timing` events (`name`, `ms`, `ok`) | p95 under 300 ms | p95 over 1 s for 10 min |
| API errors | `error` events, `timing` with `ok:false` | under 0.5% | over 2% for 5 min |
| Validation failures | `campaign.validation_failed` (`fields`) | steady baseline | sudden spike (likely a UI or contract regression) |
| Core Web Vitals | `web_vital` events (LCP, INP, CLS) | "good" rating | LCP rating "poor" for over 25% of page views |
| Client crashes | `error` events with `boundary:"app"` | near zero | any spike after a deploy |

All events are structured JSON (see `src/lib/monitoring.ts`), so they can feed Datadog, Splunk,
or Grafana dashboards and alerts without code changes. A vendor SDK such as Sentry plugs in via
`setTransport()`.

## Triage steps

1. **Check whether it's us.** Hit `/api/health`. If it's down, check hosting status and the most recent deploy.
2. **Correlate with deploys.** If errors started right after a release, roll back first and investigate second.
3. **Scope the impact.** Group `error` events by `message` and `page`. Is it one page, one browser, or every user?
4. **Reproduce.** Run the matching Playwright test locally (`npm run test:e2e -- -g "<name>"`), or write one that reproduces the bug.
5. **Fix forward with a test.** Every incident fix ships with a regression test so it can't recur.
6. **Write it up.** Short postmortem: impact, timeline, root cause, and what prevents it next time.

## Example incident (from building this project)

**Symptom:** New campaigns saved successfully (201 from the API) but never appeared in the list.
**Root cause:** In a production build, Next.js bundled the API route and the page separately, so each
had its own copy of the in-memory store module.
**Fix:** Pin the store to `globalThis` so the server shares one instance.
**Prevention:** The end-to-end test "advertiser creates a campaign end to end" fails if the list and
API ever drift apart again. Unit tests alone didn't catch it, which is why the e2e layer exists.
