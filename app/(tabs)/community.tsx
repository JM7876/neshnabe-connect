// Neshnabé Connect | Wolf Flow Solutions LLC 2026

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { supabase, CommunityPost, TribalBusiness } from '@/lib/supabase';
import { Colors, GlassCard, Spacing, BorderRadius } from '@/constants/theme';

const FILTER_TABS = ['All', 'Spotlight', 'Commemoration', 'Business', 'Blog'];

export default function CommunityScreen() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [businesses, setBusinesses] = useState<TribalBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Load community posts
      const { data: postsData } = await supabase
        .from('community_posts')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (postsData) {
        setPosts(postsData);
      }

      // Load tribal businesses
      const { data: businessData } = await supabase
        .from('tribal_businesses')
        .select('*')
        .eq('is_verified', true);

      if (businessData) {
        setBusinesses(businessData);
      }
    } catch (err) {
      console.error('Error loading community data:', err);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const filteredPosts = posts.filter((post) => {
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.amber} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.amber}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Nikanek</Text>
        <Text style={styles.subtitle}>Community</Text>
      </View>

      {/* Tribal Businesses */}
      {businesses.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tribal Member Businesses</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.businessScroll}
          >
            {businesses.map((business) => (
              <View key={business.id} style={styles.businessCard}>
                <Text style={styles.businessName}>{business.business_name}</Text>
                <Text style={styles.businessCategory}>{business.category}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterChip,
              activeFilter === tab && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === tab && styles.filterChipTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Community Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Feed - Widokwtadwen</Text>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <Text style={styles.postType}>{post.type.toUpperCase()}</Text>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent} numberOfLines={3}>
                {post.content}
              </Text>
              <Text style={styles.postDate}>{formatDate(post.created_at)}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Neshnabe Connect | Wolf Flow Solutions LLC 2026
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 56,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.amber,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  businessScroll: {
    paddingHorizontal: Spacing.md,
  },
  businessCard: {
    ...GlassCard,
    width: 180,
    padding: Spacing.md,
    marginRight: Spacing.sm,
  },
  businessName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  businessCategory: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  filterContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  filterChip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    height: 32,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.amber,
    borderColor: Colors.amber,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#1A1A1A',
  },
  postCard: {
    ...GlassCard,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  postType: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.amber,
    letterSpacing: 1,
    marginBottom: 4,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  postContent: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  postDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  emptyCard: {
    ...GlassCard,
    marginHorizontal: Spacing.md,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  footer: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
});
