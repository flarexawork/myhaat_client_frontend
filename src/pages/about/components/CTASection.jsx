import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="pt-7 pb-14 md:pb-10">
      <div className="about-shell">
        <div className="about-cta-band rounded-[34px] px-8 py-10 text-white shadow-[0_28px_60px_rgba(15,28,46,0.18)] md:px-5 md:py-8">
          <div className="flex items-center justify-between gap-6 lg:flex-col lg:items-start">
            <div className="max-w-[620px]">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#fdba74]">
                Join myHaat Today
              </span>
              <h2 className="mt-4 text-4xl font-bold leading-tight md:text-[30px]">
                Grow your brand, discover great products, and build trust with every order.
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-white/75">
                Whether you want to become a seller or start shopping, myHaat is ready
                to connect you with a marketplace experience built for long-term value.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="https://seller.myhaat24.com/login"
                className="inline-flex items-center justify-center rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ea580c]"
              >
                Become Seller
              </Link>
              <Link
                to="/shops"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-[#0f1c2e]"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
