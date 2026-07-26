'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  HeartHandshake,
  LockKeyhole,
  MapPin,
  MessageCircleMore,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRoundCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type BureauApplication = {
  id?: string | null;
  full_name: string | null;
  business_name: string | null;
  email?: string | null;
  status: string | null;
  city: string | null;
  province: string | null;
  country?: string | null;
  created_at?: string | null;
  cnic?: string | null;
  identity_type?: string | null;
  years_in_business?: string | null;
  bureau_type?: string | null;
  service_model?: string | null;
  client_consent_process?: string | null;
  data_privacy_practice?: string | null;
  reference_name_1?: string | null;
  reference_phone_1?: string | null;
  identity_front_path?: string | null;
  identity_back_path?: string | null;
  business_proof_path?: string | null;
  business_card_path?: string | null;
  office_photo_path?: string | null;
  declarations_accepted_at?: string | null;
};

type RecentProfile = {
  id: string;
  profile_code: string | null;
  candidate_name: string | null;
  gender: string | null;
  age: number | null;
  city: string | null;
  province: string | null;
  profession: string | null;
  photo_visibility: string | null;
  status: string | null;
  created_at: string | null;
};

type ContactLog = {
  id: string;
  viewer_email: string | null;
  viewer_business_name: string | null;
  profile_code: string | null;
  profile_candidate_name: string | null;
  uploader_email: string | null;
  uploader_business_name: string | null;
  viewed_at: string | null;
};

type AssignedProfileSummary = {
  submission_id: string;
  profile_code?: string | null;
  candidate_name?: string | null;
  review_status?: string | null;
  assigned_at?: string | null;
};

type AssignedWork = {
  submission_id: string;
  work_status: string | null;
  last_follow_up_at: string | null;
  next_follow_up_at: string | null;
  updated_at: string | null;
};

type DashboardActivity = {
  id: string;
  type: 'profile' | 'contact-made' | 'contact-received' | 'assignment';
  title: string;
  text: string;
  date: string | null;
  href: string;
};

type PriorityItem = {
  id: string;
  title: string;
  urdu: string;
  text: string;
  href: string;
  cta: string;
  tone: 'green' | 'amber' | 'blue' | 'purple';
  icon: ReactNode;
};

const terminalAssignmentStatuses = new Set([
  'matched',
  'closed',
  'no_suitable_match',
]);

function formatDate(value: string | null | undefined) {
  if (!value) return 'Not available';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Not available';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function formatRelativeDate(value: string | null) {
  if (!value) return 'Recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return formatDate(value);
}

function formatStatus(value: string | null | undefined) {
  if (!value) return 'Pending';

  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function profileStatusClass(status: string | null) {
  if (status === 'active') {
    return 'border-green-200 bg-green-50 text-green-700';
  }

  if (status === 'inactive') {
    return 'border-slate-200 bg-slate-100 text-slate-600';
  }

  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function photoPrivacyLabel(value: string | null) {
  if (value === 'hidden') return 'Photo hidden';
  if (value === 'blurred') return 'Photo blurred';
  return 'Photo visible';
}

function greetingByHour() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function StatCard({
  icon,
  label,
  urdu,
  value,
  note,
  tone,
}: {
  icon: ReactNode;
  label: string;
  urdu: string;
  value: number;
  note: string;
  tone: 'green' | 'blue' | 'purple' | 'amber' | 'slate';
}) {
  const styles = {
    green: {
      icon: 'bg-green-100 text-green-700',
      accent: 'from-green-500 to-emerald-400',
    },
    blue: {
      icon: 'bg-blue-100 text-blue-700',
      accent: 'from-blue-500 to-cyan-400',
    },
    purple: {
      icon: 'bg-purple-100 text-purple-700',
      accent: 'from-purple-500 to-fuchsia-400',
    },
    amber: {
      icon: 'bg-amber-100 text-amber-700',
      accent: 'from-amber-500 to-yellow-400',
    },
    slate: {
      icon: 'bg-slate-100 text-slate-700',
      accent: 'from-slate-500 to-slate-400',
    },
  }[tone];

  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.38)]">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${styles.accent}`}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-600">{label}</p>
          <p className="mt-0.5 text-xs text-slate-400" dir="rtl">
            {urdu}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="text-3xl font-black tracking-tight text-slate-950">
          {value.toLocaleString('en-GB')}
        </p>
        <p className="pb-1 text-right text-xs leading-5 text-slate-500">
          {note}
        </p>
      </div>
    </div>
  );
}

