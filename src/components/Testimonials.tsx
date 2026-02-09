// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";

// type ImageType = {
//   id: string;
//   url: string;
//   thumbnail: string;
//   card: string;
//   full: string;
//   alt?: string;
// };

// type Testimonial = {
//   id: string;
//   customer_name: string;
//   customer_role?: string;
//   company_name?: string;
//   testimonial_text: string;
//   short_highlight?: string;
//   rating?: number;
//   location?: string;
//   created_at: string;
//   images?: ImageType[]; // IMPORTANT
// };

// export default function Testimonials() {
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [loading, setLoading] = useState(true);
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//   useEffect(() => {
//     const fetchTestimonials = async () => {
//       try {
//         const res = await fetch(`${apiUrl}/api/testimonials`);
//         const data = await res.json();
//         setTestimonials(data);
//       } catch (err) {
//         console.error("Failed to fetch testimonials", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTestimonials();
//   }, [apiUrl]);

//   if (loading) return <p className="text-center py-10">Loading...</p>;

//   return (
    
//     <section className="w-full py-12 px-2">
//   <h2 className="text-3xl text-black font-bold text-center mb-10">
//     What Our Customers Say
//   </h2>

//   {/* Scroll Container */}
//   <div
//     className="flex overflow-x-auto overflow-y-hidden gap-2"
//     style={{ scrollbarWidth: 'none' }}
//   >
//     {testimonials.map((t) => (
//       <div
//         key={t.id}
//         className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition
//                    flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] m-[3px]"
//       >
//         {/* Avatar */}
//         {t.images?.[0] && (
//           <div className="w-16 h-16 relative mb-4">
//             <Image
//               src={t.images[0].thumbnail || t.images[0].url}
//               alt={t.customer_name}
//               fill
//               className="rounded-full object-cover"
//             />
//           </div>
//         )}

//         {/* Name + Role */}
//         <h3 className="text-lg text-black font-semibold">
//           {t.customer_name}
//         </h3>

//         <p className="text-sm text-black">
//           {t.customer_role}
//           {t.company_name && ` • ${t.company_name}`}
//         </p>

//         {/* Rating */}
//         {t.rating && (
//           <div className="flex mt-2 text-black mb-3">
//             {Array.from({ length: t.rating }).map((_, i) => (
//               <span key={i}>⭐</span>
//             ))}
//           </div>
//         )}

//         {/* Text */}
//         <p className="text-black text-sm mt-3 line-clamp-4">
//           {t.testimonial_text}
//         </p>

//         {/* Gallery */}
//         {t.images && t.images.length > 1 && (
//           <div className="flex gap-2 mt-4">
//             {t.images.slice(0, 3).map((img) => (
//               <div key={img.id} className="w-14 h-14 relative">
//                 <Image
//                   src={img.card || img.url}
//                   alt="testimonial"
//                   fill
//                   className="rounded-lg object-cover"
//                 />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Location */}
//         {t.location && (
//           <p className="text-xs text-gray-500 mt-3">{t.location}</p>
//         )}
//       </div>
//     ))}
//   </div>
//     </section>

//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageType = {
  id: string;
  url: string;
  thumbnail: string;
  card: string;
  full: string;
  alt?: string;
};

type Testimonial = {
  id: string;
  customer_name: string;
  customer_role?: string;
  company_name?: string;
  testimonial_text: string;
  short_highlight?: string;
  rating?: number;
  location?: string;
  created_at: string;
  images?: ImageType[]; // IMPORTANT
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const amount = 320; // card width + gap
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };


  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/testimonials`);
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [apiUrl]);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 xl:px-12 relative">
      <h2 className="text-3xl text-black font-bold text-center mb-10">
        What Our Customers Say
      </h2>

      {/* LEFT ARROW */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                   bg-green-200 shadow-md rounded-full p-2 hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5 text-black font-bold" />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                   bg-green-200 shadow-md rounded-full p-2 hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5 text-black font-bold" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto overflow-y-hidden gap-2 px-8"
        style={{ scrollbarWidth: 'none' }}
      >
        {testimonials.map((t: any) => (
          <div
            key={t.id}
            className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition
                       flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] m-[3px]"
          >
            {/* Avatar */}
            {t.images?.[0] && (
              <div className="w-16 h-16 relative mb-4">
                <Image
                  src={t.images[0].thumbnail || t.images[0].url}
                  alt={t.customer_name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}

            <h3 className="text-lg text-black font-semibold">
              {t.customer_name}
            </h3>

            <p className="text-sm text-black">
              {t.customer_role}
              {t.company_name && ` • ${t.company_name}`}
            </p>

            {t.rating && (
              <div className="flex mt-2 text-black mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            )}

            <p className="text-black text-sm mt-3 line-clamp-4">
              {t.testimonial_text}
            </p>

            {t.location && (
              <p className="text-xs text-gray-500 mt-3">{t.location}</p>
            )}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
