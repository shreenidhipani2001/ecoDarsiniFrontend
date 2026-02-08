'use client';

import { useState } from 'react';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

export default function HomeFooter() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold text-white">EcoDarshini</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted destination for eco-friendly and sustainable products.
              Together, we make a difference for our planet.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Our Products
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a href="/ecatalogue" className="text-sm hover:text-green-400 transition-colors">
                  Ecatalogue
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  123 Green Street, Eco City,
                  <br />
                  India - 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">hello@ecodarshini.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white">Signup for Newsletter</h3>
              <p className="text-sm text-gray-400 mt-1">
                We&apos;ll never share your email address with a third-party.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) {
                  setEmail('');
                }
              }}
              className="flex w-full md:w-auto"
            >
              <input
                type="email"
                placeholder="Your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 md:w-80 px-4 py-3 rounded-l-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-r-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} EcoDarshini. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-green-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-green-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-green-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
