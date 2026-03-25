import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import AuthShell from "../components/auth/AuthShell";
import ResendVerificationButton from "../components/auth/ResendVerificationButton";
import {
  messageClear,
  setPendingEmail,
} from "../store/reducers/authReducer";

const VerifyPending = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { successMessage, errorMessage, pendingEmail } = useSelector((state) => state.auth);

  const email = location.state?.email || pendingEmail;

  useEffect(() => {
    if (location.state?.email) {
      dispatch(setPendingEmail(location.state.email));
    }
  }, [dispatch, location.state]);

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

  return (
    <AuthShell
      title="Verify Your Email"
      subtitle="We have sent a verification link to your email address. Please verify your email to activate your account."
      footer={
        <Link className="font-medium text-[#FF7A1A]" to="/login">
          Back to Login
        </Link>
      }
    >
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff4ec] text-[28px] text-[#FF7A1A]">
          <FiMail />
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-[#E6E1DA] bg-[#fffaf6] px-4 py-4 text-center text-sm text-slate-600">
        <p className="leading-6">
          Verification email sent to
          <span className="ml-1 font-medium text-[#0F1C2E]">{email || "your email address"}</span>
        </p>
      </div>

      <div className="space-y-3">
        <ResendVerificationButton email={email} />
        <Link
          className="flex h-11 w-full items-center justify-center rounded-lg border border-[#E6E1DA] text-sm font-semibold text-[#0F1C2E] transition-colors hover:border-[#FF7A1A] hover:text-[#FF7A1A]"
          to="/login"
        >
          Back to Login
        </Link>
      </div>
    </AuthShell>
  );
};

export default VerifyPending;
