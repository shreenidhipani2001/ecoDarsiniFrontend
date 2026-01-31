'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../public/svg/Logo';

interface HeroBannerProps {
  onShopNowClick: () => void;
}

const slides = [
  {
    id: '1',
    title: 'Handcrafted',
    subtitle: 'Eco-Friendly Collection 2026',
    description: 'Discover our curated collection of sustainable, earth-friendly products. Every purchase supports local artisans and helps protect our planet.',
    bgColor: 'from-green-600 to-green-800',
    image: '/necklace.jpeg', // Show Logo with discount badge
  },
  {
    id: '2',
    title: 'Traditional',
    subtitle: 'Tribal Art Collection',
    description: 'Experience the beauty of traditional tribal paintings and artwork. Each piece tells a story of cultural heritage and artistic excellence.',
    bgColor: 'from-emerald-600 to-teal-800',
    image: '/imgCourousel1.jpeg',
  },
  {
    id: '3',
    title: 'Artisan',
    subtitle: 'Brass & Pottery Collection',
    description: 'Explore our handmade brass artifacts and ceramic pottery. Crafted with love by skilled artisans using time-honored techniques.',
    bgColor: 'from-green-700 to-emerald-900',
    image: '/tribal-art-statues-stockcake.webp',
  },
];

export default function HeroBanner({ onShopNowClick }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[400px] sm:h-[450px] lg:h-[500px]">
        {slides.map((slide, index) => (
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

                  {/* Right Content - Image or Logo with Badge */}
                  <div className="hidden lg:flex items-center justify-center relative">
                    {slide.image ? (
                      // Show image for slides with images
                      <div className="relative w-72 h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                          src={slide.image}
                          alt={slide.subtitle}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                        {/* Decorative overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    ) : (
                      // Show Logo with discount badge for first slide
                      <div className="relative flex flex-col items-center">
                        {/* Logo */}
                        <div className="w-48 h-48 lg:w-56 lg:h-56 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm p-6">
                          <Logo className="w-full h-full drop-shadow-lg" style={{ filter: 'brightness(0) invert(1)' }} />
                        </div>
                        {/* Discount Badge */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 lg:w-28 lg:h-28 bg-white rounded-full flex items-center justify-center shadow-xl">
                          <div className="text-center">
                            <div className="text-2xl lg:text-3xl font-bold text-green-600">20%</div>
                            <div className="text-xs text-gray-600 font-medium">OFF</div>
                            <div className="text-[10px] text-gray-400">First Order</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        {/* <button
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
        </button> */}

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
