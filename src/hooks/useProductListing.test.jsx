import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import useProductListing from "./useProductListing";
import api from "../api/api";

jest.mock("../api/api", () => ({ get: jest.fn() }));

function Listing() {
  const list = useProductListing({ category: "Clothes", preserveHistory: true });
  return <>
    <span data-testid="state">{JSON.stringify({ page: list.pageNumber, sort: list.sortPrice, rating: list.rating, price: list.priceValues })}</span>
    {list.loading ? <p>Loading</p> : <Link to="/product/details/example">{list.products?.[0]?.name}</Link>}
    <button onClick={() => list.setSortPrice("high-to-low")}>Sort</button>
    <button onClick={() => list.setRating(4)}>Rating</button>
    <button onClick={() => list.setPriceValues([100, 500])}>Price</button>
    <button onClick={() => list.setPageNumber(3)}>Page 3</button>
  </>;
}
function Detail() {
  const navigate = useNavigate();
  return <><button onClick={() => navigate(-1)}>Back</button><Link to="/shops">Fresh shop</Link></>;
}
test("restores Shop filters, page and loaded products without a fetch that resets the list", async () => {
  api.get.mockImplementation((url, options) => Promise.resolve({ data: url.includes("query-products")
    ? { products: [{ name: `Product page ${options.params.pageNumber}` }], totalProduct: 60, parPage: 12 }
    : { priceRange: { low: 0, high: 1000 } } }));
  render(<MemoryRouter initialEntries={[{ pathname: "/shops", key: "listing-state" }]}><Routes>
    <Route path="/shops" element={<Listing />} />
    <Route path="/product/details/example" element={<Detail />} />
  </Routes></MemoryRouter>);
  await screen.findByText("Product page 1");
  for (const name of ["Sort", "Rating", "Price", "Page 3"]) {
    fireEvent.click(screen.getByText(name));
    await waitFor(() => expect(screen.queryByText("Loading")).not.toBeInTheDocument());
  }
  const state = screen.getByTestId("state").textContent;
  expect(JSON.parse(state)).toEqual({ page: 3, sort: "high-to-low", rating: 4, price: [100, 500] });
  fireEvent.click(screen.getByText("Product page 3"));
  api.get.mockClear();
  fireEvent.click(screen.getByText("Back"));
  expect(screen.getByTestId("state").textContent).toBe(state);
  expect(screen.getByText("Product page 3")).toBeInTheDocument();
  expect(api.get).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("Product page 3"));
  fireEvent.click(screen.getByText("Fresh shop"));
  await screen.findByText("Product page 1");
  expect(JSON.parse(screen.getByTestId("state").textContent)).toEqual({ page: 1, sort: "", rating: "", price: [0, 1000] });
});
