'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

import { useAuthStore } from '../store/useAuthStore';
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
import AboutSection from '../components/AboutSection';
import BlogsSection from '../components/BlogsSection';
import EcatalogueBookFlip from '../components/EcatalogueBookFlip';
import ProductsCatalouge from '../app/admin/ProductsCatalogue';
import EventsSection from '../components/EventsSection';
import WhatsAppChat from '../components/WhatsAppChat';
import ShopBot from '../components/ShopBot';

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
  const aboutRef = useRef<HTMLDivElement>(null);
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

  // Fetch paginated products
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

        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }
        if (selectedCategory) {
          params.append('category_id', selectedCategory);
        }
        if (selectedSubcategory) {
          params.append('sub_category_id', selectedSubcategory);
        }

        const res = await fetch(`${apiUrl}/api/products?${params.toString()}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();

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
  }, [currentPage, searchQuery, selectedCategory, selectedSubcategory, apiUrl]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!apiUrl) return;
      setCategoriesLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/categories/`, { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.categories || data.data || []);
      } catch (err) {
        console.error('Categories fetch failed', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [apiUrl]);

  // Fetch subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!apiUrl) return;
      setSubcategoriesLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/subcategories`, { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSubcategories(Array.isArray(data) ? data : data.subcategories || []);
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
          aboutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case 'events':
          eventsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case 'contact':
          contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case 'ecatalogue':
          ecatalogueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case 'blogs':
          blogsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
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
        {!imageError ? (
          <img
            src="/image/catalog/banners/id2-banner1.jpg"
            alt="banner"
            onError={() => setImageError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
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
        )}
      </div>

      

      {activeSection === 'about' && (
        <div ref={aboutRef}>
          <AboutSection />
        </div>
      )}
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
        <div ref={blogsRef}>
          <BlogsSection />
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
              {products.slice(0, 10).map((product) => (
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
              <button className="text-orange-500 border-b-2 border-orange-500 pb-1 whitespace-nowrap">
                Accessories
              </button>
              <button className="text-gray-500 hover:text-gray-700 whitespace-nowrap">
                Fashion
              </button>
              <button className="text-gray-500 hover:text-gray-700 whitespace-nowrap">
                Electronics
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-4 flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
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
                  className={`
                    flex-shrink-0 snap-start
                    w-[80vw] sm:w-[320px] md:w-[340px] lg:w-[360px] xl:w-[380px]
                    h-[280px] sm:h-[340px] md:h-[380px]
                    bg-white rounded-xl overflow-hidden
                    shadow-sm hover:shadow-xl transition-all duration-300
                    cursor-pointer border border-gray-200
                  `}
                  onClick={() => router.push(`/product/${product.slug}`)}
                >
                  {/* Image container */}
                  <div className="w-full h-[72%] bg-gray-100 relative">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].card || product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-green-700 font-bold mt-1 text-base sm:text-lg">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
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
                  onBuyNow={() => router.push(`/product/${product.id}`)}
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