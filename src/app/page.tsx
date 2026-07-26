'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  EyeOff,
  FileCheck2,
  HeartHandshake,
  Lock,
  Menu,
  MessageCircle,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/lib/useLanguage';

const content = {
  en: {
    subtitle: 'Marriage Bureau Network',
    nav: {
      home: 'Home',
      how: 'How It Works',
      families: 'For Families',
      bureaus: 'For Bureaus',
      about: 'About Us',
      contact: 'Contact',
      login: 'Bureau Login',
      submit: 'Submit Profile',
    },
    hero: {
      eyebrow: 'Pakistan’s private marriage bureau network',
      titleStart: 'A dignified, family-first way to find the',
      titleAccent: 'right rishta.',
      text:
        'Submit one thoughtful profile, keep sensitive details within a review-first workflow, and receive support from a professional matchmaking network — without public browsing or casual swiping.',
      primary: 'Start Private Profile',
      secondary: 'See How It Works',
      note: 'For serious marriage enquiries only',
      points: ['Not a public profile directory', 'Human review before action', 'Family-led progress'],
      reviewCardTitle: 'Review-first workflow',
      reviewCardText: 'Your submission is checked before it moves forward.',
      privacyCardTitle: 'Privacy preference saved',
      privacyCardText: 'Choose visible, blurred or hidden photo handling.',
    },
    trustStrip: [
      { title: 'Private submission', text: 'Your profile is not posted to a public browsing feed.' },
      { title: 'Human review', text: 'Information is reviewed before assignment or follow-up.' },
      { title: 'Controlled sharing', text: 'Contact details stay within the platform workflow.' },
      { title: 'Professional network', text: 'Bureau applications are reviewed before network access.' },
    ],
    choice: {
      eyebrow: 'Two journeys. One trusted network.',
      title: 'Built for families and professional matchmakers',
      text:
        'MBN Pakistan connects the care of traditional family-led matchmaking with the structure and accountability of a modern digital platform.',
      familyTag: 'For individuals & families',
      familyTitle: 'Submit once. Stay involved throughout.',
      familyText:
        'Create a detailed profile through an enjoyable guided questionnaire. Your family remains part of the process from review to follow-up.',
      familyFeatures: [
        'Step-by-step private questionnaire',
        'Photo visibility preference',
        'Reference number after submission',
        'Review and professional follow-up',
      ],
      familyCta: 'Submit Your Profile',
      bureauTag: 'For marriage bureaus',
      bureauTitle: 'Work beyond spreadsheets and scattered WhatsApp chats.',
      bureauText:
        'Join a structured network where profiles, searches, assignments and follow-ups can be handled from one professional dashboard.',
      bureauFeatures: [
        'Organised profile management',
        'Advanced profile search',
        'Assignments and follow-up records',
        'A wider professional network',
      ],
      bureauCta: 'Apply as a Bureau',
      bureauLogin: 'Already a member? Login',
    },
    privacy: {
      eyebrow: 'Privacy should be visible, not just promised',
      title: 'Designed around the concerns Pakistani families actually have',
      text:
        'Sensitive photos, phone numbers and family information deserve more than a generic privacy statement. MBN uses a review-first journey so information does not immediately become part of a public marketplace.',
      cards: [
        {
          title: 'No public swiping',
          text: 'Public submissions do not appear in an open swipe-style directory.',
        },
        {
          title: 'Photo preference',
          text: 'Choose how you want your submitted photos to be handled during review.',
        },
        {
          title: 'Contact stays locked',
          text: 'Phone and WhatsApp details are handled through the platform workflow.',
        },
        {
          title: 'Human accountability',
          text: 'Assignment and follow-up activity can be recorded instead of getting lost in chats.',
        },
      ],
      mockTitle: 'Private profile status',
      mockId: 'Reference # MBN-••••••',
      mockStatus: 'Under review',
      mockPhoto: 'Photo preference',
      mockPhotoValue: 'Blurred',
      mockContact: 'Contact details',
      mockContactValue: 'Locked',
      mockAccess: 'Current access',
      mockAccessValue: 'Review team only',
      mockFooter: 'Nothing is published automatically.',
    },
    process: {
      eyebrow: 'A clearer matrimonial journey',
      title: 'From first form to respectful follow-up',
      text:
        'Competitor apps focus on volume and swipes. MBN is designed around deliberate profiles, family participation and a professional handover process.',
      steps: [
        {
          title: 'Tell us about the candidate',
          text: 'Complete a guided profile covering personal, family, career and partner preferences.',
        },
        {
          title: 'Profile enters review',
          text: 'The submission is checked for completeness before any next action.',
        },
        {
          title: 'Suitable professional support',
          text: 'Where appropriate, the case can be assigned to a relevant bureau or matchmaker.',
        },
        {
          title: 'Follow-up with dignity',
          text: 'The process continues through recorded, family-aware communication and progress.',
        },
      ],
      cta: 'Explore the Full Process',
    },
    standards: {
      eyebrow: 'The MBN standard',
      title: 'Serious intent over endless browsing',
      cards: [
        {
          title: 'Purpose-built for marriage',
          text: 'The experience is framed around serious matrimonial enquiries — not dating behaviour.',
        },
        {
          title: 'Family participation',
          text: 'Parents, siblings and guardians can submit while keeping the candidate at the centre.',
        },
        {
          title: 'Professional workflow',
          text: 'Profiles, assignments and follow-ups are organised within one network.',
        },
      ],
    },
    bureau: {
      eyebrow: 'A better operating system for marriage bureaus',
      title: 'Your experience, supported by a modern dashboard',
      text:
        'MBN does not replace the judgement of an experienced matchmaker. It gives that judgement a better system: structured profiles, search, assignments and follow-up records.',
      features: [
        'Add profiles through the same premium guided questionnaire',
        'Search relevant profiles with organised filters',
        'Track assigned cases and follow-up activity',
        'Collaborate within a professional network',
      ],
      apply: 'Apply to Join MBN',
      login: 'Open Bureau Login',
      dashboardLabel: 'MBN Bureau Workspace',
      dashboardStatus: 'Structured. Searchable. Accountable.',
    },
    faq: {
      eyebrow: 'Before you begin',
      title: 'Questions families usually ask',
      items: [
        {
          q: 'Will my submitted profile become public?',
          a: 'No. A public submission enters a review-first workflow. Submitting a profile does not automatically place it in a public browsing directory.',
        },
        {
          q: 'Can a parent or sibling submit on behalf of a candidate?',
          a: 'Yes. The guided form allows a parent, sibling, guardian or another authorised family member to provide the details.',
        },
        {
          q: 'How is a marriage bureau allowed into the network?',
          a: 'A bureau submits an application and business information for review before network access is considered.',
        },
        {
          q: 'How are phone numbers and WhatsApp details handled?',
          a: 'Contact information is collected for the matrimonial workflow and is not displayed as part of an open public directory.',
        },
      ],
    },
    final: {
      eyebrow: 'Begin with clarity and privacy',
      title: 'Your profile deserves more care than a swipe.',
      text:
        'Take the first step through a guided questionnaire created for serious Pakistani families.',
      primary: 'Submit Private Profile',
      secondary: 'Talk to Our Team',
    },
    footer: {
      text: 'A private, family-first matchmaking network for serious individuals, families and professional marriage bureaus.',
      explore: 'Explore',
      families: 'For Families',
      bureaus: 'For Bureaus',
      how: 'How It Works',
      company: 'Company',
      about: 'About Us',
      contact: 'Contact',
      login: 'Bureau Login',
      note: 'MBN Pakistan is a matrimonial platform and is not intended for casual dating.',
      rights: 'All rights reserved.',
    },
  },
  ur: {
    subtitle: 'میرج بیورو نیٹ ورک',
    nav: {
      home: 'ہوم',
      how: 'یہ کیسے کام کرتا ہے',
      families: 'خاندانوں کے لیے',
      bureaus: 'بیوروز کے لیے',
      about: 'ہمارے بارے میں',
      contact: 'رابطہ',
      login: 'بیورو لاگ اِن',
      submit: 'پروفائل جمع کروائیں',
    },
    hero: {
      eyebrow: 'پاکستان کا نجی میرج بیورو نیٹ ورک',
      titleStart: 'مناسب رشتہ تلاش کرنے کا باوقار، خاندانی اور',
      titleAccent: 'محفوظ طریقہ۔',
      text:
        'ایک مکمل پروفائل نجی طور پر جمع کروائیں، حساس معلومات کو جائزے پر مبنی ورک فلو میں رکھیں اور پیشہ ور میچ میکنگ نیٹ ورک کی مدد حاصل کریں — بغیر پبلک براؤزنگ اور غیر سنجیدہ سوائپنگ کے۔',
      primary: 'نجی پروفائل شروع کریں',
      secondary: 'طریقۂ کار دیکھیں',
      note: 'صرف سنجیدہ رشتے کی تلاش کے لیے',
      points: ['پبلک پروفائل ڈائریکٹری نہیں', 'کارروائی سے پہلے انسانی جائزہ', 'خاندان عمل میں شامل رہتا ہے'],
      reviewCardTitle: 'پہلے جائزہ، پھر کارروائی',
      reviewCardText: 'آگے بڑھانے سے پہلے آپ کی سبمیشن دیکھی جاتی ہے۔',
      privacyCardTitle: 'پرائیویسی ترجیح محفوظ',
      privacyCardText: 'تصویر visible، blurred یا hidden رکھنے کی ترجیح دیں۔',
    },
    trustStrip: [
      { title: 'نجی سبمیشن', text: 'آپ کی پروفائل پبلک براؤزنگ فیڈ پر پوسٹ نہیں ہوتی۔' },
      { title: 'انسانی جائزہ', text: 'اسائنمنٹ یا فالو اپ سے پہلے معلومات دیکھی جاتی ہیں۔' },
      { title: 'محدود شیئرنگ', text: 'رابطہ معلومات پلیٹ فارم ورک فلو کے اندر رہتی ہیں۔' },
      { title: 'پیشہ ور نیٹ ورک', text: 'نیٹ ورک رسائی سے پہلے بیورو درخواست کا جائزہ لیا جاتا ہے۔' },
    ],
    choice: {
      eyebrow: 'دو راستے، ایک قابلِ اعتماد نیٹ ورک',
      title: 'خاندانوں اور پیشہ ور میچ میکرز دونوں کے لیے',
      text:
        'MBN Pakistan روایتی خاندانی میچ میکنگ کی سنجیدگی کو جدید ڈیجیٹل نظام کی ترتیب اور جواب دہی کے ساتھ جوڑتا ہے۔',
      familyTag: 'افراد اور خاندانوں کے لیے',
      familyTitle: 'ایک بار جمع کروائیں، پورے عمل میں شامل رہیں۔',
      familyText:
        'خوبصورت guided questionnaire کے ذریعے مکمل پروفائل بنائیں۔ جائزے سے فالو اپ تک آپ اور آپ کا خاندان عمل کا حصہ رہتے ہیں۔',
      familyFeatures: [
        'مرحلہ وار نجی سوالنامہ',
        'تصویر کی visibility کی ترجیح',
        'سبمیشن کے بعد reference number',
        'جائزہ اور پیشہ ور فالو اپ',
      ],
      familyCta: 'اپنی پروفائل جمع کروائیں',
      bureauTag: 'میرج بیوروز کے لیے',
      bureauTitle: 'اسپریڈشیٹس اور بکھری WhatsApp چیٹس سے آگے بڑھیں۔',
      bureauText:
        'ایسے منظم نیٹ ورک میں شامل ہوں جہاں پروفائل، سرچ، اسائنمنٹ اور فالو اپ ایک پیشہ ور dashboard سے سنبھالے جا سکیں۔',
      bureauFeatures: [
        'منظم پروفائل مینجمنٹ',
        'بہتر پروفائل سرچ',
        'اسائنمنٹس اور فالو اپ ریکارڈ',
        'وسیع پیشہ ور نیٹ ورک',
      ],
      bureauCta: 'بیورو کے طور پر درخواست دیں',
      bureauLogin: 'پہلے سے ممبر ہیں؟ لاگ اِن کریں',
    },
    privacy: {
      eyebrow: 'پرائیویسی صرف دعویٰ نہیں، واضح تجربہ ہونی چاہیے',
      title: 'پاکستانی خاندانوں کے حقیقی خدشات کو سامنے رکھ کر بنایا گیا',
      text:
        'ذاتی تصاویر، فون نمبر اور خاندانی معلومات ایک عام privacy statement سے زیادہ حفاظت کی مستحق ہیں۔ MBN جائزے پر مبنی سفر استعمال کرتا ہے تاکہ معلومات فوراً کسی پبلک مارکیٹ پلیس کا حصہ نہ بنیں۔',
      cards: [
        {
          title: 'پبلک سوائپنگ نہیں',
          text: 'عوامی سبمیشن کسی کھلی swipe-style ڈائریکٹری میں ظاہر نہیں ہوتی۔',
        },
        {
          title: 'تصویر کی ترجیح',
          text: 'جائزے کے دوران تصویر visible، blurred یا hidden رکھنے کی ترجیح منتخب کریں۔',
        },
        {
          title: 'رابطہ معلومات locked',
          text: 'فون اور WhatsApp معلومات پلیٹ فارم کے ورک فلو کے مطابق سنبھالی جاتی ہیں۔',
        },
        {
          title: 'انسانی جواب دہی',
          text: 'اسائنمنٹ اور فالو اپ چیٹس میں گم ہونے کے بجائے ریکارڈ کیے جا سکتے ہیں۔',
        },
      ],
      mockTitle: 'نجی پروفائل اسٹیٹس',
      mockId: 'ریفرنس # MBN-••••••',
      mockStatus: 'زیرِ جائزہ',
      mockPhoto: 'تصویر کی ترجیح',
      mockPhotoValue: 'Blurred',
      mockContact: 'رابطہ معلومات',
      mockContactValue: 'Locked',
      mockAccess: 'موجودہ رسائی',
      mockAccessValue: 'صرف جائزہ ٹیم',
      mockFooter: 'کچھ بھی خودکار طور پر پبلش نہیں ہوتا۔',
    },
    process: {
      eyebrow: 'رشتے کی تلاش کا زیادہ واضح سفر',
      title: 'پہلے فارم سے باوقار فالو اپ تک',
      text:
        'بہت سی ایپس تعداد اور سوائپس پر زور دیتی ہیں۔ MBN سوچ سمجھ کر بنائی گئی پروفائل، خاندان کی شمولیت اور پیشہ ور handover process پر توجہ دیتا ہے۔',
      steps: [
        {
          title: 'امیدوار کے بارے میں بتائیں',
          text: 'ذاتی، خاندانی، تعلیمی، کیریئر اور شریکِ حیات کی ترجیحات کے ساتھ guided profile مکمل کریں۔',
        },
        {
          title: 'پروفائل جائزے میں جاتی ہے',
          text: 'اگلی کارروائی سے پہلے سبمیشن کی تکمیل اور معلومات دیکھی جاتی ہیں۔',
        },
        {
          title: 'مناسب پیشہ ور مدد',
          text: 'موزوں صورت میں کیس متعلقہ بیورو یا میچ میکر کو اسائن کیا جا سکتا ہے۔',
        },
        {
          title: 'باوقار فالو اپ',
          text: 'عمل خاندان کو شامل رکھتے ہوئے ریکارڈ شدہ رابطے اور پیش رفت کے ساتھ جاری رہتا ہے۔',
        },
      ],
      cta: 'مکمل طریقۂ کار دیکھیں',
    },
    standards: {
      eyebrow: 'MBN کا معیار',
      title: 'لامحدود براؤزنگ کے بجائے سنجیدہ نیت',
      cards: [
        {
          title: 'شادی کے مقصد کے لیے',
          text: 'یہ تجربہ غیر سنجیدہ dating behaviour کے بجائے سنجیدہ رشتے کی تلاش کے لیے بنایا گیا ہے۔',
        },
        {
          title: 'خاندان کی شمولیت',
          text: 'والدین، بہن بھائی اور سرپرست امیدوار کو مرکز میں رکھتے ہوئے پروفائل جمع کروا سکتے ہیں۔',
        },
        {
          title: 'پیشہ ور ورک فلو',
          text: 'پروفائل، اسائنمنٹ اور فالو اپ ایک منظم نیٹ ورک میں سنبھالے جاتے ہیں۔',
        },
      ],
    },
    bureau: {
      eyebrow: 'میرج بیوروز کے لیے بہتر operating system',
      title: 'آپ کے تجربے کے ساتھ ایک جدید dashboard',
      text:
        'MBN تجربہ کار میچ میکر کی سمجھ بوجھ کی جگہ نہیں لیتا۔ یہ اسے بہتر نظام دیتا ہے: منظم پروفائل، سرچ، اسائنمنٹس اور فالو اپ ریکارڈ۔',
      features: [
        'اسی premium guided questionnaire سے پروفائل شامل کریں',
        'منظم filters کے ذریعے متعلقہ پروفائل تلاش کریں',
        'اسائن کیے گئے کیسز اور فالو اپ سرگرمی ٹریک کریں',
        'پیشہ ور نیٹ ورک کے اندر تعاون کریں',
      ],
      apply: 'MBN میں شامل ہونے کی درخواست دیں',
      login: 'بیورو لاگ اِن کھولیں',
      dashboardLabel: 'MBN بیورو ورک اسپیس',
      dashboardStatus: 'منظم، قابلِ تلاش اور جواب دہ',
    },
    faq: {
      eyebrow: 'شروع کرنے سے پہلے',
      title: 'وہ سوالات جو خاندان عموماً پوچھتے ہیں',
      items: [
        {
          q: 'کیا میری جمع کروائی گئی پروفائل پبلک ہو جائے گی؟',
          a: 'نہیں۔ عوامی سبمیشن review-first workflow میں داخل ہوتی ہے۔ پروفائل جمع کروانے کا مطلب اسے کسی کھلی پبلک ڈائریکٹری میں ڈالنا نہیں۔',
        },
        {
          q: 'کیا والدین یا بہن بھائی امیدوار کی طرف سے پروفائل جمع کروا سکتے ہیں؟',
          a: 'جی ہاں۔ guided form والدین، بہن بھائی، سرپرست یا کسی مجاز خاندانی فرد کو معلومات دینے کی اجازت دیتا ہے۔',
        },
        {
          q: 'میرج بیورو کو نیٹ ورک میں کیسے شامل کیا جاتا ہے؟',
          a: 'نیٹ ورک رسائی پر غور سے پہلے بیورو اپنی درخواست اور کاروباری معلومات جائزے کے لیے جمع کرواتا ہے۔',
        },
        {
          q: 'فون نمبر اور WhatsApp معلومات کیسے سنبھالی جاتی ہیں؟',
          a: 'رابطہ معلومات matrimonial workflow کے لیے لی جاتی ہیں اور کسی کھلی پبلک ڈائریکٹری میں ظاہر نہیں کی جاتیں۔',
        },
      ],
    },
    final: {
      eyebrow: 'وضاحت اور پرائیویسی کے ساتھ آغاز کریں',
      title: 'آپ کی پروفائل ایک swipe سے زیادہ توجہ کی مستحق ہے۔',
      text: 'سنجیدہ پاکستانی خاندانوں کے لیے بنائے گئے guided questionnaire سے پہلا قدم اٹھائیں۔',
      primary: 'نجی پروفائل جمع کروائیں',
      secondary: 'ہماری ٹیم سے رابطہ کریں',
    },
    footer: {
      text: 'سنجیدہ افراد، خاندانوں اور پیشہ ور میرج بیوروز کے لیے نجی اور family-first matchmaking network۔',
      explore: 'مزید دیکھیں',
      families: 'خاندانوں کے لیے',
      bureaus: 'بیوروز کے لیے',
      how: 'یہ کیسے کام کرتا ہے',
      company: 'ادارہ',
      about: 'ہمارے بارے میں',
      contact: 'رابطہ',
      login: 'بیورو لاگ اِن',
      note: 'MBN Pakistan ایک matrimonial platform ہے اور casual dating کے لیے نہیں ہے۔',
      rights: 'تمام حقوق محفوظ ہیں۔',
    },
  },
} as const;

