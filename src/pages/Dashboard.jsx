import React, { useState } from "react";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaList } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { RiProductHuntLine } from "react-icons/ri";
import { BsChat, BsHeart } from "react-icons/bs";
import { TfiLock } from "react-icons/tfi";
import { BiLogInCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { customer_logout, user_reset } from "../store/reducers/authReducer";
import { reset_count } from "../store/reducers/cardReducer";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [filterShow, setFilterShow] = useState(false);

  const logout = async () => {
    try {
      await dispatch(customer_logout());
      dispatch(reset_count());
      navigate("/login");
    } catch (error) {
      console.log(error?.response?.data);
      dispatch(user_reset());
      dispatch(reset_count());
      navigate("/login");
    }
  };

  const menuItemClass = (path) =>
    `flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 cursor-pointer`;

  const menuItemStyle = (path) => ({
    backgroundColor: location.pathname === path ? "#F38E16" : "transparent",
    color: location.pathname === path ? "#ffffff" : "#122C55",
  });

  return (
    <div>
      <Headers />

      {/* Main Background */}
      <div className="mt-5 min-h-screen" style={{ backgroundColor: "#FCF6E3" }}>
        {/* Mobile Toggle */}
        <div className="w-full mx-auto pt-5 md-lg:block hidden px-4">
          <button
            onClick={() => setFilterShow(!filterShow)}
            className="py-3 px-3 rounded-lg shadow-sm"
            style={{ backgroundColor: "#F38E16", color: "#ffffff" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F26B0B")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#F38E16")}
          >
            <FaList />
          </button>
        </div>

        <div className="h-full mx-auto">
          <div className="py-5 flex w-full mx-auto relative">
            {/* Sidebar */}
            <div
              className={`rounded-2xl shadow-sm z-50 md-lg:absolute 
                            ${filterShow ? "-left-4" : "-left-[360px]"} 
                            w-[270px] ml-4 bg-white border`}
              style={{ borderColor: "#E4F0F5" }}
            >
              <ul className="py-4 px-4 space-y-1">
                {/* Dashboard */}
                <li
                  className={menuItemClass("/dashboard")}
                  style={menuItemStyle("/dashboard")}
                  onMouseEnter={(e) => {
                    if (location.pathname !== "/dashboard") {
                      e.currentTarget.style.background = "#E4F0F5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== "/dashboard") {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <RxDashboard className="text-lg" />
                  <Link to="/dashboard">Dashboard</Link>
                </li>

                {/* Orders */}
                <li
                  className={menuItemClass("/dashboard/my-orders")}
                  style={menuItemStyle("/dashboard/my-orders")}
                  onMouseEnter={(e) => {
                    if (location.pathname !== "/dashboard/my-orders") {
                      e.currentTarget.style.background = "#E4F0F5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== "/dashboard/my-orders") {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <RiProductHuntLine className="text-lg" />
                  <Link to="/dashboard/my-orders">My Orders</Link>
                </li>

                {/* Wishlist */}
                <li
                  className={menuItemClass("/dashboard/my-wishlist")}
                  style={menuItemStyle("/dashboard/my-wishlist")}
                  onMouseEnter={(e) => {
                    if (location.pathname !== "/dashboard/my-wishlist") {
                      e.currentTarget.style.background = "#E4F0F5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== "/dashboard/my-wishlist") {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <BsHeart className="text-lg" />
                  <Link to="/dashboard/my-wishlist">Wishlist</Link>
                </li>

                {/* Chat */}
                <li
                  className={menuItemClass("/dashboard/chat")}
                  style={menuItemStyle("/dashboard/chat")}
                  onMouseEnter={(e) => {
                    if (location.pathname !== "/dashboard/chat") {
                      e.currentTarget.style.background = "#E4F0F5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== "/dashboard/chat") {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <BsChat className="text-lg" />
                  <Link to="/dashboard/chat">Chat</Link>
                </li>

                {/* Change Password */}
                <li
                  className={menuItemClass("/dashboard/chage-password")}
                  style={menuItemStyle("/dashboard/chage-password")}
                  onMouseEnter={(e) => {
                    if (location.pathname !== "/dashboard/chage-password") {
                      e.currentTarget.style.background = "#E4F0F5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== "/dashboard/chage-password") {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <TfiLock className="text-lg" />
                  <Link to="/dashboard/chage-password">Change Password</Link>
                </li>

                {/* Logout */}
                <li
                  onClick={logout}
                  className="flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer transition-all duration-200"
                  style={{ color: "#122C55" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#E4F0F5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <BiLogInCircle className="text-lg" />
                  Logout
                </li>
              </ul>
            </div>

            {/* Main Content */}
            <div className="w-[calc(100%-270px)] md-lg:w-full">
              <div
                className="mx-4 md-lg:mx-0 p-6 rounded-2xl shadow-sm"
                style={{ backgroundColor: "#ffffff" }}
              >
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
