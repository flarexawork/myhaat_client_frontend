import { FaCheckCircle, FaShoppingBag, FaStoreAlt } from "react-icons/fa";

const sellerBenefits = [
  "Faster onboarding for entrepreneurs, artisans, and growing brands",
  "Tools that help sellers manage products, orders, and visibility in one place",
  "A scalable path to sell products online and reach buyers beyond local markets",
];

const buyerBenefits = [
  "Wide product variety across multiple sellers and categories",
  "A seamless shopping journey with secure checkout and dependable support",
  "Better discovery of quality products through one trusted online marketplace India shoppers can use daily",
];

const AboutContent = () => {
  return (
    <section className="py-7">
      <div className="about-shell">
        <div className="about-section-grid">
          <article className="mh-card rounded-[30px] p-8 md:p-5">
            <span className="inline-flex rounded-full border border-[#ffe0cb] bg-[#fff3e8] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#c2410c]">
              What is myHaat
            </span>
            <h2 className="mt-5 text-3xl font-bold text-[#0f1c2e] md:text-[28px]">
              Built to make commerce easier for every seller and every buyer
            </h2>
            <div className="mt-5 space-y-5 text-[15px] leading-8 text-slate-600">
              <p>
                myHaat is a multi vendor ecommerce platform created to bring independent
                sellers, emerging brands, and modern shoppers together in one seamless
                digital marketplace. Instead of limiting growth to a single storefront,
                myHaat gives multiple sellers the ability to present their products,
                connect with new audiences, and operate through a shared ecommerce
                ecosystem designed for reliability and long-term scale.
              </p>
              <p>
                As an online marketplace India businesses can grow with, myHaat supports
                the full relationship between sellers and buyers. Sellers gain a place
                to showcase inventory, build visibility, and sell products online without
                needing to build complex infrastructure from scratch. Buyers benefit from
                wider selection, streamlined browsing, dependable service, and the trust
                that comes from shopping through a well-managed marketplace.
              </p>
              <p>
                Our focus is not only on transactions, but on sustainable growth and
                trust. We believe a healthy marketplace is built when sellers feel
                supported, customers feel confident, and every order strengthens the
                connection between quality products and the people looking for them.
              </p>
            </div>
          </article>

          <aside className="grid gap-5">
            <article className="mh-card rounded-[28px] bg-[#111827] p-7 text-white">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.22em] text-[#fdba74]">
                Marketplace Snapshot
              </h2>
              <p className="mt-4 text-2xl font-bold leading-9">
                myHaat helps turn local ambition into digital growth.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/75">
                From handcrafted products to expanding catalog businesses, our platform
                is built to support discovery, trust, and repeat business.
              </p>
            </article>

            <article className="mh-card rounded-[28px] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1e5] text-[#f97316]">
                  <FaCheckCircle />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#0f1c2e]">Why shoppers return</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    A curated shopping experience shaped by trust and convenience.
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li className="rounded-2xl bg-[#fff8f1] px-4 py-3">
                  Product discovery across multiple verified sellers
                </li>
                <li className="rounded-2xl bg-[#f7f6f2] px-4 py-3">
                  Clear purchase flow with dependable support
                </li>
                <li className="rounded-2xl bg-[#fff8f1] px-4 py-3">
                  A growing selection that keeps the marketplace fresh
                </li>
              </ul>
            </article>
          </aside>
        </div>

        <div className="about-dual-grid mt-8">
          <section className="mh-card rounded-[30px] p-8 md:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e5] text-[#f97316]">
                <FaStoreAlt />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-[#0f1c2e]">For Sellers</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Practical benefits for businesses ready to grow.
                </p>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {sellerBenefits.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-[#f1e1d4] bg-[#fffaf5] px-4 py-4 text-sm leading-7 text-slate-600"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mh-card rounded-[30px] p-8 md:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6ff] text-[#1d4ed8]">
                <FaShoppingBag />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-[#0f1c2e]">For Buyers</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A marketplace experience designed for confidence and choice.
                </p>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {buyerBenefits.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-[#dce7f7] bg-[#f8fbff] px-4 py-4 text-sm leading-7 text-slate-600"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
