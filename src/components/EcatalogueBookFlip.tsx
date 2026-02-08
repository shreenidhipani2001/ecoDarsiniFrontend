'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useAuthStore } from '../store/useAuthStore';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';

/* ================= TYPES ================= */
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
  price: number | string;
  cms_image_ids: string[];
  images?: ProductImage[];
  slug: string;
  description?: string;
  stock: number;
  category_id: string;
  category_name?: string;
  artist_name?: string;
  is_active: boolean;
  created_at?: string;
};

type FlipBookRef = {
  pageFlip: () => {
    flipNext: (corner?: 'top' | 'bottom') => void;
    flipPrev: (corner?: 'top' | 'bottom') => void;
    getPageCount: () => number;
    getCurrentPageIndex: () => number;
    turnToPage: (pageNum: number) => void;
  };
};

/* ================= HELPERS ================= */
const getProductImageUrl = (product: Product, size: 'thumbnail' | 'card' | 'full' | 'url' = 'url'): string => {
  if (!product.images || product.images.length === 0) {
    return '';
  }
  const image = product.images[0];
  return image[size] || image.url || '';
};

const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toLocaleString('en-IN');
};

/* ================= PAGE COMPONENTS ================= */

 
const FrontCover = React.forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className="page page-cover front-cover" ref={ref} data-density="hard">
      <div className="cover-root">
        <div className="cover-bg-pattern" />

        <div className="cover-main">
          <div className="brand-badge">🌿</div>

          <h1 className="brand-title">EcoDarshini</h1>
          <p className="brand-sub">Sustainable Art & Craft</p>

          <div className="brand-divider" />

          <h2 className="catalogue-label">2026 PRODUCT CATALOGUE</h2>

          <div className="open-hint">
            <span>Open to Explore</span>
            <span className="hint-arrow">→</span>
          </div>
        </div>

        <div className="cover-spine" />
      </div>

      {/* CSS HERE ONLY */}
      <style jsx>{`
        .front-cover {
          background: linear-gradient(
            160deg,
            #064e3b 0%,
            #065f46 40%,
            #047857 70%,
            #10b981 100%
          );
        }

        .cover-root {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cover-bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image: radial-gradient(
              circle at 20% 20%,
              white 1px,
              transparent 1px
            ),
            radial-gradient(circle at 80% 80%, white 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .cover-main {
          text-align: center;
          color: white;
          z-index: 2;
          padding: 20px;
        }

        .brand-badge {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          font-size: 1.8rem;
          backdrop-filter: blur(2px);
        }

        .brand-title {
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 6px;
          text-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        }

        .brand-sub {
          font-size: clamp(0.8rem, 2.5vw, 1rem);
          opacity: 0.85;
          letter-spacing: 1.5px;
          margin-bottom: 16px;
        }

        .brand-divider {
          width: 60px;
          height: 3px;
          background: rgba(255, 255, 255, 0.6);
          margin: 14px auto;
          border-radius: 2px;
        }

        .catalogue-label {
          font-size: clamp(0.8rem, 2.5vw, 1.05rem);
          letter-spacing: 3px;
          font-weight: 500;
          opacity: 0.9;
          margin-bottom: 28px;
        }

        .open-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: clamp(0.7rem, 2vw, 0.9rem);
          opacity: 0.85;
        }

        .hint-arrow {
          font-size: 1.2rem;
          animation: slideArrow 1.6s ease-in-out infinite;
        }

        @keyframes slideArrow {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(6px);
          }
        }
      `}</style>
    </div>
  );
});

FrontCover.displayName = "FrontCover";


