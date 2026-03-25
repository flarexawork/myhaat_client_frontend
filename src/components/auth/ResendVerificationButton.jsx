import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resend_verification } from "../../store/reducers/authReducer";

const ResendVerificationButton = ({ email }) => {
  const dispatch = useDispatch();
  const { loader } = useSelector((state) => state.auth);

  return (
    <div className="space-y-3">
      <button
        className="h-11 w-full rounded-lg bg-[#FF7A1A] text-sm font-semibold text-white transition-colors hover:bg-[#e56f17] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!email || loader}
        onClick={() => dispatch(resend_verification({ email }))}
        type="button"
      >
        {loader ? "Sending..." : "Resend Verification Email"}
      </button>
      {!email ? (
        <p className="text-center text-xs leading-5 text-slate-500">
          Email address not available. Login or sign up again to request a new verification
          email.
        </p>
      ) : null}
    </div>
  );
};

export default ResendVerificationButton;
