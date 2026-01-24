'use client';

import { useState } from 'react';
import Sidebar from '../user/SideBar';
import BookFlip from '../admin/ProductsCatalogue';
import { useAuthStore } from '../../store/useAuthStore';
import WishlistModal from '../../components/WishlistModal';
import CartModal from '../../components/CartModal';
import ProfileModal from '../../components/ProfileModal';
import RoleGuard from '../../components/RoleGuard';

export default function DashboardPage() {
  const [activeModal, setActiveModal] = useState<'profile' | 'cart' | 'wishlist' | null>(null);
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 
  const dummyUser = {
    id: (user as any)?.user?.id || user?.id,
    name: (user as any)?.user?.name || (user as any)?.name,
    email: user?.email,
    role: user?.role,
    phone: (user as any)?.user?.phone || (user as any)?.phone,
  };

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

        {activeModal === 'profile' && (
          <ProfileModal user={dummyUser} onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'cart' && (
          <CartModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'wishlist' && (
          <WishlistModal onClose={() => setActiveModal(null)} />
        )}
      </div>
    </RoleGuard>
  );
}
