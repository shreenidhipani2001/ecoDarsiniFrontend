 'use client';

import { useEffect, useMemo, useState } from 'react';
import OrderDetailModal from './OrderDetailModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ================= TYPES ================= */

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
  cms_image_ids: string[];
  images?: ProductImage[];
};

type Order = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  total_amount: number | string;
  status: string;
  payment_id?: string;
  created_at: string;
  is_cancelled?: boolean;
  cancel_desc?: string | null;
  user_name?: string;
  user_email?: string;
};

/* ================= IMAGE HELPER ================= */

const getProductImageUrl = (
  product?: Product,
  size: 'thumbnail' | 'card' | 'full' | 'url' = 'card'
): string => {
  if (!product?.images || product.images.length === 0) return '';
  const image = product.images[0];
  return image[size] || image.url || '';
};

/* ================= COMPONENT ================= */

export default function OrdersGrid() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!API_URL) throw new Error('API URL not configured');

        /* -------- Fetch Orders -------- */
        const ordersRes = await fetch(`${API_URL}/api/orders/`, {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!ordersRes.ok) throw new Error(`Orders: ${ordersRes.status}`);

        const ordersData = await ordersRes.json();
        const ordersList: Order[] = Array.isArray(ordersData)
          ? ordersData
          : ordersData?.orders || [];

        setOrders(ordersList);

        /* -------- Extract Product IDs -------- */
        const productIds = [
          ...new Set(ordersList.map(o => o.product_id)),
        ];

        if (productIds.length === 0) {
          setProducts([]);
          setTotalPages(1);
          return;
        }

        /* -------- Fetch Products By IDs -------- */
        const productsRes = await fetch(`${API_URL}/api/products/by-ids`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            product_ids: productIds,
            page,
            limit: 20,
          }),
        });

        if (!productsRes.ok) throw new Error('Products fetch failed');

        const productJson = await productsRes.json();

        setProducts(productJson.products || []);
        setTotalPages(productJson.totalPages || 1);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  /* ================= PRODUCT LOOKUP ================= */

  const productMap = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<string, Product>);
  }, [products]);

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 py-20">{error}</div>;
  }

  if (!orders.length) {
    return <div className="text-center text-gray-400 py-20">No orders found</div>;
  }

  console.log('Orders:', orders);

  /* ================= RENDER ================= */

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {orders.map(order => {
          const product = productMap[order.product_id];
          const imageUrl = getProductImageUrl(product, 'card');

          return (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              // className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden cursor-pointer"
              className={`
                bg-white rounded-xl transition overflow-hidden cursor-pointer
                ${order.is_cancelled
                  ? 'border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                  : 'shadow hover:shadow-md'}
              `}
           >
              {/* Image */}
              <div className="h-52 w-full bg-gray-100 flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product?.name || 'Product'}
                    className="max-w-full max-h-full object-contain p-2 hover:scale-105 transition"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No Image</div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-green-600 truncate">
                  {product?.name || 'Unknown Product'}
                </h3>

                <p className="text-sm text-black mt-1">
                  Qty: {order.quantity}
                </p>

                <p className="text-sm text-black">
                  Unit: ₹{product?.price ?? '--'}
                </p>

                <p className="mt-2 text-black font-bold">
                  ₹{order.total_amount}
                </p>

                <p className="text-xs text-black mt-2">
                  Ordered on{' '}
                  {new Date(order.created_at).toLocaleDateString('en-IN')}
                </p>
              </div>
              {order.is_cancelled && (
  <div className="flex justify-center mt-3 mb-2">
    <span className="text-red-600 text-sm md:text-base font-bold">
      Cancelled
    </span>
  </div>
)}
            

            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 bg-gray-900 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2 text-black">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 text-white bg-gray-900 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          product={productMap[selectedOrder.product_id]}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
