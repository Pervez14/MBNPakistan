'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bureauName: '',
    inquiryType: 'General Question',
    message: '',
  });

  const updateField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitMessage = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      if (!formData.fullName.trim()) {
        throw new Error('Please enter your full name.');
      }

      if (!formData.email.trim()) {
        throw new Error('Please enter your email address.');
      }

      if (!formData.message.trim()) {
        throw new Error('Please enter your message.');
      }

      const { error } = await supabase.from('contact_messages').insert({
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        bureau_name: formData.bureauName.trim() || null,
        inquiry_type: formData.inquiryType,
        message: formData.message.trim(),
        status: 'new',
      });

      if (error) {
        throw error;
      }

      setSuccessMessage(
        'Your message has been sent successfully. MBN Pakistan will review it.'
      );

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        bureauName: '',
        inquiryType: 'General Question',
        message: '',
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Message could not be sent. Please try again.';

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/mbn-logo.png"
              alt="MBN Pakistan"
              className="w-12 h-12 object-contain"
            />
            <div>
              <p className="font-heading font-bold text-slate-900">
                MBN Pakistan
              </p>
              <p className="text-xs text-slate-500">
                Marriage Bureau Network
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/about" className="hover:text-green-700">
              About
            </Link>
            <Link href="/how-it-works" className="hover:text-green-700">
              How It Works
            </Link>
            <Link href="/contact" className="text-green-700">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="inline-flex px-4 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
            >
              Apply
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold border border-green-100">
            <MessageCircle className="w-4 h-4" />
            Contact MBN Pakistan
          </span>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-6">
            Contact Us
          </h1>

          <p className="text-lg text-slate-600 mt-5 leading-relaxed">
            Have a question about membership, bureau approval, profile upload,
            contact logs, or privacy? Send us a message and our team will review
            it.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
          {/* Form */}
          <form
            onSubmit={submitMessage}
            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
          >
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Send a Message
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Fill out the form below and we will review your message.
              </p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={updateField}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={updateField}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone / WhatsApp
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={updateField}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="+92..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Bureau Name
                </label>
                <input
                  name="bureauName"
                  value={formData.bureauName}
                  onChange={updateField}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Your marriage bureau name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Inquiry Type
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={updateField}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="General Question">General Question</option>
                  <option value="Membership Application">
                    Membership Application
                  </option>
                  <option value="Account Approval">Account Approval</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Privacy Concern">Privacy Concern</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={updateField}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                  placeholder="Write your message here..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {/* Side Info */}
          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <Mail className="w-8 h-8 text-green-700 mb-4" />
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Email Support
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Use this contact form for membership, approval, and support
                questions.
              </p>
              <p className="text-sm font-semibold text-green-700 mt-4">
                info@mbnpakistan.com
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <MapPin className="w-8 h-8 text-green-700 mb-4" />
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Service Area
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                MBN Pakistan is designed for marriage bureaus across Pakistan
                and overseas Pakistani communities.
              </p>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-3xl p-6">
              <ShieldCheck className="w-8 h-8 text-green-700 mb-4" />
              <h3 className="font-heading text-xl font-bold text-green-900">
                For Approved Bureaus
              </h3>
              <p className="text-sm text-green-800 mt-2">
                If your account is already approved, login to your dashboard to
                upload profiles, search matches, and manage settings.
              </p>

              <Link
                href="/login"
                className="inline-flex mt-5 px-5 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
              >
                Login to Dashboard
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <HelpCircle className="w-8 h-8 text-green-700 mb-4" />
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Quick Help
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">
                    Need approval?
                  </span>{' '}
                  Submit membership application first.
                </p>

                <p>
                  <span className="font-semibold text-slate-900">
                    Forgot password?
                  </span>{' '}
                  Contact admin or use password settings after login.
                </p>

                <p>
                  <span className="font-semibold text-slate-900">
                    Need to change email?
                  </span>{' '}
                  Contact admin because email is connected to approval and
                  uploaded profiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">
            Ready to join MBN Pakistan?
          </h2>

          <p className="text-slate-300 mt-3 max-w-2xl mx-auto">
            Apply as a verified marriage bureau and start using a professional
            matchmaking dashboard.
          </p>

          <Link
            href="/register"
            className="inline-flex mt-6 px-6 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-500"
          >
            Apply for Membership
          </Link>
        </div>
      </section>
    </div>
  );
}
