'use client';

import { useState, useRef, useEffect } from 'react';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductShowcaseSection({
  bestProducts,
  newProducts,
  ratingProducts,
  onProductAction,
}: any) {
  const router = useRouter();
  const [tab, setTab] = useState<'best' | 'new' | 'rating'>('best');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const products =
    tab === 'best'
      ? bestProducts
      : tab === 'new'
      ? newProducts
      : ratingProducts;

  // Scroll check function
  const checkScroll = () => {
    const container = scrollRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  // Scroll function
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 500;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Initial check on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      checkScroll();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Check scroll when products or tab changes
  useEffect(() => {
    if (products && products.length > 0) {
      setTimeout(checkScroll, 150);
    }
  }, [products, tab, bestProducts, newProducts, ratingProducts]);

  // Check scroll on window resize
  useEffect(() => {
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <section className="w-full py-8 bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 xl:px-12">

      {/* TABS */}
      <div className="flex justify-between items-center border-b">
        <div className="flex gap-8 text-sm font-semibold">
          {[
            { key: 'best', label: 'BEST SELLERS' },
            { key: 'new', label: 'NEW ARRIVALS' },
            { key: 'rating', label: 'MOST RATING' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`pb-2 relative ${
                tab === t.key ? 'text-black' : 'text-gray-400'
              }`}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute left-0 -bottom-[1px] w-full h-[3px] bg-green-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Scroll Arrows - Desktop Only */}
        <div className="hidden lg:flex items-center gap-2 pb-2">
          <button
            onClick={() => scroll('left')}
            disabled={!showLeftArrow}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              showLeftArrow
                ? 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!showRightArrow}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              showRightArrow
                ? 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* PRODUCTS */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="mt-6 flex gap-6 overflow-x-auto scrollbar-hide"
      >
        {products?.map((product: any) => (
          <div
            key={product.id}
            onClick={() => router.push(`/product/${product.id}`)}
            className="relative min-w-[220px] sm:min-w-[250px] bg-white rounded-xl shadow-sm hover:shadow-xl transition p-4 group"
          >
            {/* WISHLIST */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProductAction(product, 'wishlist');
              }}
              className="absolute top-3 right-3 w-9 h-9 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center z-13"
            >
              <Heart className="h-4 w-4  text-black hover:text-red-600" />
            </button>

            {/* IMAGE */}
            <div className="h-44 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={
                  product?.images?.[0]?.card ||
                  product?.images?.[0]?.url ||
                  '/placeholder.png'
                }
                className="max-h-full object-contain group-hover:scale-110 transition"
                onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = '/tribal-art-statues-stockcake.webp'; }}
              />
            </div>

            {/* RATING */}
            <div className="flex mt-2 text-orange-400">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="h-4 w-4 fill-orange-400" />
              ))}
            </div>

            {/* NAME */}
            <p className="text-lg font-semibold mt-1 text-black line-clamp-1">
              {product.name}
            </p>

            {/* PRICE */}
            <p className="text-red-600 font-bold">₹{product.price}</p>

            {/* ADD CART */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProductAction(product, 'cart');
              }}
              className="mt-3 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      </div>
    </section>
  );
}
