'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle,
  HeartHandshake,
  Lock,
  Network,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';

export default function AboutPage() {
  const { language, setLanguage, isUrdu } = useLanguage();

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 text-slate-950">
      <PublicHeader active="about" language={language} setLanguage={setLanguage} isUrdu={isUrdu} />

      <main>
        <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-bold text-[#137a4a]">
              <ShieldCheck className="h-4 w-4" />
              {isUrdu ? 'Trusted Bureau Network' : 'Trusted Bureau Network'}
            </span>

            <h1 className="mt-6 font-heading text-4xl font-black leading-tight text-[#073b24] md:text-6xl">
              {isUrdu ? 'MBN Pakistan کے بارے میں' : 'About MBN Pakistan'}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {isUrdu
                ? 'MBN Pakistan ek professional digital platform hai jo families, individuals aur verified marriage bureaus ko ek organized, secure aur privacy-focused workflow mein connect karta hai.'
                : 'MBN Pakistan is a professional digital platform connecting families, individuals and verified marriage bureaus through an organized, secure and privacy-focused workflow.'}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/submit-profile" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b6e34] px-6 py-3.5 font-bold text-white hover:bg-[#07582a]">
                {isUrdu ? 'پروفائل جمع کروائیں' : 'Submit Profile'}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/for-bureaus" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0b5f38] px-6 py-3.5 font-bold text-[#073b24] hover:bg-green-50">
                {isUrdu ? 'بیوروز کے لیے' : 'For Bureaus'}
              </Link>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InfoCard title={isUrdu ? 'Verified Bureaus' : 'Verified Bureaus'} text={isUrdu ? 'Only approved bureaus can access the network.' : 'Only approved bureaus can access the network.'} icon={<Building2 className="h-6 w-6" />} />
            <InfoCard title={isUrdu ? 'Private Review' : 'Private Review'} text={isUrdu ? 'Public submissions are reviewed before action.' : 'Public submissions are reviewed before action.'} icon={<ShieldCheck className="h-6 w-6" />} />
            <InfoCard title={isUrdu ? 'Smart Search' : 'Smart Search'} text={isUrdu ? 'Search by city, gender, caste, education and more.' : 'Search by city, gender, caste, education and more.'} icon={<Search className="h-6 w-6" />} />
            <InfoCard title={isUrdu ? 'Privacy Controls' : 'Privacy Controls'} text={isUrdu ? 'Photos and contact details stay protected.' : 'Photos and contact details stay protected.'} icon={<Lock className="h-6 w-6" />} />
          </div>
        </section>

        <section className="bg-white border-y border-slate-200">
          <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
            <div className="max-w-3xl">
              <h2 className="font-heading text-3xl font-black text-[#073b24]">
                {isUrdu ? 'Our Mission' : 'Our Mission'}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {isUrdu
                  ? 'Marriage bureaus aksar WhatsApp, notebooks aur spreadsheets par profiles manage karte hain. MBN Pakistan in workflows ko ek professional dashboard mein organize karta hai jahan privacy, search aur accountability better hoti hai.'
                  : 'Many marriage bureaus manage profiles through WhatsApp, notebooks and spreadsheets. MBN Pakistan organizes these workflows into one professional dashboard with better privacy, search and accountability.'}
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <InfoCard title={isUrdu ? 'Build Trust' : 'Build Trust'} text={isUrdu ? 'Verified access aur monitored workflow random sharing ko reduce karta hai.' : 'Verified access and monitored workflow reduce random sharing.'} icon={<HeartHandshake className="h-6 w-6" />} />
              <InfoCard title={isUrdu ? 'Protect Privacy' : 'Protect Privacy'} text={isUrdu ? 'Contact details hidden rehte hain aur photo privacy options available hain.' : 'Contact details stay hidden and photo privacy options are available.'} icon={<Lock className="h-6 w-6" />} />
              <InfoCard title={isUrdu ? 'Improve Matching' : 'Improve Matching'} text={isUrdu ? 'Detailed filters aur organized records suitable matches dhoondna easier banate hain.' : 'Detailed filters and organized records make it easier to find suitable matches.'} icon={<Network className="h-6 w-6" />} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
          <div className="rounded-[2rem] bg-gradient-to-r from-[#073f46] via-[#0b5f38] to-[#168135] p-8 text-center text-white md:p-12">
            <h2 className="font-heading text-3xl font-black md:text-4xl">
              {isUrdu ? 'MBN Pakistan کے ساتھ شروع کریں' : 'Start with MBN Pakistan'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-green-50/90">
              {isUrdu ? 'Families profile submit kar sakti hain. Bureaus membership apply kar sakte hain.' : 'Families can submit a profile. Bureaus can apply for membership.'}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/submit-profile" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#073b24] hover:bg-green-50">
                {isUrdu ? 'پروفائل جمع کروائیں' : 'Submit Profile'}
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white hover:bg-white/10">
                {isUrdu ? 'بیورو Apply کریں' : 'Apply as a Bureau'}
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

