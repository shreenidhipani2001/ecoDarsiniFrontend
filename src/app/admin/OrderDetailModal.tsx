'use client';

import { X, Package, User, CreditCard, Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

type Order = {
  id: string;
  user_id: string;
  product_id: string;
  quantity?: number;
  total_amount: number | string;
  status: string;
  payment_id?: string;
  created_at: string;
  is_cancelled?: boolean;
  cancel_desc?: string | null;
  user_name?: string;
  user_email?: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
};

interface Props {
  order: Order;
  product?: Product;
  onClose: () => void;
}

export default function OrderDetailModal({ order, product, onClose }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'DELIVERED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
      case 'CREATED':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      case 'PROCESSING':
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'DELIVERED':
        return <CheckCircle className="h-5 w-5" />;
      case 'CANCELLED':
      case 'FAILED':
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-green-700">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Order Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
          >
            <X size={18} className="text-red-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Order Status Banner */}
          <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <div>
              <p className="font-semibold">Order Status</p>
              <p className="text-sm">{order.status}</p>
            </div>
          </div>

          {/* Cancelled Warning */}
          {order.is_cancelled && (
            <div className="flex items-center gap-3 p-4 rounded-xl mb-6 bg-red-50 border border-red-200">
              <XCircle className="h-6 w-6 text-red-500" />
              <div>
                <p className="font-semibold text-red-700">Order Cancelled</p>
                {order.cancel_desc && (
                  <p className="text-sm text-red-600">{order.cancel_desc}</p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Order Information
              </h3>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {/* <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Order ID
                  </label>
                  <p className="text-sm font-mono text-gray-800 break-all">{order.id}</p>
                </div> */}

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Product
                  </label>
                  <p className="text-sm font-semibold text-gray-800">
                    {product?.name || 'Unknown Product'}
                  </p>
                </div>

                {order.quantity && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Quantity
                    </label>
                    <p className="text-sm text-gray-800">{order.quantity}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Total Amount
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{typeof order.total_amount === 'string'
                      ? parseFloat(order.total_amount).toLocaleString()
                      : order.total_amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Customer Information
              </h3>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Customer Name
                  </label>
                  <p className="text-sm font-semibold text-gray-800">
                    {order.user_name || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-sm text-gray-800">{order.user_email || 'N/A'}</p>
                </div>

                {/* <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    User ID
                  </label>
                  <p className="text-xs font-mono text-gray-600 break-all">{order.user_id}</p>
                </div> */}
              </div>
            </div>

            {/* Payment Information */}
            {/* <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Payment Information
              </h3>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Payment ID
                  </label>
                  <p className="text-sm font-mono text-gray-800">
                    {order.payment_id || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Product ID
                  </label>
                  <p className="text-xs font-mono text-gray-600 break-all">{order.product_id}</p>
                </div>
              </div>
            </div> */}

            {/* Date Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Date Information
              </h3>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Order Date
                  </label>
                  <p className="text-sm text-gray-800">{formatDate(order.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
