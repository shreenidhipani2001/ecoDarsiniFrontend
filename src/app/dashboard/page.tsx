'use client';

import { useState } from 'react';
import Sidebar from '../user/SideBar';
import BookFlip from '../admin/ProductsCatalogue';
import { useAuthStore } from '../../store/useAuthStore';
import WishlistModal from '../../components/WishlistModal';
import CartModal from '../../components/CartModal';
import ProfileModal from '../../components/ProfileModal';

export default function DashboardPage() {
  const [activeModal, setActiveModal] = useState<'profile' | 'cart' | 'wishlist' | null>(null);
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const dummyCart = {
    user: user,
    items: [
      { id: 'p1', name: 'Clay Diya', qty: 2, price: 299 },
      { id: 'p2', name: 'Handmade Vase', qty: 1, price: 799 },
    ],
    total: 1397,
  };

  const dummyWishlist = {
    user: user,
    items: [
      { id: 'p3', name: 'Wall Art', price: 999 },
      { id: 'p4', name: 'Bamboo Lamp', price: 1299 },
    ],
  };

  const dummyUser = {
    id: (user as any)?.user?.id || user?.id,
    name: (user as any)?.user?.name || (user as any)?.name,
    email: user?.email,
    role: user?.role,
  };

  return (
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

      {activeModal === 'profile' && (
        <ProfileModal user={dummyUser} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'cart' && (
        <CartModal cart={dummyCart} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'wishlist' && (
        <WishlistModal wishlist={dummyWishlist} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
