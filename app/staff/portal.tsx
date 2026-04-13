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
import { supabase, Staff, ServiceRequest, Department } from '@/lib/supabase';
import { Colors, GlassCard, Spacing, BorderRadius } from '@/constants/theme';

const FILTER_TABS = ['All', 'New', 'In Progress', 'Resolved'];

interface StaffWithDepartment extends Staff {
  department?: Department;
}

export default function StaffPortalScreen() {
  const [staff, setStaff] = useState<StaffWithDepartment | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/');
        return;
      }

      // Get staff record
      const { data: staffData } = await supabase
        .from('staff')
        .select('*, department:departments(*)')
        .eq('auth_id', user.id)
        .single();

      if (!staffData) {
        router.replace('/');
        return;
      }

      setStaff(staffData);

      // Load service requests for this department
      const { data: requestsData } = await supabase
        .from('service_requests')
        .select('*, member:members(*), service:services(*)')
        .eq('department_id', staffData.department_id)
        .order('submitted_at', { ascending: false });

      if (requestsData) {
        setRequests(requestsData);
      }
    } catch (err) {
      console.error('Error loading staff data:', err);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  async function updateRequestStatus(requestId: string, newStatus: string) {
    setUpdatingId(requestId);
    try {
      await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: newStatus as ServiceRequest['status'] } : r
        )
      );
    } catch (err) {
      console.error('Error updating request:', err);
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredRequests = requests.filter((req) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'New') return req.status === 'new';
    if (activeFilter === 'In Progress')
      return req.status === 'in_review' || req.status === 'in_progress';
    if (activeFilter === 'Resolved') return req.status === 'resolved';
    return true;
  });

  // Calculate stats
  const openCount = requests.filter((r) =>
    ['new', 'in_review', 'in_progress'].includes(r.status)
  ).length;
  const urgentCount = requests.filter(
    (r) =>
      ['high', 'emergency'].includes(r.priority) && r.status !== 'resolved'
  ).length;
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const monthCount = requests.filter(
    (r) => new Date(r.submitted_at) >= thisMonth
  ).length;

  function getStatusStyle(status: string) {
    switch (status) {
      case 'new':
        return { bg: 'rgba(231, 76, 60, 0.2)', color: Colors.error, label: 'NEW' };
      case 'in_review':
        return { bg: 'rgba(243, 156, 18, 0.2)', color: Colors.warning, label: 'IN REVIEW' };
      case 'in_progress':
        return { bg: 'rgba(243, 156, 18, 0.2)', color: Colors.warning, label: 'IN PROGRESS' };
      case 'resolved':
        return { bg: 'rgba(39, 174, 96, 0.2)', color: Colors.success, label: 'RESOLVED' };
      default:
        return { bg: Colors.glass, color: Colors.textMuted, label: status.toUpperCase() };
    }
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Staff Portal</Text>
        <Text style={styles.subtitle}>Weweni Nakeyabi</Text>
        {staff && (
          <>
            <Text style={styles.welcomeText}>Welcome, {staff.title}</Text>
            <Text style={styles.departmentText}>
              {staff.department?.name || 'Department'}
            </Text>
          </>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: Colors.error }]}>
            {openCount}
          </Text>
          <View style={styles.statLabelRow}>
            <View style={[styles.statDot, { backgroundColor: Colors.error }]} />
            <Text style={styles.statLabel}>Open Requests</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: Colors.error }]}>
            {urgentCount}
          </Text>
          <View style={styles.statLabelRow}>
            <View style={[styles.statDot, { backgroundColor: Colors.error }]} />
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: Colors.success }]}>
            {monthCount}
          </Text>
          <View style={styles.statLabelRow}>
            <View style={[styles.statDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.statLabel}>This Month</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionEmoji}>Post Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionEmoji}>Create Event</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionEmoji}>Send Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionEmoji}>View Reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Department Inbox */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Department Inbox</Text>

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

        {/* Requests List */}
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => {
            const statusStyle = getStatusStyle(request.status);
            return (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestTitle} numberOfLines={1}>
                    {request.service?.name || 'Service Request'}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusStyle.bg },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: statusStyle.color }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                </View>
                <Text style={styles.requestMeta}>
                  {request.member?.first_name} {request.member?.last_name} - {request.tracking_number}
                </Text>
                {request.notes && (
                  <Text style={styles.requestNotes} numberOfLines={1}>
                    {request.notes}
                  </Text>
                )}
                {request.status !== 'resolved' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      updateRequestStatus(
                        request.id,
                        request.status === 'new' ? 'in_review' : 'resolved'
                      )
                    }
                    disabled={updatingId === request.id}
                  >
                    {updatingId === request.id ? (
                      <ActivityIndicator size="small" color={Colors.amber} />
                    ) : (
                      <Text style={styles.actionButtonText}>
                        {request.status === 'new'
                          ? 'Mark In Review'
                          : 'Mark Resolved'}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No requests in this category</Text>
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
    paddingBottom: 40,
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
  backButton: {
    fontSize: 14,
    color: Colors.amber,
    marginBottom: Spacing.sm,
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
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  departmentText: {
    fontSize: 14,
    color: Colors.amber,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    ...GlassCard,
    flex: 1,
    padding: Spacing.md,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  actionCard: {
    ...GlassCard,
    width: '47%',
    padding: Spacing.md,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  filterContainer: {
    paddingBottom: Spacing.sm,
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
  requestCard: {
    ...GlassCard,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  requestMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  requestNotes: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  actionButton: {
    marginTop: Spacing.sm,
    height: 32,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.amber,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.amber,
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
