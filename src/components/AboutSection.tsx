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
           
           
       
  
          {/* ======================== MAIN ABOUT CONTENT ======================== */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left – Image + Text */}
              <div className="space-y-8">
                <h1 className="text-4xl md:text-4xl mt-10 font-bold text-gray-900 tracking-tight">
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
                  Odisha E Store is the online commerce platform, fully owned by M/S Odisha E Store Private Limited for various products sourced from skilled artisans, writers, craftsmen, handloom weavers, book publishers from different parts of Odisha. It is a unique B2C model of online marketplace where manufacturers, producers or sellers can sell their products by displaying their catalogue in the online store. All our-products have the fragrance, touch & feel of Odisha's rich culture and heritage.

Odisha E Store came into existence in the year 2013 under the umbrella of Just Odisha and is the fastest growing name in the field of Cultural & Ethnic products for online sale in Odisha. Just Odisha has enhanced the sale of Odia products online, specially Books, Handicrafts & Handloom. Later in 2022, looking at the scope and growth of the business, a separate private limited company was formed named Odisha E Store Private Limited. The company has started diversifying in to each and every products or servicesof Odisha.                  </p>
                 
                </div>
              </div>
  
              {/* Right – FAQ Accordion */}
              <div className="space-y-8">
                <h2 className="text-4xl mt-10 font-bold text-gray-900">FAQs</h2>
  
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
                <div className="border border-gray-200 rounded-xl p-6 bg-slate-100 shadow-sm">
                  <h1 className="text-blue-500 font-bold text-3xl mt-10">
                    Vision
                  </h1>               
             <p className="mt-4 text-gray-700 leading-relaxed bg-white-100 p-4 rounded-lg font-bold">  
                  Provide the art, craft and literature of Odisha a Global stage, by linking the creative artisans, Local Weavers, innovative writers and the original products of Odisha to the world, through our ecommerce platform. 

                  Mission - Create a market for Odisha's rich heritage of art, craft and literature and  to provide the best value for money to our customers, additionally provide our customers a delight in online shopping with just a click of a button, 

                  Goals - We at Odisha E store have decided to bring about a positive change in the lives of at least 1,00,000 artisans , weavers and writers put together by December 2025, by ensuring their products reach every corner of the world, and their product is appreciated and purchased.

                  </p>
                </div>
              </div>
            </div>
          </div>
  
        
        </div>
      </>
    );
  }