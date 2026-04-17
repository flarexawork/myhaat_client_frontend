import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { BsBoxSeam, BsChatDots, BsTruck } from "react-icons/bs";
import { FiExternalLink, FiMapPin, FiPhone } from "react-icons/fi";
import {
  get_order,
  cancel_customer_order,
  messageClear,
} from "../../store/reducers/orderReducer";
import {
  canCustomerCancelOrder,
  getDeliveryStatusMeta,
  getOrderStatusMeta,
  normalizeStatus,
} from "../../utils/orderStatus";
import { formatDateTime } from "../../utils/dateFormatter";
import ProductImage from "../ProductImage";

const Order = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { myOrder, errorMessage, successMessage } = useSelector(
    (state) => state.order,
  );
  const { userInfo } = useSelector((state) => state.auth);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    dispatch(get_order(orderId));
  }, [orderId, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  const deliveryMeta = getDeliveryStatusMeta(myOrder?.delivery_status);
  const orderMeta = getOrderStatusMeta(myOrder?.order_status);
  const showCancelButton = canCustomerCancelOrder(myOrder);
  const normalizedOrderStatus = normalizeStatus(myOrder?.order_status || "PENDING");
  const normalizedDeliveryStatus = normalizeStatus(
    myOrder?.delivery_status || "PENDING",
  );
  const isOrderRejected = normalizedOrderStatus === "REJECT";
  const isDeliveryCancelled = normalizedDeliveryStatus === "CANCELLED";
  const isDeliveryRejected = normalizedDeliveryStatus === "DELIVERY_REJECTED";
  const hideDeliveryTracking =
    isOrderRejected || isDeliveryCancelled || isDeliveryRejected;
  const paymentStatus = String(myOrder?.payment_status || "pending").toUpperCase();
  const paymentBadge =
    paymentStatus === "PAID"
      ? { bgColor: "#E6F4EA", color: "#2E8B57" }
      : paymentStatus === "FAILED"
        ? { bgColor: "#FDE8EA", color: "#CC4255" }
        : { bgColor: "#FFF4E5", color: "#F38E16" };

  const firstSellerId = myOrder?.products?.[0]?.sellerId;
  const deliverySteps = [
    "PENDING",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];
  const currentDeliveryIndex = Math.max(
    deliverySteps.indexOf(normalizedDeliveryStatus),
    0,
  );

  const cancelOrder = async () => {
    if (!userInfo?.id || cancelLoading) return;

    const ok = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!ok) return;

    setCancelLoading(true);
    try {
      await dispatch(
        cancel_customer_order({ orderId, customerId: userInfo.id }),
      ).unwrap();
      await dispatch(get_order(orderId));
    } catch (error) {
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <section
        className="rounded-2xl border overflow-hidden bg-white"
        style={{ borderColor: "#E4F0F5" }}
      >
        <div className="bg-gradient-to-r from-[#122C55] to-[#1E4A80] px-6 py-5 md:px-4">
          <div className="flex items-start justify-between gap-4 md-lg:flex-col">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#A6BFCC]">
                Order Details
              </p>
              <h2 className="text-white text-2xl font-bold mt-1 leading-tight break-all md:text-xl">
                #{myOrder?._id}
              </h2>
              <p className="text-[#D7E6EE] text-sm mt-1">{formatDateTime(myOrder?.date)}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: paymentBadge.bgColor,
                  color: paymentBadge.color,
                }}
              >
                PAYMENT: {paymentStatus}
              </span>
              <span
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: orderMeta.bgColor,
                  color: orderMeta.color,
                }}
              >
                ORDER: {orderMeta.label.toUpperCase()}
              </span>
              <span
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: deliveryMeta.bgColor,
                  color: deliveryMeta.color,
                }}
              >
                DELIVERY: {deliveryMeta.label.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-12 gap-5 md-lg:grid-cols-1 md:px-4">
          <div className="col-span-8 space-y-5 md-lg:col-span-1">
            <div
              className="rounded-xl border p-5 md:p-4"
              style={{ borderColor: "#E4F0F5", backgroundColor: "#FCFDFD" }}
            >
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Shipping Address
              </p>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
                <div>
                  <p className="text-base font-semibold text-[#122C55]">
                    {myOrder?.shippingInfo?.name || "-"}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    <FiMapPin className="inline-block mr-1 -mt-0.5" />
                    {myOrder?.shippingInfo?.address}, {myOrder?.shippingInfo?.area},{" "}
                    {myOrder?.shippingInfo?.city}, {myOrder?.shippingInfo?.province}{" "}
                    {myOrder?.shippingInfo?.post}
                  </p>
                </div>

                <div className="text-right md:text-left">
                  <p className="text-sm text-slate-600">
                    <FiPhone className="inline-block mr-1 -mt-0.5" />
                    {myOrder?.shippingInfo?.phone || "-"}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {userInfo?.email || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl border p-5 md:p-4"
              style={{ borderColor: "#E4F0F5", backgroundColor: "#FCFDFD" }}
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-[#122C55] text-lg font-semibold">
                  Ordered Products
                </h3>
                <span className="text-sm text-slate-500">
                  {myOrder?.products?.length || 0} item(s)
                </span>
              </div>

              <div className="space-y-3">
                {myOrder?.products?.map((p, i) => {
                  const discountedPrice =
                    p.price - Math.floor((p.price * p.discount) / 100);

                  return (
                    <div
                      key={i}
                      className="rounded-xl border p-4 bg-white"
                      style={{ borderColor: "#E4F0F5" }}
                    >
                      <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#E4F0F5] bg-white flex-shrink-0">
                          <ProductImage
                            alt={p?.name || "product"}
                            className="w-20 rounded-lg"
                            imgClassName="p-2"
                            src={p?.images?.[0]}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-[#122C55] truncate">
                            {p?.name}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            Brand: {p?.brand || "-"} | Quantity: {p?.quantity || 1}
                          </p>
                          <div className="mt-2 flex items-end gap-2">
                            <p className="text-lg font-bold text-[#122C55]">
                              ₹{discountedPrice}
                            </p>
                            {p?.discount > 0 ? (
                              <>
                                <p className="text-xs text-slate-400 line-through">
                                  ₹{p?.price}
                                </p>
                                <p className="text-xs text-green-600 font-semibold">
                                  -{p?.discount}%
                                </p>
                              </>
                            ) : null}
                          </div>
                        </div>

                        {p?.slug ? (
                          <Link
                            to={`/product/details/${p.slug}`}
                            className="ml-auto px-3 py-2 rounded-lg border text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-[#EAF4FF] transition sm:ml-0 sm:w-full"
                            style={{ borderColor: "#D5E8F3", color: "#122C55" }}
                          >
                            <BsBoxSeam /> View Product <FiExternalLink />
                          </Link>
                        ) : (
                          <span
                            className="ml-auto px-3 py-2 rounded-lg border text-sm font-medium opacity-60 cursor-not-allowed sm:ml-0 sm:w-full text-center"
                            style={{ borderColor: "#E4F0F5", color: "#6B7280" }}
                          >
                            View Product
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {!myOrder?.products?.length && (
                  <div className="rounded-xl border p-8 text-center text-slate-500 bg-white">
                    No products found in this order.
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="col-span-4 md-lg:col-span-1">
            <div className="space-y-4 sticky top-5 md-lg:static">
              <div
                className="rounded-xl border p-5 md:p-4 bg-[#FCFDFD]"
                style={{ borderColor: "#E4F0F5" }}
              >
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Payment Summary
                </p>
                <h3 className="text-3xl font-bold text-[#122C55] mt-2">
                  ₹{myOrder?.final_total || myOrder?.price}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Includes shipping after discounts
                </p>

                <div className="mt-4 border-t pt-4" style={{ borderColor: "#E4F0F5" }}>
                  {myOrder?.product_total > 0 ? (
                    <>
                      {myOrder?.subtotal > 0 && myOrder?.subtotal !== myOrder.product_total && (
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Subtotal</span>
                          <span>₹{myOrder.subtotal}</span>
                        </div>
                      )}
                      {myOrder?.discount_amount > 0 && (
                        <div className="flex justify-between text-sm text-slate-600 mt-1">
                          <span>Discount</span>
                          <span>-₹{myOrder.discount_amount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Product Total</span>
                        <span>₹{myOrder.product_total}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 mt-1">
                        <span>Shipping</span>
                        <span>₹{myOrder.shipping_fee || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold text-slate-700 mt-3 border-t pt-3" style={{ borderColor: "#E4F0F5" }}>
                        <span>Total</span>
                        <span>₹{myOrder.final_total || myOrder.price}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Items Total</span>
                        <span>₹{myOrder?.final_total || myOrder?.price}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 mt-1">
                        <span>Shipping</span>
                        <span>₹{myOrder?.shipping_fee || 0}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {showCancelButton && (
                    <button
                      onClick={cancelOrder}
                      disabled={cancelLoading}
                      className="w-full px-4 py-2.5 rounded-lg text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 font-medium"
                    >
                      {cancelLoading ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}

                  <Link
                    to={firstSellerId ? `/dashboard/chat/${firstSellerId}` : "/dashboard/chat"}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition hover:bg-[#EAF4FF]"
                    style={{ borderColor: "#D5E8F3", color: "#122C55" }}
                  >
                    <BsChatDots /> Need Help
                  </Link>
                </div>
              </div>

              <div
                className="rounded-xl border p-5 md:p-4 bg-[#FCFDFD]"
                style={{ borderColor: "#E4F0F5" }}
              >
                <h3 className="text-sm font-semibold text-[#122C55] uppercase tracking-wider mb-4">
                  Delivery Progress
                </h3>
                {hideDeliveryTracking ? (
                  <div
                    className="rounded-lg border px-4 py-3"
                    style={{ borderColor: "#F8C9CF", backgroundColor: "#FDE8EA" }}
                  >
                    <p className="text-sm font-semibold text-[#B42334]">
                      {isDeliveryRejected ? "Delivery Rejected" : "Order Cancelled"}
                    </p>
                    <p className="text-xs text-[#C3475A] mt-1">
                      {isDeliveryRejected
                        ? "Customer did not accept delivery. Tracking is now closed."
                        : "This order has been cancelled. Delivery tracking is no longer active."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {deliverySteps.map((step, index) => {
                        const isCompleted = index <= currentDeliveryIndex;
                        const isCurrent = index === currentDeliveryIndex;
                        return (
                          <div key={step} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <span
                                className="w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center"
                                style={{
                                  backgroundColor: isCompleted ? "#122C55" : "#E4F0F5",
                                  color: isCompleted ? "#FFFFFF" : "#7A94A7",
                                }}
                              >
                                {index + 1}
                              </span>
                              {index < deliverySteps.length - 1 && (
                                <span
                                  className="w-[2px] h-5 mt-1"
                                  style={{
                                    backgroundColor:
                                      index < currentDeliveryIndex ? "#122C55" : "#E4F0F5",
                                  }}
                                />
                              )}
                            </div>
                            <div className="pt-1">
                              <p
                                className="text-sm font-medium"
                                style={{ color: isCompleted ? "#122C55" : "#7A94A7" }}
                              >
                                {step.replace(/_/g, " ")}
                              </p>
                              {isCurrent && (
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Current stage
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div
                      className="mt-4 rounded-lg px-3 py-2 text-xs flex items-center gap-2"
                      style={{ backgroundColor: "#EAF4FF", color: "#1E4A80" }}
                    >
                      <BsTruck /> Status updates appear here as your order moves.
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Order;
