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
  HeartHandshake,
  UserRoundSearch,
  Send,
  ClipboardList,
  Copy,
  TriangleAlert,
  Flag,
  CreditCard,
  Download,
  Trash2,
  PlusCircle,
  TrendingUp,
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


type PublicSubmission = {
  id: string;

  submission_reference: string | null;

  source_type: string | null;

  submitter_full_name: string | null;
  submitter_email: string | null;
  submitter_mobile: string | null;
  submitter_whatsapp: string | null;
  relationship_to_candidate: string | null;

  candidate_name: string | null;
  gender: string | null;
  age: number | null;
  date_of_birth: string | null;
  marital_status: string | null;
  height: string | null;

  religion: string | null;
  sect: string | null;
  caste: string | null;

  city: string | null;
  province: string | null;
  country: string | null;
  nationality: string | null;
  residence_status: string | null;

  education: string | null;
  profession: string | null;
  employment_status: string | null;
  job_type: string | null;
  income_range: string | null;

  complexion: string | null;
  body_type: string | null;
  languages: string | null;

  siblings: string | null;
  father_occupation: string | null;
  mother_occupation: string | null;
  family_details: string | null;

  expected_partner_age: string | null;
  expected_partner_location: string | null;
  expected_partner_education: string | null;
  requirements: string | null;

  additional_notes: string | null;

  photo_url: string | null;
  photo_visibility: string | null;

  consent_to_store: boolean | null;
  consent_to_share: boolean | null;

  review_status: string | null;

  admin_private_notes: string | null;

  assigned_bureau_email: string | null;
  assigned_matchmaker_name: string | null;
  assigned_at: string | null;
  assigned_by_email: string | null;

  converted_to_profile: boolean | null;
  converted_profile_id: string | null;
  converted_at: string | null;

  possible_duplicate: boolean | null;
  duplicate_match_count: number | null;
  duplicate_checked_at: string | null;
  duplicate_review_status: string | null;
  duplicate_review_updated_at: string | null;

  submitted_at: string | null;
  updated_at: string | null;
};


type DuplicateMatch = {
  id: string;
  submission_id: string;
  matched_submission_id: string;
  match_score: number;
  match_reasons: string[] | null;
  review_decision: string | null;
  review_notes: string | null;
  reviewed_by_email: string | null;
  reviewed_at: string | null;
  created_at: string | null;
};


type AssignedProfileWork = {
  id: string;
  submission_id: string;
  bureau_email: string;
  work_status: string | null;
  bureau_private_notes: string | null;
  last_follow_up_at: string | null;
  next_follow_up_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};


type AssignedProfileFollowUp = {
  id: string;
  submission_id: string;
  bureau_email: string;
  note: string;
  status_at_time: string | null;
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


type BureauControl = {
  id: string | null;
  bureau_email: string;
  business_name: string | null;
  is_flagged: boolean | null;
  warning_note: string | null;
  contact_reveal_suspended: boolean | null;
  daily_contact_view_limit: number | null;
  updated_at: string | null;
};


type PremiumOrder = {
  id: string;
  profile_reference: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  user_type: string | null;
  bureau_email: string | null;
  plan_type: string | null;
  amount_pkr: number | null;
  payment_method: string | null;
  payment_status: string | null;
  payment_screenshot_url: string | null;
  transaction_id: string | null;
  start_date: string | null;
  expiry_date: string | null;
  admin_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};


type Stats = {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;

  totalProfiles: number;
  activeProfiles: number;
  inactiveProfiles: number;

  publicSubmissions: number;
  newPublicSubmissions: number;
  assignedPublicSubmissions: number;

  contactMessages: number;
  newMessages: number;

  contactViews: number;
};


type TabKey =
  | 'overview'
  | 'applications'
  | 'public-submissions'
  | 'profiles'
  | 'bureau-control'
  | 'premium-payments'
  | 'reports'
  | 'messages'
  | 'logs';


const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'applications', label: 'Bureau Requests' },
  { key: 'public-submissions', label: 'Public Submissions' },
  { key: 'profiles', label: 'Profiles Control' },
  { key: 'bureau-control', label: 'Bureau Control' },
  { key: 'premium-payments', label: 'Premium Payments' },
  { key: 'reports', label: 'Reports & Export' },
  { key: 'messages', label: 'Contact Messages' },
  { key: 'logs', label: 'Contact View Logs' },
];


const publicSubmissionStatuses = [
  'new',
  'under_review',
  'need_more_information',
  'approved_for_matching',
  'assigned',
  'matching_active',
  'potential_match_found',
  'in_discussion',
  'matched',
  'closed',
  'rejected',
];

const duplicateReviewDecisions = [
  {
    value: 'unreviewed',
    label: 'Needs Review',
  },
  {
    value: 'confirmed_duplicate',
    label: 'Confirmed Duplicate',
  },
  {
    value: 'not_duplicate',
    label: 'Not a Duplicate',
  },
  {
    value: 'related_family_member',
    label: 'Related Family Member',
  },
  {
    value: 'keep_both',
    label: 'Keep Both Records',
  },
  {
    value: 'needs_more_review',
    label: 'Needs More Review',
  },
];




function formatDate(value: string | null) {
  if (!value) return 'N/A';

  return new Date(value).toLocaleString();
}


function statusClass(status: string | null) {
  if (
    status === 'approved' ||
    status === 'active' ||
    status === 'closed' ||
    status === 'matched' ||
    status === 'approved_for_matching'
  ) {
    return 'bg-green-100 text-green-700';
  }

  if (
    status === 'rejected' ||
    status === 'inactive' ||
    status === 'no_suitable_match'
  ) {
    return 'bg-red-100 text-red-700';
  }

  if (
    status === 'reviewed' ||
    status === 'under_review' ||
    status === 'matching_active' ||
    status === 'in_discussion'
  ) {
    return 'bg-blue-100 text-blue-700';
  }

  if (
    status === 'assigned' ||
    status === 'potential_match_found'
  ) {
    return 'bg-purple-100 text-purple-700';
  }

  return 'bg-amber-100 text-amber-700';
}


function formatStatus(value: string | null) {
  if (!value) return 'New';

  return value
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(' ');
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
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-3">
            {value}
          </p>

          <p className="text-sm text-slate-500 mt-2">
            {subtitle}
          </p>
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
        {count} record(s)
        {subtitle ? ` • ${subtitle}` : ''}
      </p>
    </div>
  );
}


function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-slate-400" />
      </div>

      <p className="font-semibold text-slate-900">
        {text}
      </p>
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
      <span className="font-semibold text-slate-900">
        {label}:
      </span>{' '}

      <span>{value}</span>
    </p>
  );
}


