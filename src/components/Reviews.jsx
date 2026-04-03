import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingReact from "react-rating";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Ratings from "./Ratings";
import Pagination from "./Pagination";
import ReviewSkeleton from "./skeletons/ReviewSkeleton";
import {
  customer_review,
  get_product,
  get_reviews,
  messageClear,
} from "../store/reducers/homeReducer";
import { get_orders } from "../store/reducers/orderReducer";
import { formatDateTime } from "../utils/dateFormatter";

const ratingLabels = [
  { label: "5 star", value: 5, index: 0 },
  { label: "4 star", value: 4, index: 1 },
  { label: "3 star", value: 3, index: 2 },
  { label: "2 star", value: 2, index: 3 },
  { label: "1 star", value: 1, index: 4 },
];

const Reviews = ({ product }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { myOrders } = useSelector((state) => state.order);
  const { successMessage, reviews, totalReview, rating_review, reviewsLoading } =
    useSelector((state) => state.home);

  const [pageNumber, setPageNumber] = useState(1);
  const perPage = 10;
  const [rat, setRat] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (!product?._id) return;
    dispatch(
      get_reviews({
        productId: product._id,
        pageNumber,
      }),
    );
  }, [dispatch, pageNumber, product]);

  useEffect(() => {
    if (!userInfo?.id) return;
    dispatch(get_orders({ status: "all", customerId: userInfo.id }));
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(
        get_reviews({
          productId: product._id,
          pageNumber,
        }),
      );
      dispatch(get_product(product.slug));
      setRat(0);
      setReviewText("");
      dispatch(messageClear());
    }
  }, [dispatch, pageNumber, product, successMessage]);

  const userPurchased = Boolean(
    userInfo?.id &&
      myOrders?.some((order) =>
        order?.products?.some((item) => {
          const itemId = item?._id || item?.productId;
          return itemId === product?._id || item?.slug === product?.slug;
        }),
      ),
  );

  const review_submit = (e) => {
    e.preventDefault();
    if (!rat) {
      toast.error("Please select a rating");
      return;
    }

    dispatch(
      customer_review({
        name: userInfo.name,
        review: reviewText,
        rating: rat,
        productId: product._id,
      }),
    );
  };

  return (
    <div className="mt-8 space-y-8">
      <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-6 md:grid-cols-1">
        <div className="mh-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Average Rating
          </p>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-5xl font-bold text-[var(--mh-ink)]">
              {Number(product.rating || 0).toFixed(1)}
            </span>
            <span className="pb-1 text-xl font-semibold text-slate-400">/ 5</span>
          </div>
          <div className="mt-4 flex text-lg">
            <Ratings ratings={product.rating} />
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Based on {totalReview} customer reviews
          </p>
        </div>

        <div className="mh-card p-6">
          <div className="space-y-4">
            {ratingLabels.map((item) => {
              const count = rating_review[item.index]?.sum || 0;
              const width = totalReview ? Math.floor((100 * count) / totalReview) : 0;

              return (
                <div key={item.value} className="grid grid-cols-[68px_minmax(0,1fr)_44px] items-center gap-3">
                  <span className="text-sm font-medium text-slate-600">{item.label}</span>
                  <div className="h-3 overflow-hidden rounded-full bg-[#f1ece5]">
                    <div
                      className="h-full rounded-full bg-[var(--mh-primary)] transition-all duration-300"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-right text-sm font-semibold text-slate-500">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-[var(--mh-ink)]">
            Customer Reviews
          </h2>
          <span className="rounded-full border border-[var(--mh-border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {totalReview} total
          </span>
        </div>

        {reviewsLoading ? (
          <ReviewSkeleton count={3} />
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <article key={index} className="mh-card p-5">
                <div className="flex items-start justify-between gap-4 sm:flex-col sm:items-start">
                  <div>
                    <p className="text-base font-semibold text-[var(--mh-ink)]">
                      {review.name}
                    </p>
                    <div className="mt-2 flex text-base text-[#ffb347]">
                      <Ratings ratings={review.rating} />
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">{formatDateTime(review.date)}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {review.review}
                </p>
              </article>
            ))}

            <div className="flex justify-end">
              {totalReview > perPage && (
                <Pagination
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  totalItem={totalReview}
                  perPage={perPage}
                  showItem={Math.round(totalReview / perPage)}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="mh-card p-8 text-center text-slate-500">
            No reviews yet for this product.
          </div>
        )}
      </div>

      <div className="mh-card p-6">
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-start">
          <div>
            <h3 className="text-xl font-bold text-[var(--mh-ink)]">Write a Review</h3>
            <p className="mt-1 text-sm text-slate-500">
              Reviews are available only after a confirmed purchase.
            </p>
          </div>
          {userPurchased && (
            <span className="rounded-full bg-[#fff1e8] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#c2410c]">
              Verified Buyer
            </span>
          )}
        </div>

        {!userInfo ? (
          <div className="mt-5 rounded-2xl border border-[var(--mh-border)] bg-[#fffaf6] px-4 py-4">
            <p className="text-sm text-slate-600">
              Login to view your purchase eligibility and leave a review.
            </p>
            <Link
              className="mt-3 inline-flex rounded-xl bg-[var(--mh-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--mh-primary-dark)]"
              to="/login"
            >
              Login
            </Link>
          </div>
        ) : !userPurchased ? (
          <div className="mt-5 rounded-2xl border border-[var(--mh-border)] bg-[#fffaf6] px-4 py-4">
            <p className="text-sm font-medium text-slate-700">
              You can review this product after purchasing it.
            </p>
          </div>
        ) : (
          <form onSubmit={review_submit} className="mt-5 space-y-4">
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-600">Your rating</p>
              <RatingReact
                onChange={(value) => setRat(value)}
                initialRating={rat}
                emptySymbol={
                  <span className="text-4xl text-slate-300">
                    <CiStar />
                  </span>
                }
                fullSymbol={
                  <span className="text-4xl text-[#ffb347]">
                    <AiFillStar />
                  </span>
                }
              />
            </div>
            <div>
              <textarea
                value={reviewText}
                required
                onChange={(e) => setReviewText(e.target.value)}
                className="min-h-[150px] w-full rounded-2xl border border-[var(--mh-border)] bg-[#fffdfb] p-4 text-sm text-slate-700 outline-none focus:border-[#ffb17d] focus:ring-2 focus:ring-[#ffe3cf]"
                placeholder="Share fit, fabric, quality and overall experience..."
              />
            </div>
            <button
              className="rounded-xl bg-[var(--mh-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--mh-primary-dark)]"
              type="submit"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Reviews;
