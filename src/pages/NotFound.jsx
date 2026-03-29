import React from "react";
import { Link } from "react-router-dom";
import Headers from "../components/Headers";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#fffaf6]">
      <Headers />
      <main className="max-w-[1440px] mx-auto px-16 sm:px-5 md-lg:px-12 md:px-10 py-20">
        <div className="max-w-[700px] mx-auto rounded-[28px] border border-[#f3d8c9] bg-white px-8 py-14 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <span className="inline-flex items-center rounded-full border border-[#f7d9c8] bg-[#fff3ea] px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
            404 Page Not Found
          </span>
          <h1 className="mt-6 text-4xl font-bold text-slate-800 md:text-3xl">
            The page you requested does not exist.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Check the URL and try again, or head back to the homepage to
            continue shopping.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="rounded-xl bg-[#f97316] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ea580c]"
            >
              Go To Homepage
            </Link>
            <Link
              to="/shops"
              className="rounded-xl border border-[#f3d8c9] px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#fff5ee]"
            >
              Browse Shops
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
