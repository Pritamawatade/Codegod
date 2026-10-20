import { describe, expect, it } from "vitest";
import { useAuthStore } from "./useAuthStore";
import useProblemStore from "./useProblemStore";

describe("store initial state", () => {
  it("starts without an authenticated user", () => {
    expect(useAuthStore.getState().authUser).toBeNull();
  });

  it("starts with an empty user list", () => {
    expect(useAuthStore.getState().allUsers).toEqual([]);
  });

  it("starts with no problems loaded", () => {
    expect(useProblemStore.getState().problems).toEqual([]);
  });

  it("starts with no solved problems", () => {
    expect(useProblemStore.getState().solvedProblems).toEqual([]);
  });
});
