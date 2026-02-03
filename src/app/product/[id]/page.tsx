'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  ArrowLeft,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Leaf
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/useAuthStore';
import NavMenu from '../../../components/NavMenu';
import { useMemo } from 'react';

interface Product {
  id: string;
  name: string;
  price: string | number;
  discount?: number;
  slug: string;
  description?: string;
  stock: number;
  category_id: string;
  category_name?: string;
  sub_category_id?: string;
  subcategory_name?: string;
  cms_image_ids: string[];
  images?: { id: string; url: string; card?: string; full?: string }[];
  artist_name?: string;
  is_active: boolean;
  created_at?: string;
}

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Image gallery state
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Action states
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  // NavMenu states
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || apiUrl;

  // Build image URL from CMS ID
  const buildImageUrl = useCallback((cmsImageId: string): string => {
    return `${cmsUrl}/api/cms/images/${cmsImageId}`;
  }, [cmsUrl]);

  // Fetch all products for related products section
  useEffect(() => {
    const fetchAllProducts = async () => {
      if (!apiUrl) return;
      try {
        const res = await fetch(`${apiUrl}/api/products?limit=200`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data.products || data.docs || []);
        }
      } catch (err) {
        console.error('Failed to fetch all products', err);
      }
    };
    fetchAllProducts();
  }, [apiUrl]);

  // Fetch categories for NavMenu
  useEffect(() => {
    const fetchCategories = async () => {
      if (!apiUrl) return;
      setCategoriesLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/categories/`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCategories(Array.isArray(data) ? data : data.categories || data.data || []);
        }
      } catch (err) {
        console.error('Categories fetch failed', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [apiUrl]);

  // Fetch subcategories for NavMenu
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!apiUrl) return;
      try {
        const res = await fetch(`${apiUrl}/api/subcategories`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setSubcategories(Array.isArray(data) ? data : data.subcategories || []);
        }
      } catch (err) {
        console.error('Subcategories fetch failed', err);
      }
    };
    fetchSubcategories();
  }, [apiUrl]);

  // Group subcategories by category for NavMenu
  const subcategoriesByCategory = useMemo(() => {
    return subcategories.reduce<Record<string, Subcategory[]>>((acc, sub) => {
      if (!acc[sub.category_id]) acc[sub.category_id] = [];
      acc[sub.category_id].push(sub);
      return acc;
    }, {});
  }, [subcategories]);

  // NavMenu handlers - navigate to home with filters
  const handleCategorySelect = (categoryId: string | null) => {
    if (categoryId) {
      router.push(`/?category=${categoryId}`);
    } else {
      router.push('/');
    }
  };

  const handleSubcategorySelect = (subcategoryId: string | null, categoryId: string | null) => {
    if (subcategoryId && categoryId) {
      router.push(`/?category=${categoryId}&subcategory=${subcategoryId}`);
    } else if (categoryId) {
      router.push(`/?category=${categoryId}`);
    } else {
      router.push('/');
    }
  };

  const handleSectionChange = (section: string) => {
    router.push(`/?section=${section}`);
  };

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!apiUrl || !productId) {
        setError('Missing API URL or product ID');
        setLoading(false);
        return;
      }

      try {
        const productRes = await fetch(`${apiUrl}/api/products/${productId}`, {
          cache: 'no-store',
        });

        if (!productRes.ok) {
          throw new Error('Product not found');
        }

        const productData = await productRes.json();
        setProduct(productData);

        // Build image URLs - prioritize images array (already has full URLs)
        if (productData.images && productData.images.length > 0) {
          const urls = productData.images.map((img: { full?: string; card?: string; url: string }) =>
            img.full || img.card || img.url
          );
          setImageUrls(urls);
        } else if (productData.cms_image_ids && productData.cms_image_ids.length > 0) {
          // Fallback to building URLs from cms_image_ids
          const urls = productData.cms_image_ids.map((id: string) => buildImageUrl(id));
          setImageUrls(urls);
        }

        // Fetch category
        if (productData.category_id) {
          try {
            const categoryRes = await fetch(`${apiUrl}/api/categories/${productData.category_id}`, {
              cache: 'no-store',
            });
            if (categoryRes.ok) {
              setCategory(await categoryRes.json());
            }
          } catch (err) {
            console.error('Failed to fetch category', err);
          }
        }

        // Fetch subcategory
        if (productData.sub_category_id) {
          try {
            const subcategoryRes = await fetch(`${apiUrl}/api/subcategories/${productData.sub_category_id}`, {
              cache: 'no-store',
            });
            if (subcategoryRes.ok) {
              setSubcategory(await subcategoryRes.json());
            }
          } catch (err) {
            console.error('Failed to fetch subcategory', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [apiUrl, productId, buildImageUrl]);

  // Get related products (smart selection based on position)
  const getRelatedProducts = (): Product[] => {
    if (!product || allProducts.length === 0) return [];

    const currentIndex = allProducts.findIndex(p => p.id === product.id);
    if (currentIndex === -1) return allProducts.slice(0, 7);

    const totalProducts = allProducts.length;
    const relatedProducts: Product[] = [];

    // If at the end (last 3 products), wrap around to beginning
    if (currentIndex >= totalProducts - 3) {
      // Get products from start
      for (let i = 0; i < 7 && relatedProducts.length < 7; i++) {
        if (allProducts[i].id !== product.id) {
          relatedProducts.push(allProducts[i]);
        }
      }
    } else {
      // Get 3 before and 4 after (or adjust based on position)
      const beforeCount = Math.min(3, currentIndex);
      const afterCount = Math.min(4, totalProducts - currentIndex - 1);

      // Add products before
      for (let i = currentIndex - beforeCount; i < currentIndex; i++) {
        if (i >= 0 && allProducts[i].id !== product.id) {
          relatedProducts.push(allProducts[i]);
        }
      }

      // Add products after
      for (let i = currentIndex + 1; i <= currentIndex + afterCount && relatedProducts.length < 7; i++) {
        if (i < totalProducts && allProducts[i].id !== product.id) {
          relatedProducts.push(allProducts[i]);
        }
      }
    }

    return relatedProducts.slice(0, 7);
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (!product || !user?.id) return;

    setAddingToCart(true);
    try {
      const res = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          quantity: quantity,
        }),
      });

      if (!res.ok) throw new Error('Failed to add to cart');
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle Add to Wishlist
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      router.push('/login');
      return;
    }

    if (!product || !user?.id) return;

    setAddingToWishlist(true);
    try {
      const res = await fetch(`${apiUrl}/api/wishes/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
        }),
      });

      if (!res.ok) throw new Error('Failed to add to wishlist');
      toast.success('Added to wishlist!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to wishlist');
    } finally {
      setAddingToWishlist(false);
    }
  };

  // Calculate final price
  const price = typeof product?.price === 'string' ? parseFloat(product.price) : product?.price || 0;
  const finalPrice = product?.discount
    ? Math.round(price * (1 - product.discount / 100))
    : price;

  const isOutOfStock = product?.stock !== undefined && product.stock <= 0;
  const relatedProducts = getRelatedProducts();

  // Thumbnail navigation
  const scrollThumbnails = (direction: 'left' | 'right') => {
    const container = document.getElementById('thumbnail-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -100 : 100;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">🌿</div>
          <p className="text-red-500 text-lg mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Products</span>
          </button>

          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <span className="hover:text-green-600 cursor-pointer" onClick={() => router.push('/')}>Home</span>
            <span>/</span>
            {category && <span className="hover:text-green-600 cursor-pointer">{category.name}</span>}
            {subcategory && (
              <>
                <span>/</span>
                <span className="hover:text-green-600 cursor-pointer">{subcategory.name}</span>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </header>

      {/* Navigation Menu */}
      <NavMenu
        categories={categories}
        subcategoriesByCategory={subcategoriesByCategory}
        loading={categoriesLoading}
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
        selectedCategory={null}
        selectedSubcategory={null}
        onSectionChange={handleSectionChange}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Green Vertical Banner Space */}
          <div className="hidden xl:block w-16 flex-shrink-0">
            <div className="sticky top-24 h-[600px] bg-gradient-to-b from-green-600 via-green-500 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center">
              <div className="transform -rotate-90 whitespace-nowrap text-white font-bold text-lg tracking-widest opacity-80">
                ECO FRIENDLY
              </div>
            </div>
          </div>

          {/* Main Product Section */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                {/* Left: Image Gallery */}
                <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
                  {/* Primary Image */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-inner mb-4 group">
                    {imageUrls.length > 0 ? (
                      <Image
                        src={imageUrls[primaryImageIndex]}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                          <span className="text-gray-400">No Image Available</span>
                        </div>
                      </div>
                    )}

                    {/* Discount Badge */}
                    {product.discount && product.discount > 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                        {product.discount}% OFF
                      </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold text-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Gallery - Always visible with placeholders */}
                  <div className="relative">
                    {/* Navigation Arrows */}
                    <button
                      onClick={() => scrollThumbnails('left')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-green-600 hover:shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => scrollThumbnails('right')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-green-600 hover:shadow-lg transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Thumbnails with green placeholders */}
                    <div
                      id="thumbnail-container"
                      className="flex gap-3 overflow-x-auto scrollbar-hide px-10 py-2"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {/* Render actual images */}
                      {imageUrls.map((url, index) => (
                        <button
                          key={`img-${index}`}
                          onClick={() => setPrimaryImageIndex(index)}
                          className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            primaryImageIndex === index
                              ? 'border-green-500 shadow-lg ring-2 ring-green-200'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <Image
                            src={url}
                            alt={`${product.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}

                      {/* Green placeholder boxes for remaining slots (minimum 5 total slots) */}
                      {Array.from({ length: Math.max(0, 5 - imageUrls.length) }).map((_, index) => (
                        <div
                          key={`placeholder-${index}`}
                          className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-dashed border-green-300 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center transition-all duration-200 hover:border-green-400 hover:from-green-100 hover:to-emerald-200"
                        >
                          <Leaf className="w-6 h-6 text-green-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Product Info */}
                <div className="p-6 lg:p-8 flex flex-col">
                  {/* Category & Subcategory */}
                  <div className="flex items-center gap-2 mb-3">
                    {category && (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        {category.name}
                      </span>
                    )}
                    {subcategory && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                        {subcategory.name}
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    {product.name}
                  </h1>

                  {/* Artist */}
                  {product.artist_name && (
                    <p className="text-gray-600 mb-4">
                      Crafted by <span className="font-medium text-green-700">{product.artist_name}</span>
                    </p>
                  )}

                  {/* Price Section */}
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-3xl lg:text-4xl font-bold text-green-600">
                      ₹{finalPrice.toLocaleString()}
                    </span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-xl text-gray-400 line-through mb-1">
                        ₹{price.toLocaleString()}
                      </span>
                    )}
                    {product.discount && product.discount > 0 && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm font-semibold mb-1">
                        Save ₹{(price - finalPrice).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-6">
                    {product.stock > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-green-600 font-medium">In Stock</span>
                        <span className="text-gray-400">({product.stock} available)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="text-red-500 font-medium">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Qty</span>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isOutOfStock}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-14 text-center font-semibold text-gray-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={isOutOfStock || quantity >= product.stock}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || addingToCart}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300"
                    >
                      {addingToCart ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-5 h-5" />
                      )}
                      Add to Cart
                    </button>
                    <button
                      onClick={handleAddToWishlist}
                      disabled={addingToWishlist}
                      className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-xl text-gray-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                    >
                      {addingToWishlist ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Heart className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Truck className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Free Shipping</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Secure Payment</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <RotateCcw className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Easy Returns</p>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                      Product Details
                    </h3>
                    <dl className="grid grid-cols-2 gap-y-2 text-sm">
                      <dt className="text-gray-500">SKU</dt>
                      <dd className="text-gray-900 font-medium">{product.slug}</dd>
                      <dt className="text-gray-500">Category</dt>
                      <dd className="text-gray-900 font-medium">{category?.name || product.category_name || '-'}</dd>
                      <dt className="text-gray-500">Subcategory</dt>
                      <dd className="text-gray-900 font-medium">{subcategory?.name || product.subcategory_name || '-'}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                  <div className="h-1 flex-1 mx-6 bg-gradient-to-r from-green-500 to-transparent rounded-full" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                  {relatedProducts.map((relatedProduct) => {
                    const relatedPrice = typeof relatedProduct.price === 'string'
                      ? parseFloat(relatedProduct.price)
                      : relatedProduct.price;
                    const relatedFinalPrice = relatedProduct.discount
                      ? Math.round(relatedPrice * (1 - relatedProduct.discount / 100))
                      : relatedPrice;
                    // Use images array first (like HomeProductCard), fallback to cms_image_ids
                    const relatedImages = relatedProduct.images;
                    const relatedImageUrl = relatedImages && relatedImages.length > 0
                      ? (relatedImages[0].card || relatedImages[0].url || '')
                      : relatedProduct.cms_image_ids && relatedProduct.cms_image_ids.length > 0
                        ? buildImageUrl(relatedProduct.cms_image_ids[0])
                        : '';

                    return (
                      <div
                        key={relatedProduct.id}
                        onClick={() => router.push(`/product/${relatedProduct.id}`)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100"
                      >
                        <div className="aspect-square relative overflow-hidden bg-gray-50">
                          {relatedImageUrl ? (
                            <Image
                              src={relatedImageUrl}
                              alt={relatedProduct.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Leaf className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                          {relatedProduct.discount && relatedProduct.discount > 0 && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                              -{relatedProduct.discount}%
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
                            {relatedProduct.name}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <span className="text-green-600 font-bold">₹{relatedFinalPrice.toLocaleString()}</span>
                            {relatedProduct.discount && relatedProduct.discount > 0 && (
                              <span className="text-xs text-gray-400 line-through">₹{relatedPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Green Vertical Banner Space */}
          <div className="hidden xl:block w-16 flex-shrink-0">
            <div className="sticky top-24 h-[600px] bg-gradient-to-b from-emerald-600 via-green-500 to-green-600 rounded-2xl shadow-lg flex items-center justify-center">
              <div className="transform rotate-90 whitespace-nowrap text-white font-bold text-lg tracking-widest opacity-80">
                SUSTAINABLE
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500 line-clamp-1">{product.name}</p>
            <p className="text-lg font-bold text-green-600">₹{finalPrice.toLocaleString()}</p>
          </div>
          <button
            onClick={handleAddToWishlist}
            disabled={addingToWishlist}
            className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-lg text-gray-600"
          >
            <Heart className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || addingToCart}
            className="flex-1 max-w-[180px] flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
