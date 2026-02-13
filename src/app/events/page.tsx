// 'use client';

// import { useState, useEffect } from 'react';
// import { Play, Calendar, Video } from 'lucide-react';
// import HomeHeader from '../../components/HomeHeader';
// import HomeFooter from '../../components/HomeFooter';

// export default function EventsPage() {
//   const [videos, setVideos] = useState<{ id: string; title: string }[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentSlide, setCurrentSlide] = useState(0);
  

  // const galleryImages = [
  //   'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200',
  //   'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
  //   'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
  //   'https://images.unsplash.com/photo-1548345233-4557b8809829?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8&ixlib=rb-4.1.0&q=60&w=3000',
  //   'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
  //   'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
  // ];

//   const CHANNEL_ID = 'UCNSv1V0RWvaRZNrs7ZVzOEA';
  
//   const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
//   const PROXY_URL = 'https://api.allorigins.win/raw?url=';

//   useEffect(() => {
//     const fetchVideos = async () => {
//       console.log('dddd')
//       try {
//         setLoading(true);
//         const response = await fetch(PROXY_URL + encodeURIComponent(RSS_URL));
//         if (!response.ok){console.log('Failed to fetch RSS')}

//         const xmlText = await response.text();
//         const parser = new DOMParser();
//         const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

//         const entries = xmlDoc.querySelectorAll('entry');
//         const videoList: { id: string; title: string }[] = [];

//         entries.forEach((entry, index) => {
//           if (index >= 6) return;
//           const title = entry.querySelector('title')?.textContent || 'Untitled Video';
//           const ytIdTag = entry.querySelector('id')?.textContent;
//           const id = ytIdTag ? ytIdTag.split(':').pop() : null;
//           if (id) videoList.push({ id, title });
//         });

//         setVideos(videoList);
//       } catch (err) {
//         setError('Could not load videos.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     // if (CHANNEL_ID !== 'UCNSv1V0RWvaRZNrs7ZVzOEA') fetchVideos();
//     // else {
//     //   console.log('error in 62')
//     //   setError('Update CHANNEL_ID with real ID.');
//     //   setLoading(false);
//     // }
//     fetchVideos();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
//     }, 3500);
//     return () => clearInterval(interval);
//   }, [galleryImages.length]);

//   return (
//     <>
//     <HomeHeader hideSearch={true}/>
//         <main className="min-h-screen py-12 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
       
//        <div className="max-w-7xl mx-auto">
//            {/**This is to be added when youtube is ready.... */}
//          {/* Header */}
//          <div className="text-center mb-10">
//            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
//              Events & Live Moments
//            </h2>
//            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
//              Catch our latest exhibitions, workshops, talks, and behind-the-scenes. 
//              New videos drop regularly — subscribe for updates!
//            </p>
//            <a
//              href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
//              target="_blank"
//              rel="noopener noreferrer"
//              className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-semibold text-lg"
//            >
//              <Video className="h-5 w-5" />
//              Visit Our YouTube Channel
//            </a>
//          </div>
 
//          {/* Video Section */}
//          <div className="mb-16">
//            <h3 className="text-2xl font-semibold mb-6 text-center md:text-left flex items-center gap-2">
//              <Play className="h-6 w-6 text-black" />
//              Recent Video Highlights
//            </h3>
 
//            {loading ? (
//              <div className="text-center py-12 text-gray-500">Loading latest videos...</div>
//            ) : error ? (
//              <div className="text-center py-12 text-red-600">{error}</div>
//            ) : videos.length === 0 ? (
//              <div className="text-center py-12 text-gray-500">No recent videos found.</div>
//            ) : (
//              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                {videos.map((video) => (
//                  <a
//                    key={video.id}
//                    href={`https://www.youtube.com/watch?v=o-Yafw_LLuo`}
//                   //  href={`https://www.youtube.com/watch?v=${video.id}`}
//                    target="_blank"
//                    rel="noopener noreferrer"
//                    className="group relative block aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-gray-900"
//                  >
//                    <img
//   src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
//   alt={video.title}
//   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//   onError={(e) => {
//     const target = e.target as HTMLImageElement;

//     if (target.src.includes('maxresdefault')) {
//       target.src = `https://img.youtube.com/vi/${video.id}/sddefault.jpg`;
//     } else if (target.src.includes('sddefault')) {
//       target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
//     } else if (target.src.includes('hqdefault')) {
//       target.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
//     } else {
//       target.src = `https://img.youtube.com/vi/${video.id}/default.jpg`;
//     }
//   }}
// />
                   
//                    <div className="absolute inset-0 bg-green-200 opacity-0 group-hover:opacity-10 transition-opacity" />
 
         
//                    <div className="absolute inset-0 flex items-center justify-center">
//                      <div className="bg-black/50 rounded-full p-5 transform group-hover:scale-110 transition-transform duration-300">
//                        <Play className="h-12 w-12 text-white fill-white" />
//                      </div>
//                    </div>
  
