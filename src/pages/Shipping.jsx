import React, { useEffect, useState } from "react";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { place_order } from "../store/reducers/orderReducer";
import axios from "axios";
import { api_url } from "../utils/config";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  const products = location.state?.products || [];
  const price = Number(location.state?.price || 0);
  const shipping_fee = Number(location.state?.shipping_fee || 0);
  const items = Number(location.state?.items || 0);

  const [res, setRes] = useState(false);

  const [paymentType, setPaymentType] = useState("online"); // 🔥 NEW

  const [state, setState] = useState({
    name: "",
    address: "",
    phone: "",
    post: "",
    province: "",
    city: "",
    area: "",
  });

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

  const save = (e) => {
    e.preventDefault();
    const { name, address, phone, post, province, city, area } = state;
    if (name && address && phone && post && province && city && area) {
      setRes(true);
    }
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
        shipping_fee,
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
    <div>
      <Headers />

      <section className="bg-[#eeeeee] py-10">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="flex flex-wrap gap-6">
            {/* LEFT SIDE */}
            <div className="w-[65%] md:w-full flex flex-col gap-4">
              {/* SHIPPING FORM */}
              <div className="bg-white p-6 rounded shadow-sm">
                {!res ? (
                  <>
                    <h2 className="font-semibold text-lg mb-4">
                      Shipping Information
                    </h2>

                    <form onSubmit={save} className="flex flex-col gap-4">
                      <input
                        name="name"
                        onChange={inputHandle}
                        placeholder="Full Name"
                        className="border px-3 py-2 rounded"
                      />

                      <input
                        name="address"
                        onChange={inputHandle}
                        placeholder="Address"
                        className="border px-3 py-2 rounded"
                      />

                      <input
                        name="phone"
                        onChange={inputHandle}
                        placeholder="Phone"
                        className="border px-3 py-2 rounded"
                      />

                      <input
                        name="post"
                        onChange={inputHandle}
                        placeholder="Post"
                        className="border px-3 py-2 rounded"
                      />

                      <input
                        name="province"
                        onChange={inputHandle}
                        placeholder="Province"
                        className="border px-3 py-2 rounded"
                      />

                      <input
                        name="city"
                        onChange={inputHandle}
                        placeholder="City"
                        className="border px-3 py-2 rounded"
                      />

                      <input
                        name="area"
                        onChange={inputHandle}
                        placeholder="Area"
                        className="border px-3 py-2 rounded"
                      />

                      <button className="bg-indigo-600 text-white py-2 rounded">
                        Save
                      </button>
                    </form>
                  </>
                ) : (
                  <div>
                    <h3 className="font-semibold">Deliver to {state.name}</h3>
                    <p className="text-sm text-gray-600">
                      {state.address}, {state.city}, {state.province}
                    </p>
                    <span
                      onClick={() => setRes(false)}
                      className="text-indigo-500 cursor-pointer text-sm"
                    >
                      Change
                    </span>
                  </div>
                )}
              </div>

              {/* PAYMENT SELECTION 🔥 */}
              <div className="bg-white p-6 rounded shadow-sm">
                <h2 className="font-semibold text-lg mb-4">
                  Select Payment Method
                </h2>

                <div className="flex gap-6">
                  <label className="flex gap-2 items-center cursor-pointer">
                    <input
                      type="radio"
                      value="online"
                      checked={paymentType === "online"}
                      onChange={() => setPaymentType("online")}
                    />
                    Online Payment (Razorpay)
                  </label>

                  <label className="flex gap-2 items-center cursor-pointer">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentType === "cod"}
                      onChange={() => setPaymentType("cod")}
                    />
                    Cash On Delivery
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE SUMMARY */}
            <div className="w-[30%] md:w-full">
              <div className="bg-white p-6 rounded shadow-sm flex flex-col gap-4">
                <h2 className="font-semibold text-lg">Order Summary</h2>

                <div className="flex justify-between">
                  <span>Items</span>
                  <span>₹{price}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping_fee}</span>
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{price + shipping_fee}</span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={!res}
                  className={`py-2 rounded text-white ${
                    res ? "bg-orange-500" : "bg-orange-300"
                  }`}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shipping;
