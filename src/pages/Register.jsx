import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AuthShell from "../components/auth/AuthShell";
import {
  clearSignupOtpChallenge,
  customer_register,
  messageClear,
  retry_signup_otp,
  verify_signup_otp,
} from "../store/reducers/authReducer";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    loader,
    successMessage,
    errorMessage,
    pendingEmail,
    signupOtpRequired,
    signupOtpMaskedIdentifier,
    signupOtpResendCooldownSeconds,
  } =
    useSelector((state) => state.auth);

  const [state, setState] = useState({
    name: "",
    email: pendingEmail || "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const register = (e) => {
    e.preventDefault();

    if (!state.phone.trim()) {
      setFieldError("Phone number is required");
      return;
    }

    if (!/^\d{10,15}$/.test(state.phone.trim())) {
      setFieldError("Phone number must be 10-15 digits");
      return;
    }

    if (state.password !== state.confirmPassword) {
      setFieldError("Passwords do not match");
      return;
    }

    setFieldError("");
    dispatch(customer_register(state));
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    const normalizedOtp = otp.replace(/\D/g, "");

    if (!normalizedOtp) {
      setOtpError("Enter the OTP to continue");
      return;
    }

    setOtpError("");
    dispatch(verify_signup_otp({ otp: normalizedOtp }));
  };

  const resendOtp = () => {
    if (resendCooldown > 0) return;
    dispatch(retry_signup_otp());
  };

  const changeDetails = () => {
    setOtp("");
    setOtpError("");
    dispatch(clearSignupOtpChallenge());
  };

  useEffect(() => {
    setResendCooldown(signupOtpResendCooldownSeconds || 0);
  }, [signupOtpResendCooldownSeconds]);

  useEffect(() => {
    if (!resendCooldown) return undefined;
    const timer = setInterval(() => {
      setResendCooldown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      if (!signupOtpRequired) {
        navigate("/login");
      }
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [dispatch, errorMessage, navigate, signupOtpRequired, successMessage]);

  return (
    <>
      {loader ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#38303033]">
          <FadeLoader color="#FF7A1A" />
        </div>
      ) : null}

      <AuthShell
        title="Create Account"
        subtitle="Create your MyHaat account to track orders, wishlist products and manage checkout faster."
        footer={
          <>
            Already have an account?{" "}
            <Link className="font-medium text-[#FF7A1A]" to="/login">
              Login
            </Link>
          </>
        }
      >
        {!signupOtpRequired ? (
        <form onSubmit={register} className="space-y-4 text-slate-600">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#0F1C2E]" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              onChange={inputHandle}
              placeholder="Enter your name"
              type="text"
              value={state.name}
              className="h-11 w-full rounded-lg border border-[#E6E1DA] px-3 text-sm outline-none transition-colors focus:border-[#FF7A1A]"
              required
            />
          </div>

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
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#0F1C2E]" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              onChange={inputHandle}
              placeholder="Enter phone number"
              type="tel"
              value={state.phone}
              className="h-11 w-full rounded-lg border border-[#E6E1DA] px-3 text-sm outline-none transition-colors focus:border-[#FF7A1A]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#0F1C2E]" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                onChange={inputHandle}
                placeholder="Create password"
                type={showPassword ? "text" : "password"}
                value={state.password}
                autoComplete="new-password"
                className="h-11 w-full rounded-lg border border-[#E6E1DA] px-3 pr-10 text-sm outline-none transition-colors focus:border-[#FF7A1A]"
                required
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

          <div>
            <label
              className="mb-2 block text-sm font-medium text-[#0F1C2E]"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                onChange={inputHandle}
                placeholder="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                value={state.confirmPassword}
                autoComplete="new-password"
                className="h-11 w-full rounded-lg border border-[#E6E1DA] px-3 pr-10 text-sm outline-none transition-colors focus:border-[#FF7A1A]"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {fieldError ? (
            <div className="rounded-lg border border-[#ffd6bf] bg-[#fff8f2] px-3 py-2 text-sm text-[#c2550a]">
              {fieldError}
            </div>
          ) : null}

          <button className="h-11 w-full rounded-lg bg-[#FF7A1A] text-sm font-semibold text-white transition-colors hover:bg-[#e56f17]">
            Create Account
          </button>
        </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4 text-slate-600">
            <div className="rounded-lg border border-[#E6E1DA] bg-[#fffaf6] px-4 py-3 text-sm text-slate-600">
              OTP sent to{" "}
              <span className="font-medium text-[#0F1C2E]">
                {signupOtpMaskedIdentifier || "your mobile number"}
              </span>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#0F1C2E]" htmlFor="signupOtp">
                OTP
              </label>
              <input
                id="signupOtp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setOtpError("");
                }}
                placeholder="Enter OTP"
                type="text"
                value={otp}
                className="h-11 w-full rounded-lg border border-[#E6E1DA] px-3 text-sm outline-none transition-colors focus:border-[#FF7A1A]"
                required
              />
            </div>

            {otpError ? (
              <div className="rounded-lg border border-[#ffd6bf] bg-[#fff8f2] px-3 py-2 text-sm text-[#c2550a]">
                {otpError}
              </div>
            ) : null}

            <button
              className="h-11 w-full rounded-lg bg-[#FF7A1A] text-sm font-semibold text-white transition-colors hover:bg-[#e56f17] disabled:opacity-70"
              disabled={loader}
            >
              {loader ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              onClick={resendOtp}
              disabled={loader || resendCooldown > 0}
              className="h-11 w-full rounded-lg border border-[#E6E1DA] text-sm font-semibold text-[#0F1C2E] transition-colors hover:border-[#FF7A1A] hover:text-[#FF7A1A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
            </button>

            <button
              type="button"
              onClick={changeDetails}
              className="w-full text-sm font-medium text-[#FF7A1A] hover:text-[#e56f17]"
            >
              Change signup details
            </button>
          </form>
        )}
      </AuthShell>
    </>
  );
};

export default Register;
