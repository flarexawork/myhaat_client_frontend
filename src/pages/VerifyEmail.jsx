import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import AuthShell from "../components/auth/AuthShell";
import ResendVerificationButton from "../components/auth/ResendVerificationButton";
import {
  resetVerificationState,
  verify_email,
} from "../store/reducers/authReducer";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { loader, pendingEmail, emailVerificationStatus, emailVerificationMessage } =
    useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetVerificationState());

    if (token) {
      dispatch(verify_email({ token }));
    }

    return () => {
      dispatch(resetVerificationState());
    };
  }, [dispatch, token]);

  const isSuccess = emailVerificationStatus === "success";
  const isInvalid = !token || emailVerificationStatus === "error";

  return (
    <>
      {loader && emailVerificationStatus === "loading" ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#38303033]">
          <FadeLoader color="#FF7A1A" />
        </div>
      ) : null}

      <AuthShell
        title={isSuccess ? "Email Verified Successfully" : "Verification Link Invalid"}
        subtitle={
          isSuccess
            ? "Your email has been verified successfully. You can now login to your account."
            : "This verification link is invalid or expired."
        }
      >
        <div className="mb-6 flex justify-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full text-[30px] ${
              isSuccess
                ? "bg-[#eefaf2] text-[#1f8f4d]"
                : "bg-[#fff4ec] text-[#FF7A1A]"
            }`}
          >
            {isSuccess ? <FiCheckCircle /> : <FiAlertCircle />}
          </div>
        </div>

        <div className="mb-6 text-center text-sm leading-6 text-slate-600">
          <p>
            {emailVerificationMessage ||
              (isSuccess
                ? "Your email has been verified successfully."
                : "This verification link is invalid or expired.")}
          </p>
        </div>

        {isSuccess ? (
          <Link
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#FF7A1A] text-sm font-semibold text-white transition-colors hover:bg-[#e56f17]"
            to="/login"
          >
            Go to Login
          </Link>
        ) : null}

        {isInvalid ? (
          <div className="space-y-3">
            <ResendVerificationButton email={pendingEmail} />
            <Link
              className="flex h-11 w-full items-center justify-center rounded-lg border border-[#E6E1DA] text-sm font-semibold text-[#0F1C2E] transition-colors hover:border-[#FF7A1A] hover:text-[#FF7A1A]"
              to="/login"
            >
              Back to Login
            </Link>
          </div>
        ) : null}
      </AuthShell>
    </>
  );
};

export default VerifyEmail;
