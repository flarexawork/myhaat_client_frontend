import React, { useEffect, useState } from "react";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { place_order } from "../store/reducers/orderReducer";
import axios from "axios";
import { api_url } from "../utils/config";
import {
  calculateShippingFee,
  getShippingFeeFromSettings,
} from "../utils/shippingFee";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  const products = location.state?.products || [];
  const price = Number(location.state?.price || 0);
  const initialShippingFee = Number(location.state?.shipping_fee || 0);
  const items = Number(location.state?.items || 0);

  const [res, setRes] = useState(false);
  const [paymentType, setPaymentType] = useState("online");
  const [shippingFee, setShippingFee] = useState(initialShippingFee);
  const [state, setState] = useState({
    name: "",
    address: "",
    phone: "",
    post: "",
    province: "",
    city: "",
    area: "",
  });

  const fields = [
    { label: "Full Name", name: "name", placeholder: "Enter full name" },
    { label: "Phone", name: "phone", placeholder: "Enter phone number" },
    { label: "Address", name: "address", placeholder: "Street address" },
    { label: "Post", name: "post", placeholder: "Post code" },
    { label: "Province", name: "province", placeholder: "Enter province" },
    { label: "City", name: "city", placeholder: "Enter city" },
    { label: "Area", name: "area", placeholder: "Enter area", full: true },
  ];

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login", { replace: true });
      return;
    }

    if (!products.length) {
      navigate("/card", { replace: true });
    }
  }, [userInfo, products.length, navigate]);

  useEffect(() => {
    let isMounted = true;

    const syncShippingFee = async () => {
      if (!products.length) return;

      try {
        const feePerGroup = await getShippingFeeFromSettings();
        if (isMounted) {
          setShippingFee(calculateShippingFee(feePerGroup, products.length));
        }
      } catch (error) {
        if (isMounted) {
          setShippingFee(initialShippingFee);
        }
      }
    };

    syncShippingFee();

    return () => {
      isMounted = false;
    };
  }, [products, initialShippingFee]);

  const [fieldError, setFieldError] = useState("");

  const save = (e) => {
    e.preventDefault();
    const { name, address, phone, post, province, city, area } = state;

    if (!name || !address || !phone || !post || !province || !city || !area) {
      setFieldError("All shipping fields are required");
      return;
    }

    if (!/^\d{10,15}$/.test(phone.trim())) {
      setFieldError("Phone number must be 10-15 digits");
      return;
    }

    if (!/^\d{6}$/.test(post.trim())) {
      setFieldError("Post code must be exactly 6 digits");
      return;
    }

    setFieldError("");
    setRes(true);
  };

  const placeOrder = async () => {
    if (!userInfo) {
      navigate("/login", { replace: true });
      return;
    }

    if (!products.length) {
      navigate("/card", { replace: true });
      return;
    }

    const res = await dispatch(
      place_order({
        price,
        products,
        shipping_fee: shippingFee,
        shippingInfo: state,
        userId: userInfo?.id,
        payment_type: paymentType,
        items,
      }),
    );

    if (!res.payload) return;

    if (paymentType === "cod") {
      navigate(`/order/success/${res.payload.orderId}`);
      return;
    }

    if (paymentType === "online") {
      const { razorpayOrder, orderId } = res.payload;

      if (!razorpayOrder) return;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${api_url}/api/order/verify-payment`,
              {
                orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true },
            );

            navigate(`/order/success/${orderId}`);
          } catch (error) {
            console.log("verify payment error:", error.response?.data || error);
            alert("Payment ho gaya, lekin verification fail hua. Please retry.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F2EB]">
      <Headers />

      <section className="py-6 md:py-5">
        <div className="mx-auto max-w-[1200px] px-6 md:px-4">
          <div className="mb-6 flex flex-col gap-2">
            <span className="inline-flex w-fit items-center rounded-full border border-[#ffd9c2] bg-[#fff7f1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF7A1A]">
              Secure Checkout
            </span>
            <h1 className="text-[28px] font-semibold text-[#0F1C2E] md:text-[24px]">
              Complete your order
            </h1>
            <p className="text-sm text-slate-500">
              Add shipping details, choose payment method, and review your order.
            </p>
          </div>

          <div className="grid grid-cols-[minmax(0,1.86fr)_minmax(320px,1fr)] gap-6 md:grid-cols-1 md:gap-4">
            <div className="space-y-6 md:space-y-4">
              <div className="rounded-xl border border-[#E6E1DA] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] md:p-4">
                {!res ? (
                  <>
                    <div className="mb-5">
                      <h2 className="text-[20px] font-semibold text-[#0F1C2E]">
                        Shipping Information
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Enter the delivery address for this order.
                      </p>
                    </div>

                    <form onSubmit={save} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-3">
                        {fields.map((field) => (
                          <div
                            key={field.name}
                            className={field.full ? "col-span-2 md:col-span-1" : ""}
                          >
                            <label
                              className="mb-2 block text-sm font-medium text-[#0F1C2E]"
                              htmlFor={field.name}
                            >
                              {field.label}
                            </label>
                            <input
                              id={field.name}
                              name={field.name}
                              onChange={inputHandle}
                              placeholder={field.placeholder}
                              value={state[field.name]}
                              className="h-11 w-full rounded-lg border border-[#E6E1DA] px-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#FF7A1A]"
                            />
                          </div>
                        ))}
                      </div>

                      {fieldError ? (
                        <div className="rounded-lg border border-[#ffd6bf] bg-[#fff8f2] px-3 py-2 text-sm text-[#c2550a]">
                          {fieldError}
                        </div>
                      ) : null}

                      <button
                        className="h-11 w-full rounded-lg bg-[#FF7A1A] text-sm font-semibold text-white transition-colors hover:bg-[#e56f17]"
                        type="submit"
                      >
                        Save Shipping Information
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4 md:flex-col md:items-start">
                      <div>
                        <h2 className="text-[20px] font-semibold text-[#0F1C2E]">
                          Shipping Information
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Delivery address confirmed for this order.
                        </p>
                      </div>
                      <button
                        className="text-sm font-medium text-[#FF7A1A] hover:text-[#e56f17]"
                        onClick={() => setRes(false)}
                        type="button"
                      >
                        Change
                      </button>
                    </div>

                    <div className="rounded-lg border border-[#E6E1DA] bg-[#fffaf6] px-4 py-4">
                      <h3 className="text-base font-semibold text-[#0F1C2E]">
                        Deliver to {state.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {state.address}, {state.area}, {state.city}, {state.province},{" "}
                        {state.post}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{state.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#E6E1DA] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] md:p-4">
                <div className="mb-5">
                  <h2 className="text-[20px] font-semibold text-[#0F1C2E]">
                    Select Payment Method
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose how you want to complete the payment.
                  </p>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                      paymentType === "online"
                        ? "border-[#FF7A1A] bg-[#fff8f2]"
                        : "border-[#E6E1DA] bg-white hover:border-[#ffd2b3]"
                    }`}
                  >
                    <input
                      type="radio"
                      value="online"
                      checked={paymentType === "online"}
                      onChange={() => setPaymentType("online")}
                      className="mt-1 accent-[#FF7A1A]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[#0F1C2E]">
                        Online Payment (Razorpay)
                      </span>
                      <span className="mt-1 block text-sm text-slate-500">
                        Pay instantly using Razorpay.
                      </span>
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                      paymentType === "cod"
                        ? "border-[#FF7A1A] bg-[#fff8f2]"
                        : "border-[#E6E1DA] bg-white hover:border-[#ffd2b3]"
                    }`}
                  >
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentType === "cod"}
                      onChange={() => setPaymentType("cod")}
                      className="mt-1 accent-[#FF7A1A]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[#0F1C2E]">
                        Cash On Delivery
                      </span>
                      <span className="mt-1 block text-sm text-slate-500">
                        Pay when your order arrives.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <aside className="md:order-last">
              <div className="sticky top-[100px] rounded-xl border border-[#E6E1DA] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] md:static md:p-4">
                <div className="mb-5">
                  <h2 className="text-[20px] font-semibold text-[#0F1C2E]">
                    Order Summary
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review the final amount before placing the order.
                  </p>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span>₹{price}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>₹{shippingFee}</span>
                  </div>

                  <div className="border-t border-dashed border-[#E6E1DA] pt-3">
                    <div className="flex items-center justify-between text-[18px] font-bold text-[#0F1C2E]">
                      <span>Total</span>
                      <span>₹{price + shippingFee}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={!res}
                  className={`mt-4 h-[46px] w-full rounded-lg text-sm font-semibold text-white transition-colors ${
                    res ? "bg-[#FF7A1A] hover:bg-[#e56f17]" : "bg-[#ffbb8a]"
                  }`}
                >
                  Place Order
                </button>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  Your payment flow and order logic remain unchanged. You can place
                  the order after saving shipping information.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shipping;
