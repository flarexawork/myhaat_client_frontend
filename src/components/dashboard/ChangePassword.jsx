import React, { useState } from "react";
import { useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  change_password,
  messageClear,
  user_reset,
} from "../../store/reducers/authReducer";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, successMessage, errorMessage } = useSelector((state) => state.auth);
  const [state, setState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    if (!passwordRegex.test(state.newPassword)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character.",
      );
      return;
    }

    if (state.newPassword !== state.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    dispatch(change_password(state));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }

    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      dispatch(user_reset());
      navigate("/login", { replace: true });
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  return (
    <div className="flex justify-center items-start py-10">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-8"
        style={{ borderColor: "#E4F0F5" }}
      >
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold" style={{ color: "#122C55" }}>
            Change Password
          </h2>
          <p className="text-sm mt-1" style={{ color: "#A6BFCC" }}>
            Update your account password securely.
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-6" onSubmit={submit}>
          {/* OLD PASSWORD */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="old_password"
              className="text-sm font-medium"
              style={{ color: "#122C55" }}
            >
              Old Password
            </label>

            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                id="old_password"
                name="currentPassword"
                autoComplete="current-password"
                placeholder="Enter old password"
                value={state.currentPassword}
                onChange={inputHandle}
                className="w-full px-4 py-2.5 pr-11 rounded-lg border outline-none transition focus:ring-2"
                style={{
                  borderColor: "#E4F0F5",
                }}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={showOldPassword ? "Hide old password" : "Show old password"}
              >
                {showOldPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="new_password"
              className="text-sm font-medium"
              style={{ color: "#122C55" }}
            >
              New Password
            </label>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new_password"
                name="newPassword"
                autoComplete="new-password"
                placeholder="Enter new password"
                value={state.newPassword}
                onChange={inputHandle}
                className="w-full px-4 py-2.5 pr-11 rounded-lg border outline-none transition focus:ring-2"
                style={{
                  borderColor: "#E4F0F5",
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <p className="text-xs" style={{ color: "#A6BFCC" }}>
              Use at least 8 characters with uppercase, lowercase, number and special character.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirm_password"
              className="text-sm font-medium"
              style={{ color: "#122C55" }}
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm new password"
                value={state.confirmPassword}
                onChange={inputHandle}
                className="w-full px-4 py-2.5 pr-11 rounded-lg border outline-none transition focus:ring-2"
                style={{
                  borderColor: "#E4F0F5",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div>
            <button
              type="submit"
              disabled={loader}
              className="w-full py-3 rounded-xl font-medium transition"
              style={{
                backgroundColor: "#F38E16",
                color: "#ffffff",
              }}
            >
              {loader ? <PropagateLoader color="#fff" /> : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
