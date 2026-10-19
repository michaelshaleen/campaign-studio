import { logEvent, reportError, setTransport, withTiming, type LogEvent } from "../monitoring";

describe("monitoring", () => {
  let events: LogEvent[];
  beforeEach(() => {
    events = [];
    setTransport((e) => events.push(e));
  });

  it("emits structured events with a timestamp", () => {
    logEvent("campaign.created", { id: "c-1" });
    expect(events[0]).toMatchObject({ level: "info", event: "campaign.created", id: "c-1" });
    expect(Date.parse(events[0].timestamp)).not.toBeNaN();
  });

  it("normalizes non-Error values in reportError", () => {
    reportError("boom", { component: "X" });
    expect(events[0]).toMatchObject({ level: "error", message: "boom", component: "X" });
  });

  it("records timing for success and failure", async () => {
    await withTiming("ok-op", () => 1);
    await expect(withTiming("bad-op", () => { throw new Error("fail"); })).rejects.toThrow("fail");
    expect(events.map((e) => [e.event, e.ok ?? e.level])).toEqual([
      ["timing", true],
      ["timing", false],
      ["error", "error"],
    ]);
  });
});
