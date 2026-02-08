'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/useAuthStore';
import HomeHeader from '../../../components/HomeHeader';
import HomeFooter from '../../../components/HomeFooter';
import AuthPromptModal from '../../../components/AuthPromptModal';
import LoginModal from '../../../components/LoginModal';
import RegisterModal from '../../../components/RegisterModal';
import { attachImagesToProductsFrontend } from '../../../../lib/imageResolver';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: string;
  stock?: number;
  cms_image_ids?: string[];
  images: Array<{
    id: string;
    url: string;
    thumbnail: string;
    card: string;
    full: string;
    alt?: string;
  }>;
  category_name: string;
  subcategory_name?: string;
}

interface ApiResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type ModalType = 'none' | 'authPrompt' | 'login' | 'register';
type ActionType = 'cart' | 'wishlist';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Auth modal states
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [pendingAction, setPendingAction] = useState<{ type: ActionType; product: Product } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!API_URL || !categoryId) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '12',
        });
        const res = await fetch(
          `${API_URL}/api/products/category/${categoryId}?${params.toString()}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error('Failed to fetch products');
        const json: ApiResponse = await res.json();
        const resolved = await attachImagesToProductsFrontend(json.products || []);
        setData({ ...json, products: resolved as Product[] });
      } catch (err) {
        console.error(err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, page]);

  const handleProductAction = async (product: Product, actionType: ActionType) => {
    if (!isAuthenticated) {
      setPendingAction({ type: actionType, product });
      setActiveModal('authPrompt');
      return;
    }
    await performAction(product, actionType);
  };

  const performAction = async (product: Product, actionType: ActionType) => {
    if (!API_URL || !user?.id) return;
    try {
      if (actionType === 'cart') {
        const res = await fetch(`${API_URL}/api/cart/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ user_id: user.id, product_id: product.id, quantity: 1 }),
        });
        if (!res.ok) throw new Error('Cart add failed');
        toast.success('Added to cart!');
      } else if (actionType === 'wishlist') {
        const res = await fetch(`${API_URL}/api/wishes/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ user_id: user.id, product_id: product.id }),
        });
        if (!res.ok) throw new Error('Wishlist add failed');
        toast.success('Added to wishlist!');
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${actionType === 'wishlist' ? 'add to wishlist' : 'add to cart'}`);
    }
  };

  const closeAllModals = () => {
    setActiveModal('none');
    setPendingAction(null);
  };

  if (loading) {
    return (
      <div className="w-full">
        <HomeHeader />
        <div className="flex justify-center items-center py-40">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
        <HomeFooter />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full">
        <HomeHeader />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Home
          </button>
        </div>
        <HomeFooter />
      </div>
    );
  }

  const { products, total, totalPages } = data;

  return (
    <div className="w-full">
      <HomeHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-20 px-4 max-w-7xl mx-auto">
        {/* Left Column - Deals of the Week */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Deals of the Week
            </h2>

            <div className="space-y-8 overflow-x-auto snap-x snap-mandatory flex lg:flex-col lg:space-y-8 lg:overflow-x-hidden">
              {products.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="min-w-[280px] sm:min-w-[320px] lg:min-w-full snap-start bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0].card || product.images[0].url}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-64 object-cover"
                      />
                    )}
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      -20%
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2 hover:text-green-700">
                      <Link href={`/product/${product.id}`}>{product.name}</Link>
                    </h3>

                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xl font-bold text-green-700">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{(Number(product.price) * 1.25).toFixed(0)}
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      Available: <b>{product.stock || 100}</b>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleProductAction(product, 'cart')}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleProductAction(product, 'wishlist')}
                        className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                        title="Add to Wishlist"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Best Sellers */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
              <p className="text-sm text-gray-500">{total} product{total !== 1 ? 's' : ''}</p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="relative aspect-square">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0].card || product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <h3 className="text-base font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-green-700">
                      <Link href={`/product/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg font-bold text-green-700">
                        ₹{product.price}
                      </span>
                      {Number(product.price) > 1000 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{(Number(product.price) * 1.15).toFixed(0)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      {product.subcategory_name || product.category_name}
                    </div>

                    {/* Add to Cart / Wishlist buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleProductAction(product, 'cart')}
                        className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md text-xs font-medium transition-colors"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleProductAction(product, 'wishlist')}
                        className="flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-md transition-colors"
                        title="Add to Wishlist"
                      >
                        <Heart className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-gray-700 font-medium">
                  Page <strong>{page}</strong> of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <HomeFooter />

      {/* Auth Modals */}
      <AuthPromptModal
        isOpen={activeModal === 'authPrompt'}
        onClose={closeAllModals}
        onLoginClick={() => setActiveModal('login')}
        onSignUpClick={() => setActiveModal('register')}
        actionType={pendingAction?.type}
      />
      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={closeAllModals}
        onBackToPrompt={pendingAction ? () => setActiveModal('authPrompt') : undefined}
        onSwitchToRegister={() => setActiveModal('register')}
        onLoginSuccess={() => {
          if (pendingAction) {
            performAction(pendingAction.product, pendingAction.type);
          }
        }}
      />
      <RegisterModal
        isOpen={activeModal === 'register'}
        onClose={closeAllModals}
        onBackToPrompt={pendingAction ? () => setActiveModal('authPrompt') : undefined}
        onSwitchToLogin={() => setActiveModal('login')}
      />
    </div>
  );
}
