import React, { useEffect } from "react";
import Ratings from "../Ratings";
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosHeartDislike } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  get_wishlist_products,
  remove_wishlist,
  messageClear,
} from "../../store/reducers/cardReducer";
import toast from "react-hot-toast";
import ProductImage from "../ProductImage";
const Wishlist = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlist, successMessage } = useSelector((state) => state.card);
  const userId = userInfo?.id;

  useEffect(() => {
    if (!userId) return;
    dispatch(get_wishlist_products(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage]);
  return (
  <>
    {wishlist.length === 0 ? (

      /* ================= EMPTY STATE ================= */
      <div className="flex flex-col items-center justify-center py-20 text-center">

        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-50 text-blue-900 mb-6">
          <AiFillHeart size={40} />
        </div>

        <h2 className="text-xl font-semibold text-blue-900 mb-2">
          Your Wishlist is Empty
        </h2>

        <p className="text-gray-500 max-w-md mb-6">
          Looks like you haven’t added any products to your wishlist yet.
          Start exploring and add items you love.
        </p>

        <Link
          to="/shops"
          className="px-6 py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
        >
          Explore Products
        </Link>

      </div>

    ) : (

      /* ================= PRODUCT GRID ================= */
      <div className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8">
        {wishlist.map((p, i) => {
          const discount = p.discount || 0;
          const discountedPrice =
            discount > 0
              ? p.price - Math.floor((p.price * discount) / 100)
              : p.price;

          return (
            <article
              key={p._id || i}
              className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >

              {/* IMAGE */}
              <div className="relative w-full">
                <Link
                  to={`/product/details/${p.slug}`}
                  className="block w-full"
                >
                  <ProductImage
                    alt={p.name}
                    className="w-full"
                    imgClassName="p-4"
                    src={p.image}
                  />
                </Link>

                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* CONTENT */}
              <div className="flex flex-col flex-1 p-6 justify-between">

                <div>
                  <h3 className="text-lg font-semibold text-blue-900 line-clamp-1">
                    {p.name}
                  </h3>

                  <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {p.description?.replace(/<[^>]+>/g, "")}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-blue-900">
                        ₹{discountedPrice}
                      </span>

                      {discount > 0 && (
                        <span className="block text-sm text-gray-400 line-through">
                          ₹{p.price}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-orange-500">
                      <Ratings ratings={p.rating || 0} />
                      <span className="text-sm text-gray-600">
                        {(p.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex gap-3">

                    <button
                      onClick={() => dispatch(remove_wishlist(p._id))}
                      className="h-10 w-10 rounded-lg border flex items-center justify-center transition bg-white text-blue-900 border-gray-300 hover:bg-red-500 hover:text-white"
                    >
                      <IoIosHeartDislike size={18} />
                    </button>

                    <Link
                      to={`/product/details/${p.slug}`}
                      className="h-10 w-10 rounded-lg border flex items-center justify-center transition bg-white text-blue-900 border-gray-300 hover:bg-blue-900 hover:text-white"
                    >
                      <FaEye size={16} />
                    </Link>

                    <button className="h-10 w-10 rounded-lg border flex items-center justify-center transition bg-white text-blue-900 border-gray-300 hover:bg-blue-900 hover:text-white">
                      <AiOutlineShoppingCart size={18} />
                    </button>

                  </div>

                  <button className="h-10 px-6 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition">
                    Buy Now
                  </button>
                </div>

              </div>
            </article>
          );
        })}
      </div>

    )}
  </>
);

};

export default Wishlist;
