'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Package,
  Calendar,
  XCircle,
  X,
  CheckCircle,
  AlertCircle,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

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
  product_id: string;
  total_amount: string;
  status: string;
  is_cancelled: boolean;
  cancel_desc?: string;
  created_at: string;
  product_name?: string;
  product_image?: string;
  payment_id?: string;
};

interface OrdersModalProps {
  userId: string;
  inline?: boolean;
}

/* ================= HELPERS ================= */

const getProductImageUrl = (
  product?: Product,
  size: 'thumbnail' | 'card' | 'full' | 'url' = 'card'
): string => {
  if (!product?.images || product.images.length === 0) return '';
  const image = product.images[0];
  return image[size] || image.url || '';
};

const getStatusStyle = (status: string, isCancelled: boolean) => {
  if (isCancelled) return 'bg-red-50 text-red-700 border border-red-200';
  switch (status.toUpperCase()) {
    case 'COMPLETED':
    case 'DELIVERED':
      return 'bg-green-50 text-green-700 border border-green-200';
    case 'PENDING':
    case 'CREATED':
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    case 'PROCESSING':
    case 'SHIPPED':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};

const getStatusIcon = (status: string, isCancelled: boolean) => {
  if (isCancelled) return <XCircle className="w-5 h-5" />;
  switch (status.toUpperCase()) {
    case 'COMPLETED':
    case 'DELIVERED':
      return <CheckCircle className="w-5 h-5" />;
    case 'CANCELLED':
    case 'FAILED':
      return <XCircle className="w-5 h-5" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/* ================= DETAIL MODAL ================= */

function OrderDetailView({
  order,
  product,
  imageUrl,
  onClose,
  onCancel,
}: {
  order: Order;
  product?: Product;
  imageUrl: string;
  onClose: () => void;
  onCancel: (id: string) => void;
}) {
  const displayName = product?.name || order.product_name || 'Product';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div className="relative w-full aspect-square max-h-[50vh] bg-gray-50 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={displayName}
              className="w-full h-full object-contain"
              onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = '/tribal-art-statues-stockcake.webp'; }}
            />
          ) : (
            <Package className="w-16 h-16 text-gray-300" />
          )}

          {/* Close button overlay */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-red-400 hover:bg-red-500 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Status badge overlay */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm ${getStatusStyle(
                order.status,
                order.is_cancelled
              )}`}
            >
              {getStatusIcon(order.status, order.is_cancelled)}
              {order.is_cancelled ? 'Cancelled' : order.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Product name & price */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-2xl font-bold text-green-700 mt-1">
              ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
            </p>
          </div>

          {/* Cancelled warning */}
          {order.is_cancelled && order.cancel_desc && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
                <p className="text-sm text-red-600 mt-0.5">{order.cancel_desc}</p>
              </div>
            </div>
          )}

          {/* Info rows */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Ordered on</p>
                <p className="font-medium text-gray-800">{formatDateTime(order.created_at)}</p>
              </div>
            </div>

            {/* {order.payment_id && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment ID</p>
                  <p className="font-medium text-gray-800 font-mono text-xs">{order.payment_id}</p>
                </div>
              </div>
            )} */}

            {product?.price && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Unit Price</p>
                  <p className="font-medium text-gray-800">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex gap-3">
          {!order.is_cancelled && order.status.toUpperCase() !== 'DELIVERED' && (
            <button
              onClick={() => {
                onCancel(order.id);
                onClose();
              }}
              className="flex-1 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              Cancel Order
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function OrdersModal({ userId }: OrdersModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchOrders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/orders/user/${userId}`);
      const data = await res.json();
      const ordersList: Order[] = Array.isArray(data) ? data : data?.orders || [];
      setOrders(ordersList);

      // Fetch product details for images
      const productIds = [...new Set(ordersList.map((o) => o.product_id))];
      if (productIds.length > 0) {
        const productsRes = await fetch(`${apiUrl}/api/products/by-ids`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_ids: productIds }),
        });
        if (productsRes.ok) {
          const productJson = await productsRes.json();
          setProducts(productJson.products || []);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/orders/cancel/${orderId}`, {
        method: 'PUT',
      });

      if (!res.ok) throw new Error();

      toast.success('Order Cancelled');
      fetchOrders();
    } catch {
      toast.error('Cancel failed');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const productMap = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<string, Product>);
  }, [products]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-green-600" />
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Package className="w-12 h-12 mb-3 stroke-[1.5]" />
        <p className="text-lg font-medium">No orders yet</p>
        <p className="text-sm mt-1">Your orders will appear here once you make a purchase.</p>
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => {
          const product = productMap[order.product_id];
          const imageUrl = getProductImageUrl(product, 'card');
          const displayName = product?.name || order.product_name || 'Product';

          return (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`rounded-xl overflow-hidden transition-all cursor-pointer ${
                order.is_cancelled
                  ? 'border border-red-200 bg-red-50/30'
                  : 'border border-gray-100 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex gap-4 p-4">
                {/* Product Image */}
                <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = '/tribal-art-statues-stockcake.webp'; }}
                    />
                  ) : (
                    <Package className="w-8 h-8 text-gray-300" />
                  )}
                </div>

                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {displayName}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  </div>

                  <p className="text-lg font-bold text-green-700 mt-1">
                    ₹{order.total_amount}
                  </p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusStyle(
                        order.status,
                        order.is_cancelled
                      )}`}
                    >
                      {order.is_cancelled ? 'Cancelled' : order.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailView
          order={selectedOrder}
          product={productMap[selectedOrder.product_id]}
          imageUrl={getProductImageUrl(productMap[selectedOrder.product_id], 'full')}
          onClose={() => setSelectedOrder(null)}
          onCancel={cancelOrder}
        />
      )}
    </>
  );
}
