import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AuthShell from "../components/auth/AuthShell";
import {
  customer_login,
  messageClear,
  resend_verification,
  setPendingEmail,
} from "../store/reducers/authReducer";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, successMessage, errorMessage, userInfo, verificationRequired, pendingEmail } =
    useSelector((state) => state.auth);

  const [state, setState] = useState({
    email: pendingEmail || "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const sellerLoginUrl =
    typeof window !== "undefined"
      ? window.location.port === "3000"
        ? `${window.location.protocol}//${window.location.hostname}:3001/seller/login`
        : `${window.location.origin}/seller/login`
      : "/seller/login";

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const login = (e) => {
    e.preventDefault();
    dispatch(setPendingEmail(state.email));
    dispatch(customer_login(state));
  };

  const resendVerificationEmail = () => {
    if (!state.email) {
      toast.error("Enter your email first");
      return;
    }
    dispatch(resend_verification({ email: state.email }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (userInfo) {
      navigate("/");
    }
  }, [dispatch, errorMessage, navigate, successMessage, userInfo]);

  return (
    <>
      {loader ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#38303033]">
          <FadeLoader color="#FF7A1A" />
        </div>
      ) : null}

      <AuthShell
        title="Login"
        subtitle="Login to manage orders, wishlist and checkout faster."
        footer={
          <>
            New to MyHaat?{" "}
            <Link className="font-medium text-[#FF7A1A]" to="/register">
              Create account
            </Link>
          </>
        }
      >
        <form onSubmit={login} className="space-y-4 text-slate-600">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#0F1C2E]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              onChange={inputHandle}
              placeholder="Enter your email"
              type="email"
              value={state.email}
              className="h-11 w-full rounded-lg border border-[#E6E1DA] px-3 text-sm outline-none transition-colors focus:border-[#FF7A1A]"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-medium text-[#0F1C2E]" htmlFor="password">
                Password
              </label>
              <Link className="text-sm font-medium text-[#FF7A1A]" to="/forgot-password">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                onChange={inputHandle}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={state.password}
                autoComplete="current-password"
                className="h-11 w-full rounded-lg border border-[#E6E1DA] px-3 pr-10 text-sm outline-none transition-colors focus:border-[#FF7A1A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button className="h-11 w-full rounded-lg bg-[#FF7A1A] text-sm font-semibold text-white transition-colors hover:bg-[#e56f17]">
            Login
          </button>

          <a
            className="flex h-11 w-full items-center justify-center rounded-lg border border-[#E6E1DA] text-sm font-semibold text-[#0F1C2E] transition-colors hover:border-[#FF7A1A] hover:text-[#FF7A1A]"
            href={sellerLoginUrl}
          >
            Become Seller
          </a>
        </form>

        {verificationRequired ? (
          <div className="mt-5 rounded-lg border border-[#ffd6bf] bg-[#fff8f2] p-4 text-sm">
            <p className="font-medium text-[#c2550a]">
              Please verify your email before logging in.
            </p>
            <button
              className="mt-3 font-semibold text-[#FF7A1A] hover:text-[#e56f17]"
              onClick={resendVerificationEmail}
              type="button"
            >
              Resend verification email
            </button>
          </div>
        ) : null}
      </AuthShell>
    </>
  );
};

export default Login;
