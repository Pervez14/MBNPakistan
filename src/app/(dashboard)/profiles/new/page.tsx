'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { profileAPI } from '@/lib/api';

const schema = z.object({
  gender: z.enum(['MALE', 'FEMALE']),
  age: z.coerce.number().int().min(18, 'Min age 18').max(80, 'Max age 80'),
  maritalStatus: z.enum(['NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']),
  religion: z.enum(['ISLAM', 'CHRISTIANITY', 'HINDUISM', 'OTHER']).optional(),
  sect: z.string().optional(),
  caste: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  qualification: z.string().optional(),
  degree: z.string().optional(),
  employmentType: z.enum(['JOB_HOLDER', 'BUSINESS_OWNER', 'STUDENT', 'NOT_EMPLOYED', 'OTHER']).optional(),
  occupation: z.string().optional(),
  monthlyIncomePkr: z.coerce.number().optional(),
  heightCm: z.coerce.number().optional(),
  weightKg: z.coerce.number().optional(),
  sect2: z.string().optional(),
  isOverseas: z.boolean().default(false),
  photoPrivacy: z.enum(['PUBLIC', 'VERIFIED_ONLY', 'HIDDEN']).default('PUBLIC'),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'AJK', 'ICT'];

export default function NewProfilePage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gender: 'MALE', maritalStatus: 'NEVER_MARRIED', isOverseas: false, photoPrivacy: 'PUBLIC' },
  });

  const gender = watch('gender');

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      const res = await profileAPI.create(data);
      setSuccess(`Profile created! ID: ${res.data.data.profileId}`);
      setTimeout(() => router.push('/profiles'), 2000);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to create profile. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Add New Marriage Profile</h1>
        <p className="page-subtitle">Fill in the profile details. All fields marked * are required.</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-6 text-sm text-green-700">
          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-slate-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Gender *</label>
              <select {...register('gender')} className="input-field">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label className="label">Age *</label>
              <input {...register('age')} type="number" min={18} max={80} placeholder="25" className="input-field" />
              {errors.age && <p className="text-red-600 text-xs mt-1">{errors.age.message}</p>}
            </div>
            <div>
              <label className="label">Marital Status *</label>
              <select {...register('maritalStatus')} className="input-field">
                <option value="NEVER_MARRIED">Never Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
                <option value="SEPARATED">Separated</option>
              </select>
            </div>
            <div>
              <label className="label">Height (cm)</label>
              <input {...register('heightCm')} type="number" placeholder="170" className="input-field" />
            </div>
            <div>
              <label className="label">Weight (kg)</label>
              <input {...register('weightKg')} type="number" placeholder="70" className="input-field" />
            </div>
            <div>
              <label className="label">Religion</label>
              <select {...register('religion')} className="input-field">
                <option value="">Select...</option>
                <option value="ISLAM">Islam</option>
                <option value="CHRISTIANITY">Christianity</option>
                <option value="HINDUISM">Hinduism</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Sect / Maslak</label>
              <input {...register('sect')} placeholder="e.g. Sunni, Shia, Deobandi..." className="input-field" />
            </div>
            <div>
              <label className="label">Caste / Biradari</label>
              <input {...register('caste')} placeholder="e.g. Rajput, Awan, Syed..." className="input-field" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-slate-800 mb-4">Location</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Country</label>
              <select {...register('country')} className="input-field">
                <option value="">Select...</option>
                <option value="Pakistan">Pakistan</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="UAE">UAE</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Province</label>
              <select {...register('province')} className="input-field">
                <option value="">Select...</option>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">City</label>
              <input {...register('city')} placeholder="e.g. Lahore" className="input-field" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input {...register('isOverseas')} type="checkbox" id="overseas" className="w-4 h-4 accent-green-700" />
              <label htmlFor="overseas" className="text-sm text-slate-700">Overseas Pakistani</label>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-slate-800 mb-4">Education</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Qualification</label>
              <select {...register('qualification')} className="input-field">
                <option value="">Select...</option>
                <option value="Matric">Matric</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Degree / Field</label>
              <input {...register('degree')} placeholder="e.g. MBBS, MBA, CS..." className="input-field" />
            </div>
          </div>
        </div>

        {/* Career */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-slate-800 mb-4">Career</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Employment Type</label>
              <select {...register('employmentType')} className="input-field">
                <option value="">Select...</option>
                <option value="JOB_HOLDER">Job Holder</option>
                <option value="BUSINESS_OWNER">Business Owner</option>
                <option value="STUDENT">Student</option>
                <option value="NOT_EMPLOYED">Not Employed</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Occupation</label>
              <input {...register('occupation')} placeholder="e.g. Engineer, Doctor..." className="input-field" />
            </div>
            <div>
              <label className="label">Monthly Income (PKR)</label>
              <input {...register('monthlyIncomePkr')} type="number" placeholder="50000" className="input-field" />
            </div>
          </div>
        </div>

        {/* Photo Privacy */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-slate-800 mb-4">Privacy Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Photo Privacy</label>
              <select {...register('photoPrivacy')} className="input-field">
                <option value="PUBLIC">Public (visible to all)</option>
                <option value="VERIFIED_ONLY">Verified Bureaus Only</option>
                <option value="HIDDEN">Hidden</option>
              </select>
              {gender === 'FEMALE' && (
                <p className="text-xs text-slate-500 mt-1">
                  Recommended: Verified Only or Hidden for female profiles
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-slate-800 mb-4">Additional Information</h3>
          <textarea
            {...register('additionalInfo')}
            rows={4}
            placeholder="Any additional information about the candidate, family background, preferences, etc."
            className="input-field resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
            {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
