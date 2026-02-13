'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2, ChevronLeft, ChevronRight, ShoppingCart, Heart, MoveLeft, ArrowBigLeft, ArrowBigRight, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

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
import ProductShowcaseSection from '../components/ProductShowcaseSection';
import LatestBlogs from '../components/LatestBlogs';
 


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
  const bestSellersScrollRef = useRef<HTMLDivElement>(null);
  const [dealIndex, setDealIndex] = useState(0);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [showLeftArrowBest, setShowLeftArrowBest] = useState(false);
  const [showRightArrowBest, setShowRightArrowBest] = useState(false);


  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ day: 0, hour: 0, min: 0, sec: 0 });
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
  const [showGoToTop, setShowGoToTop] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  type SectionType =
  | 'products'
  | 'about'
  | 'events'
  | 'contact'
  | 'ecatalogue'
  | 'blogs';

const [activeSection, setActiveSection] = useState<SectionType>('products');
const CATEGORY_IDS = {
  furnishing: "562a9b4b-34bc-4f94-b885-a7ffa7e1dc67",
  books: "a2cfc7e8-eae7-48ca-833a-ced0aeeca981",
  cuisine: "f1e978a2-8d61-4470-9c6c-0778eba2d744",
};
//if you want to change the best seller catergory please change here
const [bestSellerData, setBestSellerData] = useState<{
  furnishing: Product[];
  books: Product[];
  cuisine: Product[];
}>({
  furnishing: [],
  books: [],
  cuisine: [],
});
const [activeTab, setActiveTab] = useState<'furnishing' | 'books' | 'cuisine'>('furnishing');
const [loadingBest, setLoadingBest] = useState(false);

// Best Sellers scroll functions
const checkBestSellersScroll = () => {
  const container = bestSellersScrollRef.current;
  if (container) {
    setShowLeftArrowBest(container.scrollLeft > 0);
    setShowRightArrowBest(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  }
};

const scrollBestSellers = (direction: 'left' | 'right') => {
  const container = bestSellersScrollRef.current;
  if (container) {
    const scrollAmount = 500; // Increased scroll amount for better visibility
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkBestSellersScroll, 300);
  }
};

const loadCategory = async (key: 'furnishing' | 'books' | 'cuisine', id: string) => {
  setLoadingBest(true);
  const products = await fetchCategoryProducts(id);

  setBestSellerData(prev => ({
    ...prev,
    [key]: products
  }));

  setLoadingBest(false);
  setTimeout(checkBestSellersScroll, 100);
};

