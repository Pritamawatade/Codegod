export function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JAVASCRIPT",
    71: "Python",
    62: "Java",
    54: "C++",
    50: "C",
    86: "Clojure",
    57: "Elixir",
    60: "Go",
    72: "Ruby",
    73: "Rust",
    45: "Assembly",
    51: "C#",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

// export { getLanguageName };

export function getLanguageId(language) {
  const languageMap = {
    TypeScript: 74,
    JAVASCRIPT: 63,
    PYTHON: 71,
    JAVA: 62,
    "C++": 54,
    C: 50,
    CLOJURE: 86,
    ELIXIR: 57,
    GO: 60,
    RUBY: 72,
    RUST: 73,
    ASSEMBLY: 45,
    "C#": 51,
  };
  return languageMap[language.toUpperCase()] || undefined;
}
