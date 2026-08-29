import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../theme/colors';
import { SortOption } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  selectedPriority: string;
  onPrioritySelect: (priority: string) => void;
  selectedStatus: string;
  onStatusSelect: (status: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const CATEGORIES = ['All', 'Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'];
const PRIORITIES = ['All', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES = ['All', 'PENDING', 'COMPLETED'];
const SORTS: { label: string; value: SortOption }[] = [
  { label: '⚡ Smart Urgency', value: 'smart' },
  { label: '⏰ Due Date', value: 'deadline' },
  { label: '🔥 Priority', value: 'priority' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  selectedPriority,
  onPrioritySelect,
  selectedStatus,
  onStatusSelect,
  sortBy,
  onSortChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textSubtle}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sorting Chips */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>SORT BY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {SORTS.map((s) => {
            const active = sortBy === s.value;
            return (
              <TouchableOpacity
                key={s.value}
                style={[styles.sortChip, active && styles.sortChipActive]}
                onPress={() => onSortChange(s.value)}
              >
                <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Categories Row */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>CATEGORY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => onCategorySelect(cat)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Priority & Status Filters */}
      <View style={styles.filtersRow}>
        <View style={styles.filterColumn}>
          <Text style={styles.sectionTitle}>PRIORITY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {PRIORITIES.map((p) => {
              const active = selectedPriority === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[styles.miniChip, active && styles.chipActive]}
                  onPress={() => onPrioritySelect(p)}
                >
                  <Text style={[styles.miniChipText, active && styles.chipTextActive]}>{p}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.filterColumn}>
          <Text style={styles.sectionTitle}>STATUS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {STATUSES.map((st) => {
              const active = selectedStatus === st;
              return (
                <TouchableOpacity
                  key={st}
                  style={[styles.miniChip, active && styles.chipActive]}
                  onPress={() => onStatusSelect(st)}
                >
                  <Text style={[styles.miniChipText, active && styles.chipTextActive]}>{st}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearSearch: {
    color: colors.textMuted,
    fontSize: 14,
    padding: 4,
  },
  sectionRow: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSubtle,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  chipsScroll: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
  },
  sortChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortChipText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  sortChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  filterColumn: {
    flex: 1,
  },
  miniChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  miniChipText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
