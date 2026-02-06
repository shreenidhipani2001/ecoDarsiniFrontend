'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Home,
  ChevronDown,
  Leaf
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/useAuthStore';
import NavMenu from '../../../components/NavMenu';
import HomeHeader from '../../../components/HomeHeader';
import HomeFooter from '../../../components/HomeFooter';

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

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name: string;
}

// Hardcoded categories list
const HARDCODED_CATEGORIES = [
  { id: '1', name: 'Books', slug: 'books' },
  { id: '2', name: 'Cuisine', slug: 'cuisine' },
  { id: '3', name: 'Gifts', slug: 'gifts' },
  { id: '4', name: 'Furnishing', slug: 'furnishing' },
  { id: '5', name: 'Health & Hygiene', slug: 'health-hygiene' },
  { id: '6', name: 'Handloom', slug: 'handloom' },
  { id: '7', name: 'Clothing & Accessories', slug: 'clothing-accessories' },
  { id: '8', name: 'Art & Craft', slug: 'art-craft' },
  { id: '9', name: 'Sustainable Living', slug: 'sustainable-living' },
  { id: '10', name: 'Handcrafted Decor', slug: 'handcrafted-decor' },
  { id: '11', name: 'Pottery & Ceramics', slug: 'pottery-ceramics' },
  { id: '12', name: 'Spiritual & Pooja Items', slug: 'spiritual-pooja-items' },
  { id: '13', name: 'Home & Living', slug: 'home-living' },
  { id: '14', name: 'Eco-Friendly Products', slug: 'eco-friendly-products' },
  { id: '15', name: 'Wall Decor', slug: 'wall-decor' },
  { id: '16', name: 'Bamboo & Cane Crafts', slug: 'bamboo-cane-crafts' },
  { id: '17', name: 'Metal Crafts', slug: 'metal-crafts' },
  { id: '18', name: 'Wooden Handicrafts', slug: 'wooden-handicrafts' },
  { id: '19', name: 'Handloom & Textiles', slug: 'handloom-textiles' },
  { id: '20', name: 'Tribal Paintings', slug: 'tribal-paintings' },
];

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

  // Tab state
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'tags'>('description');

  // Category dropdown state
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);

  // Related products scroll ref
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || apiUrl;

  // Build image URL from CMS ID
  const buildImageUrl = useCallback((cmsImageId: string): string => {
    return `${cmsUrl}/api/cms/images/${cmsImageId}`;
  }, [cmsUrl]);

  // Fetch all products
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

        // Build image URLs
        if (productData.images && productData.images.length > 0) {
          const urls = productData.images.map((img: { full?: string; card?: string; url: string }) =>
            img.full || img.card || img.url
          );
          setImageUrls(urls);
        } else if (productData.cms_image_ids && productData.cms_image_ids.length > 0) {
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

  // Fetch reviews for this product
  useEffect(() => {
    const fetchReviews = async () => {
      if (!apiUrl || !productId) return;
      try {
        const res = await fetch(`${apiUrl}/api/review/review-for-this/${productId}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
    };
    fetchReviews();
  }, [apiUrl, productId]);

  // Get related products
  const getRelatedProducts = (): Product[] => {
    if (!product || allProducts.length === 0) return [];
    const currentIndex = allProducts.findIndex(p => p.id === product.id);
    if (currentIndex === -1) return allProducts.slice(0, 6);

    const totalProducts = allProducts.length;
    const relatedProducts: Product[] = [];

    if (currentIndex >= totalProducts - 3) {
      for (let i = 0; i < 6 && relatedProducts.length < 6; i++) {
        if (allProducts[i].id !== product.id) {
          relatedProducts.push(allProducts[i]);
        }
      }
    } else {
      const beforeCount = Math.min(2, currentIndex);
      const afterCount = Math.min(4, totalProducts - currentIndex - 1);

      for (let i = currentIndex - beforeCount; i < currentIndex; i++) {
        if (i >= 0 && allProducts[i].id !== product.id) {
          relatedProducts.push(allProducts[i]);
        }
      }

      for (let i = currentIndex + 1; i <= currentIndex + afterCount && relatedProducts.length < 6; i++) {
        if (i < totalProducts && allProducts[i].id !== product.id) {
          relatedProducts.push(allProducts[i]);
        }
      }
    }

    return relatedProducts.slice(0, 5);
  };

  // Get latest products for sidebar
  const getLatestProducts = (): Product[] => {
    return allProducts.slice(0, 4);
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
  const latestProducts = getLatestProducts();

  // Scroll related products
  const scrollRelated = (direction: 'left' | 'right') => {
    if (relatedScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      relatedScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Scroll thumbnails
  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailScrollRef.current) {
      const scrollAmount = direction === 'left' ? -100 : 100;
      thumbnailScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Get product image URL helper
  const getProductImageUrl = (p: Product): string => {
    if (p.images && p.images.length > 0) {
      return p.images[0].card || p.images[0].url || '';
    }
    if (p.cms_image_ids && p.cms_image_ids.length > 0) {
      return buildImageUrl(p.cms_image_ids[0]);
    }
    return '';
  };

  // Get product price helper
  const getProductPrice = (p: Product): { price: number; finalPrice: number } => {
    const pPrice = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
    const pFinalPrice = p.discount ? Math.round(pPrice * (1 - p.discount / 100)) : pPrice;
    return { price: pPrice, finalPrice: pFinalPrice };
  };

  // Handle thumbnail click - swap with primary
  const handleThumbnailClick = (index: number) => {
    setPrimaryImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-green-600 mx-auto" />
          <p className="mt-3 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-6 rounded-xl shadow">
          <div className="text-5xl mb-3">🌿</div>
          <p className="text-red-500 mb-3">{error || 'Product not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mx-auto"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Create placeholder slots for thumbnails (minimum 5)
  const thumbnailSlots = Array.from({ length: Math.max(5, imageUrls.length) }, (_, i) => ({
    index: i,
    hasImage: i < imageUrls.length,
    url: imageUrls[i] || null,
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      <HomeHeader hideSearch={true} />
      {/* Breadcrumb */}
      <NavMenu
        categories={HARDCODED_CATEGORIES}
        subcategoriesByCategory={{}}
        loading={false}
        onCategorySelect={() => {}}
        onSubcategorySelect={() => {}}
        selectedCategory={null}
        selectedSubcategory={null}
        onSectionChange={() => {}}
        disabled={true}
      />
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => router.push('/')} className="hover:text-green-600">
              <Home className="w-4 h-4" />
            </button>
            <span>&gt;</span>
            {category && (
              <>
                <span className="hover:text-green-600 cursor-pointer">{category.name}</span>
                <span>&gt;</span>
              </>
            )}
            <span className="text-green-600">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            {/* Categories */}
            <div className="bg-white rounded shadow mb-6">
              <div className="bg-gray-800 text-white px-4 py-3 font-semibold rounded-t">
                CATEGORIES
              </div>
              <div className="divide-y">
                {HARDCODED_CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                    >
                      {cat.name}
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedCategory === cat.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Products */}
            <div className="bg-white rounded shadow">
              <div className="bg-gray-800 text-white px-4 py-3 font-semibold rounded-t">
                LATEST PRODUCTS
              </div>
              <div className="p-4 space-y-4">
                {latestProducts.map((p) => {
                  const { finalPrice: pFinalPrice, price: pPrice } = getProductPrice(p);
                  const pImageUrl = getProductImageUrl(p);

                  return (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/product/${p.id}`)}
                      className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {pImageUrl ? (
                          <img src={pImageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                        <div className="flex items-center gap-1 my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-bold text-sm">₹{pFinalPrice.toLocaleString()}</span>
                          {p.discount && p.discount > 0 && (
                            <span className="text-gray-400 line-through text-xs">₹{pPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Product Section */}
            <div className="bg-white rounded shadow p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Product Images */}
                <div className="lg:w-1/2">
                  {/* Main Image */}
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 relative">
                    {imageUrls.length > 0 ? (
                      <Image
                        src={imageUrls[primaryImageIndex]}
                        alt={product.name}
                        fill
                        className="object-contain p-4"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="w-20 h-20 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Horizontal Thumbnails */}
                  <div className="relative">
                    <button
                      onClick={() => scrollThumbnails('left')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow rounded-full flex items-center justify-center hover:bg-gray-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div
                      ref={thumbnailScrollRef}
                      className="flex gap-2 overflow-x-auto mx-10 scroll-smooth"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {thumbnailSlots.map((slot) => (
                        <button
                          key={slot.index}
                          onClick={() => slot.hasImage && handleThumbnailClick(slot.index)}
                          className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                            primaryImageIndex === slot.index && slot.hasImage
                              ? 'border-green-500'
                              : slot.hasImage
                                ? 'border-gray-200 hover:border-green-300'
                                : 'border-dashed border-green-300 bg-green-50'
                          }`}
                        >
                          {slot.hasImage && slot.url ? (
                            <img src={slot.url} alt={`Thumb ${slot.index + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-green-50">
                              <Leaf className="w-6 h-6 text-green-300" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => scrollThumbnails('right')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow rounded-full flex items-center justify-center hover:bg-gray-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="lg:w-1/2 flex flex-col">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => {
                        const avgRating = reviews.length > 0
                          ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                          : 0;
                        return (
                          <Star key={i} className={`w-4 h-4 ${i < avgRating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} />
                        );
                      })}
                    </div>
                    <span className="text-sm text-gray-500">{reviews.length} reviews</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-green-600">₹{finalPrice.toLocaleString()}</span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-xl text-gray-400 line-through">₹{price.toLocaleString()}</span>
                    )}
                    <span className={`ml-4 px-3 py-1 rounded text-sm font-medium ${isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                    </span>
                  </div>

                  {/* Product Info Box */}
                  <div className="border-l-4 border-orange-400 bg-gray-50 p-4 mb-4 text-sm">
                    {product.artist_name && (
                      <p className="mb-1"><span className="text-gray-900">Artist:</span> <span className="font-2xl text-gray-900">{product.artist_name}</span></p>
                    )}
                    <p className="mb-1 "><span className="text-gray-900">Product Code:</span> <span className="font-medium text-gray-900">{product.slug}</span></p>
                    <p className="mb-1"><span className="text-gray-900">Category:</span> <span className="font-medium text-gray-900">{category?.name || product.category_name || '-'}</span></p>
                    {subcategory && (
                      <p><span className="text-gray-900">Subcategory:</span> <span className="font-medium text-gray-900">{subcategory.name}</span></p>
                    )}
                  </div>

                  {/* Reviews Section */}
                  <div className="mb-4 w-full overflow-hidden">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Customer Reviews ({reviews.length > 0 ? reviews.length : 7})</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'thin' }}>
                      {(reviews.length > 0 ? reviews.slice(0, 7) : [
                        { id: '1', user_name: 'Rahul Sharma', rating: 5, comment: 'Excellent product! The quality exceeded my expectations. Highly recommend for anyone looking for authentic handcrafted items.' },
                        { id: '2', user_name: 'Priya Patel', rating: 3, comment: 'Beautiful craftsmanship and eco-friendly materials. Perfect gift for my family. Will definitely order again!' },
                        { id: '3', user_name: 'Amit Kumar', rating: 4, comment: 'Very good quality product. Delivery was on time and packaging was neat. Happy with my purchase.' },
                        { id: '4', user_name: 'Sneha Reddy', rating: 5, comment: 'Absolutely love this! The attention to detail is amazing. Supporting local artisans feels great.' },
                        { id: '5', user_name: 'Vikram Singh', rating: 4, comment: 'Good value for money. The product looks exactly as shown in the pictures. Recommended!' },
                        { id: '6', user_name: 'Anjali Gupta', rating: 5, comment: 'Stunning piece! It has become the centerpiece of my living room. Everyone asks where I got it from.' },
                        { id: '7', user_name: 'Rajesh Nair', rating: 4, comment: 'Nice product with traditional touch. Shipping was quick and customer service was helpful.' },
                      ]).map((review) => (
                        <div
                          key={review.id}
                          className="flex-shrink-0 w-[85vw] sm:w-56 bg-gray-50 border border-gray-200 rounded-lg p-3"   
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-semibold text-sm">
                                {review.user_name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-800 truncate">{review.user_name}</span>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {review.comment
                              ? review.comment.length > 150
                                ? `${review.comment.substring(0, 150)}...`
                                : review.comment
                              : 'No comment'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
 
                  <div className="flex items-center gap-3 mt-auto pt-4 ">
                    <span className="text-sm text-gray-600">Qty</span>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-green-600 hover:bg-green-100"
                      >
                        <Minus className="w-4 h-4 text-black" />
                      </button>
                      <span className="w-12 text-center text-black font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center bg-green-600 hover:bg-green-100"
                      >
                        <Plus className="w-4 h-4 text-black" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || addingToCart}
                      className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-3 sm:px-6 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                      <span className="hidden sm:inline">ADD TO CART</span>
                    </button>

                    <button
                      onClick={handleAddToWishlist}
                      disabled={addingToWishlist}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:border-red-300 hover:text-red-500 transition-colors"
                    >
                      {addingToWishlist ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded shadow mb-6">
              <div className="flex border-b">
                {[
                  { id: 'description', label: 'DESCRIPTION' },
                  { id: 'reviews', label: 'REVIEWS (0)' },
                  { id: 'tags', label: 'TAGS' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-6 py-4 text-sm font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'text-orange-500 border-b-2 border-orange-500 -mb-[1px]'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="text-gray-600 leading-relaxed">
                    {product.description || 'No description available for this product.'}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                )}
                {activeTab === 'tags' && (
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">{category?.name || 'General'}</span>
                    {subcategory && <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">{subcategory.name}</span>}
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">Eco-Friendly</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">Handmade</span>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="bg-white rounded shadow p-6 mt-42">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">RELATED PRODUCTS</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => scrollRelated('left')}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => scrollRelated('right')}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div
                  ref={relatedScrollRef}
                  className="flex gap-4 overflow-x-auto pb-2"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {relatedProducts.map((relatedProduct) => {
                    const { price: rPrice, finalPrice: rFinalPrice } = getProductPrice(relatedProduct);
                    const rImageUrl = getProductImageUrl(relatedProduct);

                    return (
                      <div
                        key={relatedProduct.id}
                        onClick={() => router.push(`/product/${relatedProduct.id}`)}
                        className="flex-shrink-0 w-52 bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-square relative bg-gray-50 overflow-hidden">
                          {rImageUrl ? (
                            <img
                              src={rImageUrl}
                              alt={relatedProduct.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Leaf className="w-10 h-10 text-gray-300" />
                            </div>
                          )}
                          {relatedProduct.discount && relatedProduct.discount > 0 && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              -{relatedProduct.discount}%
                            </span>
                          )}
                        </div>
                        <div className="p-3 text-center">
                          <div className="flex justify-center mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <h3 className="text-sm font-medium text-gray-800 group-hover:text-green-600 line-clamp-2 mb-2">
                            {relatedProduct.name}
                          </h3>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-orange-500 font-bold">₹{rFinalPrice.toLocaleString()}</span>
                            {relatedProduct.discount && relatedProduct.discount > 0 && (
                              <span className="text-gray-400 line-through text-sm">₹{rPrice.toLocaleString()}</span>
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
        </div>
      </div>
      <HomeFooter />
    </div>
  );
}
