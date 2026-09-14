import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import auth from "../store/reducers/authReducer";
import api from "../api/api";

jest.mock("axios", () => ({ __esModule: true, default: { post: jest.fn() } }));
jest.mock("../api/api", () => ({ __esModule: true, default: { post: jest.fn() } }));
jest.mock("../components/auth/AuthShell", () => ({ children }) => <div>{children}</div>);
jest.mock("react-hot-toast", () => ({ success: jest.fn(), error: jest.fn() }));
function mount(Page, state = {}) {
  const initial = auth(undefined, { type: "init" });
  const store = configureStore({ reducer: { auth }, preloadedState: { auth: { ...initial, ...state } } });
  render(<Provider store={store}><MemoryRouter><Page /></MemoryRouter></Provider>);
  return store;
}
beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); });
test.each(["user@example.com", "9876543210"])("password login sends %s and password without requesting OTP mode", async (identifier) => {
  api.post.mockResolvedValue({ data: { success: false, message: "Test response" } });
  mount(Login);
  fireEvent.change(screen.getByLabelText("Email or mobile number"), { target: { value: identifier } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Login", exact: true })); });
  await waitFor(() => expect(api.post).toHaveBeenCalledWith("/customer/customer-login", { identifier, password: "secret", loginMethod: "password" }));
});
test("mobile login omits password and switching methods discards the challenge", async () => {
  api.post.mockResolvedValue({ data: { requiresOtp: true, challengeToken: "mobile-challenge", maskedIdentifier: "******3210" } });
  const store = mount(Login);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Mobile OTP login" })); });
  expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Mobile number"), { target: { value: "9876543210" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Send mobile OTP" })); });
  await waitFor(() => expect(screen.getByLabelText("OTP")).toBeInTheDocument());
  expect(api.post).toHaveBeenCalledWith("/customer/customer-login", { identifier: "9876543210", loginMethod: "otp" });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Password login" })); });
  expect(store.getState().auth.otpChallengeToken).toBe("");
  expect(screen.getByLabelText("Password")).toHaveValue("");
});
test("signup submits both verification codes with its challenge", async () => {
  api.post.mockResolvedValue({ data: { success: false, message: "Test response" } });
  mount(Register, { signupOtpRequired: true, signupOtpChallengeToken: "signup-challenge", signupOtpMaskedEmail: "us***@example.com" });
  fireEvent.change(screen.getByLabelText("Email OTP"), { target: { value: "654321" } });
  fireEvent.change(screen.getByLabelText("Mobile OTP"), { target: { value: "123456" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Verify & Create Account" })); });
  await waitFor(() => expect(api.post).toHaveBeenCalledWith("/auth/signup-otp/verify", {
    challengeToken: "signup-challenge", role: "customer", otp: "123456", emailOtp: "654321"
  }));
});
test("signup will not submit with only the mobile code", () => {
  mount(Register, { signupOtpRequired: true });
  fireEvent.change(screen.getByLabelText("Mobile OTP"), { target: { value: "123456" } });
  fireEvent.submit(screen.getByRole("button", { name: "Verify & Create Account" }).closest("form"));
  expect(api.post).not.toHaveBeenCalled();
  expect(screen.getByText("Enter the mobile OTP and the 6-digit email OTP to continue")).toBeInTheDocument();
});
test("signup resend clears old codes and restarts the cooldown", async () => {
  api.post.mockResolvedValue({ data: { success: true, resendCooldownSeconds: 30 } });
  mount(Register, { signupOtpRequired: true, signupOtpChallengeToken: "signup-challenge" });
  fireEvent.change(screen.getByLabelText("Email OTP"), { target: { value: "654321" } });
  fireEvent.change(screen.getByLabelText("Mobile OTP"), { target: { value: "123456" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Resend email and mobile OTPs" })); });
  await waitFor(() => expect(screen.getByLabelText("Email OTP")).toHaveValue(""));
  expect(screen.getByLabelText("Mobile OTP")).toHaveValue("");
  expect(screen.getByRole("button", { name: "Resend codes in 30s" })).toBeDisabled();
});
