import React from "react";

const ProductCardSkeleton = ({ compact = false }) => {
  return (
    <div className="rounded-[24px] border border-[var(--mh-border)] bg-[var(--mh-card)] p-4 shadow-[var(--mh-shadow)]">
      <div className={`skeleton aspect-square w-full rounded-[20px] ${compact ? "max-h-[220px]" : ""}`} />
      <div className="mt-4 space-y-3">
        <div className="skeleton h-4 w-20 rounded-full" />
        <div className="skeleton h-5 w-full rounded-full" />
        <div className="skeleton h-5 w-3/4 rounded-full" />
        <div className="flex items-center gap-2">
          <div className="skeleton h-4 w-24 rounded-full" />
          <div className="skeleton h-4 w-12 rounded-full" />
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="skeleton h-6 w-24 rounded-full" />
            <div className="skeleton h-4 w-16 rounded-full" />
          </div>
          <div className="skeleton h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
