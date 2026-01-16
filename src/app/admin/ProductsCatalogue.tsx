// "use client";
// import { useState } from "react";

// export default function BookFlip() {
//   const totalPages = 100; // must be even for nice spreads
//   const [currentSpread, setCurrentSpread] = useState(0);
//   const [isTurning, setIsTurning] = useState(false);
//   const [turnDirection, setTurnDirection] = useState<"next" | "prev" | null>(
//     null
//   );

//   const maxSpread = Math.floor((totalPages - 1) / 2);

//   const goNext = () => {
//     if (currentSpread >= maxSpread || isTurning) return;

//     setIsTurning(true);
//     setTurnDirection("next");

//     setTimeout(() => {
//       setCurrentSpread((prev) => prev + 1);
//       setIsTurning(false);
//       setTurnDirection(null);
//     }, 900);
//   };

//   const goPrev = () => {
//     if (currentSpread <= 0 || isTurning) return;

//     setIsTurning(true);
//     setTurnDirection("prev");

//     setTimeout(() => {
//       setCurrentSpread((prev) => prev - 1);
//       setIsTurning(false);
//       setTurnDirection(null);
//     }, 900);
//   };

//   const leftPageNum = currentSpread * 2 + 1;
//   const rightPageNum = currentSpread * 2 + 2;

//   const showLeftPage = leftPageNum <= totalPages;
//   const showRightPage = rightPageNum <= totalPages;

//   return (
//     <>
//       <div className="book-container">
//         <button
//           className="nav-btn prev"
//           onClick={goPrev}
//           disabled={currentSpread === 0 || isTurning}
//         >
//           ◀
//         </button>

//         <div
//           className={`book ${isTurning ? "turning" : ""} ${
//             turnDirection || ""
//           }`}
//         >
//           {/* Left page */}
//           <div className="page left-page">
//             {showLeftPage ? (
//               <div className="page-content">
//                 <h2>Product {leftPageNum}</h2>
//                 <div className="product-placeholder" />
//                 <p>
//                   Amazing features • Super cool • Only ₹
//                   {999 + leftPageNum * 100}
//                 </p>
//               </div>
//             ) : (
//               <div className="empty-page" />
//             )}
//           </div>

//           {/* Right page */}
//           <div
//             className={`page right-page ${
//               isTurning
//                 ? turnDirection === "next"
//                   ? "flip-forward"
//                   : "flip-backward"
//                 : ""
//             }`}
//           >
//             {showRightPage ? (
//               <div className="page-content">
//                 <h2>Product {rightPageNum}</h2>
//                 <div className="product-placeholder" />
//                 <p>
//                   Amazing features • Super cool • Only ₹
//                   {999 + rightPageNum * 100}
//                 </p>
//               </div>
//             ) : (
//               <div className="empty-page" />
//             )}
//           </div>

//           {/* Flipping page */}
//           {isTurning && (
//             <div className={`page flipping-page ${turnDirection}`}>
//               <div className="page-content front">
//                 <h2>
//                   Product{" "}
//                   {turnDirection === "next" ? rightPageNum : leftPageNum}
//                 </h2>
//                 <div className="product-placeholder" />
//                 <p>Turning...</p>
//               </div>
//               <div className="page-content back">
//                 <h2>
//                   Product{" "}
//                   {turnDirection === "next"
//                     ? rightPageNum + 1
//                     : leftPageNum - 1}
//                 </h2>
//                 <div className="product-placeholder" />
//                 <p>Next one coming...</p>
//               </div>
//             </div>
//           )}
//         </div>

//         <button
//           className="nav-btn next"
//           onClick={goNext}
//           disabled={currentSpread >= maxSpread || isTurning}
//         >
//           ▶
//         </button>
//       </div>

//       {/* ================= CSS ================= */}
//       <style jsx>{`
//         .book-container {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 24px;
//           min-height: 100vh;
//           background: #f4f4f5;
//           perspective: 2000px;
//         }

//         .nav-btn {
//           font-size: 28px;
//           padding: 10px 16px;
//           border: none;
//           background: #111;
//           color: #fff;
//           cursor: pointer;
//           border-radius: 6px;
//         }

//         .nav-btn:disabled {
//           opacity: 0.4;
//           cursor: not-allowed;
//         }

