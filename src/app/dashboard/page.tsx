// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import Sidebar from '../user/SideBar';
// import BookFlip from '../admin/ProductsCatalogue';
// import { useAuthStore } from '../../store/useAuthStore';
// import WishlistModal from '../../components/WishlistModal';
// import CartModal from '../../components/CartModal';
// import ProfileModal from '../../components/ProfileModal';
// import RoleGuard from '../../components/RoleGuard';
// import { getCart } from '../../../lib/cartApi';
// import toast from 'react-hot-toast';

// // Image type from Payload CMS (same as BookFlip)
// type ProductImage = {
//   id: string;
//   url: string;
//   thumbnail: string | null;
//   card: string | null;
//   full: string | null;
//   alt: string;
// };

// export type CartItem = {
//   id: string;
//   quantity: number;
//   product_id: string;
//   name: string;
//   price: string;
//   total_price: string;
//   cms_image_ids?: string[];
//   images?: ProductImage[];  // Images from Payload CMS
//   slug: string;
//   created_at: string;
//   image?: string;
// };

// // Get image URL from cart item (same pattern as BookFlip's getProductImageUrl)
// function getCartItemImageUrl(item: CartItem, size: 'thumbnail' | 'card' | 'full' | 'url' = 'card'): string {
//   // First try to get from images array (Payload CMS)
  
//   if (item.images && item.images.length > 0) {
//     const image = item.images[0];
//     return image[size] || image.url || '/placeholder.png';
//   }
//   return '/placeholder.png';
// }

// export default function DashboardPage() {
//   const [activeModal, setActiveModal] = useState<'profile' | 'cart' | 'wishlist' | null>(null);
//   const { user } = useAuthStore();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   // Cart state
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [cartLoading, setCartLoading] = useState(false);

//   const userId = (user as any)?.user?.id || user?.id;

//   const dummyUser = {
//     id: userId,
//     name: (user as any)?.user?.name || (user as any)?.name,
//     email: user?.email,
//     role: user?.role,
//     phone: (user as any)?.user?.phone || (user as any)?.phone,
//   };

//   // Fetch cart items
//   const fetchCartItems = useCallback(async () => {
//     if (!userId) return;

//     setCartLoading(true);
//     try {
//       const data = await getCart(userId);
//       console.log('Fetched cart items:', data);
//       const mappedItems = data?.map((item: any) => ({
//         ...item,
//         image: getCartItemImageUrl(item, 'card'),
//       })) || [];
//       setCartItems(mappedItems);
//     } catch (err) {
//       console.log('Failed to fetch cart items:', err);
//       toast.error('Failed to load cart items');
//     } finally {
//       setCartLoading(false);
//     }
//   }, [userId]);

//   // Fetch cart when modal opens
//   useEffect(() => {
//     if (activeModal === 'cart' && userId) {
//       fetchCartItems();
//     }
//   }, [activeModal, userId, fetchCartItems]);

//   // Handle cart item removal (update local state)
//   const handleCartItemRemoved = (itemId: string) => {
//     setCartItems(prev => prev.filter(item => item.id !== itemId));
//   };

//   return (
//     <RoleGuard allowedRole="USER">
//       <div className="flex h-screen bg-gray-50">
//         <Sidebar
//           isOpen={isSidebarOpen}
//           onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
//           onOpenModal={setActiveModal}
//         />

//         <div className="flex-1 flex flex-col overflow-hidden">
//           <header className="bg-white shadow-sm p-4 flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-gray-800">Product Catalogue</h1>
//             <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="lg:hidden p-2 bg-green-400 rounded-md hover:bg-green-700 text-black font-semibold"
//             >
//               {isSidebarOpen ? 'Close' : 'Menu'}
//             </button>
//           </header>

//           <main className="flex-1 overflow-hidden">
//             <BookFlip />
//           </main>
//         </div>

//         {activeModal === 'profile' && (
//           <ProfileModal user={dummyUser} onClose={() => setActiveModal(null)} />
//         )}

//         {activeModal === 'cart' && (
//           <CartModal
//             items={cartItems}
//             loading={cartLoading}
//             onClose={() => setActiveModal(null)}
//             onItemRemoved={handleCartItemRemoved}
//           />
//         )}

//         {activeModal === 'wishlist' && (
//           <WishlistModal onClose={() => setActiveModal(null)} />
//         )}
//       </div>
//     </RoleGuard>
//   );
// }


