// date.test.ts
import { beforeEach, afterEach, test, describe, expect } from "vitest";
import { determinePriority, Priority } from "./date";

function mockDateNow(mockNow: number) {
  const _DateNow = Date.now;
  Date.now = () => mockNow;
  afterEach(() => {
    Date.now = _DateNow;
  });
}

describe("determineColor", () => {
  const nowDate = new Date("2023-03-25T23:30:00.000Z");
  const nowTimestamp = nowDate.getTime();
  beforeEach(() => {
    // Mock Date.now
    mockDateNow(nowTimestamp);
  });

  test("returns High if the date is the past", () => {
    const date = "2023-03-24T23:30:00.000Z";
    expect(determinePriority(date)).toBe(Priority.High);
  });

  test("returns Medium if the date is the same date as Date.now()", () => {
    const date = "2023-03-25T23:59:00.000Z";
    expect(determinePriority(date)).toBe(Priority.Medium);
  });

  test("returns Low if the date is one day after Date.now()", () => {
    const date = "2023-03-26T01:30:00.000Z";
    expect(determinePriority(date)).toBe(Priority.Low);
  });
  test("returns Default if the date is two days after Date.now()", () => {
    const date = "2023-03-27T01:30:00.000Z";
    expect(determinePriority(date)).toBe(Priority.Default);
  });
});
