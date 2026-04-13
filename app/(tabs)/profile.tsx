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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { supabase, Member, Staff } from '@/lib/supabase';
import { Colors, GlassCard, Spacing, BorderRadius } from '@/constants/theme';

export default function ProfileScreen() {
  const [member, setMember] = useState<Member | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/');
        return;
      }

      // Load member profile
      const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .eq('auth_id', user.id)
        .single();

      if (memberData) {
        setMember(memberData);
      }

      // Check if user is staff
      const { data: staffData } = await supabase
        .from('staff')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      setIsStaff(!!staffData);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, []);

  async function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              router.replace('/');
            } catch (err) {
              console.error('Sign out error:', err);
            }
          },
        },
      ]
    );
  }

  function getInitials(): string {
    if (!member) return '';
    const first = member.first_name?.[0] || '';
    const last = member.last_name?.[0] || '';
    return (first + last).toUpperCase();
  }

  function getFullAddress(): string {
    if (!member) return '';
    const parts = [
      member.address_line1,
      member.city,
      member.state,
      member.zip,
    ].filter(Boolean);
    if (parts.length === 0) return 'Not provided';
    return `${member.address_line1 || ''}, ${member.city || ''}, ${member.state || ''} ${member.zip || ''}`;
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
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Member Card */}
      {member && (
        <View style={styles.memberCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.memberName}>
            {member.first_name} {member.last_name}
          </Text>
          <Text style={styles.tribalId}>Tribal ID - {member.tribal_id}</Text>
          <Text style={styles.tribeName}>
            Nottawaseppi Huron Band of the Potawatomi
          </Text>
          <View
            style={[
              styles.statusBadge,
              member.enrollment_status === 'active'
                ? styles.statusActive
                : styles.statusInactive,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                member.enrollment_status === 'active'
                  ? styles.statusTextActive
                  : styles.statusTextInactive,
              ]}
            >
              {member.enrollment_status?.toUpperCase() || 'ACTIVE'}
            </Text>
          </View>
        </View>
      )}

      {/* Info Card */}
      {member && (
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>EMAIL</Text>
            <Text style={styles.infoValue}>{member.email || 'Not provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PHONE</Text>
            <Text style={styles.infoValue}>{member.phone || 'Not provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ADDRESS</Text>
            <Text style={styles.infoValue}>{getFullAddress()}</Text>
          </View>
        </View>
      )}

      {/* Staff Portal Button */}
      {isStaff && (
        <TouchableOpacity
          style={styles.staffButton}
          onPress={() => router.push('/staff/portal')}
        >
          <Text style={styles.staffButtonText}>Staff Portal</Text>
        </TouchableOpacity>
      )}

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

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
  memberCard: {
    ...GlassCard,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.amber,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  memberName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  tribalId: {
    fontSize: 13,
    color: Colors.amber,
    marginBottom: 4,
  },
  tribeName: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
  },
  statusInactive: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statusTextActive: {
    color: Colors.success,
  },
  statusTextInactive: {
    color: Colors.error,
  },
  infoCard: {
    ...GlassCard,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoRow: {
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  staffButton: {
    ...GlassCard,
    borderWidth: 1,
    borderColor: Colors.amber,
    borderRadius: BorderRadius.xl,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  staffButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.amber,
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: BorderRadius.xl,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.error,
  },
  footer: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
