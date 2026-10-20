import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
  it("renders the provided button text", () => {
    render(<Button buttonText="Save changes" />);

    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("renders a native button element", () => {
    render(<Button buttonText="Submit" />);

    expect(screen.getByRole("button").tagName).toBe("BUTTON");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button buttonText="Run" onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "Run" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when clicked without an onClick handler", async () => {
    const user = userEvent.setup();
    render(<Button buttonText="No handler" />);

    await user.click(screen.getByRole("button", { name: "No handler" }));

    expect(screen.getByRole("button", { name: "No handler" })).toBeInTheDocument();
  });

  it("uses primary styles by default", () => {
    render(<Button buttonText="Primary" />);

    expect(screen.getByRole("button")).toHaveClass("bg-zinc-950", "text-white");
  });

  it("uses secondary styles when requested", () => {
    render(<Button buttonText="Secondary" variant="secondary" />);

    expect(screen.getByRole("button")).toHaveClass("border", "border-zinc-200");
  });

  it("appends a custom class name", () => {
    render(<Button buttonText="Custom" className="custom-class" />);

    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("renders the provided icon", () => {
    const Icon = () => <svg data-testid="button-icon" />;
    render(<Button buttonText="With icon" Icon={Icon} />);

    expect(screen.getByTestId("button-icon")).toBeInTheDocument();
  });
});
