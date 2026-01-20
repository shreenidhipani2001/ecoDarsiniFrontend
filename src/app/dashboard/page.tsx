// 'use client';

// import { useEffect, useState } from 'react';
// import Sidebar from '../user/SideBar';         // adjust path if needed
// import ProductCard from '../user/ProductCard';
// import ProductModal from '../user/ProductModal';

// /* ================= TYPES ================= */
// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   cms_image_ids: string[];     // coming from your DB
//   discount?: number;           // optional – add if your backend sends it
//   slug?: string;               // optional – useful for future links
// };

// /* ================= HELPERS ================= */
// const getCloudinaryUrl = (
//   publicId: string,
//   options = "w_600,h_600,c_fill,q_auto,f_auto"
// ) => {
//   if (!publicId) return '/placeholder.png';
//   const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
//   if (!cloudName) {
//     console.warn("Cloudinary cloud name not set");
//     return '/placeholder.png';
//   }
//   return `https://res.cloudinary.com/${cloudName}/image/upload/${options}/${publicId}.webp`;
// };

// export default function DashboardPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch products – same endpoint as BookFlip
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//         if (!apiUrl) throw new Error("API URL not configured");

//         const res = await fetch(`${apiUrl}/api/products/`, {
//           cache: 'no-store',      
//         });

//         if (!res.ok) {
//           throw new Error(`HTTP ${res.status} – ${res.statusText}`);
//         }

//         const data = await res.json();

//         // Assuming your API returns array directly
//         // If it's { data: [...] } or { products: [...] } → adjust accordingly
//         const productList = Array.isArray(data) ? data : data?.products || data?.data || [];

//         setProducts(productList);
//       } catch (err: any) {
//         console.error("Failed to load products:", err);
//         setError(err.message || "Could not load products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Optional: transform data if needed (e.g. add default discount)
//   const displayProducts = products.map(p => ({
//     ...p,
//     discount: p.discount ?? 0, // fallback if backend doesn't send discount
//   }));

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-gray-600">
//         Loading products...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-red-600">
//         {error}
//       </div>
//     );
//   }

//   if (!products.length) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-gray-600">
//         No products available
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar
//         isOpen={isSidebarOpen}
//         onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
//       />

//       {/* Main content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="bg-white shadow-sm p-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-800">
//             {isSidebarOpen ? 'Dashboard' : 'Dashboard'}
//           </h1>
//           <button
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             className="lg:hidden p-2 rounded-md hover:bg-gray-100"
//           >
//             {isSidebarOpen ? 'Close' : 'Menu'}
//           </button>
//         </header>

//         <main className="flex-1 p-6 overflow-y-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {displayProducts.map((product) => (
//               <ProductCard
//                 key={product.id}
//                 product={{
//                   ...product,
//                   image: product.cms_image_ids?.length
//                     ? ''
//                     // ? getCloudinaryUrl(product.cms_image_ids[0], "w_480,h_480,c_fill,q_auto,f_auto")
//                     : '/placeholder.png',
//                 }}
//                 onClick={() => setSelectedProduct(product)}
//               />
//             ))}
//           </div>
//         </main>
//       </div>

//       {/* Product Detail Modal */}
//       {selectedProduct && (
//         <ProductModal
//           product={{
//             ...selectedProduct,
//             image: selectedProduct.cms_image_ids?.length
//               ? getCloudinaryUrl(selectedProduct.cms_image_ids[0], "w_800,h_800,c_fill,q_auto,f_auto")
//               : '/placeholder.png',
//           }}
//           onClose={() => setSelectedProduct(null)}
//           // pass addToCart & addToWishlist functions when you implement them
//         />
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../user/SideBar';
import ProductCard from '../user/ProductCard';
import ProductModal from '../user/ProductModal';
import Image from '../../../public//bdjhbawdhja.jpeg'
import yyy from '../../../public/bdjhbawdhja.jpeg';

import type { StaticImageData } from 'next/image';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
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
          image: yyy, // ✅ pass imported image FOR NOW
        }}
        onClose={() => setSelectedProduct(null)}
        />
        // <ProductModal
        //   product={{
        //     ...selectedProduct,
        //     image: selectedProduct?.cms_image_ids?.length
        //       ? '../../public/bdjhbawdhja.jpeg'
        //       // ? getCloudinaryUrl(
        //       //     selectedProduct.cms_image_ids[0],
        //       //     "w_800,h_800,c_fill,q_auto,f_auto"
        //       //   )
        //       : '/placeholder.png',
        //   }}
        //   onClose={() => setSelectedProduct(null)}
        // />
      )}
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";

// type UIProduct = {
//   id: string;
//   name: string;
//   price: number;
//   discount: number;
//   image: string;
// };

// export default function ProductsGrid() {
//   const [products, setProducts] = useState<UIProduct[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//         if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL not set");

//         const res = await fetch(`${apiUrl}/api/products`, {
//           cache: "no-store",
//         });

        
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const data = await res.json();
//         console.log("Fetched products data:", data);

//         // Ensure array
//         const productList = Array.isArray(data) ? data : [];

    
//         const mappedProducts: UIProduct[] = productList.map((product) => {
//           const imageId =
//             Array.isArray(product.cms_image_ids) &&
//             product.cms_image_ids.length > 0
//               ? product.cms_image_ids[0]
//               : null;

//           return {
//             id: product.id,
//             name: product.name,
//             price: Number(product.price),
//             discount: 0, // future use
//             image: imageId
//               ?"/images/placeholder.png"
//               // ? `https://res.cloudinary.com/dsxzmawd9/image/upload/w_480,h_480,c_fill,q_auto,f_auto/${imageId}.webp`
//               : "/images/placeholder.png",
//           };
//         });

//         setProducts(mappedProducts);
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return <p className="text-center py-10">Loading products...</p>;
//   }

//   if (!products.length) {
//     return <p className="text-center py-10">No products found</p>;
//   }

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//       {products.map((product) => (
//         <div
//           key={product.id}
//           className="bg-white rounded-xl shadow p-4"
//         >
//           <Image
//             src={product.image}
//             alt={product.name}
//             width={480}
//             height={480}
//             className="rounded-lg object-cover"
//           />

//           <h3 className="mt-3 font-semibold">
//             {product.name}
//           </h3>

//           <p className="text-sm text-gray-600">
//             ₹{product.price}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }
