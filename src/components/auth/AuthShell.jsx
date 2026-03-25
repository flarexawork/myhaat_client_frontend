import React from "react";
import Headers from "../Headers";
import Footer from "../Footer";

const AuthShell = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-screen bg-[#F6F2EB]">
      <Headers />
      <section className="px-4 py-10 sm:py-6">
        <div className="mx-auto max-w-[420px]">
          <div className="rounded-xl bg-white p-7 shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:p-4">
            <div className="mb-6 text-center">
              <span className="inline-flex items-center rounded-full border border-[#ffd9c2] bg-[#fff8f2] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF7A1A]">
                MyHaat
              </span>
              <h1 className="mt-4 text-[28px] font-semibold text-[#0F1C2E] sm:text-[24px]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
              ) : null}
            </div>

            {children}

            {footer ? <div className="mt-6 text-center text-sm text-slate-500">{footer}</div> : null}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AuthShell;
