'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  MapPin, GraduationCap, Briefcase, Users, Phone,
  Shield, ArrowLeft, Eye, MessageCircle, CheckCircle, AlertCircle
} from 'lucide-react';
import { profileAPI } from '@/lib/api';

interface Profile {
  id: string;
  profileId: string;
  gender: string;
  age: number;
  city?: string;
  province?: string;
  country?: string;
  caste?: string;
  sect?: string;
  maritalStatus: string;
  religion?: string;
  qualification?: string;
  occupation?: string;
  employmentType?: string;
  monthlyIncomePkr?: number;
  isOverseas?: boolean;
  additionalInfo?: string;
  photoPrivacy: string;
  status: string;
  uploadedBy: {
    businessName: string;
    city?: string;
    badges?: { badgeType: string }[];
    mobileNumber?: string;
  };
  photos?: { url: string; isPrimary: boolean; privacy: string }[];
}

const MARITAL_LABELS: Record<string, string> = {
  NEVER_MARRIED: 'Never Married',
  DIVORCED: 'Divorced',
  WIDOWED: 'Widowed',
  SEPARATED: 'Separated',
};

export default function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealedContact, setRevealedContact] = useState<{ mobileNumber?: string; businessName: string } | null>(null);
  const [revealError, setRevealError] = useState('');

  useEffect(() => {
    profileAPI.getById(id)
      .then((res) => setProfile(res.data.data))
      .catch(() => router.push('/search'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleRevealContact = async () => {
    setRevealLoading(true);
    setRevealError('');
    try {
      const res = await profileAPI.revealContact(id);
      setRevealedContact(res.data.data);
    } catch (err: unknown) {
      setRevealError(
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Unable to reveal contact. Please try again.'
      );
    } finally {
      setRevealLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="card p-6 h-48 skeleton" />
        <div className="card p-6 h-32 skeleton" />
      </div>
    );
  }

  if (!profile) return null;

  const primaryPhoto = profile.photos?.find((p) => p.isPrimary);
  const canShowPhoto = primaryPhoto && primaryPhoto.privacy === 'PUBLIC';
  const badges = profile.uploadedBy.badges ?? [];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to results
      </button>

      {/* Header card */}
      <div className="card p-6 mb-4">
        <div className="flex gap-5">
          {/* Photo */}
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
            {canShowPhoto ? (
              <Image
                src={primaryPhoto.url}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-2">
                <Eye className="w-6 h-6 mb-1 opacity-40" />
                <span>Photo not available</span>
              </div>
            )}
          </div>

          {/* Basic info */}
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md font-semibold">
                    {profile.profileId}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    profile.gender === 'MALE' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                  }`}>
                    {profile.gender === 'MALE' ? '♂ Male' : '♀ Female'}
                  </span>
                  {profile.isOverseas && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                      ✈ Overseas
                    </span>
                  )}
                </div>
                <h1 className="font-heading text-xl font-semibold text-slate-900 mt-2">
                  {profile.age} years — {MARITAL_LABELS[profile.maritalStatus] ?? profile.maritalStatus}
                </h1>
                <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{[profile.city, profile.province, profile.country].filter(Boolean).join(', ') || 'Location not specified'}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.religion && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{profile.religion}</span>}
              {profile.sect && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{profile.sect}</span>}
              {profile.caste && <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md">{profile.caste}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Education */}
        {profile.qualification && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3 text-slate-700">
              <GraduationCap className="w-4 h-4 text-green-600" />
              <h3 className="font-semibold text-sm">Education</h3>
            </div>
            <p className="text-slate-800">{profile.qualification}</p>
          </div>
        )}

        {/* Career */}
        {(profile.occupation || profile.employmentType) && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3 text-slate-700">
              <Briefcase className="w-4 h-4 text-green-600" />
              <h3 className="font-semibold text-sm">Career</h3>
            </div>
            <p className="text-slate-800">{profile.occupation || profile.employmentType}</p>
            {profile.monthlyIncomePkr && profile.monthlyIncomePkr > 0 && (
              <p className="text-sm text-slate-500 mt-1">
                PKR {profile.monthlyIncomePkr.toLocaleString()}/month
              </p>
            )}
          </div>
        )}
      </div>

      {/* Additional info */}
      {profile.additionalInfo && (
        <div className="card p-5 mb-4">
          <h3 className="font-semibold text-sm text-slate-700 mb-2">Additional Information</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{profile.additionalInfo}</p>
        </div>
      )}

      {/* Posted by / Contact Reveal */}
      <div className="card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Users className="w-4 h-4" />
              <span>Posted by</span>
            </div>
            <p className="font-semibold text-slate-900">{profile.uploadedBy.businessName}</p>
            {profile.uploadedBy.city && (
              <p className="text-sm text-slate-500">{profile.uploadedBy.city}</p>
            )}
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {badges.map((b) => (
                <span key={b.badgeType} className={
                  b.badgeType === 'VERIFIED' ? 'badge-verified' :
                  b.badgeType === 'TRUSTED' ? 'badge-trusted' :
                  'badge-premium'
                }>
                  <Shield className="w-3 h-3" />
                  {b.badgeType}
                </span>
              ))}
            </div>
          </div>

          {/* Contact reveal */}
          <div className="min-w-[200px]">
            {revealedContact ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold text-sm">Contact Revealed</span>
                </div>
                <p className="font-semibold text-slate-900">{revealedContact.businessName}</p>
                {revealedContact.mobileNumber && (
                  <a
                    href={`tel:${revealedContact.mobileNumber}`}
                    className="flex items-center gap-1.5 text-green-700 font-medium mt-1 hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {revealedContact.mobileNumber}
                  </a>
                )}
                {revealedContact.mobileNumber && (
                  <a
                    href={`https://wa.me/${revealedContact.mobileNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-700 text-sm mt-2 hover:underline"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <div>
                {revealError && (
                  <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mb-3">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{revealError}</span>
                  </div>
                )}
                <button
                  onClick={handleRevealContact}
                  disabled={revealLoading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <Eye className="w-4 h-4" />
                  {revealLoading ? 'Loading...' : 'View Contact Details'}
                </button>
                <p className="text-xs text-slate-400 mt-2">
                  Contact details of the bureau that uploaded this profile
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
