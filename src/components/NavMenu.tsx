'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight,Clipboard,Package,CalendarDays, Menu, Book, Phone, Home } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug?: string;
}

type SectionType =
  | 'products'
  | 'about'
  | 'events'
  | 'contact'
  | 'ecatalogue'
  | 'blogs';

interface Subcategory {
  id: string;
  name: string;
  slug?: string;
  category_id: string;
}

interface NavMenuProps {
  categories: Category[];
  subcategoriesByCategory: Record<string, Subcategory[]>;
  loading: boolean;
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategorySelect: (subcategoryId: string | null, categoryId: string | null) => void;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onSectionChange: (section: SectionType) => void;
}

export default function NavMenu({
  categories,
  subcategoriesByCategory,
  loading,
  onCategorySelect,
  onSubcategorySelect,
  selectedCategory,
  selectedSubcategory,
  onSectionChange
}: NavMenuProps) {
  
  const [activeMoreDropdown, setActiveMoreDropdown] = useState(false);
  const [activeNestedId, setActiveNestedId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const hiddenCategories = categories; // all inside menu

  /* ---------------- TOGGLES ---------------- */

  const toggleMoreDropdown = () => {
    setActiveMoreDropdown((prev) => !prev);
    setActiveNestedId(null);
  };

  const toggleNested = (categoryId: string) => {
    setActiveNestedId((prev) => (prev === categoryId ? null : categoryId));
  };

  const closeAll = () => {
    setActiveMoreDropdown(false);
    setActiveNestedId(null);
  };

  /* ---------------- OUTSIDE CLICK ---------------- */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeAll();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    onSubcategorySelect(null, categoryId);
    closeAll();
  };

  const handleSubcategoryClick = (subcategoryId: string, categoryId: string) => {
    onSubcategorySelect(subcategoryId, categoryId);
    closeAll();
  };

  const handleHomeClick = () => {
    onCategorySelect(null);
    onSubcategorySelect(null, null);
    closeAll();
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <nav className="bg-black-600 text-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-12 gap-3">
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <nav className="bg-black-600 text-black" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-12 gap-2">

          {/* MENU BUTTON */}
          <div className="relative">
            <button
              onClick={toggleMoreDropdown}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium hover:bg-gray-200  rounded-b-lg transition-colors ${
                activeMoreDropdown ? 'bg-gray-300' : ''
              }`}
              title="Categories"
            >
              <Menu className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Categories</span>
            </button>

            {activeMoreDropdown && (
              <div className="absolute top-full left-0 min-w-[240px] bg-white text-gray-800 shadow-xl rounded-b-lg border py-2 z-50">

                {hiddenCategories.map((category) => {
                  const subs = subcategoriesByCategory[category.id] || [];
                  const isNestedActive = activeNestedId === category.id;

                  return (
                    <div key={category.id} className="relative">
                      <button
                        onClick={() => toggleNested(category.id)}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center justify-between"
                      >
                        {category.name}
                        {subs.length > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
                      </button>

                      {/* NESTED */}
                      {isNestedActive && (
                        <div className="absolute left-full top-0 min-w-[220px] bg-white shadow-xl rounded-lg border py-2 z-50">
                          <button
                            onClick={() => handleCategoryClick(category.id)}
                            className="w-full px-4 py-2 text-left text-sm font-medium text-green-600 hover:bg-green-50 border-b"
                          >
                            All {category.name}
                          </button>

                          {subs.length > 0 ? (
                            subs.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => handleSubcategoryClick(sub.id, category.id)}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-green-50 ${
                                  selectedSubcategory === sub.id
                                    ? 'bg-green-50 text-green-600 font-medium'
                                    : 'text-gray-700'
                                }`}
                              >
                                {sub.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-400">
                              No subcategories
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* STATIC NAV ITEMS */}
 

                  <button onClick={() => onSectionChange('about')} className="navBtn" title="About Us">
                    <Home className="h-5 w-5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">About Us</span>
                  </button>
                  <button onClick={() => onSectionChange('products')} className="navBtn" title="Products">
                    <Package className="h-5 w-5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Products</span>
                  </button>

                  <button onClick={() => onSectionChange('events')} className="navBtn" title="Events">
                    <CalendarDays className="h-5 w-5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Events</span>
                  </button>

                  <button onClick={() => onSectionChange('contact')} className="navBtn" title="Contact Us">
                    <Phone className="h-5 w-5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Contact Us</span>
                  </button>

                  <button onClick={() => onSectionChange('ecatalogue')} className="navBtn" title="Ecatalogue">
                    <Book className="h-5 w-5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Ecatalogue</span>
                  </button>

                  <button onClick={() => onSectionChange('blogs')} className="navBtn" title="Blogs">
                    <Clipboard className="h-5 w-5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Blogs</span>
                  </button>

        </div>
      </div>

      {/* TAILWIND HELPER */}
      <style jsx>{`
        .navBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .navBtn:hover {
          background: #e5e7eb;
        }
        @media (min-width: 640px) {
          .navBtn {
            padding: 8px 12px;
            justify-content: flex-start;
          }
        }
      `}</style>
    </nav>
  );
}
