import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { AiOutlineTwitter } from "react-icons/ai";
import { useSelector } from "react-redux";
import { AiFillShopping, AiFillHeart } from "react-icons/ai";
import { GrMail } from "react-icons/gr";
import { IoIosCall } from "react-icons/io";
import { socialLinks } from "../utils/socialLinks";

const Footer = () => {
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card,
  );
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shops" },
    { label: "My Account", path: "/dashboard" },
    { label: "My Orders", path: "/dashboard/my-orders" },
  ];
  const supportLinks = [
    { label: "Wishlist", path: "/dashboard/my-wishlist" },
    { label: "Shipping", path: "/shipping" },
    { label: "Return Policy", path: "/shipping" },
    { label: "Help Center", path: "/dashboard" },
  ];
  const socialItems = [
    {
      icon: <FaFacebookF />,
      href: socialLinks.facebook,
      label: "Follow us on Facebook",
    },
    {
      icon: <FaInstagram />,
      href: socialLinks.instagram,
      label: "Follow us on Instagram",
    },
    {
      icon: <AiOutlineTwitter />,
      href: socialLinks.twitter,
      label: "Follow us on Twitter",
    },
    {
      icon: <FaLinkedin />,
      href: socialLinks.linkedin,
      label: "Follow us on LinkedIn",
    },
    {
      icon: <FaYoutube />,
      href: socialLinks.youtube,
      label: "Watch us on YouTube",
    },
    {
      icon: <FaWhatsapp />,
      href: socialLinks.whatsapp,
      label: "Chat with us on WhatsApp",
    },
  ];

  return (
    <footer className="mt-14 bg-[#fffaf6] border-t border-[#f2dfd4] text-slate-700">
      <div className="border-b border-[#f3d8c9]">
        <div className="max-w-[1440px] mx-auto px-16 sm:px-5 md-lg:px-12 md:px-10 py-14 md-lg:py-10">
          <div className="grid grid-cols-12 gap-7 md-lg:gap-6">
            <div className="col-span-5 lg:col-span-12">
              <div className="max-w-[450px]">
                <div className="inline-flex items-center rounded-xl bg-white px-4 py-2 border border-[#f3d8c9] shadow-sm">
                  <img
                    className="w-[170px] h-auto"
                    src="/images/logo2.png"
                    alt="shopp.my"
                  />
                </div>
                <p className="text-sm text-slate-600 mt-5 leading-6">
                  Stylish products, fast delivery and trusted checkout.
                  Experience shopping designed around quality and value.
                </p>

                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="w-8 h-8 rounded-full bg-[#fff1e8] text-[#f97316] flex items-center justify-center">
                      <IoIosCall />
                    </span>
                    <a href="tel:+919046476558" className="hover:text-[#c2410c]">
                      +91 9046476558
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="w-8 h-8 rounded-full bg-[#fff1e8] text-[#f97316] flex items-center justify-center">
                      <GrMail />
                    </span>
                    <a href="mailto:myhaat24@gmail.com" className="hover:text-[#c2410c]">
                      myhaat24@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2 lg:col-span-4 md:col-span-6 sm:col-span-12">
              <h2 className="text-[15px] font-semibold tracking-wide text-[#111827] uppercase">
                Quick Links
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className="text-slate-600 hover:text-[#f97316] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 lg:col-span-4 md:col-span-6 sm:col-span-12">
              <h2 className="text-[15px] font-semibold tracking-wide text-[#111827] uppercase">
                Support
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {supportLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className="text-slate-600 hover:text-[#f97316] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-3 lg:col-span-4 md:col-span-12">
              <h2 className="text-[15px] font-semibold tracking-wide text-[#111827] uppercase">
                Newsletter
              </h2>
              <p className="text-sm text-slate-600 mt-3">
                Offers, new arrivals and festive deals straight to your inbox.
              </p>

              <div className="mt-4 rounded-xl border border-[#f3d8c9] bg-white overflow-hidden">
                <div className="flex items-center h-[46px]">
                  <input
                    placeholder="Enter your email"
                    className="h-full w-full bg-transparent px-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    type="email"
                  />
                  <button className="h-full px-4 bg-[#f97316] text-white text-xs font-bold uppercase hover:bg-[#ea580c] transition-colors">
                    Join
                  </button>
                </div>
              </div>

              <ul className="flex items-center gap-2 mt-4">
                {socialItems.map((item) => (
                  <li key={item.label}>
                    <a
                      className="w-[34px] h-[34px] rounded-full bg-[#fff1e8] text-[#f97316] hover:bg-[#111827] hover:text-white flex justify-center items-center transition-all"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={item.label}
                    >
                      {item.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111827]">
        <div className="max-w-[1440px] mx-auto px-16 sm:px-5 md-lg:px-12 md:px-10 py-5 flex items-center justify-between md:flex-col md:gap-2 md:text-center">
          <span className="text-sm text-white/90">
            Copyright ©{new Date().getFullYear()} shopp.my | All rights reserved
          </span>
          <span className="text-xs text-slate-300">
            Secure checkout | Fast shipping | Trusted by happy shoppers
          </span>
        </div>
      </div>

      <div className="hidden fixed md-lg:block w-[54px] bottom-3 h-[116px] right-2 rounded-full p-2 bg-white border border-[#f3d8c9] shadow-[0_12px_28px_rgba(15,23,42,0.2)] z-[99997]">
        <div className="w-full h-full flex gap-3 flex-col justify-center items-center">
          <div
            onClick={() => navigate(userInfo ? "/card" : "/login")}
            className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#fff1e8]"
          >
            <span className="text-xl text-[#f97316]">
              <AiFillShopping />
            </span>
            {card_product_count !== 0 && (
              <div className="w-[18px] h-[18px] absolute bg-[#f97316] rounded-full text-white text-[10px] flex justify-center items-center -top-[2px] -right-[4px]">
                {card_product_count}
              </div>
            )}
          </div>

          <div
            onClick={() =>
              navigate(userInfo ? "/dashboard/my-wishlist" : "/login")
            }
            className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#fff1e8]"
          >
            <span className="text-xl text-[#f43f5e]">
              <AiFillHeart />
            </span>
            {wishlist_count !== 0 && (
              <div className="w-[18px] h-[18px] absolute bg-[#f97316] rounded-full text-white text-[10px] flex justify-center items-center -top-[2px] -right-[4px]">
                {wishlist_count}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
