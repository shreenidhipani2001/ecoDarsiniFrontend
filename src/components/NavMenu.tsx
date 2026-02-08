'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, Clipboard, Package, CalendarDays, Menu, Book, Phone, Home, Grid3X3, Calendar, Play, Info, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  disabled?: boolean;
}

export default function NavMenu({
  categories,
  subcategoriesByCategory,
  loading,
  onCategorySelect,
  onSubcategorySelect,
  selectedCategory,
  selectedSubcategory,
  onSectionChange,
  disabled = false
}: NavMenuProps) {

  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [activeNestedId, setActiveNestedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const eventsDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ---------------- TOGGLES ---------------- */

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setCategoriesOpen(false);
    setActiveNestedId(null);
  };

  const toggleCategories = () => {
    setCategoriesOpen((prev) => !prev);
    setActiveNestedId(null);
  };

  const toggleNested = (categoryId: string) => {
    setActiveNestedId((prev) => (prev === categoryId ? null : categoryId));
  };

  const closeAll = () => {
    setMenuOpen(false);
    setCategoriesOpen(false);
    setActiveNestedId(null);
    setEventsDropdownOpen(false);
    setAboutDropdownOpen(false);
  };

  /* ---------------- OUTSIDE CLICK ---------------- */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setCategoriesOpen(false);
        setActiveNestedId(null);
      }
      if (eventsDropdownRef.current && !eventsDropdownRef.current.contains(event.target as Node)) {
        setEventsDropdownOpen(false);
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
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

  const handleSectionClick = (section: SectionType) => {
    onSectionChange(section);
    closeAll();
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <nav className="bg-black-600 text-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-12 gap-3">
            <div className="h-8 w-24 bg-gray-400 rounded animate-pulse" />
            <div className="h-8 w-24 bg-gray-400 rounded animate-pulse hidden sm:block" />
            <div className="h-8 w-24 bg-gray-400 rounded animate-pulse hidden sm:block" />
          </div>
        </div>
      </nav>
    );
  }

  /* ---------------- NAV ITEMS CONFIG ---------------- */

  const navItems = [
    { id: 'categories', label: 'Categories', isCategories: true },
    { id: 'about', label: 'About Us', section: 'about' as SectionType },
    { id: 'products', label: 'Products', section: 'products' as SectionType },
    { id: 'events', label: 'Events', section: 'events' as SectionType },
    { id: 'contact', label: 'Contact Us', section: 'contact' as SectionType },
    { id: 'ecatalogue', label: 'Ecatalogue', section: 'ecatalogue' as SectionType },
    { id: 'blogs', label: 'Blogs', section: 'blogs' as SectionType },
  ];

  // Get current active category for subcategories (desktop)
  const activeCategory = activeNestedId ? categories.find(c => c.id === activeNestedId) : null;
  const activeSubs = activeNestedId ? (subcategoriesByCategory[activeNestedId] || []) : [];

  /* ---------------- MOBILE ACCORDION DROPDOWN ---------------- */

  const renderMobileDropdown = () => (
    <div className="absolute top-full left-0 w-[280px] bg-white text-gray-800 shadow-xl rounded-b-lg border z-50 max-h-[70vh] overflow-y-auto">
      {navItems.map((item) => {

        if (item.isCategories) {
          return (
            <div key={item.id}>
              {/* Categories Header */}
              <button
                onClick={toggleCategories}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-green-50 flex items-center justify-between border-b ${
                  categoriesOpen ? 'bg-green-50 text-green-600' : ''
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.label}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Accordion */}
              {categoriesOpen && (
                <div className="bg-gray-50">
                  {categories.length > 0 ? (
                    categories.map((category) => {
                      const subs = subcategoriesByCategory[category.id] || [];
                      const isExpanded = activeNestedId === category.id;

                      return (
                        <div key={category.id}>
                          {/* Category Item */}
                          <button
                            onClick={() => subs.length > 0 ? toggleNested(category.id) : handleCategoryClick(category.id)}
                            className={`w-full px-6 py-2.5 text-left text-sm hover:bg-green-50 flex items-center justify-between ${
                              isExpanded ? 'bg-green-100 text-green-600' : ''
                            }`}
                          >
                            {category.name}
                            {subs.length > 0 && (
                              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            )}
                          </button>

                          {/* Subcategories Accordion */}
                          {isExpanded && subs.length > 0 && (
                            <div className="bg-white border-l-2 border-green-500 ml-4">
                              <button
                                onClick={() => handleCategoryClick(category.id)}
                                className="w-full px-6 py-2 text-left text-sm font-medium text-green-600 hover:bg-green-50"
                              >
                                All {category.name}
                              </button>
                              {subs.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() => handleSubcategoryClick(sub.id, category.id)}
                                  className={`w-full px-6 py-2 text-left text-sm hover:bg-green-50 ${
                                    selectedSubcategory === sub.id
                                      ? 'bg-green-50 text-green-600 font-medium'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-6 py-3 text-sm text-gray-400">
                      No categories available
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        if (item.id === 'about') {
          return (
            <div key={item.id}>
              <button
                onClick={() => setAboutDropdownOpen(prev => !prev)}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-green-50 flex items-center justify-between border-b ${
                  aboutDropdownOpen ? 'bg-green-50 text-green-600' : ''
                }`}
              >
                <span>About Us</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {aboutDropdownOpen && (
                <div className="bg-gray-50 border-l-2 border-green-500 ml-4">
                  <button
                    onClick={() => { router.push('/about'); closeAll(); }}
                    className="w-full px-6 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700"
                  >
                    <Info className="h-4 w-4" />
                    About Us
                  </button>
                  <button
                    onClick={() => { router.push('/faqs'); closeAll(); }}
                    className="w-full px-6 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700"
                  >
                    <HelpCircle className="h-4 w-4" />
                    FAQs
                  </button>
                </div>
              )}
            </div>
          );
        }

        if (item.id === 'events') {
          return (
            <div key={item.id}>
              <button
                onClick={() => setEventsDropdownOpen(prev => !prev)}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-green-50 flex items-center justify-between border-b ${
                  eventsDropdownOpen ? 'bg-green-50 text-green-600' : ''
                }`}
              >
                <span>Events</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${eventsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {eventsDropdownOpen && (
                <div className="bg-gray-50 border-l-2 border-green-500 ml-4">
                  <button
                    onClick={() => { router.push('/events/gallery'); closeAll(); }}
                    className="w-full px-6 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700"
                  >
                    <Calendar className="h-4 w-4" />
                    Gallery
                  </button>
                  <button
                    onClick={() => { router.push('/events/videos'); closeAll(); }}
                    className="w-full px-6 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700"
                  >
                    <Play className="h-4 w-4" />
                    Videos
                  </button>
                  <button
                    onClick={() => { router.push('/events/upcoming'); closeAll(); }}
                    className="w-full px-6 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Upcoming Events
                  </button>
                </div>
              )}
            </div>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => handleSectionClick(item.section!)}
            className="w-full px-4 py-3 text-left text-sm hover:bg-green-50 flex items-center gap-2 border-b border-gray-100"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );

  /* ---------------- DESKTOP FLYOUT DROPDOWN ---------------- */

  const renderDesktopDropdown = () => (
    <>
      {/* Main Menu Dropdown */}
      <div className="absolute top-full left-0 min-w-[240px] bg-white text-gray-800 shadow-xl rounded-b-lg border py-2 z-50 max-h-[280px] overflow-y-auto">
        {navItems.map((item) => {
          if (item.isCategories) {
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={toggleCategories}
                  onMouseEnter={() => setCategoriesOpen(true)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center justify-between ${
                    categoriesOpen ? 'bg-green-50 text-green-600' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            );
          }

          if (item.id === 'about') {
            return (
              <div key={item.id} className="relative group">
                <button
                  onMouseEnter={() => setAboutDropdownOpen(true)}
                  onClick={() => setAboutDropdownOpen(prev => !prev)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center justify-between ${
                    aboutDropdownOpen ? 'bg-green-50 text-green-600' : ''
                  }`}
                >
                  <span>About Us</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            );
          }

          if (item.id === 'events') {
            return (
              <div key={item.id} className="relative group">
                <button
                  onMouseEnter={() => setEventsDropdownOpen(true)}
                  onClick={() => setEventsDropdownOpen(prev => !prev)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center justify-between ${
                    eventsDropdownOpen ? 'bg-green-50 text-green-600' : ''
                  }`}
                >
                  <span>Events</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.section!)}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2"
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* About Us Flyout */}
      {aboutDropdownOpen && (
        <div
          className="absolute top-full left-[240px] min-w-[200px] bg-white text-gray-800 shadow-xl rounded-lg border py-2 z-50"
          onMouseLeave={() => setAboutDropdownOpen(false)}
        >
          <button
            onClick={() => { router.push('/about'); closeAll(); }}
            className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700 hover:text-green-600"
          >
            <Info className="h-4 w-4" />
            About Us
          </button>
          <button
            onClick={() => { router.push('/faqs'); closeAll(); }}
            className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700 hover:text-green-600"
          >
            <HelpCircle className="h-4 w-4" />
            FAQs
          </button>
        </div>
      )}

      {/* Events Flyout */}
      {eventsDropdownOpen && (
        <div
          className="absolute top-full left-[240px] min-w-[200px] bg-white text-gray-800 shadow-xl rounded-lg border py-2 z-50"
          onMouseLeave={() => setEventsDropdownOpen(false)}
        >
          <button
            onClick={() => { router.push('/events/gallery'); closeAll(); }}
            className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700 hover:text-green-600"
          >
            <Calendar className="h-4 w-4" />
            Gallery
          </button>
          <button
            onClick={() => { router.push('/events/videos'); closeAll(); }}
            className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700 hover:text-green-600"
          >
            <Play className="h-4 w-4" />
            Videos
          </button>
          <button
            onClick={() => { router.push('/events/upcoming'); closeAll(); }}
            className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700 hover:text-green-600"
          >
            <CalendarDays className="h-4 w-4" />
            Upcoming Events
          </button>
        </div>
      )}

      {/* Categories Flyout */}
      {categoriesOpen && (
        <div
          className="absolute top-full left-[240px] min-w-[220px] bg-white text-gray-800 shadow-xl rounded-lg border py-2 z-50 max-h-[308px] overflow-y-auto"
          onMouseLeave={() => !activeNestedId && setCategoriesOpen(false)}
        >
          {categories.length > 0 ? (
            categories.map((category) => {
              const subs = subcategoriesByCategory[category.id] || [];
              const isNestedActive = activeNestedId === category.id;

              return (
                <div key={category.id} className="relative">
                  <button
                    onClick={() => subs.length > 0 ? toggleNested(category.id) : handleCategoryClick(category.id)}
                    onMouseEnter={() => subs.length > 0 && setActiveNestedId(category.id)}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center justify-between ${
                      isNestedActive ? 'bg-green-50 text-green-600' : ''
                    }`}
                  >
                    {category.name}
                    {subs.length > 0 && (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              No categories available
            </div>
          )}
        </div>
      )}

      {/* Subcategories Flyout */}
      {categoriesOpen && activeNestedId && activeSubs.length > 0 && (
        <div
          className="absolute top-full left-[460px] min-w-[220px] bg-white text-gray-800 shadow-xl rounded-lg border py-2 z-50 max-h-[396px] overflow-y-auto"
          onMouseLeave={() => setActiveNestedId(null)}
        >
          <button
            onClick={() => handleCategoryClick(activeNestedId)}
            className="w-full px-4 py-2 text-left text-sm font-medium text-green-600 hover:bg-green-50 border-b"
          >
            All {activeCategory?.name}
          </button>

          {activeSubs.map((sub) => (
            <button
              key={sub.id}
              onClick={() => handleSubcategoryClick(sub.id, activeNestedId)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-green-50 ${
                selectedSubcategory === sub.id
                  ? 'bg-green-50 text-green-600 font-medium'
                  : 'text-gray-700'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}
    </>
  );

  /* ---------------- UI ---------------- */

  return (
    <nav className="hidden md:block bg-black-600 text-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-12 gap-2">

          {/* MENU BUTTON */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={disabled ? undefined : toggleMenu}
              disabled={disabled}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                disabled ? 'cursor-default opacity-70' : 'hover:bg-gray-200'
              } ${menuOpen ? 'bg-gray-300' : ''}`}
              title="Menu"
            >
              {isMobile ? (
                <span className="bg-gray-300 text-black font-bold px-3 py-1 rounded-full">  All Categories</span>   

           ) : (
                <>
                  <Menu className="h-5 w-5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Menu</span>
                </>
              )}
            </button>

            {/* Dropdown - Mobile or Desktop */}
            {!disabled && menuOpen && (isMobile ? renderMobileDropdown() : renderDesktopDropdown())}
          </div>

          {/* DESKTOP STATIC NAV ITEMS - Hidden on mobile, visible on sm+ */}
          <div className="hidden sm:flex items-center gap-1">
            {/* About Us Dropdown */}
            <div className="relative" ref={aboutDropdownRef}>
              <button
                onClick={disabled ? undefined : () => setAboutDropdownOpen(prev => !prev)}
                disabled={disabled}
                className={`navBtn ${disabled ? 'cursor-default opacity-70' : ''} ${aboutDropdownOpen ? 'bg-gray-200' : ''}`}
                title="About Us"
              >
                <span>About Us</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {!disabled && aboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white text-gray-800 shadow-xl rounded-lg border py-2 z-50">
                  <button
                    onClick={() => { router.push('/about'); setAboutDropdownOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <Info className="h-4 w-4" />
                    About Us
                  </button>
                  <button
                    onClick={() => { router.push('/faqs'); setAboutDropdownOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <HelpCircle className="h-4 w-4" />
                    FAQs
                  </button>
                </div>
              )}
            </div>

            <button onClick={disabled ? undefined : () => onSectionChange('products')} disabled={disabled} className={`navBtn ${disabled ? 'cursor-default opacity-70' : ''}`} title="Products">
              <span>Products</span>
            </button>
            {/* Events Dropdown */}
            <div className="relative" ref={eventsDropdownRef}>
              <button
                onClick={disabled ? undefined : () => setEventsDropdownOpen(prev => !prev)}
                disabled={disabled}
                className={`navBtn ${disabled ? 'cursor-default opacity-70' : ''} ${eventsDropdownOpen ? 'bg-gray-200' : ''}`}
                title="Events"
              >
                <span>Events</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${eventsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {!disabled && eventsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white text-gray-800 shadow-xl rounded-lg border py-2 z-50">
                  <button
                    onClick={() => { router.push('/events/gallery'); setEventsDropdownOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    Gallery
                  </button>
                  <button
                    onClick={() => { router.push('/events/videos'); setEventsDropdownOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    Videos
                  </button>
                  <button
                    onClick={() => { router.push('/events/upcoming'); setEventsDropdownOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Upcoming Events
                  </button>
                </div>
              )}
            </div>

            <button onClick={disabled ? undefined : () => onSectionChange('ecatalogue')} disabled={disabled} className={`navBtn ${disabled ? 'cursor-default opacity-70' : ''}`} title="Ecatalogue">
              <span>Ecatalogue</span>
            </button>
            <button onClick={disabled ? undefined : () => onSectionChange('blogs')} disabled={disabled} className={`navBtn ${disabled ? 'cursor-default opacity-70' : ''}`} title="Blogs">
              <span>Blogs</span>
            </button>
            <button onClick={disabled ? undefined : () => onSectionChange('contact')} disabled={disabled} className={`navBtn ${disabled ? 'cursor-default opacity-70' : ''}`} title="Contact Us">
              <span>Contact Us</span>
            </button>
          </div>

        </div>
      </div>

      {/* TAILWIND HELPER */}
      <style jsx>{`
        .navBtn {
          display: flex;
          align-items: center;
          justify-content: flex-start;
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