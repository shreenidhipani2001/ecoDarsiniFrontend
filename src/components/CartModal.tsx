 
// 'use client';

// import { useEffect, useState } from 'react';
// import BaseModal from './BaseModal';
// import Image from 'next/image';

// export default function CartModal({
//   cart,
//   onClose,
// }: {
//   cart: any;
//   onClose: () => void;
// }) {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Extract userId
//   const userId = cart?.user?.user?.id;

//   // Local state for cart items
//   const [items, setItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//   if (!apiUrl) throw new Error('API URL not set');

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       if (!userId) return;

//       setLoading(true);
//       try {
//         const res = await fetch(`${apiUrl}/api/cart/user/${userId}`);
//         const data = await res.json();
//         setItems(data); // assuming backend returns array of cart items with product details
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCartItems();
//   }, [userId]);

//   if (loading) {
//     return (
//       <BaseModal title="My Cart" onClose={onClose}>
//         <div className="flex justify-center items-center h-64">
//           <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
//         </div>
//       </BaseModal>
//     );
//   }

//   if (!items || items.length === 0) {
//     return (
//       <BaseModal title="My Cart" onClose={onClose}>
//         <div className="text-center text-gray-700 py-10">Your cart is empty.</div>
//       </BaseModal>
//     );
//   }

//   // Current item
//   const item = items[currentIndex];

//   return (
//     <BaseModal title="My Cart" onClose={onClose}>
//       <div className="flex flex-col items-center gap-6">
//         {/* Product Image */}
//         <div className="w-64 h-64 bg-gray-100 rounded-xl relative overflow-hidden">
//           {/* Replace with your actual image URL */}
//           <Image
//             src={`/images/products/${item.product_id}.webp`}
//             alt={item.name}
//             fill
//             className="object-cover"
//           />
//         </div>

//         {/* Product Details */}
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
//           <p className="text-gray-700 mt-2">Quantity: {item.quantity}</p>
//           <p className="text-gray-900 font-semibold mt-1">₹{item.total_price}</p>
//         </div>

//         {/* Pagination Buttons */}
//         <div className="flex gap-4 mt-4">
//           <button
//             onClick={() =>
//               setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
//             }
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
//             disabled={currentIndex === 0}
//           >
//             Previous
//           </button>
//           <button
//             onClick={() =>
//               setCurrentIndex((prev) =>
//                 prev < items.length - 1 ? prev + 1 : prev
//               )
//             }
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
//             disabled={currentIndex === items.length - 1}
//           >
//             Next
//           </button>
//         </div>

//         {/* Page indicator */}
//         <p className="text-gray-500 text-sm">
//           {currentIndex + 1} / {items.length}
//         </p>
//       </div>
//     </BaseModal>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import BaseModal from './BaseModal';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

export default function CartModal({
  cart,
  onClose,
}: {
  cart: any;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = cart?.user?.user?.id;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('API URL not set');

  // Helper to get Cloudinary URL
  const getCloudinaryUrl = (publicId: string, options = "w_600,h_600,c_fill,q_auto,f_auto") => {
    if (!publicId) return '/placeholder.png';
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
    if (!cloudName) return '/placeholder.png';
    return `https://res.cloudinary.com/${cloudName}/image/upload/${options}/${publicId}.webp`;
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        console.log(`${apiUrl}/api/cart/user/${userId}`)
        const res = await fetch(`${apiUrl}/api/cart/user/${userId}`);
        const data = await res.json();
        setItems(
          data?.map((item: any) => ({
            ...item,
            image: item.cms_image_ids?.[0]
              ? getCloudinaryUrl(item.cms_image_ids[0])
              : '/placeholder.png',
          }))
        );
      } catch (err) {
        console.error('Failed to fetch cart items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId, apiUrl]);

  if (loading) {
    return (
      <BaseModal title="My Cart" onClose={onClose}>
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      </BaseModal>
    );
  }

  if (!items || items.length === 0) {
    return (
      <BaseModal title="My Cart" onClose={onClose}>
        <div className="text-center text-gray-700 py-10">Your cart is empty.</div>
      </BaseModal>
    );
  }

  const item = items[currentIndex];

  return (
    <BaseModal title="My Cart" onClose={onClose}>
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Left - Product Image */}
        <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-100 rounded-xl relative overflow-hidden">
          <Image
            src={item.image ?? '/placeholder.png'}
            alt={item.name}
            fill
            className="object-cover rounded-xl"
          />
        </div>

        {/* Right - Product Details */}
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
            <p className="text-gray-700 mt-2">Quantity: {item.quantity}</p>
            <p className="text-gray-900 font-semibold mt-1">₹{item.total_price}</p>
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
              }
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev < items.length - 1 ? prev + 1 : prev
                )
              }
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              disabled={currentIndex === items.length - 1}
            >
              Next
            </button>
          </div>

          <p className="text-gray-500 text-sm mt-2 text-center">
            {currentIndex + 1} / {items.length}
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
