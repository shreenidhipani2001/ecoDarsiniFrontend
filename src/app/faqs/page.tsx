'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import HomeHeader from '../../components/HomeHeader';
import HomeFooter from '../../components/HomeFooter';

const faqItems = [
  {
    question: 'What is Odisha E Store?',
    answer:
      'Odisha E Store is an online marketplace that promotes handcrafted and culturally inspired products from artisans across Odisha, including jewellery, handlooms, books, and eco-friendly accessories.',
    defaultOpen: true,
  },
  {
    question: 'Are the jewellery products handmade?',
    answer:
      'Yes, most jewellery items such as bamboo necklaces and artisan accessories are handmade or hand-finished using natural and traditional materials by local craftsmen.',
    defaultOpen: false,
  },
  {
    question: 'What materials are used in bamboo necklaces?',
    answer:
      'Bamboo necklaces usually combine natural bamboo with metal beads, thread, or oxidised silver-tone elements. The exact materials are listed on each product page.',
    defaultOpen: false,
  },
  {
    question: 'Is Odisha E Store a trusted website?',
    answer:
      'It operates as a regional e-commerce platform with multiple artisan sellers. As with any online store, customers should review product descriptions, seller ratings, and policies before purchasing.',
    defaultOpen: false,
  },
  {
    question: 'How should I care for bamboo or natural jewellery?',
    answer:
      'Keep the jewellery away from moisture, perfumes, and direct sunlight. Store it in a dry box or pouch to maintain durability and appearance over time.',
    defaultOpen: false,
  },
];

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />
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

      {/* FAQ Section with vertical border lines */}
      <section className="py-16">
        <div className="flex justify-center">
          {/* Left gap with vertical line */}
          <div className="hidden md:flex w-[10%] justify-end pr-6">
            <div className="w-px bg-gray-300 h-full" />
          </div>

          {/* Center FAQ content - 60% */}
          <div className="w-full md:w-[60%] px-4 md:px-0">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">
              Frequently Asked Questions
            </h1>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  open={item.defaultOpen}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition">
                    <span>{item.question}</span>
                    <span className="transition group-open:rotate-180 ml-4 flex-shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-1 text-gray-700 border-t leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Right gap with vertical line */}
          <div className="hidden md:flex w-[10%] justify-start pl-6">
            <div className="w-px bg-gray-300 h-full" />
          </div>
        </div>
      </section>
      <HomeFooter />
    </div>
  );
}
