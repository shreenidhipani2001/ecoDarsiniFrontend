'use client';

import { useState, useEffect } from 'react';
import { Play, Video, X, ExternalLink } from 'lucide-react';
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

interface VideoEvent {
  id: number;
  title: string;
  description?: string;
  display_type: string;
  youtube_url?: string;
  created_at: string;
  images: EventImage[];
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideosPage() {
  const [events, setEvents] = useState<VideoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'login' | 'register'>('none');

  // YouTube channel videos
  const [channelVideos, setChannelVideos] = useState<{ id: string; title: string }[]>([]);
  const [channelLoading, setChannelLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const CHANNEL_ID = 'UCNSv1V0RWvaRZNrs7ZVzOEA';
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const PROXY_URL = 'https://api.allorigins.win/raw?url=';

  // Fetch events from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/events?display_type=only_video`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Could not load videos.');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [apiUrl]);

  // Fetch YouTube channel videos
  useEffect(() => {
    const fetchChannelVideos = async () => {
      try {
        setChannelLoading(true);
        const response = await fetch(PROXY_URL + encodeURIComponent(RSS_URL));
        if (!response.ok) throw new Error('Failed RSS fetch');

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const entries = xmlDoc.querySelectorAll('entry');
        const videoList: { id: string; title: string }[] = [];

        entries.forEach((entry, index) => {
          if (index >= 8) return;
          const title = entry.querySelector('title')?.textContent || 'Untitled Video';
          const ytIdTag = entry.querySelector('id')?.textContent;
          const id = ytIdTag ? ytIdTag.split(':').pop() : null;
          if (id) videoList.push({ id, title });
        });

        setChannelVideos(videoList);
      } catch (err) {
        console.error('Channel fetch error:', err);
      } finally {
        setChannelLoading(false);
      }
    };
    fetchChannelVideos();
  }, []);

  return (
    <>
      <HomeHeader hideSearch={true} onLoginClick={() => setActiveModal('login')} />

      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
        {/* Hero Banner */}
        <div className="relative py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 to-emerald-900/30" />
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(5, 150, 105, 0.15) 0%, transparent 50%)' }} />
          </div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-green-500/30">
              <Video className="h-4 w-4" />
              Video Gallery
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Watch Our Videos
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
              Experience our events, product showcases, and behind-the-scenes moments through video.
            </p>
            <a
              href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              {/* <Play className="h-5 w-5 fill-white" /> */}
              Subscribe Us
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Event Videos from API */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="h-8 w-1 bg-green-500 rounded-full" />
              Event Videos
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-video bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-red-400 text-lg">{error}</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-gray-500 text-lg">No event videos available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => {
                  const ytId = event.youtube_url ? extractYouTubeId(event.youtube_url) : null;
                  const thumbnail = event.images?.[0]?.card || event.images?.[0]?.url || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : '');
                  const isPlaying = playingVideoId === `event-${event.id}`;

                  return (
                    <div
                      key={event.id}
                      className="group rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5"
                    >
                      <div className="relative aspect-video">
                        {isPlaying && ytId ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          />
                        ) : (
                          <>
                            {thumbnail ? (
                              <img
                                src={thumbnail}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  const t = e.target as HTMLImageElement;
                                  if (ytId) {
                                    if (t.src.includes('maxresdefault'))
                                      t.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                                    else
                                      t.src = `https://img.youtube.com/vi/${ytId}/default.jpg`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                <Video className="h-16 w-16 text-gray-600" />
                              </div>
                            )}

                            {/* Play Button Overlay */}
                            {ytId && (
                              <button
                                onClick={() => setPlayingVideoId(`event-${event.id}`)}
                                className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                              >
                                <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-600/30">
                                  <Play className="h-8 w-8 text-white fill-white" />
                                </div>
                              </button>
                            )}

                            {/* Duration-style badge */}
                            {ytId && (
                              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                YouTube
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="text-white font-semibold text-base line-clamp-2 mb-2">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-xs">
                            {new Date(event.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          {ytId && (
                            <a
                              href={event.youtube_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Watch on YouTube
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* YouTube Channel Section */}
          {channelVideos.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="h-8 w-1 bg-red-500 rounded-full" />
                Latest from Our YouTube Channel
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {channelVideos.map((video) => {
                  const isPlaying = playingVideoId === `yt-${video.id}`;

                  return (
                    <div
                      key={video.id}
                      className="group rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700/50 hover:border-red-500/30 transition-all duration-300"
                    >
                      <div className="relative aspect-video">
                        {isPlaying ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          />
                        ) : (
                          <>
                            <img
                              src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                const t = e.target as HTMLImageElement;
                                if (t.src.includes('maxresdefault'))
                                  t.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                                else
                                  t.src = `https://img.youtube.com/vi/${video.id}/default.jpg`;
                              }}
                            />

                            <button
                              onClick={() => setPlayingVideoId(`yt-${video.id}`)}
                              className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                            >
                              <div className="bg-red-600 hover:bg-red-700 rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Play className="h-6 w-6 text-white fill-white" />
                              </div>
                            </button>
                          </>
                        )}
                      </div>

                      <div className="p-3">
                        <h4 className="text-white text-sm font-medium line-clamp-2">
                          {video.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {channelLoading && (
            <div className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-video bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Inline Video Modal - for stopping playback */}
      {playingVideoId && (
        <button
          onClick={() => setPlayingVideoId(null)}
          className="fixed bottom-6 right-6 z-40 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm transition-colors border border-gray-600"
        >
          <X className="h-4 w-4" />
          Stop Video
        </button>
      )}

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
