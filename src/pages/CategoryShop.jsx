import React, { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Range, getTrackBackground } from "react-range";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { AiFillStar, AiOutlineClose } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { BsFillGridFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import ShopProducts from "../components/products/ShopProducts";
import Pagination from "../components/Pagination";
import {
  price_range_product,
  query_products,
} from "../store/reducers/homeReducer";
import { useNavigate } from "react-router-dom";

const CategoryShops = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const navigate = useNavigate();
  const { products, totalProduct, priceRange, parPage } = useSelector(
    (state) => state.home,
  );

  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [styles, setStyles] = useState("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [state, setState] = useState({ values: [50, 100] });
  const [rating, setRatingQ] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [rangeData, setRangeData] = useState(null);
  const [lowPrice, highPrice] = state.values;

  useEffect(() => {
    dispatch(price_range_product());
  }, [dispatch]);

  useEffect(() => {
    const low = Number(priceRange.low) || 0;
    const high = Number(priceRange.high) || 100;
    const normalizedHigh = low === high ? high + 100 : high;

    setRangeData({
      low,
      high: normalizedHigh,
    });
    setState({ values: [low, normalizedHigh] });
  }, [priceRange.high, priceRange.low]);

  useEffect(() => {
    setPageNumber(1);
  }, [category, rating, sortPrice, lowPrice, highPrice]);

  useEffect(() => {
    dispatch(
      query_products({
        low: lowPrice,
        high: highPrice,
        category,
        rating,
        sortPrice,
        pageNumber,
      }),
    );
  }, [dispatch, lowPrice, highPrice, category, rating, sortPrice, pageNumber]);

  const resetFilters = () => {
    setRatingQ("");
    setSortPrice("");
    setPageNumber(1);
    if (rangeData) {
      setState({ values: [rangeData.low, rangeData.high] });
    }
    navigate("/shops");
  };

  const ratingOptions = [5, 4, 3, 2, 1];
  const hasPriceFilter =
    rangeData &&
    (Math.floor(lowPrice) !== Math.floor(rangeData.low) ||
      Math.floor(highPrice) !== Math.floor(rangeData.high));

  const renderRatingStars = (value) =>
    Array.from({ length: 5 }, (_, index) =>
      index < value ? (
        <AiFillStar key={`${value}-fill-${index}`} />
      ) : (
        <CiStar key={`${value}-empty-${index}`} />
      ),
    );

  const renderFilters = (isMobile = false) => (
    <div className="rounded-2xl border border-[#f3d8c9] bg-white p-5">
      <div className="flex items-center justify-between border-b border-[#f8e7dc] pb-4">
        <h2 className="text-lg font-bold text-[#1f2937]">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold uppercase tracking-wide text-[#c2410c] hover:text-[#ea580c]"
        >
          Clear All
        </button>
      </div>

      <div className="pt-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Price Range
        </h3>
        <div className="mt-5">
          {rangeData && (
            <Range
              step={1}
              min={rangeData.low}
              max={rangeData.high}
              values={state.values}
              onChange={(values) => setState({ values })}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    background: getTrackBackground({
                      values: state.values,
                      colors: ["#f6dfd2", "#f97316", "#f6dfd2"],
                      min: rangeData.low,
                      max: rangeData.high,
                    }),
                  }}
                  className="h-[7px] w-full rounded-full"
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  className="h-[18px] w-[18px] rounded-full border-2 border-[#fff3ea] bg-[#f97316] shadow"
                  {...props}
                />
              )}
            />
          )}
        </div>

        <div className="mt-4 rounded-xl bg-[#fff7f2] px-3 py-2 text-sm font-semibold text-[#c2410c]">
          INR {Math.floor(lowPrice)} - INR {Math.floor(highPrice)}
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Rating
        </h3>
        <div className="mt-3 space-y-2">
          {ratingOptions.map((value) => (
            <button
              key={value}
              onClick={() => setRatingQ(value)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                Number(rating) === value
                  ? "border-[#f97316] bg-[#fff1e8] text-[#c2410c]"
                  : "border-[#f2dfd4] bg-white text-slate-600 hover:border-[#f8c9ad] hover:bg-[#fff8f3]"
              }`}
            >
              <span className="flex items-center gap-1 text-base text-[#f97316]">
                {renderRatingStars(value)}
              </span>
              <span className="text-xs font-medium text-slate-500">& up</span>
            </button>
          ))}
          <button
            onClick={() => setRatingQ("")}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
              rating
                ? "border-[#f2dfd4] bg-white text-slate-600 hover:border-[#f8c9ad] hover:bg-[#fff8f3]"
                : "border-[#f97316] bg-[#fff1e8] text-[#c2410c]"
            }`}
          >
            All ratings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#fffdfa]">
      <Headers />
      <div className="mx-auto max-w-[1440px] px-16 sm:px-5 md-lg:px-12 md:px-10">
        <section
          style={{ backgroundImage: 'url("/images/banner/shop.gif")' }}
          className="relative mt-6 overflow-hidden rounded-3xl border border-[#f3d8c9] bg-cover bg-left bg-no-repeat"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#111827e0] via-[#1f2937c9] to-[#7c2d1200]" />
          <div className="relative flex min-h-[250px] items-center px-10 py-10 md:px-6">
            <div className="max-w-[560px] text-white">
              <span className="inline-flex items-center rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
                Category Collection
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-3xl sm:text-2xl">
                {category || "Curated products for every style"}
              </h1>
              <p className="mt-3 text-sm text-white/85 sm:text-[13px]">
                Browse trusted picks from this category with fast filtering and
                smooth shopping flow.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-medium text-white">
                <Link to="/" className="transition-colors hover:text-[#fed7aa]">
                  Home
                </Link>
                <span className="pt-1 text-base">
                  <MdOutlineKeyboardArrowRight />
                </span>
                <span className="text-[#fed7aa]">Category</span>
              </div>
            </div>
            <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[#fb923c2e]" />
            <div className="absolute -bottom-16 right-20 h-44 w-44 rounded-full bg-[#fdba7438] md:hidden" />
          </div>
        </section>
      </div>

      <section className="pb-16 pt-8">
        <div className="mx-auto max-w-[1440px] px-16 sm:px-5 md-lg:px-12 md:px-10">
          <div className="hidden md-lg:block">
            <div className="flex items-center justify-between rounded-2xl border border-[#f3d8c9] bg-white px-4 py-3 shadow-sm">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="rounded-lg bg-[#fff1e8] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#c2410c]"
              >
                Open Filters
              </button>
              <span className="text-sm font-medium text-slate-600">
                {totalProduct} results
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-6 md-lg:mt-4">
            <div className="sticky top-5 max-h-[calc(100vh-20px)] w-[305px] flex-shrink-0 self-start overflow-y-auto pr-1 md-lg:hidden">
              {renderFilters()}
            </div>

            <div className="flex-1">
              <div className="rounded-2xl border border-[#f3d8c9] bg-white p-4 shadow-sm sm:p-3">
                <div className="flex items-center justify-between gap-4 md:flex-col md:items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 sm:text-lg">
                      {totalProduct} products in {category || "collection"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Refine by price and ratings to find better matches.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {category && (
                        <span className="rounded-full bg-[#fff1e8] px-3 py-1 text-xs font-semibold text-[#c2410c]">
                          Category: {category}
                        </span>
                      )}
                      {rating && (
                        <span className="rounded-full bg-[#fff1e8] px-3 py-1 text-xs font-semibold text-[#c2410c]">
                          Rating: {rating} & up
                        </span>
                      )}
                      {hasPriceFilter && (
                        <span className="rounded-full bg-[#fff1e8] px-3 py-1 text-xs font-semibold text-[#c2410c]">
                          INR {Math.floor(lowPrice)} - INR{" "}
                          {Math.floor(highPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:w-full sm:flex-col sm:items-stretch">
                    <select
                      value={sortPrice}
                      onChange={(e) => setSortPrice(e.target.value)}
                      className="h-[42px] rounded-xl border border-[#f3d8c9] bg-[#fffaf6] px-3 text-sm font-medium text-slate-700 outline-none focus:border-[#f97316] sm:w-full"
                    >
                      <option value="">Sort by</option>
                      <option value="low-to-high">Price: Low to High</option>
                      <option value="high-to-low">Price: High to Low</option>
                    </select>

                    <div className="flex items-center gap-2 rounded-xl border border-[#f3d8c9] bg-[#fffaf6] p-1">
                      <button
                        onClick={() => setStyles("grid")}
                        className={`flex h-[34px] w-[34px] items-center justify-center rounded-lg transition-colors ${
                          styles === "grid"
                            ? "bg-[#f97316] text-white"
                            : "text-slate-600 hover:bg-[#fff1e8]"
                        }`}
                      >
                        <BsFillGridFill />
                      </button>
                      <button
                        onClick={() => setStyles("list")}
                        className={`flex h-[34px] w-[34px] items-center justify-center rounded-lg transition-colors ${
                          styles === "list"
                            ? "bg-[#f97316] text-white"
                            : "text-slate-600 hover:bg-[#fff1e8]"
                        }`}
                      >
                        <FaThList />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pb-8 pt-6">
                {products.length > 0 ? (
                  <ShopProducts products={products} styles={styles} />
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#f3d8c9] bg-white px-5 py-12 text-center">
                    <h3 className="text-lg font-semibold text-slate-800">
                      No products matched your filters
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Try changing rating or price range to see more results.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-4 rounded-xl bg-[#f97316] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ea580c]"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>

              {totalProduct > parPage && (
                <div className="flex justify-center">
                  <Pagination
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalItem={totalProduct}
                    parPage={parPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="hidden md-lg:block">
        <div
          onClick={() => setMobileFilterOpen(false)}
          className={`fixed inset-0 z-[99996] bg-black/45 transition-opacity duration-200 ${
            mobileFilterOpen
              ? "visible opacity-100"
              : "invisible opacity-0 pointer-events-none"
          }`}
        />
        <aside
          className={`fixed left-0 top-0 z-[99997] h-screen w-[88%] max-w-[360px] border-r border-[#f3d8c9] bg-[#fffdfa] shadow-2xl transition-transform duration-300 ${
            mobileFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-[#f3d8c9] px-4 py-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1f2937]">
                Filter Products
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1e8] text-[#c2410c]"
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {renderFilters(true)}
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryShops;