const BackCover = React.forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className="page page-cover back-cover" ref={ref} data-density="hard">
      <div className="back-root">
        <div className="back-bg-pattern" />

        <div className="back-main">
          {/* Small Badge */}
          <div className="back-badge">🌱</div>

          <h2 className="back-title">Thank You</h2>
          <p className="back-sub">
            For Supporting Sustainable Artisans
          </p>

          {/* Eco Points */}
          <div className="eco-points">
            <div className="eco-item">
              <span>🌿</span>
              <p>Eco-Friendly Materials</p>
            </div>
            <div className="eco-item">
              <span>🎨</span>
              <p>Supporting Local Artists</p>
            </div>
            <div className="eco-item">
              <span>♻️</span>
              <p>Sustainable Products</p>
            </div>
          </div>

          {/* Footer Hint */}
          <div className="back-hint">
            <span className="hint-arrow">←</span>
            <span>Browse Again</span>
          </div>
        </div>

        <div className="cover-spine right" />
      </div>

      {/* CSS INSIDE */}
      <style jsx>{`
        .back-cover {
          background: linear-gradient(
            160deg,
            #022c22 0%,
            #064e3b 40%,
            #047857 75%,
            #34d399 100%
          );
        }

        .back-root {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .back-bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-image: radial-gradient(
              circle at 25% 30%,
              white 1px,
              transparent 1px
            ),
            radial-gradient(circle at 75% 70%, white 1px, transparent 1px);
          background-size: 42px 42px;
        }

        .back-main {
          text-align: center;
          color: white;
          padding: 24px;
          z-index: 2;
          max-width: 420px;
        }

        .back-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 1.6rem;
        }

        .back-title {
          font-size: clamp(1.6rem, 4.5vw, 2.4rem);
          font-weight: 800;
          margin-bottom: 6px;
          text-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        }

        .back-sub {
          font-size: clamp(0.8rem, 2.5vw, 1rem);
          opacity: 0.9;
          margin-bottom: 22px;
          letter-spacing: 1px;
        }

        .eco-points {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }

        .eco-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 8px 12px;
          font-size: 0.9rem;
          backdrop-filter: blur(3px);
        }

        .eco-item span {
          font-size: 1.2rem;
        }

        .back-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0.85;
          font-size: 0.85rem;
        }

        .hint-arrow {
          font-size: 1.2rem;
          animation: slideBack 1.6s ease-in-out infinite;
        }

        @keyframes slideBack {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-6px);
          }
        }
      `}</style>
    </div>
  );
});


BackCover.displayName = 'BackCover';

// Left Page - Product Image
interface LeftPageProps {
  product: Product;
  pageNumber: number;
  onNavigate?: (productId: string) => void;
}

 
const LeftPage = React.forwardRef<HTMLDivElement, LeftPageProps>(
  ({ product, pageNumber, onNavigate }, ref) => {
    const [imgError, setImgError] = React.useState(false);

    return (
      <div className="page product-page single-page" ref={ref}>
        <div className="page-inner flex flex-col items-center justify-between">

          {/* View Details Button */}
          <button
            className="view-details-btn text-white bg-green-600 p-2 pr-4 pl-4 rounded-full font-bold"
            onClick={() => onNavigate?.(product.id)}
          >
            View Details
          </button>

          {/* Title */}
          <div className="w-full text-center mt-4">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              {product.name}
            </h2>
          </div>

          {/* Image */}
          <div className="flex-1 w-full flex items-center justify-center">
            <div className="w-[360px] h-[360px] border-2 border-green-500 rounded-xl flex items-center justify-center overflow-hidden bg-white">
              {!imgError && getProductImageUrl(product) ? (
                <img
                  src={getProductImageUrl(product)}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-gray-400 text-sm">
                  Loading Image...
                </span>
              )}
            </div>
          </div>

          {/* Artist */}
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-wide text-gray-500">
              Crafted by
            </span>
            <div className="text-lg font-semibold text-black">
              {product?.artist_name || 'Artisan'}
            </div>
            <div className="text-sm text-black">
              {product?.description || 'Artisan'}
            </div>
          </div>

          <span className="pg-num text-3xl text-black right">{pageNumber}</span>
        </div>
      </div>
    );
  }
);
// LeftPage.displayName = 'LeftPage';

LeftPage.displayName = 'LeftPage';


// Right Page - Product Details
interface RightPageProps {
  product: Product;
  pageNumber: number;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}
 

/* ================= MAIN COMPONENT ================= */
interface EcatalogueBookFlipProps {
  onAuthRequired?: (actionType: 'cart' | 'wishlist', product: Product) => void;
}

