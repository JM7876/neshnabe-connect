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
import { supabase, Event, EventRsvp, Member } from '@/lib/supabase';
import { Colors, GlassCard, Spacing, BorderRadius } from '@/constants/theme';

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({});
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get member ID
      const { data: memberData } = await supabase
        .from('members')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (memberData) {
        setMemberId(memberData.id);

        // Load RSVPs
        const { data: rsvpData } = await supabase
          .from('event_rsvps')
          .select('event_id')
          .eq('member_id', memberData.id)
          .eq('status', 'attending');

        if (rsvpData) {
          const rsvpMap: Record<string, boolean> = {};
          rsvpData.forEach((r) => {
            rsvpMap[r.event_id] = true;
          });
          setRsvps(rsvpMap);
        }
      }

      // Load events
      const today = new Date().toISOString().split('T')[0];
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', today)
        .order('event_date', { ascending: true });

      if (eventsData) {
        setEvents(eventsData);
      }
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  async function toggleRsvp(eventId: string) {
    if (!memberId || rsvpLoading) return;

    setRsvpLoading(eventId);
    try {
      if (rsvps[eventId]) {
        // Remove RSVP
        await supabase
          .from('event_rsvps')
          .delete()
          .eq('event_id', eventId)
          .eq('member_id', memberId);

        setRsvps((prev) => {
          const updated = { ...prev };
          delete updated[eventId];
          return updated;
        });
      } else {
        // Add RSVP
        await supabase.from('event_rsvps').insert({
          event_id: eventId,
          member_id: memberId,
          status: 'attending',
        });

        setRsvps((prev) => ({ ...prev, [eventId]: true }));
      }
    } catch (err) {
      console.error('Error toggling RSVP:', err);
    } finally {
      setRsvpLoading(null);
    }
  }

  function formatEventDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
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
        <Text style={styles.title}>Events</Text>
      </View>

      {/* Events List */}
      {events.length > 0 ? (
        events.map((event) => (
          <View
            key={event.id}
            style={[
              styles.eventCard,
              event.is_featured && styles.eventCardFeatured,
            ]}
          >
            {event.is_featured && (
              <Text style={styles.featuredBadge}>FEATURED</Text>
            )}
            <Text style={styles.eventTitle}>{event.title}</Text>
            {event.title_potawatomi && (
              <Text style={styles.eventTitlePotawatomi}>
                {event.title_potawatomi}
              </Text>
            )}

            <View style={styles.eventDetails}>
              <Text style={styles.eventDetailText}>
                {formatEventDate(event.event_date)}
              </Text>
              {event.start_time && (
                <Text style={styles.eventDetailText}>{event.start_time}</Text>
              )}
              {event.location && (
                <Text style={styles.eventDetailText}>{event.location}</Text>
              )}
            </View>

            {event.description && (
              <Text style={styles.eventDescription} numberOfLines={3}>
                {event.description}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.rsvpButton,
                rsvps[event.id] && styles.rsvpButtonActive,
              ]}
              onPress={() => toggleRsvp(event.id)}
              disabled={rsvpLoading === event.id}
            >
              {rsvpLoading === event.id ? (
                <ActivityIndicator
                  size="small"
                  color={rsvps[event.id] ? '#1A1A1A' : Colors.amber}
                />
              ) : (
                <Text
                  style={[
                    styles.rsvpButtonText,
                    rsvps[event.id] && styles.rsvpButtonTextActive,
                  ]}
                >
                  {rsvps[event.id] ? 'Attending' : 'RSVP'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No upcoming events</Text>
        </View>
      )}

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
  header: {
    marginTop: 56,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  eventCard: {
    ...GlassCard,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  eventCardFeatured: {
    borderColor: Colors.amber,
  },
  featuredBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.amber,
    letterSpacing: 1,
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  eventTitlePotawatomi: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.amber,
    marginBottom: Spacing.sm,
  },
  eventDetails: {
    marginBottom: Spacing.sm,
  },
  eventDetailText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  rsvpButton: {
    height: 32,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.amber,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  rsvpButtonActive: {
    backgroundColor: Colors.amber,
    borderColor: Colors.amber,
  },
  rsvpButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.amber,
  },
  rsvpButtonTextActive: {
    color: '#1A1A1A',
  },
  emptyCard: {
    ...GlassCard,
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
  },
});
