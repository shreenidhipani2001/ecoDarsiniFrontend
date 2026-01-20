'use client';

import { useEffect, useState } from 'react';
import ProductModal from '../user/ProductModal';  

/* ================= TYPES ================= */
type Product = {
  id: string;
  name: string;
  price: number;
  cms_image_ids: string[];    // array of public_ids from your DB
  slug?: string;              // optional
  // discount?: number;       // add later if your API provides it
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
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState<"next" | "prev" | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /* ========== FETCH PRODUCTS ========== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) throw new Error('API URL not set');

        const res = await fetch(`${apiUrl}/api/products/`, {
          cache: 'no-store', // ← or use revalidate if you prefer
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        // Adjust according to your actual response shape
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

  /* ========== PAGINATION / SPREAD LOGIC ========== */
  const totalPages = products.length;
  const maxSpread = Math.floor((totalPages - 1) / 2);

  const leftPageNum = currentSpread * 2 + 1;
  const rightPageNum = currentSpread * 2 + 2;

  const leftProduct = products[leftPageNum - 1];
  const rightProduct = products[rightPageNum - 1];

  /* ========== NAVIGATION ========== */
  const goNext = () => {
    if (currentSpread >= maxSpread || isTurning) return;
    setIsTurning(true);
    setTurnDirection('next');
    setTimeout(() => {
      setCurrentSpread((prev) => prev + 1);
      setIsTurning(false);
      setTurnDirection(null);
    }, 900);
  };

  const goPrev = () => {
    if (currentSpread <= 0 || isTurning) return;
    setIsTurning(true);
    setTurnDirection('prev');
    setTimeout(() => {
      setCurrentSpread((prev) => prev - 1);
      setIsTurning(false);
      setTurnDirection(null);
    }, 900);
  };

  /* ========== LOADING / EMPTY STATES ========== */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading catalogue…
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        No products available
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <>
      <div className="book-container">
        <button
          className="nav-btn prev"
          onClick={goPrev}
          disabled={currentSpread === 0 || isTurning}
        >
          ◀
        </button>

        <div className={`book ${isTurning ? 'turning' : ''} ${turnDirection || ''}`}>
          {/* LEFT PAGE – clickable */}
          <div
            className="page left-page"
            onClick={() => leftProduct && setSelectedProduct(leftProduct)}
            style={{ cursor: leftProduct ? 'pointer' : 'default' }}
          >
            {leftProduct ? (
              <div className="page-content text-gray-800">
                <h2>{leftProduct.name}</h2>
                <img
                  src={
                    leftProduct.cms_image_ids?.length
                      ? getCloudinaryUrl(leftProduct.cms_image_ids[0], 'w_560,h_560,c_fill,q_auto,f_auto')
                      : '/placeholder.png'
                  }
                  alt={leftProduct.name}
                  className="product-image"
                />
                <p className="price">₹{leftProduct.price}</p>
              </div>
            ) : (
              <div className="empty-page" />
            )}
          </div>

          {/* RIGHT PAGE – clickable */}
          <div
            className={`page right-page ${
              isTurning
                ? turnDirection === 'next'
                  ? 'flip-forward'
                  : 'flip-backward'
                : ''
            }`}
            onClick={() => rightProduct && setSelectedProduct(rightProduct)}
            style={{ cursor: rightProduct ? 'pointer' : 'default' }}
          >
            {rightProduct ? (
              <div className="page-content text-gray-800">
                <h2>{rightProduct.name}</h2>
                <img
                  src={
                    rightProduct.cms_image_ids?.length
                      ? getCloudinaryUrl(rightProduct.cms_image_ids[0], 'w_560,h_560,c_fill,q_auto,f_auto')
                      : '/placeholder.png'
                  }
                  alt={rightProduct.name}
                  className="product-image"
                />
                <p className="price">₹{rightProduct.price}</p>
              </div>
            ) : (
              <div className="empty-page" />
            )}
          </div>

          {/* FLIPPING PAGE (animation helper) */}
          {isTurning && (
            <div className={`page flipping-page ${turnDirection}`}>
              <div className="page-content front">
                <h2>
                  {turnDirection === 'next' ? rightProduct?.name : leftProduct?.name}
                </h2>
              </div>
              <div className="page-content back">
                <h2>Next</h2>
              </div>
            </div>
          )}
        </div>

        <button
          className="nav-btn next"
          onClick={goNext}
          disabled={currentSpread >= maxSpread || isTurning}
        >
          ▶
        </button>
      </div>

      {/* Modal – same one used in dashboard grid */}
      {selectedProduct && (
        <ProductModal
          product={{
            ...selectedProduct,
            image: selectedProduct.cms_image_ids?.length
              ? getCloudinaryUrl(selectedProduct.cms_image_ids[0], 'w_800,h_800,c_fill,q_auto,f_auto')
              : '/placeholder.png',
          }}
          onClose={() => setSelectedProduct(null)}
          // addToCart={...}  ← connect later
          // addToWishlist={...}
        />
      )}

      {/* ================= CSS (unchanged) ================= */}
      <style jsx>{`
        .book-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          min-height: 100vh;
          background: #f4f4f5;
          perspective: 2000px;
        }

        .nav-btn {
          font-size: 28px;
          padding: 10px 16px;
          border: none;
          background: #111;
          color: #fff;
          cursor: pointer;
          border-radius: 6px;
        }

        .nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .book {
          position: relative;
          width: 700px;
          height: 420px;
          display: flex;
          transform-style: preserve-3d;
        }

        .page {
          width: 50%;
          height: 100%;
          background: #fff;
          border: 1px solid #ddd;
          overflow: hidden;
          backface-visibility: hidden;
        }

        .left-page {
          border-right: none;
        }

        .right-page {
          border-left: none;
          transform-origin: left center;
        }

        .page-content {
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .product-image {
          width: 100%;
          max-height: 260px;
          object-fit: contain;
          border-radius: 6px;
          margin: 16px 0;
        }

        .price {
          font-weight: bold;
          font-size: 1.3rem;
          margin-top: auto;
        }

        .empty-page {
          width: 100%;
          height: 100%;
          background: #eee;
        }

        .book.turning {
          pointer-events: none;
        }

        .right-page.flip-forward {
          animation: flipForward 0.9s ease-in-out forwards;
        }

        .right-page.flip-backward {
          animation: flipBackward 0.9s ease-in-out forwards;
        }

        .flipping-page {
          position: absolute;
          width: 50%;
          height: 100%;
          right: 0;
          top: 0;
          transform-style: preserve-3d;
          transform-origin: left center;
          z-index: 10;
          background: white;
        }

        .flipping-page.next {
          animation: flipForward 0.9s ease-in-out forwards;
        }

        .flipping-page.prev {
          animation: flipBackward 0.9s ease-in-out forwards;
        }

        .flipping-page .front,
        .flipping-page .back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flipping-page .back {
          transform: rotateY(180deg);
        }

        @keyframes flipForward {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-180deg); }
        }

        @keyframes flipBackward {
          0% { transform: rotateY(-180deg); }
          100% { transform: rotateY(0deg); }
        }
      `}</style>
    </>
  );
}