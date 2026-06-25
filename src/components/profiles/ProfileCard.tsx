// src/components/profiles/ProfileCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, GraduationCap, Briefcase, CheckCircle2, Shield, Star } from 'lucide-react';

const BADGE_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  VERIFIED: { icon: CheckCircle2, label: 'Verified', color: 'text-blue-600' },
  TRUSTED: { icon: Shield, label: 'Trusted', color: 'text-gold-600' },
  PREMIUM: { icon: Star, label: 'Premium', color: 'text-green-700' },
};

interface ProfileCardProps {
  profile: {
    id: string;
    profileId: string;
    gender: 'MALE' | 'FEMALE';
    age: number;
    city: string;
    province?: string;
    country: string;
    qualification?: string;
    occupation?: string;
    caste?: string;
    maritalStatus: string;
    religion: string;
    sect?: string;
    hasPrimaryPhoto: boolean;
    primaryThumbnail?: string;
    bureau: {
      businessName: string;
      city: string;
      badges: string[];
      isOwner: boolean;
    };
    createdAt: string;
  };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const isMale = profile.gender === 'MALE';

  return (
    <Link href={`/profiles/${profile.id}`}
      className="bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all block overflow-hidden group">

      {/* Photo Header */}
      <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {profile.primaryThumbnail ? (
          <Image
            src={profile.primaryThumbnail}
            alt={`Profile ${profile.profileId}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold
              ${isMale ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
              {isMale ? '♂' : '♀'}
            </div>
            <span className="text-xs text-slate-400">Photo Not Available</span>
          </div>
        )}

        {/* Gender Badge */}
        <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold
          ${isMale ? 'bg-blue-600 text-white' : 'bg-pink-500 text-white'}`}>
          {profile.gender}
        </div>

        {/* Profile ID */}
        <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full font-mono">
          {profile.profileId}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Age + Location */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-slate-900 text-lg">{profile.age} years</span>
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{profile.city}{profile.province ? `, ${profile.province}` : ''}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 mb-4">
          {profile.qualification && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{profile.qualification}</span>
            </div>
          )}
          {profile.occupation && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{profile.occupation}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.maritalStatus && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
              {profile.maritalStatus}
            </span>
          )}
          {profile.caste && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
              {profile.caste}
            </span>
          )}
          {profile.sect && (
            <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
              {profile.sect}
            </span>
          )}
        </div>

        {/* Bureau Info */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 truncate max-w-[120px]">
              {profile.bureau.isOwner ? 'Your Profile' : profile.bureau.businessName}
            </span>
            {profile.bureau.badges.slice(0, 2).map(badge => {
              const config = BADGE_CONFIG[badge];
              if (!config) return null;
              const Icon = config.icon;
              return (
                <Icon key={badge} className={`w-3.5 h-3.5 ${config.color}`}
                  title={`${config.label} Bureau`} />
              );
            })}
          </div>
          <span className="text-xs text-slate-400">
            {new Date(profile.createdAt).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </Link>
  );
}
