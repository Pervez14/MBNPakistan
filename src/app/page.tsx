'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle,
  ClipboardList,
  Clock,
  HeartHandshake,
  Lock,
  Network,
  Search,
  ShieldCheck,
  Upload,
  UserCheck,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';

const content = {
  en: {
    subtitle: 'Marriage Bureau Network',
    home: 'Home',
    how: 'How It Works',
    families: 'For Families',
    bureaus: 'For Bureaus',
    about: 'About Us',
    contact: 'Contact Us',
    bureauLogin: 'Bureau Login',
    submitProfile: 'Submit Your Profile',

    familyTitle: 'Looking for a Life Partner?',
    familyText:
      'Submit your profile privately. Our team reviews your information and may connect you with a suitable matchmaker or verified marriage bureau.',
    familyBullet1: 'Private submission',
    familyBullet2: 'Reviewed before sharing',
    familyBullet3: 'You stay informed',

    bureauTitle: 'Grow Your Matchmaking Network',
    bureauText:
      'Join a professional network of verified marriage bureaus. Upload profiles, search suitable matches and manage matchmaking activity securely.',
    bureauBullet1: 'Join a verified network',
    bureauBullet2: 'Upload & search profiles',
    bureauBullet3: 'Manage cases & follow-ups',
    bureauBullet4: 'Work with professionalism',
    applyBureau: 'Apply as a Bureau',
    memberLogin: 'Already a member? Login',

    trust1Title: 'Private by Design',
    trust1Text: 'Your information is always protected.',
    trust2Title: 'Reviewed Before Action',
    trust2Text: 'Every profile is reviewed before any sharing.',
    trust3Title: 'Professional Network',
    trust3Text: 'Only verified marriage bureaus can join.',
    trust4Title: 'Trackable Follow-up',
    trust4Text: 'Cases and follow-ups are recorded and monitored.',

    howTitle: 'How It Works',
    familyJourneyTitle: 'For Individuals & Families',
    familyJourneyText: 'A simple and private journey to find the right match.',
    familyStep1Title: 'Submit Your Profile',
    familyStep1Text: 'Share your personal, family, education and preferences.',
    familyStep2Title: 'MBN Reviews',
    familyStep2Text: 'Our team reviews your submission and may contact you if needed.',
    familyStep3Title: 'Profile Assignment',
    familyStep3Text: 'Your profile may be assigned to a suitable matchmaker or bureau.',
    familyStep4Title: 'Follow-up & Progress',
    familyStep4Text: 'The assigned team works on suitable matches and keeps you informed.',

    bureauJourneyTitle: 'For Marriage Bureaus',
    bureauJourneyText: 'Build your network and manage matchmaking professionally.',
    bureauStep1Title: 'Apply to Join',
    bureauStep1Text: 'Submit your bureau information and business details.',
    bureauStep2Title: 'Get Verified',
    bureauStep2Text: 'Our team reviews your application and grants network access.',
    bureauStep3Title: 'Upload & Search',
    bureauStep3Text: 'Upload profiles and search across the network securely.',
    bureauStep4Title: 'Manage & Follow-up',
    bureauStep4Text: 'Work on cases, record follow-ups and manage matches professionally.',

    whyTitle: 'Why MBN Pakistan?',
    why1Title: 'For Families',
    why1Text:
      'A safe and respectful way to submit your profile and receive professional matchmaking support.',
    why2Title: 'For Bureaus',
    why2Text:
      'A wider professional network, better tools, and organized profile management.',
    why3Title: 'For the Network',
    why3Text:
      'Clear assignment, follow-up and accountability across all matchmaking cases.',

    privacyTitle: 'Your Information Deserves Privacy',
    privacyText:
      'We understand how important your privacy is. MBN Pakistan follows a review-first workflow designed to protect personal information.',
    privacy1: 'Submitting a profile does not mean it is automatically public.',
    privacy2: 'All submissions are reviewed before any action is taken.',
    privacy3: 'Your profile may be assigned to a suitable bureau or matchmaker.',
    privacy4: 'Contact details are shared only through the platform workflow.',

    readyTitle: 'Ready to Begin?',
    readyText: "Choose the path that's right for you.",
    choice1Title: 'I Want to Submit My Profile',
    choice1Text: 'For individuals and families seeking serious marriage opportunities.',
    choice2Title: 'I Represent a Marriage Bureau',
    choice2Text: 'Join the professional MBN Pakistan network today.',

    footerText:
      'A trusted, privacy-focused matchmaking network for individuals, families, and professional marriage bureaus.',
    rights: 'All rights reserved.',
  },
  ur: {
    subtitle: 'میرج بیورو نیٹ ورک',
    home: 'ہوم',
    how: 'یہ کیسے کام کرتا ہے',
    families: 'خاندانوں کے لیے',
    bureaus: 'بیوروز کے لیے',
    about: 'ہمارے بارے میں',
    contact: 'رابطہ کریں',
    bureauLogin: 'بیورو لاگ اِن',
    submitProfile: 'اپنی پروفائل جمع کروائیں',

    familyTitle: 'زندگی کا ساتھی تلاش کر رہے ہیں؟',
    familyText:
      'اپنی پروفائل نجی طور پر جمع کروائیں۔ ہماری ٹیم معلومات کا جائزہ لے گی اور مناسب صورت میں آپ کو کسی میچ میکر یا تصدیق شدہ میرج بیورو سے جوڑ سکتی ہے۔',
    familyBullet1: 'نجی سبمیشن',
    familyBullet2: 'شیئرنگ سے پہلے جائزہ',
    familyBullet3: 'آپ کو پیش رفت سے آگاہ رکھا جائے گا',

    bureauTitle: 'اپنا میچ میکنگ نیٹ ورک بڑھائیں',
    bureauText:
      'تصدیق شدہ میرج بیوروز کے پیشہ ور نیٹ ورک میں شامل ہوں۔ پروفائلز اپلوڈ کریں، مناسب رشتے تلاش کریں اور کام کو محفوظ طریقے سے منظم کریں۔',
    bureauBullet1: 'تصدیق شدہ نیٹ ورک میں شامل ہوں',
    bureauBullet2: 'پروفائل اپلوڈ اور سرچ کریں',
    bureauBullet3: 'کیسز اور فالو اپ مینیج کریں',
    bureauBullet4: 'پیشہ ورانہ انداز میں کام کریں',
    applyBureau: 'بیورو کے طور پر درخواست دیں',
    memberLogin: 'پہلے سے ممبر ہیں؟ لاگ اِن کریں',

    trust1Title: 'پرائیویسی بنیادی اصول',
    trust1Text: 'آپ کی معلومات محفوظ رکھی جاتی ہیں۔',
    trust2Title: 'کارروائی سے پہلے جائزہ',
    trust2Text: 'کسی بھی شیئرنگ سے پہلے ہر پروفائل دیکھی جاتی ہے۔',
    trust3Title: 'پیشہ ور نیٹ ورک',
    trust3Text: 'صرف تصدیق شدہ میرج بیوروز شامل ہو سکتے ہیں۔',
    trust4Title: 'قابلِ نگرانی فالو اپ',
    trust4Text: 'کیسز اور فالو اپ ریکارڈ اور مانیٹر ہوتے ہیں۔',

    howTitle: 'یہ کیسے کام کرتا ہے',
    familyJourneyTitle: 'افراد اور خاندانوں کے لیے',
    familyJourneyText: 'درست رشتہ تلاش کرنے کے لیے سادہ اور نجی سفر۔',
    familyStep1Title: 'پروفائل جمع کروائیں',
    familyStep1Text: 'ذاتی، خاندانی، تعلیمی اور ترجیحی معلومات شیئر کریں۔',
    familyStep2Title: 'MBN جائزہ لیتا ہے',
    familyStep2Text: 'ہماری ٹیم سبمیشن دیکھتی ہے اور ضرورت پر رابطہ کر سکتی ہے۔',
    familyStep3Title: 'پروفائل اسائنمنٹ',
    familyStep3Text: 'پروفائل مناسب میچ میکر یا بیورو کو دی جا سکتی ہے۔',
    familyStep4Title: 'فالو اپ اور پیش رفت',
    familyStep4Text: 'متعلقہ ٹیم مناسب مواقع پر کام کرتی اور آپ کو آگاہ رکھتی ہے۔',

    bureauJourneyTitle: 'میرج بیوروز کے لیے',
    bureauJourneyText: 'نیٹ ورک بڑھائیں اور میچ میکنگ کو پیشہ ورانہ طور پر منظم کریں۔',
    bureauStep1Title: 'درخواست دیں',
    bureauStep1Text: 'اپنی بیورو اور کاروباری معلومات جمع کروائیں۔',
    bureauStep2Title: 'تصدیق حاصل کریں',
    bureauStep2Text: 'ہماری ٹیم درخواست کا جائزہ لے کر نیٹ ورک رسائی دیتی ہے۔',
    bureauStep3Title: 'اپلوڈ اور سرچ',
    bureauStep3Text: 'پروفائلز اپلوڈ کریں اور نیٹ ورک میں محفوظ سرچ کریں۔',
    bureauStep4Title: 'مینیج اور فالو اپ',
    bureauStep4Text: 'کیسز پر کام کریں، فالو اپ ریکارڈ کریں اور میچز منظم کریں۔',

    whyTitle: 'MBN Pakistan کیوں؟',
    why1Title: 'خاندانوں کے لیے',
    why1Text: 'پروفائل جمع کروانے اور پیشہ ور میچ میکنگ سپورٹ حاصل کرنے کا محفوظ اور باوقار طریقہ۔',
    why2Title: 'بیوروز کے لیے',
    why2Text: 'وسیع پیشہ ور نیٹ ورک، بہتر ٹولز اور منظم پروفائل مینجمنٹ۔',
    why3Title: 'پورے نیٹ ورک کے لیے',
    why3Text: 'تمام کیسز میں واضح اسائنمنٹ، فالو اپ اور جواب دہی۔',

    privacyTitle: 'آپ کی معلومات پرائیویسی کی مستحق ہیں',
    privacyText: 'ہم آپ کی پرائیویسی کی اہمیت سمجھتے ہیں۔ MBN Pakistan ذاتی معلومات کے تحفظ کے لیے review-first workflow استعمال کرتا ہے۔',
    privacy1: 'پروفائل جمع کروانے کا مطلب یہ نہیں کہ وہ خودکار طور پر پبلک ہو جائے گی۔',
    privacy2: 'کسی بھی کارروائی سے پہلے ہر سبمیشن کا جائزہ لیا جاتا ہے۔',
    privacy3: 'آپ کی پروفائل مناسب بیورو یا میچ میکر کو اسائن کی جا سکتی ہے۔',
    privacy4: 'رابطہ معلومات صرف پلیٹ فارم ورک فلو کے مطابق شیئر ہوتی ہیں۔',

    readyTitle: 'آغاز کے لیے تیار ہیں؟',
    readyText: 'اپنے لیے درست راستہ منتخب کریں۔',
    choice1Title: 'میں اپنی پروفائل جمع کروانا چاہتا/چاہتی ہوں',
    choice1Text: 'سنجیدہ رشتے کے مواقع تلاش کرنے والے افراد اور خاندانوں کے لیے۔',
    choice2Title: 'میں ایک میرج بیورو کی نمائندگی کرتا/کرتی ہوں',
    choice2Text: 'آج ہی MBN Pakistan کے پیشہ ور نیٹ ورک میں شامل ہوں۔',

    footerText: 'افراد، خاندانوں اور پیشہ ور میرج بیوروز کے لیے قابلِ اعتماد اور پرائیویسی پر مبنی نیٹ ورک۔',
    rights: 'تمام حقوق محفوظ ہیں۔',
  },
};

