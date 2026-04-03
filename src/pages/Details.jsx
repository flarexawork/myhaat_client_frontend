import React, { useEffect, useRef, useState } from "react";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useDispatch, useSelector } from "react-redux";
import Ratings from "../components/Ratings";
import Reviews from "../components/Reviews";
import ProductPageSkeleton from "../components/skeletons/ProductPageSkeleton";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";
import { get_product } from "../store/reducers/homeReducer";
import {
  add_to_card,
  add_to_wishlist,
  messageClear,
} from "../store/reducers/cardReducer";
import toast from "react-hot-toast";
import { fetchShippingFee } from "../utils/shippingFee";

const Details = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { product, relatedProducts, totalReview, productLoading } = useSelector(
    (state) => state.home,
  );
  const { userInfo } = useSelector((state) => state.auth);
  const { errorMessage, successMessage, cartUpdating } = useSelector(
    (state) => state.card,
  );

  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [gallerySwiper, setGallerySwiper] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const thumbnailRefs = useRef([]);

  const images = product.images || [];
  const discount = Number(product.discount) || 0;
  const finalPrice =
    discount > 0
      ? product.price - Math.floor((product.price * discount) / 100)
      : product.price || 0;

  const metaRows = [
    { label: "Brand", value: product.brand || "MyHaat" },
    { label: "Category", value: product.category || "-" },
    { label: "Seller", value: product.shopName || "MyHaat Store" },
    { label: "Fabric", value: product.brand || "Premium Fabric" },
  ];

  const specificationRows = [
    { label: "Brand", value: product.brand || "MyHaat" },
    { label: "Category", value: product.category || "-" },
    { label: "Discount", value: discount ? `${discount}%` : "0%" },
    { label: "Rating", value: `${Number(product.rating || 0).toFixed(1)} / 5` },
    { label: "Stock", value: product.stock || 0 },
  ];

  useEffect(() => {
    dispatch(get_product(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    setQuantity(1);
    setImageIndex(0);
    setLoadedImages({});
  }, [product._id]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [dispatch, errorMessage, successMessage]);

  const syncImage = (nextIndex) => {
    if (!images.length) return;
    const normalizedIndex = (nextIndex + images.length) % images.length;
    setImageIndex(normalizedIndex);
    if (gallerySwiper) {
      gallerySwiper.slideTo(normalizedIndex);
    }
  };

  useEffect(() => {
    const activeThumb = thumbnailRefs.current[imageIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [imageIndex]);

  const handleImageLoad = (image) => {
    setLoadedImages((prev) => ({
      ...prev,
      [image]: true,
    }));
  };

  const inc = () => {
    if (quantity >= product.stock) {
      toast.error("Out of stock");
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const dec = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addCard = (productId = product._id, selectedQuantity = quantity) => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    dispatch(
      add_to_card({
        userId: userInfo.id,
        quantity: selectedQuantity,
        productId,
      }),
    );
  };

  const addWishlist = (selectedProduct = product) => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    dispatch(
      add_to_wishlist({
        userId: userInfo.id,
        productId: selectedProduct._id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.images[0],
        discount: selectedProduct.discount,
        rating: selectedProduct.rating,
        slug: selectedProduct.slug,
      }),
    );
  };

  const buy = async () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    const computedPrice =
      discount > 0
        ? product.price - Math.floor((product.price * product.discount) / 100)
        : product.price;

    const shippingFee = await fetchShippingFee(1);

    navigate("/shipping", {
      state: {
        products: [
          {
            sellerId: product.sellerId,
            shopName: product.shopName,
            price: computedPrice * quantity,
            products: [
              {
                quantity,
                productInfo: product,
              },
            ],
          },
        ],
        price: computedPrice * quantity,
        shipping_fee: shippingFee,
        items: 1,
      },
    });
  };

  if (productLoading && !product?._id) {
    return (
      <div className="min-h-screen bg-[var(--mh-bg)]">
        <Headers />
        <ProductPageSkeleton />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--mh-bg)]">
      <Headers />

      <div className="mx-auto max-w-[1200px] px-5 pt-5 sm:px-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link className="hover:text-[var(--mh-primary)]" to="/">
            Home
          </Link>
          <MdOutlineKeyboardArrowRight />
          <Link className="hover:text-[var(--mh-primary)]" to="/">
            {product.category || "Products"}
          </Link>
          <MdOutlineKeyboardArrowRight />
          <span className="text-slate-700">{product.name}</span>
        </div>
      </div>

      <section className="mx-auto max-w-[1200px] px-5 pb-10 pt-5 sm:px-4">
        <div className="grid grid-cols-[45%_55%] gap-8 lg:gap-6 md-lg:grid-cols-1 md-lg:gap-5">
          <div className="min-w-0">
            <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 md:grid-cols-1">
              {images.length > 1 && (
                <div className="max-h-[420px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:hidden">
                  <div className="flex flex-col gap-2">
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}-desktop-thumb`}
                        ref={(element) => {
                          thumbnailRefs.current[index] = element;
                        }}
                        aria-label={`View image ${index + 1}`}
                        className={`overflow-hidden rounded-[6px] bg-white ${
                          imageIndex === index
                            ? "border-2 border-[var(--mh-primary)]"
                            : "border border-[#eee] hover:border-[#ffd1b0]"
                        }`}
                        onClick={() => syncImage(index)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            syncImage(index);
                          }
                        }}
                        type="button"
                      >
                        <img
                          alt={product.name || "Product"}
                          className="h-[70px] w-[70px] object-cover"
                          loading="lazy"
                          src={image}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="min-w-0">
                <div className="relative min-w-0 overflow-hidden rounded-[8px] bg-white">
                <Swiper
                  allowTouchMove={true}
                  className="w-full"
                  onSlideChange={(swiper) => setImageIndex(swiper.activeIndex)}
                  onSwiper={setGallerySwiper}
                  slidesPerView={1}
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={`${image}-slide-${index}`}>
                      <div className="relative h-[450px] overflow-hidden bg-white sm:h-[350px]">
                        {!loadedImages[image] && (
                          <div className="absolute inset-0 skeleton rounded-md" />
                        )}
                        <img
                          alt={product.name || "Product"}
                          className={`h-full w-full ${
                            loadedImages[image] ? "opacity-100" : "opacity-0"
                          }`}
                          loading={index === 0 ? "eager" : "lazy"}
                          onLoad={() => handleImageLoad(image)}
                          src={image}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "top",
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {images.length > 1 && (
                  <>
                    <button
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm hover:text-[var(--mh-primary)]"
                      onClick={() => syncImage(imageIndex - 1)}
                      type="button"
                    >
                      <FiChevronLeft size={18} />
                    </button>
                    <button
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm hover:text-[var(--mh-primary)]"
                      onClick={() => syncImage(imageIndex + 1)}
                      type="button"
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </>
                )}
                </div>
              </div>
            </div>

            {images.length > 1 && (
              <div className="mt-3 hidden gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:flex">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}-mobile-thumb`}
                    ref={(element) => {
                      thumbnailRefs.current[index] = element;
                    }}
                    aria-label={`View image ${index + 1}`}
                    className={`flex-shrink-0 overflow-hidden rounded-[6px] bg-white ${
                      imageIndex === index
                        ? "border-2 border-[var(--mh-primary)]"
                        : "border border-[#eee] hover:border-[#ffd1b0]"
                    }`}
                    onClick={() => syncImage(index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        syncImage(index);
                      }
                    }}
                    type="button"
                  >
                    <img
                      alt={product.name || "Product"}
                      className="h-[70px] w-[70px] object-cover"
                      loading="lazy"
                      src={image}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-[22px] font-semibold leading-[1.4] text-[var(--mh-ink)]">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex text-base text-[#ffb347]">
                <Ratings ratings={product.rating} />
              </div>
              <span className="text-sm text-slate-500">{totalReview} reviews</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-[28px] font-bold leading-none text-[var(--mh-ink)]">
                ₹{finalPrice}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.price}
                  </span>
                  <span className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--mh-primary)]">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="mt-3 text-sm font-medium text-green-600">
              {product.stock ? `In Stock (${product.stock})` : "Out of Stock"}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 sm:flex-col sm:items-stretch">
              <div className="flex h-[42px] items-center justify-between rounded-md border border-[var(--mh-border)] bg-white px-3 sm:w-fit">
                <button
                  aria-label="Decrease quantity"
                  className="px-2 text-lg font-semibold text-slate-700 hover:text-[var(--mh-primary)]"
                  onClick={dec}
                  type="button"
                >
                  -
                </button>
                <span className="min-w-[28px] text-center text-sm font-semibold text-[var(--mh-ink)]">
                  {quantity}
                </span>
                <button
                  aria-label="Increase quantity"
                  className="px-2 text-lg font-semibold text-slate-700 hover:text-[var(--mh-primary)]"
                  onClick={inc}
                  type="button"
                >
                  +
                </button>
              </div>

              <button
                className="flex h-[42px] items-center justify-center rounded-md bg-[var(--mh-primary)] px-5 text-sm font-semibold text-white hover:bg-[var(--mh-primary-dark)] disabled:opacity-70 sm:w-full"
                disabled={!product.stock || cartUpdating}
                onClick={() => addCard()}
                type="button"
              >
                {cartUpdating ? "Updating..." : "Add to Cart"}
              </button>

              <button
                className="flex h-[42px] items-center justify-center rounded-md border border-[var(--mh-ink)] px-5 text-sm font-semibold text-[var(--mh-ink)] hover:bg-[var(--mh-ink)] hover:text-white disabled:opacity-60 sm:w-full"
                disabled={!product.stock}
                onClick={buy}
                type="button"
              >
                Buy Now
              </button>
            </div>

            <button
              aria-label="Add to wishlist"
              className="mt-3 flex h-[42px] items-center gap-2 rounded-md text-sm font-medium text-slate-500 hover:text-[var(--mh-primary)]"
              onClick={() => addWishlist()}
              type="button"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                <span className="text-[var(--mh-primary)]">&#10084;</span>
              </span>
              Add to wishlist
            </button>

            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-1 sm:gap-y-2">
              {metaRows.map((item) => (
                <div key={item.label} className="grid grid-cols-[86px_minmax(0,1fr)] gap-3">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="text-sm text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-slate-500">
              Sold by{" "}
              <Link
                className="font-medium text-[var(--mh-primary)] hover:text-[var(--mh-primary-dark)]"
                to={`/dashboard/chat/${product.sellerId}`}
              >
                {product.shopName || "MyHaat Store"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 pb-10 sm:px-4">
        <div className="border-b border-[var(--mh-border)]">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { key: "description", label: "Description" },
              { key: "specifications", label: "Specifications" },
              { key: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`relative whitespace-nowrap pb-3 text-sm font-semibold ${
                  activeTab === tab.key
                    ? "text-[var(--mh-primary)]"
                    : "text-slate-500 hover:text-[var(--mh-primary)]"
                }`}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[var(--mh-primary)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-5">
          {activeTab === "description" && (
            <div
              className="text-[14px] leading-[1.6] text-slate-600 [&_h1]:mb-3 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:mb-3"
              dangerouslySetInnerHTML={{
                __html: product.description || "No description available for this product.",
              }}
            />
          )}

          {activeTab === "specifications" && (
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 md:grid-cols-1">
              {specificationRows.map((item) => (
                <div key={item.label} className="grid grid-cols-[90px_minmax(0,1fr)] gap-3">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="text-sm text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && <Reviews product={product} />}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 pb-14 sm:px-4">
        <h2 className="mb-5 text-xl font-semibold text-[var(--mh-ink)]">
          Related Products
        </h2>

        {productLoading ? (
          <div className="grid grid-cols-4 gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} compact />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {relatedProducts.map((item) => {
              const itemDiscount = Number(item.discount) || 0;
              const itemPrice =
                itemDiscount > 0
                  ? item.price - Math.floor((item.price * itemDiscount) / 100)
                  : item.price;

              return (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-xl bg-white shadow-[0_8px_22px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <Link to={`/product/details/${item.slug}`}>
                    <div className="flex h-[220px] items-center justify-center bg-[#fbf7f2] p-3">
                      <img
                        alt={item.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        src={item.images[0]}
                      />
                    </div>
                  </Link>

                  <div className="p-3">
                    <Link
                      className="line-clamp-2 text-sm font-medium leading-6 text-[var(--mh-ink)] hover:text-[var(--mh-primary)]"
                      to={`/product/details/${item.slug}`}
                    >
                      {item.name}
                    </Link>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-lg font-bold text-[var(--mh-ink)]">
                        ₹{itemPrice}
                      </span>
                      {itemDiscount > 0 && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.price}
                        </span>
                      )}
                    </div>
                    <button
                      className="mt-3 flex h-[42px] w-full items-center justify-center rounded-md bg-[var(--mh-primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--mh-primary-dark)]"
                      onClick={() => addCard(item._id, 1)}
                      type="button"
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Details;