function ActivityIcon({ type }: { type: DashboardActivity['type'] }) {
  const iconMap = {
    profile: {
      wrap: 'bg-green-100 text-green-700',
      icon: <UserPlus className="h-4 w-4" />,
    },
    'contact-made': {
      wrap: 'bg-purple-100 text-purple-700',
      icon: <Eye className="h-4 w-4" />,
    },
    'contact-received': {
      wrap: 'bg-blue-100 text-blue-700',
      icon: <EyeOff className="h-4 w-4" />,
    },
    assignment: {
      wrap: 'bg-amber-100 text-amber-700',
      icon: <HeartHandshake className="h-4 w-4" />,
    },
  }[type];

  return (
    <div
      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${iconMap.wrap}`}
    >
      {iconMap.icon}
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [application, setApplication] = useState<BureauApplication | null>(null);

  const [totalProfiles, setTotalProfiles] = useState(0);
  const [activeProfiles, setActiveProfiles] = useState(0);
  const [networkProfiles, setNetworkProfiles] = useState(0);
  const [contactViewsReceived, setContactViewsReceived] = useState(0);
  const [contactViewsMade, setContactViewsMade] = useState(0);
  const [assignedProfiles, setAssignedProfiles] = useState<AssignedProfileSummary[]>([]);
  const [assignedWork, setAssignedWork] = useState<AssignedWork[]>([]);
  const [recentProfiles, setRecentProfiles] = useState<RecentProfile[]>([]);
  const [recentContactLogs, setRecentContactLogs] = useState<ContactLog[]>([]);

  const loadDashboard = async (manualRefresh = false) => {
    try {
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('Please login again to view your dashboard.');
      }

      const normalisedEmail = user.email.toLowerCase();
      setUserEmail(normalisedEmail);

      const extendedApplicationFields = `
        id,
        full_name,
        business_name,
        email,
        status,
        city,
        province,
        country,
        created_at,
        cnic,
        identity_type,
        years_in_business,
        bureau_type,
        service_model,
        client_consent_process,
        data_privacy_practice,
        reference_name_1,
        reference_phone_1,
        identity_front_path,
        identity_back_path,
        business_proof_path,
        business_card_path,
        office_photo_path,
        declarations_accepted_at
      `;

      let applicationData: BureauApplication | null = null;

      const extendedApplicationResponse = await supabase
        .from('bureau_applications')
        .select(extendedApplicationFields)
        .ilike('email', normalisedEmail)
        .maybeSingle();

      if (!extendedApplicationResponse.error) {
        applicationData =
          (extendedApplicationResponse.data as BureauApplication | null) || null;
      } else {
        const basicApplicationResponse = await supabase
          .from('bureau_applications')
          .select(
            'full_name, business_name, email, status, city, province, country, created_at'
          )
          .ilike('email', normalisedEmail)
          .maybeSingle();

        if (basicApplicationResponse.error) {
          throw basicApplicationResponse.error;
        }

        applicationData =
          (basicApplicationResponse.data as BureauApplication | null) || null;
      }

      setApplication(applicationData);

      const [
        totalProfilesResponse,
        activeProfilesResponse,
        networkProfilesResponse,
        recentProfilesResponse,
        receivedCountResponse,
        madeCountResponse,
      ] = await Promise.all([
        supabase
          .from('marriage_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', user.id),
        supabase
          .from('marriage_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', user.id)
          .eq('status', 'active'),
        supabase
          .from('marriage_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active'),
        supabase
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
            profession,
            photo_visibility,
            status,
            created_at
          `
          )
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('contact_view_logs')
          .select('*', { count: 'exact', head: true })
          .ilike('uploader_email', normalisedEmail)
          .gte('viewed_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase
          .from('contact_view_logs')
          .select('*', { count: 'exact', head: true })
          .ilike('viewer_email', normalisedEmail)
          .gte('viewed_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      ]);

      if (totalProfilesResponse.error) throw totalProfilesResponse.error;
      if (activeProfilesResponse.error) throw activeProfilesResponse.error;
      if (recentProfilesResponse.error) throw recentProfilesResponse.error;

      setTotalProfiles(totalProfilesResponse.count || 0);
      setActiveProfiles(activeProfilesResponse.count || 0);
      setNetworkProfiles(
        networkProfilesResponse.error ? 0 : networkProfilesResponse.count || 0
      );
      setRecentProfiles((recentProfilesResponse.data || []) as RecentProfile[]);
      setContactViewsReceived(
        receivedCountResponse.error ? 0 : receivedCountResponse.count || 0
      );
      setContactViewsMade(madeCountResponse.error ? 0 : madeCountResponse.count || 0);

      const [madeLogsResponse, receivedLogsResponse] = await Promise.all([
        supabase
          .from('contact_view_logs')
          .select(
            `
            id,
            viewer_email,
            viewer_business_name,
            profile_code,
            profile_candidate_name,
            uploader_email,
            uploader_business_name,
            viewed_at
          `
          )
          .ilike('viewer_email', normalisedEmail)
          .order('viewed_at', { ascending: false })
          .limit(4),
        supabase
          .from('contact_view_logs')
          .select(
            `
            id,
            viewer_email,
            viewer_business_name,
            profile_code,
            profile_candidate_name,
            uploader_email,
            uploader_business_name,
            viewed_at
          `
          )
          .ilike('uploader_email', normalisedEmail)
          .order('viewed_at', { ascending: false })
          .limit(4),
      ]);

      setRecentContactLogs([
        ...((madeLogsResponse.error ? [] : madeLogsResponse.data || []) as ContactLog[]),
        ...((receivedLogsResponse.error
          ? []
          : receivedLogsResponse.data || []) as ContactLog[]),
      ]);

      const [assignedProfilesResponse, assignedWorkResponse] = await Promise.all([
        supabase.rpc('get_my_assigned_profiles'),
        supabase.rpc('get_my_assigned_profile_work'),
      ]);

      setAssignedProfiles(
        assignedProfilesResponse.error
          ? []
          : ((assignedProfilesResponse.data || []) as AssignedProfileSummary[])
      );
      setAssignedWork(
        assignedWorkResponse.error
          ? []
          : ((assignedWorkResponse.data || []) as AssignedWork[])
      );
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Dashboard could not be loaded. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const status = application?.status || 'pending';

  const statusPresentation =
    status === 'approved'
      ? {
          label: 'Approved Bureau',
          urdu: 'منظور شدہ میرج بیورو',
          badge: 'border-green-300 bg-green-100 text-green-800',
          icon: <CheckCircle2 className="h-4 w-4" />,
        }
      : status === 'rejected'
        ? {
            label: 'Application Requires Attention',
            urdu: 'درخواست پر مزید توجہ درکار ہے',
            badge: 'border-red-300 bg-red-100 text-red-800',
            icon: <XCircle className="h-4 w-4" />,
          }
        : {
            label: 'Application Under Review',
            urdu: 'درخواست زیرِ جائزہ ہے',
            badge: 'border-amber-300 bg-amber-100 text-amber-800',
            icon: <Clock3 className="h-4 w-4" />,
          };

  const verificationChecks = useMemo(
    () => [
      {
        label: 'Application submitted',
        urdu: 'درخواست جمع ہو چکی ہے',
        complete: Boolean(application),
      },
      {
        label: 'Identity evidence received',
        urdu: 'شناختی دستاویزات موصول',
        complete: Boolean(
          application?.cnic &&
            application?.identity_front_path &&
            application?.identity_back_path
        ),
      },
      {
        label: 'Bureau information completed',
        urdu: 'بیورو کی معلومات مکمل',
        complete: Boolean(
          application?.business_name &&
            application?.years_in_business &&
            (application?.bureau_type || application?.service_model)
        ),
      },
      {
        label: 'Privacy and consent practice declared',
        urdu: 'پرائیویسی اور رضامندی کا طریقہ درج',
        complete: Boolean(
          application?.client_consent_process &&
            application?.data_privacy_practice &&
            application?.declarations_accepted_at
        ),
      },
      {
        label: 'Professional reference provided',
        urdu: 'پیشہ ورانہ حوالہ فراہم کیا گیا',
        complete: Boolean(
          application?.reference_name_1 && application?.reference_phone_1
        ),
      },
      {
        label: 'Administrative approval completed',
        urdu: 'انتظامی منظوری مکمل',
        complete: status === 'approved',
      },
    ],
    [application, status]
  );

  const verificationCompleted = verificationChecks.filter(
    (item) => item.complete
  ).length;
  const verificationProgress = Math.round(
    (verificationCompleted / verificationChecks.length) * 100
  );

  const assignedWorkMap = useMemo(
    () => new Map(assignedWork.map((item) => [item.submission_id, item])),
    [assignedWork]
  );

  const openAssignedProfiles = useMemo(
    () =>
      assignedProfiles.filter((profile) => {
        const workStatus =
          assignedWorkMap.get(profile.submission_id)?.work_status ||
          profile.review_status ||
          'assigned';

        return !terminalAssignmentStatuses.has(workStatus);
      }).length,
    [assignedProfiles, assignedWorkMap]
  );

  const dueFollowUps = useMemo(() => {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return assignedWork.filter((work) => {
      if (!work.next_follow_up_at) return false;
      if (terminalAssignmentStatuses.has(work.work_status || '')) return false;

      const followUpDate = new Date(work.next_follow_up_at);
      return !Number.isNaN(followUpDate.getTime()) && followUpDate <= endOfToday;
    }).length;
  }, [assignedWork]);

  const inactiveProfiles = Math.max(totalProfiles - activeProfiles, 0);

  const priorities = useMemo<PriorityItem[]>(() => {
    const items: PriorityItem[] = [];

    if (dueFollowUps > 0) {
      items.push({
        id: 'follow-ups',
        title: `${dueFollowUps} follow-up${dueFollowUps === 1 ? '' : 's'} due`,
        urdu: `${dueFollowUps} فالو اَپ آج توجہ چاہتے ہیں`,
        text: 'Open assigned profiles and record the latest family communication.',
        href: '/assigned-profiles',
        cta: 'Open follow-ups',
        tone: 'amber',
        icon: <MessageCircleMore className="h-5 w-5" />,
      });
    }

    if (openAssignedProfiles > 0) {
      items.push({
        id: 'assigned',
        title: `${openAssignedProfiles} active assigned case${openAssignedProfiles === 1 ? '' : 's'}`,
        urdu: `${openAssignedProfiles} زیرِ عمل تفویض شدہ کیس`,
        text: 'Review case status, private notes and the next agreed action.',
        href: '/assigned-profiles',
        cta: 'Review cases',
        tone: 'purple',
        icon: <HeartHandshake className="h-5 w-5" />,
      });
    }

    if (totalProfiles === 0) {
      items.push({
        id: 'first-profile',
        title: 'Create your first structured profile',
        urdu: 'اپنی پہلی مکمل پروفائل بنائیں',
        text: 'Use the guided questionnaire to add a serious bride or groom profile.',
        href: '/profiles/new',
        cta: 'Add first profile',
        tone: 'green',
        icon: <UserPlus className="h-5 w-5" />,
      });
    } else if (inactiveProfiles > 0) {
      items.push({
        id: 'inactive',
        title: `${inactiveProfiles} profile${inactiveProfiles === 1 ? '' : 's'} not active`,
        urdu: `${inactiveProfiles} پروفائل فی الحال فعال نہیں`,
        text: 'Review inactive records and reactivate only those still available for matching.',
        href: '/profiles',
        cta: 'Review profiles',
        tone: 'blue',
        icon: <FileText className="h-5 w-5" />,
      });
    }

    if (verificationProgress < 100) {
      items.push({
        id: 'verification',
        title: `Verification is ${verificationProgress}% complete`,
        urdu: `بیورو ویریفکیشن ${verificationProgress} فیصد مکمل ہے`,
        text:
          status === 'pending'
            ? 'Your application remains under review. Keep your account details current.'
            : 'Some verification evidence is not yet recorded on this account.',
        href: '/settings',
        cta: 'Review account',
        tone: 'blue',
        icon: <ShieldCheck className="h-5 w-5" />,
      });
    }

    return items.slice(0, 4);
  }, [dueFollowUps, openAssignedProfiles, totalProfiles, inactiveProfiles, verificationProgress, status]);

  const activities = useMemo<DashboardActivity[]>(() => {
    const profileActivities: DashboardActivity[] = recentProfiles.map((profile) => ({
      id: `profile-${profile.id}`,
      type: 'profile',
      title: 'Profile added',
      text: `${profile.profile_code || 'New profile'} · ${profile.candidate_name || 'Candidate'}`,
      date: profile.created_at,
      href: `/profiles/${profile.id}`,
    }));

    const contactActivities: DashboardActivity[] = recentContactLogs.map((log) => {
      const madeByCurrentUser =
        (log.viewer_email || '').toLowerCase() === userEmail.toLowerCase();

      return {
        id: `${madeByCurrentUser ? 'made' : 'received'}-${log.id}`,
        type: madeByCurrentUser ? 'contact-made' : 'contact-received',
        title: madeByCurrentUser ? 'Contact viewed' : 'Your profile contact was viewed',
        text: madeByCurrentUser
          ? `${log.profile_code || 'Profile'} · ${log.profile_candidate_name || 'Candidate'}`
          : `${log.viewer_business_name || 'A network bureau'} viewed ${log.profile_code || 'a profile'}`,
        date: log.viewed_at,
        href: madeByCurrentUser ? '/search' : '/profiles',
      };
    });

    const workActivities: DashboardActivity[] = [...assignedWork]
      .filter((work) => work.updated_at)
      .sort(
        (a, b) =>
          new Date(b.updated_at || 0).getTime() -
          new Date(a.updated_at || 0).getTime()
      )
      .slice(0, 3)
      .map((work) => ({
        id: `work-${work.submission_id}-${work.updated_at}`,
        type: 'assignment',
        title: 'Assigned case updated',
        text: `${formatStatus(work.work_status)}${
          work.next_follow_up_at
            ? ` · Next follow-up ${formatDate(work.next_follow_up_at)}`
            : ''
        }`,
        date: work.updated_at,
        href: '/assigned-profiles',
      }));

    return [...profileActivities, ...contactActivities, ...workActivities]
      .sort(
        (a, b) =>
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      )
      .slice(0, 6);
  }, [recentProfiles, recentContactLogs, assignedWork, userEmail]);

  const quickActions = [
    {
      href: '/profiles/new',
      icon: <Plus className="h-5 w-5" />,
      title: 'Add New Profile',
      urdu: 'نئی پروفائل شامل کریں',
      text: 'Create a detailed bride or groom profile through the guided form.',
      tone: 'bg-green-700 text-white shadow-green-900/15',
      iconTone: 'bg-white/15 text-white',
    },
    {
      href: '/search',
      icon: <Search className="h-5 w-5" />,
      title: 'Search Network',
      urdu: 'نیٹ ورک میں تلاش کریں',
      text: 'Explore active profiles using structured filters and requirements.',
      tone: 'bg-white text-slate-900 border border-slate-200',
      iconTone: 'bg-blue-100 text-blue-700',
    },
    {
      href: '/profiles',
      icon: <Users className="h-5 w-5" />,
      title: 'My Profiles',
      urdu: 'میری پروفائلز',
      text: 'Review, update and manage the profiles created by your bureau.',
      tone: 'bg-white text-slate-900 border border-slate-200',
      iconTone: 'bg-purple-100 text-purple-700',
    },
    {
      href: '/assigned-profiles',
      icon: <HeartHandshake className="h-5 w-5" />,
      title: 'Assigned Cases',
      urdu: 'تفویض شدہ کیسز',
      text: 'Manage public submissions assigned to your bureau and record progress.',
      tone: 'bg-white text-slate-900 border border-slate-200',
      iconTone: 'bg-amber-100 text-amber-700',
    },
    {
      href: '/assigned-profiles',
      icon: <MessageCircleMore className="h-5 w-5" />,
      title: 'Follow-up Desk',
      urdu: 'فالو اَپ ڈیسک',
      text: 'See due actions, notes and the next communication date for each case.',
      tone: 'bg-white text-slate-900 border border-slate-200',
      iconTone: 'bg-rose-100 text-rose-700',
    },
    {
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      title: 'Account Settings',
      urdu: 'اکاؤنٹ کی ترتیبات',
      text: 'Keep your bureau, contact and office information accurate.',
      tone: 'bg-white text-slate-900 border border-slate-200',
      iconTone: 'bg-slate-100 text-slate-700',
    },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="h-72 animate-pulse rounded-[32px] bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.55fr_0.9fr]">
          <div className="h-[520px] animate-pulse rounded-[28px] bg-slate-200" />
          <div className="h-[520px] animate-pulse rounded-[28px] bg-slate-200" />
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <div className="overflow-hidden rounded-[28px] border border-red-200 bg-white shadow-xl shadow-red-900/5">
          <div className="bg-gradient-to-r from-red-700 to-rose-600 px-7 py-6 text-white">
            <AlertCircle className="h-8 w-8" />
            <h1 className="mt-4 font-heading text-2xl font-bold">Dashboard could not load</h1>
            <p className="mt-1 text-sm text-red-100" dir="rtl">
              ڈیش بورڈ لوڈ نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔
            </p>
          </div>

          <div className="p-7">
            <p className="leading-7 text-slate-600">{errorMessage}</p>
            <button
              type="button"
              onClick={() => loadDashboard(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
            >
              <RefreshCcw className="h-4 w-4" />
              Reload Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page mx-auto max-w-[1500px] space-y-6 pb-8">
      <section className="dashboard-enter relative isolate overflow-hidden rounded-[32px] bg-gradient-to-br from-green-950 via-green-900 to-green-700 px-6 py-7 text-white shadow-[0_30px_80px_-35px_rgba(9,42,27,0.75)] md:px-9 md:py-9">
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10 bg-white/5 blur-sm" />
        <div className="pointer-events-none absolute -bottom-32 left-[38%] h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 grid items-center gap-8 xl:grid-cols-[1.35fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold tracking-wide text-green-50 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-gold-300" />
                Bureau Control Centre
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold ${statusPresentation.badge}`}
              >
                {statusPresentation.icon}
                {statusPresentation.label}
              </span>
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-green-200">
              {greetingByHour()}
            </p>
            <h1 className="mt-2 max-w-4xl font-heading text-3xl font-bold leading-tight sm:text-4xl xl:text-[46px]">
              Welcome back, {application?.full_name || 'Bureau Partner'}
            </h1>
            <p className="mt-2 text-lg font-semibold text-green-100">
              {application?.business_name || 'Marriage Bureau'}
              {application?.city ? ` · ${application.city}` : ''}
              {application?.province ? `, ${application.province}` : ''}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-green-100/85" dir="rtl">
              اپنی پروفائلز، تفویض شدہ کیسز، تلاش اور فالو اَپس کو ایک منظم اور محفوظ جگہ سے سنبھالیں۔
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/profiles/new"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-green-900 shadow-xl shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-green-50"
              >
                <UserPlus className="h-5 w-5" />
                Add New Profile
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/search"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-black text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                <Search className="h-5 w-5" />
                Search Network
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="rounded-[26px] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-200">
                  Today at a glance
                </p>
                <p className="mt-1 text-lg font-bold text-white" dir="rtl">
                  آج کی مختصر صورتحال
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-gold-300">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-green-950/25 p-4">
                <p className="text-2xl font-black">{openAssignedProfiles}</p>
                <p className="mt-1 text-xs leading-5 text-green-100">Open assigned cases</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-green-950/25 p-4">
                <p className="text-2xl font-black">{dueFollowUps}</p>
                <p className="mt-1 text-xs leading-5 text-green-100">Follow-ups due</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-green-950/25 p-4">
                <p className="text-2xl font-black">{activeProfiles}</p>
                <p className="mt-1 text-xs leading-5 text-green-100">Your active profiles</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-green-950/25 p-4">
                <p className="text-2xl font-black">{verificationProgress}%</p>
                <p className="mt-1 text-xs leading-5 text-green-100">Verification recorded</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-green-100/80">
              <span>{formatDate(new Date().toISOString())}</span>
              <button
                type="button"
                onClick={() => loadDashboard(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 font-bold text-white transition hover:bg-white/10 disabled:opacity-60"
              >
                <RefreshCcw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-enter dashboard-delay-1 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Total Profiles"
          urdu="کل پروفائلز"
          value={totalProfiles}
          note={`${activeProfiles} currently active`}
          tone="green"
        />
        <StatCard
          icon={<UserRoundCheck className="h-5 w-5" />}
          label="Assigned Cases"
          urdu="تفویض شدہ کیسز"
          value={openAssignedProfiles}
          note={`${dueFollowUps} follow-ups due`}
          tone="purple"
        />
        <StatCard
          icon={<EyeOff className="h-5 w-5" />}
          label="Views Received"
          urdu="موصول شدہ کانٹیکٹ ویوز"
          value={contactViewsReceived}
          note="Your profiles · this month"
          tone="blue"
        />
        <StatCard
          icon={<Eye className="h-5 w-5" />}
          label="Views Made"
          urdu="دیکھے گئے رابطے"
          value={contactViewsMade}
          note="Network contacts · this month"
          tone="amber"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Network Profiles"
          urdu="نیٹ ورک پروفائلز"
          value={networkProfiles}
          note="Active and searchable"
          tone="slate"
        />
      </section>

      <section className="dashboard-enter dashboard-delay-2 grid gap-6 xl:grid-cols-[1.5fr_0.88fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_22px_65px_-38px_rgba(15,23,42,0.42)]">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-700" />
                  <h2 className="font-heading text-xl font-bold text-slate-950">
                    Today’s Priorities
                  </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500" dir="rtl">
                  وہ کام جو آج آپ کی توجہ چاہتے ہیں
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                {priorities.length} action{priorities.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {priorities.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {priorities.map((priority) => {
                    const tone = {
                      green: {
                        wrap: 'border-green-200 bg-green-50/70',
                        icon: 'bg-green-100 text-green-700',
                        link: 'text-green-800',
                      },
                      amber: {
                        wrap: 'border-amber-200 bg-amber-50/75',
                        icon: 'bg-amber-100 text-amber-700',
                        link: 'text-amber-800',
                      },
                      blue: {
                        wrap: 'border-blue-200 bg-blue-50/65',
                        icon: 'bg-blue-100 text-blue-700',
                        link: 'text-blue-800',
                      },
                      purple: {
                        wrap: 'border-purple-200 bg-purple-50/65',
                        icon: 'bg-purple-100 text-purple-700',
                        link: 'text-purple-800',
                      },
                    }[priority.tone];

                    return (
                      <Link
                        key={priority.id}
                        href={priority.href}
                        className={`group rounded-2xl border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${tone.wrap}`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${tone.icon}`}
                          >
                            {priority.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold leading-6 text-slate-900">
                              {priority.title}
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-slate-500" dir="rtl">
                              {priority.urdu}
                            </p>
                          </div>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {priority.text}
                        </p>
                        <span
                          className={`mt-4 inline-flex items-center gap-1.5 text-xs font-black ${tone.link}`}
                        >
                          {priority.cta}
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    Everything is organised
                  </h3>
                  <p className="mt-1 text-sm text-slate-500" dir="rtl">
                    آج کے تمام ضروری کام مکمل یا منظم ہیں۔
                  </p>
                  <Link
                    href="/search"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-800"
                  >
                    Search Network
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_22px_65px_-38px_rgba(15,23,42,0.42)]">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-700" />
                  <h2 className="font-heading text-xl font-bold text-slate-950">
                    Recently Added Profiles
                  </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500" dir="rtl">
                  آپ کے بیورو کی حالیہ پروفائلز
                </p>
              </div>

              <Link
                href="/profiles"
                className="hidden items-center gap-1.5 text-sm font-bold text-green-700 transition hover:text-green-800 sm:inline-flex"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {recentProfiles.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentProfiles.map((profile) => {
                  const initials = (profile.candidate_name || 'MB')
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word.charAt(0))
                    .join('')
                    .toUpperCase();

                  return (
                    <Link
                      key={profile.id}
                      href={`/profiles/${profile.id}`}
                      className="group flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50/80 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-700 to-green-500 text-sm font-black text-white shadow-md shadow-green-900/10">
                          {initials || 'MB'}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-bold text-slate-900">
                              {profile.candidate_name || 'Unnamed Candidate'}
                            </p>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${profileStatusClass(profile.status)}`}
                            >
                              {formatStatus(profile.status)}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-sm text-slate-500">
                            {profile.profile_code || 'Profile code pending'}
                            {profile.age ? ` · ${profile.age} years` : ''}
                            {profile.gender ? ` · ${profile.gender}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pl-16 sm:flex sm:items-center sm:gap-5 sm:pl-0">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Location
                          </p>
                          <p className="mt-0.5 truncate text-xs font-semibold text-slate-600">
                            {profile.city || profile.province || 'Not added'}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Privacy
                          </p>
                          <p className="mt-0.5 truncate text-xs font-semibold text-slate-600">
                            {photoPrivacyLabel(profile.photo_visibility)}
                          </p>
                        </div>
                        <ChevronRight className="hidden h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-green-700 sm:block" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                  <UserPlus className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No profiles added yet
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Start with the guided profile questionnaire and build a structured, searchable record.
                </p>
                <Link
                  href="/profiles/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-800"
                >
                  Add First Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_22px_65px_-38px_rgba(15,23,42,0.42)]">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-700" />
                <h2 className="font-heading text-xl font-bold text-slate-950">
                  Bureau Verification
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500" dir="rtl">
                بیورو کی تصدیق اور اعتماد کی صورتحال
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-5">
                <div
                  className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#166e46 ${verificationProgress * 3.6}deg, #e2e8f0 0deg)`,
                  }}
                >
                  <div className="flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
                    <span className="text-2xl font-black text-slate-950">
                      {verificationProgress}%
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      recorded
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${statusPresentation.badge}`}
                  >
                    {statusPresentation.icon}
                    {statusPresentation.label}
                  </span>
                  <p className="mt-2 text-xs leading-5 text-slate-500" dir="rtl">
                    {statusPresentation.urdu}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {verificationChecks.map((check) => (
                  <div key={check.label} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                        check.complete
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {check.complete ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <CircleDashed className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          check.complete ? 'text-slate-800' : 'text-slate-500'
                        }`}
                      >
                        {check.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400" dir="rtl">
                        {check.urdu}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/settings"
                className="mt-6 flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800 transition hover:bg-green-100"
              >
                Review account information
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_22px_65px_-38px_rgba(15,23,42,0.42)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-700" />
                  <h2 className="font-heading text-xl font-bold text-slate-950">
                    Recent Activity
                  </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500" dir="rtl">
                  اکاؤنٹ کی تازہ سرگرمیاں
                </p>
              </div>
            </div>

            <div className="p-5">
              {activities.length > 0 ? (
                <div className="space-y-1">
                  {activities.map((activity, index) => (
                    <Link
                      key={activity.id}
                      href={activity.href}
                      className="group relative flex gap-3 rounded-2xl px-2 py-3 transition hover:bg-slate-50"
                    >
                      {index < activities.length - 1 && (
                        <span className="absolute bottom-[-6px] left-[27px] top-12 w-px bg-slate-200" />
                      )}
                      <ActivityIcon type={activity.type} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-bold text-slate-800">
                            {activity.title}
                          </p>
                          <span className="flex-shrink-0 text-[10px] font-semibold text-slate-400">
                            {formatRelativeDate(activity.date)}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs leading-5 text-slate-500">
                          {activity.text}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <Activity className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-slate-800">
                    Activity will appear here
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    New profiles, contact views and case updates will create a timeline.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-enter dashboard-delay-3 overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.5)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="h-5 w-5 text-green-700" />
              <h2 className="font-heading text-2xl font-bold text-slate-950">
                Your MBN Workspace
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Move quickly between the daily tools used by a professional marriage bureau.
            </p>
            <p className="mt-1 text-xs text-slate-400" dir="rtl">
              پیشہ ور میرج بیورو کے روزمرہ کاموں کے لیے تمام ضروری ٹولز ایک جگہ۔
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-800">
            <LockKeyhole className="h-3.5 w-3.5" />
            Secure bureau workspace
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:p-6">
          {quickActions.map((action) => (
            <Link
              key={`${action.href}-${action.title}`}
              href={action.href}
              className={`group flex min-h-[168px] flex-col rounded-3xl p-5 shadow-lg shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${action.tone}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${action.iconTone}`}
                >
                  {action.icon}
                </div>
                <ArrowRight className="h-4 w-4 opacity-50 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </div>

              <div className="mt-auto pt-5">
                <h3 className="font-bold">{action.title}</h3>
                <p
                  className={`mt-0.5 text-xs ${
                    action.title === 'Add New Profile'
                      ? 'text-green-100'
                      : 'text-slate-400'
                  }`}
                  dir="rtl"
                >
                  {action.urdu}
                </p>
                <p
                  className={`mt-2 text-xs leading-5 ${
                    action.title === 'Add New Profile'
                      ? 'text-green-50/80'
                      : 'text-slate-500'
                  }`}
                >
                  {action.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-enter dashboard-delay-4 grid gap-5 md:grid-cols-2">
        <div className="rounded-[26px] border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl shadow-slate-950/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200">
                <BadgeCheck className="h-4 w-4 text-gold-300" />
                Bureau Account
              </div>
              <h2 className="mt-4 font-heading text-2xl font-bold">
                {application?.business_name || 'Marriage Bureau'}
              </h2>
              <p className="mt-1 text-sm text-slate-300" dir="rtl">
                آپ کے بیورو اکاؤنٹ کی بنیادی معلومات
              </p>
            </div>
            <Building2 className="h-9 w-9 text-slate-500" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Registered Email
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-100">
                {userEmail || 'Not available'}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Member Since
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                {formatDate(application?.created_at)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Location
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                {[application?.city, application?.province, application?.country]
                  .filter(Boolean)
                  .join(', ') || 'Not available'}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Account Status
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                {formatStatus(status)}
              </p>
            </div>
          </div>

          <Link
            href="/settings"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold-300 transition hover:text-gold-200"
          >
            Update account details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-[26px] border border-green-200 bg-gradient-to-br from-green-50 via-white to-gold-50 p-6 shadow-xl shadow-green-900/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-bold text-green-800">
                <ShieldCheck className="h-4 w-4" />
                Professional Standard
              </div>
              <h2 className="mt-4 font-heading text-2xl font-bold text-slate-950">
                Privacy is part of the workflow
              </h2>
              <p className="mt-1 text-sm text-slate-500" dir="rtl">
                پرائیویسی صرف وعدہ نہیں، ہر پروفائل کے کام کا لازمی حصہ ہے۔
              </p>
            </div>
            <LockKeyhole className="h-9 w-9 text-green-300" />
          </div>

          <div className="mt-5 space-y-3">
            {[
              'Keep private notes separate from profile information.',
              'View contact details only for a genuine matrimonial purpose.',
              'Record consent-aware follow-ups instead of untracked sharing.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-slate-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-700" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/how-it-works"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-800 transition hover:text-green-900"
          >
            Review the MBN workflow
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <style jsx>{`
        .dashboard-enter {
          animation: dashboardEnter 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .dashboard-delay-1 {
          animation-delay: 70ms;
        }

        .dashboard-delay-2 {
          animation-delay: 130ms;
        }

        .dashboard-delay-3 {
          animation-delay: 190ms;
        }

        .dashboard-delay-4 {
          animation-delay: 250ms;
        }

        @keyframes dashboardEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dashboard-enter {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
