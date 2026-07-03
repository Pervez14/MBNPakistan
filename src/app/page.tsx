'use client';

import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Lock,
  ArrowRight,
  CheckCircle,
  Users,
  Building2,
  Eye,
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
    heroTitle: 'A Trusted Network for Professional Marriage Bureaus',
    heroText:
      'MBN Pakistan helps verified marriage bureaus upload profiles, search suitable matches, protect privacy, and manage contact activity in one organized platform.',
    applyMembership: 'Apply for Membership',
    seeHow: 'How It Works',

    stat1: 'Verified Bureaus',
    stat2: 'Private Profiles',
    stat3: 'Contact Tracking',

    sectionTitle: 'Built for serious marriage bureaus',
    sectionText:
      'Instead of managing profiles through WhatsApp, notebooks, or scattered files, MBN Pakistan gives bureaus a clean digital system to work professionally.',

    card1Title: 'Upload Profiles',
    card1Text:
      'Add bride and groom profiles with family, education, career, and match requirements.',

    card2Title: 'Search Matches',
    card2Text:
      'Find suitable profiles by gender, city, province, caste, education, profession, and more.',

    card3Title: 'Protect Privacy',
    card3Text:
      'Hide contacts until requested, blur or hide photos, and track contact views safely.',

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
    heroTitle: 'پیشہ ور میرج بیوروز کے لیے قابلِ اعتماد نیٹ ورک',
    heroText:
      'MBN Pakistan تصدیق شدہ میرج بیوروز کو پروفائلز اپلوڈ کرنے، مناسب رشتے تلاش کرنے، پرائیویسی محفوظ رکھنے، اور رابطہ سرگرمی کو ایک منظم پلیٹ فارم میں مینیج کرنے میں مدد دیتا ہے۔',
    applyMembership: 'رکنیت کے لیے درخواست دیں',
    seeHow: 'طریقہ کار دیکھیں',

    stat1: 'تصدیق شدہ بیوروز',
    stat2: 'پرائیویٹ پروفائلز',
    stat3: 'رابطہ ٹریکنگ',

    sectionTitle: 'سنجیدہ میرج بیوروز کے لیے بنایا گیا',
    sectionText:
      'واٹس ایپ، نوٹ بکس یا بکھری ہوئی فائلوں کے بجائے MBN Pakistan بیوروز کو ایک صاف اور منظم ڈیجیٹل سسٹم دیتا ہے۔',

    card1Title: 'پروفائلز اپلوڈ کریں',
    card1Text:
      'دلہن اور دلہا کی پروفائلز فیملی، تعلیم، کیریئر اور رشتہ ضروریات کے ساتھ شامل کریں۔',

    card2Title: 'رشتے تلاش کریں',
    card2Text:
      'جنس، شہر، صوبہ، ذات، تعلیم، پیشہ اور دیگر معلومات کے ذریعے مناسب پروفائلز تلاش کریں۔',

    card3Title: 'پرائیویسی محفوظ رکھیں',
    card3Text:
      'رابطہ تفصیلات درخواست تک چھپی رہتی ہیں، تصاویر بلر یا ہائیڈ ہو سکتی ہیں، اور رابطہ ویوز ٹریک ہوتے ہیں۔',

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
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen bg-[#f7faf7]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur border-b border-green-900/10 sticky top-0 z-40">
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
            <Link href="/about" className="hover:text-green-800">
              {t.navAbout}
            </Link>

            <Link href="/how-it-works" className="hover:text-green-800">
              {t.navHow}
            </Link>

            <Link href="/contact" className="hover:text-green-800">
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
              className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-[#0f5132] text-white font-semibold hover:bg-[#0b3d26]"
            >
              {t.apply}
            </Link>
          </div>
        </div>

        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3">
          <div className="flex items-center justify-center gap-5 text-xs font-semibold text-slate-600">
            <Link href="/about" className="hover:text-green-800">
              {t.navAbout}
            </Link>

            <Link href="/how-it-works" className="hover:text-green-800">
              {t.navHow}
            </Link>

            <Link href="/contact" className="hover:text-green-800">
              {t.navContact}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="rounded-[2rem] overflow-hidden bg-[#0f5132] text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="p-8 md:p-14 lg:p-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" />
                {t.badge}
              </span>

              <h1 className="font-heading text-4xl md:text-6xl font-bold mt-7 leading-tight max-w-4xl">
                {t.heroTitle}
              </h1>

              <p className="text-green-50/90 text-lg mt-6 leading-relaxed max-w-2xl">
                {t.heroText}
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#0f5132] font-bold hover:bg-green-50"
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
            </div>

            <div className="bg-[#0b3d26] p-8 md:p-12 flex items-center">
              <div className="w-full bg-white/10 border border-white/15 rounded-3xl p-6 backdrop-blur">
                <img
                  src="/mbn-logo.png"
                  alt="MBN Pakistan"
                  className="w-20 h-20 object-contain bg-white rounded-2xl p-2 mb-6"
                />

                <div className="space-y-4">
                  <TrustRow title={t.stat1} />
                  <TrustRow title={t.stat2} />
                  <TrustRow title={t.stat3} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Intro */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="max-w-3xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-950">
            {t.sectionTitle}
          </h2>

          <p className="text-slate-600 mt-4 text-lg leading-relaxed">
            {t.sectionText}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <CleanCard
            icon={<Building2 className="w-7 h-7 text-[#0f5132]" />}
            title={t.card1Title}
            text={t.card1Text}
          />

          <CleanCard
            icon={<Search className="w-7 h-7 text-[#0f5132]" />}
            title={t.card2Title}
            text={t.card2Text}
          />

          <CleanCard
            icon={<Lock className="w-7 h-7 text-[#0f5132]" />}
            title={t.card3Title}
            text={t.card3Text}
          />
        </div>
      </section>

      {/* Clean CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="rounded-[2rem] bg-white border border-green-900/10 p-8 md:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
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
              className="inline-flex justify-center px-7 py-3.5 rounded-xl bg-[#0f5132] text-white font-bold hover:bg-[#0b3d26]"
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
      <footer className="bg-[#082f1f] text-white">
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

function TrustRow({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 p-4">
      <CheckCircle className="w-5 h-5 text-green-200 flex-shrink-0" />
      <p className="font-semibold text-white">{title}</p>
    </div>
  );
}

function CleanCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white border border-green-900/10 rounded-3xl p-7 shadow-sm hover:shadow-md transition">
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
