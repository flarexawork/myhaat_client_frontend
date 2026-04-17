import React, { useEffect } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Ratings from "../Ratings";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";
import ProductImage from "../ProductImage";
import {
  add_to_card,
  get_wishlist_products,
  messageClear,
  add_to_wishlist,
} from "../../store/reducers/cardReducer";

const FeatureProducts = ({ products, loading = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { successMessage, errorMessage, wishlist } = useSelector(
    (state) => state.card,
  );
  const userId = userInfo?.id;

  const add_card = (id) => {
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity: 1,
          productId: id,
        }),
      );
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!userId) return;
    dispatch(get_wishlist_products(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [dispatch, errorMessage, successMessage]);

  const add_wishlist = (pro) => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    dispatch(
      add_to_wishlist({
        userId: userInfo.id,
        productId: pro._id,
        name: pro.name,
        price: pro.price,
        image: pro.images?.[0] || "",
        discount: pro.discount,
        rating: pro.rating,
        slug: pro.slug,
      }),
    );
  };

  const openDetails = (slug) => {
    navigate(`/product/details/${slug}`);
  };

  const isWishlisted = (product) =>
    wishlist.some((w) => {
      const wishlistProductId =
        typeof w.productId === "string" ? w.productId : w.productId?._id;
      return wishlistProductId === product._id || w.slug === product.slug;
    });

  return (
    <div className="w-full">
      <div className="pb-10 text-center">
        <span className="inline-flex items-center rounded-full border border-[#f8c9ad] bg-[#fff1e8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#c2410c]">
          Featured
        </span>
        <h2 className="mt-3 text-3xl font-bold text-slate-800 md:text-2xl">
          Featured Sarees Collection
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-6 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}

        {!loading && products.map((p, i) => {
          const discount = Number(p.discount) || 0;
          const discountedPrice =
            discount > 0
              ? p.price - Math.floor((p.price * discount) / 100)
              : p.price;
          const cleanedDescription = p.description
            ? p.description.replace(/(<([^>]+)>)/gi, "")
            : "Premium fabric, elegant detailing and everyday comfort.";
          const wishlisted = isWishlisted(p);

          return (
            <article
              key={i}
              onClick={() => openDetails(p.slug)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openDetails(p.slug);
                }
              }}
              role="button"
              tabIndex={0}
              className="group overflow-hidden rounded-[22px] border border-[#f2dfd4] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(15,23,42,0.15)]"
            >
              <div className="relative">
                <ProductImage
                  alt={p.name}
                  className="w-full"
                  imgClassName="p-4 sm:p-3"
                  loading="lazy"
                  src={p.images?.[0]}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 via-black/8 to-transparent" />

                {discount > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#111827] px-3 py-1 text-[11px] font-semibold text-[#fed7aa]">
                    {discount}% OFF
                  </span>
                )}

                <div className="absolute right-3 top-3 flex translate-y-1 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!wishlisted) {
                        add_wishlist(p);
                      } else {
                        navigate("/dashboard/my-wishlist");
                      }
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full shadow transition-colors ${
                      wishlisted
                        ? "bg-[#f97316] text-white"
                        : "bg-white/95 text-slate-700 hover:bg-[#f97316] hover:text-white"
                    }`}
                  >
                    {wishlisted ? <AiFillHeart size={16} /> : <AiOutlineHeart size={16} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(p.slug);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow transition-colors hover:bg-[#2563eb] hover:text-white"
                  >
                    <FaEye size={14} />
                  </button>
                </div>

                <span className="absolute bottom-3 left-3 rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                  {p.category}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="min-h-[46px] text-[16px] font-semibold leading-snug text-slate-800 line-clamp-2 group-hover:text-[#c2410c] transition-colors">
                    {p.name}
                  </h3>
                  <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wide text-slate-500">
                    {p.shopName || "My Haat"}
                  </span>
                </div>

                <p className="mt-2 min-h-[38px] text-[12px] text-slate-500 line-clamp-2">
                  {cleanedDescription.slice(0, 90)}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Ratings ratings={p.rating} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(p.slug);
                    }}
                    className="text-[11px] font-semibold uppercase tracking-wide text-[#c2410c] hover:text-[#ea580c]"
                  >
                    View
                  </button>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold leading-none text-slate-900">
                      ₹{discountedPrice}
                    </p>
                    {discount > 0 ? (
                      <p className="mt-1 text-sm text-slate-400 line-through">
                        ₹{p.price}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                        Best Price
                      </p>
                    )}
                  </div>
                  {discount > 0 && (
                    <span className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[11px] font-semibold text-[#c2410c]">
                      Save {discount}%
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-[40px_minmax(0,1fr)] items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!wishlisted) {
                        add_wishlist(p);
                      } else {
                        navigate("/dashboard/my-wishlist");
                      }
                    }}
                    className={`flex h-[40px] w-[40px] items-center justify-center rounded-xl border border-[#f8c9ad] transition-colors ${
                      wishlisted
                        ? "bg-[#f97316] text-white"
                        : "bg-[#fff1e8] text-[#c2410c] hover:bg-[#f97316] hover:text-white"
                    }`}
                  >
                    {wishlisted ? <AiFillHeart size={16} /> : <AiOutlineHeart size={16} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      add_card(p._id);
                    }}
                    className="flex h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-[#0f1c2e] px-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#ff7a1a]"
                  >
                    <AiOutlineShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureProducts;
