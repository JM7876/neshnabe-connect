// Neshnabe Connect | Wolf Flow Solutions LLC 2026
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, Member } from '@/lib/supabase';
import { Shield, LogOut } from 'lucide-react';

const demoMember: Member = {
  id: '1',
  auth_id: 'demo',
  tribal_id: 'NHBP-2026-1234',
  first_name: 'Johnathon',
  last_name: 'Moulds',
  email: 'jmoulds@nhbp.org',
  phone: '(269) 704-4000',
  address_line1: '123 Tribal Housing Rd',
  city: 'Dowagiac',
  state: 'MI',
  zip: '49047',
  enrollment_status: 'active',
};

export default function ProfilePage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: memberData } = await supabase
          .from('members')
          .select('*')
          .eq('auth_id', user.id)
          .single();
        if (memberData) setMember(memberData);

        const { data: staffData } = await supabase
          .from('staff')
          .select('id')
          .eq('auth_id', user.id)
          .single();
        setIsStaff(!!staffData);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
      await supabase.auth.signOut();
      router.push('/');
    }
  }

  const displayMember = member || demoMember;

  function getInitials(): string {
    const first = displayMember.first_name?.[0] || '';
    const last = displayMember.last_name?.[0] || '';
    return (first + last).toUpperCase();
  }

  function getFullAddress(): string {
    const parts = [
      displayMember.address_line1,
      displayMember.city,
      displayMember.state,
      displayMember.zip,
    ].filter(Boolean);
    if (parts.length === 0) return 'Not provided';
    return `${displayMember.address_line1}, ${displayMember.city}, ${displayMember.state} ${displayMember.zip}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-14 pb-4">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

      {/* Member Card */}
      <div className="glass-card p-6 text-center mb-4">
        <div className="w-[72px] h-[72px] bg-amber rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-bold text-background">{getInitials()}</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          {displayMember.first_name} {displayMember.last_name}
        </h2>
        <p className="text-amber text-sm mt-1">Tribal ID - {displayMember.tribal_id}</p>
        <p className="text-text-muted text-xs mt-1">
          Nottawaseppi Huron Band of the Potawatomi
        </p>
        <span
          className={`inline-block mt-3 px-3 py-1 rounded-xl text-xs font-semibold tracking-wider ${
            displayMember.enrollment_status === 'active'
              ? 'bg-success/20 text-success'
              : 'bg-error/20 text-error'
          }`}
        >
          {displayMember.enrollment_status?.toUpperCase() || 'ACTIVE'}
        </span>
      </div>

      {/* Info Card */}
      <div className="glass-card p-4 mb-4 space-y-4">
        <div>
          <p className="text-text-muted text-[10px] font-semibold tracking-wider">EMAIL</p>
          <p className="text-white text-sm">{displayMember.email || 'Not provided'}</p>
        </div>
        <div>
          <p className="text-text-muted text-[10px] font-semibold tracking-wider">PHONE</p>
          <p className="text-white text-sm">{displayMember.phone || 'Not provided'}</p>
        </div>
        <div>
          <p className="text-text-muted text-[10px] font-semibold tracking-wider">ADDRESS</p>
          <p className="text-white text-sm">{getFullAddress()}</p>
        </div>
      </div>

      {/* Staff Portal Button */}
      {(isStaff || !member) && (
        <Link
          href="/staff"
          className="glass-card border border-amber h-12 rounded-full flex items-center justify-center gap-2 mb-3 hover:bg-amber/10 transition-colors"
        >
          <Shield size={18} className="text-amber" />
          <span className="text-amber font-semibold text-sm">Staff Portal</span>
        </Link>
      )}

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="w-full h-12 border border-error rounded-full flex items-center justify-center gap-2 text-error font-medium hover:bg-error/10 transition-colors"
      >
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>

      {/* Footer */}
      <p className="text-text-muted text-[10px] text-center mt-8">
        Neshnabe Connect | Wolf Flow Solutions LLC 2026
      </p>
    </div>
  );
}
