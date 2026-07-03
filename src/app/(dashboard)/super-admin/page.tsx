'use client';

import { useEffect, useState, type ReactNode } from 'react';
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
  UserCheck,
  UserX,
  Ban,
  RotateCcw,
  Inbox,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  NotebookPen,
  Lock,
  ImageIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type BureauApplication = {
  id: string;
  full_name: string | null;
  role_in_bureau: string | null;
  mobile_number: string | null;
  whatsapp_number: string | null;
  email: string | null;
  cnic: string | null;

  business_name: string | null;
  years_in_business: string | null;
  active_profiles: string | null;
  has_physical_office: string | null;
  office_phone: string | null;

  city: string | null;
  province: string | null;
  country: string | null;
  office_address: string | null;
  areas_served: string | null;

  website: string | null;
  social_link: string | null;
  google_business_link: string | null;

  specializations: string[] | null;

  reference_name_1: string | null;
  reference_phone_1: string | null;
  reference_name_2: string | null;
  reference_phone_2: string | null;

  status: string | null;
  admin_notes: string | null;
  created_at: string | null;
};

type MarriageProfile = {
  id: string;
  profile_code: string | null;
  candidate_name: string | null;
  gender: string | null;
  age: number | null;
  marital_status: string | null;
  city: string | null;
  province: string | null;
  caste: string | null;
  sect: string | null;
  education: string | null;
  profession: string | null;
  employment_status: string | null;
  bureau_email: string | null;
  photo_url: string | null;
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
  newMessages: number;

  contactViews: number;
};

type TabKey =
  | 'overview'
  | 'applications'
  | 'profiles'
  | 'messages'
  | 'logs';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'applications', label: 'Bureau Requests' },
  { key: 'profiles', label: 'Profiles Control' },
  { key: 'messages', label: 'Contact Messages' },
  { key: 'logs', label: 'Contact View Logs' },
];

