// Neshnabe Connect | Wolf Flow Solutions LLC 2026
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, Bell, BarChart3 } from 'lucide-react';

const FILTER_TABS = ['All', 'New', 'In Progress', 'Resolved'];

interface DemoRequest {
  id: string;
  title: string;
  member: string;
  tracking: string;
  status: 'new' | 'in_review' | 'in_progress' | 'resolved';
  priority: string;
  notes: string;
  date: string;
}

const demoRequests: DemoRequest[] = [
  { id: '1', title: 'Emergency Repair Request', member: 'Johnathon Moulds', tracking: 'SR-2026-0142', status: 'new', priority: 'high', notes: 'Burst pipe in kitchen, water damage spreading', date: '2 hours ago' },
  { id: '2', title: 'New Housing Application', member: 'Sarah Williams', tracking: 'SR-2026-0141', status: 'in_review', priority: 'medium', notes: 'Family of 4, currently on waitlist', date: '1 day ago' },
  { id: '3', title: 'Maintenance Follow-up', member: 'Robert Topash', tracking: 'SR-2026-0139', status: 'resolved', priority: 'low', notes: 'Confirming furnace repair completed', date: '3 days ago' },
];

export default function StaffPortalPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [requests, setRequests] = useState(demoRequests);

  const filteredRequests = requests.filter((req) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'New') return req.status === 'new';
    if (activeFilter === 'In Progress') return req.status === 'in_review' || req.status === 'in_progress';
    if (activeFilter === 'Resolved') return req.status === 'resolved';
    return true;
  });

  const openCount = requests.filter(r => ['new', 'in_review', 'in_progress'].includes(r.status)).length;
  const urgentCount = requests.filter(r => r.priority === 'high' && r.status !== 'resolved').length;
  const monthCount = requests.length;

  function getStatusStyle(status: string) {
    switch (status) {
      case 'new': return { bg: 'bg-error/20', color: 'text-error', label: 'NEW' };
      case 'in_review': return { bg: 'bg-warning/20', color: 'text-warning', label: 'IN REVIEW' };
      case 'in_progress': return { bg: 'bg-warning/20', color: 'text-warning', label: 'IN PROGRESS' };
      case 'resolved': return { bg: 'bg-success/20', color: 'text-success', label: 'RESOLVED' };
      default: return { bg: 'bg-glass', color: 'text-text-muted', label: status.toUpperCase() };
    }
  }

  function updateStatus(id: string) {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      if (r.status === 'new') return { ...r, status: 'in_review' as const };
      if (r.status === 'in_review' || r.status === 'in_progress') return { ...r, status: 'resolved' as const };
      return r;
    }));
  }

  return (
    <div className="px-4 pt-14 pb-4">
      {/* Header */}
      <Link href="/profile" className="text-amber text-sm font-medium flex items-center gap-1 mb-2">
        <ArrowLeft size={16} /> Back
      </Link>
      <h1 className="text-2xl font-bold text-white">Staff Portal</h1>
      <p className="text-amber italic text-sm">Weweni Nakeyabi</p>
      <p className="text-text-muted text-sm mt-2">Welcome, Staff Member</p>
      <p className="text-amber text-sm">Housing Department</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mt-6 mb-6">
        <div className="glass-card p-3">
          <p className="text-2xl font-bold text-error">{openCount}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            <span className="text-text-muted text-[10px]">Open Requests</span>
          </div>
        </div>
        <div className="glass-card p-3">
          <p className="text-2xl font-bold text-error">{urgentCount}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            <span className="text-text-muted text-[10px]">Urgent</span>
          </div>
        </div>
        <div className="glass-card p-3">
          <p className="text-2xl font-bold text-success">{monthCount}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-text-muted text-[10px]">This Month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
            <FileText size={20} className="text-amber" />
            <span className="text-white text-sm font-medium">Post Update</span>
          </button>
          <button className="glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
            <Calendar size={20} className="text-amber" />
            <span className="text-white text-sm font-medium">Create Event</span>
          </button>
          <button className="glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
            <Bell size={20} className="text-amber" />
            <span className="text-white text-sm font-medium">Send Alert</span>
          </button>
          <button className="glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
            <BarChart3 size={20} className="text-amber" />
            <span className="text-white text-sm font-medium">View Reports</span>
          </button>
        </div>
      </section>

      {/* Department Inbox */}
      <section>
        <h2 className="text-base font-semibold text-white mb-3">Department Inbox</h2>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
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

        {/* Requests List */}
        <div className="space-y-3">
          {filteredRequests.map((request) => {
            const style = getStatusStyle(request.status);
            return (
              <div key={request.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-white font-semibold text-sm flex-1">{request.title}</h3>
                  <span className={`${style.bg} ${style.color} px-2 py-1 rounded text-[10px] font-semibold`}>
                    {style.label}
                  </span>
                </div>
                <p className="text-text-muted text-xs mt-1">
                  {request.member} - {request.tracking}
                </p>
                <p className="text-text-muted text-xs mt-1">{request.notes}</p>
                {request.status !== 'resolved' && (
                  <button
                    onClick={() => updateStatus(request.id)}
                    className="mt-3 h-8 px-4 border border-amber text-amber rounded-full text-xs font-medium hover:bg-amber/10 transition-colors"
                  >
                    {request.status === 'new' ? 'Mark In Review' : 'Mark Resolved'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {filteredRequests.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-text-muted">No requests in this category</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <p className="text-text-muted text-[10px] text-center mt-8">
        Neshnabe Connect | Wolf Flow Solutions LLC 2026
      </p>
    </div>
  );
}
