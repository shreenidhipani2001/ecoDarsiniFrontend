// "use client";

// import { useState } from "react";

// const products = [
//   {
//     id: 1,
//     name: "Handmade Vase",
//     image: "/placeholder.png",
//     description: "Beautiful handcrafted vase",
//   },
//   {
//     id: 2,
//     name: "Wall Art",
//     image: "/placeholder.png",
//     description: "Eco-friendly wall art",
//   },
// ];

// export default function ProductsCatalogue() {
//   const [index, setIndex] = useState(0);
//   const product = products[index];

//   return (
//     <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
//       <img
//         src={product.image}
//         className="w-full h-60 object-cover rounded"
//       />
//       <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
//       <p className="text-zinc-600 mt-2">{product.description}</p>

//       <div className="flex justify-between mt-6">
//         <button
//           disabled={index === 0}
//           onClick={() => setIndex(index - 1)}
//           className="px-4 py-2 bg-black text-white rounded disabled:opacity-40"
//         >
//           Prev
//         </button>
//         <button
//           disabled={index === products.length - 1}
//           onClick={() => setIndex(index + 1)}
//           className="px-4 py-2 bg-black text-white rounded disabled:opacity-40"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";

export default function BookFlip() {
  const totalPages = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState("next");

  const nextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setDirection("next");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((p) => p + 1);
        setIsFlipping(false);
      }, 800);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setDirection("prev");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((p) => p - 1);
        setIsFlipping(false);
      }, 800);
    }
  };

  return (
    <>
      <div className="book-wrapper">
        <button onClick={prevPage} disabled={currentPage === 0}>
          ◀ Prev
        </button>

        <div className="scene">
          <div
            className={`page ${
              isFlipping ? (direction === "next" ? "flip-next" : "flip-prev") : ""
            }`}
          >
            <div className="page-front">
              Page {currentPage + 1}
            </div>
            <div className="page-back">
              Page {direction === "next" ? currentPage + 2 : currentPage}
            </div>
          </div>
        </div>

        <button onClick={nextPage} disabled={currentPage === totalPages - 1}>
          Next ▶
        </button>
      </div>

      {/* CSS */}
      <style jsx>{`
        .book-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 50px;
        }

        .scene {
          width: 400px;
          height: 550px;
          perspective: 1500px;
        }

        .page {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s ease-in-out;
        }

        .page-front,
        .page-back {
          position: absolute;
          width: 100%;
          height: 100%;
          background: white;
          border: 1px solid #ccc;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
        }

        .page-back {
          transform: rotateY(180deg);
          background: #f5f5f5;
        }

        .flip-next {
          transform: rotateY(-180deg);
        }

        .flip-prev {
          transform: rotateY(180deg);
        }

        button {
          padding: 10px 16px;
          font-size: 1rem;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
