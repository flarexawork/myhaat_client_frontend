import { Link } from "react-router-dom";
import { FaArrowRight, FaStore, FaUsers } from "react-icons/fa";

const highlights = [
  "Built for a trusted multi vendor ecommerce platform experience",
  "Helping businesses sell products online with confidence",
  "Designed for modern online marketplace India growth",
];

const HeroSection = () => {
  return (
    <section className="pt-10 pb-6 md:pt-7">
      <div className="about-shell">
        <div className="about-surface about-pattern rounded-[32px] border border-[#f1dccd] px-8 py-10 shadow-[0_24px_60px_rgba(15,28,46,0.08)] md:px-5 md:py-7">
          <div className="about-hero-grid items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-[#ffd8bc] bg-[#fff1e5] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#c2410c]">
                About myHaat
              </span>
              <h1 className="mt-5 max-w-[760px] text-5xl font-extrabold leading-[1.08] text-[#0f1c2e] lg:text-[42px] md:text-[34px]">
                Empowering Sellers. <span className="about-gradient-text">Connecting Buyers.</span>
              </h1>
              <p className="mt-5 max-w-[700px] text-lg leading-8 text-slate-600 md:text-base md:leading-7">
                myHaat is a growth-focused multi vendor ecommerce platform built to help
                brands, artisans, and local businesses reach more customers through a
                reliable online marketplace India shoppers can trust.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/shops"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.28)] hover:bg-[#ea580c]"
                >
                  Explore Marketplace
                  <FaArrowRight className="text-xs" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full border border-[#e6d6c8] bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-[#f97316] hover:text-[#c2410c]"
                >
                  Become a Seller
                </Link>
              </div>

              <ul className="mt-8 grid gap-3">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[#f3e4d7] bg-white/80 px-4 py-3 text-sm text-slate-600"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#f97316]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-5">
              <article className="rounded-[28px] bg-[#111827] p-7 text-white shadow-[0_28px_60px_rgba(15,28,46,0.18)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl text-[#fdba74]">
                    <FaStore />
                  </span>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                      Seller First
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">Launch, list, and grow faster</h2>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-white/75">
                  From onboarding to order management, myHaat simplifies how sellers
                  sell products online while keeping operations transparent and scalable.
                </p>
              </article>

              <article className="grid gap-5 rounded-[28px] border border-[#f1dccd] bg-white p-6 shadow-[0_18px_45px_rgba(15,28,46,0.08)]">
                <div className="flex items-center gap-3 text-[#0f1c2e]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1e5] text-[#f97316]">
                    <FaUsers />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold">A stronger buyer-seller ecosystem</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Trusted discovery, secure checkout, and repeat purchase confidence.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#fff7ef] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c2410c]">
                      Reach
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Connect local sellers with customers across India.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#f7f6f2] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f1c2e]">
                      Trust
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Promote reliable fulfillment, support, and secure payments.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
