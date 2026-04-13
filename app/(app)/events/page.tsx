// Neshnabe Connect | Wolf Flow Solutions LLC 2026
'use client';

import { useState, useEffect } from 'react';
import { supabase, Event } from '@/lib/supabase';
import { Calendar, Clock, MapPin } from 'lucide-react';

const demoEvents: Event[] = [
  { id: '1', title: "Men's Sweat Lodge", title_potawatomi: 'Nme biwak', event_date: '2026-04-18', start_time: '6:00 PM', location: 'Community Grounds, Dowagiac', is_featured: true, description: 'Join us for a traditional men\'s sweat lodge ceremony. This sacred gathering brings together men of all ages for purification, prayer, and community bonding.' },
  { id: '2', title: 'Community Potluck', title_potawatomi: 'Wisnin', event_date: '2026-04-22', start_time: '12:00 PM', location: 'Community Center', is_featured: false, description: 'Monthly community potluck dinner. Bring your favorite dish to share.' },
  { id: '3', title: 'Language Class', title_potawatomi: 'Neshnabemwen', event_date: '2026-04-25', start_time: '6:30 PM', location: 'Education Building', is_featured: false, description: 'Weekly Potawatomi language class for all skill levels.' },
  { id: '4', title: 'Elder\'s Gathering', title_potawatomi: null, event_date: '2026-04-28', start_time: '10:00 AM', location: 'Elder Center', is_featured: true, description: 'Monthly gathering for tribal elders with lunch provided.' },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', today)
        .order('event_date', { ascending: true });
      if (data) setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  }

  function toggleRsvp(eventId: string) {
    setRsvps(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const displayEvents = events.length > 0 ? events : demoEvents;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-14 pb-4">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white mb-6">Events</h1>

      {/* Events List */}
      <div className="space-y-4">
        {displayEvents.map((event) => (
          <div
            key={event.id}
            className={`glass-card p-4 ${event.is_featured ? 'border-amber' : ''}`}
          >
            {event.is_featured && (
              <span className="text-amber text-[10px] font-semibold tracking-wider">FEATURED</span>
            )}
            <h3 className="text-white font-semibold text-lg mt-1">{event.title}</h3>
            {event.title_potawatomi && (
              <p className="text-amber text-sm italic">{event.title_potawatomi}</p>
            )}

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Calendar size={14} className="text-amber" />
                <span>{formatDate(event.event_date)}</span>
              </div>
              {event.start_time && (
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <Clock size={14} className="text-amber" />
                  <span>{event.start_time}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <MapPin size={14} className="text-amber" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {event.description && (
              <p className="text-text-muted text-sm mt-3 leading-relaxed line-clamp-3">
                {event.description}
              </p>
            )}

            <button
              onClick={() => toggleRsvp(event.id)}
              className={`mt-4 h-8 px-6 rounded-full text-sm font-semibold transition-all ${
                rsvps[event.id]
                  ? 'bg-amber text-background'
                  : 'border border-amber text-amber hover:bg-amber/10'
              }`}
            >
              {rsvps[event.id] ? 'Attending' : 'RSVP'}
            </button>
          </div>
        ))}
      </div>

      {displayEvents.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-text-muted">No upcoming events</p>
        </div>
      )}

      {/* Footer */}
      <p className="text-text-muted text-[10px] text-center mt-8">
        Neshnabe Connect | Wolf Flow Solutions LLC 2026
      </p>
    </div>
  );
}