'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../user/SideBar';
import BookFlip from '../admin/ProductsCatalogue';
import { useAuthStore } from '../../store/useAuthStore';
import WishlistModal from '../../components/WishlistModal';
import CartModal from '../../components/CartModal';
import ProfileModal from '../../components/ProfileModal';
import RoleGuard from '../../components/RoleGuard';
import { getCart } from '../../../lib/cartApi';
import { getWishlist } from '../../../lib/wishlistApi';
import toast from 'react-hot-toast';

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

// ────────────────────────────────────────────────
// Cloudinary helper (you can also move this to lib/cloudinary.ts)
// ────────────────────────────────────────────────

function getCloudinaryUrl(
  publicId: string,
  options = 'w_600,h_600,c_fill,q_auto,f_auto'
): string {
  if (!publicId) return '/placeholder.png';
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  if (!cloudName) return '/placeholder.png';
  return `/placeholder.png`;
  // return `https://res.cloudinary.com/${cloudName}/image/upload/${options}/${publicId}.webp`;
}

function getCartItemImageUrl(item: CartItem, size: 'thumbnail' | 'card' | 'full' | 'url' = 'card'): string {
  if (item.images && item.images.length > 0) {
    const image = item.images[0];
    return image[size] || image.url || '/placeholder.png';
  }
  if (item.cms_image_ids && item.cms_image_ids.length > 0) {
    return getCloudinaryUrl(item.cms_image_ids[0]);
  }
  return '/placeholder.png';
}

export default function DashboardPage() {
  const [activeModal, setActiveModal] = useState<'profile' | 'cart' | 'wishlist' | null>(null);
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const userId = (user as any)?.user?.id || user?.id;

  const dummyUser = {
    id: userId,
    name: (user as any)?.user?.name || (user as any)?.name || 'User',
    email: user?.email || '',
    role: user?.role,
    phone: (user as any)?.user?.phone || (user as any)?.phone || '',
  };

  // ────────────────────────────────────────────────
  // Cart fetching
  // ────────────────────────────────────────────────

  const fetchCartItems = useCallback(async () => {
    if (!userId) return;
    setCartLoading(true);
    try {
      const data = await getCart(userId);
      const mappedItems = (data || []).map((item: any) => ({
        ...item,
        image: getCartItemImageUrl(item, 'card'),
      }));
      setCartItems(mappedItems);
    } catch (err) {
      console.error('Failed to fetch cart items:', err);
      toast.error('Failed to load cart');
    } finally {
      setCartLoading(false);
    }
  }, [userId]);

  // ────────────────────────────────────────────────
  // Wishlist fetching
  // ────────────────────────────────────────────────

  const fetchWishlistItems = useCallback(async () => {
    if (!userId) return;
    setWishlistLoading(true);
    try {
      const data = await getWishlist(userId);
      const mapped = (data || []).map((item: any) => ({
        ...item,
        image: item.cms_image_ids?.[0]
          ? getCloudinaryUrl(item.cms_image_ids[0])
          : '/placeholder.png',
      }));
      setWishlistItems(mapped);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
      toast.error('Failed to load wishlist');
    } finally {
      setWishlistLoading(false);
    }
  }, [userId]);

  // Load data when corresponding modal opens
  useEffect(() => {
    if (activeModal === 'cart' && userId) {
      fetchCartItems();
    }
    if (activeModal === 'wishlist' && userId) {
      fetchWishlistItems();
    }
  }, [activeModal, userId, fetchCartItems, fetchWishlistItems]);

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
  // Render
  // ────────────────────────────────────────────────

  return (
    <RoleGuard allowedRole="USER">
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenModal={setActiveModal}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Product Catalogue</h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 bg-green-400 rounded-md hover:bg-green-700 text-black font-semibold"
            >
              {isSidebarOpen ? 'Close' : 'Menu'}
            </button>
          </header>

          <main className="flex-1 overflow-hidden">
            <BookFlip />
          </main>
        </div>

        {/* Modals */}
        {activeModal === 'profile' && (
          <ProfileModal user={dummyUser} onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'cart' && (
          <CartModal
            items={cartItems}
            loading={cartLoading}
            onClose={() => setActiveModal(null)}
            onItemRemoved={handleCartItemRemoved}
          />
        )}

        {activeModal === 'wishlist' && (
          <WishlistModal
            items={wishlistItems}
            loading={wishlistLoading}
            onClose={() => setActiveModal(null)}
            onItemRemoved={handleWishlistItemRemoved}
          />
        )}
      </div>
    </RoleGuard>
  );
}