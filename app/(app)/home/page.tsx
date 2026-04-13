// Neshnabe Connect | Wolf Flow Solutions LLC 2026
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, getGreeting, Event, CommunityPost, LanguageContent, Member } from '@/lib/supabase';
import { ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [member, setMember] = useState<Member | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [wordOfDay, setWordOfDay] = useState<LanguageContent | null>(null);
  const [loading, setLoading] = useState(true);

  const greeting = getGreeting();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: memberData } = await supabase
          .from('members')
          .select('*')
          .eq('auth_id', user.id)
          .single();
        if (memberData) setMember(memberData);
      }

      const today = new Date().toISOString().split('T')[0];
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', today)
        .order('event_date', { ascending: true })
        .limit(5);
      if (eventsData) setEvents(eventsData);

      const { data: postsData } = await supabase
        .from('community_posts')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(4);
      if (postsData) setPosts(postsData);

      const { data: wordData } = await supabase
        .from('language_content')
        .select('*')
        .limit(1)
        .single();
      if (wordData) setWordOfDay(wordData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  function formatEventDate(dateStr: string, timeStr: string | null): string {
    const date = new Date(dateStr);
    const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return timeStr ? `${formatted} - ${timeStr}` : formatted;
  }

  // Demo data for preview
  const demoEvents: Event[] = events.length > 0 ? events : [
    { id: '1', title: "Men's Sweat Lodge", title_potawatomi: 'Nme biwak', event_date: '2026-04-18', start_time: '6:00 PM', location: 'Community Grounds', is_featured: true, description: null },
    { id: '2', title: 'Community Potluck', title_potawatomi: null, event_date: '2026-04-22', start_time: '12:00 PM', location: 'Community Center', is_featured: false, description: null },
  ];

  const demoWord: LanguageContent = wordOfDay || {
    id: '1',
    word_potawatomi: 'Migwetch',
    word_english: 'Thank you',
    category: 'greetings',
  };

  const demoPosts: CommunityPost[] = posts.length > 0 ? posts : [
    { id: '1', type: 'spotlight', title: 'Sarah Topash', content: 'Completed Language Immersion Program', is_approved: true, created_at: new Date().toISOString() },
    { id: '2', type: 'announcement', title: 'Community Garden Opens', content: 'Join us for the spring planting season', is_approved: true, created_at: new Date().toISOString() },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-14 pb-4">
      {/* Greeting Section */}
      <div className="mb-6">
        <p className="text-amber italic font-medium">{greeting.potawatomi}</p>
        <h1 className="text-3xl font-bold text-white leading-tight">
          {greeting.english}{member ? `, ${member.first_name}` : ''}
        </h1>
      </div>

      {/* Upcoming Events */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Upcoming Events</h2>
          <Link href="/events" className="text-amber text-sm font-medium flex items-center gap-1">
            See All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {demoEvents.map((event) => (
            <div key={event.id} className="glass-card p-4 min-w-[220px] flex-shrink-0">
              <h3 className="text-white font-semibold text-sm mb-1">{event.title}</h3>
              <p className="text-amber text-xs">{formatEventDate(event.event_date, event.start_time)}</p>
              {event.location && <p className="text-text-muted text-xs mt-1">{event.location}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Word of the Day */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Word of the Day</h2>
        <div className="glass-card p-4">
          <p className="text-amber text-2xl font-bold">{demoWord.word_potawatomi}</p>
          <p className="text-text-muted text-sm mt-1">{demoWord.word_english}</p>
        </div>
      </section>

      {/* Community Spotlight */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Community - Widokwtadwen</h2>
        <div className="space-y-3">
          {demoPosts.map((post) => (
            <div key={post.id} className="glass-card p-4">
              <span className="text-amber text-[10px] font-semibold tracking-wider uppercase">
                {post.type}
              </span>
              <h3 className="text-white font-semibold text-sm mt-1">{post.title}</h3>
              <p className="text-text-muted text-xs mt-1 line-clamp-2">{post.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <p className="text-text-muted text-[10px] text-center mt-8">
        Neshnabe Connect | Wolf Flow Solutions LLC 2026
      </p>
    </div>
  );
}
