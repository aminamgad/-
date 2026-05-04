import { describe, expect, it } from "vitest";
import { isInReminderWindow } from "./reminder-window";

describe("isInReminderWindow", () => {
  it("يتطابق عند البعد المحدد ضمن النافذة", () => {
    const now = new Date("2026-05-05T12:00:00.000Z");
    const leadHours = 24;
    const windowMinutes = 60;
    const target = new Date(now.getTime() + leadHours * 60 * 60 * 1000);
    expect(isInReminderWindow(target, now, leadHours, windowMinutes)).toBe(true);
  });

  it("يرفض المواعيد في الماضي", () => {
    const now = new Date("2026-05-05T12:00:00.000Z");
    const past = new Date(now.getTime() - 60 * 60 * 1000);
    expect(isInReminderWindow(past, now, 24, 90)).toBe(false);
  });

  it("يرفض البعد خارج النافذة", () => {
    const now = new Date("2026-05-05T12:00:00.000Z");
    const far = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    expect(isInReminderWindow(far, now, 24, 90)).toBe(false);
  });
});
