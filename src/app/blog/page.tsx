'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronDown, ShoppingCart, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import { fetchLatestProductsCached, fetchBlogsCached } from '../../../lib/cachedFetch';
import HomeHeader from '../../components/HomeHeader';
import HomeFooter from '../../components/HomeFooter';
import AuthPromptModal from '../../components/AuthPromptModal';
import LoginModal from '../../components/LoginModal';
import RegisterModal from '../../components/RegisterModal';
 
 
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
  price: number;
  images?: ProductImage[];
  category_name?: string;
  created_at?: string;
};

// Updated Blog type to match actual API response
type Blog = {
  id: string;
  name: string;           // ← title in UI
  description: string;    // ← content / body
  image: string | null;   // ← image path or null
  added_by: string;
  edited_by: string | null;
  created_at: string;
  updated_at: string;
  added_by_name?: string;
};

const getProductImageUrl = (product: Product): string => {
  if (!product.images || product.images.length === 0) return '';
  const image = product.images[0];
  return image.thumbnail || image.card || image.url || '';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${day} ${month}`;
};

type ModalType = 'none' | 'authPrompt' | 'login' | 'register';
type ActionType = 'cart' | 'wishlist';

export default function BlogsSection() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth modal states
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [pendingAction, setPendingAction] = useState<{ type: ActionType; product: Product } | null>(null);

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

  const closeAllModals = () => { setActiveModal('none'); setPendingAction(null); };

  const galleryImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1548345233-4557b8809829?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8&ixlib=rb-4.1.0&q=60&w=3000',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
   
  ];

  // Fetch latest products (cached for 5 min)
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        if (!API_URL) throw new Error('API URL not configured');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await fetchLatestProductsCached();
        const productsList = data.products || data || [];
        setLatestProducts(productsList.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch latest products:', err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  // Fetch blogs (cached for 10 min)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (!API_URL) throw new Error('API URL not configured');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await fetchBlogsCached();
        const blogList = Array.isArray(data) ? data : data.blogs || [];
        setBlogs(blogList);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load blogs';
        console.error('Failed to fetch blogs:', err);
        setError(message);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  console.log('BlogsSection Render:', { latestProducts, blogs, productsLoading, blogsLoading, error });

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Main Content */}
      <HomeHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Sidebar – Left Column */}
          <aside className="lg:col-span-3 space-y-10">
            {/* Latest Products Sidebar */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <h3 className="bg-green-700 text-white px-6 py-4 text-lg font-semibold">
                Latest Products
              </h3>
              <div className="p-5 space-y-6">
                {productsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  </div>
                  
                ) : latestProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No products found</p>
                ) : (
                  latestProducts.map((product) => {
                    const imageUrl = getProductImageUrl(product);
                    return (
                      <div key={product.id} className="flex gap-4 group">
                        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden shadow-sm bg-gray-100">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <a
                            href="#"
                            className="text-gray-900 font-medium hover:text-green-600 transition line-clamp-2"
                          >
                            {product.name}
                          </a>
                          {product.category_name && (
                            <p className="text-xs text-gray-500 mt-1">{product.category_name}</p>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-green-600 font-semibold">
                              ₹{product.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex gap-1.5 mt-2">
                            <button
                              onClick={() => handleProductAction(product, 'cart')}
                              className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded-md text-xs font-medium transition-colors"
                            >
                              <ShoppingCart className="h-3 w-3" />
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleProductAction(product, 'wishlist')}
                              className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-md transition-colors"
                              title="Add to Wishlist"
                            >
                              <Heart className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Sidebar Banner */}
            <div className="hidden lg:block rounded-2xl overflow-hidden shadow-lg">
              <img
                src={galleryImages[4]}
                alt="3xl-black"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </aside>

          {/* Main Blog Content */}
          <div className="lg:col-span-9">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Blogs</h1>

            {/* Blog Grid */}
            {blogsLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-3 text-gray-600">Loading blogs...</span>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-20">{error}</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
                <p className="text-gray-500">Check back later for new articles</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((blog) => (
                      <article
                        key={blog.id}
                        onClick={() => router.push(`/blog/${blog.id}`)}
                        className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={galleryImages[4]}
                            alt={blog.name}
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute bottom-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            {formatDate(blog.created_at)}
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                            {blog.name}
                          </h3>

                          <div className="text-sm text-gray-500 mb-4 flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                              </svg>
                              {blog.added_by_name || 'Admin'}
                            </span>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {blog.description}
                          </p>

                          <span className="inline-flex items-center gap-2 text-green-600 font-medium group-hover:text-green-800 transition mt-auto self-start">
                            Read More
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                          </span>
                        </div>
                      </article>
                  ))}
              </div>
            )}
          </div>
        </div>
       
      </main>
      <HomeFooter />

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