'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    roleInBureau: z.string().min(2, 'Please select your role'),
    mobileNumber: z.string().min(10, 'Enter a valid mobile number'),
    whatsappNumber: z.string().min(10, 'Enter a valid WhatsApp number'),
    email: z.string().email('Enter a valid email'),
    cnic: z.string().optional(),

    businessName: z.string().min(2, 'Business name is required'),
    yearsInBusiness: z.string().min(1, 'Please select years in business'),
    activeProfiles: z.string().min(1, 'Please select number of active profiles'),
    hasPhysicalOffice: z.string().min(1, 'Please select office type'),
    officePhone: z.string().optional(),

    city: z.string().min(2, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    country: z.string().min(2, 'Country is required'),
    officeAddress: z.string().optional(),
    areasServed: z.string().optional(),

    website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    socialLink: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    googleBusinessLink: z
      .string()
      .url('Enter a valid URL')
      .optional()
      .or(z.literal('')),

    specializations: z.array(z.string()).optional(),

    referenceName1: z.string().optional(),
    referencePhone1: z.string().optional(),
    referenceName2: z.string().optional(),
    referencePhone2: z.string().optional(),

    password: z
      .string()
      .min(8, 'Minimum 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string().min(8, 'Please confirm password'),

    confirmProfessional: z.literal(true, {
      errorMap: () => ({
        message: 'You must confirm you are a professional bureau operator',
      }),
    }),
    confirmAccurate: z.literal(true, {
      errorMap: () => ({
        message: 'You must confirm information is accurate',
      }),
    }),
    agreeTerms: z.literal(true, {
      errorMap: () => ({
        message: 'You must agree to the terms',
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const specializationOptions = [
  'Local Pakistan matches',
  'Overseas Pakistani matches',
  'Educated professionals',
  'Business families',
  'Second marriage',
  'Divorcee / widow / widower',
  'Religious families',
  'Elite / premium families',
  'General matchmaking',
];

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [
    bureauRegistrationNumber,
    setBureauRegistrationNumber,
  ] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      specializations: [],
      country: 'Pakistan',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setServerError('');

      const applicationId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
              .toString(36)
              .slice(2)}`;

      const { error } = await supabase.from('bureau_applications').insert({
        id: applicationId,

        full_name: data.fullName,
        role_in_bureau: data.roleInBureau,
        mobile_number: data.mobileNumber,
        whatsapp_number: data.whatsappNumber,
        email: data.email,
        cnic: data.cnic || null,

        business_name: data.businessName,
        years_in_business: data.yearsInBusiness,
        active_profiles: data.activeProfiles,
        has_physical_office: data.hasPhysicalOffice,
        office_phone: data.officePhone || null,

        city: data.city,
        province: data.province,
        country: data.country || 'Pakistan',
        office_address: data.officeAddress || null,
        areas_served: data.areasServed || null,

        website: data.website || null,
        social_link: data.socialLink || null,
        google_business_link: data.googleBusinessLink || null,

        specializations: data.specializations || [],

        reference_name_1: data.referenceName1 || null,
        reference_phone_1: data.referencePhone1 || null,
        reference_name_2: data.referenceName2 || null,
        reference_phone_2: data.referencePhone2 || null,

        status: 'pending',
      });

      if (error) {
        throw error;
      }


      const {
        data: registrationNumber,
        error: registrationNumberError,
      } = await supabase.rpc(
        'get_bureau_registration_number',
        {
          p_application_id: applicationId,
        }
      );


      if (registrationNumberError) {
        throw registrationNumberError;
      }


      setBureauRegistrationNumber(
        typeof registrationNumber === 'string'
          ? registrationNumber
          : ''
      );


      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : 'Registration failed. Please try again.';

      setServerError(msg);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100 flex items-center justify-center p-4">
        <div className="card p-10 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-3">
            Application Submitted!
          </h2>

          <p className="text-slate-600 mb-6">
            Your membership application has been received. Our team will review
            your bureau details and get back to you within{' '}
            <strong>24-48 hours</strong>.
          </p>


          {bureauRegistrationNumber && (
            <div className="bg-slate-950 rounded-2xl p-5 text-center mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-green-200 font-bold">
                Your Bureau Registration ID
              </p>

              <p
                dir="ltr"
                className="font-mono text-2xl md:text-3xl font-black text-white mt-3 break-all"
              >
                {bureauRegistrationNumber}
              </p>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Please save this ID. Use it when contacting MBN Pakistan about
                your bureau membership application.
              </p>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left text-sm text-green-800 mb-6">
            <strong>Next step:</strong> To speed up approval, please prepare
            your CNIC front/back, business card, office photo, and any business
            registration documents.
          </div>

          <Link href="/login" className="btn-primary inline-block">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/mbn-logo.png"
              alt="MBN Pakistan"
              className="h-24 w-auto object-contain"
            />
          </div>

          <h1 className="font-heading text-3xl font-bold text-slate-900">
            Apply for Membership
          </h1>

          <p className="text-slate-500 mt-1 text-sm">
            Marriage Bureau Network Pakistan
          </p>
        </div>

        <div className="card p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
            <strong>Important:</strong> This platform is for professional
            Marriage Bureau operators only. Your application will be reviewed and
            manually approved by our team. Please provide accurate information to
            speed up the process.
          </div>

          {serverError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Details */}
            <section>
              <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Personal Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    {...register('fullName')}
                    placeholder="Muhammad Ahmad"
                    className="input-field"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Your Role in Bureau *</label>
                  <select {...register('roleInBureau')} className="input-field">
                    <option value="">Select Role</option>
                    <option value="Owner">Owner</option>
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                    <option value="Agent">Agent</option>
                  </select>
                  {errors.roleInBureau && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.roleInBureau.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Mobile Number *</label>
                  <input
                    {...register('mobileNumber')}
                    placeholder="+92 300 1234567"
                    className="input-field"
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">WhatsApp Number *</label>
                  <input
                    {...register('whatsappNumber')}
                    placeholder="+92 300 1234567"
                    className="input-field"
                  />
                  {errors.whatsappNumber && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.whatsappNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Email Address *</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@bureau.com"
                    className="input-field"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">CNIC Number</label>
                  <input
                    {...register('cnic')}
                    placeholder="12345-1234567-1"
                    className="input-field"
                  />
                </div>
              </div>
            </section>

            {/* Business Details */}
            <section>
              <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Business Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">
                    Marriage Bureau / Business Name *
                  </label>
                  <input
                    {...register('businessName')}
                    placeholder="e.g. Al-Noor Marriage Bureau"
                    className="input-field"
                  />
                  {errors.businessName && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Years in Business *</label>
                  <select
                    {...register('yearsInBusiness')}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                  {errors.yearsInBusiness && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.yearsInBusiness.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Number of Active Profiles *</label>
                  <select {...register('activeProfiles')} className="input-field">
                    <option value="">Select</option>
                    <option value="Under 50">Under 50</option>
                    <option value="50-200">50-200</option>
                    <option value="200-500">200-500</option>
                    <option value="500+">500+</option>
                  </select>
                  {errors.activeProfiles && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.activeProfiles.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Physical Office *</label>
                  <select
                    {...register('hasPhysicalOffice')}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Home-based">Home-based</option>
                  </select>
                  {errors.hasPhysicalOffice && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.hasPhysicalOffice.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Office Phone / Landline</label>
                  <input
                    {...register('officePhone')}
                    placeholder="042-1234567"
                    className="input-field"
                  />
                </div>
              </div>
            </section>

            {/* Location Details */}
            <section>
              <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Location Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">City *</label>
                  <input
                    {...register('city')}
                    placeholder="Lahore"
                    className="input-field"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Province / Region *</label>
                  <select {...register('province')} className="input-field">
                    <option value="">Select Province</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="AJK">AJK</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    <option value="Overseas">Overseas</option>
                  </select>
                  {errors.province && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.province.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Country *</label>
                  <select {...register('country')} className="input-field">
                    <option value="">Select Country</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.country && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Areas Served</label>
                  <input
                    {...register('areasServed')}
                    placeholder="Lahore, Gujranwala, UK Pakistanis"
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Office Address</label>
                  <textarea
                    {...register('officeAddress')}
                    rows={2}
                    placeholder="Full office address..."
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Online Presence */}
            <section>
              <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Online Presence
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Website</label>
                  <input
                    {...register('website')}
                    type="url"
                    placeholder="https://yourbureau.com"
                    className="input-field"
                  />
                  {errors.website && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Facebook / Instagram Link</label>
                  <input
                    {...register('socialLink')}
                    type="url"
                    placeholder="https://facebook.com/yourbureau"
                    className="input-field"
                  />
                  {errors.socialLink && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.socialLink.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="label">Google Business Profile Link</label>
                  <input
                    {...register('googleBusinessLink')}
                    type="url"
                    placeholder="https://maps.google.com/..."
                    className="input-field"
                  />
                  {errors.googleBusinessLink && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.googleBusinessLink.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Specialization */}
            <section>
              <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Bureau Specialization
              </h3>

              <p className="text-sm text-slate-500 mb-4">
                Select all match types your bureau mainly handles.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {specializationOptions.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      {...register('specializations')}
                      className="w-4 h-4 accent-green-700"
                    />
                    <span className="text-sm text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Verification */}
            <section>
              <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Verification Information
              </h3>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-sm text-green-800 flex gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  Documents such as CNIC front/back, business card, office photo,
                  and registration proof will be requested during manual
                  verification. They are used only for approval and are not shown
                  publicly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Reference Bureau / Person 1</label>
                  <input
                    {...register('referenceName1')}
                    placeholder="Name or Bureau"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Reference Contact Number 1</label>
                  <input
                    {...register('referencePhone1')}
                    placeholder="+92 300 1234567"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Reference Bureau / Person 2</label>
                  <input
                    {...register('referenceName2')}
                    placeholder="Name or Bureau"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Reference Contact Number 2</label>
                  <input
                    {...register('referencePhone2')}
                    placeholder="+92 300 1234567"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-5 bg-slate-50">
                <div className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800">
                      Document upload coming next
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      For now, collect the application first. After approval
                      workflow is connected, add uploads for CNIC, business card,
                      office photo, and business license.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Password */}
            <section>
              <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Account Security
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Password *</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Confirm Password *</label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Agreements */}
            <section>
              <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Agreement
              </h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    {...register('confirmProfessional')}
                    className="mt-1 w-4 h-4 accent-green-700"
                  />
                  <span>
                    I confirm that I am a professional marriage bureau operator.
                  </span>
                </label>
                {errors.confirmProfessional && (
                  <p className="text-red-600 text-xs">
                    {errors.confirmProfessional.message}
                  </p>
                )}

                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    {...register('confirmAccurate')}
                    className="mt-1 w-4 h-4 accent-green-700"
                  />
                  <span>
                    I confirm that all information provided is accurate.
                  </span>
                </label>
                {errors.confirmAccurate && (
                  <p className="text-red-600 text-xs">
                    {errors.confirmAccurate.message}
                  </p>
                )}

                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    {...register('agreeTerms')}
                    className="mt-1 w-4 h-4 accent-green-700"
                  />
                  <span>
                    I agree not to upload fake profiles or client data without
                    consent, and I agree to MBN Pakistan&apos;s Terms of Service
                    and Privacy Policy.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-red-600 text-xs">
                    {errors.agreeTerms.message}
                  </p>
                )}
              </div>
            </section>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSubmitting
                ? 'Submitting Application...'
                : 'Submit Membership Application'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-green-700 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
