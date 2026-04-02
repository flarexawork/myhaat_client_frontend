import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BsCartCheckFill } from "react-icons/bs";
import Ratings from "../Ratings";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  add_to_card,
  add_to_wishlist,
  get_card_products,
  get_wishlist_products,
  messageClear,
  remove_wishlist,
} from "../../store/reducers/cardReducer";
import { fetchShippingFee } from "../../utils/shippingFee";

const ShopProducts = ({ styles, products }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { successMessage, errorMessage, wishlist, card_products } = useSelector(
    (state) => state.card,
  );

  const userId = userInfo?.id;

  /* ===========================
     FETCH CART + WISHLIST
  =========================== */
  useEffect(() => {
    if (!userId) return;
    dispatch(get_wishlist_products(userId));
    dispatch(get_card_products(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      if (userId) {
        dispatch(get_wishlist_products(userId));
        dispatch(get_card_products(userId));
      }
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [dispatch, successMessage, errorMessage, userId]);

  /* ===========================
     HELPERS
  =========================== */

  const openDetails = (slug) => {
    navigate(`/product/details/${slug}`);
  };

  const isInCart = (productId) => {
    return card_products.some((shop) =>
      (shop.products || []).some(
        (cp) => cp.productInfo?._id?.toString() === productId?.toString(),
      ),
    );
  };

  const findWishlistItem = (product) =>
    wishlist.find((item) => {
      const productId =
        typeof item.productId === "string"
          ? item.productId
          : item.productId?._id;
      return productId === product._id;
    });

  const toggleWishlist = (product) => {
    if (!userInfo) return navigate("/login");

    const existing = findWishlistItem(product);
    if (existing) {
      dispatch(remove_wishlist(existing._id));
    } else {
      dispatch(
        add_to_wishlist({
          userId: userInfo.id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          discount: product.discount,
          rating: product.rating,
          slug: product.slug,
        }),
      );
    }
  };

  const add_card = (id) => {
    if (!userInfo) return navigate("/login");

    dispatch(
      add_to_card({
        userId: userInfo.id,
        quantity: 1,
        productId: id,
      }),
    );
  };

  const buy_now = async (product) => {
    if (!userInfo) return navigate("/login");

    const discount = Number(product.discount) || 0;
    const finalPrice =
      discount > 0
        ? product.price - Math.floor((product.price * discount) / 100)
        : product.price;

    const shippingFee = await fetchShippingFee(1);

    navigate("/shipping", {
      state: {
        products: [
          {
            sellerId: product.sellerId,
            shopName: product.shopName,
            price: finalPrice,
            products: [{ quantity: 1, productInfo: product }],
          },
        ],
        price: finalPrice,
        shipping_fee: shippingFee,
        items: 1,
      },
    });
  };

  /* ===========================
     RENDER
  =========================== */

  return (
    <div
      className={`w-full grid gap-6 ${
        styles === "grid"
          ? "grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
          : "grid-cols-1"
      }`}
    >
      {products.map((p, i) => {
        const discount = Number(p.discount) || 0;
        const safeRating = Number(p.rating) || 0;
        const discountedPrice =
          discount > 0
            ? p.price - Math.floor((p.price * discount) / 100)
            : p.price;

        const primaryImage = p.images?.[0] || "/images/default-product.png";

        const cleanedDescription = p.description
          ? p.description.replace(/(<([^>]+)>)/gi, "")
          : "Premium quality product with elegant styling.";

        const wishlisted = Boolean(findWishlistItem(p));
        const inCart = isInCart(p._id);

        return (
          <article
            key={p._id || i}
            className={`group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
              styles === "grid"
                ? "flex flex-col"
                : "flex flex-row lg:flex-row md:flex-row sm:flex-col"
            }`}
          >
            {/* IMAGE */}
            <div
              className={`relative overflow-hidden ${
                styles === "grid"
                  ? "h-[300px]"
                  : "w-[280px] h-[260px] md:w-[240px] sm:w-full"
              }`}
            >
              <button
                onClick={() => openDetails(p.slug)}
                className="w-full h-full"
              >
                <img
                  src={primaryImage}
                  alt={p.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </button>

              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="flex flex-col flex-1 p-5 justify-between">
              <div>
                <h3 className="text-base font-semibold text-blue-900 line-clamp-1">
                  {p.name}
                </h3>

                <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {cleanedDescription}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-blue-900">
                      ₹{discountedPrice}
                    </span>
                    {discount > 0 && (
                      <span className="block text-xs text-gray-400 line-through">
                        ₹{p.price}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-orange-500">
                    <Ratings ratings={safeRating} />
                    <span className="text-sm text-gray-600">
                      {safeRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div
                className={`mt-5 ${
                  styles === "grid"
                    ? "grid grid-cols-2 gap-3"
                    : "flex items-center gap-4 flex-wrap"
                }`}
              >
                <div className="flex flex-row gap-3">
                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(p)}
                    className={`h-10 w-10 rounded-lg border flex items-center justify-center transition ${
                      wishlisted
                        ? "bg-blue-900 text-white border-blue-900"
                        : "bg-white text-blue-900 border-gray-300 hover:bg-blue-50"
                    }`}
                  >
                    {wishlisted ? (
                      <AiFillHeart size={18} />
                    ) : (
                      <AiOutlineHeart size={18} />
                    )}
                  </button>

                  {/* Cart */}
                  <button
                    onClick={() =>
                      inCart ? navigate("/card") : add_card(p._id)
                    }
                    className={`h-10 w-10 rounded-lg border flex items-center justify-center transition ${
                      inCart
                        ? "bg-blue-900 text-white border-blue-900"
                        : "bg-white text-blue-900 border-gray-300 hover:bg-blue-50"
                    }`}
                  >
                    {inCart ? (
                      <BsCartCheckFill size={18} />
                    ) : (
                      <AiOutlineShoppingCart size={18} />
                    )}
                  </button>
                </div>
                {/* Buy Now */}
                <button
                  onClick={() => buy_now(p)}
                  className="h-10 px-6 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ShopProducts;
