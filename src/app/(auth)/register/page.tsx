'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '@/lib/api';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  businessName: z.string().min(2, 'Business name is required'),
  mobileNumber: z.string().min(10, 'Enter a valid mobile number'),
  email: z.string().email('Enter a valid email'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  officeAddress: z.string().optional(),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  cnic: z.string().optional(),
});
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setServerError('');
      await authAPI.register(data);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Registration failed. Please try again.';
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
            Your membership application has been received. Our team will review your details and get back to
            you within <strong>24-48 hours</strong>.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            You will receive an email at the address you provided once your account is approved.
          </p>
          <Link href="/login" className="btn-primary inline-block">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-700 rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-heading font-bold text-xl">M</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Apply for Membership</h1>
          <p className="text-slate-500 mt-1 text-sm">Marriage Bureau Network Pakistan</p>
        </div>

        <div className="card p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
            <strong>Important:</strong> This platform is for licensed Marriage Bureau operators only.
            Your application will be reviewed and manually approved by our team. Please provide accurate
            information to speed up the process.
          </div>

          {serverError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Details */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input {...register('fullName')} placeholder="Muhammad Ahmad" className="input-field" />
                  {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="label">Mobile Number *</label>
                  <input {...register('mobileNumber')} placeholder="+92 300 1234567" className="input-field" />
                  {errors.mobileNumber && <p className="text-red-600 text-xs mt-1">{errors.mobileNumber.message}</p>}
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input {...register('email')} type="email" placeholder="you@bureau.com" className="input-field" />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label">CNIC (optional)</label>
                  <input {...register('cnic')} placeholder="12345-1234567-1" className="input-field" />
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Business Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Marriage Bureau / Business Name *</label>
                  <input {...register('businessName')} placeholder="e.g. Al-Noor Marriage Bureau" className="input-field" />
                  {errors.businessName && <p className="text-red-600 text-xs mt-1">{errors.businessName.message}</p>}
                </div>
                <div>
                  <label className="label">City *</label>
                  <input {...register('city')} placeholder="Lahore" className="input-field" />
                  {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="label">Country *</label>
                  <select {...register('country')} className="input-field">
                    <option value="">Select Country</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="label">Office Address (optional)</label>
                  <textarea {...register('officeAddress')} rows={2} placeholder="Full office address..." className="input-field resize-none" />
                </div>
                <div>
                  <label className="label">Website (optional)</label>
                  <input {...register('website')} type="url" placeholder="https://yourbureau.com" className="input-field" />
                  {errors.website && <p className="text-red-600 text-xs mt-1">{errors.website.message}</p>}
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Account Security
              </h3>
              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 8 characters with uppercase and number"
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Membership Application'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-green-700 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
