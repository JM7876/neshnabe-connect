// Neshnabé Connect | Wolf Flow Solutions LLC 2026

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase, Department } from '@/lib/supabase';
import {
  Colors,
  GlassCard,
  Spacing,
  BorderRadius,
  getDepartmentEmoji,
} from '@/constants/theme';

const FILTER_TABS = ['All', 'Services', 'Culture', 'Admin', 'Health', 'Government'];

export default function DepartmentsScreen() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (data && !error) {
        setDepartments(data);
      }
    } catch (err) {
      console.error('Error loading departments:', err);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDepartments();
    setRefreshing(false);
  }, []);

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch = dept.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' ||
      dept.category?.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const renderDepartmentCard = ({ item }: { item: Department }) => (
    <TouchableOpacity style={[styles.deptCard, { borderLeftColor: item.accent_color || Colors.amber }]}>
      <Text style={styles.deptEmoji}>{getDepartmentEmoji(item.name)}</Text>
      <Text style={styles.deptName}>{item.name}</Text>
      {item.name_potawatomi && (
        <Text style={styles.deptNamePotawatomi}>{item.name_potawatomi}</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.amber} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Departments</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={16}
          color={Colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search departments..."
          placeholderTextColor={Colors.textMuted}
        />
      </View>

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

      {/* Departments Grid */}
      <FlatList
        data={filteredDepartments}
        renderItem={renderDepartmentCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.gridRow}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.amber}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No departments found</Text>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.footer}>
            Neshnabe Connect | Wolf Flow Solutions LLC 2026
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 56,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  searchContainer: {
    ...GlassCard,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 22,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
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
  gridContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  deptCard: {
    ...GlassCard,
    flex: 1,
    maxWidth: '48%',
    borderLeftWidth: 3,
    padding: Spacing.md,
  },
  deptEmoji: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  deptName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  deptNamePotawatomi: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Colors.amber,
    opacity: 0.8,
    marginTop: 4,
  },
  emptyContainer: {
    ...GlassCard,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.lg,
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
    marginBottom: Spacing.md,
  },
});
