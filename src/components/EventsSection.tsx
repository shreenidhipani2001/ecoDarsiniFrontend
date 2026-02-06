// export default function EventsSection() {
//     return (
//         <div className="p-4">
//             <h2 className="text-2xl font-bold mb-4">Events</h2>
//             <p className="text-gray-600">Stay tuned for upcoming events and exhibitions!</p>
//         </div>
//     );
// }

'use client';

import { useState, useEffect } from 'react';
import { Play, Calendar, Video } from 'lucide-react';

export default function EventsSection() {
  const [videos, setVideos] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

 // Large gallery images (feel free to replace with your own)
 const galleryImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
  'https://images.unsplash.com/photo-1548345233-4557b8809829?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8&ixlib=rb-4.1.0&q=60&w=3000',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
];
  // === Your YouTube Channel ID (required) ===
  const CHANNEL_ID = 'UCxxxxxxxxxxxxxxxxxxxxxx'; // ← Replace this!

  // Public RSS feed URL
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

  // Temporary public CORS proxy (for dev/testing only – change or remove in prod)
  const PROXY_URL = 'https://api.allorigins.win/raw?url=';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(PROXY_URL + encodeURIComponent(RSS_URL));
        
        if (!response.ok) throw new Error('Failed to fetch RSS');

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const entries = xmlDoc.querySelectorAll('entry');
        const videoList: { id: string; title: string }[] = [];

        entries.forEach((entry, index) => {
          if (index >= 6) return; // limit to latest 6 videos
          const title = entry.querySelector('title')?.textContent || 'Untitled Video';
          const ytIdTag = entry.querySelector('id')?.textContent;
          const id = ytIdTag ? ytIdTag.split(':').pop() : null;

          if (id) {
            videoList.push({ id, title });
          }
        });

        setVideos(videoList);
      } catch (err: any) {
        console.error('RSS fetch error:', err);
        setError('Could not load videos — check channel ID or try later.');
      } finally {
        setLoading(false);
      }
    };

    if (CHANNEL_ID !== 'UCxxxxxxxxxxxxxxxxxxxxxx') {
      fetchVideos();
    } else {
      setError('Please update CHANNEL_ID in the code with your real YouTube channel ID.');
      setLoading(false);
    }
  }, []);

  

 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 3500);
  
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">

        {/**This is to be added when youtube is ready.... */}
        {/* Header */}
        {/* <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Events & Live Moments
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Catch our latest exhibitions, workshops, talks, and behind-the-scenes. 
            New videos drop regularly — subscribe for updates!
          </p>
          <a
            href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-semibold text-lg"
          >
            <Video className="h-5 w-5" />
            Visit Our YouTube Channel
          </a>
        </div> */}

        {/* Video Section */}
        {/* <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-center md:text-left flex items-center gap-2">
            <Play className="h-6 w-6 text-green-600" />
            Recent Video Highlights
          </h3>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading latest videos...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No recent videos found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-gray-900"
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-green-200 opacity-0 group-hover:opacity-10 transition-opacity" />

        
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-5 transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-12 w-12 text-white fill-white" />
                    </div>
                  </div>
 
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                    <h4 className="text-white font-medium text-lg line-clamp-2">{video.title}</h4>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div> */}
            
            {/**This is to be added when youtube is ready.... */}














            <div className="w-full flex items-center justify-center py-10">
  <div className="comingSoonContainer">
    <h1 className="comingSoonText">Section Coming Soon</h1>
  </div>
</div>

        {/* Gallery Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-center md:text-left flex items-center text-black gap-2">
            <Calendar className="h-8 w-8 text-green-600" />
            Event Gallery
          </h3>
          
          {/* Slideshow */}
          <div className="w-full h-[500px] relative overflow-hidden rounded-2xl shadow-xl mb-14">
            {galleryImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Slide ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full transition ${
                    i === currentSlide ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryImages.map((src, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={src}
                  alt={`Event moment ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                
                <div className="absolute inset-0 bg-green-200 flex items-center justify-center transition-opacity group-hover:opacity-90">
                  <span className="text-green-800 font-medium text-lg px-4 text-center">
                    Event Memory #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div> */}

<h3 className="text-2xl font-semibold mb-6 text-center md:text-left flex items-center text-black gap-2">
            
            Memories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {galleryImages.map((src, idx) => (
    <div
      key={idx}
      className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gray-100"
    >
      <img
        src={src}
        alt={`Event moment ${idx + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";

          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = "flex";
        }}
      />

      {/* Hidden fallback — only shows if image fails */}
      <div className="absolute inset-0 hidden items-center justify-center bg-green-200">
        <span className="text-green-800 font-medium text-lg px-4 text-center">
          Event Memory #{idx + 1}
        </span>
      </div>
    </div>
  ))}
</div>

        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center  gap-3 px-8 py-5 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition text-lg font-medium">
            <Calendar className="h-6 w-6 " />
            <p className="text-base sm:text-sm md:text-xl lg:text-3xl font-bold">
              More Events Coming Soon – Stay Tuned!
            </p>
           
          </div>
        </div>
      </div>
    </section>
  );
}