//                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
//                      <h4 className="text-white font-medium text-lg line-clamp-2">{video.title}</h4>
//                    </div>
//                  </a>
//                ))}
//              </div>
//            )}
//          </div>
             
//              {/**This is to be added when youtube is ready.... */}
 
 
 
//          {/* Coming Soon Banner */}
//          <div className="w-full flex items-center justify-center py-10">
//            <div className="comingSoonContainer">
//              <h1 className="comingSoonText">Section Coming Soon</h1>
//            </div>
//          </div>
 
//          {/* Gallery */}
//          <h3 className="text-2xl font-semibold mb-6 flex items-center text-black gap-2">
//            <Calendar className="h-8 w-8 text-green-600" />
//            Event Gallery
//          </h3>
 
//          <div className="w-full h-[500px] relative overflow-hidden rounded-2xl shadow-xl mb-14">
//            {galleryImages.map((img, index) => (
//              <img
//                key={index}
//                src={img}
//                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
//                  index === currentSlide ? 'opacity-100' : 'opacity-0'
//                }`}
//              />
//            ))}
//          </div>
 
//          {/* Memories Grid */}
//          <h3 className="text-2xl font-semibold mb-6 text-black">Memories</h3>
//          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//            {galleryImages.map((src, idx) => (
//              <img
//                key={idx}
//                src={src}
//                className="aspect-[4/3] object-cover rounded-xl shadow-md hover:scale-105 transition"
//              />
//            ))}
//          </div>
 
//          {/* Footer CTA */}
//          <div className="mt-12 text-center">
//            <div className="inline-flex items-center gap-3 px-8 py-5 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition text-lg font-medium">
//              <Calendar className="h-6 w-6" />
//              More Events Coming Soon – Stay Tuned!
//            </div>
//          </div>
 
//        </div>
//      </main>
//      <HomeFooter />
//     </>

//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { Play, Calendar, Video } from 'lucide-react';
import HomeHeader from '../../components/HomeHeader';
import HomeFooter from '../../components/HomeFooter';
import LoginModal from '../../components/LoginModal';
import RegisterModal from '../../components/RegisterModal';

export default function EventsPage() {
  const [videos, setVideos] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeModal, setActiveModal] = useState<'none' | 'login' | 'register'>('none');

  const galleryImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1548345233-4557b8809829?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8&ixlib=rb-4.1.0&q=60&w=3000',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200',
  ];

  const CHANNEL_ID = 'UCNSv1V0RWvaRZNrs7ZVzOEA';
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const PROXY_URL = 'https://api.allorigins.win/raw?url=';

  // FETCH VIDEOS
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(PROXY_URL + encodeURIComponent(RSS_URL));

        if (!response.ok) throw new Error('Failed RSS fetch');

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const entries = xmlDoc.querySelectorAll('entry');
        const videoList: { id: string; title: string }[] = [];

        entries.forEach((entry, index) => {
          if (index >= 6) return;

          const title =
            entry.querySelector('title')?.textContent || 'Untitled Video';
          const ytIdTag = entry.querySelector('id')?.textContent;
          const id = ytIdTag ? ytIdTag.split(':').pop() : null;

          if (id) videoList.push({ id, title });
        });

        setVideos(videoList);
      } catch (err) {
        console.error(err);
        setError('Could not load videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // SLIDESHOW
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  return (
    <>
      <HomeHeader hideSearch={true} onLoginClick={() => setActiveModal('login')} />

      <main className="min-h-screen py-12 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Events & Live Moments
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
              Catch our latest exhibitions, workshops and behind-the-scenes.
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
          </div>

          {/* VIDEO SECTION */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Play className="h-6 w-6 text-black" />
             <p className='text-black'>Recent Video Highlights</p> 
            </h3>

            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Loading latest videos...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-gray-900"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        if (t.src.includes('maxresdefault'))
                          t.src = `https://img.youtube.com/vi/${video.id}/sddefault.jpg`;
                        else if (t.src.includes('sddefault'))
                          t.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                        else if (t.src.includes('hqdefault'))
                          t.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
                        else
                          t.src = `https://img.youtube.com/vi/${video.id}/default.jpg`;
                      }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-5">
                        <Play className="h-12 w-12 text-white fill-white" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                      <h4 className="text-white font-medium text-lg line-clamp-2">
                        {video.title}
                      </h4>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* SLIDESHOW */}
          <h3 className="text-2xl font-semibold mb-6 text-black flex gap-2">
            <Calendar className="h-6 w-6 text-green-600" />
            Event Gallery
          </h3>

          <div className="w-full h-[500px] relative overflow-hidden rounded-2xl shadow-xl mb-14">
            {galleryImages.map((img, index) => (
              <img
                key={index}
                src={img}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>

          {/* GRID */}
          <h3 className="text-2xl font-semibold mb-6 text-black">Memories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                className="aspect-[4/3] object-cover rounded-xl shadow-md hover:scale-105 transition"
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-8 py-5 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition text-lg font-medium">
              <Calendar className="h-6 w-6" />
              More Events Coming Soon – Stay Tuned!
            </div>
          </div>

        </div>
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
