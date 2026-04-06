const MOBILE_SHARE_USER_AGENT =
  /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i;

const getCurrentProductUrl = () => {
  if (typeof window === "undefined") return "";
  return window.location.href || "";
};

const getResolvedPrice = (productPrice) => {
  const parsedPrice = Number(productPrice);
  return Number.isFinite(parsedPrice) ? parsedPrice : null;
};

export const buildProductSharePayload = ({
  productName,
  productUrl,
  productImage,
  productPrice,
}) => {
  const resolvedPrice = getResolvedPrice(productPrice);
  const resolvedUrl = productUrl || getCurrentProductUrl();
  const resolvedName = productName || "Check out this product";
  const priceText = resolvedPrice !== null ? `Price: ₹${resolvedPrice}` : "";
  const shareText = [resolvedName, priceText, resolvedUrl]
    .filter(Boolean)
    .join("\n");
  const tweetText = [resolvedName, resolvedPrice !== null ? `₹${resolvedPrice}` : ""]
    .filter(Boolean)
    .join(" ");
  const encodedUrl = encodeURIComponent(resolvedUrl);

  return {
    productName: resolvedName,
    productUrl: resolvedUrl,
    productImage: productImage || "",
    productPrice: resolvedPrice,
    shareTitle: resolvedName,
    shareText,
    shareTargets: {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText,
      )}&url=${encodedUrl}`,
      copyLink: resolvedUrl,
    },
  };
};

export const canUseNativeShare = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";

export const isMobileShareEnvironment = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const hasCoarsePointer =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;
  const isSmallViewport =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 767px)").matches;

  return (
    hasCoarsePointer ||
    isSmallViewport ||
    MOBILE_SHARE_USER_AGENT.test(navigator.userAgent || "")
  );
};

export const shareWithNavigator = async (payload) => {
  if (!canUseNativeShare()) {
    return { shared: false };
  }

  const shareData = {
    title: payload.shareTitle,
    text:
      payload.productPrice !== null
        ? `${payload.productName} - ₹${payload.productPrice}`
        : payload.productName,
    url: payload.productUrl,
  };

  try {
    if (
      typeof navigator.canShare === "function" &&
      !navigator.canShare(shareData)
    ) {
      return { shared: false };
    }

    await navigator.share(shareData);
    return { shared: true };
  } catch (error) {
    if (error?.name === "AbortError") {
      return { shared: false, cancelled: true };
    }

    return { shared: false, error };
  }
};

export const copyTextToClipboard = async (text) => {
  if (!text) return false;

  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {}

  if (typeof document === "undefined") {
    return false;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);
  return copied;
};
