import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import ProductImage from "../ProductImage";

const CollectionSkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 rounded-xl border border-[var(--mh-border)] bg-white p-3"
      >
        <div className="skeleton h-[96px] rounded-xl" />
        <div className="space-y-3">
          <div className="skeleton h-4 w-full rounded-full" />
          <div className="skeleton h-4 w-2/3 rounded-full" />
          <div className="skeleton h-4 w-20 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

const Products = ({ title, products, loading = false }) => {
  const titleMeta = {
    "Latest Product": {
      chip: "Fresh Picks",
      chipClass: "bg-[#ecfdf3] text-[#0f766e] border-[#a7f3d0]",
    },
    "Top Rated Product": {
      chip: "Customer Love",
      chipClass: "bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]",
    },
    "Discount Product": {
      chip: "Hot Deals",
      chipClass: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
    },
  };

  const meta = titleMeta[title] || {
    chip: "Collection",
    chipClass: "bg-[#f8fafc] text-slate-700 border-slate-200",
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const ButtonGroup = ({ next, previous }) => {
    return (
      <div className="flex justify-between items-start gap-3 pb-4">
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-wider font-semibold ${meta.chipClass}`}
          >
            {meta.chip}
          </span>
          <h3 className="text-[20px] leading-tight font-bold text-slate-800 mt-2">
            {title}
          </h3>
        </div>
        <div className="flex justify-center items-center gap-2 text-slate-600">
          <button
            onClick={() => previous()}
            className="w-[34px] h-[34px] rounded-lg flex justify-center items-center bg-[#fff3ea] border border-[#f7d9c8] text-[#f97316] hover:bg-[#ffe9da] transition-colors"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => next()}
            className="w-[34px] h-[34px] rounded-lg flex justify-center items-center bg-[#fff3ea] border border-[#f7d9c8] text-[#f97316] hover:bg-[#ffe9da] transition-colors"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 flex-col-reverse rounded-2xl border border-[#f2dfd4] bg-gradient-to-b from-white to-[#fff9f4] p-4 sm:p-3 shadow-sm">
      {loading ? (
        <>
          <ButtonGroup next={() => {}} previous={() => {}} />
          <CollectionSkeleton />
        </>
      ) : (
      <Carousel
        autoPlay={false}
        infinite={false}
        arrows={false}
        responsive={responsive}
        transitionDuration={500}
        renderButtonGroupOutside={true}
        customButtonGroup={<ButtonGroup />}
      >
        {products.map((group, i) => (
          <div key={i} className="flex flex-col justify-start gap-3">
            {group.map((product, j) => {
              const discount = Number(product.discount) || 0;
              const finalPrice =
                discount > 0
                  ? product.price - Math.floor((product.price * discount) / 100)
                  : product.price;

              return (
                <Link
                  key={j}
                  to={`/product/details/${product?.slug}`}
                  className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 rounded-xl border border-[#f3e4da] bg-white p-3 transition-all duration-300 group hover:bg-[#fff7f0] hover:shadow-md sm:grid-cols-[80px_minmax(0,1fr)]"
                >
                  <ProductImage
                    alt={product.name}
                    className="w-[96px] flex-shrink-0 rounded-xl border border-[#f3e4da] sm:w-[80px]"
                    imgClassName="p-2.5"
                    loading="lazy"
                    src={product.images?.[0]}
                  />

                  <div className="flex flex-col justify-center text-gray-700 w-full min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[14px] font-semibold text-slate-800 line-clamp-2 group-hover:text-[#c2410c] transition-colors">
                        {product.name}
                      </h4>
                      {discount > 0 && (
                        <span className="rounded-full bg-[#fff1e8] px-2 py-[2px] text-[10px] font-semibold text-[#c2410c] whitespace-nowrap">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-[11px] font-medium text-slate-500">
                      {product.shopName || "My Haat"}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[15px] font-bold text-slate-900">
                        ₹{finalPrice}
                      </span>
                      {discount > 0 && (
                        <span className="text-[12px] text-slate-400 line-through">
                          ₹{product.price}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#f97316] font-medium mt-1">
                      View details
                    </div>
                  </div>
                </Link>
              );
            })}
            {group.length === 0 && (
              <div className="rounded-lg border border-dashed border-[#f3d8c9] bg-white px-3 py-6 text-center text-sm text-slate-500">
                No products found
              </div>
            )}
          </div>
        ))}
      </Carousel>
      )}
    </div>
  );
};

export default Products;
