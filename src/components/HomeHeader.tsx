'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Heart, User, LogOut, Menu, X, Mail, Phone, ChevronDown, Home, Calendar, Play, CalendarDays } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { clearAuthCookie } from '../../lib/auth';
import SVGComponent from './Logo';

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

type SectionType = 'products' | 'about' | 'events' | 'contact' | 'ecatalogue' | 'blogs';

interface HomeHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  cartCount?: number;
  wishlistCount?: number;
  onLoginClick?: () => void;
  hideSearch?: boolean;
  // Mobile nav menu props
  categories?: Category[];
  subcategoriesByCategory?: Record<string, Subcategory[]>;
  onCategorySelect?: (categoryId: string | null) => void;
  onSubcategorySelect?: (subcategoryId: string | null, categoryId: string | null) => void;
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  onSectionChange?: (section: SectionType) => void;
}

export default function HomeHeader({
  searchQuery = '',
  onSearchChange = () => {},
  cartCount = 0,
  wishlistCount = 0,
  onLoginClick = () => {},
  hideSearch = false,
  categories = [],
  subcategoriesByCategory = {},
  onCategorySelect,
  onSubcategorySelect,
  selectedCategory,
  selectedSubcategory,
  onSectionChange,
}: HomeHeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, clearUser } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  // Mobile nav menu states
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileActiveNestedId, setMobileActiveNestedId] = useState<string | null>(null);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);

  const navItems = [
    { id: 'categories', label: 'Categories', isCategories: true },
    { id: 'about', label: 'About Us', section: 'about' as SectionType },
    { id: 'products', label: 'Products', section: 'products' as SectionType },
    { id: 'events', label: 'Events', section: 'events' as SectionType },
    { id: 'contact', label: 'Contact Us', section: 'contact' as SectionType },
    { id: 'ecatalogue', label: 'Ecatalogue', section: 'ecatalogue' as SectionType },
    { id: 'blogs', label: 'Blogs', section: 'blogs' as SectionType },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
    setMobileActiveNestedId(null);
    setMobileEventsOpen(false);
  };

  const handleMobileSectionClick = (section: SectionType) => {
    if (section === 'events') {
      router.push('/events');
    } else if (onSectionChange) {
      onSectionChange(section);
    }
    closeMobileMenu();
  };

  const handleMobileCategoryClick = (categoryId: string) => {
    onCategorySelect?.(categoryId);
    onSubcategorySelect?.(null, categoryId);
    closeMobileMenu();
  };

  const handleMobileSubcategoryClick = (subcategoryId: string, categoryId: string) => {
    onSubcategorySelect?.(subcategoryId, categoryId);
    closeMobileMenu();
  };

  const handleLogout = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      await fetch(`${API_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthCookie();
      clearUser();
      setProfileDropdownOpen(false);
      setMobileProfileOpen(false);
    }
  };

  const handleDashboardClick = () => {
    if (user?.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
    setProfileDropdownOpen(false);
    setMobileProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Promotional Bar */}
      <div className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-6">
              <span className="font-medium">Get 20% Off On Your First Order!</span>
              <div className="hidden md:flex items-center gap-4 text-green-100">
                <a
                  href="mailto:support@ecodarshini.com"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>support@ecodarshini.com</span>
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 text-green-100">
              <a
                href="tel:+919876543210"
                className="hidden sm:flex items-center gap-1 hover:text-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>+91 98765 43210</span>
              </a>
              <span className="text-green-300">|</span>
              <span>India (INR ₹)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop layout */}
          <div className="hidden md:flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <SVGComponent
                className="h-10 w-auto cursor-pointer transition-transform hover:scale-105"
                onClick={() => router.push('/')}
              />
            </div>

            {/* Search Bar - Desktop */}
            {!hideSearch && (
              <div className="flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search for eco-friendly products..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-4 pr-17 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent hover:ring-1 hover:ring-green-500 hover:border-green-500 hover:bg-white"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pl-3 border-l border-gray-300">
                    <Search className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Right Side Actions - Desktop */}
            <div className="flex flex-row items-end gap-4 lg:gap-6">
              <button
                onClick={isAuthenticated ? handleDashboardClick : onLoginClick}
                className="hidden sm:inline-flex flex-col items-center justify-end p-2 text-gray-600 hover:text-green-600 transition-colors"
                title="Wishlist"
              >
                <div className="relative mb-1">
                  <Heart className="h-6 w-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-xs hidden lg:block">Wishlist</span>
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="hidden sm:inline-flex flex-col items-center justify-end p-2 text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-xs mb-1">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs hidden lg:block truncate max-w-[50px]">
                      {user?.name || 'User'}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                      <button
                        onClick={handleDashboardClick}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="hidden sm:inline-flex flex-col items-center justify-end p-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <User className="h-6 w-6 mb-1" />
                  <span className="text-xs hidden lg:block">Login</span>
                </button>
              )}

              <button
                onClick={isAuthenticated ? handleDashboardClick : onLoginClick}
                className="hidden sm:inline-flex flex-col items-center justify-end p-2 text-gray-600 hover:text-green-600 transition-colors"
                title="Cart"
              >
                <div className="relative mb-1">
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs hidden lg:block">My Cart</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-green-600"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────── */}
          {/* MOBILE LAYOUT */}
          <div className="md:hidden">
            {/* Logo - centered */}
            <div className="flex justify-center py-3">
              <SVGComponent
                className="h-9 w-auto cursor-pointer transition-transform hover:scale-105"
                onClick={() => router.push('/')}
              />
            </div>

            {/* Row: [Main Menu] [Search] [Account Menu] */}
            <div className="flex items-center gap-2 pb-3">
              {/* Main navigation menu (Categories, About, etc.) */}
              <button
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  if (mobileMenuOpen) {
                    setMobileCategoriesOpen(false);
                    setMobileActiveNestedId(null);
                  }
                  setMobileProfileOpen(false);
                }}
                className="flex-shrink-0 p-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Search bar */}
              {!hideSearch && (
                <div className="flex-1 min-w-0">
                  <div className="relative flex">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full pl-3 pr-2 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50 text-gray-900 placeholder-gray-500 text-sm"
                    />
                    <button className="px-2.5 bg-green-600 hover:bg-green-700 text-white rounded-r-lg transition-colors">
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Single Account Menu Button */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => {
                    setMobileProfileOpen(!mobileProfileOpen);
                    setMobileMenuOpen(false);
                    setMobileCategoriesOpen(false);
                    setMobileActiveNestedId(null);
                  }}
                  className="p-2 text-gray-700 hover:text-green-600 transition-colors relative"
                  aria-label="Account and cart menu"
                >
                  {/* <User className="h-6 w-6" />
                  {(cartCount > 0 || wishlistCount > 0) && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount + wishlistCount > 9 ? '9+' : cartCount + wishlistCount}
                    </span>
                  )} */}
                  <User className="h-6 w-6 bg-green-600 text-white  rounded" />
                </button>

                {/* Account Dropdown Menu */}
                {mobileProfileOpen && (
                  <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        isAuthenticated ? handleDashboardClick() : onLoginClick();
                        setMobileProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <User className="h-5 w-5 text-gray-600" />
                      <span>{isAuthenticated ? 'Dashboard' : 'Login / Sign Up'}</span>
                    </button>

                    <button
                      onClick={() => {
                        isAuthenticated ? handleDashboardClick() : onLoginClick();
                        setMobileProfileOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="h-5 w-5 text-gray-600" />
                        <span>My Cart</span>
                      </div>
                      {cartCount > 0 && (
                        <span className="bg-green-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                          {cartCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        isAuthenticated ? handleDashboardClick() : onLoginClick();
                        setMobileProfileOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-gray-600" />
                        <span>Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="bg-green-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                          {wishlistCount}
                        </span>
                      )}
                    </button>

                    {isAuthenticated && (
                      <button
                        onClick={() => handleLogout()}
                        className="w-full flex items-center gap-3 px-5 py-3 text-left text-sm text-red-600 hover:bg-red-50 mt-1"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Main Navigation Menu (Categories + sections) */}
            {mobileMenuOpen && (
              <div className="border-t border-gray-100 max-h-[70vh] overflow-y-auto">
                {navItems.map((item) => {
                  if (item.isCategories) {
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => {
                            setMobileCategoriesOpen(!mobileCategoriesOpen);
                            setMobileActiveNestedId(null);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-green-50 flex items-center justify-between border-b border-gray-100 ${
                            mobileCategoriesOpen ? 'bg-green-50 text-green-600' : 'text-gray-700'
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`}
                          />
                        </button>

                        {mobileCategoriesOpen && (
                          <div className="bg-gray-50">
                            {categories.length > 0 ? (
                              categories.map((category) => {
                                const subs = subcategoriesByCategory[category.id] || [];
                                const isExpanded = mobileActiveNestedId === category.id;

                                return (
                                  <div key={category.id}>
                                    <button
                                      onClick={() =>
                                        subs.length > 0
                                          ? setMobileActiveNestedId(isExpanded ? null : category.id)
                                          : handleMobileCategoryClick(category.id)
                                      }
                                      className={`w-full px-6 py-2.5 text-left text-sm hover:bg-green-50 flex items-center justify-between ${
                                        isExpanded ? 'bg-green-100 text-green-600' : 'text-gray-700'
                                      }`}
                                    >
                                      {category.name}
                                      {subs.length > 0 && (
                                        <ChevronDown
                                          className={`h-4 w-4 text-gray-400 transition-transform ${
                                            isExpanded ? 'rotate-180' : ''
                                          }`}
                                        />
                                      )}
                                    </button>

                                    {isExpanded && subs.length > 0 && (
                                      <div className="bg-white border-l-2 border-green-500 ml-4">
                                        <button
                                          onClick={() => handleMobileCategoryClick(category.id)}
                                          className="w-full px-6 py-2 text-left text-sm font-medium text-green-600 hover:bg-green-50"
                                        >
                                          All {category.name}
                                        </button>
                                        {subs.map((sub) => (
                                          <button
                                            key={sub.id}
                                            onClick={() => handleMobileSubcategoryClick(sub.id, category.id)}
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
                              <div className="px-6 py-3 text-sm text-gray-400">No categories available</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.id === 'events') {
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                          className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-green-50 flex items-center justify-between border-b border-gray-100 ${
                            mobileEventsOpen ? 'bg-green-50 text-green-600' : 'text-gray-700'
                          }`}
                        >
                          <span>Events</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${mobileEventsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileEventsOpen && (
                          <div className="bg-gray-50 border-l-2 border-green-500 ml-4">
                            <button
                              onClick={() => { router.push('/events/gallery'); closeMobileMenu(); }}
                              className="w-full px-6 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700"
                            >
                              <Calendar className="h-4 w-4" />
                              Gallery
                            </button>
                            <button
                              onClick={() => { router.push('/events/videos'); closeMobileMenu(); }}
                              className="w-full px-6 py-2.5 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700"
                            >
                              <Play className="h-4 w-4" />
                              Videos
                            </button>
                            <button
                              onClick={() => { router.push('/events/upcoming'); closeMobileMenu(); }}
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
                      onClick={() => handleMobileSectionClick(item.section!)}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-green-50 border-b border-gray-100"
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(profileDropdownOpen || mobileProfileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setProfileDropdownOpen(false);
            setMobileProfileOpen(false);
          }}
        />
      )}
    </header>
  );
}