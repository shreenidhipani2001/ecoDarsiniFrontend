'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ChevronLeft, Clock, User, Calendar, Tag, Eye, Heart } from 'lucide-react';
import HomeHeader from '../../../components/HomeHeader';
import HomeFooter from '../../../components/HomeFooter';
import { fetchBlogByIdCached } from '../../../../lib/cachedFetch';
import { resolveImages, type ResolvedImage } from '../../../../lib/imageResolver';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Blog = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  slug: string;
  short_description: string;
  content: string;
  author_name: string;
  author_image: string | null;
  status: string;
  is_featured: boolean;
  tags: string[];
  category: string;
  seo_title: string;
  seo_description: string;
  view_count: number;
  like_count: number;
  reading_time: number;
  published_at: string;
  cms_image_ids: string[];
};

const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [blogImages, setBlogImages] = useState<ResolvedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!API_URL || !id) return;
      try {
        const data = await fetchBlogByIdCached(id) as Blog;
        setBlog(data);

        // Resolve CMS images directly from Payload CMS
        if (data.cms_image_ids && data.cms_image_ids.length > 0) {
          const resolved = await resolveImages(data.cms_image_ids);
          setBlogImages(resolved);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load blog';
        console.error('Blog fetch error:', err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Get hero image: first resolved image or fallback
  const getHeroImage = (): string | null => {
    if (blogImages.length > 0) {
      return blogImages[0].full || blogImages[0].url;
    }
    return blog?.image || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HomeHeader />
        <div className="flex justify-center items-center py-40">
          <Loader2 className="h-10 w-10 animate-spin text-green-600" />
          <span className="ml-4 text-gray-600 text-lg">Loading article...</span>
        </div>
        <HomeFooter />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HomeHeader />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">404</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Blog not found</h2>
          <p className="text-gray-500 mb-8">{error || 'The article you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/blog')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Back to Blogs
          </button>
        </div>
        <HomeFooter />
      </div>
    );
  }

  const heroImage = getHeroImage();

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      {/* Hero Section */}
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[480px] bg-gray-900 overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage}
            alt={blog.name}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-800 to-green-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16 max-w-4xl mx-auto">
          {blog.category && (
            <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
              {blog.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {blog.name}
          </h1>
          <p className="text-gray-200 mt-4 text-base sm:text-lg max-w-2xl">
            {blog.short_description}
          </p>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {blog.author_name || 'Admin'}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatFullDate(blog.published_at || blog.created_at)}
          </span>
          {blog.reading_time > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {blog.reading_time} min read
            </span>
          )}
          {blog.view_count > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {blog.view_count} views
            </span>
          )}
          {blog.like_count > 0 && (
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              {blog.like_count} likes
            </span>
          )}
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 lg:p-14">
          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
            {blog.content}
          </div>

          {/* Additional images */}
          {blogImages.length > 1 && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blogImages.slice(1).map((img) => (
                <div key={img.id} className="rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={img.card || img.url}
                    alt={img.alt || 'Blog image'}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-gray-400" />
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="mt-10">
          <button
            onClick={() => router.push('/blog')}
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to all blogs
          </button>
        </div>
      </article>

      <HomeFooter />
    </div>
  );
}
