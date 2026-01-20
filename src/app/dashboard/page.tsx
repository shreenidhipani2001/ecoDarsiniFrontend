'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../user/SideBar';
import ProductCard from '../user/ProductCard';
import ProductModal from '../user/ProductModal';
import Image from '../../../public//bdjhbawdhja.jpeg'
import yyy from '../../../public/bdjhbawdhja.jpeg';
import { useAuthStore } from '../../store/useAuthStore';


import type { StaticImageData } from 'next/image';
import WishlistModal from '../../components/WishlistModal';
import CartModal from '../../components/CartModal';
import ProfileModal from '../../components/ProfileModal';
/* ================= TYPES ================= */
type Product = {
  id: string;
  name: string;
  price: number;
  cms_image_ids: string[];
  discount?: number;
  slug?: string;
  image?: string | StaticImageData; // 👈 UI-ready image
};

/* ================= HELPERS ================= */
const getCloudinaryUrl = (
  publicId: string,
  options = "w_600,h_600,c_fill,q_auto,f_auto"
) => {
  if (!publicId) return '/placeholder.png';

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  if (!cloudName) {
    console.warn("Cloudinary cloud name not set");
    return '/placeholder.png';
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${options}/${publicId}.webp`;
};

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeModal, setActiveModal] = useState<'profile' | 'cart' | 'wishlist' | null>(null);
  const { user, setUser } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  const dummyCart = {
    user: user,
    items: [
      { id: 'p1', name: 'Clay Diya', qty: 2, price: 299 },
      { id: 'p2', name: 'Handmade Vase', qty: 1, price: 799 },
    ],
    total: 1397,
  };
  
  const dummyWishlist = {
    user: user,
    items: [
      { id: 'p3', name: 'Wall Art', price: 999 },
      { id: 'p4', name: 'Bamboo Lamp', price: 1299 },
    ],
  };
  
  
  console.log("User Info  in dashbboard:", user);

  const dummyUser = {
    id: user?.user.id,
    name: user?.user.name,
    email:user?.user.email ,
    role: user?.user.role,
  };
  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) throw new Error("API URL not configured");

        const res = await fetch(`${apiUrl}/api/products`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} – ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Fetched products data:", data);
        const productList = Array.isArray(data)
          ? data
          : data?.products || data?.data || [];
        console.log("Product List:", productList);

        /* API → UI TRANSFORMATION */
        const mappedProducts: Product[] = productList.map((p: any) => {
          const imageId =
            Array.isArray(p.cms_image_ids) && p.cms_image_ids.length > 0
              ? p.cms_image_ids[0]
              : null;
          console.log(`Product ID: ${p.id}, Image ID: ${imageId}`);

          return {
            id: p.id,
            name: p.name,
            price: Number(p.price),
            slug: p.slug,
            cms_image_ids: p.cms_image_ids || [],
            discount: p.discount ?? 0,
            image: imageId
              ?  Image
              // ? getCloudinaryUrl(imageId, "w_480,h_480,c_fill,q_auto,f_auto")
              : '/placeholder.png',
          };
        });

        setProducts(mappedProducts);
      } catch (err: any) {
        console.error("Failed to load products:", err);
        setError(err.message || "Could not load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        No products available
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      /> */}

<Sidebar
  isOpen={isSidebarOpen}
  onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
  onOpenModal={setActiveModal}
/>
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 bg-green-400 rounded-md hover:bg-green-700 text-black font-semibold"
            // className="lg:hidden p-2 bg-grey-400 rounded-md hover:bg-gray-700"
          >
            {isSidebarOpen ? 'Close' : 'Menu'}
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
        product={{
          ...selectedProduct,
          image: yyy,  
        }}
        onClose={() => setSelectedProduct(null)}
        />
       
      )}

{activeModal === 'profile' && (
  <ProfileModal
    user={dummyUser}
    onClose={() => setActiveModal(null)}
  />
)}

{activeModal === 'cart' && (
  <CartModal
    cart={dummyCart}
 
    onClose={() => setActiveModal(null)}
  />
)}

{activeModal === 'wishlist' && (
  <WishlistModal
 
    wishlist={dummyWishlist}
    onClose={() => setActiveModal(null)}
  />
)}
    </div>
  );
}
 