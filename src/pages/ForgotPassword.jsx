import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AuthShell from "../components/auth/AuthShell";
import { forgot_password, messageClear } from "../store/reducers/authReducer";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [dispatch, errorMessage, successMessage]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(forgot_password({ email }));
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your email address and we will send you a password reset link."
      footer={
        <>
          Back to{" "}
          <Link className="font-medium text-[#FF7A1A]" to="/login">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0F1C2E]" htmlFor="forgotEmail">
            Email
          </label>
          <input
            id="forgotEmail"
            className="h-11 w-full rounded-lg border border-[#E6E1DA] px-3 text-sm outline-none transition-colors focus:border-[#FF7A1A]"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            type="email"
            value={email}
            required
          />
        </div>

        <button className="h-11 w-full rounded-lg bg-[#FF7A1A] text-sm font-semibold text-white transition-colors hover:bg-[#e56f17] disabled:opacity-70" disabled={loader}>
          {loader ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
