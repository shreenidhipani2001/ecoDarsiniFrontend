// app/category/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import HomeHeader from '../../../components/HomeHeader';

// Type based on your sample response
interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: string;
  stock?: number;
  images: Array<{
    id: string;
    url: string;
    thumbnail: string;
    card: string;
    full: string;
    alt?: string;
  }>;
  category_name: string;
  subcategory_name?: string;
  // ... other fields
}

interface ApiResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Fetch function (you can move to lib/api.ts)
async function fetchProductsByCategory(
  categoryId: string,
  page = 1,
  limit = 12,
  search = '',
  subCategoryId = ''
): Promise<ApiResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.set('search', search);
  if (subCategoryId) params.set('sub_category_id', subCategoryId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/category/${categoryId}?${params.toString()}`,
    { cache: 'no-store' } // or revalidate: 60 etc.
  );

  if (!res.ok) throw new Error('Failed to fetch products');

  return res.json();
}

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  let data: ApiResponse;

  try {
    data = await fetchProductsByCategory(params.id);
  } catch (error) {
    console.error(error);
    notFound();
  }

  const { products, total } = data;

  // For demo — you can fetch real tabs/subcategories from another endpoint
  const tabs = [
    { id: 'accessories', label: 'Accessories' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'electronics', label: 'Electronics' },
  ];

  return (
<div className="w-full    ">

        <HomeHeader />
        
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-20">
        {/* Left Column - Deals of the Week */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Deals of the Week
            </h2>

            <div className="space-y-8 overflow-x-auto snap-x snap-mandatory flex lg:flex-col lg:space-y-8 lg:overflow-x-hidden">
              {products.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="min-w-[280px] sm:min-w-[320px] lg:min-w-full snap-start bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0].card || product.images[0].url}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-64 object-cover"
                      />
                    )}
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      -20%
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2 hover:text-green-700">
                      <Link href={`/product/${product.slug}`}>{product.name}</Link>
                    </h3>

                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xl font-bold text-green-700">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{Number(product.price) * 1.25}
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      Available: <b>{product.stock || 100}</b> • Sold:{' '}
                      <b>{Math.floor(Math.random() * 50)}</b>
                    </div>

                    <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>

                    <div className="mt-4 text-sm text-orange-600 font-medium">
                      Hurry Up! Offer ends soon
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Best Sellers with Tabs */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Sellers</h2>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className="whitespace-nowrap border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 data-[active=true]:border-green-600 data-[active=true]:text-green-600"
                    // You can add state + onClick to switch content in real implementation
                    data-active={tab.id === 'accessories'}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0].card || product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-green-700">
                      <Link href={`/product/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg font-bold text-green-700">
                        ₹{product.price}
                      </span>
                      {Number(product.price) > 1000 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{(Number(product.price) * 1.15).toFixed(0)}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      {product.subcategory_name || product.category_name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination (simple) */}
            {data.totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-4">
                <button className="px-4 py-2 border bg-green-600  rounded disabled:opacity-50">
                  Previous
                </button>
                <span className="px-4 py-2 bg-green-600 ">
                  Page {data.page} of {data.totalPages}
                </span>
                <button className="px-4 py-2 border bg-green-600  rounded disabled:opacity-50">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}