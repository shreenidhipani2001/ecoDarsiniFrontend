'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

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
};

interface OrdersModalProps {
  userId: string;
  inline?: boolean;
}

export default function OrdersModal({ userId }: OrdersModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchOrders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/orders/user/${userId}`);
      const data = await res.json();
      setOrders(data || []);
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

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="space-y-6">
      {/* <h1 className="text-2xl font-bold">My Orders</h1> */}

      {orders.length === 0 && (
        <p className="text-gray-500">No orders yet.</p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-xl shadow p-4 flex gap-4 items-center"
        >
          <Image
            src={order.product_image || '/placeholder.png'}
            alt="product"
            width={100}
            height={100}
            className="rounded-md object-cover"
          />

          <div className="flex-1">
            <h2 className="font-semibold">{order.product_name}</h2>
            <p className="text-gray-600">₹ {order.total_amount}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm font-medium">
              Status: {order.status}
            </p>

            {order.is_cancelled && (
              <p className="text-red-500 text-sm">
                Cancelled: {order.cancel_desc}
              </p>
            )}
          </div>

          {!order.is_cancelled && (
            <button
              onClick={() => cancelOrder(order.id)}
              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
            >
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
