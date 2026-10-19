import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CampaignForm } from "../CampaignForm";

const push = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh: jest.fn() }) }));

beforeEach(() => {
  push.mockReset();
  global.fetch = jest.fn();
});

describe("CampaignForm", () => {
  it("shows an error summary and blocks submit when fields are empty", async () => {
    render(<CampaignForm />);
    await userEvent.click(screen.getByRole("button", { name: "Create campaign" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Fix 5 problems to continue");
    expect(screen.getByLabelText("Campaign name")).toHaveAttribute("aria-invalid", "true");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("submits a valid campaign and navigates back to the list", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, status: 201, json: async () => ({}) });
    render(<CampaignForm />);
    await userEvent.type(screen.getByLabelText("Campaign name"), "Spring Patio Launch");
    await userEvent.selectOptions(screen.getByLabelText("Objective"), "conversion");
    await userEvent.type(screen.getByLabelText(/Daily budget/), "250");
    await userEvent.type(screen.getByLabelText("Start date"), "2030-03-01");
    await userEvent.type(screen.getByLabelText("End date"), "2030-04-01");
    await userEvent.click(screen.getByRole("button", { name: "Create campaign" }));

    expect(global.fetch).toHaveBeenCalledWith("/api/campaigns", expect.objectContaining({ method: "POST" }));
    expect(push).toHaveBeenCalledWith("/campaigns");
  });

  it("shows a friendly message when the server fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });
    render(<CampaignForm />);
    await userEvent.type(screen.getByLabelText("Campaign name"), "X");
    await userEvent.selectOptions(screen.getByLabelText("Objective"), "awareness");
    await userEvent.type(screen.getByLabelText(/Daily budget/), "50");
    await userEvent.type(screen.getByLabelText("Start date"), "2030-03-01");
    await userEvent.type(screen.getByLabelText("End date"), "2030-04-01");
    await userEvent.click(screen.getByRole("button", { name: "Create campaign" }));
    expect(await screen.findByText(/couldn't save your campaign/)).toBeInTheDocument();
  });
});
