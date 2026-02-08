'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2, ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react';

import { useAuthStore } from '../store/useAuthStore';
import { fetchCategoriesCached, fetchSubcategoriesCached, fetchProductsCached } from '../../lib/cachedFetch';
import { useDebounce } from '../../lib/useDebounce';
import HomeHeader from '../components/HomeHeader';
import NavMenu from '../components/NavMenu';
import HeroBanner from '../components/HeroBanner';
import FeatureBenefits from '../components/FeatureBenefits';
import CategoryFilter from '../components/CategoryFilter';
import HomeProductCard from '../components/HomeProductCard';
import HomeFooter from '../components/HomeFooter';
import AuthPromptModal from '../components/AuthPromptModal';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import Contact from '../components/Contact';
import BlogsSection from '../components/BlogsSection';
import EcatalogueBookFlip from '../components/EcatalogueBookFlip';
import ProductsCatalouge from '../app/admin/ProductsCatalogue';
import EventsSection from '../components/EventsSection';
import WhatsAppChat from '../components/WhatsAppChat';
import ShopBot from '../components/ShopBot';
import Testimonials from '../components/Testimonials';
 


interface ProductImage {
  id: string;
  url: string;
  thumbnail: string | null;
  card: string | null;
  full: string | null;
  alt: string;
}


interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  slug: string;
  description?: string;
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
}

interface Category {
  id: string;
  name: string;
  slug?: string;
  cms_image_id?: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug?: string;
  category_id: string;
}

type ModalType = 'none' | 'authPrompt' | 'login' | 'register';
type ActionType = 'cart' | 'wishlist' | 'buy';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const productGridRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const ecatalogueRef = useRef<HTMLDivElement>(null);
  const blogsRef = useRef<HTMLDivElement>(null);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);

  // Filter & pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const PRODUCTS_PER_PAGE = 20;

  // Debounce search to avoid hitting API on every keystroke (400ms delay)
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Modal states
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingAction, setPendingAction] = useState<{ type: ActionType; product: any } | null>(null);

  // Cart / Wishlist counts
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [imageError, setImageError] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  type SectionType =
  | 'products'
  | 'about'
  | 'events'
  | 'contact'
  | 'ecatalogue'
  | 'blogs';

