import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import { get_orders } from "../../store/reducers/orderReducer";
import axios from "axios";
import { api_url } from "../../utils/config";
import { BsCreditCard } from "react-icons/bs";
import {
  getDeliveryStatusMeta,
  normalizeStatus,
} from "../../utils/orderStatus";
import { formatDateTime } from "../../utils/dateFormatter";
import {
  getOrderAutoCancelTimer,
  getServerTimeOffsetMs,
} from "../../utils/orderAutoCancel";

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { myOrders, serverTime } = useSelector((state) => state.order);
  const [orderFilter] = useState("all");
  const [payingOrderId, setPayingOrderId] = useState("");
  const [serverOffsetMs, setServerOffsetMs] = useState(0);
  const [clockMs, setClockMs] = useState(Date.now());
  const expiredOrderIdsRef = useRef(new Set());
  const userId = userInfo?.id;
  const currentServerTimeMs = clockMs + serverOffsetMs;
  const hasPendingAutoCancelOrders = myOrders.some(
    (order) => order?.auto_cancel?.enabled,
  );

  useEffect(() => {
    if (!userId) return;
    dispatch(get_orders({ status: orderFilter, customerId: userId }));
  }, [orderFilter, dispatch, userId]);

  useEffect(() => {
    setServerOffsetMs(getServerTimeOffsetMs(serverTime));
  }, [serverTime]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setClockMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    if (!userId || !hasPendingAutoCancelOrders) return;

    const pollId = window.setInterval(() => {
      dispatch(get_orders({ status: orderFilter, customerId: userId }));
    }, 3000);

    return () => {
      window.clearInterval(pollId);
    };
  }, [dispatch, hasPendingAutoCancelOrders, orderFilter, userId]);

  useEffect(() => {
    const activeOrderIds = new Set(myOrders.map((order) => order._id));

    expiredOrderIdsRef.current = new Set(
      Array.from(expiredOrderIdsRef.current).filter((orderId) =>
        activeOrderIds.has(orderId),
      ),
    );
  }, [myOrders]);

  useEffect(() => {
    if (!userId || !myOrders.length) return;

    const newlyExpiredOrderIds = myOrders
      .map((order) => {
        const autoCancelTimer = getOrderAutoCancelTimer(
          order,
          currentServerTimeMs,
        );

        if (!autoCancelTimer.enabled || !autoCancelTimer.isExpired) {
          return null;
        }

        return expiredOrderIdsRef.current.has(order._id) ? null : order._id;
      })
      .filter(Boolean);

    if (!newlyExpiredOrderIds.length) {
      return;
    }

    newlyExpiredOrderIds.forEach((orderId) =>
      expiredOrderIdsRef.current.add(orderId),
    );

    dispatch(get_orders({ status: orderFilter, customerId: userId }));
  }, [currentServerTimeMs, dispatch, myOrders, orderFilter, userId]);

  const payNow = async (ord) => {
    if (payingOrderId) return;

    try {
      const autoCancelTimer = getOrderAutoCancelTimer(ord, currentServerTimeMs);

      if (autoCancelTimer.isExpired) {
        dispatch(get_orders({ status: orderFilter, customerId: userId }));
        return;
      }

      setPayingOrderId(ord._id);

      const { data } = await axios.post(
        `${api_url}/api/order/create-payment`,
        { orderId: ord._id },
        { withCredentials: true },
      );

      if (!data?.razorpayOrder) {
        if (data?.message === "Order already paid") {
          navigate(`/order/success/${ord._id}`);
        } else if (data?.message) {
          alert(data.message);
          dispatch(get_orders({ status: orderFilter, customerId: userId }));
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
          } catch (error) {
            setPayingOrderId("");
            console.log("verify payment error:", error.response?.data || error);
            alert(
              "Payment ho gaya, lekin verification fail hua. Please retry.",
            );
          }
        },
        modal: {
          ondismiss: function () {
            setPayingOrderId("");
          },
        },
        theme: {
          color: "#7fad39",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setPayingOrderId("");
      });
      rzp.open();
    } catch (error) {
      setPayingOrderId("");
      console.log(error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "Please try again.",
      );

      if (userId) {
        dispatch(get_orders({ status: orderFilter, customerId: userId }));
      }
    }
  };

  return (
    <div className="pt-4">
      <div
        className="bg-white rounded-2xl shadow-sm border overflow-hidden"
        style={{ borderColor: "#E4F0F5" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            {/* ===== HEADER ===== */}
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
                <th className="px-6 py-5 text-left">Date</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>

            {/* ===== BODY ===== */}
            <tbody>
              {myOrders.map((o) => {
                const product = o.products?.[0];
                const autoCancelTimer = getOrderAutoCancelTimer(
                  o,
                  currentServerTimeMs,
                );
                const isLocallyExpired =
                  autoCancelTimer.enabled && autoCancelTimer.isExpired;
                const deliveryMeta = getDeliveryStatusMeta(
                  isLocallyExpired ? "cancelled" : o.delivery_status,
                );
                const isPaid =
                  String(o.payment_status || "").trim().toLowerCase() === "paid";
                const isCancelledOrder =
                  deliveryMeta.normalized === "CANCELLED" ||
                  normalizeStatus(o.order_status) === "REJECT";
                const canPayNow =
                  !isPaid &&
                  o.payment_type !== "cod" &&
                  !isCancelledOrder &&
                  !isLocallyExpired;

                return (
                  <tr
                    key={o._id}
                    onClick={() =>
                      navigate(`/dashboard/order/details/${o._id}`)
                    }
                    className="border-b transition duration-200 hover:bg-[#FCF6E3]"
                    style={{ borderColor: "#E4F0F5" }}
                  >
                    {/* ORDER COLUMN (Image + ID + Name) */}
                    <td className="px-6 py-6">
                      <div className="flex items-start gap-4">
                        {/* IMAGE */}
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

                        {/* TEXT */}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(o._id);
                              }}
                            >
                              <FiCopy />
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

                    {/* PAYMENT */}
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

                    {/* DELIVERY */}
                    <td className="px-6 py-6">
                      <div className="flex flex-col items-start gap-2">
                        <span
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: deliveryMeta.bgColor,
                            color: deliveryMeta.color,
                          }}
                        >
                          {deliveryMeta.label}
                        </span>

                        {autoCancelTimer.enabled && !isLocallyExpired ? (
                          <span
                            className="px-3 py-2 rounded-xl text-xs font-semibold"
                            style={{
                              backgroundColor: autoCancelTimer.bgColor,
                              color: autoCancelTimer.color,
                            }}
                          >
                            {autoCancelTimer.text}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-6">
                      <span className="text-xs" style={{ color: "#A6BFCC" }}>
                        {formatDateTime(o.createdAt || o.date)}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end items-center gap-3">
                        {canPayNow && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!payingOrderId) payNow(o);
                            }}
                            disabled={payingOrderId === o._id}
                            className="w-10 h-10 flex items-center justify-center rounded-xl transition"
                            style={{
                              backgroundColor:
                                payingOrderId === o._id ? "#E4F0F5" : "#F38E16",
                              color:
                                payingOrderId === o._id ? "#A6BFCC" : "#ffffff",
                            }}
                          >
                            {payingOrderId === o._id ? "…" : <BsCreditCard />}
                          </button>
                        )}

                        <Link
                          to={`/dashboard/order/details/${o._id}`}
                          className="w-10 h-10 flex items-center justify-center rounded-xl border transition hover:bg-[#E4F0F5]"
                          style={{
                            borderColor: "#E4F0F5",
                            color: "#122C55",
                          }}
                        >
                          <AiOutlineEye />
                        </Link>
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

export default Orders;