export default function SuperAdminPage() {
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  const [currentEmail, setCurrentEmail] =
    useState('');

  const [activeTab, setActiveTab] =
    useState<TabKey>('overview');

  const [searchTerm, setSearchTerm] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  const [actionLoading, setActionLoading] =
    useState('');


  const [conversionResult, setConversionResult] =
    useState<
      Record<
        string,
        {
          profileCode: string | null;
          profileId: string | null;
        }
      >
    >({});


  const [stats, setStats] =
    useState<Stats>({
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,

      totalProfiles: 0,
      activeProfiles: 0,
      inactiveProfiles: 0,

      publicSubmissions: 0,
      newPublicSubmissions: 0,
      assignedPublicSubmissions: 0,

      contactMessages: 0,
      newMessages: 0,

      contactViews: 0,
    });


  const [applications, setApplications] =
    useState<BureauApplication[]>([]);

  const [profiles, setProfiles] =
    useState<MarriageProfile[]>([]);

  const [publicSubmissions, setPublicSubmissions] =
    useState<PublicSubmission[]>([]);

  const [messages, setMessages] =
    useState<ContactMessage[]>([]);

  const [logs, setLogs] =
    useState<ContactLog[]>([]);


  const [
    duplicateMatches,
    setDuplicateMatches,
  ] =
    useState<DuplicateMatch[]>([]);


  const [
    duplicateDecisionDraft,
    setDuplicateDecisionDraft,
  ] =
    useState<Record<string, string>>({});


  const [
    duplicateReviewNotesDraft,
    setDuplicateReviewNotesDraft,
  ] =
    useState<Record<string, string>>({});


  const [
    assignedProfileWork,
    setAssignedProfileWork,
  ] =
    useState<AssignedProfileWork[]>([]);


  const [
    assignedProfileFollowUps,
    setAssignedProfileFollowUps,
  ] =
    useState<AssignedProfileFollowUp[]>([]);


  const [
    bureauControls,
    setBureauControls,
  ] =
    useState<BureauControl[]>([]);


  const [
    premiumOrders,
    setPremiumOrders,
  ] =
    useState<PremiumOrder[]>([]);


  const [
    bureauWarningDraft,
    setBureauWarningDraft,
  ] =
    useState<Record<string, string>>({});


  const [
    bureauLimitDraft,
    setBureauLimitDraft,
  ] =
    useState<Record<string, string>>({});


  const [adminNotesDraft, setAdminNotesDraft] =
    useState<Record<string, string>>({});


  const [
    publicAdminNotesDraft,
    setPublicAdminNotesDraft,
  ] =
    useState<Record<string, string>>({});


  const [
    bureauAssignmentDraft,
    setBureauAssignmentDraft,
  ] =
    useState<Record<string, string>>({});


  const [
    matchmakerAssignmentDraft,
    setMatchmakerAssignmentDraft,
  ] =
    useState<Record<string, string>>({});


  const checkAdmin = async (
    email: string
  ) => {
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
      .select('*', {
        count: 'exact',
        head: true,
      });

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


      if (
        userError ||
        !user ||
        !user.email
      ) {
        throw new Error(
          'Please login again to access admin console.'
        );
      }


      setCurrentEmail(user.email);


      const adminStatus =
        await checkAdmin(user.email);

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

        publicSubmissionCount,
        newPublicSubmissionCount,
        assignedPublicSubmissionCount,

        contactMessages,
        newMessages,

        contactViews,
      ] = await Promise.all([
        getCount('bureau_applications'),

        getCount(
          'bureau_applications',
          'status',
          'pending'
        ),

        getCount(
          'bureau_applications',
          'status',
          'approved'
        ),

        getCount(
          'bureau_applications',
          'status',
          'rejected'
        ),

        getCount('marriage_profiles'),

        getCount(
          'marriage_profiles',
          'status',
          'active'
        ),

        getCount(
          'marriage_profiles',
          'status',
          'inactive'
        ),

        getCount(
          'public_profile_submissions'
        ),

        getCount(
          'public_profile_submissions',
          'review_status',
          'new'
        ),

        getCount(
          'public_profile_submissions',
          'review_status',
          'assigned'
        ),

        getCount('contact_messages'),

        getCount(
          'contact_messages',
          'status',
          'new'
        ),

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

        publicSubmissions:
          publicSubmissionCount,

        newPublicSubmissions:
          newPublicSubmissionCount,

        assignedPublicSubmissions:
          assignedPublicSubmissionCount,

        contactMessages,
        newMessages,

        contactViews,
      });


      const {
        data: applicationData,
        error: applicationError,
      } = await supabase
        .from('bureau_applications')
        .select(`
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
        `)
        .order(
          'created_at',
          { ascending: false }
        )
        .limit(500);


      if (applicationError) {
        throw applicationError;
      }


      const {
        data: publicSubmissionData,
        error: publicSubmissionError,
      } = await supabase
        .from('public_profile_submissions')
        .select(`
          id,
          submission_reference,
          source_type,

          submitter_full_name,
          submitter_email,
          submitter_mobile,
          submitter_whatsapp,
          relationship_to_candidate,

          candidate_name,
          gender,
          age,
          date_of_birth,
          marital_status,
          height,

          religion,
          sect,
          caste,

          city,
          province,
          country,
          nationality,
          residence_status,

          education,
          profession,
          employment_status,
          job_type,
          income_range,

          complexion,
          body_type,
          languages,

          siblings,
          father_occupation,
          mother_occupation,
          family_details,

          expected_partner_age,
          expected_partner_location,
          expected_partner_education,
          requirements,

          additional_notes,

          photo_url,
          photo_visibility,

          consent_to_store,
          consent_to_share,

          review_status,

          admin_private_notes,

          assigned_bureau_email,
          assigned_matchmaker_name,
          assigned_at,
          assigned_by_email,

          converted_to_profile,
          converted_profile_id,
          converted_at,

          possible_duplicate,
          duplicate_match_count,
          duplicate_checked_at,
          duplicate_review_status,
          duplicate_review_updated_at,

          submitted_at,
          updated_at
        `)
        .order(
          'submitted_at',
          { ascending: false }
        )
        .limit(500);


      if (publicSubmissionError) {
        throw publicSubmissionError;
      }


      const {
        data: duplicateMatchData,
        error: duplicateMatchError,
      } = await supabase
        .from('public_submission_duplicate_matches')
        .select(`
          id,
          submission_id,
          matched_submission_id,
          match_score,
          match_reasons,
          review_decision,
          review_notes,
          reviewed_by_email,
          reviewed_at,
          created_at
        `)
        .order(
          'match_score',
          { ascending: false }
        )
        .limit(3000);


      if (duplicateMatchError) {
        throw duplicateMatchError;
      }


      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from('marriage_profiles')
        .select(`
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
        `)
        .order(
          'created_at',
          { ascending: false }
        )
        .limit(500);


      if (profileError) {
        throw profileError;
      }


      const {
        data: messageData,
        error: messageError,
      } = await supabase
        .from('contact_messages')
        .select(`
          id,
          full_name,
          email,
          phone,
          bureau_name,
          inquiry_type,
          message,
          status,
          created_at
        `)
        .order(
          'created_at',
          { ascending: false }
        )
        .limit(500);


      if (messageError) {
        throw messageError;
      }


      const {
        data: logData,
        error: logError,
      } = await supabase
        .from('contact_view_logs')
        .select(`
          id,
          viewer_email,
          viewer_business_name,
          profile_code,
          profile_candidate_name,
          profile_gender,
          uploader_email,
          uploader_business_name,
          viewed_at
        `)
        .order(
          'viewed_at',
          { ascending: false }
        )
        .limit(700);


      if (logError) {
        throw logError;
      }


      const {
        data: assignedWorkData,
        error: assignedWorkError,
      } = await supabase
        .from('assigned_profile_work')
        .select(`
          id,
          submission_id,
          bureau_email,
          work_status,
          bureau_private_notes,
          last_follow_up_at,
          next_follow_up_at,
          created_at,
          updated_at
        `)
        .order(
          'updated_at',
          { ascending: false }
        )
        .limit(1000);


      if (assignedWorkError) {
        throw assignedWorkError;
      }


      const {
        data: followUpData,
        error: followUpError,
      } = await supabase
        .from('assigned_profile_followup_history')
        .select(`
          id,
          submission_id,
          bureau_email,
          note,
          status_at_time,
          created_at
        `)
        .order(
          'created_at',
          { ascending: false }
        )
        .limit(3000);


      if (followUpError) {
        throw followUpError;
      }


      const {
        data: bureauControlData,
        error: bureauControlError,
      } = await supabase
        .from('bureau_admin_controls')
        .select(`
          id,
          bureau_email,
          business_name,
          is_flagged,
          warning_note,
          contact_reveal_suspended,
          daily_contact_view_limit,
          updated_at
        `)
        .order(
          'updated_at',
          { ascending: false }
        )
        .limit(1000);


      if (bureauControlError) {
        throw bureauControlError;
      }


      const {
        data: premiumOrderData,
        error: premiumOrderError,
      } = await supabase
        .from('premium_orders')
        .select(`
          id,
          profile_reference,
          customer_name,
          customer_phone,
          customer_email,
          user_type,
          bureau_email,
          plan_type,
          amount_pkr,
          payment_method,
          payment_status,
          payment_screenshot_url,
          transaction_id,
          start_date,
          expiry_date,
          admin_notes,
          created_at,
          updated_at
        `)
        .order(
          'created_at',
          { ascending: false }
        )
        .limit(1000);


      if (premiumOrderError) {
        throw premiumOrderError;
      }


      const loadedApplications =
        (applicationData || []) as BureauApplication[];


      const loadedPublicSubmissions =
        (publicSubmissionData || []) as PublicSubmission[];


      const bureauNotes:
        Record<string, string> = {};


      loadedApplications.forEach(
        (app) => {
          bureauNotes[app.id] =
            app.admin_notes || '';
        }
      );


      const publicNotes:
        Record<string, string> = {};


      const bureauDraft:
        Record<string, string> = {};


      const matchmakerDraft:
        Record<string, string> = {};


      loadedPublicSubmissions.forEach(
        (submission) => {
          publicNotes[submission.id] =
            submission.admin_private_notes || '';

          bureauDraft[submission.id] =
            submission.assigned_bureau_email || '';

          matchmakerDraft[submission.id] =
            submission.assigned_matchmaker_name || '';
        }
      );


      setAdminNotesDraft(bureauNotes);

      setPublicAdminNotesDraft(
        publicNotes
      );

      setBureauAssignmentDraft(
        bureauDraft
      );

      setMatchmakerAssignmentDraft(
        matchmakerDraft
      );


      setApplications(
        loadedApplications
      );

      setPublicSubmissions(
        loadedPublicSubmissions
      );


      const loadedDuplicateMatches =
        (duplicateMatchData || []) as DuplicateMatch[];


      const duplicateDecisionValues:
        Record<string, string> = {};


      const duplicateNoteValues:
        Record<string, string> = {};


      loadedDuplicateMatches.forEach(
        (match) => {
          duplicateDecisionValues[match.id] =
            match.review_decision ||
            'unreviewed';

          duplicateNoteValues[match.id] =
            match.review_notes ||
            '';
        }
      );


      setDuplicateMatches(
        loadedDuplicateMatches
      );


      setDuplicateDecisionDraft(
        duplicateDecisionValues
      );


      setDuplicateReviewNotesDraft(
        duplicateNoteValues
      );

      setProfiles(
        (profileData || []) as MarriageProfile[]
      );

      setMessages(
        (messageData || []) as ContactMessage[]
      );

      setLogs(
        (logData || []) as ContactLog[]
      );


      setAssignedProfileWork(
        (assignedWorkData || []) as AssignedProfileWork[]
      );


      setAssignedProfileFollowUps(
        (followUpData || []) as AssignedProfileFollowUp[]
      );


      const loadedBureauControls =
        (bureauControlData || []) as BureauControl[];


      setBureauControls(
        loadedBureauControls
      );


      const warningDraft:
        Record<string, string> = {};


      const limitDraft:
        Record<string, string> = {};


      loadedBureauControls.forEach(
        (control) => {
          warningDraft[control.bureau_email] =
            control.warning_note || '';

          limitDraft[control.bureau_email] =
            control.daily_contact_view_limit
              ? String(control.daily_contact_view_limit)
              : '';
        }
      );


      setBureauWarningDraft(
        warningDraft
      );


      setBureauLimitDraft(
        limitDraft
      );


      setPremiumOrders(
        (premiumOrderData || []) as PremiumOrder[]
      );

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


  const updateApplicationStatus = async (
    id: string,
    status: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('bureau_applications')
        .update({ status })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        `Bureau request marked as ${status}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Request could not be updated.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const saveAdminNotes = async (
    id: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('bureau_applications')
        .update({
          admin_notes:
            adminNotesDraft[id] || null,
        })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        'Admin notes saved.'
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Admin notes could not be saved.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const updatePublicSubmissionStatus = async (
    id: string,
    reviewStatus: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('public_profile_submissions')
        .update({
          review_status: reviewStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        `Public submission status changed to ${formatStatus(
          reviewStatus
        )}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Submission status could not be updated.'
      );

    } finally {
      setActionLoading('');
    }
  };



  const convertPublicSubmission = async (
    submissionId: string
  ) => {
    const confirmed = window.confirm(
      'Convert this approved public submission into an active MBN network profile? This action should only be completed once.'
    );

    if (!confirmed) return;

    try {
      setActionLoading(submissionId);
      setErrorMessage('');
      setSuccessMessage('');

      const { data, error } = await supabase.rpc(
        'convert_public_submission_to_profile',
        {
          p_submission_id: submissionId,
        }
      );

      if (error) {
        throw error;
      }

      const result =
        typeof data === 'object' &&
        data !== null
          ? (data as {
              profile_code?: string | null;
              profile_id?: string | null;
            })
          : null;

      const profileCode =
        result?.profile_code || null;

      const profileId =
        result?.profile_id || null;

      setConversionResult((prev) => ({
        ...prev,
        [submissionId]: {
          profileCode,
          profileId,
        },
      }));

      setSuccessMessage(
        profileCode
          ? `Profile successfully converted. New MBN ID: ${profileCode}`
          : 'Profile successfully converted to the MBN network.'
      );

      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Submission could not be converted.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const savePublicAdminNotes = async (
    id: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('public_profile_submissions')
        .update({
          admin_private_notes:
            publicAdminNotesDraft[id] || null,

          updated_at:
            new Date().toISOString(),
        })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        'Private admin notes saved.'
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Private notes could not be saved.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const assignSubmissionToBureau = async (
    submissionId: string
  ) => {
    try {
      setActionLoading(submissionId);
      setErrorMessage('');
      setSuccessMessage('');


      const bureauEmail =
        bureauAssignmentDraft[
          submissionId
        ]?.trim();


      if (!bureauEmail) {
        throw new Error(
          'Please select a marriage bureau first.'
        );
      }


      const bureau =
        applications.find(
          (item) =>
            item.email === bureauEmail
        );


      const assignmentTime =
        new Date().toISOString();


      const { error: updateError } =
        await supabase
          .from(
            'public_profile_submissions'
          )
          .update({
            assigned_bureau_email:
              bureauEmail,

            assigned_matchmaker_name:
              null,

            assigned_at:
              assignmentTime,

            assigned_by_email:
              currentEmail,

            review_status:
              'assigned',

            updated_at:
              assignmentTime,
          })
          .eq(
            'id',
            submissionId
          );


      if (updateError) {
        throw updateError;
      }


      const {
        error: historyError,
      } = await supabase
        .from(
          'public_profile_assignment_history'
        )
        .insert({
          submission_id:
            submissionId,

          assigned_to_type:
            'bureau',

          assigned_to_name:
            bureau?.business_name ||
            bureau?.full_name ||
            bureauEmail,

          assigned_to_email:
            bureauEmail,

          assigned_by_email:
            currentEmail,

          assignment_notes:
            `Assigned by Super Admin to ${
              bureau?.business_name ||
              bureauEmail
            }.`,
        });


      if (historyError) {
        throw historyError;
      }


      setSuccessMessage(
        `Profile assigned to ${
          bureau?.business_name ||
          bureauEmail
        }.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Profile could not be assigned.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const assignSubmissionToMatchmaker = async (
    submissionId: string
  ) => {
    try {
      setActionLoading(submissionId);
      setErrorMessage('');
      setSuccessMessage('');


      const matchmakerName =
        matchmakerAssignmentDraft[
          submissionId
        ]?.trim();


      if (!matchmakerName) {
        throw new Error(
          'Please enter a matchmaker name.'
        );
      }


      const assignmentTime =
        new Date().toISOString();


      const { error: updateError } =
        await supabase
          .from(
            'public_profile_submissions'
          )
          .update({
            assigned_matchmaker_name:
              matchmakerName,

            assigned_bureau_email:
              null,

            assigned_at:
              assignmentTime,

            assigned_by_email:
              currentEmail,

            review_status:
              'assigned',

            updated_at:
              assignmentTime,
          })
          .eq(
            'id',
            submissionId
          );


      if (updateError) {
        throw updateError;
      }


      const {
        error: historyError,
      } = await supabase
        .from(
          'public_profile_assignment_history'
        )
        .insert({
          submission_id:
            submissionId,

          assigned_to_type:
            'matchmaker',

          assigned_to_name:
            matchmakerName,

          assigned_to_email:
            null,

          assigned_by_email:
            currentEmail,

          assignment_notes:
            `Assigned by Super Admin to matchmaker ${matchmakerName}.`,
        });


      if (historyError) {
        throw historyError;
      }


      setSuccessMessage(
        `Profile assigned to matchmaker ${matchmakerName}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Profile could not be assigned.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const updateProfileStatus = async (
    id: string,
    status: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('marriage_profiles')
        .update({
          status,
          updated_at:
            new Date().toISOString(),
        })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        `Profile marked as ${status}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Profile could not be updated.'
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
          photo_visibility:
            photoVisibility,

          updated_at:
            new Date().toISOString(),
        })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        `Profile photo visibility changed to ${photoVisibility}.`
      );


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


  const updateMessageStatus = async (
    id: string,
    status: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        `Message marked as ${status}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Message could not be updated.'
      );

    } finally {
      setActionLoading('');
    }
  };


  useEffect(() => {
    loadAdminData();
  }, []);


  const filteredApplications =
    applications.filter((item) => {
      const matchesStatus =
        statusFilter
          ? item.status === statusFilter
          : true;


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
        .includes(
          searchTerm.toLowerCase()
        );


      return (
        matchesStatus &&
        matchesSearch
      );
    });


  const filteredPublicSubmissions =
    publicSubmissions.filter((item) => {
      const matchesStatus =
        statusFilter
          ? item.review_status ===
            statusFilter
          : true;


      const matchesSearch = [
        item.submission_reference,
        item.submitter_full_name,
        item.submitter_email,
        item.submitter_mobile,
        item.submitter_whatsapp,

        item.candidate_name,
        item.gender,
        item.age,
        item.marital_status,

        item.city,
        item.province,

        item.sect,
        item.caste,

        item.education,
        item.profession,
        item.employment_status,

        item.assigned_bureau_email,
        item.assigned_matchmaker_name,

        item.review_status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );


      return (
        matchesStatus &&
        matchesSearch
      );
    });


  const filteredProfiles =
    profiles.filter((item) => {
      const matchesStatus =
        statusFilter
          ? item.status === statusFilter
          : true;


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
        .includes(
          searchTerm.toLowerCase()
        );


      return (
        matchesStatus &&
        matchesSearch
      );
    });


  const filteredMessages =
    messages.filter((item) => {
      const matchesStatus =
        statusFilter
          ? item.status === statusFilter
          : true;


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
        .includes(
          searchTerm.toLowerCase()
        );


      return (
        matchesStatus &&
        matchesSearch
      );
    });


  const filteredLogs =
    logs.filter((item) =>
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
        .includes(
          searchTerm.toLowerCase()
        )
    );


  const approvedBureaus =
    applications.filter(
      (app) =>
        app.status === 'approved' &&
        app.email
    );


  const getDuplicateMatchesForSubmission = (
    submissionId: string
  ) =>
    duplicateMatches
      .filter(
        (match) =>
          match.submission_id === submissionId
      )
      .sort(
        (a, b) =>
          b.match_score - a.match_score
      );


  const getSubmissionById = (
    submissionId: string
  ) =>
    publicSubmissions.find(
      (submission) =>
        submission.id === submissionId
    ) || null;


  const recheckSubmissionDuplicates = async (
    submissionId: string
  ) => {
    try {
      setActionLoading(
        `duplicate-${submissionId}`
      );

      setErrorMessage('');
      setSuccessMessage('');


      const {
        data,
        error,
      } = await supabase.rpc(
        'admin_recheck_submission_duplicates',
        {
          p_submission_id:
            submissionId,
        }
      );


      if (error) {
        throw error;
      }


      await loadAdminData();


      const result =
        typeof data === 'object' &&
        data !== null
          ? (data as {
              match_count?: number;
              possible_duplicate?: boolean;
            })
          : null;


      setSuccessMessage(
        result?.possible_duplicate
          ? `Duplicate check completed. ${result.match_count || 0} possible match(es) found.`
          : 'Duplicate check completed. No possible duplicate matches found.'
      );

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Duplicate check could not be completed.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const saveDuplicateReviewDecision = async (
    duplicateMatchId: string
  ) => {
    try {
      setActionLoading(
        `review-${duplicateMatchId}`
      );

      setErrorMessage('');
      setSuccessMessage('');


      const decision =
        duplicateDecisionDraft[
          duplicateMatchId
        ] ||
        'unreviewed';


      const notes =
        duplicateReviewNotesDraft[
          duplicateMatchId
        ]?.trim() ||
        null;


      const {
        error,
      } = await supabase.rpc(
        'admin_review_duplicate_match',
        {
          p_duplicate_match_id:
            duplicateMatchId,

          p_decision:
            decision,

          p_review_notes:
            notes,
        }
      );


      if (error) {
        throw error;
      }


      setSuccessMessage(
        `Duplicate review decision saved as ${formatStatus(
          decision
        )}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Duplicate review decision could not be saved.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const getBureauWorkForSubmission = (
    submissionId: string
  ) =>
    assignedProfileWork.find(
      (work) =>
        work.submission_id === submissionId
    ) || null;


  const getFollowUpsForSubmission = (
    submissionId: string
  ) =>
    assignedProfileFollowUps.filter(
      (followUp) =>
        followUp.submission_id === submissionId
    );


  const getBureauDisplayName = (
    email: string | null
  ) => {
    if (!email) return 'Assigned Bureau';

    const bureau = applications.find(
      (item) =>
        item.email?.toLowerCase() ===
        email.toLowerCase()
    );

    return (
      bureau?.business_name ||
      bureau?.full_name ||
      email
    );
  };



  const getBureauControl = (
    email: string | null
  ) => {
    if (!email) return null;

    return (
      bureauControls.find(
        (control) =>
          control.bureau_email === email
      ) || null
    );
  };


  const getContactViewsToday = (
    email: string | null
  ) => {
    if (!email) return 0;

    const todayStart =
      new Date();

    todayStart.setHours(0, 0, 0, 0);

    return logs.filter((log) => {
      if (
        log.viewer_email !== email ||
        !log.viewed_at
      ) {
        return false;
      }

      return new Date(log.viewed_at) >= todayStart;
    }).length;
  };


  const getBureauWarningSignals = (
    email: string | null
  ) => {
    if (!email) return [];

    const signals: string[] = [];

    const control =
      getBureauControl(email);

    const todayViews =
      getContactViewsToday(email);

    const limit =
      control?.daily_contact_view_limit || 20;

    if (todayViews > limit) {
      signals.push(
        `Viewed ${todayViews} contacts today. Daily limit is ${limit}.`
      );
    }

    const assignedCases =
      assignedProfileWork.filter(
        (work) =>
          work.bureau_email === email
      );

    const casesWithoutFollowUp =
      assignedCases.filter(
        (work) =>
          !work.last_follow_up_at
      ).length;

    if (
      assignedCases.length > 0 &&
      casesWithoutFollowUp > 0
    ) {
      signals.push(
        `${casesWithoutFollowUp} assigned cases have no follow-up.`
      );
    }

    const genderViews: Record<string, number> = {};

    logs
      .filter(
        (log) =>
          log.viewer_email === email
      )
      .forEach((log) => {
        const gender =
          log.profile_gender || 'Unknown';

        genderViews[gender] =
          (genderViews[gender] || 0) + 1;
      });

    Object.entries(genderViews).forEach(
      ([gender, count]) => {
        if (count >= 10) {
          signals.push(
            `Repeatedly viewed ${gender} profiles (${count} views).`
          );
        }
      }
    );

    return signals;
  };


  const saveBureauControl = async (
    bureau: BureauApplication,
    updates: Partial<BureauControl>
  ) => {
    if (!bureau.email) {
      setErrorMessage(
        'Bureau email is missing.'
      );
      return;
    }

    try {
      setActionLoading(bureau.email);
      setErrorMessage('');
      setSuccessMessage('');

      const existingControl =
        getBureauControl(bureau.email);

      const payload = {
        bureau_email: bureau.email,
        business_name:
          bureau.business_name ||
          bureau.full_name ||
          bureau.email,
        is_flagged:
          updates.is_flagged ??
          existingControl?.is_flagged ??
          false,
        warning_note:
          updates.warning_note ??
          bureauWarningDraft[bureau.email] ??
          existingControl?.warning_note ??
          null,
        contact_reveal_suspended:
          updates.contact_reveal_suspended ??
          existingControl?.contact_reveal_suspended ??
          false,
        daily_contact_view_limit:
          updates.daily_contact_view_limit ??
          (
            bureauLimitDraft[bureau.email]
              ? Number(bureauLimitDraft[bureau.email])
              : existingControl?.daily_contact_view_limit || 20
          ),
        updated_by_email: currentEmail,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('bureau_admin_controls')
        .upsert(payload, {
          onConflict: 'bureau_email',
        });

      if (error) throw error;

      setSuccessMessage(
        'Bureau control settings saved.'
      );

      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Bureau control settings could not be saved.'
      );
    } finally {
      setActionLoading('');
    }
  };


  const updatePremiumOrder = async (
    orderId: string,
    updates: Partial<PremiumOrder>
  ) => {
    try {
      setActionLoading(orderId);
      setErrorMessage('');
      setSuccessMessage('');

      const { error } = await supabase
        .from('premium_orders')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      setSuccessMessage(
        'Premium order updated.'
      );

      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Premium order could not be updated.'
      );
    } finally {
      setActionLoading('');
    }
  };


  const addManualPayment = async () => {
    const customerName =
      window.prompt('Customer name?');

    if (!customerName) return;

    const customerPhone =
      window.prompt('Customer phone / WhatsApp?') || '';

    const profileReference =
      window.prompt('Profile reference? Example: MBN-MTN-G-10001') || '';

    const planType =
      window.prompt('Plan type? Example: Verified Premium') ||
      'Manual Premium';

    const amountValue =
      window.prompt('Amount PKR?') || '0';

    const transactionId =
      window.prompt('Transaction ID / notes?') || '';

    const startDate =
      new Date();

    const expiryDate =
      new Date();

    expiryDate.setMonth(
      expiryDate.getMonth() + 1
    );

    try {
      setActionLoading('manual-payment');
      setErrorMessage('');
      setSuccessMessage('');

      const { error } = await supabase
        .from('premium_orders')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone || null,
          profile_reference:
            profileReference || null,
          plan_type: planType,
          amount_pkr:
            Number(amountValue) || 0,
          payment_method: 'Manual',
          payment_status: 'approved',
          transaction_id:
            transactionId || null,
          start_date:
            startDate.toISOString().slice(0, 10),
          expiry_date:
            expiryDate.toISOString().slice(0, 10),
          admin_notes:
            `Manual payment added by ${currentEmail}`,
          created_by_email: currentEmail,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSuccessMessage(
        'Manual premium payment added.'
      );

      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Manual payment could not be added.'
      );
    } finally {
      setActionLoading('');
    }
  };



  const deleteNetworkProfile = async (
    profile: MarriageProfile
  ) => {
    const confirmed =
      window.confirm(
        `Delete profile ${profile.profile_code || profile.candidate_name || profile.id} permanently from database? This cannot be undone.`
      );

    if (!confirmed) return;

    const reason =
      window.prompt(
        'Reason for deleting this profile?'
      ) || 'Deleted by super admin';

    try {
      setActionLoading(profile.id);
      setErrorMessage('');
      setSuccessMessage('');

      const { error } = await supabase.rpc(
        'admin_delete_marriage_profile',
        {
          p_profile_id: profile.id,
          p_reason: reason,
        }
      );

      if (error) throw error;

      setSuccessMessage(
        'Profile deleted from database.'
      );

      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Profile could not be deleted.'
      );
    } finally {
      setActionLoading('');
    }
  };


  const csvCell = (
    value: unknown
  ) => {
    const textValue =
      value === null ||
      value === undefined
        ? ''
        : String(value);

    return `"${textValue.replace(/"/g, '""')}"`;
  };


  const downloadCsv = (
    fileName: string,
    rows: Record<string, unknown>[]
  ) => {
    if (rows.length === 0) {
      setErrorMessage(
        'No data available for export.'
      );
      return;
    }

    const headers =
      Object.keys(rows[0]);

    const csv = [
      headers.map(csvCell).join(','),
      ...rows.map((row) =>
        headers
          .map((header) =>
            csvCell(row[header])
          )
          .join(',')
      ),
    ].join('\n');

    const blob =
      new Blob([csv], {
        type: 'text/csv;charset=utf-8;',
      });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  };


  const exportMonthlyReport = () => {
    const now =
      new Date();

    const monthStart =
      new Date(now.getFullYear(), now.getMonth(), 1);

    const isThisMonth = (
      value: string | null
    ) =>
      value
        ? new Date(value) >= monthStart
        : false;

    const report = [{
      month: now.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      }),
      new_bureaus: applications.filter((app) =>
        isThisMonth(app.created_at)
      ).length,
      new_profiles: profiles.filter((profile) =>
        isThisMonth(profile.created_at)
      ).length,
      new_public_submissions: publicSubmissions.filter((submission) =>
        isThisMonth(submission.submitted_at)
      ).length,
      converted_profiles: publicSubmissions.filter((submission) =>
        submission.converted_to_profile &&
        isThisMonth(submission.converted_at)
      ).length,
      contact_views: logs.filter((log) =>
        isThisMonth(log.viewed_at)
      ).length,
      matched_cases: publicSubmissions.filter((submission) =>
        submission.review_status === 'matched' &&
        isThisMonth(submission.updated_at)
      ).length,
      premium_revenue_pkr: premiumOrders
        .filter((order) =>
          order.payment_status === 'approved' &&
          isThisMonth(order.created_at)
        )
        .reduce(
          (sum, order) =>
            sum + (order.amount_pkr || 0),
          0
        ),
    }];

    downloadCsv(
      'mbn-monthly-report.csv',
      report
    );
  };


  const recentPendingApplications =
    applications
      .filter(
        (app) =>
          app.status === 'pending'
      )
      .slice(0, 5);


  const recentPublicSubmissions =
    publicSubmissions
      .filter(
        (submission) =>
          submission.review_status ===
          'new'
      )
      .slice(0, 5);


  const recentMessages =
    messages.slice(0, 5);


  const recentLogs =
    logs.slice(0, 5);


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-80 bg-slate-200 rounded-xl animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 bg-slate-200 rounded-2xl animate-pulse"
              />
            )
          )}
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
            This console is private and only
            accessible to the website owner /
            super admin.
          </p>

          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
            Logged in email:{' '}

            <span className="font-semibold">
              {currentEmail || 'Unknown'}
            </span>
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
            Full control center for bureau requests,
            public submissions, profiles, messages,
            assignments, and contact activity.
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-5">

        <StatCard
          title="Applications"
          value={stats.totalApplications}
          subtitle={`${stats.pendingApplications} pending`}
          icon={
            <Building2 className="w-6 h-6 text-green-700" />
          }
          bg="bg-green-50"
        />


        <StatCard
          title="Approved Bureaus"
          value={stats.approvedApplications}
          subtitle={`${stats.rejectedApplications} rejected`}
          icon={
            <UserCheck className="w-6 h-6 text-blue-700" />
          }
          bg="bg-blue-50"
        />


        <StatCard
          title="Public Submissions"
          value={stats.publicSubmissions}
          subtitle={`${stats.newPublicSubmissions} new`}
          icon={
            <HeartHandshake className="w-6 h-6 text-emerald-700" />
          }
          bg="bg-emerald-50"
        />


        <StatCard
          title="Network Profiles"
          value={stats.totalProfiles}
          subtitle={`${stats.activeProfiles} active`}
          icon={
            <FileText className="w-6 h-6 text-purple-700" />
          }
          bg="bg-purple-50"
        />


        <StatCard
          title="Messages"
          value={stats.contactMessages}
          subtitle={`${stats.newMessages} new`}
          icon={
            <Mail className="w-6 h-6 text-amber-700" />
          }
          bg="bg-amber-50"
        />


        <StatCard
          title="Contact Views"
          value={stats.contactViews}
          subtitle="Total reveal logs"
          icon={
            <Eye className="w-6 h-6 text-red-700" />
          }
          bg="bg-red-50"
        />

      </div>



      {/* Smart Alerts */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Smart Alerts
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Priority items that need super admin attention. Click any alert to open the related section.
            </p>
          </div>

          <TriangleAlert className="w-7 h-7 text-amber-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <SmartAlertCard
            title="Bureau applications pending"
            value={stats.pendingApplications}
            action="Review applications"
            danger={stats.pendingApplications > 0}
            onClick={() => {
              setActiveTab('applications');
              setStatusFilter('pending');
              setSearchTerm('');
            }}
          />

          <SmartAlertCard
            title="Public profiles need review"
            value={stats.newPublicSubmissions}
            action="Open public submissions"
            danger={stats.newPublicSubmissions > 0}
            onClick={() => {
              setActiveTab('public-submissions');
              setStatusFilter('new');
              setSearchTerm('');
            }}
          />

          <SmartAlertCard
            title="Possible duplicates found"
            value={publicSubmissions.filter((submission) => submission.possible_duplicate || submission.duplicate_review_status === 'needs_review').length}
            action="Review duplicate cases"
            danger
            onClick={() => {
              setActiveTab('public-submissions');
              setStatusFilter('');
              setSearchTerm('duplicate');
            }}
          />

          <SmartAlertCard
            title="Bureaus with high contact views"
            value={applications.filter((app) => getContactViewsToday(app.email) > (getBureauControl(app.email)?.daily_contact_view_limit || 20)).length}
            action="Review bureau control"
            danger
            onClick={() => {
              setActiveTab('bureau-control');
              setStatusFilter('');
              setSearchTerm('');
            }}
          />

          <SmartAlertCard
            title="Payments need approval"
            value={premiumOrders.filter((order) => order.payment_status === 'pending').length}
            action="Review payments"
            danger
            onClick={() => {
              setActiveTab('premium-payments');
              setStatusFilter('');
              setSearchTerm('');
            }}
          />

          <SmartAlertCard
            title="Assigned cases without follow-up"
            value={assignedProfileWork.filter((work) => !work.last_follow_up_at).length}
            action="Check assigned work"
            danger
            onClick={() => {
              setActiveTab('public-submissions');
              setStatusFilter('assigned');
              setSearchTerm('');
            }}
          />

          <SmartAlertCard
            title="Flagged bureaus"
            value={bureauControls.filter((control) => control.is_flagged).length}
            action="Review flags"
            danger
            onClick={() => {
              setActiveTab('bureau-control');
              setStatusFilter('');
              setSearchTerm('');
            }}
          />

          <SmartAlertCard
            title="Contact reveal suspended"
            value={bureauControls.filter((control) => control.contact_reveal_suspended).length}
            action="Review suspensions"
            danger
            onClick={() => {
              setActiveTab('bureau-control');
              setStatusFilter('');
              setSearchTerm('');
            }}
          />
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
                setStatusFilter('');
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}

              {tab.key ===
                'public-submissions' &&
                stats.newPublicSubmissions > 0 && (
                  <span className="ml-2 inline-flex min-w-5 h-5 px-1.5 items-center justify-center rounded-full bg-white text-green-700 text-xs">
                    {
                      stats.newPublicSubmissions
                    }
                  </span>
                )}
            </button>
          ))}

        </div>


        {activeTab !== 'overview' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_240px] gap-3">

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search current section..."
                className="input-field pl-10"
              />
            </div>


            {(
              activeTab === 'applications' ||
              activeTab === 'public-submissions' ||
              activeTab === 'profiles' ||
              activeTab === 'messages'
            ) && (
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="input-field"
              >
                <option value="">
                  All Status
                </option>


                {activeTab ===
                  'applications' && (
                  <>
                    <option value="pending">
                      Pending
                    </option>

                    <option value="approved">
                      Approved
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>
                  </>
                )}


                {activeTab ===
                  'public-submissions' &&
                  publicSubmissionStatuses.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {
                          formatStatus(
                            status
                          )
                        }
                      </option>
                    )
                  )}


                {activeTab ===
                  'profiles' && (
                  <>
                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </>
                )}


                {activeTab ===
                  'messages' && (
                  <>
                    <option value="new">
                      New
                    </option>

                    <option value="reviewed">
                      Reviewed
                    </option>

                    <option value="closed">
                      Closed
                    </option>
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

          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <h2 className="font-heading text-xl font-bold text-slate-900">
              Platform Status
            </h2>


            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Pending Bureau Requests
                </span>

                <span className="font-bold text-amber-600">
                  {
                    stats.pendingApplications
                  }
                </span>
              </div>


              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  New Public Profiles
                </span>

                <span className="font-bold text-green-600">
                  {
                    stats.newPublicSubmissions
                  }
                </span>
              </div>


              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Active Network Profiles
                </span>

                <span className="font-bold text-blue-600">
                  {stats.activeProfiles}
                </span>
              </div>

            </div>
          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-6 xl:col-span-2">

            <h2 className="font-heading text-xl font-bold text-slate-900">
              New Public Submissions
            </h2>


            {recentPublicSubmissions.length ===
            0 ? (
              <p className="text-sm text-slate-500 mt-5">
                No new public profile submissions.
              </p>
            ) : (
              <div className="mt-5 space-y-4">

                {recentPublicSubmissions.map(
                  (submission) => (
                    <div
                      key={submission.id}
                      className="border border-slate-200 rounded-xl p-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div>
                          <p className="font-bold text-slate-900">
                            {
                              submission.candidate_name ||
                              submission.submitter_full_name ||
                              'Public Submission'
                            }
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            {
                              submission.gender ||
                              'Gender N/A'
                            }{' '}
                            •{' '}
                            {
                              submission.age ||
                              'Age N/A'
                            }{' '}
                            •{' '}
                            {
                              submission.city ||
                              'City N/A'
                            }
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Submitted:{' '}
                            {
                              formatDate(
                                submission.submitted_at
                              )
                            }
                          </p>
                        </div>


                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab(
                              'public-submissions'
                            );

                            setSearchTerm(
                              submission.submitter_mobile ||
                              submission.candidate_name ||
                              ''
                            );
                          }}
                          className="px-4 py-2 rounded-lg bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100"
                        >
                          Review Submission
                        </button>

                      </div>
                    </div>
                  )
                )}

              </div>
            )}
          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <h2 className="font-heading text-xl font-bold text-slate-900">
              Pending Bureau Requests
            </h2>


            {recentPendingApplications.length ===
            0 ? (
              <p className="text-sm text-slate-500 mt-5">
                No pending bureau requests.
              </p>
            ) : (
              <div className="mt-5 space-y-3">

                {recentPendingApplications.map(
                  (app) => (
                    <div
                      key={app.id}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <p className="font-semibold text-slate-900">
                        {
                          app.business_name ||
                          'Unnamed Bureau'
                        }
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {
                          app.city ||
                          'N/A'
                        }
                      </p>
                    </div>
                  )
                )}

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
                      {
                        log.viewer_business_name ||
                        log.viewer_email ||
                        'Viewer'
                      }
                    </span>{' '}

                    viewed contact for{' '}

                    <span className="font-semibold text-slate-900">
                      {
                        log.profile_code ||
                        'profile'
                      }
                    </span>

                    <p className="text-xs text-slate-400 mt-1">
                      {
                        formatDate(
                          log.viewed_at
                        )
                      }
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
              <p className="text-sm text-slate-500 mt-5">
                No messages yet.
              </p>
            ) : (
              <div className="mt-5 space-y-3">

                {recentMessages.map(
                  (message) => (
                    <div
                      key={message.id}
                      className="p-4 rounded-xl bg-slate-50 text-sm"
                    >
                      <p className="font-semibold text-slate-900">
                        {
                          message.full_name ||
                          'No name'
                        }
                      </p>

                      <p className="text-slate-500">
                        {message.email}
                      </p>
                    </div>
                  )
                )}

              </div>
            )}
          </div>

        </div>
      )}


      {/* PUBLIC SUBMISSIONS */}
      {activeTab ===
        'public-submissions' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <SectionHeader
            title="Public Profile Submissions"
            count={
              filteredPublicSubmissions.length
            }
            subtitle="Review individuals, update workflow, add private notes, and assign profiles"
          />


          <div className="divide-y divide-slate-100">

            {filteredPublicSubmissions.map(
              (submission) => {

                const whatsappLink =
                  getWhatsAppLink(
                    submission.submitter_whatsapp ||
                    submission.submitter_mobile
                  );


                const duplicateMatchesForSubmission =
                  getDuplicateMatchesForSubmission(
                    submission.id
                  );


                const highestDuplicateMatch =
                  duplicateMatchesForSubmission[0] ||
                  null;


                const highestMatchedSubmission =
                  highestDuplicateMatch
                    ? getSubmissionById(
                        highestDuplicateMatch.matched_submission_id
                      )
                    : null;


                const bureauWork =
                  getBureauWorkForSubmission(
                    submission.id
                  );


                const bureauFollowUps =
                  getFollowUpsForSubmission(
                    submission.id
                  );


                return (
                  <div
                    key={submission.id}
                    className="p-6"
                  >

                    <div className="flex flex-col 2xl:flex-row 2xl:items-start gap-6">


                      {/* Main Submission Details */}
                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-heading text-2xl font-bold text-slate-900">
                            {
                              submission.candidate_name ||
                              submission.submitter_full_name ||
                              'Public Submission'
                            }
                          </h3>


                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                              submission.review_status
                            )}`}
                          >
                            {
                              formatStatus(
                                submission.review_status
                              )
                            }
                          </span>


                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                            Public Submission
                          </span>


                          {submission.converted_to_profile && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                              Converted to Network Profile
                            </span>
                          )}


                          {submission.possible_duplicate && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              <TriangleAlert className="w-3.5 h-3.5" />
                              Possible Duplicate
                            </span>
                          )}

                        </div>


                        {submission.submission_reference && (
                          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">

                            <span className="text-xs text-slate-500">
                              Reference
                            </span>

                            <span
                              dir="ltr"
                              className="font-mono text-sm font-bold text-slate-900"
                            >
                              {submission.submission_reference}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  submission.submission_reference || ''
                                )
                              }
                              className="text-slate-400 hover:text-slate-700"
                              title="Copy reference"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                          </div>
                        )}


                        <p className="text-xs text-slate-400 mt-2">
                          Submitted:{' '}
                          {
                            formatDate(
                              submission.submitted_at
                            )
                          }
                        </p>


                        {/* Contact + Candidate */}
                        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">


                          <div className="rounded-xl bg-slate-50 p-4">

                            <div className="flex items-center gap-2 mb-3">
                              <Users className="w-5 h-5 text-green-700" />

                              <p className="font-bold text-slate-900">
                                Submitter Information
                              </p>
                            </div>


                            <div className="space-y-2 text-sm text-slate-600">

                              <InfoLine
                                label="Name"
                                value={
                                  submission.submitter_full_name
                                }
                              />

                              <InfoLine
                                label="Relationship"
                                value={
                                  submission.relationship_to_candidate
                                }
                              />

                              <InfoLine
                                label="Mobile"
                                value={
                                  submission.submitter_mobile
                                }
                              />

                              <InfoLine
                                label="WhatsApp"
                                value={
                                  submission.submitter_whatsapp
                                }
                              />

                              <InfoLine
                                label="Email"
                                value={
                                  submission.submitter_email
                                }
                              />

                            </div>


                            <div className="mt-4 flex flex-wrap gap-2">

                              {submission.submitter_mobile && (
                                <a
                                  href={`tel:${submission.submitter_mobile}`}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700"
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
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-semibold"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  WhatsApp
                                </a>
                              )}


                              {submission.submitter_email && (
                                <a
                                  href={`mailto:${submission.submitter_email}`}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold"
                                >
                                  <Mail className="w-4 h-4" />
                                  Email
                                </a>
                              )}

                            </div>
                          </div>


                          <div className="rounded-xl bg-green-50 p-4">

                            <div className="flex items-center gap-2 mb-3">
                              <UserRoundSearch className="w-5 h-5 text-green-700" />

                              <p className="font-bold text-green-900">
                                Candidate
                              </p>
                            </div>


                            <div className="space-y-2 text-sm text-green-900">

                              <InfoLine
                                label="Name"
                                value={
                                  submission.candidate_name
                                }
                              />

                              <InfoLine
                                label="Gender"
                                value={
                                  submission.gender
                                }
                              />

                              <InfoLine
                                label="Age"
                                value={
                                  submission.age
                                }
                              />

                              <InfoLine
                                label="Date of Birth"
                                value={
                                  submission.date_of_birth
                                }
                              />

                              <InfoLine
                                label="Marital Status"
                                value={
                                  submission.marital_status
                                }
                              />

                              <InfoLine
                                label="Height"
                                value={
                                  submission.height
                                }
                              />

                              <InfoLine
                                label="Sect"
                                value={
                                  submission.sect
                                }
                              />

                              <InfoLine
                                label="Caste"
                                value={
                                  submission.caste
                                }
                              />

                            </div>
                          </div>


                          <div className="rounded-xl bg-blue-50 p-4">

                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-5 h-5 text-blue-700" />

                              <p className="font-bold text-blue-900">
                                Location & Career
                              </p>
                            </div>


                            <div className="space-y-2 text-sm text-blue-900">

                              <InfoLine
                                label="City"
                                value={
                                  submission.city
                                }
                              />

                              <InfoLine
                                label="Province"
                                value={
                                  submission.province
                                }
                              />

                              <InfoLine
                                label="Country"
                                value={
                                  submission.country
                                }
                              />

                              <InfoLine
                                label="Nationality"
                                value={
                                  submission.nationality
                                }
                              />

                              <InfoLine
                                label="Education"
                                value={
                                  submission.education
                                }
                              />

                              <InfoLine
                                label="Profession"
                                value={
                                  submission.profession
                                }
                              />

                              <InfoLine
                                label="Employment"
                                value={
                                  submission.employment_status
                                }
                              />

                              <InfoLine
                                label="Income"
                                value={
                                  submission.income_range
                                }
                              />

                            </div>
                          </div>

                        </div>


                        {/* Photo + Family + Requirements */}
                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[220px_1fr_1fr] gap-4">


                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="font-bold text-slate-900 mb-3">
                              Candidate Photo
                            </p>


                            {submission.photo_url ? (
                              <img
                                src={
                                  submission.photo_url
                                }
                                alt="Candidate"
                                className="w-full h-56 object-cover object-top rounded-xl"
                              />
                            ) : (
                              <div className="h-56 rounded-xl bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                                <ImageIcon className="w-9 h-9" />

                                <p className="text-xs mt-2">
                                  No photo
                                </p>
                              </div>
                            )}


                            <p className="text-xs text-slate-500 mt-3">
                              Visibility:{' '}
                              <span className="font-semibold capitalize">
                                {
                                  submission.photo_visibility ||
                                  'public'
                                }
                              </span>
                            </p>

                          </div>


                          <div className="rounded-xl bg-purple-50 p-4 text-sm text-purple-900">

                            <p className="font-bold mb-3">
                              Family Information
                            </p>


                            <div className="space-y-2">

                              <InfoLine
                                label="Siblings"
                                value={
                                  submission.siblings
                                }
                              />

                              <InfoLine
                                label="Father Occupation"
                                value={
                                  submission.father_occupation
                                }
                              />

                              <InfoLine
                                label="Mother Occupation"
                                value={
                                  submission.mother_occupation
                                }
                              />


                              {submission.family_details && (
                                <div className="pt-2">
                                  <p className="font-semibold">
                                    Family Summary:
                                  </p>

                                  <p className="mt-1 leading-relaxed">
                                    {
                                      submission.family_details
                                    }
                                  </p>
                                </div>
                              )}

                            </div>
                          </div>


                          <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">

                            <p className="font-bold mb-3">
                              Match Requirements
                            </p>


                            <div className="space-y-2">

                              <InfoLine
                                label="Expected Age"
                                value={
                                  submission.expected_partner_age
                                }
                              />

                              <InfoLine
                                label="Expected Location"
                                value={
                                  submission.expected_partner_location
                                }
                              />

                              <InfoLine
                                label="Expected Education"
                                value={
                                  submission.expected_partner_education
                                }
                              />


                              {submission.requirements && (
                                <div className="pt-2">
                                  <p className="font-semibold">
                                    Requirements:
                                  </p>

                                  <p className="mt-1 leading-relaxed">
                                    {
                                      submission.requirements
                                    }
                                  </p>
                                </div>
                              )}

                            </div>
                          </div>

                        </div>


                        {submission.additional_notes && (
                          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4">
                            <p className="font-bold text-amber-900">
                              Additional Information
                            </p>

                            <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                              {
                                submission.additional_notes
                              }
                            </p>
                          </div>
                        )}


                        {/* Duplicate Detection */}
                        <div
                          className={`mt-4 rounded-xl border p-5 ${
                            submission.possible_duplicate
                              ? 'border-red-200 bg-red-50'
                              : 'border-slate-200 bg-slate-50'
                          }`}
                        >

                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                            <div>

                              <div className="flex items-center gap-2">

                                <TriangleAlert
                                  className={`w-5 h-5 ${
                                    submission.possible_duplicate
                                      ? 'text-red-700'
                                      : 'text-slate-500'
                                  }`}
                                />

                                <p
                                  className={`font-bold ${
                                    submission.possible_duplicate
                                      ? 'text-red-900'
                                      : 'text-slate-900'
                                  }`}
                                >
                                  Duplicate Submission Check
                                </p>

                              </div>


                              <p
                                className={`text-sm mt-2 ${
                                  submission.possible_duplicate
                                    ? 'text-red-800'
                                    : 'text-slate-600'
                                }`}
                              >
                                {submission.possible_duplicate
                                  ? `${submission.duplicate_match_count || duplicateMatchesForSubmission.length} possible similar submission(s) found.`
                                  : 'No possible duplicate submissions are currently flagged.'}
                              </p>


                              {submission.duplicate_checked_at && (
                                <p className="text-xs text-slate-400 mt-2">
                                  Last checked:{' '}
                                  {
                                    formatDate(
                                      submission.duplicate_checked_at
                                    )
                                  }
                                </p>
                              )}


                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold text-slate-500">
                                  Review Status:
                                </span>

                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                                    submission.duplicate_review_status
                                  )}`}
                                >
                                  {
                                    formatStatus(
                                      submission.duplicate_review_status ||
                                      'not_checked'
                                    )
                                  }
                                </span>
                              </div>

                            </div>


                            <button
                              type="button"
                              onClick={() =>
                                recheckSubmissionDuplicates(
                                  submission.id
                                )
                              }
                              disabled={
                                actionLoading ===
                                `duplicate-${submission.id}`
                              }
                              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 ${
                                submission.possible_duplicate
                                  ? 'bg-red-700 text-white hover:bg-red-800'
                                  : 'bg-slate-900 text-white hover:bg-slate-800'
                              }`}
                            >
                              <RefreshCcw
                                className={`w-4 h-4 ${
                                  actionLoading ===
                                  `duplicate-${submission.id}`
                                    ? 'animate-spin'
                                    : ''
                                }`}
                              />

                              {actionLoading ===
                              `duplicate-${submission.id}`
                                ? 'Checking...'
                                : 'Recheck Duplicates'}
                            </button>

                          </div>


                          {highestDuplicateMatch && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-white p-4">

                              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                                <div>

                                  <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                                    Highest Match
                                  </p>


                                  <p className="font-bold text-slate-900 mt-2">
                                    {
                                      highestMatchedSubmission?.submission_reference ||
                                      highestMatchedSubmission?.candidate_name ||
                                      'Previous submission'
                                    }
                                  </p>


                                  <p className="text-sm text-slate-500 mt-1">
                                    Score:{' '}
                                    <span className="font-bold text-red-700">
                                      {highestDuplicateMatch.match_score}
                                    </span>
                                  </p>

                                </div>


                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchTerm(
                                      highestMatchedSubmission?.submission_reference ||
                                      highestMatchedSubmission?.candidate_name ||
                                      highestDuplicateMatch.matched_submission_id
                                    );

                                    setStatusFilter('');

                                    window.scrollTo({
                                      top: 0,
                                      behavior: 'smooth',
                                    });
                                  }}
                                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-red-100 text-red-700 text-sm font-semibold hover:bg-red-200"
                                >
                                  View Similar Submission
                                </button>

                              </div>


                              <div className="mt-4">

                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                  Match Reasons
                                </p>


                                <div className="mt-2 flex flex-wrap gap-2">

                                  {(
                                    highestDuplicateMatch.match_reasons || []
                                  ).map(
                                    (reason) => (
                                      <span
                                        key={reason}
                                        className="px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold"
                                      >
                                        {reason}
                                      </span>
                                    )
                                  )}

                                </div>

                              </div>


                              <div className="mt-5 border-t border-slate-100 pt-5">

                                <p className="text-sm font-bold text-slate-900">
                                  Review Possible Matches
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  Save a decision for each possible duplicate relationship.
                                </p>


                                <div className="mt-4 space-y-4">

                                  {duplicateMatchesForSubmission.map(
                                    (match) => {
                                      const matchedSubmission =
                                        getSubmissionById(
                                          match.matched_submission_id
                                        );


                                      return (
                                        <div
                                          key={match.id}
                                          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                        >

                                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">

                                            <div>
                                              <p className="font-semibold text-slate-900">
                                                {
                                                  matchedSubmission?.submission_reference ||
                                                  matchedSubmission?.candidate_name ||
                                                  'Previous submission'
                                                }
                                              </p>

                                              <p className="text-xs text-slate-500 mt-1">
                                                Match Score:{' '}
                                                <span className="font-bold text-red-700">
                                                  {match.match_score}
                                                </span>
                                              </p>
                                            </div>


                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSearchTerm(
                                                  matchedSubmission?.submission_reference ||
                                                  matchedSubmission?.candidate_name ||
                                                  match.matched_submission_id
                                                );

                                                setStatusFilter('');

                                                window.scrollTo({
                                                  top: 0,
                                                  behavior: 'smooth',
                                                });
                                              }}
                                              className="text-xs font-semibold text-red-700 hover:text-red-800"
                                            >
                                              View Similar Submission
                                            </button>

                                          </div>


                                          <div className="mt-3 flex flex-wrap gap-2">

                                            {(match.match_reasons || []).map(
                                              (reason) => (
                                                <span
                                                  key={reason}
                                                  className="px-2.5 py-1 rounded-full bg-white border border-red-100 text-red-700 text-xs font-semibold"
                                                >
                                                  {reason}
                                                </span>
                                              )
                                            )}

                                          </div>


                                          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-3">

                                            <div>
                                              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                                                Admin Decision
                                              </label>

                                              <select
                                                value={
                                                  duplicateDecisionDraft[
                                                    match.id
                                                  ] ||
                                                  'unreviewed'
                                                }
                                                onChange={(e) =>
                                                  setDuplicateDecisionDraft(
                                                    (prev) => ({
                                                      ...prev,

                                                      [match.id]:
                                                        e.target.value,
                                                    })
                                                  )
                                                }
                                                className="input-field"
                                              >
                                                {duplicateReviewDecisions.map(
                                                  (decision) => (
                                                    <option
                                                      key={decision.value}
                                                      value={decision.value}
                                                    >
                                                      {decision.label}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>


                                            <div>
                                              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                                                Review Notes
                                              </label>

                                              <textarea
                                                value={
                                                  duplicateReviewNotesDraft[
                                                    match.id
                                                  ] || ''
                                                }
                                                onChange={(e) =>
                                                  setDuplicateReviewNotesDraft(
                                                    (prev) => ({
                                                      ...prev,

                                                      [match.id]:
                                                        e.target.value,
                                                    })
                                                  )
                                                }
                                                rows={3}
                                                placeholder="Example: Same mother submitted profiles for two sisters. Both records are valid."
                                                className="input-field resize-none"
                                              />
                                            </div>

                                          </div>


                                          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                            <div className="text-xs text-slate-400">

                                              {match.reviewed_at ? (
                                                <>
                                                  Reviewed:{' '}
                                                  {formatDate(
                                                    match.reviewed_at
                                                  )}

                                                  {match.reviewed_by_email
                                                    ? ` • ${match.reviewed_by_email}`
                                                    : ''}
                                                </>
                                              ) : (
                                                'Not reviewed yet'
                                              )}

                                            </div>


                                            <button
                                              type="button"
                                              onClick={() =>
                                                saveDuplicateReviewDecision(
                                                  match.id
                                                )
                                              }
                                              disabled={
                                                actionLoading ===
                                                `review-${match.id}`
                                              }
                                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
                                            >
                                              <CheckCircle className="w-4 h-4" />

                                              {actionLoading ===
                                              `review-${match.id}`
                                                ? 'Saving...'
                                                : 'Save Decision'}
                                            </button>

                                          </div>

                                        </div>
                                      );
                                    }
                                  )}

                                </div>

                              </div>

                            </div>
                          )}

                        </div>


                        {/* Private Notes */}
                        <div className="mt-4 rounded-xl bg-slate-900 p-5">

                          <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                            <Lock className="w-4 h-4 text-slate-300" />
                            Admin Private Notes
                          </label>


                          <textarea
                            value={
                              publicAdminNotesDraft[
                                submission.id
                              ] || ''
                            }
                            onChange={(e) =>
                              setPublicAdminNotesDraft(
                                (prev) => ({
                                  ...prev,

                                  [submission.id]:
                                    e.target.value,
                                })
                              )
                            }
                            rows={4}
                            placeholder="Call notes, family preferences, verification information, follow-up details..."
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 p-4 outline-none focus:ring-2 focus:ring-green-500 resize-none"
                          />


                          <button
                            type="button"
                            onClick={() =>
                              savePublicAdminNotes(
                                submission.id
                              )
                            }
                            disabled={
                              actionLoading ===
                              submission.id
                            }
                            className="mt-3 px-4 py-2 rounded-lg bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50"
                          >
                            Save Private Notes
                          </button>

                        </div>


                        {/* Current Assignment */}
                        {(submission.assigned_bureau_email ||
                          submission.assigned_matchmaker_name) && (
                          <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-5">

                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-700" />

                              <p className="font-bold text-green-900">
                                Current Assignment
                              </p>
                            </div>


                            <div className="mt-3 text-sm text-green-900 space-y-1">

                              <InfoLine
                                label="Bureau"
                                value={
                                  submission.assigned_bureau_email
                                }
                              />

                              <InfoLine
                                label="Matchmaker"
                                value={
                                  submission.assigned_matchmaker_name
                                }
                              />

                              <InfoLine
                                label="Assigned By"
                                value={
                                  submission.assigned_by_email
                                }
                              />

                              <InfoLine
                                label="Assigned At"
                                value={
                                  submission.assigned_at
                                    ? formatDate(
                                        submission.assigned_at
                                      )
                                    : null
                                }
                              />

                            </div>
                          </div>
                        )}


                        {/* Bureau Work Progress Monitoring */}
                        {submission.assigned_bureau_email && (
                          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-5">

                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">

                              <div>
                                <div className="flex items-center gap-2">
                                  <HeartHandshake className="w-5 h-5 text-blue-700" />

                                  <p className="font-bold text-blue-900">
                                    Bureau Work Progress
                                  </p>
                                </div>

                                <p className="text-sm text-blue-800 mt-1">
                                  Progress reported by{' '}
                                  <span className="font-semibold">
                                    {
                                      getBureauDisplayName(
                                        submission.assigned_bureau_email
                                      )
                                    }
                                  </span>
                                </p>
                              </div>


                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                                  bureauWork?.work_status ||
                                  submission.review_status
                                )}`}
                              >
                                {
                                  formatStatus(
                                    bureauWork?.work_status ||
                                    submission.review_status
                                  )
                                }
                              </span>

                            </div>


                            {!bureauWork ? (
                              <div className="mt-4 rounded-xl bg-white/80 border border-blue-100 p-4">
                                <p className="text-sm font-semibold text-slate-700">
                                  Bureau has not started its work log yet.
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  Status, private bureau notes, and follow-up dates will appear here after the assigned bureau saves its first work update.
                                </p>
                              </div>
                            ) : (
                              <>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">

                                  <div className="rounded-xl bg-white p-4 border border-blue-100">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                      Work Status
                                    </p>

                                    <p className="font-semibold text-slate-900 mt-2">
                                      {
                                        formatStatus(
                                          bureauWork.work_status
                                        )
                                      }
                                    </p>
                                  </div>


                                  <div className="rounded-xl bg-white p-4 border border-blue-100">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                      Last Follow-up
                                    </p>

                                    <p className="font-semibold text-slate-900 mt-2">
                                      {
                                        formatDate(
                                          bureauWork.last_follow_up_at
                                        )
                                      }
                                    </p>
                                  </div>


                                  <div className="rounded-xl bg-white p-4 border border-blue-100">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                      Next Follow-up
                                    </p>

                                    <p className="font-semibold text-slate-900 mt-2">
                                      {
                                        formatDate(
                                          bureauWork.next_follow_up_at
                                        )
                                      }
                                    </p>
                                  </div>

                                </div>


                                <div className="mt-4 rounded-xl bg-white border border-blue-100 p-4">

                                  <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-blue-700" />

                                    <p className="font-bold text-slate-900">
                                      Bureau Private Working Notes
                                    </p>
                                  </div>


                                  <p className="text-sm text-slate-600 mt-3 leading-relaxed whitespace-pre-wrap">
                                    {
                                      bureauWork.bureau_private_notes ||
                                      'No bureau private working notes have been saved yet.'
                                    }
                                  </p>


                                  <p className="text-xs text-slate-400 mt-3">
                                    Last updated:{' '}
                                    {
                                      formatDate(
                                        bureauWork.updated_at
                                      )
                                    }
                                  </p>

                                </div>

                              </>
                            )}


                            <div className="mt-4 rounded-xl bg-white border border-blue-100 p-4">

                              <div className="flex items-center justify-between gap-3">

                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-purple-700" />

                                  <p className="font-bold text-slate-900">
                                    Bureau Follow-up Timeline
                                  </p>
                                </div>


                                <span className="text-xs font-semibold text-slate-500">
                                  {bureauFollowUps.length} note(s)
                                </span>

                              </div>


                              {bureauFollowUps.length === 0 ? (
                                <p className="text-sm text-slate-500 mt-4">
                                  No follow-up history has been added by the bureau yet.
                                </p>
                              ) : (
                                <div className="mt-4 space-y-4">

                                  {bureauFollowUps.map(
                                    (followUp) => (
                                      <div
                                        key={followUp.id}
                                        className="relative pl-5 border-l-2 border-purple-200"
                                      >

                                        <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-purple-600" />


                                        <div className="rounded-xl bg-slate-50 p-4">

                                          <div className="flex flex-wrap items-center justify-between gap-2">

                                            <span
                                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass(
                                                followUp.status_at_time
                                              )}`}
                                            >
                                              {
                                                formatStatus(
                                                  followUp.status_at_time
                                                )
                                              }
                                            </span>


                                            <span className="text-xs text-slate-400">
                                              {
                                                formatDate(
                                                  followUp.created_at
                                                )
                                              }
                                            </span>

                                          </div>


                                          <p className="text-sm text-slate-700 mt-3 leading-relaxed whitespace-pre-wrap">
                                            {followUp.note}
                                          </p>


                                          <p className="text-xs text-slate-400 mt-2">
                                            Bureau:{' '}
                                            {
                                              getBureauDisplayName(
                                                followUp.bureau_email
                                              )
                                            }
                                          </p>

                                        </div>

                                      </div>
                                    )
                                  )}

                                </div>
                              )}

                            </div>

                          </div>
                        )}

                      </div>


                      {/* Right Controls */}
                      <div className="2xl:w-80 space-y-4">


                        {/* Status */}
                        <div className="rounded-xl border border-slate-200 p-4">

                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">
                            Workflow Status
                          </p>


                          <select
                            value={
                              submission.review_status ||
                              'new'
                            }
                            onChange={(e) =>
                              updatePublicSubmissionStatus(
                                submission.id,
                                e.target.value
                              )
                            }
                            disabled={
                              actionLoading ===
                              submission.id
                            }
                            className="input-field"
                          >
                            {publicSubmissionStatuses.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {
                                    formatStatus(
                                      status
                                    )
                                  }
                                </option>
                              )
                            )}
                          </select>

                        </div>


                        {/* Assign to Bureau */}
                        <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                          <div className="flex items-center gap-2 mb-3">
                            <Building2 className="w-5 h-5 text-green-700" />

                            <p className="font-bold text-green-900">
                              Assign to Bureau
                            </p>
                          </div>


                          <select
                            value={
                              bureauAssignmentDraft[
                                submission.id
                              ] || ''
                            }
                            onChange={(e) =>
                              setBureauAssignmentDraft(
                                (prev) => ({
                                  ...prev,

                                  [submission.id]:
                                    e.target.value,
                                })
                              )
                            }
                            className="input-field"
                          >
                            <option value="">
                              Select Approved Bureau
                            </option>


                            {approvedBureaus.map(
                              (bureau) => (
                                <option
                                  key={bureau.id}
                                  value={
                                    bureau.email ||
                                    ''
                                  }
                                >
                                  {
                                    bureau.business_name ||
                                    bureau.full_name ||
                                    bureau.email
                                  }
                                  {
                                    bureau.city
                                      ? ` — ${bureau.city}`
                                      : ''
                                  }
                                </option>
                              )
                            )}

                          </select>


                          <button
                            type="button"
                            onClick={() =>
                              assignSubmissionToBureau(
                                submission.id
                              )
                            }
                            disabled={
                              actionLoading ===
                              submission.id
                            }
                            className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-700 text-white text-sm font-semibold hover:bg-green-800 disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                            Assign to Bureau
                          </button>

                        </div>


                        {/* Assign Matchmaker */}
                        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">

                          <div className="flex items-center gap-2 mb-3">
                            <HeartHandshake className="w-5 h-5 text-purple-700" />

                            <p className="font-bold text-purple-900">
                              Assign Matchmaker
                            </p>
                          </div>


                          <input
                            value={
                              matchmakerAssignmentDraft[
                                submission.id
                              ] || ''
                            }
                            onChange={(e) =>
                              setMatchmakerAssignmentDraft(
                                (prev) => ({
                                  ...prev,

                                  [submission.id]:
                                    e.target.value,
                                })
                              )
                            }
                            placeholder="Matchmaker name"
                            className="input-field"
                          />


                          <button
                            type="button"
                            onClick={() =>
                              assignSubmissionToMatchmaker(
                                submission.id
                              )
                            }
                            disabled={
                              actionLoading ===
                              submission.id
                            }
                            className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-700 text-white text-sm font-semibold hover:bg-purple-800 disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                            Assign Matchmaker
                          </button>

                        </div>


                        {/* Convert to Network Profile */}
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-blue-700" />

                            <p className="font-bold text-blue-900">
                              Network Profile
                            </p>
                          </div>


                          {submission.converted_to_profile ? (
                            <div>

                              <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-5 h-5" />

                                <p className="font-semibold">
                                  Already Converted
                                </p>
                              </div>


                              <p className="text-xs text-slate-500 mt-2">
                                This public submission already has a profile in the MBN network.
                              </p>


                              {submission.converted_at && (
                                <p className="text-xs text-slate-400 mt-2">
                                  Converted: {formatDate(submission.converted_at)}
                                </p>
                              )}


                              {conversionResult[submission.id]?.profileCode && (
                                <div className="mt-3 rounded-lg bg-white border border-blue-200 p-3">
                                  <p className="text-xs text-slate-500">
                                    Generated Profile ID
                                  </p>

                                  <p className="font-bold text-blue-900 mt-1">
                                    {
                                      conversionResult[submission.id]
                                        .profileCode
                                    }
                                  </p>
                                </div>
                              )}

                            </div>
                          ) : (
                            <>

                              <p className="text-sm text-blue-800 leading-relaxed">
                                Convert this reviewed submission into an active searchable profile in the MBN bureau network.
                              </p>


                              <button
                                type="button"
                                onClick={() =>
                                  convertPublicSubmission(
                                    submission.id
                                  )
                                }
                                disabled={
                                  actionLoading === submission.id ||
                                  ![
                                    'approved_for_matching',
                                    'assigned',
                                    'matching_active',
                                    'potential_match_found',
                                    'in_discussion',
                                  ].includes(
                                    submission.review_status || ''
                                  )
                                }
                                className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <FileText className="w-4 h-4" />

                                {
                                  actionLoading === submission.id
                                    ? 'Converting...'
                                    : 'Convert to Network Profile'
                                }
                              </button>


                              {![
                                'approved_for_matching',
                                'assigned',
                                'matching_active',
                                'potential_match_found',
                                'in_discussion',
                              ].includes(
                                submission.review_status || ''
                              ) && (
                                <p className="text-xs text-amber-700 mt-2">
                                  Approve this submission for matching before conversion.
                                </p>
                              )}

                            </>
                          )}

                        </div>


                        {/* Consent */}
                        <div className="rounded-xl bg-slate-50 p-4">

                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">
                            Consent Record
                          </p>


                          <div className="space-y-3 text-sm">

                            <div className="flex items-center gap-2">
                              {submission.consent_to_store ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}

                              <span>
                                Data Storage Consent
                              </span>
                            </div>


                            <div className="flex items-center gap-2">
                              {submission.consent_to_share ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}

                              <span>
                                Matchmaking Share Consent
                              </span>
                            </div>

                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              }
            )}


            {filteredPublicSubmissions.length ===
              0 && (
              <EmptyState text="No public profile submissions found." />
            )}

          </div>
        </div>
      )}


      {/* Bureau Requests */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <SectionHeader
            title="Bureau Requests / Applications"
            count={
              filteredApplications.length
            }
            subtitle="Approve, reject, and review bureau applications"
          />


          <div className="divide-y divide-slate-100">

            {filteredApplications.map(
              (app) => {

                const whatsappLink =
                  getWhatsAppLink(
                    app.whatsapp_number
                  );


                return (
                  <div
                    key={app.id}
                    className="p-6"
                  >

                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-heading text-2xl font-bold text-slate-900">
                            {
                              app.business_name ||
                              'Unnamed Bureau'
                            }
                          </h3>


                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                              app.status
                            )}`}
                          >
                            {
                              app.status ||
                              'pending'
                            }
                          </span>

                        </div>


                        <p className="text-sm text-slate-400 mt-1">
                          Applied:{' '}
                          {
                            formatDate(
                              app.created_at
                            )
                          }
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

                              <InfoLine
                                label="Full Name"
                                value={
                                  app.full_name
                                }
                              />

                              <InfoLine
                                label="Role"
                                value={
                                  app.role_in_bureau
                                }
                              />

                              <InfoLine
                                label="CNIC"
                                value={
                                  app.cnic
                                }
                              />

                              <InfoLine
                                label="Email"
                                value={
                                  app.email
                                }
                              />

                              <InfoLine
                                label="Mobile"
                                value={
                                  app.mobile_number
                                }
                              />

                              <InfoLine
                                label="WhatsApp"
                                value={
                                  app.whatsapp_number
                                }
                              />

                            </div>


                            <div className="mt-4 flex flex-wrap gap-2">

                              {app.email && (
                                <a
                                  href={`mailto:${app.email}`}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700"
                                >
                                  <Mail className="w-4 h-4" />
                                  Email
                                </a>
                              )}


                              {app.mobile_number && (
                                <a
                                  href={`tel:${app.mobile_number}`}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700"
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
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold"
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
                                value={
                                  app.business_name
                                }
                              />

                              <InfoLine
                                label="Years in Business"
                                value={
                                  app.years_in_business
                                }
                              />

                              <InfoLine
                                label="Active Profiles"
                                value={
                                  app.active_profiles
                                }
                              />

                              <InfoLine
                                label="Physical Office"
                                value={
                                  app.has_physical_office
                                }
                              />

                              <InfoLine
                                label="Office Phone"
                                value={
                                  app.office_phone
                                }
                              />

                            </div>
                          </div>


                          <div className="rounded-xl bg-amber-50 p-4">

                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-5 h-5 text-amber-700" />

                              <p className="font-bold text-amber-900">
                                Location
                              </p>
                            </div>


                            <div className="space-y-2 text-sm text-amber-900">

                              <InfoLine
                                label="City"
                                value={
                                  app.city
                                }
                              />

                              <InfoLine
                                label="Province"
                                value={
                                  app.province
                                }
                              />

                              <InfoLine
                                label="Country"
                                value={
                                  app.country
                                }
                              />

                              <InfoLine
                                label="Areas Served"
                                value={
                                  app.areas_served
                                }
                              />

                            </div>
                          </div>

                        </div>


                        <div className="mt-4 rounded-xl bg-slate-50 p-4">

                          <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                            <NotebookPen className="w-4 h-4 text-slate-500" />
                            Admin Notes
                          </label>


                          <textarea
                            value={
                              adminNotesDraft[
                                app.id
                              ] || ''
                            }
                            onChange={(e) =>
                              setAdminNotesDraft(
                                (prev) => ({
                                  ...prev,

                                  [app.id]:
                                    e.target.value,
                                })
                              )
                            }
                            rows={3}
                            placeholder="Add internal notes..."
                            className="input-field resize-none"
                          />


                          <button
                            type="button"
                            onClick={() =>
                              saveAdminNotes(
                                app.id
                              )
                            }
                            disabled={
                              actionLoading ===
                              app.id
                            }
                            className="mt-3 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-50"
                          >
                            Save Notes
                          </button>

                        </div>
                      </div>


                      <div className="xl:w-56 flex xl:flex-col flex-wrap gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            updateApplicationStatus(
                              app.id,
                              'approved'
                            )
                          }
                          disabled={
                            actionLoading ===
                            app.id
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-700 text-white text-sm font-semibold disabled:opacity-50"
                        >
                          <UserCheck className="w-4 h-4" />
                          Approve
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            updateApplicationStatus(
                              app.id,
                              'rejected'
                            )
                          }
                          disabled={
                            actionLoading ===
                            app.id
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:opacity-50"
                        >
                          <UserX className="w-4 h-4" />
                          Reject
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            updateApplicationStatus(
                              app.id,
                              'pending'
                            )
                          }
                          disabled={
                            actionLoading ===
                            app.id
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold disabled:opacity-50"
                        >
                          <Clock className="w-4 h-4" />
                          Pending
                        </button>

                      </div>
                    </div>
                  </div>
                );
              }
            )}


            {filteredApplications.length ===
              0 && (
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
            count={
              filteredProfiles.length
            }
            subtitle="Activate, deactivate, and control photo privacy"
          />


          <div className="divide-y divide-slate-100">

            {filteredProfiles.map(
              (profile) => (
                <div
                  key={profile.id}
                  className="p-6"
                >

                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">


                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-heading text-xl font-bold text-slate-900">
                          {
                            profile.profile_code ||
                            profile.candidate_name ||
                            'Marriage Profile'
                          }
                        </h3>


                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                            profile.status
                          )}`}
                        >
                          {
                            profile.status ||
                            'active'
                          }
                        </span>


                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 capitalize">
                          Photo:{' '}
                          {
                            profile.photo_visibility ||
                            'public'
                          }
                        </span>

                      </div>


                      <p className="text-xs text-slate-400 mt-1">
                        Created:{' '}
                        {
                          formatDate(
                            profile.created_at
                          )
                        }
                      </p>


                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">


                        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">

                          <p className="font-bold text-slate-900 mb-2">
                            Candidate
                          </p>

                          <InfoLine
                            label="Gender"
                            value={
                              profile.gender
                            }
                          />

                          <InfoLine
                            label="Age"
                            value={
                              profile.age
                            }
                          />

                          <InfoLine
                            label="Marital"
                            value={
                              profile.marital_status
                            }
                          />

                          <InfoLine
                            label="Caste"
                            value={
                              profile.caste
                            }
                          />

                          <InfoLine
                            label="Sect"
                            value={
                              profile.sect
                            }
                          />

                        </div>


                        <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">

                          <p className="font-bold mb-2">
                            Education / Work
                          </p>

                          <InfoLine
                            label="Education"
                            value={
                              profile.education
                            }
                          />

                          <InfoLine
                            label="Profession"
                            value={
                              profile.profession
                            }
                          />

                          <InfoLine
                            label="Employment"
                            value={
                              profile.employment_status
                            }
                          />

                        </div>


                        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">

                          <p className="font-bold mb-2">
                            Location / Uploader
                          </p>

                          <InfoLine
                            label="City"
                            value={
                              profile.city
                            }
                          />

                          <InfoLine
                            label="Province"
                            value={
                              profile.province
                            }
                          />

                          <InfoLine
                            label="Uploader"
                            value={
                              profile.bureau_email
                            }
                          />

                        </div>

                      </div>
                    </div>


                    <div className="xl:w-64 space-y-2">

                      <button
                        type="button"
                        onClick={() =>
                          updateProfileStatus(
                            profile.id,
                            'active'
                          )
                        }
                        disabled={
                          actionLoading ===
                          profile.id
                        }
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm font-semibold disabled:opacity-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Activate Profile
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          updateProfileStatus(
                            profile.id,
                            'inactive'
                          )
                        }
                        disabled={
                          actionLoading ===
                          profile.id
                        }
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm font-semibold disabled:opacity-50"
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
                              updateProfilePhotoVisibility(
                                profile.id,
                                'public'
                              )
                            }
                            disabled={
                              actionLoading ===
                              profile.id
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 text-slate-700 text-sm font-semibold"
                          >
                            Public
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              updateProfilePhotoVisibility(
                                profile.id,
                                'blurred'
                              )
                            }
                            disabled={
                              actionLoading ===
                              profile.id
                            }
                            className="w-full px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold"
                          >
                            Blur
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              updateProfilePhotoVisibility(
                                profile.id,
                                'hidden'
                              )
                            }
                            disabled={
                              actionLoading ===
                              profile.id
                            }
                            className="w-full px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-semibold"
                          >
                            Hide
                          </button>

                        </div>
                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          deleteNetworkProfile(profile)
                        }
                        disabled={
                          actionLoading ===
                          profile.id
                        }
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-700 text-white text-sm font-semibold hover:bg-red-800 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete from Database
                      </button>


                    </div>
                  </div>
                </div>
              )
            )}


            {filteredProfiles.length ===
              0 && (
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
            count={
              filteredMessages.length
            }
            subtitle="Public contact form messages"
          />


          <div className="divide-y divide-slate-100">

            {filteredMessages.map(
              (message) => (
                <div
                  key={message.id}
                  className="p-6"
                >

                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">


                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-heading text-xl font-bold text-slate-900">
                          {
                            message.full_name ||
                            'No name'
                          }
                        </h3>


                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                            message.status
                          )}`}
                        >
                          {
                            message.status ||
                            'new'
                          }
                        </span>

                      </div>


                      <p className="text-xs text-slate-400 mt-1">
                        Received:{' '}
                        {
                          formatDate(
                            message.created_at
                          )
                        }
                      </p>


                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">

                        <div className="rounded-xl bg-slate-50 p-4">

                          <InfoLine
                            label="Email"
                            value={
                              message.email
                            }
                          />

                          <InfoLine
                            label="Phone"
                            value={
                              message.phone
                            }
                          />

                          <InfoLine
                            label="Bureau"
                            value={
                              message.bureau_name
                            }
                          />

                        </div>


                        <div className="rounded-xl bg-green-50 p-4 text-green-900">

                          <p className="font-bold mb-2">
                            Message
                          </p>

                          <p className="leading-relaxed">
                            {
                              message.message ||
                              'No message'
                            }
                          </p>

                        </div>
                      </div>
                    </div>


                    <div className="xl:w-52 flex xl:flex-col flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          updateMessageStatus(
                            message.id,
                            'new'
                          )
                        }
                        disabled={
                          actionLoading ===
                          message.id
                        }
                        className="px-4 py-3 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold"
                      >
                        New
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          updateMessageStatus(
                            message.id,
                            'reviewed'
                          )
                        }
                        disabled={
                          actionLoading ===
                          message.id
                        }
                        className="px-4 py-3 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold"
                      >
                        Reviewed
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          updateMessageStatus(
                            message.id,
                            'closed'
                          )
                        }
                        disabled={
                          actionLoading ===
                          message.id
                        }
                        className="px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm font-semibold"
                      >
                        Closed
                      </button>

                    </div>
                  </div>
                </div>
              )
            )}


            {filteredMessages.length ===
              0 && (
              <EmptyState text="No contact messages found." />
            )}

          </div>
        </div>
      )}



      {/* Bureau Control */}
      {activeTab === 'bureau-control' && (
        <div className="space-y-6">

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <SectionHeader
              title="Bureau Control & Safety"
              count={applications.filter((app) => app.status === 'approved').length}
              subtitle="Flag bureaus, add warning notes, suspend contact reveal, and set daily contact view limits"
            />

            <div className="divide-y divide-slate-100">
              {applications
                .filter((app) => app.status === 'approved')
                .map((bureau) => {
                  const control = getBureauControl(bureau.email);
                  const signals = getBureauWarningSignals(bureau.email);
                  const todayViews = getContactViewsToday(bureau.email);

                  return (
                    <div key={bureau.id} className="p-6">
                      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-heading text-lg font-bold text-slate-900">
                              {bureau.business_name || bureau.full_name || bureau.email}
                            </h3>

                            {control?.is_flagged && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                                <Flag className="w-3.5 h-3.5" />
                                Flagged
                              </span>
                            )}

                            {control?.contact_reveal_suspended && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                                <Ban className="w-3.5 h-3.5" />
                                Contact Reveal Suspended
                              </span>
                            )}
                          </div>

                          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600">
                            <p>Email: <span className="font-semibold text-slate-900">{bureau.email || 'N/A'}</span></p>
                            <p>City: <span className="font-semibold text-slate-900">{bureau.city || 'N/A'}</span></p>
                            <p>Views today: <span className="font-semibold text-slate-900">{todayViews}</span></p>
                          </div>

                          {signals.length > 0 && (
                            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                              <p className="font-bold text-amber-900 text-sm">Warning Signals</p>
                              <ul className="mt-2 space-y-1 text-sm text-amber-800 list-disc pl-5">
                                {signals.map((signal) => (
                                  <li key={signal}>{signal}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="xl:w-[460px] space-y-3">
                          <textarea
                            value={bureauWarningDraft[bureau.email || ''] ?? control?.warning_note ?? ''}
                            onChange={(e) => setBureauWarningDraft((prev) => ({ ...prev, [bureau.email || '']: e.target.value }))}
                            rows={3}
                            placeholder="Add warning note for this bureau..."
                            className="input-field resize-none"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="number"
                              min="1"
                              value={bureauLimitDraft[bureau.email || ''] ?? control?.daily_contact_view_limit ?? ''}
                              onChange={(e) => setBureauLimitDraft((prev) => ({ ...prev, [bureau.email || '']: e.target.value }))}
                              placeholder="Daily contact view limit"
                              className="input-field"
                            />

                            <button
                              type="button"
                              onClick={() => saveBureauControl(bureau, {
                                warning_note: bureauWarningDraft[bureau.email || ''] || null,
                                daily_contact_view_limit: bureauLimitDraft[bureau.email || ''] ? Number(bureauLimitDraft[bureau.email || '']) : 20,
                              })}
                              disabled={actionLoading === bureau.email}
                              className="px-4 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50"
                            >
                              Save Note / Limit
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => saveBureauControl(bureau, { is_flagged: !control?.is_flagged })}
                              disabled={actionLoading === bureau.email}
                              className={`px-4 py-3 rounded-lg font-semibold disabled:opacity-50 ${control?.is_flagged ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                            >
                              {control?.is_flagged ? 'Remove Flag' : 'Flag Bureau'}
                            </button>

                            <button
                              type="button"
                              onClick={() => saveBureauControl(bureau, { contact_reveal_suspended: !control?.contact_reveal_suspended })}
                              disabled={actionLoading === bureau.email}
                              className={`px-4 py-3 rounded-lg font-semibold disabled:opacity-50 ${control?.contact_reveal_suspended ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
                            >
                              {control?.contact_reveal_suspended ? 'Resume Contact Reveal' : 'Suspend Contact Reveal'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {applications.filter((app) => app.status === 'approved').length === 0 && (
                <EmptyState text="No approved bureaus found." />
              )}
            </div>
          </div>
        </div>
      )}


      {/* Premium Payments */}
      {activeTab === 'premium-payments' && (
        <div className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            <StatCard title="Premium Orders" value={premiumOrders.length} subtitle="All orders" icon={<CreditCard className="w-6 h-6 text-green-700" />} bg="bg-green-50" />
            <StatCard title="Pending Payments" value={premiumOrders.filter((order) => order.payment_status === 'pending').length} subtitle="Need approval" icon={<Clock className="w-6 h-6 text-amber-700" />} bg="bg-amber-50" />
            <StatCard title="Approved Payments" value={premiumOrders.filter((order) => order.payment_status === 'approved').length} subtitle="Paid" icon={<CheckCircle className="w-6 h-6 text-blue-700" />} bg="bg-blue-50" />
            <StatCard title="Rejected Payments" value={premiumOrders.filter((order) => order.payment_status === 'rejected').length} subtitle="Declined" icon={<Ban className="w-6 h-6 text-red-700" />} bg="bg-red-50" />
            <StatCard title="Revenue PKR" value={premiumOrders.filter((order) => order.payment_status === 'approved').reduce((sum, order) => sum + (order.amount_pkr || 0), 0)} subtitle="Approved only" icon={<TrendingUp className="w-6 h-6 text-purple-700" />} bg="bg-purple-50" />
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={addManualPayment} disabled={actionLoading === 'manual-payment'} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-50">
              <PlusCircle className="w-4 h-4" />
              Add Manual Payment
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <SectionHeader title="Premium Orders" count={premiumOrders.length} subtitle="Pending, approved, rejected, expired, and active premium users" />

            <div className="divide-y divide-slate-100">
              {premiumOrders.map((order) => {
                const isExpired = order.expiry_date ? new Date(order.expiry_date) < new Date() : false;

                return (
                  <div key={order.id} className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-lg font-bold text-slate-900">
                            {order.customer_name || order.profile_reference || 'Premium Order'}
                          </h3>
                          <StatusBadge status={isExpired ? 'expired' : order.payment_status || 'pending'} />
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 text-sm text-slate-600">
                          <p>Plan: <span className="font-semibold text-slate-900">{order.plan_type || 'N/A'}</span></p>
                          <p>Amount: <span className="font-semibold text-slate-900">{order.amount_pkr || 0} PKR</span></p>
                          <p>Method: <span className="font-semibold text-slate-900">{order.payment_method || 'N/A'}</span></p>
                          <p>Transaction: <span className="font-semibold text-slate-900">{order.transaction_id || 'N/A'}</span></p>
                          <p>Start: <span className="font-semibold text-slate-900">{formatDate(order.start_date)}</span></p>
                          <p>Expiry: <span className="font-semibold text-slate-900">{formatDate(order.expiry_date)}</span></p>
                          <p>Phone: <span className="font-semibold text-slate-900">{order.customer_phone || 'N/A'}</span></p>
                          <p>Reference: <span className="font-semibold text-slate-900">{order.profile_reference || 'N/A'}</span></p>
                        </div>

                        {order.payment_screenshot_url && (
                          <a href={order.payment_screenshot_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-green-700 hover:underline">
                            View payment screenshot
                          </a>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => updatePremiumOrder(order.id, { payment_status: 'approved', start_date: order.start_date || new Date().toISOString().slice(0, 10) })} disabled={actionLoading === order.id} className="px-4 py-3 rounded-lg bg-green-50 text-green-700 font-semibold hover:bg-green-100 disabled:opacity-50">Approve</button>
                        <button type="button" onClick={() => updatePremiumOrder(order.id, { payment_status: 'rejected' })} disabled={actionLoading === order.id} className="px-4 py-3 rounded-lg bg-red-50 text-red-700 font-semibold hover:bg-red-100 disabled:opacity-50">Reject</button>
                        <button type="button" onClick={() => {
                          const days = Number(window.prompt('Extend by how many days?', '30') || '30');
                          const expiry = order.expiry_date ? new Date(order.expiry_date) : new Date();
                          expiry.setDate(expiry.getDate() + days);
                          updatePremiumOrder(order.id, { payment_status: 'approved', expiry_date: expiry.toISOString().slice(0, 10) });
                        }} disabled={actionLoading === order.id} className="px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 disabled:opacity-50">Extend Plan</button>
                        <button type="button" onClick={() => updatePremiumOrder(order.id, { payment_status: 'cancelled' })} disabled={actionLoading === order.id} className="px-4 py-3 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 disabled:opacity-50">Cancel</button>
                        <button type="button" onClick={() => {
                          const newPlan = window.prompt('Upgrade to plan?', order.plan_type || 'Verified Premium');
                          if (!newPlan) return;
                          updatePremiumOrder(order.id, { plan_type: newPlan, payment_status: 'approved' });
                        }} disabled={actionLoading === order.id} className="col-span-2 px-4 py-3 rounded-lg bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 disabled:opacity-50">Upgrade Plan</button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {premiumOrders.length === 0 && (
                <EmptyState text="No premium orders found." />
              )}
            </div>
          </div>
        </div>
      )}


      {/* Reports & Export */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-heading text-xl font-bold text-slate-900">Reports & CSV Export</h2>
            <p className="text-sm text-slate-500 mt-1">Download operational reports for bureaus, profiles, submissions, contact logs, premium payments, and monthly performance.</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <ExportButton label="Export Bureaus" onClick={() => downloadCsv('mbn-bureaus.csv', applications.map((app) => ({ business_name: app.business_name, full_name: app.full_name, email: app.email, mobile: app.mobile_number, whatsapp: app.whatsapp_number, city: app.city, province: app.province, status: app.status, created_at: app.created_at })))} />
              <ExportButton label="Export Profiles" onClick={() => downloadCsv('mbn-profiles.csv', profiles.map((profile) => ({ profile_code: profile.profile_code, candidate_name: profile.candidate_name, gender: profile.gender, age: profile.age, city: profile.city, province: profile.province, caste: profile.caste, sect: profile.sect, education: profile.education, profession: profile.profession, bureau_email: profile.bureau_email, status: profile.status, created_at: profile.created_at })))} />
              <ExportButton label="Export Public Submissions" onClick={() => downloadCsv('mbn-public-submissions.csv', publicSubmissions.map((submission) => ({ reference: submission.submission_reference, submitter: submission.submitter_full_name, mobile: submission.submitter_mobile, candidate_name: submission.candidate_name, gender: submission.gender, age: submission.age, city: submission.city, province: submission.province, status: submission.review_status, assigned_bureau: submission.assigned_bureau_email, converted: submission.converted_to_profile, submitted_at: submission.submitted_at })))} />
              <ExportButton label="Export Contact Logs" onClick={() => downloadCsv('mbn-contact-logs.csv', logs.map((log) => ({ viewer_email: log.viewer_email, viewer_business_name: log.viewer_business_name, profile_code: log.profile_code, candidate_name: log.profile_candidate_name, gender: log.profile_gender, uploader_email: log.uploader_email, uploader_business_name: log.uploader_business_name, viewed_at: log.viewed_at })))} />
              <ExportButton label="Export Premium Payments" onClick={() => downloadCsv('mbn-premium-payments.csv', premiumOrders.map((order) => ({ customer_name: order.customer_name, phone: order.customer_phone, profile_reference: order.profile_reference, plan_type: order.plan_type, amount_pkr: order.amount_pkr, method: order.payment_method, status: order.payment_status, transaction_id: order.transaction_id, start_date: order.start_date, expiry_date: order.expiry_date, created_at: order.created_at })))} />
              <ExportButton label="Export Monthly Report" onClick={exportMonthlyReport} />
            </div>
          </div>
        </div>
      )}


      {/* Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <SectionHeader
            title="Contact View Logs"
            count={
              filteredLogs.length
            }
            subtitle="Who viewed whose contact"
          />


          <div className="divide-y divide-slate-100">

            {filteredLogs.map(
              (log) => (
                <div
                  key={log.id}
                  className="p-6"
                >

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                    <div className="p-4 rounded-xl bg-blue-50">

                      <p className="font-bold text-blue-900 mb-2">
                        Viewer Bureau
                      </p>

                      <p className="text-sm text-blue-900">
                        {
                          log.viewer_business_name ||
                          'N/A'
                        }
                      </p>

                      <p className="text-xs text-blue-700 mt-1">
                        {
                          log.viewer_email ||
                          'N/A'
                        }
                      </p>

                    </div>


                    <div className="p-4 rounded-xl bg-green-50">

                      <p className="font-bold text-green-900 mb-2">
                        Viewed Profile
                      </p>

                      <p className="text-sm text-green-900">
                        {
                          log.profile_code ||
                          'N/A'
                        }
                      </p>

                      <p className="text-xs text-green-700 mt-1">
                        {
                          log.profile_gender ||
                          'N/A'
                        }
                      </p>

                    </div>


                    <div className="p-4 rounded-xl bg-amber-50">

                      <p className="font-bold text-amber-900 mb-2">
                        Uploader Bureau
                      </p>

                      <p className="text-sm text-amber-900">
                        {
                          log.uploader_business_name ||
                          'N/A'
                        }
                      </p>

                      <p className="text-xs text-amber-700 mt-1">
                        {
                          log.uploader_email ||
                          'N/A'
                        }
                      </p>

                    </div>

                  </div>


                  <p className="text-xs text-slate-400 mt-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {
                      formatDate(
                        log.viewed_at
                      )
                    }
                  </p>

                </div>
              )
            )}


            {filteredLogs.length ===
              0 && (
              <EmptyState text="No logs found." />
            )}

          </div>
        </div>
      )}

    </div>
  );
}

function SmartAlertCard({
  title,
  value,
  action,
  danger = false,
  onClick,
}: {
  title: string;
  value: number;
  action: string;
  danger?: boolean;
  onClick: () => void;
}) {
  const hasUrgentItems = value > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 ${
        danger && hasUrgentItems
          ? 'border-amber-200 bg-amber-50 hover:bg-amber-100'
          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-3xl font-black text-slate-900">
            {value}
          </p>

          <p className="text-sm font-bold text-slate-800 mt-1">
            {title}
          </p>

          <p
            className={`text-xs mt-2 ${
              danger && hasUrgentItems
                ? 'text-amber-700'
                : 'text-slate-500'
            }`}
          >
            {hasUrgentItems ? action : 'Open section'}
          </p>
        </div>

        <ArrowRight
          className={`w-4 h-4 mt-1 ${
            danger && hasUrgentItems
              ? 'text-amber-700'
              : 'text-slate-400'
          }`}
        />
      </div>
    </button>
  );
}

function ExportButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 hover:bg-slate-100"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );
}

