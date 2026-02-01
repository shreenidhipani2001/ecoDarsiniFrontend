'use client';

import { useState, useEffect } from 'react';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ProductImage = {
  id: string;
  url: string;
  thumbnail: string | null;
  card: string | null;
  full: string | null;
  alt: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  images?: ProductImage[];
  category_name?: string;
  created_at?: string;
};

// Updated Blog type to match actual API response
type Blog = {
  id: string;
  name: string;           // ← title in UI
  description: string;    // ← content / body
  image: string | null;   // ← image path or null
  added_by: string;
  edited_by: string | null;
  created_at: string;
  updated_at: string;
  added_by_name?: string;
};

const getProductImageUrl = (product: Product): string => {
  if (!product.images || product.images.length === 0) return '';
  const image = product.images[0];
  return image.thumbnail || image.card || image.url || '';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${day} ${month}`;
};

export default function BlogsSection() {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBlogId, setExpandedBlogId] = useState<string | null>(null);

  const toggleBlogExpand = (blogId: string) => {
    setExpandedBlogId((prev) => (prev === blogId ? null : blogId));
  };

  // Fetch latest products (unchanged)
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        if (!API_URL) throw new Error('API URL not configured');

        const res = await fetch(`${API_URL}/api/products/five-latest`, {
          cache: 'no-store',
        });

        if (!res.ok) throw new Error(`Products: HTTP ${res.status}`);

        const data = await res.json();
        const productsList = data.products || data || [];
        setLatestProducts(productsList.slice(0, 5));
      } catch (err: any) {
        console.error('Failed to fetch latest products:', err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  // Fetch blogs (still using /api/blogs endpoint)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (!API_URL) throw new Error('API URL not configured');

        const res = await fetch(`${API_URL}/api/blogs`, {
          cache: 'no-store',
        });

        if (!res.ok) throw new Error(`Blogs: HTTP ${res.status}`);

        const data = await res.json();
        // API returns { blogs: [...], ... } or directly array — handle both
        const blogList = Array.isArray(data) ? data : data.blogs || [];
        setBlogs(blogList);
      } catch (err: any) {
        console.error('Failed to fetch blogs:', err);
        setError(err.message || 'Failed to load blogs');
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  console.log('BlogsSection Render:', { latestProducts, blogs, productsLoading, blogsLoading, error });

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Sidebar – Left Column */}
          <aside className="lg:col-span-3 space-y-10">
            {/* Latest Products Sidebar */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <h3 className="bg-green-700 text-white px-6 py-4 text-lg font-semibold">
                Latest Products
              </h3>
              <div className="p-5 space-y-6">
                {productsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  </div>
                ) : latestProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No products found</p>
                ) : (
                  latestProducts.map((product) => {
                    const imageUrl = getProductImageUrl(product);
                    return (
                      <div key={product.id} className="flex gap-4 group">
                        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden shadow-sm bg-gray-100">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <a
                            href="#"
                            className="text-gray-900 font-medium hover:text-green-600 transition line-clamp-2"
                          >
                            {product.name}
                          </a>
                          {product.category_name && (
                            <p className="text-xs text-gray-500 mt-1">{product.category_name}</p>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-green-600 font-semibold">
                              ₹{product.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Sidebar Banner */}
            <div className="hidden lg:block rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/image/catalog/banners/banner-sidebar.jpg"
                alt="Sidebar Banner"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </aside>

          {/* Main Blog Content */}
          <div className="lg:col-span-9">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Blog</h1>

            {/* Blog Grid */}
            {blogsLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-3 text-gray-600">Loading blogs...</span>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-20">{error}</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
                <p className="text-gray-500">Check back later for new articles</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* {blogs.map((blog) => {
                  const isExpanded = expandedBlogId === blog.id;
                  return (
                    <article
                      key={blog.id}
                      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    >
                      <div className="relative">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.name}
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-56 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <span className="text-green-600 text-6xl">📄</span>
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          {formatDate(blog.created_at)}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                          {blog.name}
                        </h3>

                        <div className="text-sm text-gray-500 mb-4 flex items-center gap-4">
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                            {blog.added_by_name || 'Admin'}
                          </span>
                        </div>

                         <div
                          className={`text-gray-600 mb-4 flex-grow transition-all duration-300 ${
                            isExpanded ? '' : 'line-clamp-3'
                          }`}
                        >
                          {blog.description}
                        </div>

                         <button
                          onClick={() => toggleBlogExpand(blog.id)}
                          className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-800 transition mt-auto"
                        >
                          {isExpanded ? 'Show Less' : 'Read More'}
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 transition-transform" />
                          ) : (
                            <ChevronDown className="w-5 h-5 transition-transform" />
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })} */}
                {blogs.map((blog) => {
  const isExpanded = expandedBlogId === blog.id;
  
  return (
    <article
      key={blog.id}
      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <div className="relative">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <span className="text-green-600 text-6xl">📄</span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {formatDate(blog.created_at)}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
          {blog.name}
        </h3>

        <div className="text-sm text-gray-500 mb-4 flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            {blog.added_by_name || 'Admin'}
          </span>
        </div>

        {/* Changed: using max-height transition instead of line-clamp */}
        {isExpanded?( <div
          className="text-gray-600 mb-4 overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            maxHeight: isExpanded ? '1000px' : '4.5em', // ≈ 3-4 lines at normal font size
          }}
        >
          {blog.description}
        </div>):( <div
           
        >
          
        </div>)}
       

        {/* Toggle Button */}
        <button
          onClick={() => toggleBlogExpand(blog.id)}
          className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-800 transition mt-auto self-start"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 transition-transform" />
          ) : (
            <ChevronDown className="w-5 h-5 transition-transform" />
          )}
        </button>
      </div>
    </article>
  );
})}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}