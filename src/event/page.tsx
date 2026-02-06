// app/events/page.tsx   (or app/live/page.tsx, etc.)

'use client';

import { useState, useEffect } from 'react';
import { Play, Calendar, Video, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EventsPage() {
  const [videos, setVideos] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === Replace with your real YouTube Channel ID ===
  const CHANNEL_ID = 'UCxxxxxxxxxxxxxxxxxxxxxx'; // ← MUST CHANGE THIS

  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const PROXY_URL = 'https://api.allorigins.win/raw?url='; // public CORS proxy (for dev)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(PROXY_URL + encodeURIComponent(RSS_URL));

        if (!response.ok) throw new Error('Failed to fetch YouTube RSS');

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const entries = xmlDoc.querySelectorAll('entry');
        const videoList: { id: string; title: string }[] = [];

        entries.forEach((entry, index) => {
          if (index >= 6) return; // limit to 6 latest
          const title = entry.querySelector('title')?.textContent || 'Untitled Video';
          const ytIdTag = entry.querySelector('id')?.textContent;
          const id = ytIdTag ? ytIdTag.split(':').pop() : null;

          if (id) {
            videoList.push({ id, title });
          }
        });

        setVideos(videoList);
      } catch (err: any) {
        console.error('Error fetching videos:', err);
        setError('Could not load latest videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (CHANNEL_ID !== 'UCxxxxxxxxxxxxxxxxxxxxxx') {
      fetchVideos();
    } else {
      setError('YouTube Channel ID is not configured yet.');
      setLoading(false);
    }
  }, []);

  // Replace these with your real event photos if you have them
  const galleryImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1505373877291-903190aaa9a5?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1542744173-8e7f37783b3b?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1516321310764-9f3c9619d7d7?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1523580497863-6b7c51582413?auto=format&fit=crop&w=1200',
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Events & Live Moments
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Watch our latest workshops, exhibitions, talks, live sessions and behind-the-scenes moments.
          </p>
          <a
            href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition shadow-md"
          >
            <Video className="h-5 w-5" />
            Visit YouTube Channel
          </a>
        </div>

        {/* Recent Videos */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Play className="h-8 w-8 text-green-600" />
            Recent Video Highlights
          </h2>

          {loading ? (
            <div className="text-center py-20 text-gray-600 text-lg">
              Loading latest videos...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600 text-lg">{error}</div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20 text-gray-600 text-lg">
              No recent videos available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-video rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-6 transform group-hover:scale-110 transition-transform">
                      <Play className="h-14 w-14 text-white fill-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-semibold text-lg md:text-xl line-clamp-2 drop-shadow-md">
                      {video.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Event Gallery */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-green-600" />
            Event Gallery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryImages.map((src, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={src}
                  alt={`Event photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-semibold text-lg px-6 text-center drop-shadow-lg">
                    Event Moment #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-green-600 text-white px-10 py-6 rounded-full shadow-xl">
            <p className="text-xl md:text-2xl font-bold">
              More Exciting Events Coming Soon – Stay Tuned!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}