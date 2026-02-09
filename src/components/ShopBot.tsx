'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import ShopBotIcon from './ShopBotIcon';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  action?: any;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
}

export default function ShopBot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! 👋 What are you looking to buy today?' }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simple bot response logic
  const handleUserMessage = async (text: string) => {
    const userMessage: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);

    // Simple intent parsing
    let botMessage: Message = { sender: 'bot', text: "Sorry, I didn't get that." };

    // Check for "buy" or product queries
    if (/buy|looking|search|want/i.test(text)) {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(text)}`);
        const data = await res.json();
        const products: Product[] = data.products || [];

        if (products.length === 0) {
          botMessage = { sender: 'bot', text: "I couldn't find any products matching that." };
        } else {
          botMessage = {
            sender: 'bot',
            text: `I found ${products.length} product(s):\n` + 
                  products.map((p) => `${p.name} - ₹${p.price}`).join('\n') +
                  `\nYou can click any product in our catalog to buy.`
          };
        }
      } catch (err) {
        botMessage = { sender: 'bot', text: 'Oops, failed to fetch products.' };
      }
    } else if (/contact|support|help/i.test(text)) {
      botMessage = {
        sender: 'bot',
        text: 'You can reach us at WhatsApp: +91 9876543210 or email support@example.com'
      };
    } else if (/hello|hi|hey/i.test(text)) {
      botMessage = { sender: 'bot', text: 'Hi there! What are you looking to buy today?' };
    }

    setMessages((prev) => [...prev, botMessage]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleUserMessage(input.trim());
    setInput('');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-white hover:bg-gray-50 rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50"
        title="Chat with ShopBot"
      >
        <ShopBotIcon className="h-10 w-10" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-[400px] bg-white shadow-xl rounded-lg flex flex-col z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg font-bold">ShopBot </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg ${msg.sender === 'bot' ? 'bg-gray-100 text-gray-900' : 'bg-green-100 text-green-900 self-end'}`}
              >
                {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            ))}
            <div ref={scrollRef}></div>
          </div>

          <form onSubmit={handleSend} className="flex border-t border-gray-200">
          <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-black placeholder-gray-500 focus:outline-none"
                    placeholder="Type a message..."
                    />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-lg"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
