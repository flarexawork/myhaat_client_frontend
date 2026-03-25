import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AuthShell from "../components/auth/AuthShell";
import { messageClear, reset_password } from "../store/reducers/authReducer";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loader, successMessage, errorMessage } = useSelector((state) => state.auth);

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/login");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [dispatch, errorMessage, navigate, successMessage]);

  const submit = (e) => {
    e.preventDefault();
    if (!token) {
      setFieldError("Reset token is missing");
      return;
    }
    if (password !== confirmPassword) {
      setFieldError("Passwords do not match");
      return;
    }
    setFieldError("");
    dispatch(reset_password({ token, password }));
  };

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Set a new password for your account."
      footer={
        <>
          Remembered your password?{" "}
          <Link className="font-medium text-[#FF7A1A]" to="/login">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0F1C2E]" htmlFor="newPassword">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              className="h-11 w-full rounded-lg border border-[#E6E1DA] px-3 pr-10 text-sm outline-none transition-colors focus:border-[#FF7A1A]"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              type={showPassword ? "text" : "password"}
              value={password}
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
          <label className="mb-2 block text-sm font-medium text-[#0F1C2E]" htmlFor="confirmNewPassword">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmNewPassword"
              className="h-11 w-full rounded-lg border border-[#E6E1DA] px-3 pr-10 text-sm outline-none transition-colors focus:border-[#FF7A1A]"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
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

        <button
          className="h-11 w-full rounded-lg bg-[#FF7A1A] text-sm font-semibold text-white transition-colors hover:bg-[#e56f17] disabled:opacity-70"
          disabled={loader}
        >
          {loader ? "Updating..." : "Update Password"}
        </button>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
