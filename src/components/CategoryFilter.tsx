'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface Category {
  id: string;
  name: string;
  slug?: string;
  cms_image_id?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  loading?: boolean;
}

// Category image mapping - maps slug to public folder image
const categoryImages: Record<string, string> = {
  'books': '/book.jpeg',
  'cuisine': '/cuisine.jpeg',
  'gifts': '/gift.jpeg',
  'furnishing': '/funtiturre.jpeg',
  'health-hygiene': '/health.jpeg',
  'handloom': '/handloom.jpeg',
  'clothing-accessories': '/clothing.jpeg',
  'art-craft': '/art.jpeg',
  'sustainable-living': '/ecofriend.jpeg',
  'handcrafted-decor': '/handcraft.jpeg',
  'pottery-ceramics': '/pottery.jpeg',
  'spiritual-pooja-items': '/pooja.jpeg',
  'home-living': '/homeandliving.jpeg',
  'eco-friendly-products': '/ecoproducts.jpeg',
  'wall-decor': '/walldecor.jpeg',
  'bamboo-cane-crafts': '/bamboo.jpeg',
  'metal-crafts': '/art.jpeg',
  'wooden-handicrafts': '/bamboo.jpeg',
  'handloom-textiles': '/handloom.jpeg',
  'tribal-paintings': '/tribal-art-statues-stockcake.webp',
};

function getCategoryImage(slug?: string): string | null {
  if (slug && categoryImages[slug]) {
    return categoryImages[slug];
  }
  return null;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
  loading = false,
}: CategoryFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const router = useRouter();
  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  // Handle category click + navigation
  const handleCategoryClick = (categoryId: string | null) => {
    onCategorySelect(categoryId);           // keep your existing logic
    if (categoryId) {
      router.push(`/category/${categoryId}`); // navigate to category page
    } else {
      router.push(`/`);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Shop By Category</h2>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8">
     <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Shop By Category</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!showLeftArrow}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                showLeftArrow
                  ? 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!showRightArrow}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                showRightArrow
                  ? 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Products */}
            <button
              onClick={() => handleCategoryClick(null)}
              className="flex flex-col items-center gap-3 flex-shrink-0 group"
            >
              <div
                className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center transition-all ${
                  selectedCategory === null
                    ? 'bg-green-600 ring-2 ring-green-600 ring-offset-2'
                    : 'bg-gray-100 hover:bg-green-50 group-hover:ring-2 group-hover:ring-green-200 group-hover:ring-offset-2'
                }`}
              >
                <Grid3X3
                  className={`h-8 w-8 lg:h-10 lg:w-10 ${
                    selectedCategory === null ? 'text-white' : 'text-green-600'
                  }`}
                />
              </div>
              <span
                className={`text-sm font-medium text-center ${
                  selectedCategory === null ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                All Products
              </span>
            </button>

            {/* Category Items */}
            {categories.map((category) => {
              const imageUrl = getCategoryImage(category.slug);
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex flex-col items-center gap-3 flex-shrink-0 group"
                >
                  <div
                    className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden transition-all ${
                      isSelected
                        ? 'ring-2 ring-green-600 ring-offset-2'
                        : 'group-hover:ring-2 group-hover:ring-green-200 group-hover:ring-offset-2'
                    } bg-green-50`}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover rounded-full"
                        // className="w-full h-full object-cover object-center p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-100">
                        <span className="text-3xl lg:text-4xl">🌿</span>
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium text-center max-w-[80px] lg:max-w-[96px] truncate ${
                      isSelected ? 'text-green-600' : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </span>
                </button>
              );
            })}

            {/* View More */}
            {/* <button
              onClick={() => handleCategoryClick(null)}
              className="flex flex-col items-center gap-3 flex-shrink-0 group"
            >
              <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full border-2 border-dashed border-green-300 flex items-center justify-center transition-all hover:border-green-500 hover:bg-green-50">
                <span className="text-green-600 font-medium text-sm">View More</span>
              </div>
              <span className="text-sm font-medium text-green-600 hover:underline">
                Browse All
              </span>
            </button> */}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}