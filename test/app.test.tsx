/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import { App } from "../src/app";

jest.mock('cards-webserver-client-ts-axios/dist/api', () => {
  return {
    CardsCRUDApi: jest.fn().mockImplementation(() => {
      return {
        cardControllerFindAll: jest.fn(() => {
          return { data: []}
        }),
      };
    }),
  };
});

describe("App", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  it("should show a sign in form if not authenticated", async () => {
    const component = render(<App />);
    await waitFor(() => screen.getByTestId("greeting"));
    expect(screen.getByTestId("greeting").textContent).toBe("Cards app");
    component.unmount();
  });
});
