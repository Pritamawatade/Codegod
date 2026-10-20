import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginFailed from "./LoginFailed";

describe("LoginFailed", () => {
  it("renders the login failed message", () => {
    render(<LoginFailed />);

    expect(screen.getByText("LoginFailed")).toBeInTheDocument();
  });
});
