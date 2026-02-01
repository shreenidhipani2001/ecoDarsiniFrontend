'use client';

import { useState, useEffect } from 'react';

interface WhatsAppChatProps {
  phoneNumber: string; // e.g. "+919876543210"
  message?: string;    // default message
}

export default function WhatsAppChat({ phoneNumber, message }: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    message || 'Hello! I need support.'
  )}`;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50"
        title="Chat with us on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M20.52 3.48a11.86 11.86 0 00-16.77 0 11.86 11.86 0 00-1.81 15.2L2 22l3.48-1.14a11.86 11.86 0 0015.04-17.38zM12 21a9 9 0 01-4.72-1.35l-.34-.21-2.58.84.86-2.52-.22-.34A9 9 0 1112 21zm5.48-7.52c-.27-.13-1.59-.78-1.84-.87-.25-.09-.43-.13-.62.13-.18.27-.7.87-.85 1.05-.16.18-.31.2-.58.07-.27-.13-1.14-.42-2.17-1.33-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.47.13-.16.17-.27.27-.45.09-.18.05-.34-.03-.47-.09-.13-.62-1.5-.85-2.05-.22-.54-.45-.46-.62-.47l-.53-.01c-.18 0-.47.07-.72.34s-.95.93-.95 2.27.98 2.63 1.12 2.81c.13.18 1.94 2.95 4.7 4.13.66.28 1.17.45 1.57.58.66.22 1.26.19 1.73.12.53-.08 1.59-.65 1.81-1.28.22-.63.22-1.17.16-1.28-.05-.11-.22-.18-.48-.31z" />
        </svg>
      </button>

      {/* Optional Tooltip / Chat Link */}
      {isOpen && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          Chat with us on WhatsApp
        </a>
      )}
    </>
  );
}
