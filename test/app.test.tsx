/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import { App } from "../src/app";
import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();

type MockResponse = {};

jest.mock("cards-webserver-client-ts-axios/dist/api", () => {
  return {
    CardsCRUDApi: jest.fn().mockImplementation(() => {
      return {
        cardControllerFindAllInSpace: jest.fn(() => {
          return { data: [] };
        }),
      };
    }),
  };
});

describe("App", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  beforeAll(() => {
    fetchMock.mockIf(
      /^https?:\/\/localhost.*$/,
      async (req: Request): Promise<MockResponse> => {
        console.log("FETCH MOCK", req.url);
        if (req.url.endsWith("auth/whoami")) {
          return JSON.stringify({
            isAuthenticated: true,
            username: "testuser",
          });
        }
        return JSON.stringify({
          url: req.url,
        });
      },
    );
  });
  it("should show a sign in form if not authenticated", async () => {
    const component = render(<App />);
    await waitFor(() => screen.getByTestId("greeting"));
    expect(screen.getByTestId("greeting").textContent).toMatch(
      /^Signed in as testuser/,
    );
    component.unmount();
  });
});
