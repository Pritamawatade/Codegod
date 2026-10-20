import { describe, expect, it } from "vitest";
import { axiosInstance } from "./axios";

describe("axiosInstance", () => {
  it("sends cookies with every request", () => {
    expect(axiosInstance.defaults.withCredentials).toBe(true);
  });

  it("targets the versioned API base path", () => {
    expect(axiosInstance.defaults.baseURL).toMatch(/\/api\/v1$/);
  });
});
