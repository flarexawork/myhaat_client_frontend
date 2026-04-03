import React, { useEffect, useState } from "react";
import { AiOutlineShoppingCart, AiOutlineEye } from "react-icons/ai";
import { BsCreditCard } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { get_dashboard_index_data } from "../../store/reducers/dashboardReducer";
import axios from "axios";
import { api_url } from "../../utils/config";
import { FiClock } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { FiCopy } from "react-icons/fi";
import { getDeliveryStatusMeta } from "../../utils/orderStatus";
import { formatDateTime } from "../../utils/dateFormatter";

const Index = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { totalOrder, pendingOrder, recentOrders, cancelledOrder } =
    useSelector((state) => state.dashboard);
  const [payingOrderId, setPayingOrderId] = useState("");
  const userId = userInfo?.id;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;
    dispatch(get_dashboard_index_data(userId));
  }, [dispatch, userId]);

  const payNow = async (ord) => {
    if (payingOrderId) return;
    try {
      setPayingOrderId(ord._id);

      const { data } = await axios.post(
        `${api_url}/api/order/create-payment`,
        { orderId: ord._id },
        { withCredentials: true },
      );

      if (!data?.razorpayOrder) {
        if (data?.message === "Order already paid") {
          navigate(`/order/success/${ord._id}`);
        }
        setPayingOrderId("");
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "Your Store Name",
        description: "Order Payment",
        order_id: data.razorpayOrder.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${api_url}/api/order/verify-payment`,
              {
                orderId: data.orderId || ord._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true },
            );
            setPayingOrderId("");
            navigate(`/order/success/${data.orderId || ord._id}`);
          } catch {
            setPayingOrderId("");
            alert("Payment verification failed. Please retry.");
          }
        },
        modal: {
          ondismiss: function () {
            setPayingOrderId("");
          },
        },
        theme: {
          color: "#F38E16",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setPayingOrderId("");
      });
      rzp.open();
    } catch {
      setPayingOrderId("");
      alert("Payment open failed. Please try again.");
    }
  };
  return (
    <div className="space-y-10">
      {/* ================= SIGNAL COLOR STATS ================= */}
      <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
        {/* TOTAL ORDERS */}
        <div
          className="relative bg-white rounded-2xl p-6 shadow-sm border overflow-hidden"
          style={{ borderColor: "#E4F0F5" }}
        >
          <div
            className="absolute top-0 left-0 w-2 h-full"
            style={{ backgroundColor: "#F38E16" }}
          />

          <p className="text-sm font-medium" style={{ color: "#A6BFCC" }}>
            Total Orders
          </p>

          <h2 className="text-4xl font-bold mt-3" style={{ color: "#122C55" }}>
            {totalOrder}
          </h2>

          <div
            className="absolute right-6 top-6 opacity-10 text-6xl"
            style={{ color: "#F38E16" }}
          >
            <AiOutlineShoppingCart />
          </div>
        </div>

        {/* PENDING ORDERS */}
        <div
          className="relative bg-white rounded-2xl p-6 shadow-sm border overflow-hidden"
          style={{ borderColor: "#E4F0F5" }}
        >
          <div
            className="absolute top-0 left-0 w-2 h-full"
            style={{ backgroundColor: "#2E8B57" }}
          />

          <p className="text-sm font-medium" style={{ color: "#A6BFCC" }}>
            Pending Orders
          </p>

          <h2 className="text-4xl font-bold mt-3" style={{ color: "#2E8B57" }}>
            {pendingOrder}
          </h2>

          <div
            className="absolute right-6 top-6 opacity-10 text-6xl"
            style={{ color: "#2E8B57" }}
          >
            <FiClock />
          </div>
        </div>

        {/* CANCELLED ORDERS */}
        <div
          className="relative bg-white rounded-2xl p-6 shadow-sm border overflow-hidden"
          style={{ borderColor: "#E4F0F5" }}
        >
          <div
            className="absolute top-0 left-0 w-2 h-full"
            style={{ backgroundColor: "#CC4255" }}
          />

          <p className="text-sm font-medium" style={{ color: "#A6BFCC" }}>
            Cancelled Orders
          </p>

          <h2 className="text-4xl font-bold mt-3" style={{ color: "#CC4255" }}>
            {cancelledOrder}
          </h2>

          <div
            className="absolute right-6 top-6 opacity-10 text-6xl"
            style={{ color: "#CC4255" }}
          >
            <IoCloseOutline />
          </div>
        </div>
      </div>

      {/* ================= TABLE SECTION ================= */}
      <div
        className="bg-white rounded-2xl shadow-sm border overflow-hidden"
        style={{ borderColor: "#E4F0F5" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            {/* ================= HEADER ================= */}
            <thead>
              <tr
                className="text-xs uppercase tracking-wider"
                style={{
                  backgroundColor: "#FCF6E3",
                  color: "#122C55",
                }}
              >
                <th className="px-6 py-5 text-left">Order</th>
                <th className="px-6 py-5 text-left">Price</th>
                <th className="px-6 py-5 text-left">Payment</th>
                <th className="px-6 py-5 text-left">Delivery</th>
                <th className="px-6 py-5 text-left">Date & Time</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>

            {/* ================= BODY ================= */}
            <tbody>
              {recentOrders.map((o, i) => {
                const product = o.products?.[0];
                const deliveryMeta = getDeliveryStatusMeta(o.delivery_status);

                return (
                  <tr
                    key={i}
                    className="border-b transition duration-200 hover:bg-[#FCF6E3]"
                    style={{ borderColor: "#E4F0F5" }}
                  >
                    {/* ORDER COLUMN */}
                    <td className="px-6 py-6">
                      <div className="flex items-start gap-4">
                        {/* PRODUCT IMAGE */}
                        <div
                          className="w-16 h-16 rounded-xl overflow-hidden border bg-[#FCF6E3] flex-shrink-0"
                          style={{ borderColor: "#E4F0F5" }}
                        >
                          <img
                            src={product?.images?.[0]}
                            alt={product?.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        {/* ORDER TEXT BLOCK */}
                        <div className="flex flex-col gap-2">
                          {/* ORDER ID + COPY */}
                          <div className="flex items-center gap-2">
                            <span
                              className="text-sm font-semibold px-3 py-1 rounded-lg bg-[#FCF6E3]"
                              style={{ color: "#122C55" }}
                            >
                             #{o._id}
                            </span>

                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(o._id)
                              }
                              className="p-1.5 rounded-md transition hover:bg-[#E4F0F5]"
                              title="Copy Order ID"
                            >
                              <FiCopy size={14} />
                            </button>
                          </div>

                          {/* PRODUCT NAME */}
                          <p
                            className="text-sm font-medium max-w-[250px] truncate"
                            style={{ color: "#122C55" }}
                          >
                            {product?.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-6">
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#122C55" }}
                      >
                        ₹{o.final_total || o.price}
                      </span>
                    </td>

                    {/* PAYMENT STATUS */}
                    <td className="px-6 py-6">
                      <span
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor:
                            o.payment_status === "paid"
                              ? "#E6F4EA"
                              : o.payment_type === "cod"
                                ? "#EEF2FF"
                                : "#FFF4E5",
                          color:
                            o.payment_status === "paid"
                              ? "#2E8B57"
                              : o.payment_type === "cod"
                                ? "#4F46E5"
                                : "#F38E16",
                        }}
                      >
                        {o.payment_status.toUpperCase()}
                      </span>
                    </td>

                    {/* DELIVERY STATUS */}
                    <td className="px-6 py-6">
                      <span
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: deliveryMeta.bgColor,
                          color: deliveryMeta.color,
                        }}
                      >
                        {deliveryMeta.label}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-6">
                      <span className="text-xs" style={{ color: "#A6BFCC" }}>
                        {formatDateTime(o.date)}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end items-center gap-3">
                        {/* VIEW ICON */}
                        <Link
                          to={`/dashboard/order/details/${o._id}`}
                          className="w-10 h-10 flex items-center justify-center rounded-xl border transition hover:bg-[#E4F0F5]"
                          style={{
                            borderColor: "#E4F0F5",
                            color: "#122C55",
                          }}
                        >
                          <AiOutlineEye size={18} />
                        </Link>

                        {/* PAY ICON */}
                        {o.payment_status !== "paid" && o.payment_type !== "cod" && (
                          <button
                            onClick={() => (payingOrderId ? null : payNow(o))}
                            disabled={payingOrderId === o._id}
                            className="w-10 h-10 flex items-center justify-center rounded-xl transition"
                            style={{
                              backgroundColor:
                                payingOrderId === o._id ? "#E4F0F5" : "#F38E16",
                              color:
                                payingOrderId === o._id ? "#A6BFCC" : "#ffffff",
                            }}
                          >
                            <BsCreditCard size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Index;
