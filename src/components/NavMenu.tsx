'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Home } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug?: string;
  category_id: string;
}

interface NavMenuProps {
  categories: Category[];
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategorySelect: (subcategoryId: string | null, categoryId: string | null) => void;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
}

export default function NavMenu({
  categories,
  onCategorySelect,
  onSubcategorySelect,
  selectedCategory,
  selectedSubcategory,
}: NavMenuProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({});
  const [loadingSubcategories, setLoadingSubcategories] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch subcategories for a category
  const fetchSubcategories = async (categoryId: string) => {
    if (subcategories[categoryId]) return; // Already fetched

    setLoadingSubcategories(categoryId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/subcategories/category/${categoryId}`);
      if (res.ok) {
        const data = await res.json();
        const subcategoryList = Array.isArray(data) ? data : data?.subcategories || [];
        setSubcategories((prev) => ({ ...prev, [categoryId]: subcategoryList }));
      }
    } catch (err) {
      console.error('Failed to fetch subcategories:', err);
    } finally {
      setLoadingSubcategories(null);
    }
  };

  // Handle mouse enter on category
  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(categoryId);
    fetchSubcategories(categoryId);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Cancel close when entering dropdown
  const handleDropdownEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    onSubcategorySelect(null, categoryId);
    setActiveDropdown(null);
  };

  // Handle subcategory click
  const handleSubcategoryClick = (subcategoryId: string, categoryId: string) => {
    onSubcategorySelect(subcategoryId, categoryId);
    setActiveDropdown(null);
  };

  // Handle home click
  const handleHomeClick = () => {
    onCategorySelect(null);
    onSubcategorySelect(null, null);
    setActiveDropdown(null);
  };

  return (
    <nav className="bg-green-600 text-white" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12">
          {/* Home Link */}
          <button
            onClick={handleHomeClick}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors rounded ${
              selectedCategory === null && selectedSubcategory === null ? 'bg-green-700' : ''
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>

          {/* Category Links */}
          <div className="flex items-center">
            {categories.map((category) => {
              const categorySubcategories = subcategories[category.id] || [];
              const isActive = activeDropdown === category.id;
              const isSelected = selectedCategory === category.id;

              return (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(category.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Category Button */}
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors ${
                      isActive || isSelected ? 'bg-green-700' : ''
                    }`}
                  >
                    <span>{category.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isActive ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {isActive && (
                    <div
                      className="absolute top-full left-0 min-w-[200px] bg-white text-gray-800 shadow-lg rounded-b-lg border border-gray-100 py-2 z-50"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* View All in Category */}
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className="w-full px-4 py-2 text-left text-sm font-medium text-green-600 hover:bg-green-50 border-b border-gray-100"
                      >
                        All {category.name}
                      </button>

                      {/* Loading State */}
                      {loadingSubcategories === category.id && (
                        <div className="px-4 py-3 text-sm text-gray-400">Loading...</div>
                      )}

                      {/* Subcategories */}
                      {categorySubcategories.length > 0 ? (
                        categorySubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => handleSubcategoryClick(subcategory.id, category.id)}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-green-50 hover:text-green-600 transition-colors ${
                              selectedSubcategory === subcategory.id
                                ? 'bg-green-50 text-green-600 font-medium'
                                : 'text-gray-700'
                            }`}
                          >
                            {subcategory.name}
                          </button>
                        ))
                      ) : (
                        !loadingSubcategories && (
                          <div className="px-4 py-3 text-sm text-gray-400">No subcategories</div>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
