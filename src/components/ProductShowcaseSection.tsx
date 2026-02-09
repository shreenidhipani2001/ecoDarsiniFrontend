'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductShowcaseSection({
  bestProducts,
  newProducts,
  ratingProducts,
  onProductAction,
}: any) {
  const router = useRouter();
  const [tab, setTab] = useState<'best' | 'new' | 'rating'>('best');

  const products =
    tab === 'best'
      ? bestProducts
      : tab === 'new'
      ? newProducts
      : ratingProducts;

  return (
    <section className="w-full py-8 bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 xl:px-12">

      {/* TABS */}
      <div className="flex gap-8 border-b text-sm font-semibold">
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

      {/* PRODUCTS */}
      <div className="mt-6 flex gap-6 overflow-x-auto scrollbar-hide">
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
