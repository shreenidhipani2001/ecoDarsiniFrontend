'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Heart, ShoppingCart } from 'lucide-react';

type ProductImage = {
  id: string;
  url: string;
  thumbnail: string | null;
  card: string | null;
  full: string | null;
  alt: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  category_id: string;
  category_name?: string;
  sub_category_id?: string;
  subcategory_name?: string;
  cms_image_ids: string[];
  images?: ProductImage[];
  artist_name?: string;
  is_active: boolean;
  created_at?: string;
};

interface Props {
  product: Product;
  imageUrl: string;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

export default function HomeProductDetailModal({
  product,
  imageUrl,
  onClose,
  onAddToCart,
  onAddToWishlist,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      onAddToCart(product);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    setLoading(true);
    try {
      onAddToWishlist(product);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-green-700">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">Product Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
          >
            <X size={18} className="text-red-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image Section */}
            <div className="lg:w-1/3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-md">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
              </div>
              {/* Status Badge */}
              <div className="mt-4 flex justify-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    product.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:w-2/3 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Product Name
                </label>
                <p className="text-lg font-semibold text-gray-900">{product.name}</p>
              </div>

               

              {/* Category & Subcategory Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Category
                  </label>
                  <p className="text-gray-700">{product.category_name || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Subcategory
                  </label>
                  <p className="text-gray-700">{product.subcategory_name || 'Not specified'}</p>
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Price
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Artist Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Artist / Creator
                </label>
                <p className="text-gray-700">{product.artist_name || 'Not specified'}</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <p className="text-gray-700">
                  {product.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-green-700">
          <div className="flex ml-27 justify-end gap-3 w-150">
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="flex-1 bg-black text-white px-3 py-3 rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            <button
              onClick={handleAddToWishlist}
              disabled={loading}
              className="flex-1 bg-black text-white px-3 py-3 rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
              title="Add to Wishlist"
            >
              <Heart size={22} className="text-white" />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
