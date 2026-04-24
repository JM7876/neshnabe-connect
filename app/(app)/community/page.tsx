// Neshnabe Connect | Wolf Flow Solutions LLC 2026
'use client';

import { useState, useEffect } from 'react';
import { supabase, CommunityPost, TribalBusiness } from '@/lib/supabase';

const FILTER_TABS = ['All', 'Spotlight', 'Business', 'Announcement', 'Blog'];

const demoPosts: CommunityPost[] = [
  { id: '1', type: 'spotlight', title: 'Sarah Topash', content: 'Awarded 2024 Language Preservation Grant for outstanding contributions to Potawatomi language education.', is_approved: true, created_at: new Date().toISOString() },
  { id: '2', type: 'announcement', title: 'Community Garden Opens', content: 'The new community garden is now open for the spring planting season. Sign up for your plot today!', is_approved: true, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', type: 'blog', title: 'Preserving Our Heritage', content: 'Reflecting on our ancestors\' journey and the importance of maintaining our cultural traditions for future generations.', is_approved: true, created_at: new Date(Date.now() - 7200000).toISOString() },
];

const demoBusinesses: TribalBusiness[] = [
  { id: '1', business_name: 'Pokagon Catering', category: 'Food & Dining', is_verified: true },
  { id: '2', business_name: 'Four Winds Casino', category: 'Entertainment', is_verified: true },
  { id: '3', business_name: 'Native Crafts Co.', category: 'Artisan', is_verified: true },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [businesses, setBusinesses] = useState<TribalBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: postsData } = await supabase
        .from('community_posts')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (postsData) setPosts(postsData);

      const { data: businessData } = await supabase
        .from('tribal_businesses')
        .select('*')
        .eq('is_verified', true);
      if (businessData) setBusinesses(businessData);
    } catch (err) {
      console.error('Error loading community data:', err);
    } finally {
      setLoading(false);
    }
  }

  const displayPosts = posts.length > 0 ? posts : demoPosts;
  const displayBusinesses = businesses.length > 0 ? businesses : demoBusinesses;

  const filteredPosts = displayPosts.filter((post) => {
    if (activeFilter === 'All') return true;
    return post.type.toLowerCase() === activeFilter.toLowerCase();
  });

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-14 pb-4">
      {/* Header */}
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Nikanek</h1>
        <p className="text-amber italic text-sm">Community</p>
      </div>

      {/* Tribal Businesses */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-base font-semibold text-white">Tribal Member Businesses</h2>
          <button className="text-amber text-sm font-medium">See All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 px-4">
          {displayBusinesses.map((business) => (
            <div key={business.id} className="glass-card p-4 min-w-[160px] flex-shrink-0">
              <h3 className="text-white font-semibold text-sm">{business.business_name}</h3>
              <span className="inline-block mt-2 px-2 py-1 bg-amber/20 text-amber text-xs rounded-full">
                {business.category}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-4">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`filter-chip whitespace-nowrap ${activeFilter === tab ? 'filter-chip-active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Community Feed */}
      <section className="px-4">
        <h2 className="text-base font-semibold text-white mb-3">Community Feed - Widokwtadwen</h2>
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div key={post.id} className="glass-card p-4">
              <span className="text-amber text-[10px] font-semibold tracking-wider uppercase">
                {post.type}
              </span>
              <h3 className="text-white font-semibold text-base mt-1">{post.title}</h3>
              <p className="text-text-muted text-sm mt-2 leading-relaxed line-clamp-3">
                {post.content}
              </p>
              <p className="text-text-muted text-xs mt-3">{formatDate(post.created_at)}</p>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-text-muted">No posts yet</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <p className="text-text-muted text-[10px] text-center mt-8 px-4">
        Neshnabe Connect | Wolf Flow Solutions LLC 2026
      </p>
    </div>
  );
}