const [activeSection, setActiveSection] = useState<SectionType>('products');

  // Fetch paginated products (uses debounced search + SWR cache)
  useEffect(() => {
    const fetchProducts = async () => {
      if (!apiUrl) {
        toast.error('API URL not configured');
        return;
      }

      setProductsLoading(true);

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: PRODUCTS_PER_PAGE.toString(),
        });

        if (debouncedSearch.trim()) {
          params.append('search', debouncedSearch.trim());
        }
        if (selectedCategory) {
          params.append('category_id', selectedCategory);
        }
        if (selectedSubcategory) {
          params.append('sub_category_id', selectedSubcategory);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await fetchProductsCached(params.toString());

        setProducts(data.products || data.docs || []);
        setTotalProducts(data.total || 0);
        setTotalPages(data.totalPages || Math.ceil((data.total || 0) / PRODUCTS_PER_PAGE));
      } catch (err) {
        console.error('Products fetch error:', err);
        toast.error('Failed to load products');
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, debouncedSearch, selectedCategory, selectedSubcategory, apiUrl]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedSubcategory]);

  // Fetch categories (cached for 30 min — rarely changes)
  useEffect(() => {
    const fetchCategories = async () => {
      if (!apiUrl) return;
      setCategoriesLoading(true);
      try {
        const data = await fetchCategoriesCached();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const d = data as any;
        setCategories(Array.isArray(d) ? d : d.categories || d.data || []);
      } catch (err) {
        console.error('Categories fetch failed', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [apiUrl]);

  // Fetch subcategories (cached for 30 min — rarely changes)
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!apiUrl) return;
      setSubcategoriesLoading(true);
      try {
        const data = await fetchSubcategoriesCached();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const d = data as any;
        setSubcategories(Array.isArray(d) ? d : d.subcategories || []);
      } catch (err) {
        console.error('Subcategories fetch failed', err);
      } finally {
        setSubcategoriesLoading(false);
      }
    };
    fetchSubcategories();
  }, [apiUrl]);

  const subcategoriesByCategory = useMemo(() => {
    return subcategories.reduce<Record<string, Subcategory[]>>((acc, sub) => {
      if (!acc[sub.category_id]) acc[sub.category_id] = [];
      acc[sub.category_id].push(sub);
      return acc;
    }, {});
  }, [subcategories]);

  const handleSectionChange = (section: SectionType) => {
    setActiveSection(section);

    // Scroll to the corresponding section
    setTimeout(() => {
      switch (section) {
        case 'products':
          productGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case 'about':
          router.push('/about');
          return;
        case 'events':
          eventsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case 'contact':
          contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case 'ecatalogue':
          router.push('/ecatalogue');
          return;
        case 'blogs':
          router.push('/blog');
          return;
        default:
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100); // Small delay to ensure DOM is updated
  };

  // Cart & Wishlist counts
  useEffect(() => {
    const fetchCounts = async () => {
      if (!isAuthenticated || !user?.id || !apiUrl) {
        setCartCount(0);
        setWishlistCount(0);
        return;
      }

      try {
        // Cart
        const cartRes = await fetch(`${apiUrl}/api/cart/user/${user.id}`, {
          credentials: 'include',
        });
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCartCount((cartData.items || cartData).length || 0);
        }

        // Wishlist
        const wishRes = await fetch(`${apiUrl}/api/wishes/unique/${user.id}`, {
          credentials: 'include',
        });
        if (wishRes.ok) {
          const wishData = await wishRes.json();
          setWishlistCount((wishData.items || wishData).length || 0);
        }
      } catch (err) {
        console.error('Failed to fetch cart/wishlist counts', err);
      }
    };

    fetchCounts();
  }, [isAuthenticated, user?.id, apiUrl]);

  // Handlers
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategoryId: string | null, categoryId: string | null) => {
    setSelectedSubcategory(subcategoryId);
    if (categoryId) setSelectedCategory(categoryId);
  };

  const scrollToProducts = () => {
    productGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Product action logic (add to cart / wishlist / buy now)
  const handleProductAction = async (product: Product, actionType: ActionType) => {
    if (!isAuthenticated) {
      setPendingAction({ type: actionType, product });
      setActiveModal('authPrompt');
      return;
    }
    await performAction(product, actionType);
  };

  const performAction = async (product: Product, actionType: ActionType) => {
    if (!apiUrl || !user?.id) return;

    try {
      if (actionType === 'cart' || actionType === 'buy') {
        const res = await fetch(`${apiUrl}/api/cart/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
          }),
        });

        if (!res.ok) throw new Error('Cart add failed');

        toast.success('Added to cart!');
        setCartCount((prev) => prev + 1);

        if (actionType === 'buy') {
          router.push('/dashboard');
        }
      } else if (actionType === 'wishlist') {
        const res = await fetch(`${apiUrl}/api/wishes/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            user_id: user.id,
            product_id: product.id,
          }),
        });

        if (!res.ok) throw new Error('Wishlist add failed');

        toast.success('Added to wishlist!');
        setWishlistCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${actionType === 'wishlist' ? 'add to wishlist' : 'add to cart'}`);
    }
  };

  // Modal controls
  const openLoginModal = () => setActiveModal('login');

  const handleAuthPromptLogin = () => setActiveModal('login');
  const handleAuthPromptSignUp = () => setActiveModal('register');
  const handleBackToPrompt = () => setActiveModal('authPrompt');
  const handleSwitchToRegister = () => setActiveModal('register');
  const handleSwitchToLogin = () => setActiveModal('login');
  const closeAllModals = () => {
    setActiveModal('none');
    setPendingAction(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onLoginClick={openLoginModal}
        categories={categories}
        subcategoriesByCategory={subcategoriesByCategory}
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onSectionChange={handleSectionChange}
      />

      {/* <NavMenu
        categories={categories}
        subcategoriesByCategory={subcategoriesByCategory}
        loading={categoriesLoading || subcategoriesLoading}
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
      /> */}
      <NavMenu
  categories={categories}
  subcategoriesByCategory={subcategoriesByCategory}
  loading={categoriesLoading || subcategoriesLoading}
  onCategorySelect={handleCategorySelect}
  onSubcategorySelect={handleSubcategorySelect}
  selectedCategory={selectedCategory}
  selectedSubcategory={selectedSubcategory}
  onSectionChange={handleSectionChange}   // NEW
/>

      <HeroBanner onShopNowClick={scrollToProducts} />

      <FeatureBenefits />

      <div
        className="banners banners1"
        style={{
          width: '100%',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          overflow: 'hidden',
        }}
      >
        {/* {!imageError ? (
         
          <div className={`w-full h-full ${imageError ? 'bg-red-700' : ''}`}>
  <img
    src="/image/catalog/banners/id2-banner1.jpg"
    alt="banner"
    onError={() => setImageError(true)}
    className="w-full h-full object-cover"
  />
</div>
        ) : (
            <div
              className="marquee"
              style={{
                backgroundImage: "url('/banner.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
            <span className="marquee-text">Welcome To The World Of Nature</span>
            <span className="marquee-text">Welcome To The World Of Nature</span>
            <span className="marquee-text">Welcome To The World Of Nature</span>
          </div>
        )}*/}

<div className="w-full h-full bannerHover3">
        <div className="bannerInner">
          <span className="bannerText">Welcome To The World Of Nature</span>
        </div>
      
        <style jsx>{`
          .bannerHover3 {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 12px;
            cursor: pointer;
      
            display: flex;
            align-items: center;
            justify-content: center;
      
            /* Gradient Background */
            background: linear-gradient(
              135deg,
              #065f46 0%,
              #047857 30%,
              #10b981 65%,
              #34d399 100%
            );
      
            transition: transform 0.3s ease;
          }
      
          .bannerInner {
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 20px;
            color: white;
          }
      
          .bannerText {
            font-size: clamp(1.2rem, 3vw, 2rem);
            font-weight: 700;
            letter-spacing: 1px;
            text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
      
          /* Shine Sweep Overlay */
          .bannerHover3::before {
            content: '';
            position: absolute;
            top: -150%;
            left: -60%;
            width: 220%;
            height: 300%;
            background: linear-gradient(
              120deg,
              transparent 30%,
              rgba(255, 255, 255, 0.25),
              transparent 70%
            );
            transform: rotate(25deg);
            transition: all 0.8s ease;
            pointer-events: none;
          }
      
          /* Hover Effect */
          .bannerHover3:hover::before {
            top: 120%;
            left: 120%;
          }
      
          .bannerHover3:hover {
            transform: scale(1.02);
          }
        `}</style>
      </div>
      </div>  

      

      

      {/* About section is now on its own /about page */}
      {activeSection === 'events' && (
        <div ref={eventsRef}>
          <EventsSection />
        </div>
      )}
      {activeSection === 'contact' && (
        <div ref={contactRef}>
          <Contact />
        </div>
      )}
      {activeSection === 'ecatalogue' && (
        <div ref={ecatalogueRef}>
          <ProductsCatalouge />
          {/* <EcatalogueBookFlip /> */}
        </div>
      )}
      {activeSection === 'blogs' && (
        // <div ref={blogsRef}>
        //   <BlogsSection />
        // </div>
        <div ref={blogsRef}>
    {/* Instead of showing BlogsSection, navigate away */}
    <div className="py-8 text-center">
      <p className="text-lg mb-4">Taking you to the full Blog page...</p>
      <button
        onClick={() => window.location.href = '/blog'}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Go to Blogs →
      </button>
    </div>
  </div>
      )}


      {activeSection === 'products' && (
        <>
        <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        loading={categoriesLoading}
      />

      {/* Best Sellers Section */}
      <div className="w-full flex flex-col lg:flex-row gap-4 px-4 py-4 bg-gray-50">

        {/* Left - Today's Deals (stacks full-width on mobile, 25% on desktop) */}
        <div className="w-full lg:w-[25%] h-[400px] lg:h-[600px] bg-white rounded-lg shadow-sm p-4 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Today&apos;s Deals</h3>
          <div className="flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, 4).map((product) => (
              // {products.slice(0, 10).map((product) => (
                <div
                  key={`deal-${product.id}`}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="w-full aspect-square">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].card || product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs font-medium text-gray-900 line-clamp-2">{product.name}</h4>
                    <p className="text-sm font-bold text-green-700 mt-1">₹{product.price}</p>
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductAction(product, 'cart');
                        }}
                        className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded-md text-xs font-medium transition-colors"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductAction(product, 'wishlist');
                        }}
                        className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-md transition-colors"
                        title="Add to Wishlist"
                      >
                        <Heart className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Best Sellers (stacks full-width on mobile, 75% on desktop) */}
        <div className="w-full lg:w-[75%] h-[500px] lg:h-[600px] bg-white rounded-lg shadow-sm p-4 flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-3 gap-2">
            <h2 className="text-xl font-bold text-gray-900">BEST SELLER</h2>
            <div className="flex gap-4 sm:gap-6 text-sm font-medium overflow-x-auto">
              {/* <button className="text-orange-500 border-b-2 border-orange-500 pb-1 whitespace-nowrap">
                Accessories
              </button> */}
              {/* <button className="text-gray-500 hover:text-gray-700 whitespace-nowrap">
                Fashion
              </button>
              <button className="text-gray-500 hover:text-gray-700 whitespace-nowrap">
                Electronics
              </button> */}
            </div>
          </div>

          {/* Product Grid */}
          {/* <div className="mt-4 flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {products.slice(0, 80).map((product, i) => (
                <div
                  key={`best-${product.id}`}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
                >
                  <div className="relative aspect-square bg-gray-200">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].card || product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                    {i % 5 === 0 && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        NEW
                      </span>
                    )}
                    {i % 7 === 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        -7%
                      </span>
                    )}
                  </div>
                  <div className="p-2 sm:p-3">
                    <div className="flex text-orange-400 text-[10px] sm:text-xs mb-1">★★★★★</div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-green-700">
                      {product.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 sm:gap-2">
                      <span className="text-red-600 font-bold text-sm">₹{product.price}</span>
                      <span className="text-gray-400 line-through text-[10px] sm:text-xs">
                        ₹{Math.round(product.price * 1.1)}
                      </span>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductAction(product, 'cart');
                        }}
                        className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded-md text-xs font-medium transition-colors"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductAction(product, 'wishlist');
                        }}
                        className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-md transition-colors"
                        title="Add to Wishlist"
                      >
                        <Heart className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          <div
  className="mt-4 flex-1 overflow-x-auto overflow-y-hidden pr-1"
  style={{ scrollbarWidth: 'none' }}
>
  <div className="flex gap-3 sm:gap-4 flex-nowrap">
    {products.slice(0, 80).map((product, i) => (
      <div
        key={`best-${product.id}`}
        onClick={() => router.push(`/product/${product.id}`)}
        className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer min-w-[160px] sm:min-w-[180px] md:min-w-[200px]"
      >
        <div className="relative aspect-square bg-gray-200">
          {product.images?.[0] ? (
            <img
              src={product.images[0].card || product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}

          {i % 5 === 0 && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
              NEW
            </span>
          )}

          {i % 7 === 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
              -7%
            </span>
          )}
        </div>

        <div className="p-2 sm:p-3">
          <div className="flex text-orange-400 text-[10px] sm:text-xs mb-1">
            ★★★★★
          </div>

          <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-green-700">
            {product.name}
          </h3>

          <div className="mt-1 flex items-center gap-1 sm:gap-2">
            <span className="text-red-600 font-bold text-sm">
              ₹{product.price}
            </span>
            <span className="text-gray-400 line-through text-[10px] sm:text-xs">
              ₹{Math.round(product.price * 1.1)}
            </span>
          </div>

          <div className="flex gap-1.5 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProductAction(product, 'cart');
              }}
              className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded-md text-xs font-medium transition-colors"
            >
              <ShoppingCart className="h-3 w-3" />
              Add to Cart
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProductAction(product, 'wishlist');
              }}
              className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-md transition-colors"
              title="Add to Wishlist"
            >
              <Heart className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        
      </div>
    ))}
  </div>
   
</div>

        </div>

      </div>

      {/* corousel section */}
      {/* <div className="w-full sm:w-[80%] md:w-[80%] lg:w-[100%] h-[250px] sm:h-[300px] md:h-[400px] relative bg-gray-100 overflow-hidden">
            
          <button
            onClick={() =>
              document.getElementById('product-slider')?.scrollBy({ left: -400, behavior: 'smooth' })
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full w-10 h-10 flex items-center justify-center"
          >
            ‹
          </button>

          
          <button
            onClick={() =>
              document.getElementById('product-slider')?.scrollBy({ left: 400, behavior: 'smooth' })
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full w-10 h-10 flex items-center justify-center"
          >
            ›
          </button>

          
          <div
            id="product-slider"
            className="flex gap-4 h-full overflow-x-auto scroll-smooth scrollbar-hide px-6 items-center"
          >
            {products.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="min-w-[85vw] sm:min-w-[300px] md:min-w-[380px] h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => router.push(`/product/${product.slug}`)}
              >
                <div className="w-full h-[75%] bg-gray-200">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0].card || product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="p-4 h-[25%] flex flex-col justify-center">
                  <h3 className="text-base font-medium text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-green-700 font-bold mt-1">
                    ₹{product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
      </div> */}
      {/* Carousel Section - Responsive & Centered */}
      <div className="w-full py-6 md:py-8 bg-gray-50 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Optional title */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            Featured Products
          </h2>

          {/* Carousel Container */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() =>
                document.getElementById('product-slider')?.scrollBy({
                  left: -340,
                  behavior: 'smooth',
                })
              }
              className="hidden sm:flex absolute -left-2 lg:-left-5 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 md:w-12 md:h-12 items-center justify-center text-gray-700 hover:text-black transition-all duration-200"
            >
              ‹
            </button>

            {/* Right Arrow */}
            <button
              onClick={() =>
                document.getElementById('product-slider')?.scrollBy({
                  left: 340,
                  behavior: 'smooth',
                })
              }
              className="hidden sm:flex absolute -right-2 lg:-right-5 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 md:w-12 md:h-12 items-center justify-center text-gray-700 hover:text-black transition-all duration-200"
            >
              ›
            </button>

            {/* Slider */}
            <div
              id="product-slider"
              className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory px-1 sm:px-2 pb-4 -mx-1 sm:-mx-2"
            >
              {/* Left padding / fake centering helper */}
              <div className="shrink-0 w-4 sm:w-8 lg:w-16 hidden sm:block" aria-hidden />

              {products.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 snap-start w-[70vw] sm:w-[300px] md:w-[320px] lg:w-[340px] xl:w-[360px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 flex flex-col"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {/* Image container */}
                  <div className="w-full aspect-[4/3] bg-gray-100 relative flex items-center justify-center">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].card || product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-green-700 font-bold mt-1 text-base sm:text-lg">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <div className="flex gap-2 mt-auto pt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductAction(product, 'cart');
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductAction(product, 'wishlist');
                        }}
                        className="flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                        title="Add to Wishlist"
                      >
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Right padding / fake centering helper */}
              <div className="shrink-0 w-4 sm:w-8 lg:w-16 hidden sm:block" aria-hidden />
            </div>

            {/* Scrollbar hiding */}
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </div>
        </div>
      </div>


      <section ref={productGridRef} className="bg-white py-12">
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name || 'Products'
                : 'Our Products'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-sm text-gray-800 font-bold hidden sm:inline">Sort by:</span>
            <select className="border border-gray-200 text-gray-800 font-bold rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {productsLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">🌱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory || selectedSubcategory
                ? 'Try adjusting your filters'
                : 'Check back later for new arrivals'}
            </p>
            {(searchQuery || selectedCategory || selectedSubcategory) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <HomeProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleProductAction(product, 'cart')}
                  onAddToWishlist={() => handleProductAction(product, 'wishlist')}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-6 flex-wrap">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || productsLoading}
                  className="flex items-center text-gray-700 gap-2 px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <span className="text-gray-700 font-medium">
                  Page <strong>{currentPage}</strong> of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || productsLoading}
                  className="flex items-center text-gray-700 gap-2 px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      </section>
      <Testimonials />
        
        </>
  


      )}


     
      <HomeFooter />

      <AuthPromptModal
        isOpen={activeModal === 'authPrompt'}
        onClose={closeAllModals}
        onLoginClick={handleAuthPromptLogin}
        onSignUpClick={handleAuthPromptSignUp}
        actionType={pendingAction?.type}
      />

      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={closeAllModals}
        onBackToPrompt={pendingAction ? handleBackToPrompt : undefined}
        onSwitchToRegister={handleSwitchToRegister}
        onLoginSuccess={pendingAction ? () => {
          performAction(pendingAction.product, pendingAction.type);
        } : undefined}
      />

      <RegisterModal
        isOpen={activeModal === 'register'}
        onClose={closeAllModals}
        onBackToPrompt={pendingAction ? handleBackToPrompt : undefined}
        onSwitchToLogin={handleSwitchToLogin}
      />
      {/* WhatsApp Chat Widget */}
      <ShopBot />
{/* <WhatsAppChat phoneNumber="+919876543210" message="Hello! I need support." /> */}


      {/* Home Product Detail Modal */}
      {/* {selectedProduct && (
        <HomeProductDetailModal
          product={selectedProduct}
          imageUrl={
            selectedProduct.images && selectedProduct.images.length > 0
              ? selectedProduct.images[0].card || selectedProduct.images[0].url || ''
              : ''
          }
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product) => {
            handleProductAction(product, 'cart');
          }}
          onAddToWishlist={(product) => {
            handleProductAction(product, 'wishlist');
          }}
        />
      )} */}
    </div>
  );
}