function formatDate(value: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

function statusClass(status: string | null) {
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
}

function getWhatsAppLink(number: string | null) {
  if (!number) return '';
  const clean = number.replace(/\D/g, '');
  return clean ? `https://wa.me/${clean}` : '';
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  bg,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-3">{value}</p>
          <p className="text-sm text-slate-500 mt-2">{subtitle}</p>
        </div>

        <div
          className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  count,
  subtitle,
}: {
  title: string;
  count: number;
  subtitle?: string;
}) {
  return (
    <div className="px-6 py-5 border-b border-slate-100">
      <h2 className="font-heading text-xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        {count} record(s){subtitle ? ` • ${subtitle}` : ''}
      </p>
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

function InfoLine({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (!value) return null;

  return (
    <p>
      <span className="font-semibold text-slate-900">{label}:</span>{' '}
      <span>{value}</span>
    </p>
  );
}

export default function SuperAdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
    newMessages: 0,
    contactViews: 0,
  });

  const [applications, setApplications] = useState<BureauApplication[]>([]);
  const [profiles, setProfiles] = useState<MarriageProfile[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [logs, setLogs] = useState<ContactLog[]>([]);
  const [adminNotesDraft, setAdminNotesDraft] = useState<Record<string, string>>(
    {}
  );

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

    if (error) throw error;

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
        newMessages,
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
        getCount('contact_messages', 'status', 'new'),
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
        newMessages,
        contactViews,
      });

      const { data: applicationData, error: applicationError } = await supabase
        .from('bureau_applications')
        .select(
          `
          id,
          full_name,
          role_in_bureau,
          mobile_number,
          whatsapp_number,
          email,
          cnic,
          business_name,
          years_in_business,
          active_profiles,
          has_physical_office,
          office_phone,
          city,
          province,
          country,
          office_address,
          areas_served,
          website,
          social_link,
          google_business_link,
          specializations,
          reference_name_1,
          reference_phone_1,
          reference_name_2,
          reference_phone_2,
          status,
          admin_notes,
          created_at
        `
        )
        .order('created_at', { ascending: false })
        .limit(500);

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
          marital_status,
          city,
          province,
          caste,
          sect,
          education,
          profession,
          employment_status,
          bureau_email,
          photo_url,
          photo_visibility,
          status,
          created_at
        `
        )
        .order('created_at', { ascending: false })
        .limit(500);

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
        .limit(500);

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
        .limit(700);

      if (logError) throw logError;

      const loadedApplications = (applicationData || []) as BureauApplication[];

      const notes: Record<string, string> = {};
      loadedApplications.forEach((app) => {
        notes[app.id] = app.admin_notes || '';
      });

      setAdminNotesDraft(notes);
      setApplications(loadedApplications);
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

      setSuccessMessage(`Bureau request marked as ${status}.`);
      await loadAdminData();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Request could not be updated.'
      );
    } finally {
      setActionLoading('');
    }
  };

  const saveAdminNotes = async (id: string) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');

      const { error } = await supabase
        .from('bureau_applications')
        .update({ admin_notes: adminNotesDraft[id] || null })
        .eq('id', id);

      if (error) throw error;

      setSuccessMessage('Admin notes saved.');
      await loadAdminData();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Admin notes could not be saved.'
      );
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
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setSuccessMessage(`Profile marked as ${status}.`);
      await loadAdminData();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Profile could not be updated.'
      );
    } finally {
      setActionLoading('');
    }
  };

  const updateProfilePhotoVisibility = async (
    id: string,
    photoVisibility: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');

      const { error } = await supabase
        .from('marriage_profiles')
        .update({
          photo_visibility: photoVisibility,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      setSuccessMessage(`Profile photo visibility changed to ${photoVisibility}.`);
      await loadAdminData();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Photo privacy could not be updated.'
      );
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
      setErrorMessage(
        err instanceof Error ? err.message : 'Message could not be updated.'
      );
    } finally {
      setActionLoading('');
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredApplications = applications.filter((item) => {
    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    const matchesSearch = [
      item.full_name,
      item.business_name,
      item.email,
      item.mobile_number,
      item.whatsapp_number,
      item.city,
      item.province,
      item.status,
      item.cnic,
      item.office_address,
      item.areas_served,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const filteredProfiles = profiles.filter((item) => {
    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    const matchesSearch = [
      item.profile_code,
      item.candidate_name,
      item.gender,
      item.age,
      item.marital_status,
      item.city,
      item.province,
      item.caste,
      item.sect,
      item.education,
      item.profession,
      item.employment_status,
      item.bureau_email,
      item.status,
      item.photo_visibility,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const filteredMessages = messages.filter((item) => {
    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    const matchesSearch = [
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
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

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

  const recentPendingApplications = applications
    .filter((app) => app.status === 'pending')
    .slice(0, 5);

  const recentMessages = messages.slice(0, 5);
  const recentLogs = logs.slice(0, 5);

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
            Full control center for bureau requests, profiles, messages, and
            contact activity.
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <StatCard
          title="Applications"
          value={stats.totalApplications}
          subtitle={`${stats.pendingApplications} pending`}
          icon={<Building2 className="w-6 h-6 text-green-700" />}
          bg="bg-green-50"
        />

        <StatCard
          title="Approved Bureaus"
          value={stats.approvedApplications}
          subtitle={`${stats.rejectedApplications} rejected`}
          icon={<UserCheck className="w-6 h-6 text-blue-700" />}
          bg="bg-blue-50"
        />

        <StatCard
          title="Profiles"
          value={stats.totalProfiles}
          subtitle={`${stats.activeProfiles} active`}
          icon={<FileText className="w-6 h-6 text-purple-700" />}
          bg="bg-purple-50"
        />

        <StatCard
          title="Messages"
          value={stats.contactMessages}
          subtitle={`${stats.newMessages} new`}
          icon={<Mail className="w-6 h-6 text-amber-700" />}
          bg="bg-amber-50"
        />

        <StatCard
          title="Contact Views"
          value={stats.contactViews}
          subtitle="Total reveal logs"
          icon={<Eye className="w-6 h-6 text-red-700" />}
          bg="bg-red-50"
        />
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
                setStatusFilter('');
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search current section..."
                className="input-field pl-10"
              />
            </div>

            {(activeTab === 'applications' ||
              activeTab === 'profiles' ||
              activeTab === 'messages') && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Status</option>

                {activeTab === 'applications' && (
                  <>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </>
                )}

                {activeTab === 'profiles' && (
                  <>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </>
                )}

                {activeTab === 'messages' && (
                  <>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="closed">Closed</option>
                  </>
                )}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 xl:col-span-1">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Request Status
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Pending Requests</span>
                <span className="font-bold text-amber-600">
                  {stats.pendingApplications}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Approved Bureaus</span>
                <span className="font-bold text-green-600">
                  {stats.approvedApplications}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Rejected Requests</span>
                <span className="font-bold text-red-600">
                  {stats.rejectedApplications}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 xl:col-span-2">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Pending Requests Quick Review
            </h2>

            {recentPendingApplications.length === 0 ? (
              <p className="text-sm text-slate-500 mt-5">
                No pending bureau requests.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {recentPendingApplications.map((app) => (
                  <div
                    key={app.id}
                    className="border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">
                          {app.business_name || 'Unnamed Bureau'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {app.full_name || 'No name'} • {app.email || 'No email'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {app.city || 'N/A'}
                          {app.province ? `, ${app.province}` : ''}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateApplicationStatus(app.id, 'approved')
                          }
                          disabled={actionLoading === app.id}
                          className="px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateApplicationStatus(app.id, 'rejected')
                          }
                          disabled={actionLoading === app.id}
                          className="px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 xl:col-span-2">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Latest Contact Activity
            </h2>

            {recentLogs.length === 0 ? (
              <p className="text-sm text-slate-500 mt-5">
                No contact view logs yet.
              </p>
            ) : (
              <div className="mt-5 space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-slate-50 text-sm text-slate-600"
                  >
                    <span className="font-semibold text-slate-900">
                      {log.viewer_business_name || log.viewer_email || 'Viewer'}
                    </span>{' '}
                    viewed contact for{' '}
                    <span className="font-semibold text-slate-900">
                      {log.profile_code || 'profile'}
                    </span>{' '}
                    uploaded by{' '}
                    <span className="font-semibold text-slate-900">
                      {log.uploader_business_name || log.uploader_email || 'N/A'}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(log.viewed_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Latest Messages
            </h2>

            {recentMessages.length === 0 ? (
              <p className="text-sm text-slate-500 mt-5">No messages yet.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 rounded-xl bg-slate-50 text-sm"
                  >
                    <p className="font-semibold text-slate-900">
                      {message.full_name || 'No name'}
                    </p>
                    <p className="text-slate-500">{message.email}</p>
                    <span
                      className={`inline-flex mt-2 px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                        message.status
                      )}`}
                    >
                      {message.status || 'new'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bureau Requests */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <SectionHeader
            title="Bureau Requests / Applications"
            count={filteredApplications.length}
            subtitle="Approve, reject, review full request data"
          />

          <div className="divide-y divide-slate-100">
            {filteredApplications.map((app) => {
              const whatsappLink = getWhatsAppLink(app.whatsapp_number);

              return (
                <div key={app.id} className="p-6">
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-2xl font-bold text-slate-900">
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

                      <p className="text-sm text-slate-400 mt-1">
                        Applied: {formatDate(app.created_at)}
                      </p>

                      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-green-700" />
                            <p className="font-bold text-slate-900">
                              Applicant
                            </p>
                          </div>

                          <div className="space-y-2 text-sm text-slate-600">
                            <InfoLine label="Full Name" value={app.full_name} />
                            <InfoLine
                              label="Role"
                              value={app.role_in_bureau}
                            />
                            <InfoLine label="CNIC" value={app.cnic} />
                            <InfoLine label="Email" value={app.email} />
                            <InfoLine
                              label="Mobile"
                              value={app.mobile_number}
                            />
                            <InfoLine
                              label="WhatsApp"
                              value={app.whatsapp_number}
                            />
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {app.email && (
                              <a
                                href={`mailto:${app.email}`}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                <Mail className="w-4 h-4" />
                                Email
                              </a>
                            )}

                            {app.mobile_number && (
                              <a
                                href={`tel:${app.mobile_number}`}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                <Phone className="w-4 h-4" />
                                Call
                              </a>
                            )}

                            {whatsappLink && (
                              <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100"
                              >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Building2 className="w-5 h-5 text-blue-700" />
                            <p className="font-bold text-blue-900">
                              Business Details
                            </p>
                          </div>

                          <div className="space-y-2 text-sm text-blue-900">
                            <InfoLine
                              label="Business Name"
                              value={app.business_name}
                            />
                            <InfoLine
                              label="Years in Business"
                              value={app.years_in_business}
                            />
                            <InfoLine
                              label="Active Profiles"
                              value={app.active_profiles}
                            />
                            <InfoLine
                              label="Physical Office"
                              value={app.has_physical_office}
                            />
                            <InfoLine
                              label="Office Phone"
                              value={app.office_phone}
                            />
                          </div>

                          {app.specializations &&
                            app.specializations.length > 0 && (
                              <div className="mt-4">
                                <p className="font-semibold text-blue-900 text-sm">
                                  Specializations
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {app.specializations.map((item) => (
                                    <span
                                      key={item}
                                      className="px-2 py-1 rounded-full bg-white text-blue-700 text-xs font-semibold"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>

                        <div className="rounded-xl bg-amber-50 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-5 h-5 text-amber-700" />
                            <p className="font-bold text-amber-900">
                              Location / Links
                            </p>
                          </div>

                          <div className="space-y-2 text-sm text-amber-900">
                            <InfoLine label="City" value={app.city} />
                            <InfoLine label="Province" value={app.province} />
                            <InfoLine label="Country" value={app.country} />
                            <InfoLine
                              label="Areas Served"
                              value={app.areas_served}
                            />
                          </div>

                          {app.office_address && (
                            <p className="text-sm text-amber-900 mt-3">
                              <span className="font-semibold">Address:</span>{' '}
                              {app.office_address}
                            </p>
                          )}

                          <div className="mt-4 space-y-2 text-sm">
                            {app.website && (
                              <a
                                href={app.website}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-amber-800 font-semibold hover:underline"
                              >
                                <Globe className="w-4 h-4" />
                                Website
                              </a>
                            )}

                            {app.social_link && (
                              <a
                                href={app.social_link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-amber-800 font-semibold hover:underline"
                              >
                                <Globe className="w-4 h-4" />
                                Social Link
                              </a>
                            )}

                            {app.google_business_link && (
                              <a
                                href={app.google_business_link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-amber-800 font-semibold hover:underline"
                              >
                                <Globe className="w-4 h-4" />
                                Google Business
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-purple-50 p-4 text-sm text-purple-900">
                          <p className="font-bold mb-2">Reference 1</p>
                          <InfoLine
                            label="Name"
                            value={app.reference_name_1}
                          />
                          <InfoLine
                            label="Phone"
                            value={app.reference_phone_1}
                          />
                        </div>

                        <div className="rounded-xl bg-purple-50 p-4 text-sm text-purple-900">
                          <p className="font-bold mb-2">Reference 2</p>
                          <InfoLine
                            label="Name"
                            value={app.reference_name_2}
                          />
                          <InfoLine
                            label="Phone"
                            value={app.reference_phone_2}
                          />
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                          <NotebookPen className="w-4 h-4 text-slate-500" />
                          Admin Notes
                        </label>

                        <textarea
                          value={adminNotesDraft[app.id] || ''}
                          onChange={(e) =>
                            setAdminNotesDraft((prev) => ({
                              ...prev,
                              [app.id]: e.target.value,
                            }))
                          }
                          rows={3}
                          placeholder="Add internal notes about this bureau request..."
                          className="input-field resize-none"
                        />

                        <button
                          type="button"
                          onClick={() => saveAdminNotes(app.id)}
                          disabled={actionLoading === app.id}
                          className="mt-3 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>

                    <div className="xl:w-56 flex xl:flex-col flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateApplicationStatus(app.id, 'approved')
                        }
                        disabled={actionLoading === app.id}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-700 text-white text-sm font-semibold hover:bg-green-800 disabled:opacity-50"
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
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                      >
                        <UserX className="w-4 h-4" />
                        Reject / Deny
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateApplicationStatus(app.id, 'pending')
                        }
                        disabled={actionLoading === app.id}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold hover:bg-amber-100 disabled:opacity-50"
                      >
                        <Clock className="w-4 h-4" />
                        Mark Pending
                      </button>

                      <div className="rounded-xl bg-blue-50 text-blue-900 text-xs p-3 mt-2">
                        After approving, make sure this bureau has a Supabase
                        Auth user with the same email.
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredApplications.length === 0 && (
              <EmptyState text="No bureau requests found." />
            )}
          </div>
        </div>
      )}

      {/* Profiles */}
      {activeTab === 'profiles' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <SectionHeader
            title="Profiles Control"
            count={filteredProfiles.length}
            subtitle="Activate, deactivate, and control photo privacy"
          />

          <div className="divide-y divide-slate-100">
            {filteredProfiles.map((profile) => (
              <div key={profile.id} className="p-6">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-xl font-bold text-slate-900">
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

                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 capitalize">
                        Photo: {profile.photo_visibility || 'public'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      Created: {formatDate(profile.created_at)}
                    </p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                        <p className="font-bold text-slate-900 mb-2">
                          Candidate
                        </p>
                        <InfoLine label="Gender" value={profile.gender} />
                        <InfoLine label="Age" value={profile.age} />
                        <InfoLine
                          label="Marital"
                          value={profile.marital_status}
                        />
                        <InfoLine label="Caste" value={profile.caste} />
                        <InfoLine label="Sect" value={profile.sect} />
                      </div>

                      <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
                        <p className="font-bold mb-2">Education / Work</p>
                        <InfoLine label="Education" value={profile.education} />
                        <InfoLine
                          label="Profession"
                          value={profile.profession}
                        />
                        <InfoLine
                          label="Employment"
                          value={profile.employment_status}
                        />
                      </div>

                      <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                        <p className="font-bold mb-2">Location / Uploader</p>
                        <InfoLine label="City" value={profile.city} />
                        <InfoLine label="Province" value={profile.province} />
                        <InfoLine label="Uploader" value={profile.bureau_email} />
                      </div>
                    </div>
                  </div>

                  <div className="xl:w-64 space-y-2">
                    <button
                      type="button"
                      onClick={() => updateProfileStatus(profile.id, 'active')}
                      disabled={actionLoading === profile.id}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Activate Profile
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateProfileStatus(profile.id, 'inactive')
                      }
                      disabled={actionLoading === profile.id}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 disabled:opacity-50"
                    >
                      <Ban className="w-4 h-4" />
                      Deactivate Profile
                    </button>

                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                        Photo Privacy
                      </p>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateProfilePhotoVisibility(profile.id, 'public')
                          }
                          disabled={actionLoading === profile.id}
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-slate-700 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Public
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateProfilePhotoVisibility(profile.id, 'blurred')
                          }
                          disabled={actionLoading === profile.id}
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold hover:bg-amber-100 disabled:opacity-50"
                        >
                          <Eye className="w-4 h-4" />
                          Blur
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateProfilePhotoVisibility(profile.id, 'hidden')
                          }
                          disabled={actionLoading === profile.id}
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 disabled:opacity-50"
                        >
                          <Lock className="w-4 h-4" />
                          Hide
                        </button>
                      </div>
                    </div>
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
          <SectionHeader
            title="Contact Messages"
            count={filteredMessages.length}
            subtitle="Public contact form messages"
          />

          <div className="divide-y divide-slate-100">
            {filteredMessages.map((message) => (
              <div key={message.id} className="p-6">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-xl font-bold text-slate-900">
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

                    <p className="text-xs text-slate-400 mt-1">
                      Received: {formatDate(message.created_at)}
                    </p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <InfoLine label="Email" value={message.email} />
                        <InfoLine label="Phone" value={message.phone} />
                        <InfoLine label="Bureau" value={message.bureau_name} />
                      </div>

                      <div className="rounded-xl bg-green-50 p-4 text-green-900">
                        <p className="font-bold mb-2">Message</p>
                        <p className="leading-relaxed">
                          {message.message || 'No message'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="xl:w-52 flex xl:flex-col flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateMessageStatus(message.id, 'new')}
                      disabled={actionLoading === message.id}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold hover:bg-amber-100 disabled:opacity-50"
                    >
                      <Mail className="w-4 h-4" />
                      New
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateMessageStatus(message.id, 'reviewed')
                      }
                      disabled={actionLoading === message.id}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Reviewed
                    </button>

                    <button
                      type="button"
                      onClick={() => updateMessageStatus(message.id, 'closed')}
                      disabled={actionLoading === message.id}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 disabled:opacity-50"
                    >
                      <Inbox className="w-4 h-4" />
                      Closed
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredMessages.length === 0 && (
              <EmptyState text="No contact messages found." />
            )}
          </div>
        </div>
      )}

      {/* Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <SectionHeader
            title="Contact View Logs"
            count={filteredLogs.length}
            subtitle="Who viewed whose contact"
          />

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
                    {log.profile_candidate_name && (
                      <p className="text-xs text-green-700 mt-1">
                        {log.profile_candidate_name}
                      </p>
                    )}
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
                  {formatDate(log.viewed_at)}
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
