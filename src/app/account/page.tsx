 'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, Receipt, Heart, Settings as SettingsIcon, LogOut } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    images: { url: string }[];
    category: { name: string };
    status: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
}

type Tab = 'profile' | 'orders' | 'wishlist' | 'settings';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [wishlistRes, ordersRes] = await Promise.all([
        fetch('/api/wishlist'),
        fetch('/api/orders'),
      ]);

      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        setWishlist(wishlistData);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setWishlist(wishlist.filter((item) => item.productId !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="account-page">
      {/* Header */}
      <div className="border-b border-[var(--color-gray-light)] bg-white">
        <div className="container py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-[42px] leading-tight text-brand-navy">My Account</h1>
              <p className="text-[14px] text-[var(--color-gray-dark)]">Welcome back, {session.user?.name}!</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="inline-flex items-center gap-2 rounded border border-[var(--color-gray-light)] px-3 py-2 text-[14px] text-[var(--color-gray-dark)] hover:bg-cream"
              aria-label="Sign out"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--color-gray-light)] bg-white">
        <div className="container">
          {/* Mobile select */}
          <div className="py-3 md:hidden">
            <label htmlFor="account-tab" className="sr-only">Choose section</label>
            <select
              id="account-tab"
              className="form-input w-full"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as Tab)}
            >
              <option value="profile">Profile</option>
              <option value="orders">Orders</option>
              <option value="wishlist">Wishlist</option>
              <option value="settings">Settings</option>
            </select>
          </div>
          {/* Desktop tabs */}
          <div
            className="hidden items-stretch gap-8 md:flex"
            role="tablist"
            aria-label="Account sections"
          >
            {([
              { key: 'profile', label: 'Profile', icon: User },
              { key: 'orders', label: `Orders (${orders.length})`, icon: Receipt },
              { key: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
              { key: 'settings', label: 'Settings', icon: SettingsIcon },
            ] as Array<{ key: Tab; label: string; icon: React.ComponentType<{ size?: number }> }>).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`relative -mb-px inline-flex items-center gap-2 border-b-4 px-1 py-4 text-[14px] ${
                  activeTab === key
                    ? 'border-[var(--color-muted-gold)] text-[var(--color-charcoal)]'
                    : 'border-transparent text-[var(--color-gray-dark)] hover:text-[var(--color-charcoal)]'
                }`}
                onClick={() => setActiveTab(key)}
                role="tab"
                id={`tab-${key}`}
                aria-controls={`panel-${key}`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="section-spacing">
        <div className="container">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div
              className="rounded-lg border border-[var(--color-gray-light)] bg-white p-6"
              role="tabpanel"
              id="panel-profile"
              aria-labelledby="tab-profile"
            >
              <h2 className="mb-4 font-serif text-2xl">Profile Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">Name</span>
                  <span className="font-medium">{session.user?.name || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">Email</span>
                  <span className="font-medium">{session.user?.email}</span>
                </div>
                <div className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">Phone</span>
                  <span className="font-medium">Not set</span>
                </div>
                <div className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">Account Type</span>
                  <span className="font-medium">{((session.user as { role?: string } | undefined)?.role === 'admin') ? 'Administrator' : 'Customer'}</span>
                </div>
                <div className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">Default Shipping</span>
                  <span className="font-medium">Not set</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="btn-primary">Edit Profile</button>
                <button className="inline-flex items-center justify-center rounded border border-[var(--color-gray-light)] px-4 py-2 text-[14px] text-[var(--color-charcoal)] hover:bg-cream">Change Password</button>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div
              className="rounded-lg border border-[var(--color-gray-light)] bg-white p-6"
              role="tabpanel"
              id="panel-orders"
              aria-labelledby="tab-orders"
            >
              <h2 className="mb-4 font-serif text-2xl">Order History</h2>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded border border-[var(--color-gray-light)] bg-cream p-8 text-center">
                  <Receipt className="text-[var(--color-gray-dark)]" size={48} />
                  <h3 className="font-serif text-xl">No Orders Yet</h3>
                  <p className="text-[var(--color-gray-dark)]">You haven't placed any orders yet.</p>
                  <Link href="/" className="btn-primary">Start Shopping</Link>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-gray-light)]">
                  {orders.map((order) => {
                    const statusClass =
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : order.status === 'processing' || order.status === 'paid'
                        ? 'bg-[rgba(199,168,94,0.15)] text-[var(--color-charcoal)]'
                        : 'bg-gray-100 text-gray-800';
                    return (
                      <div key={order.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col">
                          <Link href={`/account/orders/${order.id}`} className="font-medium underline">Order #{order.orderNumber}</Link>
                          <span className="text-[12px] text-[var(--color-gray-dark)]">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
                          <span className="text-[14px] text-[var(--color-gray-dark)]">Items: {order.items?.length ?? 0}</span>
                          <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] ${statusClass}`}>{order.status}</span>
                          <span className="font-semibold">Total: ${order.total.toLocaleString()}</span>
                          <Link href={`/account/orders/${order.id}`} className="underline">View Details</Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div
              className="rounded-lg border border-[var(--color-gray-light)] bg-white p-6"
              role="tabpanel"
              id="panel-wishlist"
              aria-labelledby="tab-wishlist"
            >
              <h2 className="mb-4 font-serif text-2xl">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded border border-[var(--color-gray-light)] bg-cream p-8 text-center">
                  <Heart className="text-[var(--color-gray-dark)]" size={48} />
                  <h3 className="font-serif text-xl">No Wishlist Items</h3>
                  <p className="text-[var(--color-gray-dark)]">Save items you love to your wishlist.</p>
                  <Link href="/" className="btn-primary">Browse Products</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {wishlist.map((item) => (
                    <div key={item.id} className="group rounded-lg border border-[var(--color-gray-light)] bg-white p-3">
                      <Link href={`/product/${item.product.slug}`} className="block overflow-hidden rounded">
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.title}
                            width={400}
                            height={400}
                            className="h-auto w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-[200px] items-center justify-center bg-cream text-[var(--color-gray-dark)]">No Image</div>
                        )}
                      </Link>
                      <div className="mt-3 flex flex-col gap-1">
                        <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">{item.product.category.name}</span>
                        <Link href={`/product/${item.product.slug}`} className="font-medium hover:text-[var(--color-muted-gold)]">
                          {item.product.title}
                        </Link>
                        <span className="text-brand-gold font-semibold">${item.product.price.toLocaleString()}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <button
                          onClick={() => removeFromWishlist(item.productId)}
                          className="inline-flex items-center gap-2 rounded border border-[var(--color-gray-light)] px-3 py-2 text-[14px] hover:bg-cream"
                          aria-label="Remove from wishlist"
                        >
                          <Heart size={16} />
                          Remove
                        </button>
                        <AddToCartButton
                          product={{
                            id: item.product.id,
                            title: item.product.title,
                            price: item.product.price,
                            slug: item.product.slug,
                            image: item.product.images[0]?.url || '/placeholder.jpg',
                            categoryName: item.product.category.name,
                          }}
                          quantity={1}
                          className="btn-cta"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div
              className="rounded-lg border border-[var(--color-gray-light)] bg-white p-6"
              role="tabpanel"
              id="panel-settings"
              aria-labelledby="tab-settings"
            >
              <h2 className="mb-4 font-serif text-2xl">Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <div>
                    <span className="block font-medium">Email Notifications</span>
                    <span className="text-[13px] text-[var(--color-gray-dark)]">Order updates and account alerts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    aria-label="Toggle email notifications"
                    className="h-5 w-5"
                  />
                </label>

                <label className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <div>
                    <span className="block font-medium">Newsletter Subscription</span>
                    <span className="text-[13px] text-[var(--color-gray-dark)]">Occasional stories and arrivals</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newsletterSubscribed}
                    onChange={(e) => setNewsletterSubscribed(e.target.checked)}
                    aria-label="Toggle newsletter subscription"
                    className="h-5 w-5"
                  />
                </label>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        alert('Account deletion request submitted.');
                      }
                    }}
                    className="text-[14px] text-red-600 underline"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
