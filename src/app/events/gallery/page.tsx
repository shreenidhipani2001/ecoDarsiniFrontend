'use client';

import { useState, useEffect } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import HomeHeader from '../../../components/HomeHeader';
import HomeFooter from '../../../components/HomeFooter';
import LoginModal from '../../../components/LoginModal';
import RegisterModal from '../../../components/RegisterModal';

interface EventImage {
  url: string;
  card?: string;
  thumbnail?: string;
  full?: string;
}

interface GalleryEvent {
  id: number;
  title: string;
  description?: string;
  display_type: string;
  created_at: string;
  images: EventImage[];
}

export default function GalleryPage() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<'none' | 'login' | 'register'>('none');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/events?display_type=only_image`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch gallery');
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Could not load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [apiUrl]);

  // Flatten all images for lightbox navigation
  const allImages = events.flatMap((event) =>
    event.images.map((img) => ({
      url: img.full || img.card || img.url,
      title: event.title,
    }))
  );

  const openLightbox = (globalIndex: number) => {
    setLightboxIndex(globalIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  let globalImageIndex = 0;

  return (
    <>
      <HomeHeader hideSearch={true} onLoginClick={() => setActiveModal('login')} />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Camera className="h-4 w-4" />
              Event Gallery
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Event Gallery
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Browse through memorable moments from our events, exhibitions, and workshops.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-gray-500 text-lg">No gallery images available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {events.map((event) => {
                const eventImages = event.images || [];
                if (eventImages.length === 0) return null;

                return (
                  <div key={event.id}>
                    {/* Event Title */}
                    {event.title && (
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                        {event.description && (
                          <p className="text-gray-600 mt-1">{event.description}</p>
                        )}
                        <div className="h-1 w-16 bg-green-500 rounded-full mt-3" />
                      </div>
                    )}

                    {/* Masonry-style Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {eventImages.map((img, idx) => {
                        const currentGlobalIndex = globalImageIndex;
                        globalImageIndex++;

                        return (
                          <div
                            key={idx}
                            onClick={() => openLightbox(currentGlobalIndex)}
                            className={`group relative overflow-hidden rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                              idx === 0 && eventImages.length > 2
                                ? 'sm:col-span-2 sm:row-span-2'
                                : ''
                            }`}
                          >
                            <div className={`${idx === 0 && eventImages.length > 2 ? 'aspect-square' : 'aspect-square'}`}>
                              <img
                                src={img.card || img.url}
                                alt={event.title || `Gallery image ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white text-sm font-medium truncate">
                                  {event.title}
                                </p>
                              </div>
                              <div className="absolute top-3 right-3">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                  <ZoomIn className="h-4 w-4 text-gray-700" />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {lightboxOpen && allImages.length > 0 && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-50"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Previous */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-50"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            <div
              className="max-w-[90vw] max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={allImages[lightboxIndex].url}
                alt={allImages[lightboxIndex].title}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                <p className="text-white text-center font-medium">
                  {allImages[lightboxIndex].title}
                </p>
                <p className="text-white/60 text-center text-sm mt-1">
                  {lightboxIndex + 1} / {allImages.length}
                </p>
              </div>
            </div>

            {/* Next */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-50"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        )}
      </main>

      <HomeFooter />

      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={() => setActiveModal('none')}
        onSwitchToRegister={() => setActiveModal('register')}
      />
      <RegisterModal
        isOpen={activeModal === 'register'}
        onClose={() => setActiveModal('none')}
        onSwitchToLogin={() => setActiveModal('login')}
      />
    </>
  );
}
