export default function Contact() {

    const subscribe_newsletter = () => {
        // your logic here
        console.log("Subscribed");
      };
    return(
        <>
         
        <script src="https://cdn.tailwindcss.com"></script>
  
         
        <title>eMarket - Modern Multipurpose Store</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
  
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
           
          {/* <header className="bg-white shadow-sm sticky top-0 z-50">
             
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm py-2">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center">
                <div className="hidden md:block">
                  Welcome to eMarket! New offers every weekend – Code: <strong>HAPPY2026</strong>
                </div>
                <div className="flex items-center gap-6">
                  <select className="bg-transparent border-none text-white focus:outline-none cursor-pointer">
                    <option>$ USD</option>
                    <option>€ EUR</option>
                    <option>£ GBP</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <img src="https://flagcdn.com/16x12/gb.png" alt="EN" className="inline" onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = '/tribal-art-statues-stockcake.webp'; }} />
                    <select className="bg-transparent border-none text-white focus:outline-none cursor-pointer">
                      <option>English</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
  
             
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                
                <a href="/" className="flex-shrink-0">
                  <img src="image/catalog/logo.png" alt="eMarket" className="h-10 w-auto" onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = '/tribal-art-statues-stockcake.webp'; }} />
                </a>
  
                
                <div className="flex-1 min-w-[300px] max-w-xl mx-8">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products, brands and more..."
                      className="w-full pl-5 pr-12 py-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
  
                
                <div className="flex items-center gap-6">
                  <button className="text-gray-700 hover:text-indigo-600 transition flex items-center gap-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="hidden sm:inline">Wishlist (0)</span>
                  </button>
  
                  <button className="text-gray-700 hover:text-indigo-600 transition flex items-center gap-1 relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="hidden sm:inline">Cart</span>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                  </button>
  
                  <button className="hidden md:flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Account</span>
                  </button>
                </div>
              </div>
            </div>
  
            
            <nav className="bg-gray-900 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-12">
                  <div className="hidden lg:flex gap-8 text-sm font-medium">
                    <a href="#" className="hover:text-indigo-400 transition">Home</a>
                    <div className="relative group">
                      <button className="flex items-center gap-1 hover:text-indigo-400 transition">
                        Categories <span className="text-xs">▼</span>
                      </button>
                      
                      <div className="absolute hidden group-hover:block w-[800px] left-0 top-full bg-white text-gray-900 shadow-xl rounded-b-lg p-6 grid grid-cols-4 gap-6">
                        <div>
                          <h4 className="font-bold mb-3 text-indigo-600">Fashion</h4>
                          <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-indigo-600">Women</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Men</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Kids</a></li>
                          </ul>
                        </div>
                        
                      </div>
                    </div>
                    <a href="#" className="hover:text-indigo-400 transition">Blog</a>
                    <a href="#" className="hover:text-indigo-400 transition">Contact</a>
                  </div>
                   
                  <button className="lg:hidden text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </nav>
          </header> */}
  
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* <nav className="text-sm text-gray-500 mb-8">
              <ol className="flex items-center gap-2">
                <li><a href="#" className="hover:text-indigo-600">Home</a></li>
                <li>/</li>
                <li><a href="#" className="hover:text-indigo-600">Page</a></li>
                <li>/</li>
                <li className="text-gray-900 font-medium">Contact Us</li>
              </ol>
            </nav> */}
  
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Get in Touch</h1>
  
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg mb-12">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.8442639328655!2d-71.10008329902021!3d42.34584359264178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e379f63dc43ccb%3A0xa15d5aa87d0f0c12!2s4+Yawkey+Way%2C+Boston%2C+MA+02215!5e0!3m2!1sen!2s!4v1475081210943"
                width="100%"
                height="420"
                style={{ border: 0 }}
                 loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
  
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Contact Info */}
              <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Store</h2>
                <div className="space-y-6 text-gray-700">
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Address</p>
                      <p>42 avenue des Champs-Élysées, 75000 Paris, France</p>
                    </div>
                  </div>
  
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p>+33 1 23 45 67 89</p>
                    </div>
                  </div>
  
                  <p className="text-gray-600 leading-relaxed">
                    We're here to help! Drop us a message and we'll get back to you within 24 hours during business days.
                  </p>
                </div>
              </div>
  
              {/* Contact Form - Attractive & Modern */}
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      />
                    </div>
                  </div>
  
                  <div>
                    <label htmlFor="enquiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      id="enquiry"
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    ></textarea>
                  </div>
  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition transform hover:-translate-y-0.5"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
  
          {/* Footer Newsletter - Attractive & Modern */}
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
                  onClick={subscribe_newsletter}
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
  
          {/* Footer - Simplified & Modern */}
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
                <div className="flex gap-4">
                  <a href="#" className="hover:text-white transition text-2xl">FB</a>
                  <a href="#" className="hover:text-white transition text-2xl">TW</a>
                  <a href="#" className="hover:text-white transition text-2xl">IG</a>
                </div>
              </div>
            </div>
  
            <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
              © {new Date().getFullYear()} eMarket. Designed with ❤️
            </div>
          </footer> */}
        </div>
      </>

    )
}