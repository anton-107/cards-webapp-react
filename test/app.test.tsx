/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import { App } from "../src/app";

describe("App", () => {
  it("should show a sign in form if not authenticated", async () => {
    const component = render(<App />);
    await waitFor(() => screen.getByTestId("greeting"));
    expect(screen.getByTestId("greeting").textContent).toBe("Cards!");
    component.unmount();
  });
});
