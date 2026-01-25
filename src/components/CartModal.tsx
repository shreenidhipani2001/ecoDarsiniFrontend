'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { removeFromCart } from '../../lib/cartApi';
import toast from 'react-hot-toast';
import { Trash2, ShoppingBag } from 'lucide-react';

export type CartItem = {
  id: string;
  quantity: number;
  product_id: string;
  name: string;
  price: string;
  total_price: string;
  cms_image_ids?: string[];
  slug: string;
  created_at: string;
  image?: string;
};

interface CartModalProps {
  items: CartItem[];
  loading: boolean;
  onClose: () => void;
  onItemRemoved: (itemId: string) => void;
}

export default function CartModal({
  items,
  loading,
  onClose,
  onItemRemoved,
}: CartModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [removing, setRemoving] = useState(false);
  console.log('CartModal items:', items);
  const handleRemoveItem = async () => {
    if (!items[currentIndex]) return;
    
    setRemoving(true);
    try {
      await removeFromCart(items[currentIndex].id as any);
      toast.success('Item removed from cart');

      // Notify parent to update cart state
      onItemRemoved(items[currentIndex].id);

      // Adjust current index if needed
      if (currentIndex >= items.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
      toast.error('Failed to remove item');
    } finally {
      setRemoving(false);
    }
  };

  const handleBuyNow = () => {
    toast('Buy option yet to be added', {
      icon: '🛒',
    });
  };

  if (loading) {
    return (
      <BaseModal title="My Cart" onClose={onClose}>
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      </BaseModal>
    );
  }

  if (!items || items.length === 0) {
    return (
      <BaseModal title="My Cart" onClose={onClose}>
        <div className="text-center text-gray-700 py-10">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg">Your cart is empty.</p>
        </div>
      </BaseModal>
    );
  }

  const item = items[currentIndex];
  console.log('Current cart item:', item);
  const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

  return (
    <BaseModal title="My Cart" onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Left - Product Image */}
          <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-100 rounded-xl relative overflow-hidden flex-shrink-0">
            <img
              src={item?.image || '/placeholder.png'}
              alt={item?.name}
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
            />
          </div>

          {/* Right - Product Details */}
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
              <p className="text-gray-500 text-sm mt-1">Unit Price: ₹{parseFloat(item.price).toLocaleString()}</p>
              <p className="text-gray-600 mt-2">Quantity: {item.quantity}</p>
              <p className="text-green-600 font-bold text-xl mt-2">₹{parseFloat(item.total_price).toLocaleString()}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleBuyNow}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold"
              >
                <ShoppingBag size={18} />
                Buy Now
              </button>
              <button
                onClick={handleRemoveItem}
                disabled={removing}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Trash2 size={18} />
                {removing ? 'Removing...' : 'Remove'}
              </button>
            </div>

            {/* Pagination Buttons */}
            {items.length > 1 && (
              <>
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
                    }
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        prev < items.length - 1 ? prev + 1 : prev
                      )
                    }
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                    disabled={currentIndex === items.length - 1}
                  >
                    Next
                  </button>
                </div>

                <p className="text-gray-500 text-sm text-center">
                  {currentIndex + 1} / {items.length}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span className="text-gray-700">Total ({items.length} items):</span>
            <span className="text-green-600">₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
