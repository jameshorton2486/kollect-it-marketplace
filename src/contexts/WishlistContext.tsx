"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

interface WishlistContextType {
  wishlistIds: Set<string>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchWishlist();
    } else if (status === "unauthenticated") {
      setWishlistIds(new Set());
    }
  }, [status, session]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        setWishlistIds(
          new Set(data.map((item: { productId: string }) => item.productId)),
        );
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.has(productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (!session?.user) {
      alert("Please log in to add items to your wishlist");
      return;
    }

    setLoading(true);
    const isCurrentlyInWishlist = wishlistIds.has(productId);

    try {
      const response = await fetch("/api/wishlist", {
        method: isCurrentlyInWishlist ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setWishlistIds((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyInWishlist) {
            newSet.delete(productId);
          } else {
            newSet.add(productId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
