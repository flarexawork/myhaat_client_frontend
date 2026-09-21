import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const positions = new Map();
const listingPaths = new Set(["/", "/shops"]);

function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = previousRestoration; };
  }, []);

  useLayoutEffect(() => {
    const isListing = listingPaths.has(location.pathname);
    const saved = navigationType === "POP" && isListing
      ? positions.get(location.key)
      : null;
    const target = saved || { x: 0, y: 0 };
    let restoring = Boolean(saved);
    let frame;
    let timer;
    let resizeObserver;
    const startedAt = Date.now();

    const remember = (event) => {
      if (!isListing || restoring) return;
      const item = event?.target?.closest?.("[data-scroll-item]");
      positions.set(location.key, {
        x: window.scrollX, y: window.scrollY,
        anchor: item?.dataset.scrollItem,
        offset: item?.getBoundingClientRect().top,
      });
      if (positions.size > 50) positions.delete(positions.keys().next().value);
    };
    const restore = () => {
      cancelAnimationFrame(frame);
      const item = target.anchor && Array.from(document.querySelectorAll("[data-scroll-item]"))
        .find((element) => element.dataset.scrollItem === target.anchor);
      const top = item ? window.scrollY + item.getBoundingClientRect().top - target.offset : target.y;
      window.scrollTo({ left: target.x, top, behavior: "instant" });
      // A listing can be shorter while its products/images are still loading.
      if (restoring && Math.abs(window.scrollY - top) > 1 && Date.now() - startedAt < 5000) {
        frame = requestAnimationFrame(restore);
      } else if (!target.anchor) {
        restoring = false;
        remember();
      }
    };
    const cancelRestore = () => {
      restoring = false;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      clearTimeout(timer);
      remember();
    };

    const rememberClick = (event) => {
      cancelRestore();
      remember(event);
    };

    restore();
    if (saved?.anchor) {
      // Keep the selected card aligned while banner/image dimensions settle.
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(restore);
        resizeObserver.observe(document.body);
      }
      timer = setTimeout(cancelRestore, 5000);
    }
    window.addEventListener("scroll", remember, { passive: true });
    // Capture the position before a product click unmounts the list.
    document.addEventListener("click", rememberClick, true);
    window.addEventListener("wheel", cancelRestore, { passive: true });
    window.addEventListener("touchstart", cancelRestore, { passive: true });
    window.addEventListener("keydown", cancelRestore);
    window.addEventListener("pointerdown", cancelRestore, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", remember);
      document.removeEventListener("click", rememberClick, true);
      window.removeEventListener("wheel", cancelRestore);
      window.removeEventListener("touchstart", cancelRestore);
      window.removeEventListener("keydown", cancelRestore);
      window.removeEventListener("pointerdown", cancelRestore);
    };
  }, [location, navigationType]);

  return null;
}

export default ScrollToTop;
