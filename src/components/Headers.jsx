import React, { useEffect, useRef, useState } from "react";
import { GrMail } from "react-icons/gr";
import { IoIosCall } from "react-icons/io";
import {
  MdKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaUser,
  FaLock,
  FaList,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { AiOutlineTwitter, AiFillHeart, AiFillShopping } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  get_card_products,
  get_wishlist_products,
} from "../store/reducers/cardReducer";
import { socialLinks } from "../utils/socialLinks";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shops" },
  { label: "About Us", to: "/about" },
  // { label: "Contact" },
];

const socialIcons = [
  {
    key: "facebook",
    href: socialLinks.facebook,
    label: "Follow us on Facebook",
    icon: <FaFacebookF />,
  },
  {
    key: "instagram",
    href: socialLinks.instagram,
    label: "Follow us on Instagram",
    icon: <FaInstagram />,
  },
  {
    key: "twitter",
    href: socialLinks.twitter,
    label: "Follow us on Twitter",
    icon: <AiOutlineTwitter />,
  },
  {
    key: "linkedin",
    href: socialLinks.linkedin,
    label: "Follow us on LinkedIn",
    icon: <FaLinkedinIn />,
  },
  {
    key: "youtube",
    href: socialLinks.youtube,
    label: "Watch us on YouTube",
    icon: <FaYoutube />,
  },
  {
    key: "whatsapp",
    href: socialLinks.whatsapp,
    label: "Chat with us on WhatsApp",
    icon: <FaWhatsapp />,
  },
];

