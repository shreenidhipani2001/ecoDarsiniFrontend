'use client';

import { useEffect, useState } from 'react';
import ProductDetailModal from '../../components/ProductDetailModal';
import { useAuthStore } from '../../store/useAuthStore';

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
  price: number;
  cms_image_ids: string[];
  images?: ProductImage[];  // Images from Payload CMS
  slug: string;
  description?: string;
  stock: number;
  category_id: string;
  artist_name?: string;
  is_active: boolean;
  created_at?: string;
};

/* ================= HELPERS ================= */
// Get image URL from Payload CMS images array
const getProductImageUrl = (product: Product, size: 'thumbnail' | 'card' | 'full' | 'url' = 'card'): string => {
  if (!product.images || product.images.length === 0) {
    return '/placeholder.png';
  }
  const image = product.images[0];
  return image[size] || image.url || '/placeholder.png';
};

/* ================= COMPONENT ================= */
export default function BookFlip() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev' | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);

  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

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
        setProducts(productList);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ========== PAGINATION LOGIC ========== */
  const totalPages = products.length;
  const leftProduct = currentPage > 0 ? products[currentPage - 1] : null;
  const rightProduct = currentPage < totalPages ? products[currentPage] : null;

  /* ========== NAVIGATION ========== */
  const goNext = () => {
    if (currentPage >= totalPages || isTurning) return;
    setIsTurning(true);
    setTurnDirection('next');
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsTurning(false);
      setTurnDirection(null);
    }, 800);
  };

  const goPrev = () => {
    if (currentPage <= 0 || isTurning) return;
    setIsTurning(true);
    setTurnDirection('prev');
    setTimeout(() => {
      setCurrentPage((prev) => prev - 1);
      setIsTurning(false);
      setTurnDirection(null);
    }, 800);
  };

  /* ========== KEYBOARD NAVIGATION ========== */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, isTurning]);

  /* ========== LOADING / EMPTY STATES ========== */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mb-4 mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading catalogue...</p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <p className="text-gray-600 text-xl">No products available</p>
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <>
      <div className="catalogue-wrapper">
        {/* Page counter */}
        <div className="page-counter-top">
          Page {currentPage} of {totalPages}
        </div>

        {/* Main book container */}
        <div className="book-scene">
          {/* Navigation Buttons */}
          <button
            className={`nav-arrow nav-arrow-left ${currentPage === 0 ? 'disabled' : ''}`}
            onClick={goPrev}
            disabled={currentPage === 0 || isTurning}
            aria-label="Previous page"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            className={`nav-arrow nav-arrow-right ${currentPage >= totalPages ? 'disabled' : ''}`}
            onClick={goNext}
            disabled={currentPage >= totalPages || isTurning}
            aria-label="Next page"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Book Container */}
          <div className={`book-container ${isTurning ? 'turning' : ''}`}>
            <div className="book">
              {/* Book Spine Shadow */}
              <div className="book-spine"></div>

              {/* LEFT PAGE */}
              <div
                className={`page page-left ${hoverSide === 'left' && !isTurning ? 'hover' : ''}`}
                onClick={() => {
                  if (leftProduct && !isTurning) {
                    setSelectedProduct(leftProduct);
                  } else if (!isTurning) {
                    goPrev();
                  }
                }}
                onMouseEnter={() => setHoverSide('left')}
                onMouseLeave={() => setHoverSide(null)}
              >
                {leftProduct ? (
                  <div className="page-content">
                    <div className="product-card">
                      <div className="product-image-wrapper">
                        <img
                          src={getProductImageUrl(leftProduct, 'card')}
                          alt={leftProduct.name}
                          className="product-image"
                        />
                      </div>
                      <h3 className="product-name">{leftProduct.name}</h3>
                      <p className="product-price">₹{leftProduct.price.toLocaleString()}</p>
                      <div className="click-hint">Click for details</div>
                    </div>
                    <div className="page-number">{currentPage - 1}</div>
                  </div>
                ) : (
                  <div className="page-content empty">
                    {currentPage === 0 ? (
                      /* Welcome / Start Page */
                      <div className="welcome-container">
                        <div className="floating-leaves">
                          <span className="leaf leaf-1">🌿</span>
                          <span className="leaf leaf-2">🍃</span>
                          <span className="leaf leaf-3">🌱</span>
                          <span className="leaf leaf-4">☘️</span>
                        </div>
                        <div className="welcome-icon">
                          <svg viewBox="0 0 100 100" className="eco-circle">
                            <circle cx="50" cy="50" r="45" className="circle-bg" />
                            <circle cx="50" cy="50" r="45" className="circle-progress" />
                          </svg>
                          <span className="book-icon">📖</span>
                        </div>
                        <h3 className="welcome-title text-blacj">Welcome to Our Catalogue</h3>
                        <p className="welcome-subtitle">Discover eco-friendly products</p>
                        <div className="arrow-hint">
                          <span>Start browsing</span>
                          <div className="bouncing-arrow">→</div>
                        </div>
                      </div>
                    ) : (
                      /* Previous Page Hint */
                      <div className="nav-hint-container">
                        <div className="pulse-circle"></div>
                        <div className="nav-arrow-animated">
                          <span className="sliding-arrow">←</span>
                        </div>
                        <p className="nav-text">Previous page</p>
                        <div className="page-dots">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot active"></span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT PAGE */}
              <div
                className={`page page-right ${hoverSide === 'right' && !isTurning ? 'hover' : ''}`}
                onClick={() => {
                  if (rightProduct && !isTurning) {
                    setSelectedProduct(rightProduct);
                  } else if (!isTurning) {
                    goNext();
                  }
                }}
                onMouseEnter={() => setHoverSide('right')}
                onMouseLeave={() => setHoverSide(null)}
              >
                {rightProduct ? (
                  <div className="page-content">
                    <div className="product-card">
                      <div className="product-image-wrapper">
                        <img
                          src={getProductImageUrl(rightProduct, 'card')}
                          alt={rightProduct.name}
                          className="product-image"
                        />
                      </div>
                      <h3 className="product-name">{rightProduct.name}</h3>
                      <p className="product-price">₹{rightProduct.price.toLocaleString()}</p>
                      <div className="click-hint">Click for details</div>
                    </div>
                    <div className="page-number">{currentPage}</div>
                  </div>
                ) : (
                  <div className="page-content empty">
                    {/* End of Catalogue */}
                    <div className="end-container">
                      <div className="sparkles">
                        <span className="sparkle sparkle-1">✨</span>
                        <span className="sparkle sparkle-2">⭐</span>
                        <span className="sparkle sparkle-3">✨</span>
                      </div>
                      <div className="end-icon">
                        <div className="rotating-ring"></div>
                        <span className="check-icon">🌍</span>
                      </div>
                      <h3 className="end-title">You've seen it all!</h3>
                      <p className="end-subtitle">Thank you for exploring</p>
                      <div className="eco-badge">
                        <span className="badge-icon">🌿</span>
                        <span className="badge-text">Eco Friendly</span>
                      </div>
                      <div className="restart-hint">
                        <span className="sliding-arrow-left">←</span>
                        <span>Go back to explore</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TURNING PAGE - appears during animation */}
              {isTurning && turnDirection === 'next' && rightProduct && (
                <div className="turning-page turning-next">
                  <div className="turning-page-front">
                    <div className="page-content">
                      <div className="product-card">
                        <div className="product-image-wrapper">
                          <img
                            src={
                              getProductImageUrl(rightProduct, 'card')
                            }
                            alt={rightProduct.name}
                            className="product-image"
                          />
                        </div>
                        <h3 className="product-name">{rightProduct.name}</h3>
                        <p className="product-price">₹{rightProduct.price.toLocaleString()}</p>
                      </div>
                      <div className="page-number">{currentPage}</div>
                    </div>
                  </div>
                  <div className="turning-page-back">
                    <div className="page-content">
                      {products[currentPage + 1] && (
                        <div className="product-card">
                          <div className="product-image-wrapper">
                            <img
                              src={
                                getProductImageUrl(products[currentPage + 1], 'card')
                              }
                              alt={products[currentPage + 1].name}
                              className="product-image"
                            />
                          </div>
                          <h3 className="product-name">{products[currentPage + 1].name}</h3>
                          <p className="product-price">₹{products[currentPage + 1].price.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TURNING PAGE BACKWARD - appears during prev animation */}
              {isTurning && turnDirection === 'prev' && leftProduct && (
                <div className="turning-page turning-prev">
                  <div className="turning-page-front">
                    <div className="page-content">
                      <div className="product-card">
                        <div className="product-image-wrapper">
                          <img
                            src={
                              getProductImageUrl(leftProduct, 'card')
                            }
                            alt={leftProduct.name}
                            className="product-image"
                          />
                        </div>
                        <h3 className="product-name">{leftProduct.name}</h3>
                        <p className="product-price">₹{leftProduct.price.toLocaleString()}</p>
                      </div>
                      <div className="page-number">{currentPage - 1}</div>
                    </div>
                  </div>
                  <div className="turning-page-back">
                    <div className="page-content">
                      {products[currentPage - 2] && (
                        <div className="product-card">
                          <div className="product-image-wrapper">
                            <img
                              src={
                                getProductImageUrl(products[currentPage - 2], 'card')
                              }
                              alt={products[currentPage - 2].name}
                              className="product-image"
                            />
                          </div>
                          <h3 className="product-name">{products[currentPage - 2].name}</h3>
                          <p className="product-price">₹{products[currentPage - 2].price.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation hints */}
        <div className="navigation-hints">
          <p>Use arrow keys ← → or click on pages to navigate</p>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          imageUrl={getProductImageUrl(selectedProduct, 'full')}
          isAdmin={isAdmin}
          onClose={() => setSelectedProduct(null)}
          onProductUpdate={(updatedProduct) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
            );
            setSelectedProduct(updatedProduct);
          }}
        />
      )}

      {/* ================= STYLES ================= */}
      <style jsx>{`
        .catalogue-wrapper {
          min-height: calc(100vh - 100px);
          background: transparent;
          display: flex;
          flex-direction: column;
          padding: 0;
        }

        .page-counter-top {
          text-align: center;
          margin-bottom: 20px;
          font-size: 1.1rem;
          color: #10b981;
          font-weight: 600;
        }

        .book-scene {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 2500px;
          position: relative;
          padding: 40px 20px;
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          background: rgba(16, 185, 129, 0.9);
          color: white;
          border: none;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .nav-arrow:hover:not(.disabled) {
          background: #10b981;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
        }

        .nav-arrow.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-arrow-left {
          left: 20px;
        }

        .nav-arrow-right {
          right: 20px;
        }

        .book-container {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s ease;
        }

        .book-container.turning {
          pointer-events: none;
        }

        .book {
          position: relative;
          width: 900px;
          height: 600px;
          display: flex;
          transform-style: preserve-3d;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .book-spine {
          position: absolute;
          left: 50%;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to right,
            rgba(0, 0, 0, 0.3),
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.3)
          );
          transform: translateX(-50%);
          z-index: 10;
        }

        .page {
          position: relative;
          width: 50%;
          height: 100%;
          background: #fefefe;
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          cursor: pointer;
          overflow: hidden;
        }

        .page-left {
          border-right: 1px solid #ddd;
          box-shadow: inset -20px 0 30px rgba(0, 0, 0, 0.08);
        }

        .page-right {
          border-left: 1px solid #ddd;
          box-shadow: inset 20px 0 30px rgba(0, 0, 0, 0.08);
        }

        .page.hover {
          background: #fff;
        }

        /* TURNING PAGE ELEMENT */
        .turning-page {
          position: absolute;
          width: 50%;
          height: 100%;
          top: 0;
          transform-style: preserve-3d;
          z-index: 20;
        }

        .turning-page-front,
        .turning-page-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          background: #fefefe;
          border: 1px solid #ddd;
        }

        .turning-page-back {
          transform: rotateY(180deg);
        }

        /* TURN NEXT - from right edge, turn to left */
        .turning-page.turning-next {
          right: 0;
          transform-origin: left center;
          animation: turnPageNext 0.8s cubic-bezier(0.65, 0.05, 0.36, 1) forwards;
        }

        @keyframes turnPageNext {
          0% {
            transform: rotateY(0deg) translateZ(0);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          }
          25% {
            transform: rotateY(-20deg) translateZ(30px);
            box-shadow: -5px 0 30px rgba(0, 0, 0, 0.3);
          }
          50% {
            transform: rotateY(-90deg) translateZ(60px);
            box-shadow: -15px 0 50px rgba(0, 0, 0, 0.5);
          }
          75% {
            transform: rotateY(-160deg) translateZ(30px);
            box-shadow: -5px 0 30px rgba(0, 0, 0, 0.3);
          }
          100% {
            transform: rotateY(-180deg) translateZ(0);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          }
        }

        /* TURN PREV - from left edge, turn to right */
        .turning-page.turning-prev {
          left: 0;
          transform-origin: right center;
          animation: turnPagePrev 0.8s cubic-bezier(0.65, 0.05, 0.36, 1) forwards;
        }

        @keyframes turnPagePrev {
          0% {
            transform: rotateY(0deg) translateZ(0);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          }
          25% {
            transform: rotateY(20deg) translateZ(30px);
            box-shadow: 5px 0 30px rgba(0, 0, 0, 0.3);
          }
          50% {
            transform: rotateY(90deg) translateZ(60px);
            box-shadow: 15px 0 50px rgba(0, 0, 0, 0.5);
          }
          75% {
            transform: rotateY(160deg) translateZ(30px);
            box-shadow: 5px 0 30px rgba(0, 0, 0, 0.3);
          }
          100% {
            transform: rotateY(180deg) translateZ(0);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          }
        }

        .page-content {
          width: 100%;
          height: 100%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .page-content.empty {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%);
          overflow: hidden;
        }

        /* ========== WELCOME CONTAINER ========== */
        .welcome-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          text-align: center;
        }

        .floating-leaves {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .leaf {
          position: absolute;
          font-size: 1.5rem;
          animation: floatLeaf 4s ease-in-out infinite;
        }

        .leaf-1 { top: 10%; left: 15%; animation-delay: 0s; }
        .leaf-2 { top: 20%; right: 20%; animation-delay: 1s; }
        .leaf-3 { bottom: 25%; left: 20%; animation-delay: 2s; }
        .leaf-4 { bottom: 15%; right: 15%; animation-delay: 0.5s; }

        @keyframes floatLeaf {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-15px) rotate(10deg); opacity: 1; }
        }

        .welcome-icon {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .eco-circle {
          position: absolute;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .circle-bg {
          fill: none;
          stroke: #bbf7d0;
          stroke-width: 4;
        }

        .circle-progress {
          fill: none;
          stroke: #10b981;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: 283;
          stroke-dashoffset: 283;
          animation: drawCircle 2s ease-out forwards, pulseGlow 2s ease-in-out infinite 2s;
        }

        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }

        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.5)); }
          50% { filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.8)); }
        }

        .book-icon {
          font-size: 2.5rem;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .welcome-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #065f46;
          margin-bottom: 8px;
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .welcome-subtitle {
          font-size: 1rem;
          color: #059669;
          margin-bottom: 24px;
          animation: fadeInUp 0.8s ease-out 0.5s both;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .arrow-hint {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #10b981;
          font-weight: 600;
          font-size: 1.1rem;
          animation: fadeInUp 0.8s ease-out 0.7s both;
        }

        .bouncing-arrow {
          animation: bounceRight 1s ease-in-out infinite;
          font-size: 1.5rem;
        }

        @keyframes bounceRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }

        /* ========== NAV HINT CONTAINER ========== */
        .nav-hint-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .pulse-circle {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        .nav-arrow-animated {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
          animation: floatIcon 3s ease-in-out infinite;
        }

        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .sliding-arrow {
          font-size: 2rem;
          color: white;
          font-weight: bold;
          animation: slideLeft 1.5s ease-in-out infinite;
        }

        @keyframes slideLeft {
          0%, 100% { transform: translateX(5px); opacity: 0.7; }
          50% { transform: translateX(-5px); opacity: 1; }
        }

        .nav-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #065f46;
          margin-bottom: 16px;
        }

        .page-dots {
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #bbf7d0;
          transition: all 0.3s ease;
        }

        .dot.active {
          width: 24px;
          border-radius: 4px;
          background: #10b981;
        }

        /* ========== END CONTAINER ========== */
        .end-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          text-align: center;
        }

        .sparkles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          font-size: 1.2rem;
          animation: twinkle 2s ease-in-out infinite;
        }

        .sparkle-1 { top: 15%; left: 25%; animation-delay: 0s; }
        .sparkle-2 { top: 10%; right: 25%; animation-delay: 0.7s; }
        .sparkle-3 { bottom: 20%; left: 30%; animation-delay: 1.4s; }

        @keyframes twinkle {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        .end-icon {
          position: relative;
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .rotating-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top-color: #10b981;
          border-right-color: #10b981;
          border-radius: 50%;
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .check-icon {
          font-size: 2.5rem;
          animation: popIn 0.6s ease-out;
        }

        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        .end-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #065f46;
          margin-bottom: 6px;
        }

        .end-subtitle {
          font-size: 0.95rem;
          color: #059669;
          margin-bottom: 16px;
        }

        .eco-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 6px 25px rgba(16, 185, 129, 0.5); }
        }

        .badge-icon {
          font-size: 1rem;
        }

        .restart-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .sliding-arrow-left {
          animation: slideLeft 1.5s ease-in-out infinite;
          font-weight: bold;
          color: #10b981;
        }

        .product-card {
          width: 100%;
          max-width: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .product-image-wrapper {
          width: 100%;
          height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .page:hover .product-image-wrapper {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }

        .product-name {
          font-size: 1.4rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .product-price {
          font-size: 1.8rem;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 10px;
        }

        .click-hint {
          font-size: 0.9rem;
          color: #666;
          opacity: 0;
          transition: opacity 0.3s ease;
          margin-top: 8px;
        }

        .page:hover .click-hint {
          opacity: 1;
        }

        .page-number {
          position: absolute;
          bottom: 20px;
          font-size: 0.9rem;
          color: #999;
          font-weight: 500;
        }

        .page-left .page-number {
          left: 30px;
        }

        .page-right .page-number {
          right: 30px;
        }

        .navigation-hints {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 0.95rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .book {
            width: 700px;
            height: 500px;
          }

          .product-image-wrapper {
            height: 280px;
          }
        }

        @media (max-width: 768px) {
          .book {
            width: 90vw;
            max-width: 600px;
            height: 400px;
          }

          .product-image-wrapper {
            height: 200px;
          }

          .product-name {
            font-size: 1.1rem;
          }

          .product-price {
            font-size: 1.4rem;
          }

          .nav-arrow {
            width: 50px;
            height: 50px;
          }

          .page-content {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .book {
            height: 350px;
          }

          .product-image-wrapper {
            height: 150px;
          }

          .product-name {
            font-size: 1rem;
          }

          .product-price {
            font-size: 1.2rem;
          }

          .nav-arrow-left {
            left: 10px;
          }

          .nav-arrow-right {
            right: 10px;
          }
        }
      `}</style>
    </>
  );
}
