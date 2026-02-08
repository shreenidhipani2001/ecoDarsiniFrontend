'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../user/SideBar';
import { useAuthStore } from '../../store/useAuthStore';
import WishlistModal from '../../components/WishlistModal';
import CartModal from '../../components/CartModal';
import ProfileModal from '../../components/ProfileModal';
import TrackOrderModal from '../../components/TrackOrderModal';
import RoleGuard from '../../components/RoleGuard';
import { getCart } from '../../../lib/cartApi';
import { getWishlist } from '../../../lib/wishlistApi';
import { attachImagesToProductsFrontend } from '../../../lib/imageResolver';
import toast from 'react-hot-toast';
import OrdersModal from '../../components/OrdersModal';

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

type ProductImage = {
  id: string;
  url: string;
  thumbnail: string | null;
  card: string | null;
  full: string | null;
  alt: string;
};

export type Product = {
  id: string;
  name: string;
  price: number | string;
  cms_image_ids: string[];
  images?: ProductImage[];
  slug: string;
  description?: string;
  stock: number;
  category_id: string;
  category_name?: string;
  artist_name?: string;
  is_active: boolean;
  created_at?: string;
};

export type CartItem = {
  id: string;
  quantity: number;
  product_id: string;
  name: string;
  price: string;
  total_price: string;
  cms_image_ids?: string[];
  images?: ProductImage[];
  slug: string;
  created_at: string;
  image?: string;
};

export type WishlistItem = {
  id: number;
  user_id: string;
  product_id: string;
  name: string;
  price: number;
  cms_image_ids: string[];
  slug?: string;
  image?: string;
};

const PRODUCTS_PER_PAGE = 10;

