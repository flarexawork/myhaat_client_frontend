import {
  FaChartLine,
  FaCreditCard,
  FaHeadset,
  FaLayerGroup,
  FaShieldAlt,
  FaStore,
} from "react-icons/fa";

const values = [
  {
    title: "Trusted Platform",
    description:
      "We prioritize reliable systems, clear communication, and trust-building at every transaction stage.",
    icon: FaShieldAlt,
    accent: "bg-[#fff2e7] text-[#f97316]",
  },
  {
    title: "Easy Selling",
    description:
      "myHaat lowers entry barriers so businesses can list, manage, and sell with less operational friction.",
    icon: FaStore,
    accent: "bg-[#eef6ff] text-[#2563eb]",
  },
  {
    title: "Secure Payments",
    description:
      "Protected checkout experiences help buyers purchase confidently while sellers receive dependable order flow.",
    icon: FaCreditCard,
    accent: "bg-[#f2f8ec] text-[#4d7c0f]",
  },
  {
    title: "Wide Selection",
    description:
      "A multi-seller catalog creates more discovery, more variety, and a richer marketplace for shoppers.",
    icon: FaLayerGroup,
    accent: "bg-[#fff3f5] text-[#e11d48]",
  },
  {
    title: "Customer Support",
    description:
      "Helpful support strengthens buyer confidence and gives sellers a more stable marketplace environment.",
    icon: FaHeadset,
    accent: "bg-[#f8f4ff] text-[#7c3aed]",
  },
  {
    title: "Scalable System",
    description:
      "We build for long-term growth so the platform can support expanding catalogs, sellers, and order volume.",
    icon: FaChartLine,
    accent: "bg-[#eefaf7] text-[#0f766e]",
  },
];

const ValuesGrid = () => {
  return (
    <section className="py-7">
      <div className="about-shell">
        <div className="mb-7">
          <span className="inline-flex rounded-full border border-[#ffd9bf] bg-[#fff1e7] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#c2410c]">
            Core Values
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#0f1c2e] md:text-[28px]">
            The principles shaping every myHaat experience
          </h2>
          <p className="mt-3 max-w-[720px] text-[15px] leading-8 text-slate-600">
            These values guide how we design the platform, support our sellers, and
            create a better shopping journey for every customer.
          </p>
        </div>

        <div className="about-values-grid">
          {values.map(({ title, description, icon: Icon, accent }) => (
            <article
              key={title}
              className="mh-card mh-card-hover rounded-[28px] p-6"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl ${accent}`}
              >
                <Icon />
              </span>
              <h3 className="mt-5 text-xl font-bold text-[#0f1c2e]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesGrid;
