const missionPoints = [
  "Seller empowerment through easier access to digital commerce tools",
  "Growth opportunities that help businesses reach new customers and markets",
  "Transparency across product discovery, transactions, and order flow",
];

const MissionVision = () => {
  return (
    <section className="py-7">
      <div className="about-shell">
        <div className="about-dual-grid">
          <article className="mh-card rounded-[30px] p-8 md:p-5">
            <span className="inline-flex rounded-full border border-[#ffd7be] bg-[#fff2e7] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#c2410c]">
              Our Mission
            </span>
            <h2 className="mt-5 text-3xl font-bold text-[#0f1c2e] md:text-[28px]">
              Help every seller build a stronger digital business
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-slate-600">
              myHaat exists to remove barriers between quality products and the people
              who want them. Our mission is to create a marketplace where sellers of
              every size can participate confidently, buyers can shop with clarity, and
              commerce feels more inclusive, efficient, and trustworthy at every step.
            </p>
            <ul className="mt-6 space-y-3">
              {missionPoints.map((point) => (
                <li
                  key={point}
                  className="rounded-2xl border border-[#f1dfd2] bg-[#fff9f4] px-4 py-4 text-sm font-medium text-slate-700"
                >
                  {point}
                </li>
              ))}
            </ul>
          </article>

          <article className="mh-card rounded-[30px] bg-gradient-to-br from-[#0f1c2e] via-[#152338] to-[#1f2937] p-8 text-white md:p-5">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#fdba74]">
              Our Vision
            </span>
            <h2 className="mt-5 text-3xl font-bold md:text-[28px]">
              Shape the future of connected commerce in India
            </h2>
            <div className="mt-5 space-y-5 text-[15px] leading-8 text-white/80">
              <p>
                We envision myHaat as a future-ready marketplace where local enterprise
                and digital convenience move together. As the platform grows, we want to
                help more sellers reach national audiences, make online selling simpler,
                and create a dependable destination where buyers discover quality,
                variety, and value in one place.
              </p>
              <p>
                By combining technology, transparency, and service, our vision is to
                become a trusted engine for sustainable ecommerce growth that benefits
                both sellers and shoppers over the long term.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
