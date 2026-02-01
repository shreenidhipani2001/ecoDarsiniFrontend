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
import HomeProductDetailModal from '../components/HomeProductDetailModal';
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="cursor-pointer"
                >
                  <HomeProductCard
                    product={product}
                    onAddToCart={() => handleProductAction(product, 'cart')}
                    onBuyNow={() => handleProductAction(product, 'buy')}
                    onAddToWishlist={() => handleProductAction(product, 'wishlist')}
                  />
                </div>
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
      {selectedProduct && (
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
      )}
    </div>
  );
}