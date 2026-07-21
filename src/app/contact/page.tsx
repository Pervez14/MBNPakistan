'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';

export default function ContactPage() {
  const { language, setLanguage, isUrdu } = useLanguage();

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
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 text-slate-950">
      <PublicHeader active="contact" language={language} setLanguage={setLanguage} isUrdu={isUrdu} />

      <main>
        <section className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-bold text-[#137a4a]">
              <MessageCircle className="h-4 w-4" />
              {isUrdu ? 'MBN Pakistan سے رابطہ کریں' : 'Contact MBN Pakistan'}
            </span>

            <h1 className="mt-6 font-heading text-4xl font-black leading-tight text-[#073b24] md:text-6xl">
              {isUrdu ? 'رابطہ کریں' : 'Contact Us'}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {isUrdu
                ? 'Membership, bureau approval, profile submission, privacy, technical support ya partnership ke liye message bhejein.'
                : 'Send us a message for membership, bureau approval, profile submission, privacy, technical support or partnership.'}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <form onSubmit={submitMessage} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-6 md:p-8">
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-950">
                  {isUrdu ? 'Message bhejein' : 'Send a Message'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {isUrdu ? 'Form fill karein, team review karegi.' : 'Fill out the form and our team will review your message.'}
                </p>
              </div>

              {errorMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name *</label>
                  <input name="fullName" value={formData.fullName} onChange={updateField} required className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600" placeholder="Your full name" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address *</label>
                  <input name="email" type="email" value={formData.email} onChange={updateField} required className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600" placeholder="you@example.com" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Phone / WhatsApp</label>
                  <input name="phone" value={formData.phone} onChange={updateField} className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600" placeholder="+92..." />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Bureau Name</label>
                  <input name="bureauName" value={formData.bureauName} onChange={updateField} className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600" placeholder="Your marriage bureau name" />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Inquiry Type</label>
                  <select name="inquiryType" value={formData.inquiryType} onChange={updateField} className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600">
                    <option value="General Question">General Question</option>
                    <option value="Membership Application">Membership Application</option>
                    <option value="Account Approval">Account Approval</option>
                    <option value="Profile Submission">Profile Submission</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Privacy Concern">Privacy Concern</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Message *</label>
                  <textarea name="message" value={formData.message} onChange={updateField} required rows={6} className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600" placeholder="Write your message here..." />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800 disabled:opacity-50">
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div className="space-y-5">
              <InfoCard title={isUrdu ? 'Email Support' : 'Email Support'} text={isUrdu ? 'Membership, approval aur support questions ke liye contact form use karein.' : 'Use this contact form for membership, approval and support questions.'} icon={<Mail className="h-6 w-6" />} />
              <InfoCard title={isUrdu ? 'Service Area' : 'Service Area'} text={isUrdu ? 'MBN Pakistan Pakistan aur overseas Pakistani communities ke liye designed hai.' : 'MBN Pakistan is designed for Pakistan and overseas Pakistani communities.'} icon={<MapPin className="h-6 w-6" />} />
              <div className="rounded-3xl border border-green-100 bg-green-50 p-6">
                <ShieldCheck className="mb-4 h-8 w-8 text-green-700" />
                <h3 className="font-heading text-xl font-bold text-green-900">
                  {isUrdu ? 'Approved bureaus ke liye' : 'For Approved Bureaus'}
                </h3>
                <p className="mt-2 text-sm text-green-800">
                  {isUrdu ? 'Agar account approved hai to dashboard login karein.' : 'If your account is approved, login to your dashboard.'}
                </p>
                <Link href="/login" className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800">
                  {isUrdu ? 'Dashboard Login' : 'Login to Dashboard'}
                </Link>
              </div>
              <InfoCard title={isUrdu ? 'Quick Help' : 'Quick Help'} text={isUrdu ? 'Approval, password, email change ya profile issues ke liye message bhejein.' : 'Message us for approval, password, email change or profile issues.'} icon={<HelpCircle className="h-6 w-6" />} />
            </div>
          </div>
        </section>

        <section className="bg-slate-900">
          <div className="mx-auto max-w-[1440px] px-4 py-12 text-center md:px-8">
            <h2 className="font-heading text-3xl font-black text-white">
              {isUrdu ? 'MBN Pakistan join karna chahte hain?' : 'Ready to join MBN Pakistan?'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-300">
              {isUrdu ? 'Bureau membership apply karein ya family profile submit karein.' : 'Apply for bureau membership or submit a family profile.'}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-500">
                {isUrdu ? 'Apply for Membership' : 'Apply for Membership'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/submit-profile" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10">
                {isUrdu ? 'Submit Profile' : 'Submit Profile'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter isUrdu={isUrdu} />
    </div>
  );
}


function PublicHeader({
  active,
  language,
  setLanguage,
  isUrdu,
}: {
  active: 'home' | 'how' | 'families' | 'bureaus' | 'about' | 'contact';
  language: string;
  setLanguage: (language: string) => void;
  isUrdu: boolean;
}) {
  const navItems = [
    { key: 'home', label: isUrdu ? 'ہوم' : 'Home', href: '/' },
    { key: 'how', label: isUrdu ? 'یہ کیسے کام کرتا ہے' : 'How It Works', href: '/how-it-works' },
    { key: 'families', label: isUrdu ? 'خاندانوں کے لیے' : 'For Families', href: '/for-families' },
    { key: 'bureaus', label: isUrdu ? 'بیوروز کے لیے' : 'For Bureaus', href: '/for-bureaus' },
    { key: 'about', label: isUrdu ? 'ہمارے بارے میں' : 'About Us', href: '/about' },
    { key: 'contact', label: isUrdu ? 'رابطہ کریں' : 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img
            src="/mbn-logo.png"
            alt="MBN Pakistan"
            className="h-10 w-10 flex-shrink-0 object-contain sm:h-12 sm:w-12"
          />
          <div className="hidden leading-tight min-[390px]:block">
            <p className="font-heading text-base font-bold tracking-[0.1em] text-[#063d25] sm:text-xl sm:tracking-[0.12em]">
              MBN
            </p>
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#063d25] sm:text-xs sm:tracking-[0.2em]">
              PAKISTAN
            </p>
            <p className="mt-0.5 hidden text-[10px] text-slate-500 sm:block">
              {isUrdu ? 'میرج بیورو نیٹ ورک' : 'Marriage Bureau Network'}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-900 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={
                active === item.key
                  ? 'border-b-2 border-[#137a4a] pb-2 text-[#073b24]'
                  : 'hover:text-[#137a4a]'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <LanguageToggle language={language} setLanguage={setLanguage} />

          <Link
            href="/login"
            className="hidden rounded-lg border border-[#0b5f38] px-5 py-2.5 text-sm font-bold text-[#073b24] hover:bg-green-50 sm:inline-flex"
          >
            {isUrdu ? 'بیورو لاگ اِن' : 'Bureau Login'}
          </Link>

          <Link
            href="/submit-profile"
            className="rounded-lg bg-[#0b6e34] px-3 py-2.5 text-xs font-bold leading-tight text-white shadow-sm hover:bg-[#07582a] sm:px-5 sm:text-sm"
          >
            {isUrdu ? 'اپنی پروفائل جمع کروائیں' : 'Submit Your Profile'}
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-100 py-2 xl:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-start gap-5 overflow-x-auto whitespace-nowrap px-4 text-xs font-semibold text-slate-600 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.slice(1).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={active === item.key ? 'text-[#137a4a]' : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}



function PublicFooter({
  isUrdu,
}: {
  isUrdu: boolean;
}) {
  return (
    <footer className="mt-8 bg-[#073b24] text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/mbn-logo.png"
            alt="MBN Pakistan"
            className="h-11 w-11 rounded-lg bg-white p-1 object-contain"
          />
          <div>
            <p className="font-heading font-bold">MBN Pakistan</p>
            <p className="mt-1 max-w-xl text-xs text-green-50/70">
              {isUrdu
                ? 'افراد، خاندانوں اور پیشہ ور میرج بیوروز کے لیے قابلِ اعتماد نیٹ ورک۔'
                : 'A trusted, privacy-focused matchmaking network for individuals, families, and professional marriage bureaus.'}
            </p>
          </div>
        </div>

        <p className="text-xs text-green-50/60">
          © {new Date().getFullYear()} MBN Pakistan. {isUrdu ? 'تمام حقوق محفوظ ہیں۔' : 'All rights reserved.'}
        </p>
      </div>
    </footer>
  );
}



function StepCard({
  number,
  title,
  text,
  icon,
}: {
  number: string;
  title: string;
  text: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#137a4a]">
          {icon}
        </div>
        <span className="font-heading text-4xl font-black text-slate-100">
          {number}
        </span>
      </div>
      <h3 className="font-heading text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function InfoCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#137a4a]">
        {icon}
      </div>
      <h3 className="font-heading text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function Bullet({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#137a4a]" />
      <p className="text-sm leading-6 text-slate-700">{children}</p>
    </div>
  );
}

