// Neshnabé Connect | Wolf Flow Solutions LLC 2026

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = 'https://uvqspbqozqvlcsjeodmv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cXNwYnFvenF2bGNzamVvZG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDgwNzksImV4cCI6MjA5MTYyNDA3OX0.d1b2SUzkBs0ANbWnna2Eo_FLhbdgTgYu6jkxN156dUk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS !== 'web' ? AsyncStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Type definitions for database tables
export interface Member {
  id: string;
  auth_id: string;
  tribal_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  enrollment_status: 'active' | 'inactive';
}

export interface Department {
  id: string;
  name: string;
  name_potawatomi: string | null;
  accent_color: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  department_id: string;
  name: string;
  description: string | null;
}

export interface ServiceRequest {
  id: string;
  service_id: string | null;
  department_id: string;
  member_id: string;
  status: 'new' | 'in_review' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  tracking_number: string;
  notes: string | null;
  submitted_at: string;
  member?: Member;
  service?: Service;
}

export interface Event {
  id: string;
  title: string;
  title_potawatomi: string | null;
  description: string | null;
  event_date: string;
  start_time: string | null;
  location: string | null;
  is_featured: boolean;
}

export interface EventRsvp {
  id: string;
  event_id: string;
  member_id: string;
  status: 'attending' | 'maybe' | 'declined';
}

export interface CommunityPost {
  id: string;
  type: 'spotlight' | 'commemoration' | 'business' | 'blog' | 'announcement';
  title: string;
  content: string;
  is_approved: boolean;
  created_at: string;
}

export interface TribalBusiness {
  id: string;
  business_name: string;
  category: string;
  is_verified: boolean;
}

export interface LanguageContent {
  id: string;
  word_potawatomi: string;
  word_english: string;
  category: string;
}

export interface Staff {
  id: string;
  auth_id: string;
  member_id: string;
  department_id: string;
  role: string;
  title: string;
  department?: Department;
  member?: Member;
}

export interface Notification {
  id: string;
  member_id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
}
