'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Menu, Book, Phone, Home } from 'lucide-react';

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
            <div className="h-8 w-8 bg-gray-400 rounded animate-pulse" />
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
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors ${
                activeMoreDropdown ? 'bg-green-700' : ''
              }`}
            >
              <Menu className="h-4 w-4" />
              Categories
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

          {/* <button onClick={handleHomeClick} className="navBtn">
            <Home className="h-4 w-4" /> About Us
          </button> */}


          {/* <button onClick={handleHomeClick} className="navBtn">
            <Home className="h-4 w-4" /> Events
          </button>

          <button onClick={handleHomeClick} className="navBtn">
            <Phone className="h-4 w-4" /> Contact Us
          </button>

          <button onClick={handleHomeClick} className="navBtn">
            <Book className="h-4 w-4" /> Ecatalogue
          </button>

          <button onClick={handleHomeClick} className="navBtn">
            <Book className="h-4 w-4" /> Blogs
          </button> */}

                  <button onClick={() => onSectionChange('about')} className="navBtn">
                    <Home className="h-4 w-4" /> About Us
                  </button>
                  <button onClick={() => onSectionChange('products')} className="navBtn">
                    <Book className="h-4 w-4" /> Products
                  </button>

                  <button onClick={() => onSectionChange('events')} className="navBtn">
                    <Home className="h-4 w-4" /> Events
                  </button>

                  <button onClick={() => onSectionChange('contact')} className="navBtn">
                    <Phone className="h-4 w-4" /> Contact Us
                  </button>

                  <button onClick={() => onSectionChange('ecatalogue')} className="navBtn">
                    <Book className="h-4 w-4" /> Ecatalogue
                  </button>

                  <button onClick={() => onSectionChange('blogs')} className="navBtn">
                    <Book className="h-4 w-4" /> Blogs
                  </button>

        </div>
      </div>

      {/* TAILWIND HELPER */}
      <style jsx>{`
        .navBtn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .navBtn:hover {
          background: #e5e7eb;
        }
      `}</style>
    </nav>
  );
}
