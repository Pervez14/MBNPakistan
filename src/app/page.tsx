'use client';

import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Search,
  Lock,
  Eye,
  Upload,
  ArrowRight,
  CheckCircle,
  HeartHandshake,
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

    badge: 'Verified Marriage Bureau Network',
    heroTitle: 'Every Bureau Connected. Every Match Possible.',
    heroText:
      'MBN Pakistan is a professional digital platform for verified marriage bureaus to upload profiles, search suitable matches, protect privacy, and manage contact activity in one secure system.',
    applyMembership: 'Apply for Membership',
    seeHow: 'See How It Works',

    verified: 'Verified bureaus',
    privacy: 'Privacy controls',
    logs: 'Contact logs',

    cardTitle: 'MBN Pakistan',
    cardSubtitle: 'Marriage Bureau Network',

    featureProfiles: 'Bureau Profiles',
    featureProfilesText:
      'Upload bride and groom profiles with complete details.',
    featureSearch: 'Smart Search',
    featureSearchText:
      'Search profiles by city, caste, education, profession, and more.',
    featurePrivacy: 'Privacy First',
    featurePrivacyText:
      'Blur or hide profile photos when privacy is required.',
    featureTracking: 'Contact Tracking',
    featureTrackingText:
      'Track which bureau viewed which profile contact details.',

    howTitle: 'How It Works',
    howText: 'A simple professional system for verified marriage bureaus.',
    step1Title: '1. Apply & Get Approved',
    step1Text:
      'Marriage bureaus apply for membership. Admin reviews and approves serious bureaus.',
    step2Title: '2. Upload Profiles',
    step2Text:
      'Approved bureaus upload bride and groom profiles with privacy settings.',
    step3Title: '3. Search & Connect',
    step3Text:
      'Search network profiles and reveal contact details when needed.',
    learnMore: 'Learn More',

    builtTitle: 'Built for professional marriage bureaus',
    builtText:
      'Instead of managing profiles through WhatsApp, notebooks, or scattered files, MBN Pakistan gives bureaus one organized platform to upload, search, and manage profiles professionally.',

    benefit1: 'Verified bureau access only',
    benefit2: 'Profile photo privacy: public, blurred, or hidden',
    benefit3: 'Hidden contact details until View Contact is clicked',
    benefit4: 'Admin can track contact view history',
    benefit5: 'Search by province, city, caste, education, and employment',
    benefit6: 'Uploader can edit, remove, or reactivate profiles',

    ctaTitle: 'Ready to join MBN Pakistan?',
    ctaText:
      'Apply as a verified marriage bureau and start using a professional matchmaking dashboard.',

    footerText:
      'A professional platform for verified marriage bureaus to manage profiles, search suitable matches, and protect candidate privacy.',
    website: 'Website',
    bureauAccess: 'Bureau Access',
    dashboard: 'Dashboard',
    rights: 'All rights reserved.',
    footerBuilt: 'Built for verified marriage bureaus',
  },

  ur: {
    navAbout: 'ہمارے بارے میں',
    navHow: 'یہ کیسے کام کرتا ہے',
    navContact: 'رابطہ کریں',
    login: 'لاگ اِن',
    apply: 'درخواست دیں',

    badge: 'تصدیق شدہ میرج بیورو نیٹ ورک',
    heroTitle: 'ہر بیورو منسلک، ہر رشتہ ممکن',
    heroText:
      'MBN Pakistan ایک پیشہ ور ڈیجیٹل پلیٹ فارم ہے جہاں تصدیق شدہ میرج بیوروز پروفائلز اپلوڈ کر سکتے ہیں، مناسب رشتے تلاش کر سکتے ہیں، پرائیویسی محفوظ رکھ سکتے ہیں، اور رابطہ سرگرمی کو ایک محفوظ سسٹم میں مینیج کر سکتے ہیں۔',
    applyMembership: 'رکنیت کے لیے درخواست دیں',
    seeHow: 'طریقہ کار دیکھیں',

    verified: 'تصدیق شدہ بیوروز',
    privacy: 'پرائیویسی کنٹرول',
    logs: 'رابطہ لاگز',

    cardTitle: 'MBN Pakistan',
    cardSubtitle: 'میرج بیورو نیٹ ورک',

    featureProfiles: 'بیورو پروفائلز',
    featureProfilesText:
      'دلہن اور دلہا کی مکمل تفصیلات کے ساتھ پروفائلز اپلوڈ کریں۔',
    featureSearch: 'سمارٹ سرچ',
    featureSearchText:
      'شہر، ذات، تعلیم، پیشہ اور دیگر معلومات کے ذریعے پروفائلز تلاش کریں۔',
    featurePrivacy: 'پرائیویسی پہلے',
    featurePrivacyText:
      'ضرورت پڑنے پر پروفائل تصویر کو بلر یا مکمل طور پر چھپائیں۔',
    featureTracking: 'رابطہ ٹریکنگ',
    featureTrackingText:
      'دیکھیں کہ کس بیورو نے کس پروفائل کے رابطہ کی تفصیلات دیکھی ہیں۔',

    howTitle: 'یہ کیسے کام کرتا ہے',
    howText: 'تصدیق شدہ میرج بیوروز کے لیے ایک آسان اور پیشہ ور سسٹم۔',
    step1Title: '1. درخواست دیں اور منظوری حاصل کریں',
    step1Text:
      'میرج بیوروز رکنیت کے لیے درخواست دیتے ہیں۔ ایڈمن درخواست کا جائزہ لے کر سنجیدہ بیوروز کو منظور کرتا ہے۔',
    step2Title: '2. پروفائلز اپلوڈ کریں',
    step2Text:
      'منظور شدہ بیوروز دلہن اور دلہا کی پروفائلز پرائیویسی سیٹنگز کے ساتھ اپلوڈ کرتے ہیں۔',
    step3Title: '3. تلاش کریں اور رابطہ کریں',
    step3Text:
      'نیٹ ورک پروفائلز تلاش کریں اور ضرورت پڑنے پر رابطہ تفصیلات دیکھیں۔',
    learnMore: 'مزید جانیں',

    builtTitle: 'پیشہ ور میرج بیوروز کے لیے بنایا گیا',
    builtText:
      'واٹس ایپ، نوٹ بکس یا بکھری ہوئی فائلوں کے بجائے MBN Pakistan بیوروز کو ایک منظم پلیٹ فارم دیتا ہے جہاں وہ پروفائلز اپلوڈ، تلاش اور مینیج کر سکتے ہیں۔',

    benefit1: 'صرف تصدیق شدہ بیوروز کو رسائی',
    benefit2: 'پروفائل تصویر کی پرائیویسی: پبلک، بلر، یا ہِڈن',
    benefit3: 'رابطہ تفصیلات View Contact تک چھپی رہتی ہیں',
    benefit4: 'ایڈمن رابطہ دیکھنے کی ہسٹری ٹریک کر سکتا ہے',
    benefit5: 'صوبہ، شہر، ذات، تعلیم اور ملازمت کے حساب سے تلاش',
    benefit6: 'اپلوڈر پروفائل ایڈٹ، ہٹا یا دوبارہ ایکٹو کر سکتا ہے',

    ctaTitle: 'MBN Pakistan میں شامل ہونے کے لیے تیار ہیں؟',
    ctaText:
      'تصدیق شدہ میرج بیورو کے طور پر درخواست دیں اور پیشہ ور میچ میکنگ ڈیش بورڈ استعمال کرنا شروع کریں۔',

    footerText:
      'تصدیق شدہ میرج بیوروز کے لیے ایک پیشہ ور پلیٹ فارم جہاں وہ پروفائلز مینیج، مناسب رشتے تلاش، اور امیدواروں کی پرائیویسی محفوظ رکھ سکتے ہیں۔',
    website: 'ویب سائٹ',
    bureauAccess: 'بیورو رسائی',
    dashboard: 'ڈیش بورڈ',
    rights: 'تمام حقوق محفوظ ہیں۔',
    footerBuilt: 'تصدیق شدہ میرج بیوروز کے لیے بنایا گیا',
  },
};

