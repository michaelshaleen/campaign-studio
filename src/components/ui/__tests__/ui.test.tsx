import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Badge, Button, Select, TextField } from "..";

describe("Button", () => {
  it("fires onClick and is reachable by role", async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables itself and announces busy state while loading", () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });
});

describe("TextField", () => {
  it("links the label, hint, and error to the input", () => {
    render(<TextField label="Daily budget" hint="Minimum $10." error="Too low." />);
    const input = screen.getByLabelText("Daily budget");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Minimum $10. Too low.");
  });
});

describe("accessibility", () => {
  it("has no axe violations across core components", async () => {
    const { container } = render(
      <form>
        <TextField label="Name" hint="Shown to your team." />
        <TextField label="Budget" error="Required." />
        <Select label="Objective" options={[{ value: "a", label: "Awareness" }]} placeholder="Choose" />
        <Badge tone="success">Active</Badge>
        <Button>Submit</Button>
      </form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
