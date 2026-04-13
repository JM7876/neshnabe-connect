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
import { router } from 'expo-router';
import { supabase, Member, Event, CommunityPost, LanguageContent } from '@/lib/supabase';
import {
  Colors,
  GlassCard,
  Spacing,
  BorderRadius,
  getGreeting,
} from '@/constants/theme';

export default function HomeScreen() {
  const [member, setMember] = useState<Member | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [wordOfDay, setWordOfDay] = useState<LanguageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const greeting = getGreeting();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/');
        return;
      }

      // Fetch member profile
      const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .eq('auth_id', user.id)
        .single();

      if (memberData) {
        setMember(memberData);
      }

      // Fetch upcoming events
      const today = new Date().toISOString().split('T')[0];
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', today)
        .order('event_date', { ascending: true })
        .limit(5);

      if (eventsData) {
        setEvents(eventsData);
      }

      // Fetch community posts
      const { data: postsData } = await supabase
        .from('community_posts')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (postsData) {
        setPosts(postsData);
      }

      // Fetch word of the day (random from language_content)
      const { data: wordData } = await supabase
        .from('language_content')
        .select('*')
        .limit(1)
        .single();

      if (wordData) {
        setWordOfDay(wordData);
      }
    } catch (err) {
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  function formatEventDate(dateStr: string, timeStr: string | null): string {
    const date = new Date(dateStr);
    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return timeStr ? `${formatted} - ${timeStr}` : formatted;
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
      {/* Greeting Section */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingPotawatomi}>{greeting.potawatomi}</Text>
        <Text style={styles.greetingText}>
          {greeting.english}
          {member ? `, ${member.first_name}` : ''}
        </Text>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/events')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsScroll}
        >
          {events.length > 0 ? (
            events.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <Text style={styles.eventTitle} numberOfLines={2}>
                  {event.title}
                </Text>
                <Text style={styles.eventDate}>
                  {formatEventDate(event.event_date, event.start_time)}
                </Text>
                {event.location && (
                  <Text style={styles.eventLocation} numberOfLines={1}>
                    {event.location}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyEventCard}>
              <Text style={styles.emptyText}>No upcoming events</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Word of the Day */}
      {wordOfDay && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Word of the Day</Text>
          <View style={styles.wordCard}>
            <Text style={styles.wordPotawatomi}>{wordOfDay.word_potawatomi}</Text>
            <Text style={styles.wordEnglish}>{wordOfDay.word_english}</Text>
          </View>
        </View>
      )}

      {/* Community Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community - Widokwtadwen</Text>
        {posts.length > 0 ? (
          posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <Text style={styles.postType}>{post.type.toUpperCase()}</Text>
              <Text style={styles.postTitle} numberOfLines={2}>
                {post.title}
              </Text>
              <Text style={styles.postContent} numberOfLines={2}>
                {post.content}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No community posts yet</Text>
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
    paddingHorizontal: Spacing.md,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingSection: {
    marginTop: 56,
    marginBottom: Spacing.lg,
  },
  greetingPotawatomi: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'italic',
    color: Colors.amber,
    opacity: 0.9,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 38,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.amber,
    fontWeight: '500',
  },
  eventsScroll: {
    paddingRight: Spacing.md,
  },
  eventCard: {
    ...GlassCard,
    width: 240,
    padding: Spacing.md,
    marginRight: Spacing.sm,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: Colors.amber,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  emptyEventCard: {
    ...GlassCard,
    width: 240,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordCard: {
    ...GlassCard,
    padding: Spacing.md,
  },
  wordPotawatomi: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.amber,
  },
  wordEnglish: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  postCard: {
    ...GlassCard,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  postType: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.amber,
    letterSpacing: 1,
    marginBottom: 4,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  postContent: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  emptyCard: {
    ...GlassCard,
    padding: Spacing.lg,
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
  },
});
