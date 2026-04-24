// Neshnabe Connect | Wolf Flow Solutions LLC 2026
'use client';

import { useState, useEffect } from 'react';
import { supabase, Department, getDepartmentEmoji } from '@/lib/supabase';
import { Search } from 'lucide-react';

const FILTER_TABS = ['All', 'Services', 'Culture', 'Admin', 'Health', 'Government'];

const demoDepartments: Department[] = [
  { id: '1', name: 'Housing', name_potawatomi: 'Wigwam', accent_color: '#8B6F47', category: 'Services', display_order: 1, is_active: true },
  { id: '2', name: 'Health & Human Services', name_potawatomi: 'Bimaadziwin', accent_color: '#7CB342', category: 'Health', display_order: 2, is_active: true },
  { id: '3', name: 'Finance', name_potawatomi: 'Zhonyamget', accent_color: '#D4AF37', category: 'Admin', display_order: 3, is_active: true },
  { id: '4', name: 'Language & Culture', name_potawatomi: 'Neshnabemwen', accent_color: '#CD7F32', category: 'Culture', display_order: 4, is_active: true },
  { id: '5', name: 'Education', name_potawatomi: 'Kinomagewen', accent_color: '#5B9BD5', category: 'Services', display_order: 5, is_active: true },
  { id: '6', name: 'Tribal Police', name_potawatomi: 'Mewenzha', accent_color: '#2C3E50', category: 'Government', display_order: 6, is_active: true },
  { id: '7', name: 'Social Services', name_potawatomi: 'Widokwe', accent_color: '#9B59B6', category: 'Services', display_order: 7, is_active: true },
  { id: '8', name: 'Environmental', name_potawatomi: 'Shkode', accent_color: '#27AE60', category: 'Services', display_order: 8, is_active: true },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      const { data } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (data) setDepartments(data);
    } catch (err) {
      console.error('Error loading departments:', err);
    } finally {
      setLoading(false);
    }
  }

  const displayDepts = departments.length > 0 ? departments : demoDepartments;

  const filteredDepartments = displayDepts.filter((dept) => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || dept.category?.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

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
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-bold text-white">Departments</h1>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="glass-card flex items-center h-11 px-4 rounded-full">
          <Search size={16} className="text-text-muted mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 -mx-4">
        <div className="flex gap-2 px-4">
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
      </div>

      {/* Departments Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {filteredDepartments.map((dept) => (
          <button
            key={dept.id}
            className="glass-card p-4 text-left border-l-[3px] hover:bg-white/5 transition-colors"
            style={{ borderLeftColor: dept.accent_color }}
          >
            <span className="text-2xl block mb-2">{getDepartmentEmoji(dept.name)}</span>
            <h3 className="text-white font-semibold text-sm">{dept.name}</h3>
            {dept.name_potawatomi && (
              <p className="text-amber text-xs italic mt-1 opacity-80">{dept.name_potawatomi}</p>
            )}
          </button>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="glass-card mx-4 p-8 text-center">
          <p className="text-text-muted">No departments found</p>
        </div>
      )}

      {/* Footer */}
      <p className="text-text-muted text-[10px] text-center mt-8 px-4">
        Neshnabe Connect | Wolf Flow Solutions LLC 2026
      </p>
    </div>
  );
}
