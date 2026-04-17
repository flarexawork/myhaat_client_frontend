import { useEffect, useLayoutEffect, useRef, useState } from "react";
import api from "../api/api";

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_QUERY_HIGH_PRICE = Number.MAX_SAFE_INTEGER;

const normalizePriceRange = (priceRange) => {
  const low = Number(priceRange?.low) || 0;
  const high = Number(priceRange?.high) || 0;

  return {
    low,
    high: low === high ? high + 100 : high,
  };
};

const getErrorMessage = (error) =>
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load products right now.";

const useProductListing = ({ category = "", searchValue = "" } = {}) => {
  const [products, setProducts] = useState(null);
  const [totalProduct, setTotalProduct] = useState(0);
  const [parPage, setParPage] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rating, setRating] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [rangeData, setRangeData] = useState(null);
  const [priceValues, setPriceValues] = useState([0, 0]);
  const [reloadToken, setReloadToken] = useState(0);

  const requestSequenceRef = useRef(0);
  const hasInitializedRangeRef = useRef(false);
  const skipNextFetchRef = useRef(false);
  const previousFilterKeyRef = useRef(null);

  const [lowPrice, highPrice] = priceValues;

  const filterKey = JSON.stringify({
    category,
    searchValue,
    rating,
    sortPrice,
    lowPrice,
    highPrice,
    hasRange: hasInitializedRangeRef.current,
  });

  useLayoutEffect(() => {
    if (skipNextFetchRef.current) {
      return;
    }

    setLoading(true);
    setProducts(null);
    setTotalProduct(0);
    setError("");
  }, [
    category,
    filterKey,
    highPrice,
    lowPrice,
    pageNumber,
    rating,
    reloadToken,
    searchValue,
    sortPrice,
  ]);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      previousFilterKeyRef.current = filterKey;
      return;
    }

    const filtersChanged =
      previousFilterKeyRef.current !== null &&
      previousFilterKeyRef.current !== filterKey;

    if (filtersChanged && pageNumber !== 1) {
      previousFilterKeyRef.current = filterKey;
      setPageNumber(1);
      return;
    }

    previousFilterKeyRef.current = filterKey;

    const controller = new AbortController();
    const requestId = ++requestSequenceRef.current;
    const queryLowPrice = hasInitializedRangeRef.current ? lowPrice : 0;
    const queryHighPrice = hasInitializedRangeRef.current
      ? highPrice
      : DEFAULT_QUERY_HIGH_PRICE;

    Promise.all([
      api.get("/home/query-products", {
        params: {
          category,
          rating,
          lowPrice: queryLowPrice,
          highPrice: queryHighPrice,
          sortPrice,
          pageNumber,
          searchValue,
        },
        signal: controller.signal,
      }),
      api.get("/home/price-range-latest-product", {
        signal: controller.signal,
      }),
    ])
      .then(([productsResponse, priceRangeResponse]) => {
        if (controller.signal.aborted || requestId !== requestSequenceRef.current) {
          return;
        }

        const nextProducts = Array.isArray(productsResponse.data?.products)
          ? productsResponse.data.products
          : [];
        const nextPriceRange = normalizePriceRange(
          priceRangeResponse.data?.priceRange,
        );

        setProducts(nextProducts);
        setTotalProduct(Number(productsResponse.data?.totalProduct) || 0);
        setParPage(Number(productsResponse.data?.parPage) || DEFAULT_PAGE_SIZE);
        setRangeData(nextPriceRange);
        setLoading(false);
        setError("");

        if (!hasInitializedRangeRef.current) {
          hasInitializedRangeRef.current = true;
          skipNextFetchRef.current = true;
          setPriceValues([nextPriceRange.low, nextPriceRange.high]);
        }
      })
      .catch((apiError) => {
        if (controller.signal.aborted || requestId !== requestSequenceRef.current) {
          return;
        }

        setLoading(false);
        setProducts(null);
        setTotalProduct(0);
        setError(getErrorMessage(apiError));
      });

    return () => {
      controller.abort();
    };
  }, [
    category,
    filterKey,
    highPrice,
    lowPrice,
    pageNumber,
    rating,
    reloadToken,
    searchValue,
    sortPrice,
  ]);

  const resetListingFilters = () => {
    setRating("");
    setSortPrice("");
    setPageNumber(1);

    if (rangeData) {
      setPriceValues([rangeData.low, rangeData.high]);
    }
  };

  const retry = () => {
    setReloadToken((current) => current + 1);
  };

  return {
    error,
    loading,
    pageNumber,
    parPage,
    priceValues,
    products,
    rangeData,
    rating,
    resetListingFilters,
    retry,
    setPageNumber,
    setPriceValues,
    setRating,
    setSortPrice,
    sortPrice,
    totalProduct,
  };
};

export default useProductListing;
