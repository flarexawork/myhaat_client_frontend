import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Customers", value: 10000, suffix: "+" },
  { label: "Products", value: 5000, suffix: "+" },
  { label: "Sellers", value: 500, suffix: "+" },
  { label: "Orders", value: 25000, suffix: "+" },
  { label: "Years Experience", value: 5, suffix: "+" },
];

const formatNumber = (value) => value.toLocaleString("en-IN");

const StatsCounter = () => {
  const sectionRef = useRef(null);
  const rafIdsRef = useRef([]);
  const timeoutIdsRef = useRef([]);
  const hasAnimatedRef = useRef(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const rafIds = rafIdsRef.current;
    const timeoutIds = timeoutIdsRef.current;

    const animateValue = (index, target) => {
      const duration = 1400;
      const startTime = performance.now();

      const step = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(target * easedProgress);

        setCounts((previous) => {
          const next = [...previous];
          next[index] = currentValue;
          return next;
        });

        if (progress < 1) {
          rafIds[index] = window.requestAnimationFrame(step);
        }
      };

      rafIds[index] = window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting || hasAnimatedRef.current) {
          return;
        }

        hasAnimatedRef.current = true;

        stats.forEach((item, index) => {
          timeoutIds[index] = window.setTimeout(() => {
            animateValue(index, item.value);
          }, index * 130);
        });

        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      rafIds.forEach((id) => window.cancelAnimationFrame(id));
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <section className="py-7" ref={sectionRef}>
      <div className="about-shell">
        <div className="rounded-[32px] border border-[#f0dece] bg-[#fffdf9] px-8 py-8 shadow-[0_22px_50px_rgba(15,28,46,0.08)] md:px-5 md:py-6">
          <div className="mb-7 flex items-end justify-between gap-4 md:flex-col md:items-start">
            <div>
              <span className="inline-flex rounded-full border border-[#ffd9bf] bg-[#fff2e8] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#c2410c]">
                Marketplace Momentum
              </span>
              <h2 className="mt-4 text-3xl font-bold text-[#0f1c2e] md:text-[28px]">
                Growth backed by trust, consistency, and scale
              </h2>
            </div>
            <p className="max-w-[420px] text-sm leading-7 text-slate-500">
              These platform milestones reflect our focus on reliable growth for sellers
              and a better shopping experience for customers.
            </p>
          </div>

          <div className="about-stats-grid">
            {stats.map((item, index) => (
              <article
                key={item.label}
                className="about-stat-card mh-card rounded-[26px] p-5"
              >
                <p className="text-4xl font-extrabold text-[#0f1c2e]">
                  {formatNumber(counts[index])}
                  {item.suffix}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-500">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
