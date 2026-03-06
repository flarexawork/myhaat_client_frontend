import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ChangePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
        <form className="space-y-6">
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
                name="old_password"
                autoComplete="current-password"
                placeholder="Enter old password"
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
                name="new_password"
                autoComplete="new-password"
                placeholder="Enter new password"
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
              Use at least 8 characters with a mix of letters & numbers.
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-medium transition"
              style={{
                backgroundColor: "#F38E16",
                color: "#ffffff",
              }}
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
