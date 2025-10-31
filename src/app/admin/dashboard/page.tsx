"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  Package,
  CheckCircle2,
  ShoppingBag,
  DollarSign,
  Plus,
  Settings,
  Users,
  Home,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  category: { name: string };
  images: { url: string }[];
  status: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  status: string;
  total: number;
  paymentStatus: string;
  createdAt: string;
  items: { id: string; quantity: number }[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "sold" | "draft"
  >("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Derived data
  const monthlyRevenueStr = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const revenue = orders
      .filter(
        (o) => o.paymentStatus === "paid" && new Date(o.createdAt) >= start,
      )
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return revenue.toLocaleString("en-US", { minimumFractionDigits: 2 });
  }, [orders]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = q
        ? p.title.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
        : true;
      const matchesStatus =
        statusFilter === "all" ? true : p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  const hasNoNextPage = useMemo(
    () => page * pageSize >= filteredProducts.length,
    [filteredProducts, page],
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchProducts();
      fetchCategories();
      fetchOrders();
    }
  }, [session]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-2">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-ink">
                Kollect-It Admin Dashboard
              </h1>
              <p className="text-sm text-ink-secondary mt-1">
                Welcome back, {session.user.name || session.user.email}
              </p>
              <p className="text-xs text-ink-muted">
                {new Date().toLocaleString()}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/admin/orders")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Manage Orders
              </button>
              <button
                onClick={() => window.open("/", "_blank")}
                className="px-4 py-2 text-ink-secondary hover:text-ink transition"
              >
                View Site
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Package className="text-ink" size={20} />}
            label="Total Products"
            value={products.length.toString()}
          />
          <StatCard
            icon={<CheckCircle2 className="text-green-700" size={20} />}
            label="Active Products"
            value={products
              .filter((p) => p.status === "active")
              .length.toString()}
            highlight="green"
          />
          <StatCard
            icon={<ShoppingBag className="text-indigo-700" size={20} />}
            label="Total Orders"
            value={orders.length.toString()}
          />
          <StatCard
            icon={<DollarSign className="text-emerald-700" size={20} />}
            label="Revenue (This Month)"
            value={`$${monthlyRevenueStr}`}
          />
        </div>

        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
          >
            <Plus size={18} /> {showAddForm ? "Cancel" : "Add New Product"}
          </button>
          <button
            onClick={() => router.push("/admin/orders")}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border-neutral rounded-lg hover:bg-surface-2"
          >
            <ShoppingBag size={18} /> Manage Orders
          </button>
          <button
            onClick={() => router.push("/admin/customers")}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border-neutral rounded-lg hover:bg-surface-2"
          >
            <Users size={18} /> View Customers
          </button>
          <button
            onClick={() => router.push("/admin/settings")}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border-neutral rounded-lg hover:bg-surface-2"
          >
            <Settings size={18} /> Settings
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <ProductForm
            categories={categories}
            onSuccess={() => {
              fetchProducts();
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold">Products</h2>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products..."
                className="w-64 max-w-full px-3 py-2 border border-border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-cta-ring focus:border-cta"
                aria-label="Search products"
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as typeof statusFilter);
                  setPage(1);
                }}
                className="px-3 py-2 border border-border-neutral rounded-md"
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-2">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-ink-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border-neutral">
                {pagedProducts.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-surface-2">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.images[0] && (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="w-12 h-12 rounded object-cover mr-3"
                          />
                        )}
                        <div className="text-sm font-medium text-ink max-w-md truncate">
                          {product.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-ink">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-ink">
                        ${product.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : product.status === "sold"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t text-sm">
            <div>Page {page}</div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={hasNoNextPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <button
              onClick={() => router.push("/admin/orders")}
              className="text-sm text-blue-600 hover:underline"
            >
              View All Orders
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-2">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border-neutral">
                {orders.slice(0, 10).map((order: Order) => {
                  const statusClass =
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : order.status === "processing" ||
                            order.status === "paid"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-surface-1 text-ink";
                  return (
                    <tr key={order.id} className="hover:bg-surface-2">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-secondary">
                        {order.customerName || "Guest"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        ${(order.total || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: "green" | "blue" | "amber" | "purple" | "emerald";
}) {
  const color =
    highlight === "green"
      ? "text-green-600"
      : highlight === "blue"
        ? "text-blue-600"
        : highlight === "amber"
          ? "text-amber-700"
          : highlight === "emerald"
            ? "text-emerald-700"
            : "text-ink";
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 text-sm font-medium text-ink-secondary">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

interface ImageData {
  url: string;
  publicId?: string;
  alt?: string;
}

function ProductForm({
  categories,
  onSuccess,
  onCancel,
}: {
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: categories[0]?.id || "",
    condition: "Fine",
    year: "",
    artist: "",
    medium: "",
    period: "",
    featured: false,
  });
  const [images, setImages] = useState<ImageData[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: images.map((img, index) => ({
            url: img.url,
            alt: img.alt || formData.title,
            order: index,
          })),
        }),
      });

      if (res.ok) {
        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          categoryId: categories[0]?.id || "",
          condition: "Fine",
          year: "",
          artist: "",
          medium: "",
          period: "",
          featured: false,
        });
        setImages([]);
        onSuccess();
      } else {
        alert("Error creating product. Please try again.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-ink-secondary mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:ring-2 focus:ring-cta-ring focus:border-cta"
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-ink-secondary mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:ring-2 focus:ring-cta-ring focus:border-cta"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-ink-secondary mb-2"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            required
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:ring-2 focus:ring-cta-ring focus:border-cta"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-ink-secondary mb-2"
          >
            Category
          </label>
          <select
            id="category"
            required
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:ring-2 focus:ring-cta-ring focus:border-cta"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-ink-secondary mb-2"
          >
            Condition
          </label>
          <select
            id="condition"
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
            className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:ring-2 focus:ring-cta-ring focus:border-cta"
          >
            <option>Fine</option>
            <option>Very Good</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-ink-secondary mb-2"
          >
            Year
          </label>
          <input
            type="text"
            id="year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:ring-2 focus:ring-cta-ring focus:border-cta"
            placeholder="e.g., 1920, c. 1850, 19th Century"
          />
        </div>

        <div>
          <label
            htmlFor="artist"
            className="block text-sm font-medium text-ink-secondary mb-2"
          >
            Artist/Maker
          </label>
          <input
            type="text"
            id="artist"
            value={formData.artist}
            onChange={(e) =>
              setFormData({ ...formData, artist: e.target.value })
            }
            className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:ring-2 focus:ring-cta-ring focus:border-cta"
            placeholder="e.g., John Smith, Unknown"
          />
        </div>

        <div>
          <label
            htmlFor="medium"
            className="block text-sm font-medium text-ink-secondary mb-2"
          >
            Medium/Material
          </label>
          <input
            type="text"
            id="medium"
            value={formData.medium}
            onChange={(e) =>
              setFormData({ ...formData, medium: e.target.value })
            }
            className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:ring-2 focus:ring-cta-ring focus:border-cta"
            placeholder="e.g., Oil on Canvas, Sterling Silver"
          />
        </div>

        <div>
          <label
            htmlFor="period"
            className="block text-sm font-medium text-ink-secondary mb-2"
          >
            Period/Era
          </label>
          <input
            type="text"
            id="period"
            value={formData.period}
            onChange={(e) =>
              setFormData({ ...formData, period: e.target.value })
            }
            className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:ring-2 focus:ring-cta-ring focus:border-cta"
            placeholder="e.g., Victorian, Art Deco, WWII"
          />
        </div>

        <div
          className="col-span-2"
          role="group"
          aria-labelledby="product-images-label"
        >
          <div
            id="product-images-label"
            className="block text-sm font-medium text-ink-secondary mb-2"
          >
            Product Images
          </div>
          <ImageUpload images={images} onChange={setImages} maxImages={8} />
        </div>

        <div className="col-span-2 flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="w-4 h-4 text-amber-600 border-border-neutral rounded focus:ring-cta-ring"
          />
          <label htmlFor="featured" className="ml-2 text-sm text-ink-secondary">
            Feature this product on homepage
          </label>
        </div>

        <div className="col-span-2 flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-surface-2 text-ink-secondary rounded-lg hover:bg-surface-3 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
