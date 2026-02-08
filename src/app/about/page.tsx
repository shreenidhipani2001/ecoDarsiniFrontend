'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import HomeHeader from '../../components/HomeHeader';
import HomeFooter from '../../components/HomeFooter';

const fullText = `Odisha E Store is the online commerce platform, fully owned by M/S Odisha E Store Private Limited for various products sourced from skilled artisans, writers, craftsmen, handloom weavers, book publishers from different parts of Odisha. It is a unique B2C model of online marketplace where manufacturers, producers or sellers can sell their products by displaying their catalogue in the online store. All our products have the fragrance, touch & feel of Odisha's rich culture and heritage.

Odisha E Store came into existence in the year 2013 under the umbrella of Just Odisha and is the fastest growing name in the field of Cultural & Ethnic products for online sale in Odisha. Just Odisha has enhanced the sale of Odia products online, specially Books, Handicrafts & Handloom. Later in 2022, looking at the scope and growth of the business, a separate private limited company was formed named Odisha E Store Private Limited. The company has started diversifying in to each and every products or services of Odisha.

The platform serves as a bridge between Odisha's talented artisans and the global market, ensuring that traditional craftsmanship gets the recognition and reach it deserves. From exquisite handloom sarees to intricately crafted bamboo jewellery, from rare Odia literature to unique handicraft pieces, Odisha E Store brings the best of Odisha to your doorstep. Our commitment to quality ensures that every product listed on our platform meets the highest standards of authenticity and craftsmanship. We work directly with artisans and weavers, eliminating middlemen to provide fair prices for both creators and customers. Our vision extends beyond commerce — we aim to preserve and promote the rich cultural heritage of Odisha while empowering the artisan community economically. By providing a digital platform, we help traditional craftspeople adapt to the modern marketplace without compromising their art. Each purchase on Odisha E Store is not just a transaction, but a contribution to sustaining centuries-old traditions and supporting the livelihoods of thousands of skilled artisans across the state.`;

export default function AboutPage() {
  const [expanded, setExpanded] = useState(false);

  // Split into words and take first 300 for preview
  const words = fullText.split(/\s+/);
  const previewText = words.slice(0, 60).join(' ') + '...';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      {/* <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div> */}
      <HomeHeader hideSearch={true}/>

      {/* About Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">About Us</h1>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left - Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/certificateofrecognition.jpg"
              alt="About Odisha E Store"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Right - Text with Read More */}
          <div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="whitespace-pre-line">
                {expanded ? fullText : previewText}
              </p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-4 px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              {expanded ? 'Show Less' : 'Read More'}
            </button>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Vision */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Vision</h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                Provide the art, craft and literature of Odisha a Global stage, by linking the creative artisans, Local Weavers, innovative writers and the original products of Odisha to the world, through our ecommerce platform.
              </p>
            </div>

            {/* Mission */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Mission</h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                Create a market for Odisha&apos;s rich heritage of art, craft and literature and to provide the best value for money to our customers, additionally provide our customers a delight in online shopping with just a click of a button.
              </p>
            </div>

            {/* Goals */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Goals</h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                We at Odisha E Store have decided to bring about a positive change in the lives of at least 1,00,000 artisans, weavers and writers put together by December 2025, by ensuring their products reach every corner of the world, and their product is appreciated and purchased.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
