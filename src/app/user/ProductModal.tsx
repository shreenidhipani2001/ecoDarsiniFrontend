'use client';

import { X, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import yyy from '../../../public/bdjhbawdhja.jpeg';


type Product = {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string | StaticImageData;
  // description?: string;  ← add later
};

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const finalPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;
    console.log("Product Image:", product);

  const handleAddToCart = () => {
    // TODO: call your addToCart API
    console.log('Added to cart:', product.id);
    alert('Added to cart!');
  };

  const handleAddToWishlist = () => {
    // TODO: call your wishlist API
    console.log('Added to wishlist:', product.id);
    alert('Added to wishlist!');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 p-2  rounded-full bg-red-400 hover:bg-red-500 transition"
        >
          <X size={15} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/2 relative aspect-square md:aspect-[4/5]">
            {/* <Image
              src={product.image}
              alt={product.name}
              fill
                placeholder="blur"
                blurDataURL="/blur.png"
              className="object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
            /> */}
           <Image
                src={product.image ?? yyy}
                alt={product.name}
                fill
                placeholder="blur"
                className="object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                />

          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex-1 flex flex-col">
            <h2 className="text-2xl font-bold mt-3 text-gray-900">{product.name}</h2>

            {/* <div className="mt-50 flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-600">₹{finalPrice}</span>
              {product.discount && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-900 line-through">₹{product.price}</span>
                  <span className="text-sm font-medium text-green-600">{product.discount}% OFF</span>
                </div>
              )}
            </div> */}

                <div className="mt-5 flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                    ₹{finalPrice}
                </span>

                {/* {product.discount && (
                    <div className="flex flex-col">
                    <span className="text-sm text-gray-500 line-through">
                        ₹{product.price}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                        {product.discount}% OFF
                    </span>
                    </div>
                )} */}
               {typeof product.discount === 'number' && product.discount > 0 && (
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 line-through">
                        ₹{product.price}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                        {product.discount}% OFF
                        </span>
                    </div>
                    )}

                </div>


            {/* Add more product info later: description, variants, reviews... */}

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button
                onClick={handleAddToWishlist}
                className="p-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
                title="Add to Wishlist"
              >
                <Heart size={24} className="text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}