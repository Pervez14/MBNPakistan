'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Shield, AlertTriangle, Search, Filter } from 'lucide-react';
import { adminAPI } from '@/lib/api';

interface User {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  city?: string;
  country?: string;
  accountStatus: string;
  subscriptionStatus: string;
  subscriptionEndDate?: string;
  createdAt: string;
  badges: { badgeType: string }[];
  _count: { profiles: number };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
  SUSPENDED: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const limit = 20;

  const fetchUsers = () => {
    setLoading(true);
    adminAPI.listUsers({ page, limit, status: statusFilter, search })
      .then((res) => {
        setUsers(res.data.data.users);
        setTotal(res.data.data.pagination.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page, statusFilter]);

  const handleApprove = async (id: string) => {
    setActionLoading(id + '_approve');
    try {
      await adminAPI.approveUser(id);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, accountStatus: 'APPROVED' } : u));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Reason for rejection (will be sent to user):');
    if (!reason) return;
    setActionLoading(id + '_reject');
    try {
      await adminAPI.rejectUser(id, reason);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, accountStatus: 'REJECTED' } : u));
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (id: string) => {
    const reason = prompt('Reason for suspension:');
    if (!reason) return;
    setActionLoading(id + '_suspend');
    try {
      await adminAPI.suspendUser(id, reason);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, accountStatus: 'SUSPENDED' } : u));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Users Management</h1>
          <p className="page-subtitle">{total} total registrations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            placeholder="Search by name, email, business..."
            className="input-field pl-9 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {['', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th className="px-4 py-3 font-medium text-slate-600">Bureau</th>
              <th className="px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Location</th>
              <th className="px-4 py-3 font-medium text-slate-600">Account Status</th>
              <th className="px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Profiles</th>
              <th className="px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Registered</th>
              <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-4 py-3">
                    <div className="h-5 skeleton rounded w-full" />
                  </td>
                </tr>
              ))
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{user.businessName}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.badges.map((b) => (
                      <span key={b.badgeType} className="inline-flex items-center gap-0.5 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-medium">
                        <Shield className="w-2.5 h-2.5" />
                        {b.badgeType}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                  {[user.city, user.country].filter(Boolean).join(', ') || '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[user.accountStatus] ?? ''}`}>
                    {user.accountStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{user._count.profiles}</td>
                <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">
                  {new Date(user.createdAt).toLocaleDateString('en-PK')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {user.accountStatus === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(user.id)}
                          disabled={actionLoading === user.id + '_approve'}
                          title="Approve"
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-40"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(user.id)}
                          disabled={actionLoading === user.id + '_reject'}
                          title="Reject"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {user.accountStatus === 'APPROVED' && (
                      <button
                        onClick={() => handleSuspend(user.id)}
                        disabled={actionLoading === user.id + '_suspend'}
                        title="Suspend"
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors disabled:opacity-40"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    )}
                    {user.accountStatus === 'SUSPENDED' && (
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={actionLoading === user.id + '_approve'}
                        title="Reactivate"
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-40"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <p className="text-slate-500">Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50">
              Previous
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={page * limit >= total} className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
