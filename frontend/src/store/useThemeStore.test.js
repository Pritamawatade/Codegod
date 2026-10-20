import { beforeEach, describe, expect, it } from "vitest";
import useThemeStore from "./useThemeStore";

describe("useThemeStore", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    useThemeStore.setState({ theme: "dark" });
  });

  it("uses dark as the default theme", () => {
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("toggles from dark to light", () => {
    useThemeStore.getState().toggleTheme();

    expect(useThemeStore.getState().theme).toBe("light");
  });

  it("toggles back from light to dark", () => {
    useThemeStore.getState().toggleTheme();
    useThemeStore.getState().toggleTheme();

    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("removes the dark class when switching to light", () => {
    document.documentElement.classList.add("dark");

    useThemeStore.getState().setTheme("light");

    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("adds the dark class when switching to dark", () => {
    useThemeStore.getState().setTheme("dark");

    expect(document.documentElement).toHaveClass("dark");
  });

  it("persists the selected theme to localStorage", () => {
    useThemeStore.getState().setTheme("light");

    const stored = JSON.parse(localStorage.getItem("theme-storage"));

    expect(stored.state.theme).toBe("light");
  });
});
