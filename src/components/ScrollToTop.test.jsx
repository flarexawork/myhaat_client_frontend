import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

function Controls() {
  const navigate = useNavigate();
  return <><button onClick={() => navigate(-1)}>Back</button><button onClick={() => navigate(1)}>Forward</button></>;
}
function mount(path) {
  return render(<MemoryRouter initialEntries={[{ pathname: path, key: `entry-${path}` }]}>
    <ScrollToTop /><Controls />
    <Routes>
      <Route path={path} element={<Link to="/product/details/test">Product</Link>} />
      <Route path="/product/details/test" element={<Link to={path}>Fresh visit</Link>} />
    </Routes>
  </MemoryRouter>);
}
beforeEach(() => {
  Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 0 });
  Object.defineProperty(window, "scrollX", { configurable: true, writable: true, value: 0 });
  window.scrollTo = jest.fn(({ top = 0, left = 0 }) => { window.scrollY = top; window.scrollX = left; });
});

test.each(["/", "/shops"])("Back restores %s while product pages and fresh visits start at top", (path) => {
  mount(path);
  window.scrollY = 1840;
  fireEvent.scroll(window);
  fireEvent.click(screen.getByText("Product"));
  expect(window.scrollY).toBe(0);
  fireEvent.click(screen.getByText("Back"));
  expect(window.scrollY).toBe(1840);
  fireEvent.click(screen.getByText("Forward"));
  expect(window.scrollY).toBe(0);
  fireEvent.click(screen.getByText("Fresh visit"));
  expect(window.scrollY).toBe(0);
});

test("restoration waits for the listing to grow and stops when the customer scrolls", () => {
  jest.useFakeTimers();
  let heightLimit = 3000;
  window.scrollTo.mockImplementation(({ top }) => { window.scrollY = Math.min(top, heightLimit); });
  mount("/shops");
  window.scrollY = 2200;
  fireEvent.click(screen.getByText("Product"));
  heightLimit = 500;
  fireEvent.click(screen.getByText("Back"));
  expect(window.scrollY).toBe(500);
  heightLimit = 3000;
  act(() => { jest.advanceTimersByTime(32); });
  expect(window.scrollY).toBe(2200);
  fireEvent.click(screen.getByText("Product"));
  heightLimit = 500;
  fireEvent.click(screen.getByText("Back"));
  fireEvent.wheel(window);
  window.scrollTo.mockClear();
  act(() => { jest.advanceTimersByTime(100); });
  expect(window.scrollTo).not.toHaveBeenCalled();
  jest.useRealTimers();
});

test("the selected product stays aligned when images above it change height", () => {
  jest.useFakeTimers();
  let cardTop = 2000;
  let observer;
  const originalObserver = window.ResizeObserver;
  window.ResizeObserver = class {
    constructor(callback) { this.callback = callback; observer = this; }
    observe() {}
    disconnect() {}
  };
  const rect = jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({ top: cardTop - window.scrollY }));
  const { unmount } = mount("/shops");
  screen.getByText("Product").setAttribute("data-scroll-item", "shop-product");
  window.scrollY = 1840;
  fireEvent.click(screen.getByText("Product"));
  fireEvent.click(screen.getByText("Back"));
  screen.getByText("Product").setAttribute("data-scroll-item", "shop-product");
  cardTop = 2150;
  act(() => observer.callback());
  expect(window.scrollY).toBe(1990);
  expect(cardTop - window.scrollY).toBe(160);
  unmount();
  rect.mockRestore();
  window.ResizeObserver = originalObserver;
  jest.useRealTimers();
});