const fetchCategoryProducts = async (id: string): Promise<Product[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/category-query?id=${id}&limit=20`);
  const data = await res.json();
  return data.products || [];
};
const [loadingBlogs,setLoadingBlogs] = useState(false);
useEffect(() => {
  const fetchBlogs = async () => {
    setLoadingBlogs(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
      if (!res.ok) throw new Error('Failed to fetch blogs');

      const data = await res.json();

      // take only 10
      setLatestBlogs(data.slice(0, 10));
    } catch (err) {
      console.error('Blogs fetch error:', err);
    } finally {
      setLoadingBlogs(false)
    }
  };

  fetchBlogs();
}, []);


useEffect(() => {
  const load = async () => {
    const [f, b, c] = await Promise.all([
      fetchCategoryProducts(CATEGORY_IDS.furnishing),
      fetchCategoryProducts(CATEGORY_IDS.books),
      fetchCategoryProducts(CATEGORY_IDS.cuisine),
    ]);

    setBestSellerData({
      furnishing: f,
      books: b,
      cuisine: c,
    });
  };

  load();
}, []);

// Check scroll state when products change or tab changes
useEffect(() => {
  setTimeout(checkBestSellersScroll, 100);
}, [bestSellerData, activeTab]);

// Check scroll on window resize
useEffect(() => {
  window.addEventListener('resize', checkBestSellersScroll);
  return () => window.removeEventListener('resize', checkBestSellersScroll);
}, []);

const currentProducts = bestSellerData[activeTab] || [];
const bestProducts = bestSellerData.furnishing;
const newProducts = bestSellerData.books;
const ratingProducts = bestSellerData.cuisine;
useEffect(() => {
  // Target date → 100 years from now
  const targetDate = new Date();
  targetDate.setFullYear(targetDate.getFullYear() + 100);

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    setTimeLeft({
      day: days,
      hour: hours,
      min: minutes,
      sec: seconds,
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);
const format = (num: number): string => String(num).padStart(2, '0');
  // Show/hide "Go to Top" button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
  const deals = useMemo(() => products.slice(0, 10), [products]);
  const deal = deals.length > 0 ? deals[dealIndex] : null;
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



      <div className="w-full flex items-center justify-center bg-gray-100 overflow-hidden min-h-[120px] py-4">

      <div className="w-full max-w-[1920px] h-full min-h-[120px] px-4 lg:px-8 xl:px-12 bannerHover3">
        <div className="bannerInner">
          <span className="bannerText">Welcome To The World Of Nature</span>
        </div>
      
        <style jsx>{`
          .bannerHover3 {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 120px;

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
      <div className="w-full flex flex-col lg:flex-row gap-4 px-4 lg:px-8 xl:px-12 py-4 bg-gray-50 max-w-[1920px] mx-auto">


        <div className="w-full lg:w-[34%] bg-white rounded-lg shadow-sm p-4 flex flex-col">
          {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-900">Deals Of The Week</h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDealIndex((i) => Math.max(0, i - 1))}
                    disabled={dealIndex === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
                  >
                  <ArrowLeft className='text-black'/>
                  </button>
                  <button
                    onClick={() => setDealIndex((i) => Math.min(deals.length - 1, i + 1))}
                    disabled={dealIndex === deals.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
                  >
                    <ArrowRight className='text-black'/>
                  </button>
                </div>
              </div>

                  {deal &&
                  (
                    <div className="flex flex-col">
                      {/* Image */}
                      <div
                        onClick={() => router.push(`/product/${deal.id}`)}
                        className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                      >
                        <img
                          src={deal.images?.[0]?.url || '/placeholder.png'}
                          alt={deal.name}
                          className="w-full h-full object-contain"
                          onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = '/tribal-art-statues-stockcake.webp'; }}
                        />

                        {/* Discount Badge */}
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold w-12 h-12 rounded-full flex items-center justify-center">
                  -22%
                </div>

                </div>

                {/* Details */}
                <div
                  onClick={() => router.push(`/product/${deal.id}`)}
                  className="mt-4 text-center cursor-pointer"
                >
                  <h4 className="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors">{deal.name}</h4>

                  <div className="mt-2">
                    <span className="text-2xl font-bold text-red-500">
                      ₹{deal.price}
                    </span>
                    <span className="ml-2 text-gray-400 line-through">
                      ₹{Number(deal.price) + 500}
                    </span>
                  </div>
                </div>

                {/* Stock Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Available: <b>98</b></span>
                    <span>Sold: <b>32</b></span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
                    <div className="bg-green-500 h-3 rounded-full w-[70%]" />
                  </div>
                </div>

                {/* Countdown */}
                <div className="mt-6 text-center">
                  <h5 className="text-xl font-bold text-black">Hurry Up!</h5>
                  <p className="text-gray-900">Offer ends in:</p>

                
                    <div className="flex justify-center gap-3 mt-3 text-black">
                {[
                  { label: 'DAY', value: format(timeLeft.day) },
                  { label: 'HOUR', value: format(timeLeft.hour) },
                  { label: 'MIN', value: format(timeLeft.min) },
                  { label: 'SEC', value: format(timeLeft.sec) },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="bg-gray-200 rounded-full w-16 h-16 flex flex-col items-center justify-center text-sm font-bold"
                  >
                    {t.value}
                    <span className="text-[10px] font-normal">{t.label}</span>
                  </div>
                ))}
              </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-5">
                <button
                    onClick={() => handleProductAction(deal, 'cart')}
                    className="
                      flex-1
                      flex items-center justify-center gap-2
                      bg-green-600 text-white
                      text-lg
                      py-3
                      rounded-md
                      hover:bg-green-500
                      transition
                    "
                  >
                    <ShoppingCart className="h-6 w-6" />
                    <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => handleProductAction(deal, 'wishlist')}
                  className="
                    w-12 h-12
                    flex items-center justify-center
                    bg-gray-100 hover:bg-red-50
                    text-gray-600 hover:text-red-500
                    rounded-md
                    transition
                  "
                  >
                  <Heart className="h-6 w-6" />
                </button>

                </div>
              </div>
            )
            }
      </div>

 

            {/* Right - Best Sellers */}

          <div className="w-full lg:w-[66%] bg-white rounded-xl shadow-md p-5 flex flex-col">

            {/* Header */}
            <div className="pb-3 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
                Best Sellers
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollBestSellers('left')}
                  disabled={!showLeftArrowBest}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    showLeftArrowBest
                      ? 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollBestSellers('right')}
                  disabled={!showRightArrowBest}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    showRightArrowBest
                      ? 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 text-sm font-semibold mt-3 border-b">
              {[
                { key: 'furnishing', label: 'Furnishing' },
                { key: 'books', label: 'Books' },
                { key: 'cuisine', label: 'Cuisine' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`pb-2 relative transition-all duration-200
                    ${activeTab === tab.key
                      ? 'text-green-600'
                      : 'text-black hover:text-gray-800'}
                  `}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute left-0 -bottom-[1px] w-full h-[3px] bg-green-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="mt-5 flex-1 overflow-y-auto pr-1">

              {loadingBest ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-7 w-7 animate-spin text-green-500" />
                </div>
              ) : currentProducts.length === 0 ? (
                // <p className="text-center text-gray-500 py-10">No products found</p>
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-7 w-7 animate-spin text-green-500" />
                </div>
              ) : (

                <div
                  ref={bestSellersScrollRef}
                  onScroll={checkBestSellersScroll}
                  className="overflow-x-auto overflow-y-hidden scrollbar-hide m-2"
                >
                  <div
                    className="
                      grid
                      grid-rows-2
                      grid-flow-col
                      auto-cols-[230px]
                      sm:auto-cols-[250px]
                      gap-6
                      w-max
                    "
                  >
                    {currentProducts.map(product => (
                      <div
                        key={product.id}
                        onClick={() => router.push(`/product/${product.id}`)}
                        className="
                          relative
                          bg-gray-50
                          border border-gray-100
                          rounded-2xl
                          p-4
                          cursor-pointer
                          transition-all duration-300
                          hover:shadow-xl
                          hover:-translate-y-1
                          group
                        "
                      >
                        {/* WISHLIST FLOAT */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductAction(product, 'wishlist');
                          }}
                          className="
                            absolute top-3 right-3
                            w-9 h-9
                            flex items-center justify-center
                            bg-white/90 backdrop-blur
                            border border-gray-200
                            rounded-full
                            shadow-sm
                            text-gray-500 hover:text-red-500 hover:bg-red-50
                            transition
                            z-10
                          "
                          title="Add to Wishlist"
                        >
                          <Heart className="h-4 w-4" />
                        </button>

                        {/* IMAGE PANEL */}
                        <div className="
                          w-full h-44
                          bg-white
                          rounded-xl
                          flex items-center justify-center
                          overflow-hidden
                          shadow-inner
                        ">
                          <img
                            src={
                              product?.images?.[0]?.card ||
                              product?.images?.[0]?.url ||
                              '/placeholder.png'
                            }
                            alt={product?.name || 'product'}
                            className="
                              max-h-full max-w-full object-contain
                              transition-transform duration-300
                              group-hover:scale-110
                            "
                            onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = '/tribal-art-statues-stockcake.webp'; }}
                          />
                        </div>

                        {/* NAME */}
                        <h4 className="
                          text-sm font-semibold
                          text-gray-800
                          mt-3
                          line-clamp-1
                          group-hover:text-green-600
                          transition
                        ">
                          {product?.name}
                        </h4>

                        {/* PRICE */}
                        <div className="mt-2 flex items-center gap-2">
                          <span className="font-bold text-red-600 text-base">
                            ₹{product?.price}
                          </span>
                          <span className="text-gray-400 line-through text-xs">
                            ₹{Math.round(Number(product?.price) * 1.15)}
                          </span>
                        </div>

                        {/* ADD TO CART */}
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductAction(product, 'cart');
                            }}
                            className="
                              mt-3 w-full
                              flex items-center justify-center gap-2
                              bg-green-600 hover:bg-green-500
                              text-white
                              py-2.5
                              rounded-lg
                              text-sm font-semibold
                              shadow-sm
                              transition
                            "
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                        </button>


                      </div>
                    ))}
                  </div>
                </div>

              )}
            </div>
          </div>

          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>


 



      </div>

      


      <Testimonials />
      <ProductShowcaseSection
  bestProducts={bestProducts}
  newProducts={newProducts}
  ratingProducts={ratingProducts}
  onProductAction={handleProductAction}
/>



      {/* <section ref={productGridRef} className="bg-white py-12">
     
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
      </section> */}
     
     {loadingBlogs ? (
  <div className="flex justify-center py-10">Loading Blogs...</div>
) : (
  <LatestBlogs blogs={latestBlogs} />
)}
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


      {/* Go to Top Button */}
      {showGoToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Go to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}