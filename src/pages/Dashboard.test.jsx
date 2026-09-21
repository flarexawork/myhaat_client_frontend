import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";

jest.mock("../components/Headers", () => () => null);
jest.mock("../components/Footer", () => () => null);
jest.mock("react-redux", () => ({ useDispatch: () => jest.fn() }));
jest.mock("../store/reducers/authReducer", () => ({ customer_logout: jest.fn(), user_reset: jest.fn() }));
jest.mock("../store/reducers/cardReducer", () => ({ reset_count: jest.fn() }));

function Page() {
  const navigate = useNavigate();
  const location = useLocation();
  return <>
    <div data-testid="current-page">{location.pathname}</div>
    <button onClick={() => navigate(-1)}>Back</button>
    <button onClick={() => navigate(1)}>Forward</button>
  </>;
}

test("customer menu closes on Back, Forward, and menu navigation", () => {
  const { container } = render(
    <MemoryRouter initialEntries={["/dashboard", "/dashboard/my-orders"]}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Page />} />
          <Route path="my-orders" element={<Page />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
  const toggle = container.querySelector("button");
  const sidebar = screen.getByRole("link", { name: "Dashboard" }).closest("ul").parentElement;
  expect(sidebar).toHaveClass("-left-[360px]");
  fireEvent.click(toggle);
  expect(sidebar).toHaveClass("-left-4");
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  expect(screen.getByTestId("current-page")).toHaveTextContent(/^\/dashboard$/);
  expect(sidebar).toHaveClass("-left-[360px]");
  fireEvent.click(toggle);
  expect(sidebar).toHaveClass("-left-4");
  fireEvent.click(screen.getByRole("button", { name: "Forward" }));
  expect(screen.getByTestId("current-page")).toHaveTextContent("/dashboard/my-orders");
  expect(sidebar).toHaveClass("-left-[360px]");
  fireEvent.click(toggle);
  fireEvent.click(screen.getByRole("link", { name: "Dashboard" }));
  expect(screen.getByTestId("current-page")).toHaveTextContent(/^\/dashboard$/);
  expect(sidebar).toHaveClass("-left-[360px]");
});