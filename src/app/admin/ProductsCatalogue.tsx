'use client';

import { useEffect, useState } from 'react';
import ProductModal from '../user/ProductModal';

/* ================= TYPES ================= */
type Product = {
  id: string;
  name: string;
  price: number;
  cms_image_ids: string[];
  slug?: string;
  description?: string;
};

/* ================= HELPERS ================= */
const getCloudinaryUrl = (
  publicId: string,
  options = "w_600,h_600,c_fill,q_auto,f_auto"
) => {
  if (!publicId) return '/placeholder.png';
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  if (!cloudName) {
    console.warn('Cloudinary cloud name missing');
    return '/placeholder.png';
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/${options}/${publicId}.webp`;
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
                          src={
                            leftProduct.cms_image_ids?.length
                              ? getCloudinaryUrl(leftProduct.cms_image_ids[0], 'w_500,h_500,c_fill,q_auto,f_auto')
                              : '/placeholder.png'
                          }
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
                    <div className="empty-message">
                      {currentPage === 0 ? 'Start browsing →' : '← Previous page'}
                    </div>
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
                          src={
                            rightProduct.cms_image_ids?.length
                              ? getCloudinaryUrl(rightProduct.cms_image_ids[0], 'w_500,h_500,c_fill,q_auto,f_auto')
                              : '/placeholder.png'
                          }
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
                    <div className="empty-message">End of catalogue</div>
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
                              rightProduct.cms_image_ids?.length
                                ? getCloudinaryUrl(rightProduct.cms_image_ids[0], 'w_500,h_500,c_fill,q_auto,f_auto')
                                : '/placeholder.png'
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
                                products[currentPage + 1].cms_image_ids?.length
                                  ? getCloudinaryUrl(products[currentPage + 1].cms_image_ids[0], 'w_500,h_500,c_fill,q_auto,f_auto')
                                  : '/placeholder.png'
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
                              leftProduct.cms_image_ids?.length
                                ? getCloudinaryUrl(leftProduct.cms_image_ids[0], 'w_500,h_500,c_fill,q_auto,f_auto')
                                : '/placeholder.png'
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
                                products[currentPage - 2].cms_image_ids?.length
                                  ? getCloudinaryUrl(products[currentPage - 2].cms_image_ids[0], 'w_500,h_500,c_fill,q_auto,f_auto')
                                  : '/placeholder.png'
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

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={{
            ...selectedProduct,
            image: selectedProduct.cms_image_ids?.length
              ? getCloudinaryUrl(selectedProduct.cms_image_ids[0], 'w_800,h_800,c_fill,q_auto,f_auto')
              : '/placeholder.png',
          }}
          onClose={() => setSelectedProduct(null)}
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
          background: #f9f9f9;
        }

        .empty-message {
          font-size: 1.2rem;
          color: #999;
          font-style: italic;
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