//         .book {
//           position: relative;
//           width: 700px;
//           height: 420px;
//           display: flex;
//           transform-style: preserve-3d;
//         }

//         .page {
//           width: 50%;
//           height: 100%;
//           background: #fff;
//           border: 1px solid #ddd;
//           position: relative;
//           overflow: hidden;
//           backface-visibility: hidden;
//         }

//         .left-page {
//           border-right: none;
//         }

//         .right-page {
//           border-left: none;
//           transform-origin: left center;
//         }

//         .page-content {
//           padding: 24px;
//         }

//         .product-placeholder {
//           height: 180px;
//           background: linear-gradient(135deg, #ddd, #bbb);
//           margin-bottom: 12px;
//           border-radius: 6px;
//         }

//         .empty-page {
//           width: 100%;
//           height: 100%;
//           background: #eee;
//         }

//         .book.turning {
//           pointer-events: none;
//         }

//         .right-page.flip-forward {
//           animation: flipForward 0.9s ease-in-out forwards;
//         }

//         .right-page.flip-backward {
//           animation: flipBackward 0.9s ease-in-out forwards;
//         }

//         .flipping-page {
//           position: absolute;
//           width: 50%;
//           height: 100%;
//           right: 0;
//           top: 0;
//           transform-style: preserve-3d;
//           transform-origin: left center;
//           z-index: 10;
//           background: white;
//         }

//         .flipping-page.next {
//           animation: flipForward 0.9s ease-in-out forwards;
//         }

//         .flipping-page.prev {
//           animation: flipBackward 0.9s ease-in-out forwards;
//         }

//         .flipping-page .front,
//         .flipping-page .back {
//           position: absolute;
//           inset: 0;
//           backface-visibility: hidden;
//         }

//         .flipping-page .back {
//           transform: rotateY(180deg);
//         }

//         @keyframes flipForward {
//           0% {
//             transform: rotateY(0deg);
//           }
//           100% {
//             transform: rotateY(-180deg);
//           }
//         }

//         @keyframes flipBackward {
//           0% {
//             transform: rotateY(-180deg);
//           }
//           100% {
//             transform: rotateY(0deg);
//           }
//         }
//       `}</style>
//     </>
//   );
// }




"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Product = {
  id: string;
  name: string;
  price: number;
  cms_image_ids: string[];
};

/* ================= HELPERS ================= */

