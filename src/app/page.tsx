'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ShieldCheck,
  Search,
  Lock,
  ArrowRight,
  CheckCircle,
  Users,
  Building2,
  Eye,
  Upload,
  FileText,
  HeartHandshake,
  Network,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';

const content = {
  en: {
    navAbout: 'About Us',
    navHow: 'How It Works',
    navContact: 'Contact Us',
    login: 'Login',
    apply: 'Apply',

    subtitle: 'Marriage Bureau Network',
    badge: 'Verified Marriage Bureau Network',
    heroTitle: 'A Trusted Digital Network for Professional Marriage Bureaus',
    heroText:
      'MBN Pakistan helps verified marriage bureaus upload profiles, search suitable matches, protect privacy, and manage contact activity in one organized platform.',
    applyMembership: 'Apply for Membership',
    seeHow: 'How It Works',

    stat1: 'Verified Bureaus',
    stat2: 'Private Profiles',
    stat3: 'Contact Logs',

    visualTitle: 'Bureau Network',
    visualText: 'Upload, search, connect, and track securely.',

    sectionTitle: 'Modern tools for serious marriage bureaus',
    sectionText:
      'Move away from scattered WhatsApp chats, notebooks, and spreadsheets. MBN Pakistan gives bureaus a cleaner and more professional way to manage matchmaking work.',

    card1Title: 'Upload Profiles',
    card1Text:
      'Add bride and groom profiles with family, education, career, and match requirements.',

    card2Title: 'Search Matches',
    card2Text:
      'Find suitable profiles by gender, city, province, caste, education, profession, and more.',

    card3Title: 'Protect Privacy',
    card3Text:
      'Hide contacts until requested, blur or hide photos, and track contact views safely.',

    howTitle: 'How it works',
    howText:
      'A simple approval-based system designed for trusted bureau-to-bureau matchmaking.',
    step1Title: 'Apply',
    step1Text: 'Marriage bureaus submit their business and contact details.',
    step2Title: 'Get Approved',
    step2Text: 'Admin reviews and approves trusted bureau applications.',
    step3Title: 'Upload & Search',
    step3Text: 'Approved bureaus upload profiles and search the network.',
    step4Title: 'Connect Safely',
    step4Text: 'Contact details reveal only when requested and are logged.',

    privacyTitle: 'Privacy built into every profile',
    privacyText:
      'Profile photos and contact details are sensitive. MBN Pakistan gives bureaus control over visibility and gives the admin visibility into contact activity.',
    privacy1: 'Public, blurred, or hidden profile photos',
    privacy2: 'Contact details hidden until View Contact is clicked',
    privacy3: 'Admin can track who viewed which contact',

    ctaTitle: 'Ready to join MBN Pakistan?',
    ctaText:
      'Apply as a verified marriage bureau and start using a professional matchmaking dashboard.',

    footerText:
      'A professional platform for verified marriage bureaus to manage profiles, search suitable matches, and protect candidate privacy.',
    website: 'Website',
    bureauAccess: 'Bureau Access',
    dashboard: 'Dashboard',
    rights: 'All rights reserved.',
  },

  ur: {
    navAbout: 'ہمارے بارے میں',
    navHow: 'یہ کیسے کام کرتا ہے',
    navContact: 'رابطہ کریں',
    login: 'لاگ اِن',
    apply: 'درخواست دیں',

    subtitle: 'میرج بیورو نیٹ ورک',
    badge: 'تصدیق شدہ میرج بیورو نیٹ ورک',
    heroTitle: 'پیشہ ور میرج بیوروز کے لیے قابلِ اعتماد ڈیجیٹل نیٹ ورک',
    heroText:
      'MBN Pakistan تصدیق شدہ میرج بیوروز کو پروفائلز اپلوڈ کرنے، مناسب رشتے تلاش کرنے، پرائیویسی محفوظ رکھنے، اور رابطہ سرگرمی کو ایک منظم پلیٹ فارم میں مینیج کرنے میں مدد دیتا ہے۔',
    applyMembership: 'رکنیت کے لیے درخواست دیں',
    seeHow: 'طریقہ کار دیکھیں',

    stat1: 'تصدیق شدہ بیوروز',
    stat2: 'پرائیویٹ پروفائلز',
    stat3: 'رابطہ لاگز',

    visualTitle: 'بیورو نیٹ ورک',
    visualText: 'محفوظ طریقے سے اپلوڈ، سرچ، رابطہ اور ٹریک کریں۔',

    sectionTitle: 'سنجیدہ میرج بیوروز کے لیے جدید ٹولز',
    sectionText:
      'واٹس ایپ چیٹس، نوٹ بکس اور اسپریڈ شیٹس کے بجائے MBN Pakistan بیوروز کو میچ میکنگ کام کے لیے ایک صاف اور پیشہ ور سسٹم دیتا ہے۔',

    card1Title: 'پروفائلز اپلوڈ کریں',
    card1Text:
      'دلہن اور دلہا کی پروفائلز فیملی، تعلیم، کیریئر اور رشتہ ضروریات کے ساتھ شامل کریں۔',

    card2Title: 'رشتے تلاش کریں',
    card2Text:
      'جنس، شہر، صوبہ، ذات، تعلیم، پیشہ اور دیگر معلومات کے ذریعے مناسب پروفائلز تلاش کریں۔',

    card3Title: 'پرائیویسی محفوظ رکھیں',
    card3Text:
      'رابطہ تفصیلات درخواست تک چھپی رہتی ہیں، تصاویر بلر یا ہائیڈ ہو سکتی ہیں، اور رابطہ ویوز ٹریک ہوتے ہیں۔',

    howTitle: 'یہ کیسے کام کرتا ہے',
    howText:
      'قابلِ اعتماد بیورو ٹو بیورو میچ میکنگ کے لیے ایک آسان منظوری پر مبنی سسٹم۔',
    step1Title: 'درخواست دیں',
    step1Text: 'میرج بیوروز اپنی کاروباری اور رابطہ معلومات جمع کرواتے ہیں۔',
    step2Title: 'منظوری حاصل کریں',
    step2Text: 'ایڈمن قابلِ اعتماد بیورو درخواستوں کا جائزہ لے کر منظور کرتا ہے۔',
    step3Title: 'اپلوڈ اور سرچ',
    step3Text: 'منظور شدہ بیوروز پروفائلز اپلوڈ اور نیٹ ورک سرچ کرتے ہیں۔',
    step4Title: 'محفوظ رابطہ',
    step4Text: 'رابطہ تفصیلات صرف درخواست پر ظاہر ہوتی ہیں اور لاگ ہوتی ہیں۔',

    privacyTitle: 'ہر پروفائل میں پرائیویسی شامل ہے',
    privacyText:
      'پروفائل تصاویر اور رابطہ تفصیلات حساس ہوتی ہیں۔ MBN Pakistan بیوروز کو visibility control دیتا ہے اور ایڈمن کو contact activity دیکھنے کی سہولت دیتا ہے۔',
    privacy1: 'پروفائل تصاویر پبلک، بلر یا ہِڈن ہو سکتی ہیں',
    privacy2: 'رابطہ تفصیلات View Contact تک چھپی رہتی ہیں',
    privacy3: 'ایڈمن دیکھ سکتا ہے کس نے کون سا رابطہ دیکھا',

    ctaTitle: 'MBN Pakistan میں شامل ہونے کے لیے تیار ہیں؟',
    ctaText:
      'تصدیق شدہ میرج بیورو کے طور پر درخواست دیں اور پیشہ ور میچ میکنگ ڈیش بورڈ استعمال کرنا شروع کریں۔',

    footerText:
      'تصدیق شدہ میرج بیوروز کے لیے ایک پیشہ ور پلیٹ فارم جہاں وہ پروفائلز مینیج، مناسب رشتے تلاش، اور امیدواروں کی پرائیویسی محفوظ رکھ سکتے ہیں۔',
    website: 'ویب سائٹ',
    bureauAccess: 'بیورو رسائی',
    dashboard: 'ڈیش بورڈ',
    rights: 'تمام حقوق محفوظ ہیں۔',
  },
};