const Headers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { categorys } = useSelector((state) => state.home);
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?.id;
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card,
  );

  const [showShidebar, setShowShidebar] = useState(true);
  const [categoryShow, setCategoryShow] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("");
  const [desktopCategoryOpen, setDesktopCategoryOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const desktopCategoryRef = useRef(null);
  const mobileCategoryRef = useRef(null);

  const search = () => {
    navigate(`/products/search?category=${category}&&value=${searchValue}`);
  };

  const redirect_card_page = () => {
    navigate(userInfo ? "/card" : "/login");
  };

  const selectSearchCategory = (value) => {
    setCategory(value);
    setDesktopCategoryOpen(false);
    setMobileCategoryOpen(false);
  };

  useEffect(() => {
    if (userId) {
      dispatch(get_card_products(userId));
      dispatch(get_wishlist_products(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        desktopCategoryRef.current &&
        !desktopCategoryRef.current.contains(event.target)
      ) {
        setDesktopCategoryOpen(false);
      }

      if (
        mobileCategoryRef.current &&
        !mobileCategoryRef.current.contains(event.target)
      ) {
        setMobileCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const activeClass = (to) =>
    to && pathname === to ? "text-[#f97316]" : "text-slate-700";

  return (
    <header className="w-full bg-[#fffaf6] border-b border-[#f2dfd4] mb-5">
      <div className="bg-[#111827] text-white md-lg:hidden">
        <div className="max-w-[1440px] mx-auto px-16 sm:px-5 md-lg:px-12 md:px-10">
          <div className="h-[44px] flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <GrMail />
                <a
                  href="mailto:myhaat24@gmail.com"
                  className="hover:text-[#fdba74]"
                >
                  myhaat24@gmail.com
                </a>
              </div>
              <span>my haat ecommerce</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                {socialIcons.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    className="hover:text-[#fdba74] hover:scale-110"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
              {userInfo ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 font-medium"
                >
                  <FaUser />
                  <span>{userInfo.name}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 font-medium"
                >
                  <FaLock />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-16 sm:px-5 md-lg:px-12 md:px-10 py-4">
          <div className="flex items-center gap-4 md-lg:flex-wrap">
            <div className="w-3/12 lg:w-4/12 md-lg:w-full flex items-center justify-between">
              <button
                onClick={() => setShowShidebar(false)}
                className="hidden md-lg:flex w-[36px] h-[36px] rounded-md bg-[#fff1e8] text-[#f97316] justify-center items-center"
              >
                <FaList />
              </button>
              <Link to="/" className="block w-[190px] md-lg:w-[150px]">
                <img
                  src="/images/logo2.png"
                  alt="logo"
                  className="w-full h-auto object-contain"
                />
              </Link>
              <div className="hidden md-lg:flex items-center gap-2">
                <button
                  onClick={() =>
                    navigate(userInfo ? "/dashboard/my-wishlist" : "/login")
                  }
                  className="relative w-[34px] h-[34px] rounded-full bg-[#fff1e8] text-[#f97316] flex items-center justify-center"
                >
                  <AiFillHeart />
                  {wishlist_count !== 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-[3px] rounded-full bg-[#f97316] text-[10px] text-white flex items-center justify-center">
                      {wishlist_count}
                    </span>
                  )}
                </button>
                <button
                  onClick={redirect_card_page}
                  className="relative w-[34px] h-[34px] rounded-full bg-[#fff1e8] text-[#f97316] flex items-center justify-center"
                >
                  <AiFillShopping />
                  {card_product_count !== 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-[3px] rounded-full bg-[#f97316] text-[10px] text-white flex items-center justify-center">
                      {card_product_count}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="w-6/12 lg:w-5/12 md-lg:w-full">
              <div className="hidden md-lg:block mb-2" ref={mobileCategoryRef}>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileCategoryOpen((prev) => !prev);
                      setDesktopCategoryOpen(false);
                    }}
                    className="w-full h-[42px] rounded-lg border border-[#f3d8c9] bg-white px-3 text-sm text-slate-700 flex items-center justify-between"
                  >
                    <span
                      className={category ? "text-slate-700" : "text-slate-500"}
                    >
                      {category || "Select category"}
                    </span>
                    <MdOutlineKeyboardArrowDown
                      className={`text-[20px] text-[#f97316] transition-transform duration-300 ${
                        mobileCategoryOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute left-0 top-[46px] z-[60] w-full rounded-lg border border-[#f3d8c9] bg-white shadow-lg transition-all duration-200 ${
                      mobileCategoryOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <ul className="max-h-[230px] overflow-auto p-1.5 space-y-1">
                      <li>
                        <button
                          type="button"
                          onClick={() => selectSearchCategory("")}
                          className="w-full text-left rounded-md px-2.5 py-2 text-sm text-slate-600 hover:bg-[#fff5ee] hover:text-[#c2410c]"
                        >
                          All categories
                        </button>
                      </li>
                      {categorys.map((c, i) => (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => selectSearchCategory(c.name)}
                            className={`w-full text-left rounded-md px-2.5 py-2 text-sm hover:bg-[#fff5ee] ${
                              category === c.name
                                ? "text-[#c2410c] bg-[#fff3ea] font-medium"
                                : "text-slate-700"
                            }`}
                          >
                            {c.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="relative h-[46px] rounded-xl border border-[#f3d8c9] bg-[#fffaf6] flex items-center">
                <div
                  className="relative h-full border-r border-[#f3d8c9] md-lg:hidden"
                  ref={desktopCategoryRef}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setDesktopCategoryOpen((prev) => !prev);
                      setMobileCategoryOpen(false);
                    }}
                    className="w-[170px] h-full px-3 text-sm text-slate-700 flex items-center justify-between"
                  >
                    <span
                      className={`${category ? "text-slate-700" : "text-slate-500"} truncate pr-2`}
                    >
                      {category || "Category"}
                    </span>
                    <MdOutlineKeyboardArrowDown
                      className={`text-[20px] text-[#f97316] transition-transform duration-300 ${
                        desktopCategoryOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute left-0 top-[calc(100%+8px)] z-[60] w-[230px] rounded-lg border border-[#f3d8c9] bg-white shadow-lg transition-all duration-200 ${
                      desktopCategoryOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="px-3 py-2 border-b border-[#f8e7dc] bg-[#fff8f3]">
                      <h3 className="text-[11px] font-bold uppercase tracking-wide text-[#c2410c]">
                        Select Category
                      </h3>
                    </div>
                    <ul className="max-h-[260px] overflow-auto p-1.5 space-y-1">
                      <li>
                        <button
                          type="button"
                          onClick={() => selectSearchCategory("")}
                          className="w-full text-left rounded-md px-2.5 py-2 text-sm text-slate-600 hover:bg-[#fff5ee] hover:text-[#c2410c]"
                        >
                          All categories
                        </button>
                      </li>
                      {categorys.map((c, i) => (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => selectSearchCategory(c.name)}
                            className={`w-full text-left rounded-md px-2.5 py-2 text-sm hover:bg-[#fff5ee] ${
                              category === c.name
                                ? "text-[#c2410c] bg-[#fff3ea] font-medium"
                                : "text-slate-700"
                            }`}
                          >
                            {c.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <input
                  className="flex-1 h-full bg-transparent px-3 text-sm text-slate-700 outline-none"
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="text"
                  placeholder="Search sarees, fabrics, designs & offers"
                />
                <button
                  onClick={search}
                  className="h-full px-6 md:px-4 bg-[#f97316] text-white text-sm font-semibold uppercase"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="w-3/12 lg:w-3/12 md-lg:hidden flex items-center justify-end gap-3">
              <button
                onClick={() =>
                  navigate(userInfo ? "/dashboard/my-wishlist" : "/login")
                }
                className="relative w-[38px] h-[38px] rounded-full bg-[#fff1e8] text-[#f97316] flex items-center justify-center"
              >
                <AiFillHeart />
                {wishlist_count !== 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#f97316] text-[10px] text-white flex items-center justify-center">
                    {wishlist_count}
                  </span>
                )}
              </button>
              <button
                onClick={redirect_card_page}
                className="relative w-[38px] h-[38px] rounded-full bg-[#fff1e8] text-[#f97316] flex items-center justify-center"
              >
                <AiFillShopping />
                {card_product_count !== 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#f97316] text-[10px] text-white flex items-center justify-center">
                    {card_product_count}
                  </span>
                )}
              </button>
              {userInfo ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 bg-[#fff1e8] text-[#c2410c] text-sm font-medium"
                >
                  <FaUser />
                  <span className="max-w-[110px] truncate">
                    {userInfo.name}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 bg-[#fff1e8] text-[#c2410c] text-sm font-medium"
                >
                  <FaLock />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-100 md-lg:hidden">
        <div className="max-w-[1440px] mx-auto px-16 sm:px-5 md-lg:px-12 md:px-10">
          <div className="h-[58px] flex items-center justify-between gap-6">
            <div className="relative w-[240px]">
              <button
                onClick={() => setCategoryShow(!categoryShow)}
                className="h-[42px] w-full rounded-lg bg-gradient-to-r from-[#111827] to-[#1f2937] text-[#fde68a] px-4 text-sm font-semibold flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <FaList />
                  All Category
                </span>
                <MdOutlineKeyboardArrowDown
                  className={`text-[20px] transition-transform duration-300 ${
                    categoryShow ? "rotate-0" : "rotate-180"
                  }`}
                />
              </button>
              <div
                className={`absolute top-[46px] left-0 z-50 w-full bg-white border border-[#f3d8c9] rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                  categoryShow
                    ? "max-h-0 opacity-0 translate-y-1"
                    : "max-h-[390px] opacity-100 translate-y-0"
                }`}
              >
                <div className="px-3 py-2 border-b border-[#f7e5d8] bg-[#fff8f3]">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c]">
                    Browse Categories
                  </h3>
                </div>
                <ul className="p-2 max-h-[340px] overflow-auto space-y-1">
                  {categorys.map((c, i) => (
                    <li key={i}>
                      <Link
                        to={`/products?category=${c.name}`}
                        onClick={() => setCategoryShow(true)}
                        className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm text-slate-700 border border-transparent hover:border-[#fde0cf] hover:bg-[#fff5ee] transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-[28px] h-[28px] rounded-full object-cover ring-1 ring-[#f3d8c9]"
                          />
                          <span>{c.name}</span>
                        </span>
                        <MdKeyboardArrowRight className="text-[#f97316]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ul className="flex items-center gap-7 text-sm font-semibold uppercase">
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.to ? (
                    <Link to={item.to} className={activeClass(item.to)}>
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-slate-700">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-[38px] h-[38px] rounded-full bg-[#fff1e8] text-[#f97316] flex items-center justify-center">
                <IoIosCall />
              </div>
              <div className="text-right">
                <a
                  href="tel:+919046476558"
                  className="text-sm font-medium text-slate-700 hover:text-[#c2410c]"
                >
                  +919046476558
                </a>
                <span className="text-xs text-slate-500"> </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md-lg:block hidden">
        <div
          onClick={() => setShowShidebar(true)}
          className={`fixed inset-0 z-[99998] bg-[rgba(0,0,0,0.45)] transition-all duration-200 ${
            showShidebar ? "invisible opacity-0" : "visible opacity-100"
          }`}
        />
        <aside
          className={`fixed top-0 z-[99999] h-screen w-[300px] bg-white shadow-xl transition-all duration-300 ${
            showShidebar ? "-left-[320px]" : "left-0"
          }`}
        >
          <div className="h-full overflow-y-auto p-5">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setShowShidebar(true)}
                className="w-[130px]"
              >
                <img
                  src="/images/logo2.png"
                  alt="logo"
                  className="w-full h-auto"
                />
              </Link>
              <button
                onClick={() => setShowShidebar(true)}
                className="text-xs font-semibold uppercase rounded-md border border-[#f3d8c9] px-3 py-1 text-[#c2410c]"
              >
                Close
              </button>
            </div>

            <div className="mt-5 rounded-lg bg-[#fff3ea] px-3 py-2">
              {userInfo ? (
                <Link
                  to="/dashboard"
                  onClick={() => setShowShidebar(true)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <FaUser className="text-[#f97316]" />
                  <span>{userInfo.name}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setShowShidebar(true)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <FaLock className="text-[#f97316]" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            <ul className="mt-5 flex flex-col gap-2 text-sm font-semibold uppercase">
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      onClick={() => setShowShidebar(true)}
                      className={`block rounded-md px-3 py-2 ${
                        pathname === item.to
                          ? "bg-[#fff1e8] text-[#c2410c]"
                          : "text-slate-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="block rounded-md px-3 py-2 text-slate-700">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                All Categories
              </h3>
              <div className="max-h-[270px] overflow-auto border border-[#f3d8c9] rounded-lg">
                {categorys.map((c, i) => (
                  <Link
                    key={i}
                    to={`/products?category=${c.name}`}
                    onClick={() => setShowShidebar(true)}
                    className="flex items-center gap-2 px-3 py-2 border-b border-[#f8e7dc] last:border-b-0 text-sm text-slate-700"
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-[26px] h-[26px] rounded-full object-cover"
                    />
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 text-slate-600">
              {socialIcons.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="hover:text-[#c2410c] hover:scale-110"
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-[#fff1e8] text-[#f97316] flex items-center justify-center">
                <IoIosCall />
              </div>
              <div>
                <a
                  href="tel:+91 9046476558"
                  className="text-sm font-medium text-slate-700 hover:text-[#c2410c]"
                >
                  +919046476558
                </a>
                <span className="text-xs text-slate-500"> </span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <GrMail />
              <a
                href="mailto:myhaat24@gmail.com"
                className="hover:text-[#c2410c]"
              >
                myhaat24@gmail.com
              </a>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
};

export default Headers;
