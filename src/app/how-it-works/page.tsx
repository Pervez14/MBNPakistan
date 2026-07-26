'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
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
  FileText,
  HeartHandshake,
  HelpCircle,
  History,
  Lock,
  Menu,
  MessageCircle,
  Network,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage, type Language } from '@/lib/useLanguage';

type JourneyKey = 'families' | 'bureaus';

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
      eyebrow: 'A clearer matrimonial journey',
      titleStart: 'From one thoughtful profile to a',
      titleAccent: 'respectful matchmaking process.',
      text:
        'MBN Pakistan combines private profile submission, human review and a professional marriage bureau network — so families and matchmakers can move forward with greater structure, privacy and accountability.',
      primary: 'Start Your Profile',
      secondary: 'Explore the Process',
      note: 'For serious matrimonial enquiries only',
      previewTitle: 'Your profile journey',
      previewStatus: 'Review-first workflow',
      stages: ['Guided submission', 'Human review', 'Professional follow-up'],
      locked: 'Sensitive details stay controlled',
    },
    trust: [
      { title: 'Not publicly listed', text: 'A public submission does not automatically enter an open browsing feed.' },
      { title: 'Reviewed before action', text: 'The information is checked for completeness before the next step.' },
      { title: 'Two guided journeys', text: 'Separate workflows support families and professional marriage bureaus.' },
      { title: 'Activity can be recorded', text: 'Assignments, contact views and follow-ups can be handled within the platform.' },
    ],
    selector: {
      eyebrow: 'Choose your journey',
      title: 'How would you like to use MBN Pakistan?',
      text:
        'The platform serves two different users. Select a path to see exactly what happens at each stage.',
      familyLabel: 'I am an individual or family',
      familyNote: 'Submit a private matrimonial profile',
      bureauLabel: 'I run a marriage bureau',
      bureauNote: 'Apply for a professional workspace',
    },
    families: {
      tag: 'For individuals & families',
      title: 'A guided path from profile submission to follow-up',
      text:
        'Instead of placing a profile into a public swipe-style marketplace, MBN begins with a detailed questionnaire and a review-first process.',
      overview: {
        eyebrow: 'Your journey at a glance',
        title: 'Six clear stages, with the family involved throughout',
        text: 'The process starts with accurate information—not a random match counter. Each stage has a clear purpose, from submission and review to professional follow-up.',
        facts: [
          { label: 'Starting point', value: 'Guided questionnaire' },
          { label: 'First decision', value: 'Human profile review' },
          { label: 'Ongoing role', value: 'Family-led follow-up' },
        ],
      },
      steps: [
        {
          title: 'Complete the guided questionnaire',
          text: 'Add candidate details, education, career, family background, lifestyle preferences and partner requirements through a step-by-step form.',
          note: 'Your progress is divided into focused sections, so the form feels manageable on mobile and desktop.',
        },
        {
          title: 'Choose how photos should be handled',
          text: 'Upload up to the allowed number of photos and select a visibility preference such as visible, blurred or hidden.',
          note: 'The selected preference is saved with the submission for the review workflow.',
        },
        {
          title: 'Receive a private reference number',
          text: 'After a successful submission, the system creates a reference that can be used when discussing the profile with the MBN team.',
          note: 'Keep the reference number private and available for future communication.',
        },
        {
          title: 'The profile enters human review',
          text: 'The submission is checked for completeness, clarity and suitability. The team may contact the submitter if important information is missing.',
          note: 'Submitting a form does not mean the profile is automatically published or guaranteed a match.',
        },
        {
          title: 'Suitable professional support may be assigned',
          text: 'Where appropriate, a reviewed case can be assigned to a relevant marriage bureau or matchmaker within the MBN workflow.',
          note: 'Assignment depends on the profile, location, requirements and available professional support.',
        },
        {
          title: 'Follow-up continues with the family involved',
          text: 'The assigned team can review suitable possibilities, record progress and communicate with the family as the case moves forward.',
          note: 'Families should independently verify all important personal, legal, educational and financial information before making a final decision.',
        },
      ],
      outcomeTitle: 'What you receive after submission',
      outcomes: [
        'A confirmation that the profile was submitted',
        'A private submission reference number',
        'A review-first status instead of fake instant matches',
        'Follow-up when information or action is required',
      ],
      cta: 'Submit a Private Profile',
    },
    bureaus: {
      tag: 'For professional marriage bureaus',
      title: 'A structured workspace for profiles, search and follow-up',
      text:
        'MBN helps experienced matchmakers move beyond scattered spreadsheets and WhatsApp threads by organising key workflows in one dashboard.',
      overview: {
        eyebrow: 'Professional workflow at a glance',
        title: 'From bureau application to organised case management',
        text: 'Access begins with review and approval. Once approved, the bureau can create structured profiles, search available information and record responsible follow-up activity.',
        facts: [
          { label: 'Starting point', value: 'Bureau application' },
          { label: 'Access rule', value: 'Approval required' },
          { label: 'Workspace', value: 'Profiles, search & follow-up' },
        ],
      },
      steps: [
        {
          title: 'Submit a bureau application',
          text: 'Provide bureau identity, location, contact information, experience, profile volume and relevant business details for review.',
          note: 'Submitting an application does not automatically provide network access.',
        },
        {
          title: 'MBN reviews the application',
          text: 'The application is assessed before approval. Additional information or verification material may be requested where required.',
          note: 'Only approved accounts should receive access to the professional workspace.',
        },
        {
          title: 'Create structured matrimonial profiles',
          text: 'Approved bureau users can add bride or groom profiles through the same polished, section-by-section questionnaire.',
          note: 'Structured fields make profiles easier to review, search and manage than unformatted messages.',
        },
        {
          title: 'Search the professional network',
          text: 'Use available filters such as gender, age, city, education and profession to identify potentially relevant profiles.',
          note: 'Search results support professional judgement; they do not replace careful verification or family consent.',
        },
        {
          title: 'Manage contact access responsibly',
          text: 'Contact information remains separated from the public profile view, and contact-view activity can be recorded for accountability.',
          note: 'Bureaus remain responsible for lawful, respectful and purpose-limited use of personal information.',
        },
        {
          title: 'Track assignments and follow-ups',
          text: 'Assigned profiles, notes and follow-up activity can be organised inside the dashboard instead of being lost across separate files and chats.',
          note: 'The platform supports the matchmaker’s process; final suitability decisions remain with the candidates and families.',
        },
      ],
      outcomeTitle: 'What an approved bureau can manage',
      outcomes: [
        'Structured bride and groom profiles',
        'Searchable matrimonial information',
        'Assigned cases and follow-up notes',
        'Contact-view accountability records',
      ],
      cta: 'Apply as a Marriage Bureau',
    },
    privacy: {
      eyebrow: 'Privacy in practical terms',
      title: 'What happens to sensitive information?',
      text:
        'A trustworthy matrimonial process should explain information handling clearly. MBN separates public-facing profile information, photos and contact details within its workflow.',
      cards: [
        {
          title: 'Profile submission',
          text: 'The form collects the information needed for review and matrimonial assessment. It is not automatically placed in a public feed.',
        },
        {
          title: 'Photo preference',
          text: 'The submitter can record whether photos should be visible, blurred or hidden during the profile workflow.',
        },
        {
          title: 'Contact information',
          text: 'Phone and WhatsApp details are kept separate from open profile browsing and are handled through the platform process.',
        },
        {
          title: 'Professional activity',
          text: 'Assignments, contact views and follow-up notes can create a clearer accountability trail for administrators and bureaus.',
        },
      ],
      mockTitle: 'Example profile status',
      mockReference: 'Reference # MBN-••••••',
      statusLabel: 'Current status',
      statusValue: 'Under review',
      photoLabel: 'Photo preference',
      photoValue: 'Blurred',
      contactLabel: 'Contact details',
      contactValue: 'Locked',
      accessLabel: 'Current access',
      accessValue: 'Review workflow',
      footer: 'Nothing is published automatically after form submission.',
    },
    responsibilities: {
      eyebrow: 'Shared responsibility',
      title: 'What MBN does — and what families must still verify',
      text:
        'Technology can organise a process, but a matrimonial decision requires independent checks, honest communication and informed family judgement.',
      doesTitle: 'MBN is designed to',
      does: [
        'Provide a structured profile-submission experience',
        'Support review, assignment and professional follow-up',
        'Keep contact details outside open public browsing',
        'Help bureaus organise search and case activity',
      ],
      doesNotTitle: 'MBN does not promise to',
      doesNot: [
        'Guarantee a match, engagement or marriage',
        'Automatically verify every statement made by a user',
        'Replace legal, identity, medical or financial checks',
        'Make the final suitability decision for a family',
      ],
      warning:
        'Before agreeing to any proposal, independently confirm identity, marital status, family information, education, employment, finances and any other fact important to your decision.',
    },
    readiness: {
      eyebrow: 'Before you begin',
      title: 'Prepare these details for a smoother submission',
      text: 'Having the right information ready makes the questionnaire faster and improves profile quality.',
      items: [
        { title: 'Candidate basics', text: 'Name, age or date of birth, city, height and marital status.' },
        { title: 'Education & career', text: 'Qualification, profession, employment and appropriate income information.' },
        { title: 'Family background', text: 'Parents, siblings, family system and a brief family introduction.' },
        { title: 'Partner preferences', text: 'Age range, location, education, values and important expectations.' },
        { title: 'Clear photographs', text: 'Recent, respectful images and the preferred visibility setting.' },
        { title: 'Working contact details', text: 'A phone or WhatsApp number that the review team can use when needed.' },
      ],
    },
    faq: {
      eyebrow: 'Common questions',
      title: 'Understand the process before you start',
      items: [
        {
          q: 'Does submitting a profile make it public?',
          a: 'No. A public submission enters a review-first workflow. It is not automatically added to an open public directory or swipe feed.',
        },
        {
          q: 'Will I see instant matches after submission?',
          a: 'No fake or random match count should be shown. The next step is review. Suitable possibilities can only be considered after real profile assessment and availability.',
        },
        {
          q: 'Can a parent or sibling submit the profile?',
          a: 'Yes. A parent, sibling, guardian or authorised family member can complete the form, provided the information is accurate and the candidate is appropriately involved in the process.',
        },
        {
          q: 'Is a match guaranteed?',
          a: 'No. MBN provides a structured matrimonial workflow and professional support, but it cannot guarantee availability, compatibility, engagement or marriage.',
        },
        {
          q: 'What happens if information is incomplete?',
          a: 'The review team may contact the submitter for clarification. The case may remain under review until the required information is provided.',
        },
      ],
    },
    final: {
      eyebrow: 'Ready to take the next step?',
      title: 'Begin with a complete profile and clear expectations.',
      text:
        'Choose the path that fits you. Families can begin a private questionnaire, while professional bureaus can apply to join the network.',
      family: 'Submit Your Profile',
      bureau: 'Apply as a Bureau',
      contact: 'Ask a Question',
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
      eyebrow: 'رشتے کی تلاش کا واضح اور باوقار سفر',
      titleStart: 'ایک مکمل پروفائل سے',
      titleAccent: 'بااحترام میچ میکنگ تک۔',
      text:
        'MBN Pakistan نجی پروفائل سبمیشن، انسانی جائزے اور پیشہ ور میرج بیورو نیٹ ورک کو ایک جگہ لاتا ہے تاکہ خاندان اور میچ میکر زیادہ منظم، محفوظ اور جواب دہ طریقے سے آگے بڑھ سکیں۔',
      primary: 'اپنی پروفائل شروع کریں',
      secondary: 'مکمل طریقہ دیکھیں',
      note: 'صرف سنجیدہ شادی کے خواہشمند افراد کے لیے',
      previewTitle: 'آپ کی پروفائل کا سفر',
      previewStatus: 'پہلے جائزہ، پھر اگلا قدم',
      stages: ['آسان سوالنامہ', 'انسانی جائزہ', 'پیشہ ور فالو اپ'],
      locked: 'حساس معلومات محدود اور محفوظ رہتی ہیں',
    },
    trust: [
      { title: 'پبلک لسٹنگ نہیں', text: 'پبلک سبمیشن خودکار طور پر کسی اوپن براؤزنگ فیڈ میں شامل نہیں ہوتی۔' },
      { title: 'پہلے جائزہ', text: 'اگلے مرحلے سے پہلے معلومات کی تکمیل اور وضاحت چیک کی جاتی ہے۔' },
      { title: 'دو واضح راستے', text: 'خاندانوں اور پیشہ ور میرج بیوروز کے لیے الگ ورک فلو موجود ہیں۔' },
      { title: 'سرگرمی کا ریکارڈ', text: 'اسائنمنٹ، کانٹیکٹ ویو اور فالو اپ پلیٹ فارم کے اندر منظم کیے جا سکتے ہیں۔' },
    ],
    selector: {
      eyebrow: 'اپنا راستہ منتخب کریں',
      title: 'آپ MBN Pakistan کس طرح استعمال کرنا چاہتے ہیں؟',
      text: 'پلیٹ فارم دو مختلف صارفین کے لیے بنایا گیا ہے۔ مکمل طریقہ دیکھنے کے لیے اپنا راستہ منتخب کریں۔',
      familyLabel: 'میں فرد یا خاندان ہوں',
      familyNote: 'نجی میرج پروفائل جمع کروائیں',
      bureauLabel: 'میں میرج بیورو چلاتا/چلاتی ہوں',
      bureauNote: 'پیشہ ور ورک اسپیس کے لیے اپلائی کریں',
    },
    families: {
      tag: 'افراد اور خاندانوں کے لیے',
      title: 'پروفائل سبمیشن سے باوقار فالو اپ تک واضح راستہ',
      text: 'پروفائل کو پبلک سوائپ مارکیٹ میں ڈالنے کے بجائے MBN ایک تفصیلی سوالنامے اور ریویو فرسٹ طریقے سے آغاز کرتا ہے۔',
      overview: {
        eyebrow: 'آپ کے سفر کا مختصر جائزہ',
        title: 'چھ واضح مراحل، اور ہر قدم پر خاندان کی شمولیت',
        text: 'عمل کا آغاز درست معلومات سے ہوتا ہے، کسی بے بنیاد فوری میچ کاؤنٹر سے نہیں۔ سبمیشن، جائزے اور پیشہ ور فالو اپ تک ہر مرحلے کا واضح مقصد ہے۔',
        facts: [
          { label: 'پہلا قدم', value: 'آسان سوالنامہ' },
          { label: 'پہلا فیصلہ', value: 'انسانی پروفائل جائزہ' },
          { label: 'مسلسل کردار', value: 'خاندان کے ساتھ فالو اپ' },
        ],
      },
      steps: [
        {
          title: 'آسان سوالنامہ مکمل کریں',
          text: 'امیدوار کی ذاتی معلومات، تعلیم، پیشہ، خاندانی پس منظر، طرزِ زندگی اور شریکِ حیات کی ترجیحات مرحلہ وار درج کریں۔',
          note: 'فارم کو چھوٹے اور واضح حصوں میں تقسیم کیا گیا ہے تاکہ موبائل اور کمپیوٹر دونوں پر مکمل کرنا آسان ہو۔',
        },
        {
          title: 'تصاویر کی پرائیویسی منتخب کریں',
          text: 'مقررہ تعداد تک تصاویر اپلوڈ کریں اور visible، blurred یا hidden جیسی visibility preference منتخب کریں۔',
          note: 'منتخب کردہ ترجیح پروفائل کے ساتھ محفوظ ہو کر ریویو ورک فلو کا حصہ بنتی ہے۔',
        },
        {
          title: 'نجی ریفرنس نمبر حاصل کریں',
          text: 'کامیاب سبمیشن کے بعد سسٹم ایک ریفرنس نمبر بناتا ہے جسے MBN ٹیم سے پروفائل کے متعلق رابطے کے وقت استعمال کیا جا سکتا ہے۔',
          note: 'ریفرنس نمبر محفوظ رکھیں اور غیر ضروری طور پر کسی کے ساتھ شیئر نہ کریں۔',
        },
        {
          title: 'پروفائل انسانی جائزے میں جاتی ہے',
          text: 'معلومات کی تکمیل، وضاحت اور مناسبیت دیکھی جاتی ہے۔ ضروری معلومات کم ہوں تو ٹیم سبمٹر سے رابطہ کر سکتی ہے۔',
          note: 'فارم جمع ہونے کا مطلب یہ نہیں کہ پروفائل خودکار طور پر شائع ہو گئی یا میچ کی ضمانت مل گئی۔',
        },
        {
          title: 'مناسب پیشہ ور مدد اسائن ہو سکتی ہے',
          text: 'ضرورت اور دستیابی کے مطابق ریویو شدہ کیس کسی مناسب میرج بیورو یا میچ میکر کو اسائن کیا جا سکتا ہے۔',
          note: 'اسائنمنٹ پروفائل، شہر، ضروریات اور دستیاب پیشہ ور سپورٹ پر منحصر ہوتی ہے۔',
        },
        {
          title: 'خاندان کی شمولیت کے ساتھ فالو اپ',
          text: 'اسائن شدہ ٹیم مناسب امکانات دیکھ سکتی ہے، پیش رفت ریکارڈ کر سکتی ہے اور ضرورت کے مطابق خاندان سے رابطہ رکھ سکتی ہے۔',
          note: 'حتمی فیصلہ کرنے سے پہلے شناخت، قانونی حیثیت، تعلیم، ملازمت، مالی معلومات اور دیگر اہم حقائق کی آزادانہ تصدیق ضرور کریں۔',
        },
      ],
      outcomeTitle: 'سبمیشن کے بعد آپ کو کیا ملتا ہے',
      outcomes: [
        'پروفائل کامیابی سے جمع ہونے کی تصدیق',
        'نجی پروفائل ریفرنس نمبر',
        'جعلی فوری میچز کے بجائے واضح ریویو اسٹیٹس',
        'مزید معلومات یا کارروائی درکار ہونے پر فالو اپ',
      ],
      cta: 'نجی پروفائل جمع کروائیں',
    },
    bureaus: {
      tag: 'پیشہ ور میرج بیوروز کے لیے',
      title: 'پروفائل، سرچ اور فالو اپ کے لیے منظم ورک اسپیس',
      text: 'MBN تجربہ کار میچ میکرز کو بکھری ہوئی اسپریڈ شیٹس اور واٹس ایپ چیٹس کے بجائے اہم کام ایک ڈیش بورڈ میں منظم کرنے میں مدد دیتا ہے۔',
      overview: {
        eyebrow: 'پیشہ ور ورک فلو کا مختصر جائزہ',
        title: 'بیورو درخواست سے منظم کیس مینجمنٹ تک',
        text: 'رسائی کا آغاز جائزے اور منظوری سے ہوتا ہے۔ منظوری کے بعد بیورو منظم پروفائلز بنا سکتا ہے، دستیاب معلومات میں سرچ کر سکتا ہے اور ذمہ دار فالو اپ ریکارڈ کر سکتا ہے۔',
        facts: [
          { label: 'پہلا قدم', value: 'بیورو درخواست' },
          { label: 'رسائی کا اصول', value: 'منظوری ضروری' },
          { label: 'ورک اسپیس', value: 'پروفائل، سرچ اور فالو اپ' },
        ],
      },
      steps: [
        {
          title: 'بیورو درخواست جمع کروائیں',
          text: 'ریویو کے لیے بیورو کی شناخت، مقام، رابطہ معلومات، تجربہ، پروفائلز کی تعداد اور متعلقہ کاروباری تفصیلات فراہم کریں۔',
          note: 'درخواست جمع کروانے سے نیٹ ورک تک خودکار رسائی نہیں ملتی۔',
        },
        {
          title: 'MBN درخواست کا جائزہ لیتا ہے',
          text: 'منظوری سے پہلے درخواست دیکھی جاتی ہے۔ ضرورت کے مطابق مزید معلومات یا تصدیقی مواد مانگا جا سکتا ہے۔',
          note: 'صرف منظور شدہ اکاؤنٹس کو پیشہ ور ورک اسپیس تک رسائی ملنی چاہیے۔',
        },
        {
          title: 'منظم میرج پروفائلز بنائیں',
          text: 'منظور شدہ بیورو صارفین خوبصورت اور مرحلہ وار سوالنامے کے ذریعے دلہا یا دلہن کی پروفائل شامل کر سکتے ہیں۔',
          note: 'منظم فیلڈز پروفائلز کو غیر مرتب پیغامات کے مقابلے میں دیکھنے، سرچ کرنے اور مینیج کرنے میں آسان بناتے ہیں۔',
        },
        {
          title: 'پیشہ ور نیٹ ورک میں سرچ کریں',
          text: 'ممکنہ طور پر مناسب پروفائلز تلاش کرنے کے لیے جنس، عمر، شہر، تعلیم اور پیشے جیسے دستیاب فلٹرز استعمال کریں۔',
          note: 'سرچ رزلٹس پیشہ ورانہ فیصلہ سازی میں مدد دیتے ہیں، مگر مکمل تصدیق اور خاندانی رضامندی کا متبادل نہیں۔',
        },
        {
          title: 'کانٹیکٹ رسائی ذمہ داری سے استعمال کریں',
          text: 'رابطہ معلومات پبلک پروفائل ویو سے الگ رہتی ہیں اور جواب دہی کے لیے کانٹیکٹ ویو سرگرمی ریکارڈ کی جا سکتی ہے۔',
          note: 'بیوروز ذاتی معلومات کے قانونی، بااحترام اور صرف متعلقہ مقصد کے لیے استعمال کے ذمہ دار رہتے ہیں۔',
        },
        {
          title: 'اسائنمنٹ اور فالو اپ ٹریک کریں',
          text: 'اسائن شدہ پروفائلز، نوٹس اور فالو اپ سرگرمی کو الگ فائلوں اور چیٹس میں ضائع ہونے کے بجائے ڈیش بورڈ میں منظم کیا جا سکتا ہے۔',
          note: 'پلیٹ فارم میچ میکر کے عمل کو سپورٹ کرتا ہے؛ حتمی موزونیت کا فیصلہ امیدواروں اور خاندانوں کا ہوتا ہے۔',
        },
      ],
      outcomeTitle: 'منظور شدہ بیورو کیا مینیج کر سکتا ہے',
      outcomes: [
        'منظم دلہا اور دلہن پروفائلز',
        'سرچ کے قابل میرج معلومات',
        'اسائن شدہ کیسز اور فالو اپ نوٹس',
        'کانٹیکٹ ویو جواب دہی ریکارڈ',
      ],
      cta: 'میرج بیورو کے طور پر اپلائی کریں',
    },
    privacy: {
      eyebrow: 'عملی پرائیویسی',
      title: 'حساس معلومات کے ساتھ کیا ہوتا ہے؟',
      text: 'قابلِ اعتماد میرج پراسیس کو معلومات کے استعمال کی واضح وضاحت کرنی چاہیے۔ MBN پبلک پروفائل معلومات، تصاویر اور رابطہ تفصیلات کو اپنے ورک فلو میں الگ رکھتا ہے۔',
      cards: [
        {
          title: 'پروفائل سبمیشن',
          text: 'فارم ریویو اور میرج اسیسمنٹ کے لیے ضروری معلومات لیتا ہے۔ یہ خودکار طور پر پبلک فیڈ میں شامل نہیں ہوتی۔',
        },
        {
          title: 'تصویر کی ترجیح',
          text: 'سبمٹر ریکارڈ کر سکتا ہے کہ تصاویر visible، blurred یا hidden کس طریقے سے ہینڈل کی جائیں۔',
        },
        {
          title: 'رابطہ معلومات',
          text: 'فون اور واٹس ایپ تفصیلات اوپن پبلک براؤزنگ سے الگ رہتی ہیں اور پلیٹ فارم کے طریقے کے مطابق استعمال ہوتی ہیں۔',
        },
        {
          title: 'پیشہ ور سرگرمی',
          text: 'اسائنمنٹ، کانٹیکٹ ویو اور فالو اپ نوٹس ایڈمن اور بیوروز کے لیے واضح جواب دہی ریکارڈ بنا سکتے ہیں۔',
        },
      ],
      mockTitle: 'پروفائل اسٹیٹس کی مثال',
      mockReference: 'ریفرنس # MBN-••••••',
      statusLabel: 'موجودہ اسٹیٹس',
      statusValue: 'زیرِ جائزہ',
      photoLabel: 'تصویر کی ترجیح',
      photoValue: 'دھندلی',
      contactLabel: 'رابطہ تفصیلات',
      contactValue: 'محدود',
      accessLabel: 'موجودہ رسائی',
      accessValue: 'ریویو ورک فلو',
      footer: 'فارم جمع ہوتے ہی کچھ بھی خودکار طور پر شائع نہیں ہوتا۔',
    },
    responsibilities: {
      eyebrow: 'مشترکہ ذمہ داری',
      title: 'MBN کیا کرتا ہے — اور خاندان کو کیا خود تصدیق کرنا چاہیے',
      text: 'ٹیکنالوجی عمل کو منظم کر سکتی ہے، مگر شادی کے فیصلے کے لیے آزادانہ جانچ، دیانت دار گفتگو اور باخبر خاندانی فیصلہ ضروری ہے۔',
      doesTitle: 'MBN کا مقصد',
      does: [
        'منظم اور آسان پروفائل سبمیشن فراہم کرنا',
        'ریویو، اسائنمنٹ اور پیشہ ور فالو اپ سپورٹ کرنا',
        'رابطہ معلومات کو اوپن پبلک براؤزنگ سے الگ رکھنا',
        'بیوروز کو سرچ اور کیس سرگرمی منظم کرنے میں مدد دینا',
      ],
      doesNotTitle: 'MBN یہ ضمانت نہیں دیتا',
      doesNot: [
        'میچ، منگنی یا شادی کی ضمانت',
        'ہر صارف کے ہر بیان کی خودکار تصدیق',
        'قانونی، شناختی، طبی یا مالی جانچ کا متبادل',
        'خاندان کی طرف سے حتمی موزونیت کا فیصلہ',
      ],
      warning: 'کسی بھی رشتے سے اتفاق سے پہلے شناخت، ازدواجی حیثیت، خاندان، تعلیم، ملازمت، مالی معلومات اور اپنے فیصلے کے لیے اہم ہر حقیقت کی آزادانہ تصدیق کریں۔',
    },
    readiness: {
      eyebrow: 'شروع کرنے سے پہلے',
      title: 'آسان سبمیشن کے لیے یہ معلومات تیار رکھیں',
      text: 'درست معلومات پہلے سے موجود ہوں تو سوالنامہ جلد مکمل ہوتا ہے اور پروفائل کا معیار بہتر رہتا ہے۔',
      items: [
        { title: 'امیدوار کی بنیادی معلومات', text: 'نام، عمر یا تاریخِ پیدائش، شہر، قد اور ازدواجی حیثیت۔' },
        { title: 'تعلیم اور پیشہ', text: 'تعلیمی قابلیت، پیشہ، ملازمت اور مناسب آمدنی کی معلومات۔' },
        { title: 'خاندانی پس منظر', text: 'والدین، بہن بھائی، فیملی سسٹم اور مختصر خاندانی تعارف۔' },
        { title: 'شریکِ حیات کی ترجیحات', text: 'عمر، مقام، تعلیم، اقدار اور اہم توقعات۔' },
        { title: 'واضح تصاویر', text: 'حالیہ اور مناسب تصاویر کے ساتھ مطلوبہ visibility setting۔' },
        { title: 'فعال رابطہ تفصیلات', text: 'فون یا واٹس ایپ نمبر جس پر ضرورت کے وقت ریویو ٹیم رابطہ کر سکے۔' },
      ],
    },
    faq: {
      eyebrow: 'عام سوالات',
      title: 'شروع کرنے سے پہلے طریقہ سمجھیں',
      items: [
        {
          q: 'کیا پروفائل جمع ہوتے ہی پبلک ہو جاتی ہے؟',
          a: 'نہیں۔ پبلک سبمیشن پہلے ریویو ورک فلو میں داخل ہوتی ہے۔ یہ خودکار طور پر اوپن پبلک ڈائریکٹری یا سوائپ فیڈ میں شامل نہیں ہوتی۔',
        },
        {
          q: 'کیا سبمیشن کے فوراً بعد میچز نظر آئیں گے؟',
          a: 'جعلی یا رینڈم میچ کاؤنٹ نہیں دکھایا جانا چاہیے۔ پہلا اگلا مرحلہ ریویو ہے۔ حقیقی پروفائل اسیسمنٹ اور دستیابی کے بعد ہی مناسب امکانات دیکھے جا سکتے ہیں۔',
        },
        {
          q: 'کیا والدین یا بہن بھائی پروفائل جمع کر سکتے ہیں؟',
          a: 'جی ہاں۔ والد، والدہ، بہن بھائی، سرپرست یا مجاز خاندانی فرد فارم مکمل کر سکتا ہے، بشرطیکہ معلومات درست ہوں اور امیدوار مناسب طور پر عمل میں شامل ہو۔',
        },
        {
          q: 'کیا میچ کی ضمانت ہے؟',
          a: 'نہیں۔ MBN منظم میرج ورک فلو اور پیشہ ور سپورٹ فراہم کرتا ہے، مگر دستیابی، مطابقت، منگنی یا شادی کی ضمانت نہیں دے سکتا۔',
        },
        {
          q: 'معلومات نامکمل ہوں تو کیا ہوگا؟',
          a: 'ریویو ٹیم وضاحت کے لیے سبمٹر سے رابطہ کر سکتی ہے۔ مطلوبہ معلومات ملنے تک کیس زیرِ جائزہ رہ سکتا ہے۔',
        },
      ],
    },
    final: {
      eyebrow: 'اگلا قدم لینے کے لیے تیار ہیں؟',
      title: 'مکمل پروفائل اور واضح توقعات کے ساتھ آغاز کریں۔',
      text: 'اپنے لیے مناسب راستہ منتخب کریں۔ خاندان نجی سوالنامہ شروع کر سکتے ہیں جبکہ پیشہ ور بیوروز نیٹ ورک میں شمولیت کے لیے اپلائی کر سکتے ہیں۔',
      family: 'اپنی پروفائل جمع کروائیں',
      bureau: 'بیورو کے طور پر اپلائی کریں',
      contact: 'سوال پوچھیں',
    },
    footer: {
      text: 'سنجیدہ افراد، خاندانوں اور پیشہ ور میرج بیوروز کے لیے نجی اور خاندانی ترجیح پر مبنی میچ میکنگ نیٹ ورک۔',
      explore: 'دیکھیں',
      families: 'خاندانوں کے لیے',
      bureaus: 'بیوروز کے لیے',
      how: 'یہ کیسے کام کرتا ہے',
      company: 'ادارہ',
      about: 'ہمارے بارے میں',
      contact: 'رابطہ',
      login: 'بیورو لاگ اِن',
      note: 'MBN Pakistan ایک میرج پلیٹ فارم ہے اور casual dating کے لیے نہیں ہے۔',
      rights: 'تمام حقوق محفوظ ہیں۔',
    },
  },
} as const;

