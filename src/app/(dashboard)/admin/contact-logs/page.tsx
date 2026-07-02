'use client';

import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  Users,
  FileText,
  Mail,
  Eye,
  Clock,
  Search,
  RefreshCcw,
  Building2,
  Phone,
  MapPin,
  UserCheck,
  UserX,
  Ban,
  RotateCcw,
  Inbox,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type BureauApplication = {
  id: string;
  full_name: string | null;
  business_name: string | null;
  role_in_bureau: string | null;
  email: string | null;
  mobile_number: string | null;
  whatsapp_number: string | null;
  city: string | null;
  province: string | null;
  office_address: string | null;
  status: string | null;
  created_at: string | null;
};

type MarriageProfile = {
  id: string;
  profile_code: string | null;
  candidate_name: string | null;
  gender: string | null;
  age: number | null;
  city: string | null;
  province: string | null;
  caste: string | null;
  education: string | null;
  profession: string | null;
  bureau_email: string | null;
  photo_visibility: string | null;
  status: string | null;
  created_at: string | null;
};

type ContactMessage = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  bureau_name: string | null;
  inquiry_type: string | null;
  message: string | null;
  status: string | null;
  created_at: string | null;
};

type ContactLog = {
  id: string;
  viewer_email: string | null;
  viewer_business_name: string | null;
  profile_code: string | null;
  profile_candidate_name: string | null;
  profile_gender: string | null;
  uploader_email: string | null;
  uploader_business_name: string | null;
  viewed_at: string | null;
};

type Stats = {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalProfiles: number;
  activeProfiles: number;
  inactiveProfiles: number;
  contactMessages: number;
  contactViews: number;
};

type TabKey = 'overview' | 'applications' | 'profiles' | 'messages' | 'logs';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'applications', label: 'Bureau Applications' },
  { key: 'profiles', label: 'Profiles' },
  { key: 'messages', label: 'Contact Messages' },
  { key: 'logs', label: 'Contact Logs' },
];

