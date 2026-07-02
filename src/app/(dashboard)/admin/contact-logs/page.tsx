'use client';

import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Eye,
  Search,
  RotateCcw,
  ShieldCheck,
  User,
  Building2,
  Clock,
  Mail,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type ContactLog = {
  id: string;
  viewer_user_id: string | null;
  viewer_email: string | null;
  viewer_business_name: string | null;

  profile_id: string | null;
  profile_code: string | null;
  profile_candidate_name: string | null;
  profile_gender: string | null;

  uploader_email: string | null;
  uploader_business_name: string | null;

  viewed_at: string | null;
};

type Filters = {
  keyword: string;
  viewerEmail: string;
  uploaderEmail: string;
};

const emptyFilters: Filters = {
  keyword: '',
  viewerEmail: '',
  uploaderEmail: '',
};

export default function ContactLogsPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [logs, setLogs] = useState<ContactLog[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const updateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkAdmin = async (email: string) => {
    const { data, error } = await supabase
      .from('site_admins')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      return false;
    }

    return Boolean(data);
  };

  const loadLogs = async (activeFilters: Filters = filters) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('Please login again to view admin logs.');
      }

      setCurrentEmail(user.email);

      const adminStatus = await checkAdmin(user.email);
      setIsAdmin(adminStatus);

      if (!adminStatus) {
        setLogs([]);
        return;
      }

      let query = supabase
        .from('contact_view_logs')
        .select(
          `
          id,
          viewer_user_id,
          viewer_email,
          viewer_business_name,
          profile_id,
          profile_code,
          profile_candidate_name,
          profile_gender,
          uploader_email,
          uploader_business_name,
          viewed_at
        `
        )
        .order('viewed_at', { ascending: false })
        .limit(300);

      if (activeFilters.viewerEmail.trim()) {
        query = query.ilike(
          'viewer_email',
          `%${activeFilters.viewerEmail.trim()}%`
        );
      }

      if (activeFilters.uploaderEmail.trim()) {
        query = query.ilike(
          'uploader_email',
          `%${activeFilters.uploaderEmail.trim()}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      let result = (data || []) as ContactLog[];

      if (activeFilters.keyword.trim()) {
        const keyword = activeFilters.keyword.toLowerCase().trim();

        result = result.filter((log) => {
          const searchableText = [
            log.viewer_email,
            log.viewer_business_name,
            log.profile_code,
            log.profile_candidate_name,
            log.profile_gender,
            log.uploader_email,
            log.uploader_business_name,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return searchableText.includes(keyword);
        });
      }

      setLogs(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Contact logs could not be loaded. Please try again.';

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
    loadLogs(emptyFilters);
  };

  useEffect(() => {
    loadLogs(emptyFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-72 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <ShieldCheck className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Admin Access Required
          </h1>

          <p className="text-slate-500 mt-2">
            This page is only for MBN Pakistan website owner/admin.
          </p>

          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
            Logged in email: <span className="font-semibold">{currentEmail}</span>
          </div>

          <p className="text-sm text-slate-500 mt-4">
            To give access, add this email to the Supabase table{' '}
            <span className="font-semibold">site_admins</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">
          Contact View Logs
        </h1>

        <p className="text-slate-500 mt-1">
          Track which bureau viewed which profile contact details.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Search className="w-5 h-5 text-green-700" />
          <h2 className="font-semibold text-slate-900">Filter Logs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Keyword</label>
            <input
              name="keyword"
              value={filters.keyword}
              onChange={updateFilter}
              placeholder="Profile code, bureau name..."
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Viewer Email</label>
            <input
              name="viewerEmail"
              value={filters.viewerEmail}
              onChange={updateFilter}
              placeholder="who viewed contact"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Uploader Email</label>
            <input
              name="uploaderEmail"
              value={filters.uploaderEmail}
              onChange={updateFilter}
              placeholder="profile owner email"
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => loadLogs(filters)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
          >
            <Search className="w-4 h-4" />
            Search Logs
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Contact Reveal History
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {logs.length} log(s) found
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Showing latest 300 records
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4">
              <Eye className="w-8 h-8 text-slate-400" />
            </div>

            <h3 className="font-semibold text-slate-900">No logs found</h3>
            <p className="text-sm text-slate-500 mt-1">
              When a bureau clicks View Contact, records will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="rounded-xl bg-blue-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-blue-700" />
                      <p className="font-semibold text-blue-900">
                        Viewer Bureau
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-blue-900">
                      <p>
                        <span className="font-semibold">Business:</span>{' '}
                        {log.viewer_business_name || 'N/A'}
                      </p>

                      <p className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {log.viewer_email || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-green-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-5 h-5 text-green-700" />
                      <p className="font-semibold text-green-900">
                        Viewed Profile
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-green-900">
                      <p>
                        <span className="font-semibold">Code:</span>{' '}
                        {log.profile_code || 'N/A'}
                      </p>

                      <p>
                        <span className="font-semibold">Gender:</span>{' '}
                        {log.profile_gender || 'N/A'}
                      </p>

                      {log.profile_candidate_name && (
                        <p>
                          <span className="font-semibold">Candidate:</span>{' '}
                          {log.profile_candidate_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-amber-700" />
                      <p className="font-semibold text-amber-900">
                        Uploader Bureau
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-amber-900">
                      <p>
                        <span className="font-semibold">Business:</span>{' '}
                        {log.uploader_business_name || 'N/A'}
                      </p>

                      <p className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {log.uploader_email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-4 h-4" />
                  {log.viewed_at
                    ? new Date(log.viewed_at).toLocaleString()
                    : 'Time unavailable'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
