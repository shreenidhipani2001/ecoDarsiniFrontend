'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
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

interface UpcomingEvent {
  id: number;
  title: string;
  description?: string;
  display_type: string;
  event_date?: string;
  location?: string;
  youtube_url?: string;
  created_at: string;
  images: EventImage[];
}

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'login' | 'register'>('none');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/events?display_type=upcoming_event`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch upcoming events');
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Could not load upcoming events.');
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, [apiUrl]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-IN', { month: 'short' }),
      year: date.getFullYear(),
      full: date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date();
  };

  return (
    <>
      <HomeHeader hideSearch={true} onLoginClick={() => setActiveModal('login')} />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 py-16 px-4 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Don&apos;t Miss Out
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Upcoming Events
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Stay updated with our latest events, exhibitions, and workshops. Mark your calendars!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-6 p-6 bg-white rounded-2xl shadow-sm animate-pulse">
                  <div className="w-20 h-24 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-2/3 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  </div>
                  <div className="w-48 h-32 bg-gray-200 rounded-xl hidden md:block" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                <CalendarDays className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Upcoming Events Yet
              </h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                We&apos;re planning exciting events. Stay tuned for updates!
              </p>
              <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors cursor-default">
                <Sparkles className="h-5 w-5" />
                Coming Soon
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event, index) => {
                const dateInfo = event.event_date
                  ? formatDate(event.event_date)
                  : null;
                const upcoming = event.event_date
                  ? isUpcoming(event.event_date)
                  : true;
                const thumbnail =
                  event.images?.[0]?.card ||
                  event.images?.[0]?.url ||
                  '';

                return (
                  <div
                    key={event.id}
                    className={`group relative flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      upcoming
                        ? 'border-green-200 hover:border-green-300'
                        : 'border-gray-200 opacity-75'
                    }`}
                  >
                    {/* Date Badge */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-20 h-24 rounded-xl flex flex-col items-center justify-center shadow-sm ${
                          upcoming
                            ? 'bg-gradient-to-b from-green-500 to-green-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {dateInfo ? (
                          <>
                            <span className="text-xs font-medium uppercase opacity-80">
                              {dateInfo.month}
                            </span>
                            <span className="text-3xl font-bold leading-none">
                              {dateInfo.day}
                            </span>
                            <span className="text-xs opacity-80">
                              {dateInfo.year}
                            </span>
                          </>
                        ) : (
                          <>
                            <CalendarDays className="h-6 w-6 mb-1" />
                            <span className="text-xs">TBA</span>
                          </>
                        )}
                      </div>

                      {/* Status Badge */}
                      {upcoming && (
                        <div className="mt-2 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Upcoming
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        {event.title}
                      </h3>

                      {event.description && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {dateInfo && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-green-500" />
                            <span>{dateInfo.full}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-green-500" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Extra images preview */}
                      {event.images && event.images.length > 1 && (
                        <div className="flex gap-2 mt-4">
                          {event.images.slice(1, 4).map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-sm"
                            >
                              <img
                                src={img.thumbnail || img.url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {event.images.length > 4 && (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center">
                              <span className="text-gray-500 text-sm font-medium">
                                +{event.images.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail */}
                    {thumbnail && (
                      <div className="flex-shrink-0 w-full md:w-56 h-40 rounded-xl overflow-hidden">
                        <img
                          src={thumbnail}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Hover Arrow */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                      <ArrowRight className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
