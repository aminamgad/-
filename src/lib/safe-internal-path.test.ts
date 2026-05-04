import { describe, expect, it } from "vitest";
import { safeInternalPath } from "./safe-internal-path";

describe("safeInternalPath", () => {
  it("يقبل المسارات النسبية", () => {
    expect(safeInternalPath("/dashboard", "/")).toBe("/dashboard");
  });

  it("يرفض الروابط الخارجية", () => {
    expect(safeInternalPath("https://evil.com", "/")).toBe("/");
  });

  it("يرفض //evil", () => {
    expect(safeInternalPath("//evil.com/x", "/")).toBe("/");
  });
});
