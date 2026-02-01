'use client';

import { useEffect, useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductDetailModal from '../../components/ProductDetailModal';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

const getProductImageUrl = (
  product?: Product,
  size: 'thumbnail' | 'card' | 'full' | 'url' = 'card'
): string => {
  if (!product?.images || product.images.length === 0) return '';
  const image = product.images[0];
  return image[size] || image.url || '';
};

export default function AdminProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!API_URL) throw new Error('API URL not configured');

        const res = await fetch(`${API_URL}/api/products/`, {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Products: HTTP ${res.status}`);
        }

        const data = await res.json();
        const productsList = Array.isArray(data)
          ? data
          : data?.products || data?.data || [];

        setProducts(productsList);
      } catch (err: any) {
        console.error('Failed to load products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeletingId(productId);

    try {
      const res = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      toast.success('Product deleted successfully');
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === updatedProduct.id
          ? { ...updatedProduct, images: updatedProduct.images || p.images }
          : p
      )
    );
    setSelectedProduct({
      ...updatedProduct,
      images: updatedProduct.images || selectedProduct?.images,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-20">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center text-gray-400 py-20">
        No products found
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const imageUrl = getProductImageUrl(product, 'card');

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group relative"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteProduct(e, product.id)}
                disabled={deletingId === product.id}
                className="absolute top-3 right-3 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Delete Product"
              >
                {deletingId === product.id ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>

              {/* Product Image */}
              <div className="h-56 w-full bg-gray-100 flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No Image</div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 truncate mb-1">
                  {product.name}
                </h3>

                {product.category_name && (
                  <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-2">
                    {product.category_name}
                  </p>
                )}

                {product.artist_name && (
                  <p className="text-sm text-gray-500 mb-2">
                    by {product.artist_name}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <p className="text-xl font-bold text-green-600">
                    ₹{typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Stock: {product.stock} units
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={{
            ...selectedProduct,
            price:
              typeof selectedProduct.price === 'string'
                ? parseFloat(selectedProduct.price)
                : selectedProduct.price,
          }}
          imageUrl={getProductImageUrl(selectedProduct, 'url')}
          isAdmin={isAdmin}
          onClose={() => setSelectedProduct(null)}
          onProductUpdate={handleProductUpdate}
        />
      )}
    </>
  );
}