const trustIcons = [Lock, ClipboardCheck, EyeOff, BadgeCheck];
const privacyIcons = [EyeOff, ShieldCheck, Lock, FileCheck2];
const processIcons = [ClipboardCheck, UserCheck, Network, MessageCircle];
const standardIcons = [HeartHandshake, Users, Building2];

export default function HomePage() {
  const { language, setLanguage, isUrdu } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const t = content[language];

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -48px' },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [language]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const arrowClass = isUrdu ? 'rotate-180' : '';

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen overflow-x-hidden bg-[#fbfcf8] text-slate-950">
      <style jsx global>{`
        .mbn-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 760ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mbn-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .mbn-reveal-delay-1 { transition-delay: 90ms; }
        .mbn-reveal-delay-2 { transition-delay: 180ms; }
        .mbn-reveal-delay-3 { transition-delay: 270ms; }
        .mbn-hero-rise {
          animation: mbnHeroRise 820ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .mbn-hero-rise-2 {
          animation: mbnHeroRise 820ms 120ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .mbn-hero-rise-3 {
          animation: mbnHeroRise 820ms 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .mbn-float-a { animation: mbnFloatA 5.6s ease-in-out infinite; }
        .mbn-float-b { animation: mbnFloatB 6.4s ease-in-out infinite; }
        .mbn-shimmer {
          position: relative;
          overflow: hidden;
        }
        .mbn-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(100deg, transparent 35%, rgba(255,255,255,.35) 50%, transparent 65%);
          animation: mbnShimmer 5.5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes mbnHeroRise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mbnFloatA {
          0%, 100% { transform: translate3d(0,0,0) rotate(-1deg); }
          50% { transform: translate3d(0,-10px,0) rotate(1deg); }
        }
        @keyframes mbnFloatB {
          0%, 100% { transform: translate3d(0,0,0) rotate(1deg); }
          50% { transform: translate3d(0,9px,0) rotate(-1deg); }
        }
        @keyframes mbnShimmer {
          0%, 55% { transform: translateX(-120%); }
          82%, 100% { transform: translateX(120%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mbn-reveal, .mbn-hero-rise, .mbn-hero-rise-2, .mbn-hero-rise-3,
          .mbn-float-a, .mbn-float-b, .mbn-shimmer::after {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-[#fbfcf8]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="MBN Pakistan home">
            <span className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(5,61,37,0.10)] ring-1 ring-emerald-950/5 transition-transform duration-300 group-hover:-translate-y-0.5">
              <Image src="/mbn-logo.png" alt="MBN Pakistan" width={44} height={44} className="h-full w-full object-contain p-1" priority />
            </span>
            <span className="hidden leading-none min-[390px]:block">
              <span className="block font-heading text-lg font-bold tracking-[0.13em] text-[#073b24]">MBN</span>
              <span className="mt-1 block text-[10px] font-extrabold tracking-[0.22em] text-[#0d6f43]">PAKISTAN</span>
              <span className="mt-1 hidden text-[9px] font-medium tracking-wide text-slate-500 sm:block">{t.subtitle}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] font-bold text-slate-700 xl:flex">
            <Link href="/" className="text-[#0a6a3f]">{t.nav.home}</Link>
            <Link href="/how-it-works" className="transition hover:text-[#0a6a3f]">{t.nav.how}</Link>
            <Link href="/for-families" className="transition hover:text-[#0a6a3f]">{t.nav.families}</Link>
            <Link href="/for-bureaus" className="transition hover:text-[#0a6a3f]">{t.nav.bureaus}</Link>
            <Link href="/about" className="transition hover:text-[#0a6a3f]">{t.nav.about}</Link>
            <Link href="/contact" className="transition hover:text-[#0a6a3f]">{t.nav.contact}</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageToggle language={language} setLanguage={setLanguage} />
            </div>
            <Link
              href="/login"
              className="hidden rounded-full border border-emerald-900/15 bg-white px-4 py-2.5 text-xs font-extrabold text-[#073b24] shadow-sm transition hover:border-emerald-700/30 hover:bg-emerald-50 lg:inline-flex"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/submit-profile"
              className="mbn-shimmer inline-flex items-center gap-2 rounded-full bg-[#0a6a3f] px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_12px_30px_rgba(10,106,63,0.22)] transition hover:-translate-y-0.5 hover:bg-[#075632] sm:px-5 sm:text-[13px]"
            >
              <span className="hidden min-[430px]:inline">{t.nav.submit}</span>
              <span className="min-[430px]:hidden">{isUrdu ? 'پروفائل' : 'Submit'}</span>
              <ArrowRight className={`h-3.5 w-3.5 ${arrowClass}`} />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-950/10 bg-white text-[#073b24] shadow-sm xl:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[70] xl:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-[#062f20]/45 backdrop-blur-sm"
          />
          <div className={`absolute inset-y-0 w-[88%] max-w-sm bg-[#fbfcf8] p-6 shadow-2xl ${isUrdu ? 'left-0' : 'right-0'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/mbn-logo.png" alt="MBN Pakistan" width={44} height={44} className="h-11 w-11 rounded-xl bg-white object-contain p-1 shadow-sm" />
                <div>
                  <p className="font-heading font-bold text-[#073b24]">MBN Pakistan</p>
                  <p className="text-[10px] text-slate-500">{t.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-900/5"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <LanguageToggle language={language} setLanguage={setLanguage} />
            </div>

            <nav className="mt-8 grid gap-2 text-base font-bold text-slate-800">
              {[
                ['/', t.nav.home],
                ['/how-it-works', t.nav.how],
                ['/for-families', t.nav.families],
                ['/for-bureaus', t.nav.bureaus],
                ['/about', t.nav.about],
                ['/contact', t.nav.contact],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 transition hover:bg-emerald-50 hover:text-[#0a6a3f]"
                >
                  <span>{label}</span>
                  <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
                </Link>
              ))}
            </nav>

            <div className="mt-8 grid gap-3 border-t border-slate-200 pt-6">
              <Link href="/submit-profile" className="flex items-center justify-center gap-2 rounded-2xl bg-[#0a6a3f] px-5 py-3.5 text-sm font-extrabold text-white">
                {t.nav.submit}
                <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
              </Link>
              <Link href="/login" className="flex items-center justify-center rounded-2xl border border-emerald-900/15 bg-white px-5 py-3.5 text-sm font-extrabold text-[#073b24]">
                {t.nav.login}
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="pt-[76px]">
        <section className="relative overflow-hidden border-b border-emerald-950/[0.06]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#dff2e6] blur-3xl" />
            <div className="absolute right-[-8rem] top-[-6rem] h-[34rem] w-[34rem] rounded-full bg-[#f4e3c8]/70 blur-3xl" />
            <div className="absolute bottom-[-12rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-[#e9f3d9] blur-3xl" />
          </div>

          <div className="relative mx-auto grid min-h-[760px] max-w-[1440px] items-center gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-24">
            <div className="relative z-10 max-w-2xl">
              <div className="mbn-hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0a6a3f] shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {t.hero.eyebrow}
              </div>

              <h1 className="mbn-hero-rise-2 mt-7 font-heading text-[2.75rem] font-bold leading-[0.98] tracking-[-0.035em] text-[#073b24] sm:text-6xl lg:text-[4.7rem]">
                {t.hero.titleStart}{' '}
                <span className="relative inline-block text-[#0b7a48]">
                  {t.hero.titleAccent}
                  <span className="absolute -bottom-2 left-0 h-2 w-full rounded-full bg-[#d7b66b]/35" />
                </span>
              </h1>

              <p className="mbn-hero-rise-3 mt-7 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {t.hero.text}
              </p>

              <div className="mbn-hero-rise-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/submit-profile"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#0a6a3f] px-7 py-4 text-sm font-extrabold text-white shadow-[0_18px_44px_rgba(10,106,63,0.24)] transition duration-300 hover:-translate-y-1 hover:bg-[#075632]"
                >
                  {t.hero.primary}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${arrowClass}`} />
                </Link>
                <Link
                  href="/how-it-works"
                  className="group inline-flex items-center justify-center gap-3 rounded-full border border-emerald-950/10 bg-white/80 px-7 py-4 text-sm font-extrabold text-[#073b24] shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-800/20 hover:bg-white"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-[#0a6a3f]">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  {t.hero.secondary}
                </Link>
              </div>

              <div className="mbn-hero-rise-3 mt-8 flex flex-wrap gap-x-5 gap-y-3">
                {t.hero.points.map((point) => (
                  <div key={point} className="flex items-center gap-2 text-xs font-bold text-slate-600 sm:text-[13px]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e3f3e8] text-[#0a6a3f]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {point}
                  </div>
                ))}
              </div>

              <div className="mbn-hero-rise-3 mt-8 flex items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="h-px w-10 bg-emerald-900/20" />
                <HeartHandshake className="h-4 w-4 text-[#b28a36]" />
                {t.hero.note}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[760px] lg:mx-0">
              <div className="absolute -inset-8 rounded-[3.5rem] bg-gradient-to-br from-[#f5e8d6]/80 via-[#e1f1e5]/60 to-white blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white p-2 shadow-[0_35px_90px_rgba(4,55,34,0.16)] sm:rounded-[3rem] sm:p-3">
                <div className="relative min-h-[500px] overflow-hidden rounded-[1.8rem] bg-[#f3eadf] sm:min-h-[620px] sm:rounded-[2.4rem]">
                  <Image
                    src="/mbn-family-hero.png"
                    alt="A family-first matrimonial journey"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover object-[61%_center] sm:object-[58%_center]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#052e20]/40 via-transparent to-white/10" />
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#f4eadf]/65 to-transparent" />

                  <div className={`mbn-float-a absolute top-7 max-w-[260px] rounded-3xl border border-white/80 bg-white/92 p-4 shadow-[0_20px_50px_rgba(5,48,31,0.18)] backdrop-blur-md sm:top-10 sm:p-5 ${isUrdu ? 'right-5 sm:right-8' : 'left-5 sm:left-8'}`}>
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#e4f4e9] text-[#0a6a3f]">
                        <ClipboardCheck className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-[#073b24] sm:text-sm">{t.hero.reviewCardTitle}</p>
                        <p className="mt-1 text-[10px] leading-4 text-slate-600 sm:text-[11px]">{t.hero.reviewCardText}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`mbn-float-b absolute bottom-7 max-w-[275px] rounded-3xl border border-white/80 bg-[#073b24]/92 p-4 text-white shadow-[0_22px_55px_rgba(5,48,31,0.28)] backdrop-blur-md sm:bottom-10 sm:p-5 ${isUrdu ? 'left-5 sm:left-8' : 'right-5 sm:right-8'}`}>
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#bde6c9]">
                        <EyeOff className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold sm:text-sm">{t.hero.privacyCardTitle}</p>
                        <p className="mt-1 text-[10px] leading-4 text-white/70 sm:text-[11px]">{t.hero.privacyCardText}</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0a6a3f] via-[#d0ac5b] to-[#0a6a3f]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-6 max-w-[1320px] px-4 sm:px-6 lg:px-10">
          <div className="grid overflow-hidden rounded-[2rem] border border-emerald-950/[0.07] bg-white shadow-[0_20px_60px_rgba(4,56,34,0.10)] sm:grid-cols-2 lg:grid-cols-4">
            {t.trustStrip.map((item, index) => {
              const Icon = trustIcons[index];
              return (
                <div key={item.title} className="group relative flex gap-4 border-b border-emerald-950/[0.06] p-5 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#edf7f0] text-[#0a6a3f] transition duration-300 group-hover:-translate-y-1 group-hover:bg-[#0a6a3f] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-extrabold text-[#073b24]">{item.title}</h2>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <SectionHeading eyebrow={t.choice.eyebrow} title={t.choice.title} text={t.choice.text} />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <JourneyChoiceCard
              revealClass=""
              tag={t.choice.familyTag}
              title={t.choice.familyTitle}
              text={t.choice.familyText}
              features={t.choice.familyFeatures}
              cta={t.choice.familyCta}
              href="/submit-profile"
              icon={<Users className="h-6 w-6" />}
              theme="warm"
              isUrdu={isUrdu}
            />
            <JourneyChoiceCard
              revealClass="mbn-reveal-delay-1"
              tag={t.choice.bureauTag}
              title={t.choice.bureauTitle}
              text={t.choice.bureauText}
              features={t.choice.bureauFeatures}
              cta={t.choice.bureauCta}
              secondary={t.choice.bureauLogin}
              href="/register"
              secondaryHref="/login"
              icon={<Building2 className="h-6 w-6" />}
              theme="dark"
              isUrdu={isUrdu}
            />
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#073b24] py-24 text-white lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-28 -top-28 h-[28rem] w-[28rem] rounded-full border border-white/10" />
            <div className="absolute -right-10 -top-10 h-[18rem] w-[18rem] rounded-full border border-white/10" />
            <div className="absolute -bottom-56 -left-20 h-[36rem] w-[36rem] rounded-full bg-[#0d7548]/30 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
            <div data-reveal className="mbn-reveal">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#bde5c8]">
                <ShieldCheck className="h-4 w-4" />
                {t.privacy.eyebrow}
              </div>
              <h2 className="mt-6 max-w-2xl font-heading text-4xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
                {t.privacy.title}
              </h2>
              <p className="mt-6 max-w-2xl text-[15px] leading-8 text-white/70 sm:text-base">
                {t.privacy.text}
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {t.privacy.cards.map((card, index) => {
                  const Icon = privacyIcons[index];
                  return (
                    <div key={card.title} className="group rounded-3xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.09]">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b9dfc5]/10 text-[#bde5c8]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-sm font-extrabold">{card.title}</h3>
                      <p className="mt-2 text-xs leading-6 text-white/60">{card.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div data-reveal className="mbn-reveal mbn-reveal-delay-1 relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-8 rounded-[3rem] bg-[#11915a]/20 blur-3xl" />
              <div className="relative rounded-[2.25rem] border border-white/15 bg-white p-3 text-slate-900 shadow-[0_35px_100px_rgba(0,0,0,0.3)]">
                <div className="overflow-hidden rounded-[1.75rem] bg-[#f7faf7]">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0a6a3f]">MBN Pakistan</p>
                      <h3 className="mt-1 font-heading text-xl font-bold text-[#073b24]">{t.privacy.mockTitle}</h3>
                    </div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e5f4ea] text-[#0a6a3f]">
                      <Lock className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className="rounded-3xl bg-gradient-to-br from-[#e7efe8] to-[#f3e8d8] p-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-[#cbdccf]">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#b9d5c2] to-[#dfcfb5] blur-sm" />
                          <Users className="absolute inset-0 m-auto h-7 w-7 text-white/80" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-extrabold text-[#073b24]">{t.privacy.mockId}</p>
                          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#936f22] shadow-sm">
                            <Clock3 className="h-3.5 w-3.5" />
                            {t.privacy.mockStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <StatusRow icon={<EyeOff className="h-4 w-4" />} label={t.privacy.mockPhoto} value={t.privacy.mockPhotoValue} />
                      <StatusRow icon={<Lock className="h-4 w-4" />} label={t.privacy.mockContact} value={t.privacy.mockContactValue} />
                      <StatusRow icon={<UserCheck className="h-4 w-4" />} label={t.privacy.mockAccess} value={t.privacy.mockAccessValue} />
                    </div>

                    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-[#edf7f0] px-4 py-3 text-xs font-bold text-[#0a6a3f]">
                      <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                      {t.privacy.mockFooter}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} text={t.process.text} />

          <div className="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-[12.5%] right-[12.5%] top-12 hidden h-px bg-gradient-to-r from-transparent via-emerald-700/20 to-transparent lg:block" />
            {t.process.steps.map((step, index) => {
              const Icon = processIcons[index];
              return (
                <div key={step.title} data-reveal className={`mbn-reveal ${index > 0 ? `mbn-reveal-delay-${Math.min(index, 3)}` : ''} relative rounded-[2rem] border border-emerald-950/[0.07] bg-white p-6 shadow-[0_15px_45px_rgba(5,61,37,0.06)]`}>
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f5ec] text-[#0a6a3f]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-heading text-4xl font-bold text-emerald-950/[0.09]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-7 text-base font-extrabold text-[#073b24]">{step.title}</h3>
                  <p className="mt-3 text-xs leading-6 text-slate-600">{step.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link href="/how-it-works" className="group inline-flex items-center gap-3 text-sm font-extrabold text-[#0a6a3f]">
              {t.process.cta}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f5ec] transition group-hover:bg-[#0a6a3f] group-hover:text-white">
                <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
              </span>
            </Link>
          </div>
        </section>

        <section className="bg-[#eef6f0] py-24 lg:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <SectionHeading eyebrow={t.standards.eyebrow} title={t.standards.title} compact />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {t.standards.cards.map((card, index) => {
                const Icon = standardIcons[index];
                return (
                  <div key={card.title} data-reveal className={`mbn-reveal ${index ? `mbn-reveal-delay-${index}` : ''} group rounded-[2rem] border border-white bg-white/85 p-7 shadow-[0_18px_50px_rgba(5,61,37,0.06)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_65px_rgba(5,61,37,0.10)]`}>
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#073b24] text-white shadow-[0_12px_24px_rgba(5,61,37,0.16)]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-6 font-heading text-2xl font-bold text-[#073b24]">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="grid items-center gap-12 overflow-hidden rounded-[2.5rem] bg-[#073b24] p-5 text-white shadow-[0_30px_90px_rgba(5,61,37,0.18)] sm:p-8 lg:grid-cols-[0.88fr_1.12fr] lg:p-10">
            <div data-reveal className="mbn-reveal px-2 py-6 sm:px-4 lg:px-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#c5e8cf]">
                <Building2 className="h-4 w-4" />
                {t.bureau.eyebrow}
              </div>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] sm:text-5xl">{t.bureau.title}</h2>
              <p className="mt-5 text-sm leading-7 text-white/68 sm:text-base sm:leading-8">{t.bureau.text}</p>

              <div className="mt-7 space-y-3">
                {t.bureau.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm font-semibold text-white/85">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#bce5c8] text-[#073b24]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="leading-6">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-[#073b24] transition hover:-translate-y-0.5 hover:bg-[#eaf5ed]">
                  {t.bureau.apply}
                  <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/[0.12]">
                  {t.bureau.login}
                </Link>
              </div>
            </div>

            <div data-reveal className="mbn-reveal mbn-reveal-delay-1 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a4c32] p-2 sm:p-3">
              <div className="absolute left-8 right-8 top-0 h-32 rounded-full bg-[#2ebd78]/25 blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.5rem] bg-black/20">
                <div className="flex items-center justify-between border-b border-white/10 bg-[#062f20]/90 px-4 py-3 backdrop-blur sm:px-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff7a73]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f7cc61]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#67d391]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-white/75">{t.bureau.dashboardLabel}</p>
                  </div>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                    <Search className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="relative aspect-[1.22/1] min-h-[360px] sm:aspect-[1.35/1]">
                  <Image src="/mbn-bureau-dashboard.png" alt="MBN Pakistan bureau dashboard" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover object-[73%_center]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#052f20]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/15 bg-[#052f20]/80 px-4 py-3 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#bce5c8] text-[#073b24]">
                        <Network className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold">MBN Pakistan</p>
                        <p className="mt-0.5 text-[10px] text-white/65">{t.bureau.dashboardStatus}</p>
                      </div>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#61df91] shadow-[0_0_0_5px_rgba(97,223,145,0.12)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-950/[0.06] bg-white py-24 lg:py-28">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
            <div data-reveal className="mbn-reveal lg:sticky lg:top-28 lg:self-start">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#edf7f0] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f]">
                <MessageCircle className="h-4 w-4" />
                {t.faq.eyebrow}
              </div>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] text-[#073b24] sm:text-5xl">{t.faq.title}</h2>
              <div className="mt-7 flex items-center gap-3 text-xs font-bold text-slate-500">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#073b24] text-white">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                MBN Pakistan
              </div>
            </div>

            <div className="space-y-3">
              {t.faq.items.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.q} data-reveal className={`mbn-reveal ${index ? 'mbn-reveal-delay-1' : ''} overflow-hidden rounded-3xl border transition ${isOpen ? 'border-emerald-800/20 bg-[#f7fbf8]' : 'border-slate-200 bg-white hover:border-emerald-800/15'}`}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-start sm:px-7 sm:py-6"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-extrabold text-[#073b24] sm:text-base">{item.q}</span>
                      <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition ${isOpen ? 'rotate-180 bg-[#0a6a3f] text-white' : 'bg-[#edf7f0] text-[#0a6a3f]'}`}>
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="px-5 pb-6 text-sm leading-7 text-slate-600 sm:px-7">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div data-reveal className="mbn-reveal relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#f2e5d1] via-[#f7f4e9] to-[#dfeee2] px-6 py-14 text-center sm:px-10 sm:py-16 lg:px-20 lg:py-20">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border border-[#b58f41]/15" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-white/45 blur-2xl" />
            <div className="relative mx-auto max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f] shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                {t.final.eyebrow}
              </div>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-[#073b24] sm:text-5xl lg:text-6xl">{t.final.title}</h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{t.final.text}</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/submit-profile" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#0a6a3f] px-7 py-4 text-sm font-extrabold text-white shadow-[0_16px_38px_rgba(10,106,63,0.22)] transition hover:-translate-y-1 hover:bg-[#075632]">
                  {t.final.primary}
                  <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-3 rounded-full border border-emerald-900/10 bg-white/85 px-7 py-4 text-sm font-extrabold text-[#073b24] shadow-sm transition hover:-translate-y-1 hover:bg-white">
                  <MessageCircle className="h-4 w-4 text-[#0a6a3f]" />
                  {t.final.secondary}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#052f20] text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-14">
          <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.5fr_0.7fr_0.7fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1 shadow-lg">
                  <Image src="/mbn-logo.png" alt="MBN Pakistan" width={48} height={48} className="h-full w-full object-contain" />
                </span>
                <div>
                  <p className="font-heading text-xl font-bold">MBN Pakistan</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a9d6b6]">{t.subtitle}</p>
                </div>
              </div>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/58">{t.footer.text}</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold text-white/65">
                <HeartHandshake className="h-4 w-4 text-[#bce5c8]" />
                {t.footer.note}
              </div>
            </div>

            <FooterLinks
              title={t.footer.explore}
              links={[
                [t.footer.families, '/for-families'],
                [t.footer.bureaus, '/for-bureaus'],
                [t.footer.how, '/how-it-works'],
              ]}
            />
            <FooterLinks
              title={t.footer.company}
              links={[
                [t.footer.about, '/about'],
                [t.footer.contact, '/contact'],
                [t.footer.login, '/login'],
              ]}
            />
          </div>

          <div className="flex flex-col gap-4 pt-6 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} MBN Pakistan. {t.footer.rights}</p>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#9fd1ad]" />
              <span>Private • Family-first • Professional</span>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden">
        <Link href="/submit-profile" className="mbn-shimmer flex items-center justify-center gap-2 rounded-full bg-[#0a6a3f] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_40px_rgba(4,47,32,0.35)]">
          {t.nav.submit}
          <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
        </Link>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  compact?: boolean;
}) {
  return (
    <div data-reveal className={`mbn-reveal mx-auto text-center ${compact ? 'max-w-3xl' : 'max-w-4xl'}`}>
      <div className="inline-flex items-center gap-2 rounded-full bg-[#edf7f0] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f]">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[#073b24] sm:text-5xl lg:text-[3.5rem]">{title}</h2>
      {text && <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{text}</p>}
    </div>
  );
}

function JourneyChoiceCard({
  tag,
  title,
  text,
  features,
  cta,
  href,
  icon,
  theme,
  secondary,
  secondaryHref,
  revealClass,
  isUrdu,
}: {
  tag: string;
  title: string;
  text: string;
  features: readonly string[];
  cta: string;
  href: string;
  icon: ReactNode;
  theme: 'warm' | 'dark';
  secondary?: string;
  secondaryHref?: string;
  revealClass?: string;
  isUrdu: boolean;
}) {
  const isDark = theme === 'dark';
  return (
    <div
      data-reveal
      className={`mbn-reveal ${revealClass ?? ''} group relative overflow-hidden rounded-[2.5rem] border p-7 transition duration-500 hover:-translate-y-1.5 sm:p-9 lg:p-10 ${
        isDark
          ? 'border-emerald-950 bg-[#073b24] text-white shadow-[0_25px_70px_rgba(5,61,37,0.18)]'
          : 'border-[#eadbc4] bg-gradient-to-br from-[#fbf3e7] to-[#fffdf9] text-slate-950 shadow-[0_25px_70px_rgba(94,69,34,0.10)]'
      }`}
    >
      <div className={`pointer-events-none absolute -top-28 h-64 w-64 rounded-full blur-3xl ${isUrdu ? '-left-24' : '-right-24'} ${isDark ? 'bg-[#148551]/28' : 'bg-[#e6c98f]/35'}`} />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] ${isDark ? 'bg-white/[0.07] text-[#bce5c8]' : 'bg-white text-[#0a6a3f] shadow-sm'}`}>
            {icon}
            {tag}
          </span>
          <span className={`font-heading text-5xl font-bold ${isDark ? 'text-white/[0.08]' : 'text-[#073b24]/[0.06]'}`}>MBN</span>
        </div>

        <h3 className={`mt-8 max-w-xl font-heading text-3xl font-bold leading-[1.12] sm:text-4xl ${isDark ? 'text-white' : 'text-[#073b24]'}`}>{title}</h3>
        <p className={`mt-5 max-w-xl text-sm leading-7 ${isDark ? 'text-white/65' : 'text-slate-600'}`}>{text}</p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-xs font-bold ${isDark ? 'bg-white/[0.055] text-white/82' : 'bg-white/80 text-slate-700 shadow-sm'}`}>
              <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${isDark ? 'bg-[#bce5c8] text-[#073b24]' : 'bg-[#e3f3e8] text-[#0a6a3f]'}`}>
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="leading-5">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={href} className={`group/button inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-extrabold transition hover:-translate-y-0.5 ${isDark ? 'bg-white text-[#073b24] hover:bg-[#eaf5ed]' : 'bg-[#0a6a3f] text-white shadow-[0_14px_32px_rgba(10,106,63,0.18)] hover:bg-[#075632]'}`}>
            {cta}
            <ArrowRight className={`h-4 w-4 transition-transform group-hover/button:translate-x-1 ${isUrdu ? 'rotate-180' : ''}`} />
          </Link>
          {secondary && secondaryHref && (
            <Link href={secondaryHref} className={`text-center text-xs font-extrabold underline-offset-4 hover:underline ${isDark ? 'text-white/72' : 'text-[#0a6a3f]'}`}>
              {secondary}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5">
      <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#edf7f0] text-[#0a6a3f]">{icon}</span>
        {label}
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-[#073b24]">{value}</span>
    </div>
  );
}

function FooterLinks({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return (
    <div>
      <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#a9d6b6]">{title}</h3>
      <div className="mt-5 grid gap-3 text-sm font-semibold text-white/68">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="w-fit transition hover:text-white">{label}</Link>
        ))}
      </div>
    </div>
  );
}
