import { describe, expect, it } from "vitest";
import { getLanguageId, getLanguageName } from "./lang";

const languages = [
  [74, "TypeScript"],
  [63, "JAVASCRIPT"],
  [71, "Python"],
  [62, "Java"],
  [54, "C++"],
  [50, "C"],
  [86, "Clojure"],
  [57, "Elixir"],
  [60, "Go"],
  [72, "Ruby"],
  [73, "Rust"],
  [45, "Assembly"],
  [51, "C#"],
];

const lookupLanguages = languages.filter(([, name]) => name !== "TypeScript");

describe("getLanguageName", () => {
  it.each(languages)("maps language id %i to %s", (id, name) => {
    expect(getLanguageName(id)).toBe(name);
  });

  it("returns Unknown for an unknown language id", () => {
    expect(getLanguageName(9999)).toBe("Unknown");
  });

  it("returns Unknown when no language id is provided", () => {
    expect(getLanguageName(undefined)).toBe("Unknown");
  });
});

describe("getLanguageId", () => {
  it.each(lookupLanguages)("maps %s to language id %i", (id, name) => {
    expect(getLanguageId(name)).toBe(id);
  });

  it("is case-insensitive for lowercase language names", () => {
    expect(getLanguageId("javascript")).toBe(63);
  });

  it("is case-insensitive for mixed-case language names", () => {
    expect(getLanguageId("Python")).toBe(71);
  });

  it("returns undefined for an unknown language", () => {
    expect(getLanguageId("Brainfuck")).toBeUndefined();
  });
});