export default function HomePage() {
  const { language, setLanguage, isUrdu } = useLanguage();
  const t = content[language];

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen bg-[#f3f8f4]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur border-b border-emerald-900/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/mbn-logo.png"
              alt="MBN Pakistan"
              className="w-12 h-12 object-contain"
            />

            <div>
              <p className="font-heading font-bold text-slate-950">
                MBN Pakistan
              </p>
              <p className="text-xs text-slate-500">{t.subtitle}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <Link href="/about" className="hover:text-[#137a4a]">
              {t.navAbout}
            </Link>

            <Link href="/how-it-works" className="hover:text-[#137a4a]">
              {t.navHow}
            </Link>

            <Link href="/contact" className="hover:text-[#137a4a]">
              {t.navContact}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle language={language} setLanguage={setLanguage} />

            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              {t.login}
            </Link>

            <Link
              href="/register"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-[#137a4a] text-white font-semibold hover:bg-[#0b5f38]"
            >
              {t.apply}
            </Link>
          </div>
        </div>

        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3">
          <div className="flex items-center justify-center gap-5 text-xs font-semibold text-slate-600">
            <Link href="/about" className="hover:text-[#137a4a]">
              {t.navAbout}
            </Link>

            <Link href="/how-it-works" className="hover:text-[#137a4a]">
              {t.navHow}
            </Link>

            <Link href="/contact" className="hover:text-[#137a4a]">
              {t.navContact}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-[#137a4a] shadow-2xl">
          <PatternLayer />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] min-h-[620px]">
            <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full bg-white/12 border border-white/20 text-white text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" />
                {t.badge}
              </span>

              <h1 className="font-heading text-4xl md:text-6xl font-bold mt-7 leading-tight text-white max-w-4xl">
                {t.heroTitle}
              </h1>

              <p className="text-green-50/95 text-lg mt-6 leading-relaxed max-w-2xl">
                {t.heroText}
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#137a4a] font-bold hover:bg-green-50"
                >
                  {t.applyMembership}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/30 text-white font-bold hover:bg-white/10"
                >
                  {t.seeHow}
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                <MiniStat title={t.stat1} />
                <MiniStat title={t.stat2} />
                <MiniStat title={t.stat3} />
              </div>
            </div>

            <HeroGraphic
              visualTitle={t.visualTitle}
              visualText={t.visualText}
              isUrdu={isUrdu}
            />
          </div>
        </div>
      </section>

      {/* Feature Intro */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#137a4a]">
              <Sparkles className="w-4 h-4" />
              MBN Pakistan
            </span>

            <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-950 mt-4 leading-tight">
              {t.sectionTitle}
            </h2>

            <p className="text-slate-600 mt-5 text-lg leading-relaxed">
              {t.sectionText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Building2 className="w-7 h-7 text-[#137a4a]" />}
              title={t.card1Title}
              text={t.card1Text}
            />

            <FeatureCard
              icon={<Search className="w-7 h-7 text-[#137a4a]" />}
              title={t.card2Title}
              text={t.card2Text}
            />

            <FeatureCard
              icon={<Lock className="w-7 h-7 text-[#137a4a]" />}
              title={t.card3Title}
              text={t.card3Text}
            />
          </div>
        </div>
      </section>

      {/* How it works visual section */}
      <section className="bg-white border-y border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-950">
              {t.howTitle}
            </h2>

            <p className="text-slate-600 mt-4 text-lg leading-relaxed">
              {t.howText}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-5">
            <ProcessCard
              number="01"
              icon={<FileText className="w-6 h-6" />}
              title={t.step1Title}
              text={t.step1Text}
            />

            <ProcessCard
              number="02"
              icon={<ShieldCheck className="w-6 h-6" />}
              title={t.step2Title}
              text={t.step2Text}
            />

            <ProcessCard
              number="03"
              icon={<Upload className="w-6 h-6" />}
              title={t.step3Title}
              text={t.step3Text}
            />

            <ProcessCard
              number="04"
              icon={<Eye className="w-6 h-6" />}
              title={t.step4Title}
              text={t.step4Text}
            />
          </div>
        </div>
      </section>

      {/* Privacy section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0b5f38] text-white p-8 md:p-12">
          <div className="absolute inset-0 opacity-20">
            <PatternLayer />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-bold">
                <Lock className="w-4 h-4" />
                Privacy System
              </span>

              <h2 className="font-heading text-3xl md:text-5xl font-bold mt-5 leading-tight">
                {t.privacyTitle}
              </h2>

              <p className="text-green-50/90 mt-5 text-lg leading-relaxed">
                {t.privacyText}
              </p>
            </div>

            <div className="space-y-4">
              <PrivacyRow text={t.privacy1} />
              <PrivacyRow text={t.privacy2} />
              <PrivacyRow text={t.privacy3} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="rounded-[2rem] bg-white border border-emerald-900/10 p-8 md:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 shadow-sm">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-950">
              {t.ctaTitle}
            </h2>

            <p className="text-slate-600 mt-3 max-w-2xl leading-relaxed">
              {t.ctaText}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              className="inline-flex justify-center px-7 py-3.5 rounded-xl bg-[#137a4a] text-white font-bold hover:bg-[#0b5f38]"
            >
              {t.applyMembership}
            </Link>

            <Link
              href="/contact"
              className="inline-flex justify-center px-7 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
            >
              {t.navContact}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#073b24] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <img
                  src="/mbn-logo.png"
                  alt="MBN Pakistan"
                  className="w-12 h-12 object-contain bg-white rounded-lg p-1"
                />

                <div>
                  <p className="font-heading font-bold text-white">
                    MBN Pakistan
                  </p>
                  <p className="text-xs text-green-100/70">{t.subtitle}</p>
                </div>
              </div>

              <p className="text-green-50/70 text-sm mt-5 max-w-md leading-relaxed">
                {t.footerText}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">{t.website}</h3>

              <div className="space-y-3 text-sm text-green-50/70">
                <Link href="/about" className="block hover:text-white">
                  {t.navAbout}
                </Link>

                <Link href="/how-it-works" className="block hover:text-white">
                  {t.navHow}
                </Link>

                <Link href="/contact" className="block hover:text-white">
                  {t.navContact}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">{t.bureauAccess}</h3>

              <div className="space-y-3 text-sm text-green-50/70">
                <Link href="/login" className="block hover:text-white">
                  {t.login}
                </Link>

                <Link href="/register" className="block hover:text-white">
                  {t.applyMembership}
                </Link>

                <Link href="/dashboard" className="block hover:text-white">
                  {t.dashboard}
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6">
            <p className="text-sm text-green-50/60">
              © {new Date().getFullYear()} MBN Pakistan. {t.rights}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PatternLayer() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          radial-gradient(circle at 18% 20%, rgba(255,255,255,0.22) 0 2px, transparent 2px),
          radial-gradient(circle at 82% 28%, rgba(255,255,255,0.15) 0 2px, transparent 2px),
          radial-gradient(circle at 55% 78%, rgba(255,255,255,0.16) 0 2px, transparent 2px),
          linear-gradient(135deg, rgba(255,255,255,0.16) 0%, transparent 32%),
          linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.08) 49%, rgba(255,255,255,0.08) 51%, transparent 52%)
        `,
        backgroundSize: '120px 120px, 150px 150px, 180px 180px, 100% 100%, 34px 34px',
      }}
    />
  );
}

function MiniStat({ title }: { title: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
      <CheckCircle className="w-5 h-5 text-green-100 mb-2" />
      <p className="font-semibold text-white text-sm">{title}</p>
    </div>
  );
}

function HeroGraphic({
  visualTitle,
  visualText,
  isUrdu,
}: {
  visualTitle: string;
  visualText: string;
  isUrdu: boolean;
}) {
  return (
    <div className="relative p-8 md:p-12 flex items-center justify-center bg-[#0b5f38]/55">
      <div className="absolute inset-0 opacity-30">
        <PatternLayer />
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -right-8 w-36 h-36 rounded-full bg-emerald-200/20 blur-2xl" />

        <div className="relative bg-white rounded-[2rem] p-6 shadow-2xl border border-white/40">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-heading text-2xl font-bold text-slate-950">
                {visualTitle}
              </p>
              <p className="text-sm text-slate-500 mt-1">{visualText}</p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
              <Network className="w-6 h-6 text-[#137a4a]" />
            </div>
          </div>

          <div className="space-y-4">
            <MockProfile
              title="MBN-1004"
              meta={isUrdu ? 'دلہن • ملتان' : 'Bride • Multan'}
              color="bg-green-50"
              icon={<Users className="w-5 h-5 text-[#137a4a]" />}
            />

            <MockProfile
              title="MBN-1021"
              meta={isUrdu ? 'دلہا • لاہور' : 'Groom • Lahore'}
              color="bg-blue-50"
              icon={<Search className="w-5 h-5 text-blue-700" />}
            />

            <MockProfile
              title={isUrdu ? 'رابطہ محفوظ' : 'Contact Protected'}
              meta={isUrdu ? 'ویو لاگ محفوظ' : 'View log saved'}
              color="bg-amber-50"
              icon={<Lock className="w-5 h-5 text-amber-700" />}
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="font-bold text-slate-950">4</p>
              <p className="text-[11px] text-slate-500">Profiles</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="font-bold text-slate-950">6</p>
              <p className="text-[11px] text-slate-500">Views</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="font-bold text-slate-950">1</p>
              <p className="text-[11px] text-slate-500">Bureau</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockProfile({
  title,
  meta,
  color,
  icon,
}: {
  title: string;
  meta: string;
  color: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
        {icon}
      </div>

      <div className="flex-1">
        <p className="font-bold text-slate-950">{title}</p>
        <p className="text-xs text-slate-500 mt-1">{meta}</p>
      </div>

      <div className="w-2.5 h-2.5 rounded-full bg-[#137a4a]" />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white border border-emerald-900/10 rounded-3xl p-7 shadow-sm hover:shadow-md transition">
      <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
        {icon}
      </div>

      <h3 className="font-heading text-xl font-bold text-slate-950">
        {title}
      </h3>

      <p className="text-sm text-slate-600 mt-3 leading-relaxed">{text}</p>
    </div>
  );
}

function ProcessCard({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="relative bg-[#f3f8f4] border border-emerald-900/10 rounded-3xl p-6 overflow-hidden">
      <div className="absolute right-5 top-4 text-5xl font-bold text-emerald-900/5">
        {number}
      </div>

      <div className="relative w-13 h-13 rounded-2xl bg-white border border-emerald-900/10 flex items-center justify-center text-[#137a4a] mb-5">
        {icon}
      </div>

      <h3 className="relative font-heading text-lg font-bold text-slate-950">
        {title}
      </h3>

      <p className="relative text-sm text-slate-600 mt-3 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function PrivacyRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 p-5">
      <CheckCircle className="w-5 h-5 text-green-100 flex-shrink-0" />
      <p className="font-semibold text-white">{text}</p>
    </div>
  );
}
