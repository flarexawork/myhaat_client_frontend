import React from "react";
import { FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  buildProductSharePayload,
  copyTextToClipboard,
  isMobileShareEnvironment,
  shareWithNavigator,
} from "../../utils/productShare";

const ProductShareButton = ({
  productName,
  productUrl,
  productImage,
  productPrice,
  onOpenShareModal,
  className = "",
  label = "Share",
  preferNativeShareOnMobile = true,
}) => {
  const handleShare = async () => {
    const payload = buildProductSharePayload({
      productName,
      productUrl,
      productImage,
      productPrice,
    });
    let attemptedNativeShare = false;

    if (!payload.productUrl) {
      toast.error("Product link is not available yet.");
      return;
    }

    if (preferNativeShareOnMobile && isMobileShareEnvironment()) {
      attemptedNativeShare = true;
      const nativeResult = await shareWithNavigator(payload);

      if (nativeResult.shared || nativeResult.cancelled) {
        return;
      }
    }

    if (typeof onOpenShareModal === "function") {
      onOpenShareModal(payload);
      return;
    }

    const nativeResult = attemptedNativeShare
      ? { shared: false, cancelled: false }
      : await shareWithNavigator(payload);

    if (nativeResult.shared || nativeResult.cancelled) {
      return;
    }

    const copied = await copyTextToClipboard(payload.shareTargets.copyLink);

    if (copied) {
      toast.success("Product link copied.");
      return;
    }

    toast.error("Sharing is not supported in this browser.");
  };

  return (
    <button
      aria-label={`Share ${productName || "product"}`}
      className={`inline-flex h-[40px] items-center justify-center gap-2 rounded-md border border-[var(--mh-border)] bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-[#ffd1b0] hover:text-[var(--mh-primary)] ${className}`.trim()}
      onClick={handleShare}
      type="button"
    >
      <FiShare2 size={16} />
      <span>{label}</span>
    </button>
  );
};

export default ProductShareButton;
