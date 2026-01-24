'use client';

import { useState } from 'react';
import { X, Save, Edit3, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../../public/svg/Logo';

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  category_id: string;
  cms_image_ids: string[];
  artist_name?: string;
  is_active: boolean;
  created_at?: string;
};

interface Props {
  product: Product;
  imageUrl: string;
  isAdmin: boolean;
  onClose: () => void;
  onProductUpdate?: (updatedProduct: Product) => void;
}

export default function ProductDetailModal({
  product,
  imageUrl,
  isAdmin,
  onClose,
  onProductUpdate,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
    artist_name: product.artist_name || '',
    is_active: product.is_active,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${product.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            price: formData.price,
            stock: formData.stock,
            artist_name: formData.artist_name,
            is_active: formData.is_active,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update product');
      }

      const updatedProduct = await res.json();
      toast.success('Product updated successfully');
      setIsEditing(false);

      if (onProductUpdate) {
        onProductUpdate(updatedProduct);
      }
    } catch (err: any) {
      console.error('Error updating product:', err);
      toast.error(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      artist_name: product.artist_name || '',
      is_active: product.is_active,
    });
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            {/* {isAdmin ? (
              <Edit3 size={20} className="text-green-600" />
            ) : (
              <Eye size={20} className="text-blue-600" />
            )} */}
            <h2 className="text-xl font-semibold text-gray-800">
              {isAdmin ? 'Product Details (Admin)' : 'Product Details'}
            </h2>
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
                <img
                  src={imageUrl || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status Badge */}
              <div className="mt-4 flex justify-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    formData.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {formData.is_active ? 'Active' : 'Inactive'}
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
                {isAdmin && isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{formData.name}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Slug
                </label>
                {isAdmin && isEditing ? (
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <p className="text-gray-700">{product.slug}</p>
                )}
              </div>

              {/* Price & Stock Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Price (₹)
                  </label>
                  {isAdmin && isEditing ? (
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-green-600">
                      ₹{formData.price.toLocaleString()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Stock
                  </label>
                  {isAdmin && isEditing ? (
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <p
                      className={`text-lg font-medium ${
                        formData.stock > 0 ? 'text-gray-900' : 'text-red-600'
                      }`}
                    >
                      {formData.stock > 0 ? `${formData.stock} units` : 'Out of Stock'}
                    </p>
                  )}
                </div>
              </div>

              {/* Artist Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Artist / Creator
                </label>
                {isAdmin && isEditing ? (
                  <input
                    type="text"
                    name="artist_name"
                    value={formData.artist_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <p className="text-gray-700">{formData.artist_name || 'Not specified'}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                {isAdmin && isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <p className="text-gray-700">
                    {formData.description || 'No description available'}
                  </p>
                )}
              </div>

              {/* Active Status (Admin Edit) */}
              {isAdmin && isEditing && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Product is Active
                  </label>
                </div>
              )}

              {/* Read-only Info */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Product ID:</span>
                    <p className="text-gray-700 font-mono text-xs break-all">{product.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Category ID:</span>
                    <p className="text-gray-700 font-mono text-xs break-all">
                      {product.category_id}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Created At:</span>
                  <p className="text-gray-700 text-sm">{formatDate(product.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50">
          {isAdmin ? (
            <div className="flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Edit3 size={18} />
                  Edit Product
                </button>
              )}
            </div>
          ) : (
            <div className="flex justify-end">
              <Logo className="w-12 h-auto text-green-400" />
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
}