export default function DashboardPage() {
  // const [activeSection, setActiveSection] = useState<'profile' | 'cart' | 'wishlist' | 'track'>('cart');
  const [activeSection, setActiveSection] =
  useState<'profile' | 'cart' | 'wishlist' | 'track' | 'orders'>('cart');

  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Products cache - stores fetched products with images
  const [productsCache, setProductsCache] = useState<Map<string, Product>>(new Map());

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartProductsLoading, setCartProductsLoading] = useState(false);

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistProductsLoading, setWishlistProductsLoading] = useState(false);

  const userId = (user as any)?.user?.id || user?.id;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const dummyUser = {
    id: userId,
    name: (user as any)?.user?.name || (user as any)?.name || 'User',
    email: user?.email || '',
    role: user?.role,
    phone: (user as any)?.user?.phone || (user as any)?.phone || '',
  };

  // ────────────────────────────────────────────────
  // Fetch products by IDs (with pagination)
  // ────────────────────────────────────────────────

  const fetchProductsByIds = useCallback(async (
    productIds: string[],
    page: number = 1
  ): Promise<Product[]> => {
    if (!apiUrl || productIds.length === 0) return [];

    try {
      const res = await fetch(`${apiUrl}/api/products/by-ids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: productIds,
          page,
          limit: PRODUCTS_PER_PAGE,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const raw = data.products || [];
      const resolved = await attachImagesToProductsFrontend(raw);
      return resolved as Product[];
    } catch (err) {
      console.error('Failed to fetch products by IDs:', err);
      return [];
    }
  }, [apiUrl]);

  // ────────────────────────────────────────────────
  // Cart fetching
  // ────────────────────────────────────────────────

  const fetchCartItems = useCallback(async () => {
    if (!userId) return;
    setCartLoading(true);
    try {
      const data = await getCart(userId);
      console.log('Fetched cart items:', data);
      setCartItems(data || []);

      // Fetch first page of products with images
      if (data && data.length > 0) {
        setCartProductsLoading(true);
        const productIds = data.map((item: CartItem) => item.product_id);
        const fetchedProducts = await fetchProductsByIds(productIds, 1);

        // Update cache
        setProductsCache(prev => {
          const newCache = new Map(prev);
          fetchedProducts.forEach(p => newCache.set(p.id, p));
          return newCache;
        });
        setCartProductsLoading(false);
      }
    } catch (err) {
      console.log('Failed to fetch cart items:', err);
      toast.error('Failed to load cart');
    } finally {
      setCartLoading(false);
    }
  }, [userId, fetchProductsByIds]);

  // ────────────────────────────────────────────────
  // Wishlist fetching
  // ────────────────────────────────────────────────

  const fetchWishlistItems = useCallback(async () => {
    if (!userId) return;
    setWishlistLoading(true);
    try {
      const data = await getWishlist(userId);
      setWishlistItems(data || []);

      // Fetch first page of products with images
      if (data && data.length > 0) {
        setWishlistProductsLoading(true);
        const productIds = data.map((item: WishlistItem) => item.product_id);
        const fetchedProducts = await fetchProductsByIds(productIds, 1);

        // Update cache
        setProductsCache(prev => {
          const newCache = new Map(prev);
          fetchedProducts.forEach(p => newCache.set(p.id, p));
          return newCache;
        });
        setWishlistProductsLoading(false);
      }
    } catch (err) {
      console.log('Failed to fetch wishlist:', err);
      toast.error('Failed to load wishlist');
    } finally {
      setWishlistLoading(false);
    }
  }, [userId, fetchProductsByIds]);

  // ────────────────────────────────────────────────
  // Lazy load next page of products when needed
  // ────────────────────────────────────────────────

  const fetchNextPageIfNeeded = useCallback(async (
    items: { product_id: string }[],
    currentIndex: number,
    type: 'cart' | 'wishlist'
  ) => {
    const pageNeeded = Math.floor(currentIndex / PRODUCTS_PER_PAGE) + 1;

    // Check if product for current index is already cached
    const currentProductId = items[currentIndex]?.product_id;
    if (currentProductId && productsCache.has(currentProductId)) {
      return; // Already have this product
    }

    // Need to fetch this page
    if (type === 'cart') {
      setCartProductsLoading(true);
    } else {
      setWishlistProductsLoading(true);
    }

    const productIds = items.map(item => item.product_id);
    const products = await fetchProductsByIds(productIds, pageNeeded);

    setProductsCache(prev => {
      const newCache = new Map(prev);
      products.forEach(p => newCache.set(p.id, p));
      return newCache;
    });

    if (type === 'cart') {
      setCartProductsLoading(false);
    } else {
      setWishlistProductsLoading(false);
    }
  }, [productsCache, fetchProductsByIds]);

  // ────────────────────────────────────────────────
  // Handle index changes from modals
  // ────────────────────────────────────────────────

  const handleCartIndexChange = useCallback((newIndex: number) => {
    fetchNextPageIfNeeded(cartItems, newIndex, 'cart');
  }, [cartItems, fetchNextPageIfNeeded]);

  const handleWishlistIndexChange = useCallback((newIndex: number) => {
    fetchNextPageIfNeeded(wishlistItems, newIndex, 'wishlist');
  }, [wishlistItems, fetchNextPageIfNeeded]);

  // Convert cache to array for components
  const products = Array.from(productsCache.values());

  // Load data when corresponding section is active
  useEffect(() => {
    if (activeSection === 'cart' && userId) {
      fetchCartItems();
    }
    if (activeSection === 'wishlist' && userId) {
      fetchWishlistItems();
    }
  }, [activeSection, userId, fetchCartItems, fetchWishlistItems]);

  // ────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────

  const handleCartItemRemoved = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleWishlistItemRemoved = (itemId: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // ────────────────────────────────────────────────
  // Get section title
  // ────────────────────────────────────────────────

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'cart':
        return 'My Cart';
      case 'wishlist':
        return 'My Wishlist';
      case 'profile':
        return 'My Profile';
      case 'track':
        return 'Track My Orders';
      case 'orders':
        return 'My Orders';
      default:
        return 'Dashboard';
    }
  };

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────

  return (
    <RoleGuard allowedRole="USER">
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenModal={setActiveSection}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{getSectionTitle()}</h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 bg-green-400 rounded-md hover:bg-green-700 text-black font-semibold"
            >
              {isSidebarOpen ? 'Close' : 'Menu'}
            </button>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {activeSection === 'profile' && (
              <ProfileModal
                user={dummyUser}
                onClose={() => {}}
                inline
              />
            )}

            {activeSection === 'cart' && (
              <CartModal
                items={cartItems}
                products={products}
                loading={cartLoading || cartProductsLoading}
                onClose={() => {}}
                onItemRemoved={handleCartItemRemoved}
                onIndexChange={handleCartIndexChange}
                inline
              />
            )}

              {activeSection === 'orders' && userId && (
                <OrdersModal userId={userId} inline />
              )}

            {activeSection === 'wishlist' && (
              <WishlistModal
                items={wishlistItems}
                products={products}
                loading={wishlistLoading || wishlistProductsLoading}
                onClose={() => {}}
                onItemRemoved={handleWishlistItemRemoved}
                fetchCartItems={fetchCartItems}
                fetchWishlistItems={fetchWishlistItems}
                onIndexChange={handleWishlistIndexChange}
                inline
              />
            )}

            {activeSection === 'track' && userId && (
              <TrackOrderModal
                userId={userId}
                onClose={() => {}}
                inline
              />
            )}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}