export default function EcatalogueBookFlip({ onAuthRequired }: EcatalogueBookFlipProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookDimensions, setBookDimensions] = useState({ width: 550, height: 700 });
  const [isMobile, setIsMobile] = useState(false);

  // Mobile swipe card state
  const [mobileCardIndex, setMobileCardIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [enterFrom, setEnterFrom] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchDeltaRef = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);

  const flipBookRef = useRef<FlipBookRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuthStore();

  /* ========== RESPONSIVE DIMENSIONS ========== */
  useEffect(() => {
    const calculateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      setIsMobile(screenWidth < 768);

      let width: number;
      let height: number;

      if (screenWidth < 480) {
        // Mobile
        width = Math.min(screenWidth - 40, 320);
        height = Math.min(screenHeight - 200, width * 1.35);
      } else if (screenWidth < 768) {
        // Tablet portrait
        width = Math.min(screenWidth - 60, 400);
        height = Math.min(screenHeight - 200, width * 1.3);
      } else if (screenWidth < 1024) {
        // Tablet landscape / small desktop
        width = Math.min(screenWidth / 2 - 80, 480);
        height = Math.min(screenHeight - 200, width * 1.28);
      } else if (screenWidth < 1440) {
        // Desktop
        width = Math.min(screenWidth / 2 - 100, 550);
        height = Math.min(screenHeight - 180, width * 1.27);
      } else {
        // Large desktop
        width = Math.min(screenWidth / 2 - 120, 600);
        height = Math.min(screenHeight - 160, width * 1.25);
      }

      setBookDimensions({ width: Math.floor(width), height: Math.floor(height) });
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  /* ========== FETCH PRODUCTS ========== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) throw new Error('API URL not set');

        const res = await fetch(`${apiUrl}/api/products/`, {
          cache: 'no-store',
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const productList = Array.isArray(data) ? data : data?.products || data?.data || [];
        // Filter only active products
        const activeProducts = productList.filter((p: Product) => p.is_active);
        setProducts(activeProducts);
      } catch (err) {
        console.error('Failed to load products:', err);
        toast.error('Failed to load catalogue');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ========== NAVIGATION HANDLERS ========== */
  const goNext = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  }, []);

  const goPrev = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  }, []);

  /* ========== EVENT HANDLERS ========== */
  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const handleInit = useCallback(() => {
    if (flipBookRef.current) {
      setTotalPages(flipBookRef.current.pageFlip().getPageCount());
    }
  }, []);

  /* ========== KEYBOARD NAVIGATION ========== */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goNext, goPrev]);

  /* ========== CART/WISHLIST HANDLERS ========== */
  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      onAuthRequired?.('cart', product);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user?.id,
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error('Failed to add to cart');
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Cart error:', err);
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      onAuthRequired?.('wishlist', product);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/wishes/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user?.id,
          product_id: product.id,
        }),
      });

      if (!res.ok) throw new Error('Failed to add to wishlist');
      toast.success('Added to wishlist!');
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error('Failed to add to wishlist');
    }
  };

  /* ========== MOBILE SWIPE HANDLERS ========== */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnimating) return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchDeltaRef.current = 0;
    setDragOffset(0);
  }, [isAnimating]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || isAnimating) return;
    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    touchDeltaRef.current = deltaX;
    setDragOffset(deltaX);
  }, [isAnimating]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current || isAnimating) return;
    const delta = touchDeltaRef.current;
    const threshold = 60;

    if (Math.abs(delta) > threshold) {
      if (delta < 0 && mobileCardIndex < products.length) {
        // Swipe left → next card exits left, new card enters from right
        setSwipeDirection('left');
        setIsAnimating(true);
        setTimeout(() => {
          setMobileCardIndex((prev) => prev + 1);
          setSwipeDirection(null);
          setDragOffset(0);
          setEnterFrom('right');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setEnterFrom(null);
              setIsAnimating(false);
            });
          });
        }, 300);
      } else if (delta > 0 && mobileCardIndex > 0) {
        // Swipe right → previous card exits right, new card enters from left
        setSwipeDirection('right');
        setIsAnimating(true);
        setTimeout(() => {
          setMobileCardIndex((prev) => prev - 1);
          setSwipeDirection(null);
          setDragOffset(0);
          setEnterFrom('left');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setEnterFrom(null);
              setIsAnimating(false);
            });
          });
        }, 300);
      } else {
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }
    touchStartRef.current = null;
    touchDeltaRef.current = 0;
  }, [isAnimating, mobileCardIndex, products.length]);

  const goNextMobile = useCallback(() => {
    if (isAnimating || mobileCardIndex >= products.length) return;
    setSwipeDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setMobileCardIndex((prev) => prev + 1);
      setSwipeDirection(null);
      setDragOffset(0);
      setEnterFrom('right');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnterFrom(null);
          setIsAnimating(false);
        });
      });
    }, 300);
  }, [isAnimating, mobileCardIndex, products.length]);

  const goPrevMobile = useCallback(() => {
    if (isAnimating || mobileCardIndex <= 0) return;
    setSwipeDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setMobileCardIndex((prev) => prev - 1);
      setSwipeDirection(null);
      setDragOffset(0);
      setEnterFrom('left');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnterFrom(null);
          setIsAnimating(false);
        });
      });
    }, 300);
  }, [isAnimating, mobileCardIndex]);

  /* ========== LOADING / EMPTY STATES ========== */
  if (loading) {
    return (
      <div className="catalogue-loading">
        <div className="loading-book">
          <div className="loading-cover"></div>
          <div className="loading-pages">
            <div className="loading-page"></div>
            <div className="loading-page"></div>
            <div className="loading-page"></div>
          </div>
        </div>
        <p className="loading-text">Opening catalogue...</p>
        <style jsx>{loadingStyles}</style>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="catalogue-empty">
        <div className="empty-icon">📚</div>
        <p className="empty-text">No products in catalogue</p>
        <style jsx>{loadingStyles}</style>
      </div>
    );
  }

  // Generate pages
  const pages: React.ReactNode[] = [];
  pages.push(<FrontCover key="front-cover" />);
 
  
  products.forEach((product, index) => {
    pages.push(
      <LeftPage
        key={`product-${product.id}`}
        product={product}
        pageNumber={index + 1}
        onNavigate={(id) => router.push(`/product/${id}`)}
      />
    );
  });
  
  pages.push(<BackCover key="back-cover" />);

  const currentProductIndex = Math.max(0, Math.floor((currentPage - 1) / 2));

  /* ================= RENDER ================= */
  const isEndCard = mobileCardIndex >= products.length;
  const currentMobileProduct = !isEndCard ? products[mobileCardIndex] : null;

  const getCardTransform = () => {
    // Exit animation: card flies out in swipe direction
    if (swipeDirection === 'left') return 'translateX(-120%) rotate(-8deg)';
    if (swipeDirection === 'right') return 'translateX(120%) rotate(8deg)';
    // Entrance: position new card off-screen before sliding in
    if (enterFrom === 'left') return 'translateX(-120%) rotate(-8deg)';
    if (enterFrom === 'right') return 'translateX(120%) rotate(8deg)';
    // Drag follow
    if (dragOffset !== 0) {
      const rotate = dragOffset * 0.04;
      return `translateX(${dragOffset}px) rotate(${rotate}deg)`;
    }
    return 'translateX(0) rotate(0deg)';
  };

  return (
    <>
    <HomeHeader />

      {/* ===== MOBILE SWIPEABLE CARDS ===== */}
      {isMobile ? (
        <div className="mobile-catalogue-wrapper">
          {/* Counter */}
          <div className="mobile-counter">
            <span>{isEndCard ? products.length : mobileCardIndex + 1}</span>
            <span className="mobile-counter-sep">/</span>
            <span>{products.length}</span>
          </div>

          {/* Card area */}
          <div
            className="mobile-card-area"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {isEndCard ? (
              /* END CARD */
              <div className="mobile-card mobile-end-card">
                <div className="end-card-content">
                  <div className="end-card-icon">🌿</div>
                  <h2 className="end-card-title">End of Products</h2>
                  <p className="end-card-sub">You have viewed all products in the catalogue.</p>
                  <button
                    className="end-card-btn"
                    onClick={() => setMobileCardIndex(0)}
                  >
                    Back to Start
                  </button>
                </div>
              </div>
            ) : currentMobileProduct ? (
              /* PRODUCT CARD */
              <div
                className="mobile-card"
                style={{
                  transform: getCardTransform(),
                  transition: enterFrom
                    ? 'none'
                    : swipeDirection
                      ? 'transform 0.3s ease-out, opacity 0.3s ease-out'
                      : 'transform 0.3s ease-out, opacity 0.3s ease-out',
                  opacity: swipeDirection ? 0.6 : enterFrom ? 0.6 : 1,
                }}
              >
                {/* Product Image */}
                <div
                  className="mobile-card-img-wrapper"
                  onClick={() => router.push(`/product/${currentMobileProduct.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {getProductImageUrl(currentMobileProduct) ? (
                    <img
                      src={getProductImageUrl(currentMobileProduct)}
                      alt={currentMobileProduct.name}
                      className="mobile-card-img"
                    />
                  ) : (
                    <div className="mobile-card-img-placeholder">
                      <span>🌿</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="mobile-card-details">
                  <h2 className="mobile-card-name">{currentMobileProduct.name}</h2>

                  {/* Price */}
                  <div className="mobile-card-price">
                    <span className="mobile-price-symbol">₹</span>
                    <span className="mobile-price-value">{formatPrice(currentMobileProduct.price)}</span>
                  </div>

                  {/* Category & Status row */}
                  <div className="mobile-card-tags">
                    <span className="mobile-tag mobile-tag-category">
                      {currentMobileProduct.category_name || 'Eco Product'}
                    </span>
                    <span className={`mobile-tag ${currentMobileProduct.is_active ? 'mobile-tag-available' : 'mobile-tag-oos'}`}>
                      {currentMobileProduct.is_active ? 'Available' : 'Out of Stock'}
                    </span>
                    {currentMobileProduct.stock > 0 && (
                      <span className="mobile-tag mobile-tag-stock">
                        {currentMobileProduct.stock} in stock
                      </span>
                    )}
                  </div>

                  {/* Artist */}
                  {currentMobileProduct.artist_name && (
                    <p className="mobile-card-artist">
                      Crafted by <strong>{currentMobileProduct.artist_name}</strong>
                    </p>
                  )}

                  {/* Description */}
                  <div className="mobile-card-desc-section">
                    <h3 className="mobile-card-desc-heading">Description</h3>
                    <p className="mobile-card-desc-text">
                      {currentMobileProduct.description ||
                        'A beautifully handcrafted eco-friendly product made with sustainable materials.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Navigation arrows */}
          <div className="mobile-nav-row">
            <button
              className={`mobile-nav-btn ${mobileCardIndex <= 0 ? 'disabled' : ''}`}
              onClick={goPrevMobile}
              disabled={mobileCardIndex <= 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="mobile-swipe-hint">Swipe to browse</span>
            <button
              className={`mobile-nav-btn ${isEndCard ? 'disabled' : ''}`}
              onClick={goNextMobile}
              disabled={isEndCard}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        /* ===== DESKTOP BOOK FLIP ===== */
        <div className="ecatalogue-wrapper" ref={containerRef}>
          <div className="book-container">
            <div className="book-wrapper">
              <div className="book-shadow"></div>
              <HTMLFlipBook
                width={bookDimensions.width}
                height={bookDimensions.height}
                size="fixed"
                minWidth={280}
                maxWidth={600}
                minHeight={380}
                maxHeight={800}
                style={{}}
                startPage={0}
                maxShadowOpacity={0.4}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={onFlip}
                onInit={handleInit}
                className="catalogue-book"
                ref={flipBookRef}
                drawShadow={true}
                flippingTime={800}
                usePortrait={false}
                startZIndex={0}
                autoSize={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={45}
                showPageCorners={false}
                disableFlipByClick={false}
              >
                {pages}
              </HTMLFlipBook>
            </div>
          </div>
        </div>
      )}

      {/* ================= STYLES ================= */}
      <style jsx global>{`
        /* ========== BOOK CONTAINER FIX ========== */
        .catalogue-book {
          overflow: hidden !important;
        }

        .stf__wrapper {
          overflow: hidden !important;
        }

        .stf__parent {
          overflow: hidden !important;
        }

        /* ========== PAGE BASE ========== */
        .page {
          background-color: #fffef5 !important;
          overflow: hidden !important;
          box-sizing: border-box;
        }

        .page-inner {
          width: 100%;
          height: 100%;
          background: #fffef5;
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 5%;
        }

        /* ========== COVER PAGES ========== */
        .page-cover {
          background: linear-gradient(145deg, #065f46 0%, #047857 40%, #059669 70%, #10b981 100%) !important;
        }

        .page-cover.back-cover {
          background: linear-gradient(145deg, #10b981 0%, #059669 30%, #047857 60%, #065f46 100%) !important;
        }

        .cover-inner {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: inherit;
        }

        .cover-spine {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 12px;
          background: linear-gradient(to right,
            rgba(0,0,0,0.4),
            rgba(0,0,0,0.1) 40%,
            rgba(255,255,255,0.05) 60%,
            rgba(0,0,0,0.3)
          );
        }

        .cover-spine.right {
          right: auto;
          left: 0;
          background: linear-gradient(to left,
            rgba(0,0,0,0.4),
            rgba(0,0,0,0.1) 40%,
            rgba(255,255,255,0.05) 60%,
            rgba(0,0,0,0.3)
          );
        }

        .cover-decoration {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .leaf-pattern {
          position: absolute;
          width: 60px;
          height: 60px;
          opacity: 0.12;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23fff' d='M50 5 C30 25, 10 50, 50 95 C90 50, 70 25, 50 5'/%3E%3C/svg%3E") no-repeat center;
          background-size: contain;
        }

        .leaf-tl { top: 20px; left: 20px; transform: rotate(-45deg); }
        .leaf-tr { top: 20px; right: 30px; transform: rotate(45deg); }
        .leaf-bl { bottom: 20px; left: 20px; transform: rotate(-135deg); }
        .leaf-br { bottom: 20px; right: 30px; transform: rotate(135deg); }

        .cover-content {
          text-align: center;
          color: white;
          padding: 20px;
          z-index: 1;
        }

        .cover-emblem {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cover-emblem.small {
          width: 50px;
          height: 50px;
          margin-bottom: 10px;
        }

        .emblem-ring {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(255,255,255,0.35);
          border-radius: 50%;
        }

        .emblem-ring-2 {
          inset: 8px;
          border-style: dashed;
        }

        .cover-title {
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          font-weight: 700;
          margin-bottom: 10px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
          letter-spacing: 1px;
        }

        .cover-divider {
          margin: 10px 0;
        }

        .divider-leaf {
          font-size: 1.5rem;
          opacity: 0.7;
        }

        .cover-subtitle {
          font-size: clamp(0.9rem, 3vw, 1.2rem);
          font-weight: 400;
          opacity: 0.95;
          margin-bottom: 15px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .cover-tagline {
          font-size: clamp(0.75rem, 2.5vw, 0.95rem);
          font-style: italic;
          opacity: 0.8;
          margin-bottom: 25px;
        }

        .cover-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: clamp(0.7rem, 2vw, 0.9rem);
          opacity: 0.85;
        }

        .footer-arrow {
          font-size: 1.2rem;
          animation: bounceRight 1.5s ease-in-out infinite;
        }

        .footer-arrow.flip {
          animation: bounceLeft 1.5s ease-in-out infinite;
        }

        @keyframes bounceRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }

        @keyframes bounceLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-6px); }
        }

        /* Back Cover */
        .end-title {
          font-size: clamp(1.3rem, 4vw, 2rem);
          font-weight: 700;
          margin-bottom: 8px;
        }

        .end-subtitle {
          font-size: clamp(0.75rem, 2.5vw, 1rem);
          opacity: 0.9;
          margin-bottom: 20px;
        }

        .end-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255,255,255,0.15);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: clamp(0.7rem, 2vw, 0.85rem);
        }

        /* ========== LEFT PAGE - IMAGE ========== */
        .left-page .page-inner {
          align-items: center;
          justify-content: space-between;
        }

        .left-header {
          text-align: center;
          width: 100%;
        }

        .left-title {
          font-size: clamp(1rem, 3.5vw, 1.5rem);
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .title-line {
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #10b981, #059669);
          margin: 0 auto;
          border-radius: 2px;
        }

        .left-image-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 10px 0;
        }

        .image-box {
          width: 90%;
          max-width: 350px;
          aspect-ratio: 1;
          background: white;
          border-radius: 12px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 4px 20px rgba(0,0,0,0.08),
            0 1px 4px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.04);
        }

        .product-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }

        .artist-info {
          text-align: center;
          padding: 8px 0;
        }

        .artist-label {
          display: block;
          font-size: clamp(0.65rem, 2vw, 0.75rem);
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .artist-name {
          display: block;
          font-size: clamp(0.9rem, 3vw, 1.2rem);
          font-weight: 600;
          color: #065f46;
        }

        /* ========== RIGHT PAGE - DETAILS ========== */
        .right-page .page-inner {
          justify-content: center;
        }

        .details-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(8px, 2vw, 14px);
          justify-content: center;
        }

        .detail-card {
          width: 100%;
          background: white;
          border-radius: 10px;
          padding: clamp(8px, 2vw, 14px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.04);
        }

        .desc-card {
          text-align: center;
        }

        .desc-text {
          font-size: clamp(0.7rem, 2vw, 0.9rem);
          color: #4b5563;
          line-height: 1.5;
          margin: 0;
        }

        .info-row {
          display: flex;
          gap: 8px;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }

        .category-tag,
        .status-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border-radius: 16px;
          font-size: clamp(0.65rem, 2vw, 0.8rem);
          font-weight: 500;
        }

        .category-tag {
          background: #fef3c7;
          color: #92400e;
        }

        .status-tag {
          background: #fef2f2;
          color: #b91c1c;
        }

        .status-tag.available {
          background: #f0fdf4;
          color: #166534;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .price-card {
          width: 100%;
          background: linear-gradient(135deg, #065f46 0%, #059669 100%);
          border-radius: 10px;
          padding: clamp(10px, 2.5vw, 16px);
          text-align: center;
        }

        .price-label {
          font-size: clamp(0.55rem, 1.5vw, 0.7rem);
          color: rgba(255,255,255,0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 4px;
        }

        .price-amount {
          color: white;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
        }

        .rupee {
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 500;
        }

        .amount {
          font-size: clamp(1.5rem, 5vw, 2.4rem);
          font-weight: 700;
          color:rgb(0, 0, 0);
        }

        .stock-info {
          display: flex;
          align-items: baseline;
          gap: 4px;
          background: #f3f4f6;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: clamp(0.65rem, 2vw, 0.85rem);
        }

        .stock-num {
          font-weight: 700;
          color:rgb(0, 0, 0);
        }

        .stock-label {
          color:rgb(0, 0, 0);
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          width: 100%;
          flex-wrap: wrap;
          justify-content: center;
        }

        .action-btn {
          flex: 1;
          min-width: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px);
          border: none;
          border-radius: 8px;
          font-size: clamp(0.65rem, 2vw, 0.85rem);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-btn .btn-icon {
          width: clamp(14px, 3vw, 18px);
          height: clamp(14px, 3vw, 18px);
        }

        .cart-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }

        .cart-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
        }

        .wishlist-btn {
          background: white;
          color: #ef4444;
          border: 1px solid #fecaca;
        }

        .wishlist-btn:hover {
          background: #fef2f2;
        }

        /* View Details Button */
        .view-details-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 5;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: clamp(0.65rem, 1.8vw, 0.8rem);
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
          transition: all 0.2s ease;
          letter-spacing: 0.3px;
        }

        .view-details-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .view-details-btn:active {
          transform: scale(0.96);
        }

        /* Page Numbers */
        .pg-num {
          position: absolute;
          bottom: 10px;
          font-size: clamp(0.6rem, 1.5vw, 0.8rem);
          color: #9ca3af;
          font-weight: 500;
        }

        .pg-num.left { left: 15px; }
        .pg-num.right { right: 15px; }
      `}</style>

      <style jsx>{`
        .ecatalogue-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 16px;
          background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .ecatalogue-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-icon {
          font-size: 1.3rem;
        }

        .header-title {
          font-size: clamp(0.9rem, 2.5vw, 1.1rem);
          font-weight: 600;
          color: #1f2937;
        }

        .header-center {
          flex: 1;
          text-align: center;
          min-width: 150px;
        }

        .current-product {
          font-size: clamp(0.75rem, 2vw, 0.9rem);
          color: #6b7280;
          font-weight: 500;
        }

        .header-right {
          text-align: right;
        }

        .page-info {
          font-size: clamp(0.75rem, 2vw, 0.9rem);
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #10b981, #059669);
          padding: 6px 14px;
          border-radius: 16px;
        }

        .book-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(10px, 3vw, 30px);
          padding: 10px;
        }

        .book-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
        }

        .book-shadow {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          height: 40px;
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%);
          filter: blur(10px);
        }

        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(40px, 8vw, 60px);
          height: clamp(40px, 8vw, 60px);
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          flex-shrink: 0;
        }

        .nav-btn .nav-icon {
          width: clamp(20px, 5vw, 28px);
          height: clamp(20px, 5vw, 28px);
        }

        .nav-btn:hover:not(.disabled) {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .nav-btn:active:not(.disabled) {
          transform: scale(0.95);
        }

        .nav-btn.disabled {
          background: #d1d5db;
          cursor: not-allowed;
          box-shadow: none;
        }

        .ecatalogue-footer {
          text-align: center;
          padding: 12px;
        }

        .hint-text {
          font-size: clamp(0.75rem, 2vw, 0.9rem);
          color: #6b7280;
          background: white;
          padding: 8px 18px;
          border-radius: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }

        @media (max-width: 640px) {
          .ecatalogue-header {
            flex-direction: column;
            text-align: center;
          }

          .header-left,
          .header-center,
          .header-right {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* ========== MOBILE CARD STYLES ========== */}
      <style jsx>{`
        .mobile-catalogue-wrapper {
          min-height: calc(100vh - 60px);
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 12px 16px;
          overflow: hidden;
        }

        .mobile-counter {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #065f46;
          background: white;
          padding: 6px 16px;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          margin-bottom: 12px;
        }

        .mobile-counter-sep {
          color: #9ca3af;
          margin: 0 2px;
        }

        .mobile-card-area {
          flex: 1;
          width: 100%;
          max-width: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          touch-action: pan-y;
          min-height: 0;
        }

        .mobile-card {
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }

        .mobile-card-img-wrapper {
          width: 100%;
          aspect-ratio: 1;
          max-height: 280px;
          background: #f0fdf4;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .mobile-card-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 12px;
        }

        .mobile-card-img-placeholder {
          font-size: 4rem;
          opacity: 0.3;
        }

        .mobile-card-details {
          padding: 16px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-card-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
          line-height: 1.3;
        }

        .mobile-card-price {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .mobile-price-symbol {
          font-size: 1.1rem;
          font-weight: 600;
          color: #065f46;
        }

        .mobile-price-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: #065f46;
        }

        .mobile-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .mobile-tag {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .mobile-tag-category {
          background: #fef3c7;
          color: #92400e;
        }

        .mobile-tag-available {
          background: #d1fae5;
          color: #065f46;
        }

        .mobile-tag-oos {
          background: #fee2e2;
          color: #991b1b;
        }

        .mobile-tag-stock {
          background: #f3f4f6;
          color: #374151;
        }

        .mobile-card-artist {
          font-size: 0.85rem;
          color: #6b7280;
          margin: 0;
        }

        .mobile-card-desc-section {
          border-top: 1px solid #f3f4f6;
          padding-top: 10px;
        }

        .mobile-card-desc-heading {
          font-size: 0.8rem;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 6px 0;
        }

        .mobile-card-desc-text {
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.55;
          margin: 0;
        }

        /* END CARD */
        .mobile-end-card {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .end-card-content {
          text-align: center;
          padding: 40px 24px;
        }

        .end-card-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .end-card-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .end-card-sub {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0 0 24px 0;
        }

        .end-card-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }

        /* NAVIGATION ROW */
        .mobile-nav-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 14px 0 8px;
          width: 100%;
          max-width: 380px;
        }

        .mobile-nav-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .mobile-nav-btn:active:not(.disabled) {
          transform: scale(0.92);
        }

        .mobile-nav-btn.disabled {
          background: #d1d5db;
          cursor: not-allowed;
          box-shadow: none;
        }

        .mobile-swipe-hint {
          font-size: 0.8rem;
          color: #9ca3af;
          font-weight: 500;
        }
      `}</style>

      <HomeFooter />
    </>
  );
}

/* ================= LOADING STYLES ================= */
const loadingStyles = `
  .catalogue-loading,
  .catalogue-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
    gap: 20px;
  }

  .loading-book {
    position: relative;
    width: 100px;
    height: 130px;
  }

  .loading-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #065f46, #10b981);
    border-radius: 0 6px 6px 0;
    transform-origin: left;
    animation: openBook 2s ease-in-out infinite;
  }

  .loading-pages {
    position: absolute;
    right: 4px;
    top: 4px;
    bottom: 4px;
    left: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .loading-page {
    flex: 1;
    background: #f0fdf4;
    border-radius: 0 3px 3px 0;
  }

  @keyframes openBook {
    0%, 100% { transform: rotateY(0deg); }
    50% { transform: rotateY(-25deg); }
  }

  .loading-text {
    font-size: 1rem;
    color: #065f46;
    font-weight: 500;
  }

  .empty-icon {
    font-size: 4rem;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 1.1rem;
    color: #6b7280;
  }
`;
