import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { CampaignTable } from "../CampaignTable";
import { listCampaigns, resetStore } from "@/lib/store";

beforeEach(resetStore);

describe("CampaignTable", () => {
  it("lists every campaign by default", () => {
    render(<CampaignTable campaigns={listCampaigns()} />);
    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows).toHaveLength(listCampaigns().length + 1); // + header row
  });

  it("filters by status and announces the result count", async () => {
    render(<CampaignTable campaigns={listCampaigns()} />);
    await userEvent.selectOptions(screen.getByLabelText("Filter by status"), "active");
    expect(screen.getByRole("rowheader", { name: /Holiday Toys/ })).toBeInTheDocument();
    expect(screen.queryByRole("rowheader", { name: /Back to School/ })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Showing 1 of 4 campaigns");
  });

  it("is accessible", async () => {
    const { container } = render(<CampaignTable campaigns={listCampaigns()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
