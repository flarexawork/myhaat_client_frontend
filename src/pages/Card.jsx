import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import CartUpdateSkeleton from "../components/skeletons/CartUpdateSkeleton";
import {
  get_card_products,
  delete_card_product,
  messageClear,
  quantity_inc,
  quantity_dec,
} from "../store/reducers/cardReducer";
import ProductImage from "../components/ProductImage";

const Card = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    card_products,
    successMessage,
    price,
    buy_product_item,
    shipping_fee,
    outofstock_products,
    cardLoading,
    cartUpdating,
  } = useSelector((state) => state.card);
  const userId = userInfo?.id;

  useEffect(() => {
    if (!userId) return;
    dispatch(get_card_products(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      if (userId) {
        dispatch(get_card_products(userId));
      }
    }
  }, [dispatch, successMessage, userId]);

  const redirect = () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    navigate("/shipping", {
      state: {
        products: card_products,
        price,
        shipping_fee,
        items: buy_product_item,
      },
    });
  };

  const inc = (quantity, stock, cardId) => {
    if (quantity + 1 <= stock) {
      dispatch(quantity_inc(cardId));
    }
  };

  const dec = (quantity, cardId) => {
    if (quantity - 1 !== 0) {
      dispatch(quantity_dec(cardId));
    }
  };

  const hasItems = card_products.length > 0 || outofstock_products.length > 0;

  return (
    <div className="min-h-screen bg-[var(--mh-bg)]">
      <Headers />

      <div className="mx-auto max-w-[1440px] px-16 pt-6 md-lg:px-10 md:px-6 sm:px-4">
        <section
          className="relative mt-6 h-[220px] overflow-hidden rounded-[28px] bg-cover bg-left bg-no-repeat"
          style={{ backgroundImage: 'url("/images/banner/card.jpg")' }}
        >
          <div className="absolute inset-0 bg-[rgba(15,28,46,0.72)]">
            <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-white">
              <h2 className="text-3xl font-bold">My Haat</h2>
              <div className="flex items-center gap-2 text-lg">
                <Link to="/">Home</Link>
                <MdOutlineKeyboardArrowRight />
                <span>Cart</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="mx-auto max-w-[1440px] px-16 py-16 md-lg:px-10 md:px-6 sm:px-4">
          {cardLoading ? (
            <CartUpdateSkeleton />
          ) : hasItems ? (
            <div className="grid grid-cols-12 gap-6 md-lg:grid-cols-1">
              <div className="col-span-8 space-y-4 md-lg:col-span-1">
                {cartUpdating && (
                  <div className="mh-card p-4">
                    <div className="skeleton h-4 w-44 rounded-full" />
                  </div>
                )}

                {card_products.map((shop, index) => (
                  <div key={index} className="mh-card p-5">
                    <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--mh-border)] pb-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Seller
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-[var(--mh-ink)]">
                          {shop.shopName}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {shop.products.map((item) => {
                        const finalPrice =
                          item.productInfo.price -
                          Math.floor(
                            (item.productInfo.price * item.productInfo.discount) / 100,
                          );

                        return (
                          <div
                            key={item._id}
                            className="grid grid-cols-[96px_minmax(0,1fr)_160px] gap-4 rounded-[24px] border border-[var(--mh-border)] bg-[#fffdfb] p-4 sm:grid-cols-1"
                          >
                            <ProductImage
                              alt={item.productInfo.name}
                              className="w-24 rounded-2xl border border-[var(--mh-border)]"
                              imgClassName="p-2"
                              loading="lazy"
                              src={item.productInfo.images?.[0]}
                            />

                            <div className="min-w-0">
                              <h4 className="text-base font-semibold text-[var(--mh-ink)]">
                                {item.productInfo.name}
                              </h4>
                              <p className="mt-1 text-sm text-slate-500">
                                Brand: {item.productInfo.brand || "MyHaat"}
                              </p>
                              <div className="mt-3 flex flex-wrap items-end gap-3">
                                <span className="text-xl font-bold text-[var(--mh-primary)]">
                                  ₹{finalPrice}
                                </span>
                                <span className="text-sm text-slate-400 line-through">
                                  ₹{item.productInfo.price}
                                </span>
                                <span className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-xs font-semibold text-[#c95802]">
                                  {item.productInfo.discount}% OFF
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 sm:items-start">
                              <div className="flex h-10 items-center rounded-2xl border border-[var(--mh-border)] bg-white px-3">
                                <button
                                  className="px-3 text-lg font-semibold text-slate-700 hover:text-[var(--mh-primary)]"
                                  onClick={() => dec(item.quantity, item._id)}
                                  type="button"
                                >
                                  -
                                </button>
                                <span className="min-w-[30px] text-center text-sm font-semibold text-[var(--mh-ink)]">
                                  {item.quantity}
                                </span>
                                <button
                                  className="px-3 text-lg font-semibold text-slate-700 hover:text-[var(--mh-primary)]"
                                  onClick={() =>
                                    inc(item.quantity, item.productInfo.stock, item._id)
                                  }
                                  type="button"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                className="rounded-xl bg-[#ef4444] px-4 py-2 text-sm font-semibold text-white hover:bg-[#dc2626] disabled:opacity-60"
                                disabled={cartUpdating}
                                onClick={() => dispatch(delete_card_product(item._id))}
                                type="button"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {!!outofstock_products.length && (
                  <div className="mh-card p-5">
                    <div className="mb-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                        Attention
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-red-500">
                        Out of Stock {outofstock_products.length}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {outofstock_products.map((item) => {
                        const product = item.products[0];
                        const finalPrice =
                          product.price - Math.floor((product.price * product.discount) / 100);

                        return (
                          <div
                            key={item._id}
                            className="grid grid-cols-[96px_minmax(0,1fr)_120px] gap-4 rounded-[24px] border border-[var(--mh-border)] bg-[#fffdfb] p-4 sm:grid-cols-1"
                          >
                            <ProductImage
                              alt={product.name}
                              className="w-24 rounded-2xl border border-[var(--mh-border)]"
                              imgClassName="p-2"
                              loading="lazy"
                              src={product.images?.[0]}
                            />
                            <div>
                              <h4 className="text-base font-semibold text-[var(--mh-ink)]">
                                {product.name}
                              </h4>
                              <p className="mt-1 text-sm text-slate-500">
                                Brand: {product.brand || "MyHaat"}
                              </p>
                              <p className="mt-3 text-lg font-bold text-[var(--mh-primary)]">
                                ₹{finalPrice}
                              </p>
                            </div>
                            <button
                              className="h-10 rounded-xl bg-[#ef4444] px-4 py-2 text-sm font-semibold text-white hover:bg-[#dc2626] disabled:opacity-60"
                              disabled={cartUpdating}
                              onClick={() => dispatch(delete_card_product(item._id))}
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-4 md-lg:col-span-1">
                <div className="sticky top-5 space-y-4 md-lg:static">
                  {card_products.length > 0 && (
                    <div className="mh-card p-5 text-slate-600">
                      <h2 className="text-xl font-bold text-[var(--mh-ink)]">
                        Order Summary
                      </h2>
                      <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span>{buy_product_item} Item</span>
                          <span>₹{price}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Shipping Fee</span>
                          <span>₹{shipping_fee}</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            className="w-full rounded-xl border border-[var(--mh-border)] bg-[#fffdfb] px-3 py-2 outline-none focus:border-[#ffb17d]"
                            placeholder="Enter voucher coupon"
                            type="text"
                          />
                          <button className="rounded-xl bg-[#0f1c2e] px-4 py-2 text-sm font-semibold uppercase text-white hover:bg-[#162845]">
                            Apply
                          </button>
                        </div>
                        <div className="flex items-center justify-between border-t border-[var(--mh-border)] pt-3">
                          <span>Total</span>
                          <span className="text-lg font-bold text-[var(--mh-primary)]">
                            ₹{price + shipping_fee}
                          </span>
                        </div>
                        <button
                          className="w-full rounded-2xl bg-[var(--mh-primary)] px-5 py-3 text-sm font-semibold uppercase text-white hover:bg-[var(--mh-primary-dark)] disabled:opacity-60"
                          disabled={cartUpdating}
                          onClick={redirect}
                          type="button"
                        >
                          Proceed to checkout {buy_product_item}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mh-card p-8 text-center">
              <p className="text-base text-slate-600">
                Your cart is empty. Explore the marketplace and add your next pick.
              </p>
              <Link
                className="mt-4 inline-flex rounded-2xl bg-[var(--mh-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--mh-primary-dark)]"
                to="/shops"
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Card;
