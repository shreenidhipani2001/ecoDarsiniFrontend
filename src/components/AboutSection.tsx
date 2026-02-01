import Image from "next/image";
 export default function AboutSection() {
    const subscribeNewsletter = () => {
      console.log("Subscribed!");
      // your logic here (e.g. API call, toast notification, etc.)
    };
  
    return (
      <>
        {/* Tailwind CDN — for quick preview / prototyping only.
             In real project → install tailwind via npm & configure properly */}
        <script src="https://cdn.tailwindcss.com"></script>
  
        <title>eMarket - Multipurpose Responsive HTML5 Template</title>
        <meta charSet="utf-8" />
        <meta
          name="keywords"
          content="html5 template, best html5 template, best html template, html5 basic template, multipurpose html5 template, multipurpose html template, creative html templates, creative html5 templates"
        />
        <meta
          name="description"
          content="eMarket is a powerful Multi-purpose HTML5 Template with clean and user friendly design. It is definite a great starter for any eCommerce web project."
        />
        <meta name="author" content="Magentech" />
        <meta name="robots" content="index, follow" />
  
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
  
        <div className="min-h-screen bg-gray-50 font-sans">
          {/* Header – modernized but kept most of the original structure */}
          {/* <header className="bg-white shadow-sm sticky top-0 z-50">
             
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-sm py-2.5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4">
                <div className="hidden md:block">
                  <strong>Welcome to eMarket!</strong> New offers & gifts every weekend – Code:{" "}
                  <strong>HAPPY2026</strong>
                </div>
  
                <div className="flex items-center gap-6">
                  <select className="bg-transparent border-none text-white focus:outline-none cursor-pointer">
                    <option>$ USD</option>
                    <option>€ EUR</option>
                    <option>£ GBP</option>
                  </select>
  
                  <div className="flex items-center gap-2">
                    <img
                      src="image/catalog/flags/gb.png"
                      alt="English"
                      className="h-4 w-auto"
                    />
                    <select className="bg-transparent border-none text-white focus:outline-none cursor-pointer">
                      <option>English</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
  
             
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex flex-wrap items-center justify-between gap-6">
                
                <a href="/" className="flex-shrink-0">
                  <img
                    src="image/catalog/logo.png"
                    alt="eMarket"
                    className="h-10 w-auto"
                  />
                </a>
  
             
                <div className="flex-1 min-w-[320px] max-w-2xl">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products, brands and more..."
                      className="w-full pl-5 pr-12 py-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
  
              
                <div className="flex items-center gap-6">
                  <a href="#" className="text-gray-700 hover:text-indigo-600 transition flex items-center gap-1.5">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="hidden sm:inline">Wishlist</span>
                  </a>
  
                  <a href="#" className="text-gray-700 hover:text-indigo-600 transition flex items-center gap-1.5 relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="hidden sm:inline">Cart</span>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">0</span>
                  </a>
  
                  <a href="#" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Account</span>
                  </a>
                </div>
              </div>
            </div>
  
             
            <nav className="bg-gray-900 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-12">
                  <div className="hidden lg:flex gap-8 text-sm font-medium">
                    <a href="#" className="hover:text-indigo-400 transition">Home</a>
                    <a href="#" className="hover:text-indigo-400 transition">Shop</a>
                    <a href="#" className="hover:text-indigo-400 transition">Categories</a>
                    <a href="#" className="hover:text-indigo-400 transition">Blog</a>
                    <a href="#" className="hover:text-indigo-400 transition">About</a>
                    <a href="#" className="hover:text-indigo-400 transition">Contact</a>
                  </div>
                  <button className="lg:hidden ml-auto">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </nav>
          </header>
   */}
          {/* Breadcrumb */}
          {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav className="text-sm text-gray-500">
              <ol className="flex items-center gap-2">
                <li><a href="#" className="hover:text-indigo-600">Home</a></li>
                <li className="text-gray-400">/</li>
                <li><a href="#" className="hover:text-indigo-600">Page</a></li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium">About Us</li>
              </ol>
            </nav>
          </div> */}
  
          {/* ======================== MAIN ABOUT CONTENT ======================== */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left – Image + Text */}
              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                  About Us
                </h1>
  
                <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
  src="/certificateofrecognition.jpg"
  alt="About Us"
  width={600}
  height={400}
  className="w-full h-auto object-cover"
/>
                </div>
  
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="mt-10 text-gray-700 leading-relaxed">
                  Odisha E Store is the online commerce platform, fully owned by M/S Odisha E Store Private Limited for various products sourced from skilled artisans, writers, craftsmen, handloom weavers, book publishers from different parts of Odisha. It is a unique B2C model of online marketplace where manufacturers, producers or sellers can sell their products by displaying their catalogue in the online store. All our products have the fragrance, touch & feel of Odisha's rich culture and heritage.

Odisha E Store came into existence in the year 2013 under the umbrella of Just Odisha and is the fastest growing name in the field of Cultural & Ethnic products for online sale in Odisha. Just Odisha has enhanced the sale of Odia products online, specially Books, Handicrafts & Handloom. Later in 2022, looking at the scope and growth of the business, a separate private limited company was formed named Odisha E Store Private Limited. The company has started diversifying in to each and every products or servicesof Odisha.                  </p>
                 
                </div>
              </div>
  
              {/* Right – FAQ Accordion */}
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-gray-900">FAQs</h2>
  
                <div className="space-y-4">
                {[
    {
      question: "What is Odisha E Store?",
      answer:
        "Odisha E Store is an online marketplace that promotes handcrafted and culturally inspired products from artisans across Odisha, including jewellery, handlooms, books, and eco-friendly accessories.",
      defaultOpen: true
    },
    {
      question: "Are the jewellery products handmade?",
      answer:
        "Yes, most jewellery items such as bamboo necklaces and artisan accessories are handmade or hand-finished using natural and traditional materials by local craftsmen.",
      defaultOpen: false
    },
    {
      question: "What materials are used in bamboo necklaces?",
      answer:
        "Bamboo necklaces usually combine natural bamboo with metal beads, thread, or oxidised silver-tone elements. The exact materials are listed on each product page.",
      defaultOpen: false
    },
    {
      question: "Is Odisha E Store a trusted website?",
      answer:
        "It operates as a regional e-commerce platform with multiple artisan sellers. As with any online store, customers should review product descriptions, seller ratings, and policies before purchasing.",
      defaultOpen: false
    },
    {
      question: "How should I care for bamboo or natural jewellery?",
      answer:
        "Keep the jewellery away from moisture, perfumes, and direct sunlight. Store it in a dry box or pouch to maintain durability and appearance over time.",
      defaultOpen: false
    }]
                  
                  .map((item, index) => (
                    <details
                      key={index}
                      open={item.defaultOpen}
                      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition">
                        <span>{item.question}</span>
                        <span className="transition group-open:rotate-180">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-5 pt-1 text-gray-700 border-t">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
                <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                <h1 className="text-blue-500 font-bold text-3xl">
  Vision
</h1>                <p className="mt-4 text-gray-700 leading-relaxed bg-orange-100 p-4 rounded-lg font-bold">  
                  Provide the art, craft and literature of Odisha a Global stage, by linking the creative artisans, Local Weavers, innovative writers and the original products of Odisha to the world, through our ecommerce platform. 

Mission - Create a market for Odisha's rich heritage of art, craft and literature and  to provide the best value for money to our customers, additionally provide our customers a delight in online shopping with just a click of a button, 

Goals - We at Odisha E store have decided to bring about a positive change in the lives of at least 1,00,000 artisans , weavers and writers put together by December 2025, by ensuring their products reach every corner of the world, and their product is appreciated and purchased.

                  </p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Newsletter – modern gradient style */}
          {/* <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated with eMarket</h2>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals & more!
              </p>
  
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
                  required
                />
                <button
                  type="button"
                  onClick={subscribeNewsletter}
                  className="px-10 py-4 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1"
                >
                  Subscribe Now
                </button>
              </form>
  
              <p className="mt-6 text-sm opacity-80">
                We respect your privacy — unsubscribe anytime.
              </p>
            </div>
          </section> */}
  
          {/* Footer – simplified modern version */}
          {/* <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-10">
              <div>
                <img src="image/catalog/logo-footer.png" alt="eMarket" className="h-10 mb-6" />
                <p className="text-sm leading-relaxed">
                  Premium multipurpose e-commerce template built for speed & performance.
                </p>
              </div>
  
              <div>
                <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition">Returns</a></li>
                </ul>
              </div>
  
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
                </ul>
              </div>
  
              <div>
                <h3 className="text-white font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-5 text-2xl">
                  <a href="#" className="hover:text-white transition">FB</a>
                  <a href="#" className="hover:text-white transition">TW</a>
                  <a href="#" className="hover:text-white transition">IG</a>
                </div>
              </div>
            </div>
  
            <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
              © {new Date().getFullYear()} eMarket. All rights reserved.
            </div>
          </footer> */}
        </div>
      </>
    );
  }