export default function SuperAdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalProfiles: 0,
    activeProfiles: 0,
    inactiveProfiles: 0,
    contactMessages: 0,
    contactViews: 0,
  });

  const [applications, setApplications] = useState<BureauApplication[]>([]);
  const [profiles, setProfiles] = useState<MarriageProfile[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [logs, setLogs] = useState<ContactLog[]>([]);

  const checkAdmin = async (email: string) => {
    const { data, error } = await supabase
      .from('site_admins')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (error) return false;

    return Boolean(data);
  };

  const getCount = async (
    tableName: string,
    column?: string,
    value?: string
  ) => {
    let query = supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (column && value) {
      query = query.eq(column, value);
    }

    const { count, error } = await query;

    if (error) {
      throw error;
    }

    return count || 0;
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('Please login again to access admin console.');
      }

      setCurrentEmail(user.email);

      const adminStatus = await checkAdmin(user.email);
      setIsAdmin(adminStatus);

      if (!adminStatus) {
        return;
      }

      const [
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalProfiles,
        activeProfiles,
        inactiveProfiles,
        contactMessages,
        contactViews,
      ] = await Promise.all([
        getCount('bureau_applications'),
        getCount('bureau_applications', 'status', 'pending'),
        getCount('bureau_applications', 'status', 'approved'),
        getCount('bureau_applications', 'status', 'rejected'),
        getCount('marriage_profiles'),
        getCount('marriage_profiles', 'status', 'active'),
        getCount('marriage_profiles', 'status', 'inactive'),
        getCount('contact_messages'),
        getCount('contact_view_logs'),
      ]);

      setStats({
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalProfiles,
        activeProfiles,
        inactiveProfiles,
        contactMessages,
        contactViews,
      });

      const { data: applicationData, error: applicationError } = await supabase
        .from('bureau_applications')
        .select(
          `
          id,
          full_name,
          business_name,
          role_in_bureau,
          email,
          mobile_number,
          whatsapp_number,
          city,
          province,
          office_address,
          status,
          created_at
        `
        )
        .order('created_at', { ascending: false })
        .limit(200);

      if (applicationError) throw applicationError;

      const { data: profileData, error: profileError } = await supabase
        .from('marriage_profiles')
        .select(
          `
          id,
          profile_code,
          candidate_name,
          gender,
          age,
          city,
          province,
          caste,
          education,
          profession,
          bureau_email,
          photo_visibility,
          status,
          created_at
        `
        )
        .order('created_at', { ascending: false })
        .limit(200);

      if (profileError) throw profileError;

      const { data: messageData, error: messageError } = await supabase
        .from('contact_messages')
        .select(
          `
          id,
          full_name,
          email,
          phone,
          bureau_name,
          inquiry_type,
          message,
          status,
          created_at
        `
        )
        .order('created_at', { ascending: false })
        .limit(200);

      if (messageError) throw messageError;

      const { data: logData, error: logError } = await supabase
        .from('contact_view_logs')
        .select(
          `
          id,
          viewer_email,
          viewer_business_name,
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

      if (logError) throw logError;

      setApplications((applicationData || []) as BureauApplication[]);
      setProfiles((profileData || []) as MarriageProfile[]);
      setMessages((messageData || []) as ContactMessage[]);
      setLogs((logData || []) as ContactLog[]);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Admin console could not be loaded. Please try again.';

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');

      const { error } = await supabase
        .from('bureau_applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setSuccessMessage(`Bureau application marked as ${status}.`);
      await loadAdminData();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Application could not be updated.';

      setErrorMessage(message);
    } finally {
      setActionLoading('');
    }
  };

  const updateProfileStatus = async (id: string, status: string) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');

      const { error } = await supabase
        .from('marriage_profiles')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setSuccessMessage(`Profile marked as ${status}.`);
      await loadAdminData();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Profile could not be updated.';

      setErrorMessage(message);
    } finally {
      setActionLoading('');
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');

      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setSuccessMessage(`Message marked as ${status}.`);
      await loadAdminData();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Message could not be updated.';

      setErrorMessage(message);
    } finally {
      setActionLoading('');
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredApplications = applications.filter((item) =>
    [
      item.full_name,
      item.business_name,
      item.email,
      item.mobile_number,
      item.city,
      item.province,
      item.status,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredProfiles = profiles.filter((item) =>
    [
      item.profile_code,
      item.candidate_name,
      item.gender,
      item.age,
      item.city,
      item.province,
      item.caste,
      item.education,
      item.profession,
      item.bureau_email,
      item.status,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter((item) =>
    [
      item.full_name,
      item.email,
      item.phone,
      item.bureau_name,
      item.inquiry_type,
      item.message,
      item.status,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredLogs = logs.filter((item) =>
    [
      item.viewer_email,
      item.viewer_business_name,
      item.profile_code,
      item.profile_candidate_name,
      item.profile_gender,
      item.uploader_email,
      item.uploader_business_name,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const statusClass = (status: string | null) => {
    if (status === 'approved' || status === 'active' || status === 'closed') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'rejected' || status === 'inactive') {
      return 'bg-red-100 text-red-700';
    }

    if (status === 'reviewed') {
      return 'bg-blue-100 text-blue-700';
    }

    return 'bg-amber-100 text-amber-700';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-80 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 bg-slate-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
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
            Super Admin Access Required
          </h1>

          <p className="text-slate-500 mt-2">
            This console is private and only accessible to the website owner /
            super admin.
          </p>

          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
            Logged in email:{' '}
            <span className="font-semibold">{currentEmail || 'Unknown'}</span>
          </div>

          <p className="text-sm text-slate-500 mt-4">
            To allow access, add this email to the Supabase table{' '}
            <span className="font-semibold">site_admins</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">
            Super Admin Console
          </h1>
          <p className="text-slate-500 mt-1">
            Manage all bureaus, profiles, messages, and contact view activity.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAdminData}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Applications</p>
              <p className="text-3xl font-bold text-slate-900 mt-3">
                {stats.totalApplications}
              </p>
              <p className="text-sm text-amber-600 mt-2">
                {stats.pendingApplications} pending
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Profiles</p>
              <p className="text-3xl font-bold text-slate-900 mt-3">
                {stats.totalProfiles}
              </p>
              <p className="text-sm text-green-600 mt-2">
                {stats.activeProfiles} active
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Contact Messages</p>
              <p className="text-3xl font-bold text-slate-900 mt-3">
                {stats.contactMessages}
              </p>
              <p className="text-sm text-slate-500 mt-2">From public form</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Contact Views</p>
              <p className="text-3xl font-bold text-slate-900 mt-3">
                {stats.contactViews}
              </p>
              <p className="text-sm text-slate-500 mt-2">Total reveal logs</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Eye className="w-6 h-6 text-amber-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setSearchTerm('');
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'overview' && (
          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search current section..."
              className="input-field pl-10"
            />
          </div>
        )}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Bureau Application Status
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Pending</span>
                <span className="font-bold text-amber-600">
                  {stats.pendingApplications}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Approved</span>
                <span className="font-bold text-green-600">
                  {stats.approvedApplications}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Rejected</span>
                <span className="font-bold text-red-600">
                  {stats.rejectedApplications}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Platform Controls
            </h2>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p>✅ Approve or reject bureau applications.</p>
              <p>✅ Activate or deactivate marriage profiles.</p>
              <p>✅ Review public contact messages.</p>
              <p>✅ See which bureau viewed which contact.</p>
              <p>✅ Keep admin access private through site_admins table.</p>
            </div>
          </div>
        </div>
      )}

      {/* Applications */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Bureau Applications
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredApplications.length} application(s)
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredApplications.map((app) => (
              <div key={app.id} className="p-6">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {app.business_name || 'Unnamed Bureau'}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                          app.status
                        )}`}
                      >
                        {app.status || 'pending'}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold">Owner:</span>{' '}
                        {app.full_name || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Role:</span>{' '}
                        {app.role_in_bureau || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{' '}
                        {app.email || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Mobile:</span>{' '}
                        {app.mobile_number || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">WhatsApp:</span>{' '}
                        {app.whatsapp_number || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Location:</span>{' '}
                        {app.city || 'N/A'}
                        {app.province ? `, ${app.province}` : ''}
                      </p>
                    </div>

                    {app.office_address && (
                      <p className="text-sm text-slate-500 mt-3">
                        <span className="font-semibold">Address:</span>{' '}
                        {app.office_address}
                      </p>
                    )}

                    {app.created_at && (
                      <p className="text-xs text-slate-400 mt-3">
                        Applied: {new Date(app.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateApplicationStatus(app.id, 'approved')
                      }
                      disabled={actionLoading === app.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 disabled:opacity-50"
                    >
                      <UserCheck className="w-4 h-4" />
                      Approve
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateApplicationStatus(app.id, 'rejected')
                      }
                      disabled={actionLoading === app.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 disabled:opacity-50"
                    >
                      <UserX className="w-4 h-4" />
                      Reject
                    </button>

                    <button
                      type="button"
                      onClick={() => updateApplicationStatus(app.id, 'pending')}
                      disabled={actionLoading === app.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold hover:bg-amber-100 disabled:opacity-50"
                    >
                      <Clock className="w-4 h-4" />
                      Pending
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredApplications.length === 0 && (
              <EmptyState text="No applications found." />
            )}
          </div>
        </div>
      )}

      {/* Profiles */}
      {activeTab === 'profiles' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              All Marriage Profiles
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredProfiles.length} profile(s)
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredProfiles.map((profile) => (
              <div key={profile.id} className="p-6">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {profile.profile_code ||
                          profile.candidate_name ||
                          'Marriage Profile'}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                          profile.status
                        )}`}
                      >
                        {profile.status || 'active'}
                      </span>

                      {profile.photo_visibility && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 capitalize">
                          Photo: {profile.photo_visibility}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold">Gender:</span>{' '}
                        {profile.gender || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Age:</span>{' '}
                        {profile.age || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Location:</span>{' '}
                        {profile.city || 'N/A'}
                        {profile.province ? `, ${profile.province}` : ''}
                      </p>
                      <p>
                        <span className="font-semibold">Caste:</span>{' '}
                        {profile.caste || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Education:</span>{' '}
                        {profile.education || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Profession:</span>{' '}
                        {profile.profession || 'N/A'}
                      </p>
                      <p className="md:col-span-2">
                        <span className="font-semibold">Uploader:</span>{' '}
                        {profile.bureau_email || 'N/A'}
                      </p>
                    </div>

                    {profile.created_at && (
                      <p className="text-xs text-slate-400 mt-3">
                        Created: {new Date(profile.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateProfileStatus(profile.id, 'active')}
                      disabled={actionLoading === profile.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Active
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateProfileStatus(profile.id, 'inactive')
                      }
                      disabled={actionLoading === profile.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 disabled:opacity-50"
                    >
                      <Ban className="w-4 h-4" />
                      Inactive
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredProfiles.length === 0 && (
              <EmptyState text="No profiles found." />
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      {activeTab === 'messages' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Contact Messages
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredMessages.length} message(s)
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredMessages.map((message) => (
              <div key={message.id} className="p-6">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                  <div className="max-w-4xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {message.full_name || 'No name'}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                          message.status
                        )}`}
                      >
                        {message.status || 'new'}
                      </span>

                      {message.inquiry_type && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          {message.inquiry_type}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold">Email:</span>{' '}
                        {message.email || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{' '}
                        {message.phone || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Bureau:</span>{' '}
                        {message.bureau_name || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span>{' '}
                        {message.created_at
                          ? new Date(message.created_at).toLocaleString()
                          : 'N/A'}
                      </p>
                    </div>

                    {message.message && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 text-sm text-slate-700 leading-relaxed">
                        {message.message}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateMessageStatus(message.id, 'reviewed')}
                      disabled={actionLoading === message.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Reviewed
                    </button>

                    <button
                      type="button"
                      onClick={() => updateMessageStatus(message.id, 'closed')}
                      disabled={actionLoading === message.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 disabled:opacity-50"
                    >
                      <Inbox className="w-4 h-4" />
                      Closed
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredMessages.length === 0 && (
              <EmptyState text="No messages found." />
            )}
          </div>
        </div>
      )}

      {/* Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Contact View Logs
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredLogs.length} log(s)
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                  <div className="p-4 rounded-xl bg-blue-50">
                    <p className="font-bold text-blue-900 mb-2">
                      Viewer Bureau
                    </p>
                    <p className="text-sm text-blue-900">
                      {log.viewer_business_name || 'N/A'}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      {log.viewer_email || 'N/A'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-green-50">
                    <p className="font-bold text-green-900 mb-2">
                      Viewed Profile
                    </p>
                    <p className="text-sm text-green-900">
                      {log.profile_code || 'N/A'}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {log.profile_gender || 'N/A'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50">
                    <p className="font-bold text-amber-900 mb-2">
                      Uploader Bureau
                    </p>
                    <p className="text-sm text-amber-900">
                      {log.uploader_business_name || 'N/A'}
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      {log.uploader_email || 'N/A'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {log.viewed_at
                    ? new Date(log.viewed_at).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            ))}

            {filteredLogs.length === 0 && <EmptyState text="No logs found." />}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-slate-400" />
      </div>
      <p className="font-semibold text-slate-900">{text}</p>
    </div>
  );
}
