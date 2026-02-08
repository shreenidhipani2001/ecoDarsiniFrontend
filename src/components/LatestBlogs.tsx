// 'use client';

// import { useRouter } from 'next/navigation';
// import { useRef } from 'react';

// type BlogImage = {
//   id: string;
//   url: string;
//   thumbnail: string | null;
//   card: string | null;
//   full: string | null;
//   alt: string;
// };

// type Blog = {
//   id: string;
//   name: string;
//   description: string;
//   image: string | null;
//   images?: BlogImage[];
//   created_at: string;
//   added_by_name?: string;
// };

// type Props = {
//   blogs: Blog[];
// };

// const getBlogImageUrl = (blog: Blog): string => {
//   if (blog.images && blog.images.length > 0) {
//     return blog.images[0].card || blog.images[0].url || '';
//   }
//   return blog.image || '/placeholder.png';
// };

// const formatDate = (dateString: string) => {
//   const d = new Date(dateString);
//   return d.toLocaleDateString('en-US', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   });
// };

// export default function LatestBlogs({ blogs }: Props) {
//   const router = useRouter();
//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   if (!blogs || blogs.length === 0) return null;

//   /* ---------- Scroll Controls ---------- */
//   const scrollToStart = () => {
//     scrollRef.current?.scrollTo({
//       left: 0,
//       behavior: 'smooth',
//     });
//   };

//   const scrollToEnd = () => {
//     if (!scrollRef.current) return;
//     scrollRef.current.scrollTo({
//       left: scrollRef.current.scrollWidth,
//       behavior: 'smooth',
//     });
//   };

//   return (
//     <section className="w-full bg-gray-100 py-12">
//       <div className="max-w-7xl mx-auto px-4">

//         {/* ---------- Header ---------- */}
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-bold tracking-wide text-gray-900">
//             OUR LATEST BLOGS
//           </h2>

//           {/* Scroll Dots */}
//           <div className="flex gap-3">
//             <button
//               onClick={scrollToStart}
//               className="w-3 h-3 bg-gray-400 hover:bg-gray-600 rounded-full transition"
//               aria-label="Scroll to start"
//             />
//             <button
//               onClick={scrollToEnd}
//               className="w-3 h-3 bg-orange-500 hover:bg-orange-600 rounded-full transition"
//               aria-label="Scroll to end"
//             />
//           </div>
//         </div>

//         {/* ---------- Scroll Row ---------- */}
//         <div
//           ref={scrollRef}
//           className="overflow-x-auto scrollbar-hide"
//         >
//           <div className="flex gap-6 w-max pb-2">
//             {blogs.slice(0, 10).map((blog) => (
//               <article
//                 key={blog.id}
//                 onClick={() => router.push(`/blog/${blog.id}`)}
//                 className="
//                   min-w-[260px] sm:min-w-[300px] lg:min-w-[320px]
//                   bg-white rounded-xl shadow-sm
//                   hover:shadow-xl hover:-translate-y-1
//                   transition-all duration-300
//                   cursor-pointer group
//                 "
//               >
//                 {/* Image */}
//                 <div className="w-full h-48 overflow-hidden rounded-t-xl bg-gray-200">
//                   <img
//                     src={getBlogImageUrl(blog)}
//                     alt={blog.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="p-4">
//                   <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition">
//                     {blog.name}
//                   </h3>

//                   <div className="text-xs text-gray-500 mt-2 flex items-center gap-3">
//                     <span>📅 {formatDate(blog.created_at)}</span>
//                     <span>💬 0 Comment</span>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>

//       </div>

//       {/* Hide scrollbar */}
//       <style jsx>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </section>
//   );
// }



import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

type BlogImage = {
  id: string;
  url: string;
  thumbnail: string | null;
  card: string | null;
  full: string | null;
  alt: string;
};

type Blog = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  images?: BlogImage[];
  created_at: string;
  added_by_name?: string;
};

type Props = {
  blogs: Blog[];
  loading?: boolean;
};

const getBlogImageUrl = (blog: Blog): string => {
  if (blog.images && blog.images.length > 0) {
    return blog.images[0].card || blog.images[0].url || '';
  }
  return blog.image || '/placeholder.png';
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function LatestBlogs({ blogs,loading }: Props,) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ✅ Track scroll state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!blogs || blogs.length === 0) return null;

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scrollByAmount = (amount: number) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: amount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    handleScroll(); // initialize button state
  }, []);

  if(loading){
    return (
    <section className="w-full bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">Loading</div>
        </section>
    );
  }
  return (
    <section className="w-full bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* ---------- Header ---------- */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-wide text-gray-900">
            OUR LATEST BLOGS
          </h2>

          {/* Scroll Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => scrollByAmount(-300)}
              className={`w-6 h-6 rounded-full transition ${
                canScrollLeft ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
              disabled={!canScrollLeft}
            />
            <button
              onClick={() => scrollByAmount(300)}
              className={`w-6 h-6 rounded-full transition ${
                canScrollRight ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
              disabled={!canScrollRight}
            />
          </div>
        </div>

        {/* ---------- Scroll Row ---------- */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide"
          onScroll={handleScroll} // ✅ track scroll
        >
          <div className="flex gap-6 w-max pb-2">
            {blogs.slice(0, 10).map((blog) => (
              <article
                key={blog.id}
                onClick={() => router.push(`/blog/${blog.id}`)}
                className="
                  min-w-[260px] sm:min-w-[300px] lg:min-w-[320px]
                  bg-white rounded-xl shadow-sm
                  hover:shadow-xl hover:-translate-y-1
                  transition-all duration-300
                  cursor-pointer group
                "
              >
                {/* Image */}
                <div className="w-full h-48 overflow-hidden rounded-t-xl bg-gray-200">
                  <img
                    src={getBlogImageUrl(blog)}
                    alt={blog.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition">
                    {blog.name}
                  </h3>

                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-3">
                    <span>📅 {formatDate(blog.created_at)}</span>
                    <span>💬 0 Comment</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