export default function HomePage() {
  const { language, setLanguage, isUrdu } = useLanguage();
  const t = content[language];

  return (
    <div
      dir={isUrdu ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50"
    >
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
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
              <p className="text-xs text-slate-500">{t.cardSubtitle}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <Link href="/about" className="hover:text-green-700">
              {t.navAbout}
            </Link>

            <Link href="/how-it-works" className="hover:text-green-700">
              {t.navHow}
            </Link>

            <Link href="/contact" className="hover:text-green-700">
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
              className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
            >
              {t.apply}
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3">
          <div className="flex items-center justify-center gap-5 text-xs font-semibold text-slate-600">
            <Link href="/about" className="hover:text-green-700">
              {t.navAbout}
            </Link>

            <Link href="/how-it-works" className="hover:text-green-700">
              {t.navHow}
            </Link>

            <Link href="/contact" className="hover:text-green-700">
              {t.navContact}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold border border-green-100">
              <ShieldCheck className="w-4 h-4" />
              {t.badge}
            </span>

            <h1 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 mt-6 leading-tight">
              {t.heroTitle}
            </h1>

            <p className="text-lg text-slate-600 mt-6 leading-relaxed">
              {t.heroText}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800"
              >
                {t.applyMembership}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-white"
              >
                {t.seeHow}
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[t.verified, t.privacy, t.logs].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <CheckCircle className="w-5 h-5 text-green-700" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/mbn-logo.png"
                alt="MBN Pakistan"
                className="w-16 h-16 object-contain"
              />

              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900">
                  {t.cardTitle}
                </h2>
                <p className="text-sm text-slate-500">{t.cardSubtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureCard
                icon={<Users className="w-8 h-8 text-green-700 mb-4" />}
                title={t.featureProfiles}
                text={t.featureProfilesText}
                color="bg-green-50 border-green-100"
              />

              <FeatureCard
                icon={<Search className="w-8 h-8 text-blue-700 mb-4" />}
                title={t.featureSearch}
                text={t.featureSearchText}
                color="bg-blue-50 border-blue-100"
              />

              <FeatureCard
                icon={<Lock className="w-8 h-8 text-amber-700 mb-4" />}
                title={t.featurePrivacy}
                text={t.featurePrivacyText}
                color="bg-amber-50 border-amber-100"
              />

              <FeatureCard
                icon={<Eye className="w-8 h-8 text-purple-700 mb-4" />}
                title={t.featureTracking}
                text={t.featureTrackingText}
                color="bg-purple-50 border-purple-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900">
              {t.howTitle}
            </h2>

            <p className="text-slate-600 mt-4">{t.howText}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <StepCard
              icon={<ShieldCheck className="w-7 h-7 text-green-700" />}
              title={t.step1Title}
              text={t.step1Text}
            />

            <StepCard
              icon={<Upload className="w-7 h-7 text-green-700" />}
              title={t.step2Title}
              text={t.step2Text}
            />

            <StepCard
              icon={<Search className="w-7 h-7 text-green-700" />}
              title={t.step3Title}
              text={t.step3Text}
            />
          </div>

          <div className="text-center mt-10">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800"
            >
              {t.learnMore}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900">
              {t.builtTitle}
            </h2>

            <p className="text-slate-600 mt-4 leading-relaxed">
              {t.builtText}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/about"
                className="inline-flex justify-center px-6 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50"
              >
                {t.navAbout}
              </Link>

              <Link
                href="/contact"
                className="inline-flex justify-center px-6 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50"
              >
                {t.navContact}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              t.benefit1,
              t.benefit2,
              t.benefit3,
              t.benefit4,
              t.benefit5,
              t.benefit6,
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-5"
              >
                <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0" />
                <p className="font-semibold text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
            {t.ctaTitle}
          </h2>

          <p className="text-green-50 mt-4 max-w-2xl mx-auto">{t.ctaText}</p>

          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex justify-center px-6 py-3 rounded-lg bg-white text-green-700 font-bold hover:bg-green-50"
            >
              {t.applyMembership}
            </Link>

            <Link
              href="/contact"
              className="inline-flex justify-center px-6 py-3 rounded-lg border border-green-300 text-white font-bold hover:bg-green-600"
            >
              {t.navContact}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white">
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
                  <p className="text-xs text-slate-400">{t.cardSubtitle}</p>
                </div>
              </div>

              <p className="text-slate-400 text-sm mt-5 max-w-md leading-relaxed">
                {t.footerText}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">{t.website}</h3>

              <div className="space-y-3 text-sm text-slate-400">
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

              <div className="space-y-3 text-sm text-slate-400">
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

          <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} MBN Pakistan. {t.rights}
            </p>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <HeartHandshake className="w-4 h-4" />
              {t.footerBuilt}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <div className={`p-5 rounded-2xl border ${color}`}>
      {icon}
      <p className="font-bold text-slate-900">{title}</p>
      <p className="text-sm text-slate-600 mt-2">{text}</p>
    </div>
  );
}

function StepCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7">
      <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
        {icon}
      </div>

      <h3 className="font-heading text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="text-sm text-slate-600 mt-3 leading-relaxed">{text}</p>
    </div>
  );
}
