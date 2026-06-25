'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserPlus, Edit, Trash2, Eye, User } from 'lucide-react';
import { profileAPI } from '@/lib/api';

interface Profile {
  id: string;
  profileId: string;
  gender: string;
  age: number;
  city?: string;
  caste?: string;
  maritalStatus: string;
  occupation?: string;
  status: string;
  createdAt: string;
  _count?: { contactReveals: number };
}

const MARITAL_LABELS: Record<string, string> = {
  NEVER_MARRIED: 'Single',
  DIVORCED: 'Divorced',
  WIDOWED: 'Widowed',
  SEPARATED: 'Separated',
};

export default function MyProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    profileAPI.getMyProfiles(page, limit)
      .then((res) => {
        setProfiles(res.data.data.profiles);
        setTotal(res.data.data.total);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile? This cannot be undone.')) return;
    try {
      await profileAPI.delete(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert('Failed to delete profile. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">My Profiles</h1>
          <p className="page-subtitle">{total} profiles uploaded</p>
        </div>
        <Link href="/profiles/new" className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Profile
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4 h-20 skeleton" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="card p-12 text-center">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-slate-700 mb-2">No profiles yet</h3>
          <p className="text-slate-500 mb-4">Start adding marriage profiles to the network</p>
          <Link href="/profiles/new" className="btn-primary inline-flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Your First Profile
          </Link>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Profile ID</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Gender</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Age</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">City</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Views</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-green-700 font-semibold">
                      {profile.profileId}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        profile.gender === 'MALE'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-pink-50 text-pink-700'
                      }`}>
                        {profile.gender === 'MALE' ? '♂ Male' : '♀ Female'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{profile.age} yrs</td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{profile.city || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        profile.status === 'ACTIVE'
                          ? 'bg-green-50 text-green-700'
                          : profile.status === 'INACTIVE'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {profile.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">
                      {profile._count?.contactReveals ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profiles/${profile.id}`}
                          className="p-1.5 text-slate-400 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/profiles/${profile.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(profile.id)}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
              <p className="text-slate-500">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * limit >= total}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