const trustIcons = [EyeOff, ClipboardCheck, Users, History];
const familyIcons = [FileText, EyeOff, FileCheck2, ClipboardCheck, UserCheck, MessageCircle];
const bureauIcons = [Send, ShieldCheck, FileText, Search, Lock, History];
const privacyIcons = [ClipboardCheck, EyeOff, Lock, History];
const readinessIcons = [UserCheck, Building2, Users, HeartHandshake, FileCheck2, MessageCircle];

export default function HowItWorksPage() {
  const { language, setLanguage, isUrdu } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [journey, setJourney] = useState<JourneyKey>('families');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const t = content[language];

  const activeJourney = useMemo(
    () => (journey === 'families' ? t.families : t.bureaus),
    [journey, t],
  );
  const activeIcons = journey === 'families' ? familyIcons : bureauIcons;

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-how-reveal]'));

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
      { threshold: 0.12, rootMargin: '0px 0px -42px' },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [language, journey]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const arrowClass = isUrdu ? 'rotate-180' : '';

  const scrollToJourney = () => {
    document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen overflow-x-hidden bg-[#fbfcf8] text-slate-950">
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        .how-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 760ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .how-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .how-reveal-delay-1 { transition-delay: 80ms; }
        .how-reveal-delay-2 { transition-delay: 160ms; }
        .how-reveal-delay-3 { transition-delay: 240ms; }
        .how-hero-rise {
          animation: howHeroRise 820ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .how-hero-rise-2 {
          animation: howHeroRise 820ms 120ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .how-hero-rise-3 {
          animation: howHeroRise 820ms 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .how-float-a { animation: howFloatA 5.8s ease-in-out infinite; }
        .how-float-b { animation: howFloatB 6.6s ease-in-out infinite; }
        .how-pulse-line::after {
          content: '';
          position: absolute;
          inset-inline-start: 0;
          top: 0;
          width: 34%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.95), transparent);
          animation: howLinePulse 3.4s ease-in-out infinite;
        }
        .how-shimmer {
          position: relative;
          overflow: hidden;
        }
        .how-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(100deg, transparent 35%, rgba(255,255,255,.34) 50%, transparent 65%);
          animation: howShimmer 5.5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes howHeroRise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes howFloatA {
          0%, 100% { transform: translate3d(0,0,0) rotate(-1deg); }
          50% { transform: translate3d(0,-9px,0) rotate(1deg); }
        }
        @keyframes howFloatB {
          0%, 100% { transform: translate3d(0,0,0) rotate(1deg); }
          50% { transform: translate3d(0,8px,0) rotate(-1deg); }
        }
        @keyframes howLinePulse {
          0% { transform: translateX(-120%); opacity: 0; }
          25% { opacity: 1; }
          65%, 100% { transform: translateX(330%); opacity: 0; }
        }
        @keyframes howShimmer {
          0%, 55% { transform: translateX(-120%); }
          82%, 100% { transform: translateX(120%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .how-reveal, .how-hero-rise, .how-hero-rise-2, .how-hero-rise-3,
          .how-float-a, .how-float-b, .how-pulse-line::after, .how-shimmer::after {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <PublicHeader
        language={language}
        setLanguage={setLanguage}
        isUrdu={isUrdu}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        labels={t.nav}
        subtitle={t.subtitle}
      />

      <main className="pt-[76px]">
        <section className="relative overflow-hidden border-b border-emerald-950/5 bg-[radial-gradient(circle_at_18%_12%,rgba(205,231,207,0.74),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(236,214,176,0.58),transparent_31%),linear-gradient(180deg,#fbfcf8_0%,#f5f8f2_100%)]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(6,75,43,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(6,75,43,.08)_1px,transparent_1px)] [background-size:52px_52px]" />
          <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pb-28 lg:pt-24">
            <div>
              <div className="how-hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/82 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0a6a3f] shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {t.hero.eyebrow}
              </div>

              <h1 className="how-hero-rise-2 mt-7 max-w-3xl font-heading text-[2.7rem] font-bold leading-[1.04] tracking-[-0.035em] text-[#073b24] sm:text-6xl lg:text-[4.65rem]">
                {t.hero.titleStart}{' '}
                <span className="relative inline text-[#0a6a3f]">
                  {t.hero.titleAccent}
                  <span className="absolute -bottom-1.5 left-0 h-2 w-full rounded-full bg-[#d7b66e]/28" />
                </span>
              </h1>

              <p className="how-hero-rise-3 mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                {t.hero.text}
              </p>

              <div className="how-hero-rise-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/submit-profile"
                  className="how-shimmer group inline-flex items-center justify-center gap-3 rounded-full bg-[#0a6a3f] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_38px_rgba(10,106,63,0.24)] transition hover:-translate-y-0.5 hover:bg-[#075632]"
                >
                  {t.hero.primary}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${arrowClass}`} />
                </Link>
                <button
                  type="button"
                  onClick={scrollToJourney}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-emerald-900/15 bg-white px-6 py-3.5 text-sm font-extrabold text-[#073b24] shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  {t.hero.secondary}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="how-hero-rise-3 mt-7 flex items-center gap-3 text-xs font-bold text-slate-500">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0a6a3f] shadow-sm ring-1 ring-emerald-900/5">
                  <HeartHandshake className="h-4 w-4" />
                </span>
                {t.hero.note}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[680px] lg:mx-0">
              <div className="absolute -inset-8 rounded-[4rem] bg-[#0a6a3f]/8 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2.4rem] border border-white/90 bg-white/90 p-3 shadow-[0_34px_90px_rgba(5,61,37,0.16)] backdrop-blur sm:rounded-[3rem] sm:p-4">
                <div className="relative overflow-hidden rounded-[1.9rem] bg-[#073b24] p-6 text-white sm:rounded-[2.4rem] sm:p-8">
                  <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-[#15915a]/28 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-[#d7b66e]/16 blur-3xl" />

                  <div className="relative flex items-start justify-between gap-5">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#bce5c8]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {t.hero.previewStatus}
                      </div>
                      <h2 className="mt-5 font-heading text-2xl font-bold sm:text-3xl">{t.hero.previewTitle}</h2>
                    </div>
                    <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/[0.08] text-[#bde6c9]">
                      <Network className="h-7 w-7" />
                    </span>
                  </div>

                  <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
                    {t.hero.stages.map((stage, index) => {
                      const StageIcon = [FileText, ClipboardCheck, MessageCircle][index];
                      return (
                        <div key={stage} className="relative rounded-3xl border border-white/10 bg-white/[0.055] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#bce5c8] text-[#073b24]">
                              <StageIcon className="h-[18px] w-[18px]" />
                            </span>
                            <span className="font-heading text-2xl font-bold text-white/[0.12]">0{index + 1}</span>
                          </div>
                          <p className="mt-5 text-xs font-extrabold leading-5 text-white/88">{stage}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="how-pulse-line relative h-full w-full rounded-full bg-gradient-to-r from-[#8fcba0] via-[#d7b66e] to-[#8fcba0]" />
                  </div>

                  <div className="relative mt-6 flex items-center gap-3 rounded-3xl border border-white/10 bg-black/10 p-4">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/[0.08] text-[#bde6c9]">
                      <Lock className="h-5 w-5" />
                    </span>
                    <p className="text-xs font-bold leading-5 text-white/72">{t.hero.locked}</p>
                  </div>
                </div>
              </div>

              <div className={`how-float-a absolute -top-5 hidden max-w-[220px] rounded-3xl border border-white bg-white/95 p-4 shadow-[0_18px_50px_rgba(5,61,37,0.16)] backdrop-blur sm:block ${isUrdu ? '-right-8' : '-left-8'}`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e4f4e9] text-[#0a6a3f]">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-[#073b24]">{isUrdu ? 'مرحلہ وار' : 'Step by step'}</p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-500">{isUrdu ? 'واضح اور آسان سفر' : 'Clear, guided progress'}</p>
                  </div>
                </div>
              </div>

              <div className={`how-float-b absolute -bottom-5 hidden max-w-[230px] rounded-3xl border border-white/15 bg-[#f8f2e7] p-4 shadow-[0_20px_55px_rgba(72,56,29,0.16)] sm:block ${isUrdu ? '-left-8' : '-right-8'}`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#0a6a3f] shadow-sm">
                    <Users className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-[#073b24]">{isUrdu ? 'خاندان شامل رہتا ہے' : 'Family stays involved'}</p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-500">{isUrdu ? 'باوقار فالو اپ' : 'Respectful follow-up'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-7 max-w-[1360px] px-4 sm:px-6 lg:px-10">
          <div className="grid overflow-hidden rounded-[2rem] border border-white/90 bg-white shadow-[0_22px_65px_rgba(5,61,37,0.10)] sm:grid-cols-2 lg:grid-cols-4">
            {t.trust.map((item, index) => {
              const Icon = trustIcons[index];
              return (
                <div key={item.title} className="group border-b border-slate-100 p-5 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#edf7f0] text-[#0a6a3f] transition duration-300 group-hover:-translate-y-1 group-hover:bg-[#0a6a3f] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xs font-extrabold text-[#073b24]">{item.title}</h3>
                      <p className="mt-1.5 text-[11px] leading-5 text-slate-500">{item.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="journey" className="scroll-mt-24 px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-[1320px]">
            <SectionHeading eyebrow={t.selector.eyebrow} title={t.selector.title} text={t.selector.text} />

            <div data-how-reveal className="how-reveal mx-auto mt-10 grid max-w-4xl gap-3 rounded-[2rem] border border-emerald-950/8 bg-white p-2.5 shadow-[0_20px_60px_rgba(5,61,37,0.09)] sm:grid-cols-2 sm:rounded-full">
              <JourneyButton
                active={journey === 'families'}
                onClick={() => setJourney('families')}
                icon={<Users className="h-5 w-5" />}
                title={t.selector.familyLabel}
                note={t.selector.familyNote}
              />
              <JourneyButton
                active={journey === 'bureaus'}
                onClick={() => setJourney('bureaus')}
                icon={<Building2 className="h-5 w-5" />}
                title={t.selector.bureauLabel}
                note={t.selector.bureauNote}
              />
            </div>

            <div key={journey} className="mt-14 animate-[howHeroRise_520ms_cubic-bezier(0.22,1,0.36,1)_both]">
              <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <div className={`overflow-hidden rounded-[2.5rem] p-7 sm:p-9 ${journey === 'families' ? 'border border-[#eadcc5] bg-gradient-to-br from-[#fbf2e5] to-[#fffdf9]' : 'bg-[#073b24] text-white shadow-[0_28px_75px_rgba(5,61,37,0.20)]'}`}>
                    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] ${journey === 'families' ? 'bg-white text-[#0a6a3f] shadow-sm' : 'bg-white/[0.07] text-[#bce5c8]'}`}>
                      {journey === 'families' ? <HeartHandshake className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
                      {activeJourney.tag}
                    </div>
                    <h2 className={`mt-7 font-heading text-3xl font-bold leading-[1.1] sm:text-4xl ${journey === 'families' ? 'text-[#073b24]' : 'text-white'}`}>
                      {activeJourney.title}
                    </h2>
                    <p className={`mt-5 text-sm leading-7 ${journey === 'families' ? 'text-slate-600' : 'text-white/65'}`}>
                      {activeJourney.text}
                    </p>

                    <div className={`mt-8 rounded-3xl p-5 ${journey === 'families' ? 'bg-white/82 shadow-sm' : 'border border-white/10 bg-white/[0.055]'}`}>
                      <p className={`text-xs font-extrabold uppercase tracking-[0.13em] ${journey === 'families' ? 'text-[#0a6a3f]' : 'text-[#bce5c8]'}`}>
                        {activeJourney.outcomeTitle}
                      </p>
                      <div className="mt-4 grid gap-3">
                        {activeJourney.outcomes.map((outcome) => (
                          <div key={outcome} className={`flex items-start gap-3 text-xs font-bold leading-5 ${journey === 'families' ? 'text-slate-700' : 'text-white/78'}`}>
                            <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${journey === 'families' ? 'bg-[#e3f3e8] text-[#0a6a3f]' : 'bg-[#bce5c8] text-[#073b24]'}`}>
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </span>
                            {outcome}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={journey === 'families' ? '/submit-profile' : '/register'}
                      className={`group mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-extrabold transition hover:-translate-y-0.5 ${journey === 'families' ? 'bg-[#0a6a3f] text-white shadow-[0_14px_32px_rgba(10,106,63,0.18)] hover:bg-[#075632]' : 'bg-white text-[#073b24] hover:bg-[#eaf5ed]'}`}
                    >
                      {activeJourney.cta}
                      <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${arrowClass}`} />
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className={`mb-6 overflow-hidden rounded-[2rem] border p-6 shadow-[0_16px_48px_rgba(5,61,37,0.08)] sm:p-7 ${journey === 'families' ? 'border-[#e8dbc4] bg-gradient-to-br from-white to-[#fbf4e9]' : 'border-emerald-900/10 bg-gradient-to-br from-[#edf7f0] to-white'}`}>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0a6a3f] shadow-sm ring-1 ring-emerald-950/5">
                          {journey === 'families' ? <HeartHandshake className="h-3.5 w-3.5" /> : <Network className="h-3.5 w-3.5" />}
                          {activeJourney.overview.eyebrow}
                        </div>
                        <h3 className="mt-4 font-heading text-2xl font-bold leading-tight text-[#073b24] sm:text-3xl">
                          {activeJourney.overview.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{activeJourney.overview.text}</p>
                      </div>
                      <span className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${journey === 'families' ? 'bg-[#0a6a3f] text-white' : 'bg-[#073b24] text-[#bce5c8]'}`}>
                        {journey === 'families' ? <Users className="h-6 w-6" /> : <SlidersHorizontal className="h-6 w-6" />}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {activeJourney.overview.facts.map((fact, index) => (
                        <div key={fact.label} className="rounded-2xl border border-white bg-white/82 p-4 shadow-sm">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400">{fact.label}</span>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8f4eb] text-[9px] font-extrabold text-[#0a6a3f]">0{index + 1}</span>
                          </div>
                          <p className="mt-3 text-xs font-extrabold leading-5 text-[#073b24]">{fact.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`absolute bottom-8 top-[260px] w-px bg-gradient-to-b from-transparent via-[#96caa5] to-transparent sm:top-[235px] ${isUrdu ? 'right-[27px]' : 'left-[27px]'}`} />
                  <div className="grid gap-5">
                    {activeJourney.steps.map((step, index) => {
                      const Icon = activeIcons[index];
                      return (
                        <ProcessStep
                          key={step.title}
                          index={index}
                          title={step.title}
                          text={step.text}
                          note={step.note}
                          icon={<Icon className="h-5 w-5" />}
                          isUrdu={isUrdu}
                          dark={journey === 'bureaus'}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-950/5 bg-white px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-[1320px]">
            <SectionHeading eyebrow={t.privacy.eyebrow} title={t.privacy.title} text={t.privacy.text} />

            <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {t.privacy.cards.map((card, index) => {
                  const Icon = privacyIcons[index];
                  return (
                    <div
                      key={card.title}
                      data-how-reveal
                      className={`how-reveal ${index % 2 ? 'how-reveal-delay-1' : ''} group rounded-[2rem] border border-slate-200 bg-[#fbfcf8] p-6 transition duration-500 hover:-translate-y-1 hover:border-emerald-800/15 hover:bg-white hover:shadow-[0_20px_55px_rgba(5,61,37,0.09)] sm:p-7`}
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f3e9] text-[#0a6a3f] transition duration-300 group-hover:bg-[#0a6a3f] group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-6 font-heading text-xl font-bold text-[#073b24]">{card.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
                    </div>
                  );
                })}
              </div>

              <div data-how-reveal className="how-reveal how-reveal-delay-1 overflow-hidden rounded-[2.6rem] bg-[#073b24] p-4 shadow-[0_28px_78px_rgba(5,61,37,0.20)] sm:p-5">
                <div className="relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-[2.1rem] border border-white/10 bg-[radial-gradient(circle_at_85%_5%,rgba(25,151,92,.30),transparent_34%),linear-gradient(160deg,#0a4c31,#052b1d)] p-6 text-white sm:p-8">
                  <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#d7b66e]/12 blur-3xl" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a9d6b6]">MBN Pakistan</p>
                      <h3 className="mt-3 font-heading text-2xl font-bold sm:text-3xl">{t.privacy.mockTitle}</h3>
                      <p className="mt-2 text-xs font-bold text-white/50">{t.privacy.mockReference}</p>
                    </div>
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.08] text-[#bde6c9]">
                      <ShieldCheck className="h-7 w-7" />
                    </span>
                  </div>

                  <div className="relative mt-8 grid gap-3">
                    <StatusRow icon={<ClipboardCheck className="h-4 w-4" />} label={t.privacy.statusLabel} value={t.privacy.statusValue} />
                    <StatusRow icon={<EyeOff className="h-4 w-4" />} label={t.privacy.photoLabel} value={t.privacy.photoValue} />
                    <StatusRow icon={<Lock className="h-4 w-4" />} label={t.privacy.contactLabel} value={t.privacy.contactValue} />
                    <StatusRow icon={<UserCheck className="h-4 w-4" />} label={t.privacy.accessLabel} value={t.privacy.accessValue} />
                  </div>

                  <div className="relative mt-auto pt-7">
                    <div className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#bde6c9]" />
                      <p className="text-xs font-bold leading-5 text-white/66">{t.privacy.footer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-[1320px]">
            <SectionHeading eyebrow={t.responsibilities.eyebrow} title={t.responsibilities.title} text={t.responsibilities.text} />

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              <ResponsibilityCard
                title={t.responsibilities.doesTitle}
                items={t.responsibilities.does}
                icon={<ShieldCheck className="h-6 w-6" />}
                positive
              />
              <ResponsibilityCard
                title={t.responsibilities.doesNotTitle}
                items={t.responsibilities.doesNot}
                icon={<HelpCircle className="h-6 w-6" />}
              />
            </div>

            <div data-how-reveal className="how-reveal mt-6 flex flex-col gap-5 rounded-[2rem] border border-amber-200/70 bg-[#fff8eb] p-6 sm:flex-row sm:items-start sm:p-8">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
                <FileCheck2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-800">{isUrdu ? 'اہم یاد دہانی' : 'Important reminder'}</p>
                <p className="mt-2 text-sm font-semibold leading-7 text-amber-950/78">{t.responsibilities.warning}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-950/5 bg-[#f1f6ef] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-[1320px]">
            <SectionHeading eyebrow={t.readiness.eyebrow} title={t.readiness.title} text={t.readiness.text} />

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.readiness.items.map((item, index) => {
                const Icon = readinessIcons[index];
                return (
                  <div
                    key={item.title}
                    data-how-reveal
                    className={`how-reveal ${index % 3 === 1 ? 'how-reveal-delay-1' : index % 3 === 2 ? 'how-reveal-delay-2' : ''} group rounded-[2rem] border border-white bg-white p-6 shadow-[0_14px_45px_rgba(5,61,37,0.06)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(5,61,37,0.11)] sm:p-7`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f4eb] text-[#0a6a3f] transition duration-300 group-hover:bg-[#0a6a3f] group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-heading text-3xl font-bold text-[#073b24]/[0.06]">0{index + 1}</span>
                    </div>
                    <h3 className="mt-6 font-heading text-xl font-bold text-[#073b24]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-[1100px]">
            <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />

            <div className="mt-12 grid gap-3">
              {t.faq.items.map((item, index) => {
                const isOpen = openFaq === index;
                const answerId = `how-faq-answer-${index}`;
                return (
                  <div key={item.q} className={`overflow-hidden rounded-[1.7rem] border transition duration-300 ${isOpen ? 'border-emerald-800/18 bg-[#f3f8f2] shadow-[0_15px_45px_rgba(5,61,37,0.07)]' : 'border-slate-200 bg-white hover:border-emerald-800/14'}`}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-start sm:px-7 sm:py-6"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                    >
                      <span className="flex items-center gap-4">
                        <span className={`hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-extrabold sm:flex ${isOpen ? 'bg-[#0a6a3f] text-white' : 'bg-[#edf7f0] text-[#0a6a3f]'}`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-heading text-base font-bold leading-6 text-[#073b24] sm:text-lg">{item.q}</span>
                      </span>
                      <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition ${isOpen ? 'rotate-180 bg-[#0a6a3f] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    <div id={answerId} role="region" className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <p className={`px-5 pb-6 text-sm leading-7 text-slate-600 sm:px-[5.75rem] sm:pb-7 ${isUrdu ? 'sm:pr-[5.75rem] sm:pl-7' : ''}`}>{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 pt-6 sm:px-6 lg:px-10 lg:pb-32">
          <div data-how-reveal className="how-reveal relative mx-auto max-w-[1320px] overflow-hidden rounded-[2.8rem] bg-[#073b24] px-6 py-14 text-center text-white shadow-[0_32px_90px_rgba(5,61,37,0.20)] sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-[#15915a]/28 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#d7b66e]/14 blur-3xl" />
            <div className="relative mx-auto max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#bce5c8]">
                <Sparkles className="h-3.5 w-3.5" />
                {t.final.eyebrow}
              </div>
              <h2 className="mt-6 font-heading text-3xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.6rem]">{t.final.title}</h2>
              <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-white/64 sm:text-base sm:leading-8">{t.final.text}</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/submit-profile" className="how-shimmer group inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-[#073b24] transition hover:-translate-y-0.5 hover:bg-[#eaf5ed]">
                  {t.final.family}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${arrowClass}`} />
                </Link>
                <Link href="/register" className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/18 bg-white/[0.07] px-6 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.12]">
                  {t.final.bureau}
                  <Building2 className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-3 rounded-full px-5 py-3.5 text-sm font-extrabold text-[#bce5c8] transition hover:text-white">
                  {t.final.contact}
                  <MessageCircle className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter isUrdu={isUrdu} t={t.footer} subtitle={t.subtitle} />

      <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden">
        <Link href="/submit-profile" className="how-shimmer flex items-center justify-center gap-2 rounded-full bg-[#0a6a3f] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_40px_rgba(4,47,32,0.35)]">
          {t.nav.submit}
          <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
        </Link>
      </div>
    </div>
  );
}

function PublicHeader({
  language,
  setLanguage,
  isUrdu,
  mobileMenuOpen,
  setMobileMenuOpen,
  labels,
  subtitle,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
  isUrdu: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  labels: {
    home: string;
    how: string;
    families: string;
    bureaus: string;
    about: string;
    contact: string;
    login: string;
    submit: string;
  };
  subtitle: string;
}) {
  const arrowClass = isUrdu ? 'rotate-180' : '';
  const navItems = [
    ['/', labels.home],
    ['/how-it-works', labels.how],
    ['/for-families', labels.families],
    ['/for-bureaus', labels.bureaus],
    ['/about', labels.about],
    ['/contact', labels.contact],
  ] as const;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-[#fbfcf8]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="MBN Pakistan home">
            <span className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(5,61,37,0.10)] ring-1 ring-emerald-950/5 transition-transform duration-300 group-hover:-translate-y-0.5">
              <Image src="/mbn-logo.png" alt="MBN Pakistan" width={44} height={44} className="h-full w-full object-contain p-1" priority />
            </span>
            <span className="hidden leading-none min-[390px]:block">
              <span className="block font-heading text-lg font-bold tracking-[0.13em] text-[#073b24]">MBN</span>
              <span className="mt-1 block text-[10px] font-extrabold tracking-[0.22em] text-[#0d6f43]">PAKISTAN</span>
              <span className="mt-1 hidden text-[9px] font-medium tracking-wide text-slate-500 sm:block">{subtitle}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] font-bold text-slate-700 xl:flex">
            {navItems.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={href === '/how-it-works' ? 'relative text-[#0a6a3f] after:absolute after:-bottom-3 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#0a6a3f]' : 'transition hover:text-[#0a6a3f]'}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageToggle language={language} setLanguage={setLanguage} />
            </div>
            <Link href="/login" className="hidden rounded-full border border-emerald-900/15 bg-white px-4 py-2.5 text-xs font-extrabold text-[#073b24] shadow-sm transition hover:border-emerald-700/30 hover:bg-emerald-50 lg:inline-flex">
              {labels.login}
            </Link>
            <Link href="/submit-profile" className="how-shimmer inline-flex items-center gap-2 rounded-full bg-[#0a6a3f] px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_12px_30px_rgba(10,106,63,0.22)] transition hover:-translate-y-0.5 hover:bg-[#075632] sm:px-5 sm:text-[13px]">
              <span className="hidden min-[430px]:inline">{labels.submit}</span>
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
          <button type="button" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-[#062f20]/45 backdrop-blur-sm" />
          <div className={`absolute inset-y-0 w-[88%] max-w-sm bg-[#fbfcf8] p-6 shadow-2xl ${isUrdu ? 'left-0' : 'right-0'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/mbn-logo.png" alt="MBN Pakistan" width={44} height={44} className="h-11 w-11 rounded-xl bg-white object-contain p-1 shadow-sm" />
                <div>
                  <p className="font-heading font-bold text-[#073b24]">MBN Pakistan</p>
                  <p className="text-[10px] text-slate-500">{subtitle}</p>
                </div>
              </div>
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-900/5" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <LanguageToggle language={language} setLanguage={setLanguage} />
            </div>

            <nav className="mt-8 grid gap-2 text-base font-bold text-slate-800">
              {navItems.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3.5 transition ${href === '/how-it-works' ? 'bg-emerald-50 text-[#0a6a3f]' : 'hover:bg-emerald-50 hover:text-[#0a6a3f]'}`}
                >
                  {label}
                  <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
                </Link>
              ))}
            </nav>

            <div className="mt-8 grid gap-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-full border border-emerald-900/15 bg-white px-5 py-3 text-center text-sm font-extrabold text-[#073b24]">
                {labels.login}
              </Link>
              <Link href="/submit-profile" onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-[#0a6a3f] px-5 py-3 text-center text-sm font-extrabold text-white">
                {labels.submit}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div data-how-reveal className="how-reveal mx-auto max-w-4xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-[#edf7f0] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f]">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[#073b24] sm:text-5xl lg:text-[3.5rem]">{title}</h2>
      {text && <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{text}</p>}
    </div>
  );
}

function JourneyButton({ active, onClick, icon, title, note }: { active: boolean; onClick: () => void; icon: ReactNode; title: string; note: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 rounded-[1.45rem] px-5 py-4 text-start transition duration-300 sm:rounded-full ${active ? 'bg-[#073b24] text-white shadow-[0_14px_34px_rgba(5,61,37,0.20)]' : 'text-slate-700 hover:bg-emerald-50'}`}
      aria-pressed={active}
    >
      <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${active ? 'bg-white/10 text-[#bce5c8]' : 'bg-[#e8f4eb] text-[#0a6a3f]'}`}>
        {icon}
      </span>
      <span>
        <span className="block text-sm font-extrabold">{title}</span>
        <span className={`mt-1 block text-[10px] font-semibold ${active ? 'text-white/55' : 'text-slate-500'}`}>{note}</span>
      </span>
    </button>
  );
}

function ProcessStep({ index, title, text, note, icon, isUrdu, dark }: { index: number; title: string; text: string; note: string; icon: ReactNode; isUrdu: boolean; dark: boolean }) {
  return (
    <div data-how-reveal className="how-reveal group relative flex gap-5 sm:gap-7">
      <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-[#0a6a3f] shadow-[0_12px_35px_rgba(5,61,37,0.11)] ring-1 ring-emerald-950/5 transition duration-300 group-hover:-translate-y-1 group-hover:bg-[#0a6a3f] group-hover:text-white">
        {icon}
      </div>
      <div className="flex-1 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_12px_45px_rgba(5,61,37,0.05)] transition duration-500 group-hover:-translate-y-1 group-hover:border-emerald-800/14 group-hover:shadow-[0_22px_60px_rgba(5,61,37,0.10)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#0a6a3f]">{isUrdu ? `مرحلہ ${index + 1}` : `Step ${index + 1}`}</p>
            <h3 className="mt-2 font-heading text-xl font-bold leading-7 text-[#073b24] sm:text-2xl">{title}</h3>
          </div>
          <span className={`hidden rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] sm:inline-flex ${dark ? 'bg-[#edf7f0] text-[#0a6a3f]' : 'bg-[#f8f0e2] text-[#806026]'}`}>
            MBN
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-600">{text}</p>
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#f5f8f3] px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0a6a3f]" />
          <p className="text-[11px] font-semibold leading-5 text-slate-600">{note}</p>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3.5">
      <div className="flex items-center gap-3 text-xs font-bold text-white/66">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.08] text-[#bde6c9]">{icon}</span>
        {label}
      </div>
      <span className="rounded-full bg-[#bce5c8] px-3 py-1.5 text-[10px] font-extrabold text-[#073b24]">{value}</span>
    </div>
  );
}

function ResponsibilityCard({ title, items, icon, positive = false }: { title: string; items: readonly string[]; icon: ReactNode; positive?: boolean }) {
  return (
    <div data-how-reveal className={`how-reveal overflow-hidden rounded-[2.4rem] border p-7 sm:p-9 ${positive ? 'border-emerald-800/10 bg-[#edf7f0]' : 'border-[#eadcc5] bg-[#fbf3e7]'}`}>
      <div className="flex items-center gap-4">
        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${positive ? 'bg-[#0a6a3f] text-white' : 'bg-white text-[#88672f] shadow-sm'}`}>{icon}</span>
        <h3 className="font-heading text-2xl font-bold text-[#073b24]">{title}</h3>
      </div>
      <div className="mt-7 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/72 px-4 py-3.5 text-sm font-semibold leading-6 text-slate-700 shadow-sm">
            <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${positive ? 'bg-[#dff1e4] text-[#0a6a3f]' : 'bg-[#f5e8d2] text-[#806026]'}`}>
              {positive ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
            </span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicFooter({ isUrdu, t, subtitle }: { isUrdu: boolean; t: typeof content.en.footer | typeof content.ur.footer; subtitle: string }) {
  return (
    <footer className="bg-[#052d1e] pb-24 text-white sm:pb-0">
      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-10 lg:grid-cols-[1.5fr_0.7fr_0.7fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1 shadow-sm">
                <Image src="/mbn-logo.png" alt="MBN Pakistan" width={48} height={48} className="h-full w-full object-contain" />
              </span>
              <div>
                <p className="font-heading text-lg font-bold">MBN Pakistan</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a9d6b6]">{subtitle}</p>
              </div>
            </div>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/58">{t.text}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold text-white/65">
              <HeartHandshake className="h-4 w-4 text-[#bce5c8]" />
              {t.note}
            </div>
          </div>

          <FooterLinks title={t.explore} links={[[t.families, '/for-families'], [t.bureaus, '/for-bureaus'], [t.how, '/how-it-works']]} />
          <FooterLinks title={t.company} links={[[t.about, '/about'], [t.contact, '/contact'], [t.login, '/login']]} />
        </div>

        <div className="flex flex-col gap-4 pt-6 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MBN Pakistan. {t.rights}</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#9fd1ad]" />
            <span>{isUrdu ? 'نجی • خاندانی ترجیح • پیشہ ورانہ' : 'Private • Family-first • Professional'}</span>
          </div>
        </div>
      </div>
    </footer>
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