export default function HomePage() {
  const { language, setLanguage, isUrdu } = useLanguage();
  const t = content[language];

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img src="/mbn-logo.png" alt="MBN Pakistan" className="h-12 w-12 object-contain" />
            <div className="leading-tight">
              <p className="font-heading text-xl font-bold tracking-[0.12em] text-[#063d25]">MBN</p>
              <p className="text-xs font-bold tracking-[0.2em] text-[#063d25]">PAKISTAN</p>
              <p className="mt-0.5 text-[10px] text-slate-500">{t.subtitle}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-900 xl:flex">
            <Link href="/" className="border-b-2 border-[#137a4a] pb-2 text-[#073b24]">{t.home}</Link>
            <Link href="#how-it-works" className="hover:text-[#137a4a]">{t.how}</Link>
            <Link href="#families" className="hover:text-[#137a4a]">{t.families}</Link>
            <Link href="#bureaus" className="hover:text-[#137a4a]">{t.bureaus}</Link>
            <Link href="/about" className="hover:text-[#137a4a]">{t.about}</Link>
            <Link href="/contact" className="hover:text-[#137a4a]">{t.contact}</Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <LanguageToggle language={language} setLanguage={setLanguage} />
            <Link
              href="/login"
              className="hidden rounded-lg border border-[#0b5f38] px-5 py-2.5 text-sm font-bold text-[#073b24] hover:bg-green-50 sm:inline-flex"
            >
              {t.bureauLogin}
            </Link>
            <Link
              href="/submit-profile"
              className="rounded-lg bg-[#0b6e34] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#07582a]"
            >
              {t.submitProfile}
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-100 px-4 py-2 xl:hidden">
          <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-5 overflow-x-auto whitespace-nowrap text-xs font-semibold text-slate-600">
            <Link href="#how-it-works">{t.how}</Link>
            <Link href="#families">{t.families}</Link>
            <Link href="#bureaus">{t.bureaus}</Link>
            <Link href="/about">{t.about}</Link>
            <Link href="/contact">{t.contact}</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-3 px-4 py-4 md:px-8 md:py-6">
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Families Hero Card */}
          <div
            id="families"
            className="relative min-h-[560px] overflow-hidden rounded-[1.5rem] bg-[#fbf4e9] shadow-sm lg:min-h-[560px]"
          >
            <img
              src="/mbn-family-hero.png"
              alt="Family reviewing a marriage profile"
              className={`absolute inset-y-0 h-full w-[62%] object-cover object-bottom ${
                isUrdu ? 'left-0' : 'right-0'
              }`}
            />

            <div
              className={`absolute inset-y-0 w-[32%] ${
                isUrdu
                  ? 'left-[48%] bg-gradient-to-l'
                  : 'right-[48%] bg-gradient-to-r'
              } from-[#fbf4e9] via-[#fbf4e9]/85 to-transparent`}
            />

            <div className={`relative z-10 flex min-h-[560px] flex-col justify-center p-7 md:p-9 lg:p-10 ${isUrdu ? 'mr-auto' : ''}`}>
              <div className="max-w-[340px]">
                <h1 className="font-heading text-4xl font-bold leading-[1.05] text-[#073b24] md:text-5xl">
                  {t.familyTitle}
                </h1>

                <p className="mt-4 text-[15px] leading-7 text-slate-800">
                  {t.familyText}
                </p>

                <div className="mt-5 space-y-2.5">
                  <HeroBullet text={t.familyBullet1} />
                  <HeroBullet text={t.familyBullet2} />
                  <HeroBullet text={t.familyBullet3} />
                </div>

                <Link
                  href="/submit-profile"
                  className="mt-6 inline-flex w-fit items-center gap-3 rounded-lg bg-[#0b7a36] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#075c29]"
                >
                  {t.submitProfile}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bureau Hero Card */}
          <div
            id="bureaus"
            className="relative min-h-[560px] overflow-hidden rounded-[1.5rem] bg-[#063f2a] text-white shadow-sm lg:min-h-[560px]"
          >
            <img
              src="/mbn-bureau-dashboard.png"
              alt="MBN bureau dashboard"
              className={`absolute inset-y-0 h-full w-[62%] object-cover object-bottom ${
                isUrdu ? 'left-0' : 'right-0'
              }`}
            />

            <div
              className={`absolute inset-y-0 w-[34%] ${
                isUrdu
                  ? 'left-[46%] bg-gradient-to-l'
                  : 'right-[46%] bg-gradient-to-r'
              } from-[#063f2a] via-[#063f2a]/90 to-transparent`}
            />

            <div className="relative z-10 flex min-h-[560px] flex-col justify-center p-7 md:p-9 lg:p-10">
              <div className="max-w-[360px]">
                <h2 className="font-heading text-4xl font-bold leading-[1.05] md:text-5xl">
                  {t.bureauTitle}
                </h2>

                <p className="mt-4 text-[15px] leading-7 text-green-50/95">
                  {t.bureauText}
                </p>

                <div className="mt-5 space-y-2.5">
                  <HeroBullet text={t.bureauBullet1} light />
                  <HeroBullet text={t.bureauBullet2} light />
                  <HeroBullet text={t.bureauBullet3} light />
                  <HeroBullet text={t.bureauBullet4} light />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-3 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-[#073b24] hover:bg-green-50"
                  >
                    {t.applyBureau}
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/login"
                    className="text-sm font-semibold text-white/90 underline-offset-4 hover:underline"
                  >
                    {t.memberLogin}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <TrustItem icon={<Lock className="h-8 w-8" />} title={t.trust1Title} text={t.trust1Text} />
          <TrustItem icon={<UserCheck className="h-8 w-8" />} title={t.trust2Title} text={t.trust2Text} />
          <TrustItem icon={<Network className="h-8 w-8" />} title={t.trust3Title} text={t.trust3Text} />
          <TrustItem icon={<Clock className="h-8 w-8" />} title={t.trust4Title} text={t.trust4Text} />
        </section>

        <section id="how-it-works" className="rounded-2xl bg-gradient-to-b from-[#f7fbf8] to-white px-5 py-5 md:px-7 md:py-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-[#073b24] md:text-4xl">{t.howTitle}</h2>
            <div className="mx-auto mt-2 h-0.5 w-10 bg-[#137a4a]" />
          </div>

          <div className="mt-1 grid grid-cols-1 lg:grid-cols-2">
            <JourneyBlock
              title={t.familyJourneyTitle}
              subtitle={t.familyJourneyText}
              steps={[
                { icon: <ClipboardList className="h-7 w-7" />, title: t.familyStep1Title, text: t.familyStep1Text },
                { icon: <ShieldCheck className="h-7 w-7" />, title: t.familyStep2Title, text: t.familyStep2Text },
                { icon: <Users className="h-7 w-7" />, title: t.familyStep3Title, text: t.familyStep3Text },
                { icon: <Clock className="h-7 w-7" />, title: t.familyStep4Title, text: t.familyStep4Text },
              ]}
              accent="green"
            />

            <JourneyBlock
              title={t.bureauJourneyTitle}
              subtitle={t.bureauJourneyText}
              steps={[
                { icon: <ClipboardList className="h-7 w-7" />, title: t.bureauStep1Title, text: t.bureauStep1Text },
                { icon: <ShieldCheck className="h-7 w-7" />, title: t.bureauStep2Title, text: t.bureauStep2Text },
                { icon: <Upload className="h-7 w-7" />, title: t.bureauStep3Title, text: t.bureauStep3Text },
                { icon: <Network className="h-7 w-7" />, title: t.bureauStep4Title, text: t.bureauStep4Text },
              ]}
              accent="dark"
              separated
            />
          </div>
        </section>

        <section className="rounded-2xl bg-[#f4faf5] px-6 py-5 md:px-8">
          <h2 className="text-center font-heading text-3xl font-bold text-[#073b24]">{t.whyTitle}</h2>
          <div className="mt-4 grid grid-cols-1 divide-y divide-emerald-900/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            <Pillar icon={<Users className="h-7 w-7" />} title={t.why1Title} text={t.why1Text} />
            <Pillar icon={<Building2 className="h-7 w-7" />} title={t.why2Title} text={t.why2Text} />
            <Pillar icon={<Network className="h-7 w-7" />} title={t.why3Title} text={t.why3Text} />
          </div>
        </section>

        <section className="grid items-center gap-7 rounded-2xl border border-slate-100 bg-white px-6 py-6 shadow-sm lg:grid-cols-[0.9fr_1.1fr] md:px-10">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[1.5rem] bg-green-50 text-[#137a4a]">
              <ShieldCheck className="h-11 w-11" />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-[#073b24]">{t.privacyTitle}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{t.privacyText}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
            <PrivacyBullet text={t.privacy1} />
            <PrivacyBullet text={t.privacy3} />
            <PrivacyBullet text={t.privacy2} />
            <PrivacyBullet text={t.privacy4} />
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-r from-[#073f46] via-[#0b5f38] to-[#168135] px-5 py-3 text-white md:px-7">
          <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <FinalChoice
              icon={<Users className="h-6 w-6" />}
              title={t.choice1Title}
              text={t.choice1Text}
              button={t.submitProfile}
              href="/submit-profile"
            />

            <div className="text-center px-2">
              <h2 className="font-heading text-3xl font-bold">{t.readyTitle}</h2>
              <p className="mt-1 text-sm text-green-50/90">{t.readyText}</p>
              <div className="mx-auto mt-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-[#073b24]">OR</div>
            </div>

            <FinalChoice
              icon={<Building2 className="h-6 w-6" />}
              title={t.choice2Title}
              text={t.choice2Text}
              button={t.applyBureau}
              href="/register"
            />
          </div>
        </section>
      </main>

      <footer className="mt-6 bg-[#073b24] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-3">
            <img src="/mbn-logo.png" alt="MBN Pakistan" className="h-11 w-11 rounded-lg bg-white p-1 object-contain" />
            <div>
              <p className="font-heading font-bold">MBN Pakistan</p>
              <p className="mt-1 max-w-xl text-xs text-green-50/70">{t.footerText}</p>
            </div>
          </div>
          <p className="text-xs text-green-50/60">© {new Date().getFullYear()} MBN Pakistan. {t.rights}</p>
        </div>
      </footer>
    </div>
  );
}

function HeroBullet({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div className={`flex items-center gap-3 text-sm font-medium ${light ? 'text-white' : 'text-slate-800'}`}>
      <CheckCircle className={`h-4 w-4 flex-shrink-0 ${light ? 'text-green-300' : 'text-[#159447]'}`} />
      <span>{text}</span>
    </div>
  );
}

function TrustItem({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 lg:border-e lg:border-slate-100 last:border-e-0">
      <div className="text-[#137a4a]">{icon}</div>
      <div>
        <h3 className="text-sm font-bold text-slate-950">{title}</h3>
        <p className="mt-0.5 text-xs leading-5 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

type JourneyStep = { icon: ReactNode; title: string; text: string };

function JourneyBlock({
  title,
  subtitle,
  steps,
  accent,
  separated = false,
}: {
  title: string;
  subtitle: string;
  steps: JourneyStep[];
  accent: 'green' | 'dark';
  separated?: boolean;
}) {
  const isGreen = accent === 'green';

  return (
    <div className={`px-1 py-3 md:px-5 ${separated ? 'lg:border-s lg:border-slate-200' : ''}`}>
      <div className="text-center">
        <h3 className={`text-xl font-bold ${isGreen ? 'text-[#12803d]' : 'text-[#073b24]'}`}>{title}</h3>
        <p className="mt-1 text-xs text-slate-600">{subtitle}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="relative text-center">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-emerald-900/10 bg-white text-[#073b24] shadow-sm">
              {step.icon}
              <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-[#0b5f38] text-xs font-bold text-white">
                {index + 1}
              </span>
            </div>

            <h4 className="mt-3 text-xs font-bold text-slate-950 md:text-sm">{step.title}</h4>
            <p className="mt-2 text-[11px] leading-4 text-slate-600">{step.text}</p>

            {index < steps.length - 1 && (
              <ArrowRight className="absolute -end-3 top-7 hidden h-4 w-4 text-[#72bf7e] md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Pillar({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-5 px-5 py-4">
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#138140] to-[#075b2b] text-white shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-[#073b24]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function PrivacyBullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-slate-700">
      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#159447]" />
      <span className="leading-5">{text}</span>
    </div>
  );
}

function FinalChoice({
  icon,
  title,
  text,
  button,
  href,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  button: string;
  href: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-3 text-slate-950 shadow-sm">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0b6e34] text-white">{icon}</div>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-[#073b24]">{title}</h3>
        <p className="mt-1 text-xs text-slate-600">{text}</p>
      </div>
      <Link
        href={href}
        className="hidden flex-shrink-0 items-center gap-2 rounded-lg bg-[#0b6e34] px-4 py-2 text-xs font-bold text-white hover:bg-[#07582a] sm:inline-flex"
      >
        {button}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
