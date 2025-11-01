"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  product: {
    slug: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  paymentStatus: string;
  paymentMethod: string | null;
  trackingNumber: string | null;
  shippingLabelUrl: string | null;
  carrier: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    trackingNumber: "",
    shippingLabelUrl: "",
    carrier: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setFormData({
          status: data.status,
          trackingNumber: data.trackingNumber || "",
          shippingLabelUrl: data.shippingLabelUrl || "",
          carrier: data.carrier || "",
        });
      } else {
        setError("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchOrder();
    }
  }, [status, session, fetchOrder]);

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setSuccess(data.message);
        setEditMode(false);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update order");
      }
    } catch (err) {
      setError("An error occurred while updating the order");
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  if (error && !order) {
    return (
      <div className="admin-page">
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-serif mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/admin/orders" className="btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-800";
      case "processing":
        return "bg-blue-800";
      case "shipped":
        return "bg-indigo-700";
      case "delivered":
        return "bg-emerald-700";
      case "cancelled":
        return "bg-red-800";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusTextClass = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-800";
      case "processing":
        return "text-blue-800";
      case "shipped":
        return "text-indigo-700";
      case "delivered":
        return "text-emerald-700";
      case "cancelled":
        return "text-red-800";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="admin-title">Order #{order.orderNumber}</h1>
                <span
                  className={`status-badge ${getStatusClass(order.status)} text-white px-3 py-1`}
                >
                  {order.status}
                </span>
              </div>
              <p className="admin-subtitle">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <Link href="/admin/orders" className="btn-secondary">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Orders
            </Link>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          {/* Messages */}
          {error && (
            <div className="admin-alert-error">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="admin-alert-success">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {success}
            </div>
          )}

          <div className="admin-order-layout">
            {/* Left Column - Order Details */}
            <div className="admin-order-main">
              {/* Order Items */}
              <div className="admin-order-section">
                <h2 className="admin-section-title">Order Items</h2>
                <div className="order-items-list">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item-row">
                      <div className="order-item-info">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="order-item-title"
                        >
                          {item.title}
                        </Link>
                        <p className="order-item-meta">
                          ${item.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <div className="order-item-total">
                        $
                        {(item.price * item.quantity).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-totals">
                  <div className="order-total-row">
                    <span>Subtotal:</span>
                    <span>
                      $
                      {order.subtotal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="order-total-row">
                    <span>Shipping:</span>
                    <span>
                      {order.shipping === 0
                        ? "Free"
                        : `$${order.shipping.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>
                  <div className="order-total-row">
                    <span>Tax:</span>
                    <span>
                      $
                      {order.tax.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="order-total-row order-total-final">
                    <span>Total:</span>
                    <span>
                      $
                      {order.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Tracking */}
              <div className="admin-order-section">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="admin-section-title">Status & Tracking</h2>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="btn-secondary"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form
                    onSubmit={handleUpdateOrder}
                    className="order-edit-form"
                  >
                    <div className="form-group">
                      <label className="form-label" htmlFor="order-status">
                        Order Status *
                      </label>
                      <select
                        id="order-status"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="form-input"
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="carrier">
                        Carrier
                      </label>
                      <select
                        id="carrier"
                        value={formData.carrier}
                        onChange={(e) =>
                          setFormData({ ...formData, carrier: e.target.value })
                        }
                        className="form-input"
                      >
                        <option value="">Select Carrier</option>
                        <option value="USPS">USPS</option>
                        <option value="UPS">UPS</option>
                        <option value="FedEx">FedEx</option>
                        <option value="DHL">DHL</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="tracking-number">
                        Tracking Number
                      </label>
                      <input
                        id="tracking-number"
                        type="text"
                        value={formData.trackingNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            trackingNumber: e.target.value,
                          })
                        }
                        className="form-input"
                        placeholder="Enter tracking number"
                      />
                    </div>

                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="shipping-label-url"
                      >
                        Shipping Label URL
                      </label>
                      <input
                        id="shipping-label-url"
                        type="url"
                        value={formData.shippingLabelUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingLabelUrl: e.target.value,
                          })
                        }
                        className="form-input"
                        placeholder="https://example.com/label.pdf"
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="submit"
                        disabled={updating}
                        className="btn-primary"
                      >
                        {updating ? "Updating..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setFormData({
                            status: order.status,
                            trackingNumber: order.trackingNumber || "",
                            shippingLabelUrl: order.shippingLabelUrl || "",
                            carrier: order.carrier || "",
                          });
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="order-tracking-info">
                    <div className="tracking-info-row">
                      <span className="tracking-label">Status:</span>
                      <span
                        className={`tracking-value font-semibold ${getStatusTextClass(order.status)}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    {order.carrier && (
                      <div className="tracking-info-row">
                        <span className="tracking-label">Carrier:</span>
                        <span className="tracking-value">{order.carrier}</span>
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div className="tracking-info-row">
                        <span className="tracking-label">Tracking Number:</span>
                        <span className="tracking-value">
                          {order.trackingNumber}
                        </span>
                      </div>
                    )}
                    {order.shippingLabelUrl && (
                      <div className="tracking-info-row">
                        <span className="tracking-label">Shipping Label:</span>
                        <a
                          href={order.shippingLabelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tracking-link"
                        >
                          Download Label
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      </div>
                    )}
                    {!order.carrier &&
                      !order.trackingNumber &&
                      !order.shippingLabelUrl && (
                        <p className="tracking-empty">
                          No tracking information available yet.
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Customer & Shipping Info */}
            <div className="admin-order-sidebar">
              {/* Customer Info */}
              <div className="admin-order-section">
                <h2 className="admin-section-title">Customer Information</h2>
                <div className="customer-details">
                  <div className="customer-detail-row">
                    <span className="customer-label">Name:</span>
                    <span className="customer-value">
                      {order.customerName || "Guest"}
                    </span>
                  </div>
                  <div className="customer-detail-row">
                    <span className="customer-label">Email:</span>
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="customer-value customer-link"
                    >
                      {order.customerEmail}
                    </a>
                  </div>
                  {order.customerPhone && (
                    <div className="customer-detail-row">
                      <span className="customer-label">Phone:</span>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="customer-value customer-link"
                      >
                        {order.customerPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="admin-order-section">
                <h2 className="admin-section-title">Shipping Address</h2>
                <div className="shipping-address">
                  <p>{order.shippingAddress}</p>
                  <p>
                    {order.shippingCity}, {order.shippingState}{" "}
                    {order.shippingZip}
                  </p>
                  <p>{order.shippingCountry}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="admin-order-section">
                <h2 className="admin-section-title">Payment Information</h2>
                <div className="payment-details">
                  <div className="payment-detail-row">
                    <span className="payment-label">Status:</span>
                    <span
                      className={`payment-badge ${
                        order.paymentStatus === "paid"
                          ? "payment-paid"
                          : order.paymentStatus === "failed"
                            ? "payment-failed"
                            : "payment-pending"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  {order.paymentMethod && (
                    <div className="payment-detail-row">
                      <span className="payment-label">Method:</span>
                      <span className="payment-value">Stripe</span>
                    </div>
                  )}
                  <div className="payment-detail-row">
                    <span className="payment-label">Amount:</span>
                    <span className="payment-value payment-amount">
                      $
                      {order.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