const getCloudinaryUrl = (
  publicId: string,
  options = "w_600,h_400,c_fill,q_auto,f_auto"
) => {
  console.log("Cloudinary Name:", process.env.NEXT_PUBLIC_CLOUDINARY_NAME);
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/${options}/${publicId}.webp`;
};

/* ================= COMPONENT ================= */

export default function BookFlip() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState<"next" | "prev" | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  /* ========== FETCH PRODUCTS ========== */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/`
        );
        const data = await res.json();
        console.log("Fetched products:", data);
        setProducts(data);
      } catch (err) {
        console.log("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ========== PAGINATION LOGIC ========== */

  const totalPages = products.length;
  const maxSpread = Math.floor((totalPages - 1) / 2);

  const leftPageNum = currentSpread * 2 + 1;
  const rightPageNum = currentSpread * 2 + 2;

  const leftProduct = products[leftPageNum - 1];
  const rightProduct = products[rightPageNum - 1];

  /* ========== NAVIGATION ========== */

  const goNext = () => {
    if (currentSpread >= maxSpread || isTurning) return;

    setIsTurning(true);
    setTurnDirection("next");

    setTimeout(() => {
      setCurrentSpread((prev) => prev + 1);
      setIsTurning(false);
      setTurnDirection(null);
    }, 900);
  };

  const goPrev = () => {
    if (currentSpread <= 0 || isTurning) return;

    setIsTurning(true);
    setTurnDirection("prev");

    setTimeout(() => {
      setCurrentSpread((prev) => prev - 1);
      setIsTurning(false);
      setTurnDirection(null);
    }, 900);
  };

  /* ========== LOADING STATE ========== */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading catalogue…
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex items-center justify-center min-h-screen  text-gray-600">
        No products available
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <>
      <div className="book-container">
        <button
          className="nav-btn prev"
          onClick={goPrev}
          disabled={currentSpread === 0 || isTurning}
        >
          ◀
        </button>

        <div
          className={`book ${isTurning ? "turning" : ""} ${
            turnDirection || ""
          }`}
        >
          {/* LEFT PAGE */}
          <div className="page left-page">
            {leftProduct ? (
              <div className="page-content text-gray-800">
                <h2>{leftProduct.name}</h2>
{/* 
                <img
                  src={getCloudinaryUrl(leftProduct.cms_image_ids[0])}
                  alt={leftProduct.name}
                  className="product-image"
                /> */}
              <img
                src={
                  leftProduct.cms_image_ids?.length
                    ? getCloudinaryUrl(leftProduct.cms_image_ids[0])
                    : "/placeholder.png"
                }
                alt={leftProduct.name}
                className="product-image text-grey-500"
              />

                <p className="price text-gray-800">₹{leftProduct.price}</p>
              </div>
            ) : (
              <div className="empty-page" />
            )}
          </div>

          {/* RIGHT PAGE */}
          <div
            className={`page right-page ${
              isTurning
                ? turnDirection === "next"
                  ? "flip-forward"
                  : "flip-backward"
                : ""
            }`}
          >
            {rightProduct ? (
              <div className="page-content text-gray-800">
                <h2>{rightProduct.name}</h2>

                <img
                  src={getCloudinaryUrl(rightProduct.cms_image_ids[0])}
                  alt={rightProduct.name}
                  className="product-image"
                />

                <p className="price text-gray-800">₹{rightProduct.price}</p>
              </div>
            ) : (
              <div className="empty-page text-gray-800" />
            )}
          </div>

          {/* FLIPPING PAGE */}
          {isTurning && (
            <div className={`page flipping-page ${turnDirection}`}>
              <div className="page-content front">
                <h2>
                  {turnDirection === "next"
                    ? rightProduct?.name
                    : leftProduct?.name}
                </h2>
              </div>
              <div className="page-content back">
                <h2>Next</h2>
              </div>
            </div>
          )}
        </div>

        <button
          className="nav-btn next"
          onClick={goNext}
          disabled={currentSpread >= maxSpread || isTurning}
        >
          ▶
        </button>
      </div>

      {/* ================= CSS ================= */}
      <style jsx>{`
        .book-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          min-height: 100vh;
          background: #f4f4f5;
          perspective: 2000px;
        }

        .nav-btn {
          font-size: 28px;
          padding: 10px 16px;
          border: none;
          background: #111;
          color: #fff;
          cursor: pointer;
          border-radius: 6px;
        }

        .nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .book {
          position: relative;
          width: 700px;
          height: 420px;
          display: flex;
          transform-style: preserve-3d;
        }

        .page {
          width: 50%;
          height: 100%;
          background: #fff;
          border: 1px solid #ddd;
          overflow: hidden;
          backface-visibility: hidden;
        }

        .left-page {
          border-right: none;
        }

        .right-page {
          border-left: none;
          transform-origin: left center;
        }

        .page-content {
          padding: 24px;
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 6px;
          margin: 12px 0;
        }

        .price {
          font-weight: bold;
        }

        .empty-page {
          width: 100%;
          height: 100%;
          background: #eee;
        }

        .book.turning {
          pointer-events: none;
        }

        .right-page.flip-forward {
          animation: flipForward 0.9s ease-in-out forwards;
        }

        .right-page.flip-backward {
          animation: flipBackward 0.9s ease-in-out forwards;
        }

        .flipping-page {
          position: absolute;
          width: 50%;
          height: 100%;
          right: 0;
          top: 0;
          transform-style: preserve-3d;
          transform-origin: left center;
          z-index: 10;
          background: white;
        }

        .flipping-page.next {
          animation: flipForward 0.9s ease-in-out forwards;
        }

        .flipping-page.prev {
          animation: flipBackward 0.9s ease-in-out forwards;
        }

        .flipping-page .front,
        .flipping-page .back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
        }

        .flipping-page .back {
          transform: rotateY(180deg);
        }

        @keyframes flipForward {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(-180deg);
          }
        }

        @keyframes flipBackward {
          0% {
            transform: rotateY(-180deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }
      `}</style>
    </>
  );
}
