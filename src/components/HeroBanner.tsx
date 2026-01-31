'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

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
  price: string;
  slug: string;
  description?: string;
  category_name?: string;
  artist_name?: string;
  images?: ProductImage[];
}

interface HeroBannerProps {
  onShopNowClick: () => void;
  featuredProducts?: Product[];
}

// Default banner slides when no products available
const defaultSlides = [
  {
    id: '1',
    title: 'Handcrafted',
    subtitle: 'Eco-Friendly Collection 2026',
    description: 'Discover our curated collection of sustainable, earth-friendly products. Every purchase supports local artisans and helps protect our planet.',
    bgColor: 'from-green-600 to-green-800',
  },
  {
    id: '2',
    title: 'Traditional',
    subtitle: 'Tribal Art Collection',
    description: 'Experience the beauty of traditional tribal paintings and artwork. Each piece tells a story of cultural heritage and artistic excellence.',
    bgColor: 'from-emerald-600 to-teal-800',
  },
  {
    id: '3',
    title: 'Artisan',
    subtitle: 'Brass & Pottery Collection',
    description: 'Explore our handmade brass artifacts and ceramic pottery. Crafted with love by skilled artisans using time-honored techniques.',
    bgColor: 'from-green-700 to-emerald-900',
  },
];

export default function HeroBanner({ onShopNowClick, featuredProducts = [] }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Use featured products if available, otherwise use default slides
  const hasProducts = featuredProducts.length > 0;
  const slideCount = hasProducts ? Math.min(featuredProducts.length, 5) : defaultSlides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url || product.images[0].card || '';
    }
    return '';
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
      {/* Carousel Container */}
      <div className="relative h-[400px] sm:h-[450px] lg:h-[500px]">
        {/* Slides */}
        {hasProducts ? (
          // Product-based slides
          featuredProducts.slice(0, 5).map((product, index) => (
            <div
              key={product.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center h-full py-8 lg:py-12">
                  {/* Left Content */}
                  <div className="text-center lg:text-left z-20">
                    <span className="inline-block px-4 py-1.5 bg-green-600/10 text-green-700 text-sm font-medium rounded-full mb-4">
                      {product.category_name || 'Featured Product'}
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                      {product.name}
                    </h1>
                    <p className="text-base lg:text-lg text-gray-600 mb-6 max-w-lg mx-auto lg:mx-0 line-clamp-3">
                      {product.description || `Handcrafted by ${product.artist_name || 'skilled artisans'}. A beautiful piece that brings nature into your home.`}
                    </p>
                    <div className="flex items-center gap-4 justify-center lg:justify-start mb-6">
                      <span className="text-2xl lg:text-3xl font-bold text-green-600">
                        ₹{parseFloat(product.price).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={onShopNowClick}
                      className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Shop Now
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Right Content - Product Image */}
                  <div className="relative h-64 lg:h-full flex items-center justify-center">
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
                      {getProductImage(product) ? (
                        <Image
                          src={getProductImage(product)}
                          alt={product.name}
                          fill
                          className="object-contain drop-shadow-2xl"
                          priority={index === 0}
                        />
                      ) : (
                        <div className="w-full h-full bg-green-200/50 rounded-2xl flex items-center justify-center">
                          <span className="text-green-600 text-lg">Product Image</span>
                        </div>
                      )}
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -z-10 w-72 h-72 lg:w-96 lg:h-96 bg-green-200/30 rounded-full blur-3xl" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Default slides when no products
          defaultSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className={`h-full bg-gradient-to-br ${slide.bgColor}`}>
                <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center h-full py-8 lg:py-12">
                    {/* Left Content */}
                    <div className="text-center lg:text-left">
                      <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-sm font-medium rounded-full mb-4">
                        {slide.title}
                      </span>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                        {slide.subtitle}
                      </h1>
                      <p className="text-base lg:text-lg text-white/80 mb-8 max-w-lg mx-auto lg:mx-0">
                        {slide.description}
                      </p>
                      <button
                        onClick={onShopNowClick}
                        className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Shop Now
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Right Content - Decorative */}
                    <div className="hidden lg:flex items-center justify-center relative">
                      <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-48 h-48 lg:w-60 lg:h-60 bg-white/10 rounded-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-white mb-2">20%</div>
                            <div className="text-white/80">OFF</div>
                            <div className="text-sm text-white/60 mt-1">First Order</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-green-600 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-green-600 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-green-600 w-8'
                  : 'bg-gray-400/50 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
