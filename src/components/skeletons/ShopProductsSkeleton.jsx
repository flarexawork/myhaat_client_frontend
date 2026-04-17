import React from "react";

const ShopProductsSkeleton = ({ styles = "grid", count = 6 }) => {
  const items = Array.from({ length: count });

  return (
    <div
      className={`w-full grid gap-6 ${
        styles === "grid"
          ? "grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
          : "grid-cols-1"
      }`}
    >
      {items.map((_, index) => (
        <div
          key={index}
          className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${
            styles === "grid"
              ? "flex flex-col"
              : "flex flex-row lg:flex-row md:flex-row sm:flex-col"
          }`}
        >
          <div
            className={`skeleton ${
              styles === "grid"
                ? "h-[300px] w-full"
                : "h-[260px] w-[280px] md:w-[240px] sm:h-[220px] sm:w-full"
            }`}
          />

          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <div className="skeleton h-5 w-3/4 rounded-full" />
              <div className="mt-2 space-y-2">
                <div className="skeleton h-4 w-full rounded-full" />
                <div className="skeleton h-4 w-5/6 rounded-full" />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="skeleton h-6 w-24 rounded-full" />
                  <div className="skeleton h-4 w-16 rounded-full" />
                </div>
                <div className="skeleton h-5 w-24 rounded-full" />
              </div>
            </div>

            <div
              className={`mt-5 ${
                styles === "grid"
                  ? "grid grid-cols-2 gap-3"
                  : "flex flex-wrap items-center gap-4"
              }`}
            >
              <div className="flex gap-3">
                <div className="skeleton h-10 w-10 rounded-lg" />
                <div className="skeleton h-10 w-10 rounded-lg" />
              </div>
              <div className="skeleton h-10 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopProductsSkeleton;
