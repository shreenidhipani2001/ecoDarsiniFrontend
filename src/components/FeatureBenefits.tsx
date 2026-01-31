'use client';

import { Headphones, ShieldCheck, Truck, Gift } from 'lucide-react';

const benefits = [
  {
    icon: Headphones,
    title: '24 X 7 Free Support',
    description: 'Online Support 24/7',
  },
  {
    icon: ShieldCheck,
    title: 'Money Back Guarantee',
    description: '100% Secure Payment',
  },
  {
    icon: Truck,
    title: 'Free Nationwide Shipping',
    description: 'On Orders Over ₹499',
  },
  {
    icon: Gift,
    title: 'Special Gift Cards',
    description: 'Give The Perfect Gift',
  },
];

export default function FeatureBenefits() {
  return (
    <section className="bg-white py-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <benefit.icon className="h-6 w-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                  {benefit.title}
                </h3>
                <p className="text-xs lg:text-sm text-gray-500 truncate">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
