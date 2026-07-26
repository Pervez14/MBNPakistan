'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  EyeOff,
  FileCheck2,
  HeartHandshake,
  Home,
  Lock,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage, type Language } from '@/lib/useLanguage';

type NavContent = {
  home: string;
  how: string;
  families: string;
  bureaus: string;
  about: string;
  contact: string;
  login: string;
  submit: string;
};

type FooterContent = {
  text: string;
  explore: string;
  families: string;
  bureaus: string;
  how: string;
  company: string;
  about: string;
  contact: string;
  login: string;
  note: string;
  rights: string;
};

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
      eyebrow: 'For individuals, parents and families',
      titleStart: 'A calmer, more dignified way to begin the',
      titleAccent: 'rishta search.',
      text:
        'Create one thoughtful matrimonial profile through a guided questionnaire, keep sensitive details inside a review-first workflow, and stay involved as the process moves forward.',
      primary: 'Start Private Profile',
      secondary: 'Understand the Process',
      note: 'For serious matrimonial enquiries only',
      points: ['No public swipe feed', 'Family-led submission', 'Human review before follow-up'],
      cardTitle: 'Private profile journey',
      cardStatus: 'Ready to begin',
      cardItems: [
        ['Questionnaire', 'Step by step'],
        ['Photo preference', 'You decide'],
        ['Contact details', 'Kept controlled'],
      ],
      cardFooter: 'Submitting does not automatically publish a profile.',
    },
    trust: [
      { title: 'Private by default', text: 'A submission does not enter an open public browsing feed.' },
      { title: 'Family participation', text: 'A parent, sibling or guardian can support the candidate through the process.' },
      { title: 'Review comes first', text: 'Information is checked before assignment or professional follow-up.' },
      { title: 'Controlled details', text: 'Photos and contact information remain part of the managed workflow.' },
    ],
    why: {
      eyebrow: 'Why families choose a guided process',
      title: 'Less noise. More clarity, privacy and family involvement.',
      text:
        'Matrimonial decisions need context that cannot be captured by a photograph and a swipe. MBN is structured around detailed information, deliberate review and respectful communication.',
      cards: [
        {
          title: 'One complete profile',
          text: 'Share personal, family, education, career and partner-preference information in organised sections instead of repeating it across messages.',
        },
        {
          title: 'Candidate-centred choices',
          text: 'Record who is submitting, how photos should be handled and the preferences that matter to the candidate and family.',
        },
        {
          title: 'Professional support',
          text: 'Where appropriate, a reviewed case may be assigned to a relevant marriage bureau or matchmaker for follow-up.',
        },
        {
          title: 'A clearer record',
          text: 'A private reference number and structured information make future communication easier than scattered chats and documents.',
        },
      ],
    },
    journey: {
      eyebrow: 'Your family journey',
      title: 'From first answer to respectful follow-up',
      text: 'Each stage has a clear purpose. There are no fictional instant matches or unexplained compatibility percentages.',
      steps: [
        {
          title: 'Complete the guided questionnaire',
          text: 'Add candidate details, education, career, family background, lifestyle preferences and partner requirements in focused sections.',
          note: 'The form saves progress in the browser so the experience stays manageable.',
        },
        {
          title: 'Choose photo and privacy preferences',
          text: 'Upload the allowed photos and record whether they should be visible, blurred or hidden within the profile workflow.',
          note: 'Sensitive details are not intended for an open swipe-style directory.',
        },
        {
          title: 'Review everything before submitting',
          text: 'A final review screen lets the family check the information and return to any section that needs correction.',
          note: 'Honest and complete information helps avoid unsuitable follow-up later.',
        },
        {
          title: 'Receive a private reference',
          text: 'After successful submission, the system provides a reference number for future communication with the MBN team.',
          note: 'Keep this reference private and available when contacting support.',
        },
        {
          title: 'Human review and professional follow-up',
          text: 'The submission is checked for completeness. Where suitable, the team may request clarification or arrange relevant professional support.',
          note: 'Submission does not guarantee a match, introduction or marriage outcome.',
        },
      ],
      cta: 'See the Complete Workflow',
    },
    profile: {
      eyebrow: 'A profile with real context',
      title: 'What the questionnaire helps you explain',
      text:
        'A strong matrimonial profile is more than biodata. It should help another family understand the candidate, home environment, expectations and practical compatibility factors.',
      groups: [
        {
          title: 'Candidate essentials',
          text: 'Age, marital status, height, location, nationality, language and other core information.',
          items: ['Identity and contact context', 'Residence and relocation', 'Marital background'],
        },
        {
          title: 'Education and career',
          text: 'Education, profession, employment, industry and income preference where the family chooses to disclose it.',
          items: ['Qualifications', 'Professional direction', 'Career after marriage expectations'],
        },
        {
          title: 'Family and values',
          text: 'Family structure, parents, siblings, religious practice, lifestyle and the environment in which the candidate lives.',
          items: ['Family background', 'Joint or nuclear preference', 'Values and lifestyle'],
        },
        {
          title: 'Partner preferences',
          text: 'Separate essential requirements from flexible preferences to support more realistic professional assessment.',
          items: ['Age and location range', 'Education and profession', 'Marriage timeline and priorities'],
        },
      ],
    },
    privacy: {
      eyebrow: 'Privacy in practical terms',
      title: 'Know what happens to sensitive information',
      text:
        'Trust improves when families can see the workflow instead of receiving a vague privacy promise. MBN separates profile information, photos and contact details within the process.',
      cards: [
        { title: 'Profile information', text: 'Collected for review and matrimonial assessment—not automatic public listing.' },
        { title: 'Photos', text: 'A visibility preference is saved with the submission for the review workflow.' },
        { title: 'Phone and WhatsApp', text: 'Contact information stays outside open profile browsing.' },
        { title: 'Professional access', text: 'Assignment and follow-up should remain purpose-limited and accountable.' },
      ],
      panelTitle: 'Example privacy status',
      panelReference: 'Reference # MBN-••••••',
      status: 'Under review',
      rows: [
        ['Public listing', 'Not enabled'],
        ['Photo preference', 'Blurred'],
        ['Contact details', 'Locked'],
        ['Current access', 'Review workflow'],
      ],
      panelFooter: 'Nothing is published automatically after submission.',
    },
    prepare: {
      eyebrow: 'Before you start',
      title: 'A little preparation makes the profile stronger',
      text: 'Discuss important answers with the candidate before opening the form, particularly when a family member is submitting on their behalf.',
      checklistTitle: 'Keep these details ready',
      checklist: [
        'Candidate’s correct date of birth, location and marital status',
        'Education, profession and current employment details',
        'A short and respectful family introduction',
        'Clear must-have and preferred partner requirements',
        'One or two suitable recent photographs',
        'Candidate awareness and permission to submit the information',
      ],
      responsibilityTitle: 'Your family remains responsible for',
      responsibilities: [
        'Providing accurate, current and consented information',
        'Independently verifying identity, education, employment and family claims',
        'Keeping communication respectful and marriage-focused',
        'Not sharing another person’s profile outside the intended process',
      ],
      note: 'MBN organises and supports the process; final decisions always remain with the candidate and family.',
    },
    faq: {
      eyebrow: 'Questions families usually ask',
      title: 'Begin with clear expectations',
      items: [
        {
          q: 'Will my profile appear publicly after submission?',
          a: 'No. A public submission enters a review-first workflow. Completing the form does not automatically place the profile in an open browsing or swipe feed.',
        },
        {
          q: 'Can a parent or sibling submit for the candidate?',
          a: 'Yes. The questionnaire allows a parent, sibling, guardian or another authorised family member to submit. The candidate should know about and consent to the information being shared.',
        },
        {
          q: 'Does submission guarantee matches or proposals?',
          a: 'No. Submission starts a review process. Follow-up depends on completeness, suitability, available professional support and genuinely relevant opportunities.',
        },
        {
          q: 'Can I choose how the candidate’s photos are handled?',
          a: 'The form records a photo visibility preference such as visible, blurred or hidden. The storage and access workflow should follow the platform’s privacy controls.',
        },
        {
          q: 'What should we verify before moving forward with a family?',
          a: 'Families should independently verify identity, marital status, education, employment, finances, family background and any other information important to the final decision.',
        },
      ],
    },
    final: {
      eyebrow: 'Ready when your family is',
      title: 'Begin with one thoughtful, private profile.',
      text: 'The guided questionnaire is designed to make detailed profile creation feel clear, respectful and manageable.',
      primary: 'Start Your Profile',
      secondary: 'Talk to the MBN Team',
    },
    footer: {
      text: 'A private, family-first matrimonial network for serious individuals, families and professional marriage bureaus.',
      explore: 'Explore',
      families: 'For Families',
      bureaus: 'For Bureaus',
      how: 'How It Works',
      company: 'Company',
      about: 'About Us',
      contact: 'Contact',
      login: 'Bureau Login',
      note: 'MBN Pakistan is designed for serious matrimonial use, not casual dating.',
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
      eyebrow: 'افراد، والدین اور خاندانوں کے لیے',
      titleStart: 'رشتہ تلاش کرنے کا زیادہ پُرسکون، باوقار اور',
      titleAccent: 'خاندانی طریقہ۔',
      text:
        'ایک رہنمائی پر مبنی سوالنامے کے ذریعے جامع ازدواجی پروفائل بنائیں، حساس معلومات کو جائزہ پر مبنی نظام میں محفوظ رکھیں اور تمام مراحل میں خاندان کی شمولیت برقرار رکھیں۔',
      primary: 'نجی پروفائل شروع کریں',
      secondary: 'مکمل طریقہ سمجھیں',
      note: 'صرف سنجیدہ ازدواجی معاملات کے لیے',
      points: ['کوئی پبلک swipe feed نہیں', 'خاندان کی زیرِ نگرانی submission', 'follow-up سے پہلے انسانی جائزہ'],
      cardTitle: 'نجی پروفائل کا سفر',
      cardStatus: 'آغاز کے لیے تیار',
      cardItems: [
        ['سوالنامہ', 'مرحلہ وار'],
        ['تصویر کی ترجیح', 'فیصلہ آپ کا'],
        ['رابطہ معلومات', 'محدود اور محفوظ'],
      ],
      cardFooter: 'پروفائل جمع کروانے سے وہ خودکار طور پر پبلک نہیں ہوتی۔',
    },
    trust: [
      { title: 'بنیادی طور پر نجی', text: 'جمع کروائی گئی پروفائل کسی کھلی پبلک browsing feed میں شامل نہیں ہوتی۔' },
      { title: 'خاندان کی شمولیت', text: 'والدین، بہن بھائی یا سرپرست امیدوار کے ساتھ پورے عمل میں شریک رہ سکتے ہیں۔' },
      { title: 'پہلے جائزہ', text: 'assignment یا professional follow-up سے پہلے معلومات کا جائزہ لیا جاتا ہے۔' },
      { title: 'معلومات پر کنٹرول', text: 'تصاویر اور رابطہ معلومات منظم workflow کا حصہ رہتی ہیں۔' },
    ],
    why: {
      eyebrow: 'خاندان رہنمائی پر مبنی عمل کیوں پسند کرتے ہیں',
      title: 'کم ہنگامہ، زیادہ وضاحت، رازداری اور خاندانی شمولیت۔',
      text:
        'ازدواجی فیصلے صرف تصویر اور swipe سے نہیں کیے جا سکتے۔ MBN تفصیلی معلومات، سنجیدہ جائزے اور باوقار رابطے کے اصول پر بنایا گیا ہے۔',
      cards: [
        {
          title: 'ایک جامع پروفائل',
          text: 'ذاتی، خاندانی، تعلیمی، پیشہ ورانہ اور شریکِ حیات کی ترجیحات منظم حصوں میں شامل کریں، بار بار مختلف پیغامات میں نہیں۔',
        },
        {
          title: 'امیدوار کی ترجیحات مرکزی حیثیت میں',
          text: 'واضح کریں کہ پروفائل کون جمع کر رہا ہے، تصاویر کیسے استعمال ہوں اور امیدوار و خاندان کے لیے کیا اہم ہے۔',
        },
        {
          title: 'پیشہ ورانہ معاونت',
          text: 'مناسب صورت میں جائزہ شدہ کیس متعلقہ میرج بیورو یا matchmaker کو follow-up کے لیے دیا جا سکتا ہے۔',
        },
        {
          title: 'زیادہ واضح ریکارڈ',
          text: 'نجی reference number اور منظم معلومات مستقبل کے رابطے کو منتشر chats اور documents سے بہتر بناتی ہیں۔',
        },
      ],
    },
    journey: {
      eyebrow: 'آپ کے خاندان کا سفر',
      title: 'پہلے جواب سے باوقار follow-up تک',
      text: 'ہر مرحلے کا واضح مقصد ہے۔ یہاں فرضی فوری matches یا غیر واضح compatibility percentages نہیں دکھائے جاتے۔',
      steps: [
        {
          title: 'رہنمائی پر مبنی سوالنامہ مکمل کریں',
          text: 'امیدوار، تعلیم، پیشہ، خاندانی پس منظر، طرزِ زندگی اور شریکِ حیات کی ترجیحات منظم حصوں میں درج کریں۔',
          note: 'فارم browser میں progress محفوظ کرتا ہے تاکہ mobile اور desktop دونوں پر مکمل کرنا آسان رہے۔',
        },
        {
          title: 'تصویر اور پرائیویسی کی ترجیحات منتخب کریں',
          text: 'مقررہ تصاویر upload کریں اور بتائیں کہ workflow میں وہ visible، blurred یا hidden رہیں۔',
          note: 'حساس معلومات کسی کھلی swipe-style directory کے لیے نہیں ہیں۔',
        },
        {
          title: 'جمع کروانے سے پہلے مکمل جائزہ لیں',
          text: 'آخری review screen پر تمام معلومات دیکھیں اور ضرورت کے مطابق کسی بھی حصے میں واپس جا کر درستگی کریں۔',
          note: 'درست اور مکمل معلومات بعد میں غیر موزوں follow-up کے امکانات کم کرتی ہیں۔',
        },
        {
          title: 'نجی reference number حاصل کریں',
          text: 'کامیاب submission کے بعد نظام MBN ٹیم سے آئندہ رابطے کے لیے ایک reference number فراہم کرتا ہے۔',
          note: 'اس reference کو نجی اور محفوظ رکھیں۔',
        },
        {
          title: 'انسانی جائزہ اور پیشہ ورانہ follow-up',
          text: 'معلومات کی تکمیل کا جائزہ لیا جاتا ہے۔ مناسب صورت میں مزید وضاحت یا متعلقہ professional support کے لیے رابطہ ہو سکتا ہے۔',
          note: 'پروفائل جمع کروانا match، تعارف یا شادی کی ضمانت نہیں ہے۔',
        },
      ],
      cta: 'مکمل workflow دیکھیں',
    },
    profile: {
      eyebrow: 'حقیقی پس منظر کے ساتھ پروفائل',
      title: 'سوالنامہ کن اہم پہلوؤں کو واضح کرتا ہے',
      text:
        'مضبوط ازدواجی پروفائل صرف biodata نہیں ہوتی۔ اس سے دوسرے خاندان کو امیدوار، گھر کے ماحول، توقعات اور عملی compatibility سمجھنے میں مدد ملنی چاہیے۔',
      groups: [
        {
          title: 'امیدوار کی بنیادی معلومات',
          text: 'عمر، ازدواجی حیثیت، قد، مقام، قومیت، زبان اور دوسری ضروری معلومات۔',
          items: ['شناخت اور رابطے کا پس منظر', 'رہائش اور relocation', 'ازدواجی پس منظر'],
        },
        {
          title: 'تعلیم اور پیشہ',
          text: 'تعلیم، پیشہ، ملازمت، صنعت اور آمدن کی معلومات، جہاں خاندان بتانا مناسب سمجھے۔',
          items: ['تعلیمی قابلیت', 'پیشہ ورانہ سمت', 'شادی کے بعد career کی توقعات'],
        },
        {
          title: 'خاندان اور اقدار',
          text: 'خاندانی ساخت، والدین، بہن بھائی، دینی رجحان، طرزِ زندگی اور گھر کا ماحول۔',
          items: ['خاندانی پس منظر', 'مشترکہ یا علیحدہ خاندان کی ترجیح', 'اقدار اور طرزِ زندگی'],
        },
        {
          title: 'شریکِ حیات کی ترجیحات',
          text: 'لازمی شرائط اور لچکدار ترجیحات الگ درج کریں تاکہ زیادہ حقیقت پسندانہ professional assessment ہو سکے۔',
          items: ['عمر اور مقام کی حد', 'تعلیم اور پیشہ', 'شادی کا متوقع وقت اور ترجیحات'],
        },
      ],
    },
    privacy: {
      eyebrow: 'عملی پرائیویسی',
      title: 'حساس معلومات کے استعمال کو واضح طور پر سمجھیں',
      text:
        'اعتماد تب بڑھتا ہے جب خاندان کو صرف عمومی وعدہ نہیں بلکہ پورا workflow نظر آئے۔ MBN پروفائل معلومات، تصاویر اور رابطہ تفصیلات کو نظام میں الگ انداز سے سنبھالتا ہے۔',
      cards: [
        { title: 'پروفائل معلومات', text: 'جائزے اور ازدواجی assessment کے لیے لی جاتی ہیں، خودکار پبلک listing کے لیے نہیں۔' },
        { title: 'تصاویر', text: 'منتخب visibility preference submission کے ساتھ محفوظ ہوتی ہے۔' },
        { title: 'فون اور WhatsApp', text: 'رابطہ معلومات کھلی profile browsing سے الگ رکھی جاتی ہیں۔' },
        { title: 'پیشہ ورانہ رسائی', text: 'assignment اور follow-up محدود مقصد اور accountability کے ساتھ ہونا چاہیے۔' },
      ],
      panelTitle: 'پرائیویسی status کی مثال',
      panelReference: 'Reference # MBN-••••••',
      status: 'زیرِ جائزہ',
      rows: [
        ['پبلک listing', 'فعال نہیں'],
        ['تصویر کی ترجیح', 'دھندلی'],
        ['رابطہ معلومات', 'محفوظ'],
        ['موجودہ رسائی', 'Review workflow'],
      ],
      panelFooter: 'پروفائل جمع کروانے کے بعد کچھ بھی خودکار طور پر پبلک نہیں ہوتا۔',
    },
    prepare: {
      eyebrow: 'شروع کرنے سے پہلے',
      title: 'تھوڑی سی تیاری پروفائل کو زیادہ مضبوط بناتی ہے',
      text: 'خصوصاً جب خاندان کا کوئی فرد امیدوار کی طرف سے فارم بھر رہا ہو تو اہم جوابات پہلے امیدوار سے مشورے کے بعد طے کریں۔',
      checklistTitle: 'یہ معلومات تیار رکھیں',
      checklist: [
        'امیدوار کی درست تاریخِ پیدائش، مقام اور ازدواجی حیثیت',
        'تعلیم، پیشہ اور موجودہ ملازمت کی معلومات',
        'مختصر اور باوقار خاندانی تعارف',
        'واضح لازمی شرائط اور ترجیحی requirements',
        'ایک یا دو مناسب حالیہ تصاویر',
        'امیدوار کی آگاہی اور معلومات جمع کروانے کی اجازت',
      ],
      responsibilityTitle: 'خاندان کی ذمہ داریاں',
      responsibilities: [
        'درست، موجودہ اور رضامندی سے حاصل کردہ معلومات فراہم کرنا',
        'شناخت، تعلیم، ملازمت اور خاندانی دعوؤں کی آزادانہ تصدیق کرنا',
        'رابطے کو باوقار اور صرف شادی کے مقصد تک محدود رکھنا',
        'کسی دوسرے شخص کی پروفائل کو مطلوبہ workflow سے باہر share نہ کرنا',
      ],
      note: 'MBN عمل کو منظم اور support کرتا ہے؛ حتمی فیصلے ہمیشہ امیدوار اور خاندان کے پاس رہتے ہیں۔',
    },
    faq: {
      eyebrow: 'خاندانوں کے عام سوالات',
      title: 'واضح توقعات کے ساتھ آغاز کریں',
      items: [
        {
          q: 'کیا submission کے بعد میری پروفائل پبلک ہو جائے گی؟',
          a: 'نہیں۔ عوامی submission پہلے review workflow میں جاتی ہے۔ فارم مکمل کرنے سے پروفائل کسی کھلی browsing یا swipe feed میں خودکار طور پر شامل نہیں ہوتی۔',
        },
        {
          q: 'کیا والدین یا بہن بھائی امیدوار کی طرف سے پروفائل جمع کر سکتے ہیں؟',
          a: 'جی ہاں۔ سوالنامہ والدین، بہن بھائی، سرپرست یا مجاز خاندانی فرد کو پروفائل جمع کروانے کی اجازت دیتا ہے۔ امیدوار کو معلومات share کیے جانے کا علم اور رضامندی ہونی چاہیے۔',
        },
        {
          q: 'کیا پروفائل جمع کروانا matches یا proposals کی ضمانت ہے؟',
          a: 'نہیں۔ submission سے جائزے کا عمل شروع ہوتا ہے۔ follow-up معلومات کی تکمیل، suitability، دستیاب professional support اور حقیقی طور پر متعلقہ مواقع پر منحصر ہے۔',
        },
        {
          q: 'کیا ہم تصاویر کے استعمال کا طریقہ منتخب کر سکتے ہیں؟',
          a: 'فارم visible، blurred یا hidden جیسی photo visibility preference محفوظ کرتا ہے۔ storage اور access workflow کو platform privacy controls کے مطابق ہونا چاہیے۔',
        },
        {
          q: 'کسی خاندان کے ساتھ آگے بڑھنے سے پہلے کن معلومات کی تصدیق ضروری ہے؟',
          a: 'شناخت، ازدواجی حیثیت، تعلیم، ملازمت، مالی حالات، خاندانی پس منظر اور حتمی فیصلے کے لیے اہم دوسری معلومات کی آزادانہ تصدیق کریں۔',
        },
      ],
    },
    final: {
      eyebrow: 'جب آپ کا خاندان تیار ہو',
      title: 'ایک جامع اور نجی پروفائل سے آغاز کریں۔',
      text: 'رہنمائی پر مبنی سوالنامہ تفصیلی پروفائل سازی کو واضح، باوقار اور آسان بنانے کے لیے تیار کیا گیا ہے۔',
      primary: 'اپنی پروفائل شروع کریں',
      secondary: 'MBN ٹیم سے رابطہ کریں',
    },
    footer: {
      text: 'سنجیدہ افراد، خاندانوں اور پیشہ ور میرج بیوروز کے لیے نجی اور family-first matrimonial network۔',
      explore: 'مزید دیکھیں',
      families: 'خاندانوں کے لیے',
      bureaus: 'بیوروز کے لیے',
      how: 'یہ کیسے کام کرتا ہے',
      company: 'ادارہ',
      about: 'ہمارے بارے میں',
      contact: 'رابطہ',
      login: 'بیورو لاگ اِن',
      note: 'MBN Pakistan سنجیدہ ازدواجی استعمال کے لیے ہے، casual dating کے لیے نہیں۔',
      rights: 'تمام حقوق محفوظ ہیں۔',
    },
  },
} as const;

const trustIcons = [Lock, Users, ClipboardCheck, EyeOff];
const whyIcons = [FileCheck2, UserCheck, HeartHandshake, BadgeCheck];
const profileIcons = [UserCheck, Briefcase, Home, Search];
const privacyIcons = [FileCheck2, Camera, Lock, ShieldCheck];

export default function ForFamiliesPage() {
  const { language, setLanguage, isUrdu } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const t = content[language];
  const arrowClass = isUrdu ? 'rotate-180' : '';

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
      { threshold: 0.12, rootMargin: '0px 0px -44px' },
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

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen overflow-x-hidden bg-[#fbfcf8] text-slate-950">
      <GlobalStyles />
      <PublicHeader
        active="families"
        language={language}
        setLanguage={setLanguage}
        isUrdu={isUrdu}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        nav={t.nav}
        subtitle={t.subtitle}
      />

      <main className="pt-[76px]">
        <section className="relative overflow-hidden border-b border-emerald-950/[0.06]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(32,138,84,0.13),transparent_32%),radial-gradient(circle_at_88%_22%,rgba(211,174,108,0.18),transparent_30%),linear-gradient(180deg,#fbfcf8_0%,#f5f8f1_100%)]" />
          <div className="pointer-events-none absolute -left-24 top-48 h-72 w-72 rounded-full border border-[#0a6a3f]/10" />
          <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full border border-[#b8975f]/15" />

          <div className="relative mx-auto grid min-h-[720px] max-w-[1440px] items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-24">
            <div className="max-w-3xl">
              <div className="mbn-hero-rise inline-flex items-center gap-2 rounded-full border border-[#0a6a3f]/10 bg-white/85 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f] shadow-sm backdrop-blur">
                <HeartHandshake className="h-3.5 w-3.5" />
                {t.hero.eyebrow}
              </div>

              <h1 className="mbn-hero-rise-2 mt-7 max-w-4xl font-heading text-[2.75rem] font-bold leading-[1.02] tracking-[-0.035em] text-[#073b24] sm:text-6xl lg:text-[4.65rem]">
                {t.hero.titleStart}{' '}
                <span className="relative inline-block text-[#0a6a3f]">
                  {t.hero.titleAccent}
                  <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#d9b978]/28" />
                </span>
              </h1>

              <p className="mbn-hero-rise-3 mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                {t.hero.text}
              </p>

              <div className="mbn-hero-rise-3 mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/submit-profile" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#0a6a3f] px-7 py-4 text-sm font-extrabold text-white shadow-[0_18px_40px_rgba(10,106,63,0.22)] transition hover:-translate-y-0.5 hover:bg-[#075632]">
                  {t.hero.primary}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${arrowClass}`} />
                </Link>
                <Link href="/how-it-works" className="inline-flex items-center justify-center gap-3 rounded-full border border-[#0a6a3f]/18 bg-white/85 px-7 py-4 text-sm font-extrabold text-[#073b24] shadow-sm transition hover:-translate-y-0.5 hover:border-[#0a6a3f]/35 hover:bg-white">
                  {t.hero.secondary}
                </Link>
              </div>

              <div className="mbn-hero-rise-3 mt-8 flex flex-wrap gap-3">
                {t.hero.points.map((point) => (
                  <span key={point} className="inline-flex items-center gap-2 rounded-full border border-emerald-950/[0.07] bg-white/70 px-3.5 py-2 text-[11px] font-bold text-slate-700 backdrop-blur">
                    <Check className="h-3.5 w-3.5 text-[#0a6a3f]" strokeWidth={3} />
                    {point}
                  </span>
                ))}
              </div>

              <div className="mbn-hero-rise-3 mt-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                <ShieldCheck className="h-4 w-4 text-[#0a6a3f]" />
                {t.hero.note}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[650px] lg:mx-0">
              <div className="mbn-float-a absolute -left-3 top-12 z-20 hidden rounded-2xl border border-white/70 bg-white/92 p-4 shadow-[0_18px_55px_rgba(5,61,37,0.16)] backdrop-blur sm:block lg:-left-12">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ec] text-[#0a6a3f]"><Lock className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs font-extrabold text-[#073b24]">{t.trust[0].title}</p>
                    <p className="mt-1 max-w-[190px] text-[10px] leading-4 text-slate-500">{t.trust[0].text}</p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[2.8rem] border border-white/80 bg-white p-3 shadow-[0_35px_95px_rgba(5,61,37,0.16)]">
                <div className="relative min-h-[520px] overflow-hidden rounded-[2.25rem] bg-[#f4eadc]">
                  <Image
                    src="/mbn-family-hero.png"
                    alt="Pakistani family discussing a matrimonial profile"
                    fill
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover object-[68%_42%]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#052f20]/75 via-transparent to-transparent" />

                  <div className="absolute inset-x-4 bottom-4 rounded-[1.75rem] border border-white/20 bg-[#062f20]/92 p-5 text-white shadow-2xl backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#bce5c8]">
                          <ClipboardCheck className="h-3.5 w-3.5" />
                          {t.hero.cardTitle}
                        </div>
                        <p className="mt-2 font-heading text-xl font-bold">{t.hero.cardStatus}</p>
                      </div>
                      <span className="rounded-full bg-[#bce5c8] px-3 py-1.5 text-[10px] font-extrabold text-[#073b24]">01</span>
                    </div>

                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      {t.hero.cardItems.map(([label, value]) => (
                        <div key={label} className="rounded-2xl bg-white/[0.07] px-3.5 py-3">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">{label}</p>
                          <p className="mt-1 text-[11px] font-extrabold text-white/90">{value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-[10px] leading-5 text-white/55">{t.hero.cardFooter}</p>
                  </div>
                </div>
              </div>

              <div className="mbn-float-b absolute -bottom-5 right-3 z-20 rounded-2xl border border-[#ead8b9] bg-[#fffaf0] p-4 shadow-[0_18px_55px_rgba(94,69,34,0.16)] sm:right-8 lg:-right-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0a6a3f] shadow-sm"><Users className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs font-extrabold text-[#073b24]">{t.trust[1].title}</p>
                    <p className="mt-1 max-w-[190px] text-[10px] leading-4 text-slate-500">{t.trust[1].text}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-3 max-w-[1360px] px-4 sm:px-6 lg:px-10">
          <div data-reveal className="mbn-reveal grid overflow-hidden rounded-[2rem] border border-emerald-950/[0.07] bg-white shadow-[0_20px_65px_rgba(5,61,37,0.08)] sm:grid-cols-2 lg:grid-cols-4">
            {t.trust.map((item, index) => {
              const Icon = trustIcons[index];
              return (
                <div key={item.title} className="group border-b border-emerald-950/[0.06] p-6 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#edf7f0] text-[#0a6a3f] transition group-hover:-translate-y-1 group-hover:bg-[#0a6a3f] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-sm font-extrabold text-[#073b24]">{item.title}</h2>
                      <p className="mt-2 text-xs leading-5 text-slate-500">{item.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <SectionHeading eyebrow={t.why.eyebrow} title={t.why.title} text={t.why.text} />
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {t.why.cards.map((card, index) => {
              const Icon = whyIcons[index];
              return (
                <div key={card.title} data-reveal className={`mbn-reveal mbn-reveal-delay-${Math.min(index, 3)} group relative overflow-hidden rounded-[2rem] border border-emerald-950/[0.07] bg-white p-7 shadow-[0_18px_55px_rgba(5,61,37,0.06)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(5,61,37,0.11)]`}>
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#e9f5ec] transition duration-500 group-hover:scale-125" />
                  <div className="relative">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf7f0] text-[#0a6a3f] transition group-hover:bg-[#0a6a3f] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-7 font-heading text-2xl font-bold leading-tight text-[#073b24]">{card.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{card.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-y border-emerald-950/[0.06] bg-white">
          <div className="mx-auto grid max-w-[1440px] gap-16 px-4 py-24 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-10 lg:py-32">
            <div data-reveal className="mbn-reveal lg:sticky lg:top-28 lg:self-start">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#edf7f0] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f]">
                <Sparkles className="h-3.5 w-3.5" />
                {t.journey.eyebrow}
              </div>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[#073b24] sm:text-5xl">{t.journey.title}</h2>
              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{t.journey.text}</p>
              <Link href="/how-it-works" className="group mt-8 inline-flex items-center gap-3 text-sm font-extrabold text-[#0a6a3f]">
                {t.journey.cta}
                <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${arrowClass}`} />
              </Link>
            </div>

            <div className="relative">
              <div className={`absolute bottom-10 top-10 w-px bg-gradient-to-b from-[#0a6a3f]/10 via-[#0a6a3f]/35 to-[#0a6a3f]/10 ${isUrdu ? 'right-6 sm:right-8' : 'left-6 sm:left-8'}`} />
              <div className="space-y-5">
                {t.journey.steps.map((step, index) => (
                  <div key={step.title} data-reveal className={`mbn-reveal mbn-reveal-delay-${Math.min(index, 3)} relative flex gap-5 sm:gap-7`}>
                    <span className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#0a6a3f] text-xs font-black text-white shadow-[0_10px_28px_rgba(10,106,63,0.20)] sm:h-16 sm:w-16 sm:text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 rounded-[2rem] border border-emerald-950/[0.07] bg-[#fbfcf8] p-6 transition duration-300 hover:border-[#0a6a3f]/20 hover:bg-white hover:shadow-[0_18px_55px_rgba(5,61,37,0.07)] sm:p-7">
                      <h3 className="font-heading text-xl font-bold text-[#073b24] sm:text-2xl">{step.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p>
                      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-white px-4 py-3 text-xs leading-5 text-slate-500 ring-1 ring-emerald-950/[0.05]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0a6a3f]" />
                        <span>{step.note}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <SectionHeading eyebrow={t.profile.eyebrow} title={t.profile.title} text={t.profile.text} />
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {t.profile.groups.map((group, index) => {
              const Icon = profileIcons[index];
              return (
                <div key={group.title} data-reveal className={`mbn-reveal mbn-reveal-delay-${Math.min(index, 3)} group rounded-[2.2rem] border border-emerald-950/[0.07] bg-white p-7 shadow-[0_18px_55px_rgba(5,61,37,0.055)] transition duration-500 hover:-translate-y-1 sm:p-8`}>
                  <div className="flex items-start gap-5">
                    <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#edf7f0] text-[#0a6a3f] transition group-hover:bg-[#0a6a3f] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-[#073b24]">{group.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{group.text}</p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {group.items.map((item) => (
                      <div key={item} className="flex items-start gap-2 rounded-2xl bg-[#f7faf6] px-4 py-3 text-xs font-bold leading-5 text-slate-600">
                        <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#0a6a3f]" strokeWidth={3} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#063b27] text-white">
          <div className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#168151]/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[480px] w-[480px] rounded-full bg-[#d1ad6e]/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-[1440px] gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-10 lg:py-32">
            <div>
              <div data-reveal className="mbn-reveal inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#bce5c8]">
                <Lock className="h-3.5 w-3.5" />
                {t.privacy.eyebrow}
              </div>
              <h2 data-reveal className="mbn-reveal mt-6 max-w-3xl font-heading text-4xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl">{t.privacy.title}</h2>
              <p data-reveal className="mbn-reveal mt-5 max-w-2xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">{t.privacy.text}</p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {t.privacy.cards.map((card, index) => {
                  const Icon = privacyIcons[index];
                  return (
                    <div key={card.title} data-reveal className={`mbn-reveal mbn-reveal-delay-${Math.min(index, 3)} rounded-[1.7rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur`}>
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#bce5c8] text-[#073b24]"><Icon className="h-5 w-5" /></span>
                      <h3 className="mt-5 font-heading text-lg font-bold">{card.title}</h3>
                      <p className="mt-2 text-xs leading-6 text-white/58">{card.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div data-reveal className="mbn-reveal self-center">
              <div className="relative rounded-[2.6rem] border border-white/12 bg-white/[0.07] p-3 shadow-[0_35px_90px_rgba(0,0,0,0.20)] backdrop-blur-xl">
                <div className="rounded-[2.1rem] bg-[#f8faf7] p-6 text-slate-950 sm:p-8">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f]">{t.privacy.panelTitle}</p>
                      <h3 className="mt-2 font-heading text-2xl font-bold text-[#073b24]">{t.privacy.panelReference}</h3>
                    </div>
                    <span className="rounded-full bg-[#fff1d5] px-3 py-2 text-[10px] font-extrabold text-[#8a641e]">{t.privacy.status}</span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {t.privacy.rows.map(([label, value], index) => (
                      <StatusRow key={label} icon={index === 0 ? <EyeOff className="h-4 w-4" /> : index === 1 ? <Camera className="h-4 w-4" /> : index === 2 ? <Lock className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />} label={label} value={value} />
                    ))}
                  </div>

                  <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#edf7f0] p-4 text-xs leading-6 text-[#315c46]">
                    <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0a6a3f]" />
                    {t.privacy.panelFooter}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-2">
            <div data-reveal className="mbn-reveal overflow-hidden rounded-[2.5rem] border border-[#eadbc4] bg-gradient-to-br from-[#fbf3e7] to-[#fffdf9] p-7 shadow-[0_24px_70px_rgba(94,69,34,0.10)] sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f] shadow-sm">
                <Clock3 className="h-3.5 w-3.5" />
                {t.prepare.eyebrow}
              </div>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] text-[#073b24]">{t.prepare.title}</h2>
              <p className="mt-5 text-sm leading-7 text-slate-600">{t.prepare.text}</p>
              <h3 className="mt-8 text-xs font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f]">{t.prepare.checklistTitle}</h3>
              <div className="mt-5 grid gap-3">
                {t.prepare.checklist.map((item) => <ChecklistRow key={item}>{item}</ChecklistRow>)}
              </div>
            </div>

            <div data-reveal className="mbn-reveal mbn-reveal-delay-1 relative overflow-hidden rounded-[2.5rem] bg-[#073b24] p-7 text-white shadow-[0_24px_70px_rgba(5,61,37,0.18)] sm:p-10">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#168151]/25 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#bce5c8]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t.prepare.responsibilityTitle}
                </div>
                <div className="mt-8 grid gap-4">
                  {t.prepare.responsibilities.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-4 text-sm leading-7 text-white/72">
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#bce5c8]" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#bce5c8] p-5 text-sm leading-7 text-[#073b24]">
                  <HeartHandshake className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span className="font-semibold">{t.prepare.note}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-950/[0.06] bg-white">
          <div className="mx-auto max-w-[1100px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
            <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
            <div data-reveal className="mbn-reveal mt-12 overflow-hidden rounded-[2.2rem] border border-emerald-950/[0.07] bg-[#fbfcf8] p-2 shadow-[0_20px_65px_rgba(5,61,37,0.07)]">
              {t.faq.items.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.q} className={`rounded-[1.7rem] transition ${isOpen ? 'bg-white shadow-sm' : ''}`}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`family-faq-${index}`}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-start sm:px-7 sm:py-6"
                    >
                      <span className="flex items-start gap-4">
                        <span className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-[10px] font-black ${isOpen ? 'bg-[#0a6a3f] text-white' : 'bg-[#edf7f0] text-[#0a6a3f]'}`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-heading text-base font-bold leading-6 text-[#073b24] sm:text-lg">{item.q}</span>
                      </span>
                      <ChevronDown className={`h-5 w-5 flex-shrink-0 text-[#0a6a3f] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div id={`family-faq-${index}`} role="region" className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="px-5 pb-6 text-sm leading-7 text-slate-600 sm:px-[5.25rem] sm:pb-7">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div data-reveal className="mbn-reveal mbn-shimmer relative mx-auto max-w-[1320px] overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#063b27] via-[#0a6a3f] to-[#168151] px-6 py-14 text-center text-white shadow-[0_32px_90px_rgba(5,61,37,0.23)] sm:px-10 sm:py-20">
            <div className="pointer-events-none absolute -left-28 -top-36 h-80 w-80 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full border border-white/10" />
            <div className="relative mx-auto max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#d4eedb]">
                <Sparkles className="h-3.5 w-3.5" />
                {t.final.eyebrow}
              </div>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">{t.final.title}</h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/68 sm:text-base sm:leading-8">{t.final.text}</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/submit-profile" className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-[#073b24] transition hover:-translate-y-0.5 hover:bg-[#edf7f0]">
                  {t.final.primary}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${arrowClass}`} />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.07] px-7 py-4 text-sm font-extrabold text-white transition hover:bg-white/[0.12]">
                  {t.final.secondary}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter isUrdu={isUrdu} subtitle={t.subtitle} footer={t.footer} />

      <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden">
        <Link href="/submit-profile" className="mbn-shimmer flex items-center justify-center gap-2 rounded-full bg-[#0a6a3f] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_40px_rgba(4,47,32,0.35)]">
          {t.nav.submit}
          <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
        </Link>
      </div>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      .mbn-reveal {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 760ms cubic-bezier(0.22, 1, 0.36, 1), transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .mbn-reveal.is-visible { opacity: 1; transform: translateY(0); }
      .mbn-reveal-delay-0 { transition-delay: 0ms; }
      .mbn-reveal-delay-1 { transition-delay: 90ms; }
      .mbn-reveal-delay-2 { transition-delay: 180ms; }
      .mbn-reveal-delay-3 { transition-delay: 270ms; }
      .mbn-hero-rise { animation: mbnHeroRise 820ms cubic-bezier(0.22, 1, 0.36, 1) both; }
      .mbn-hero-rise-2 { animation: mbnHeroRise 820ms 120ms cubic-bezier(0.22, 1, 0.36, 1) both; }
      .mbn-hero-rise-3 { animation: mbnHeroRise 820ms 240ms cubic-bezier(0.22, 1, 0.36, 1) both; }
      .mbn-float-a { animation: mbnFloatA 5.6s ease-in-out infinite; }
      .mbn-float-b { animation: mbnFloatB 6.4s ease-in-out infinite; }
      .mbn-shimmer { position: relative; overflow: hidden; }
      .mbn-shimmer::after {
        content: '';
        position: absolute;
        inset: 0;
        transform: translateX(-120%);
        background: linear-gradient(100deg, transparent 35%, rgba(255,255,255,.25) 50%, transparent 65%);
        animation: mbnShimmer 5.5s ease-in-out infinite;
        pointer-events: none;
      }
      @keyframes mbnHeroRise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes mbnFloatA { 0%,100% { transform: translate3d(0,0,0) rotate(-1deg); } 50% { transform: translate3d(0,-10px,0) rotate(1deg); } }
      @keyframes mbnFloatB { 0%,100% { transform: translate3d(0,0,0) rotate(1deg); } 50% { transform: translate3d(0,9px,0) rotate(-1deg); } }
      @keyframes mbnShimmer { 0%,55% { transform: translateX(-120%); } 82%,100% { transform: translateX(120%); } }
      @media (prefers-reduced-motion: reduce) {
        .mbn-reveal,.mbn-hero-rise,.mbn-hero-rise-2,.mbn-hero-rise-3,.mbn-float-a,.mbn-float-b,.mbn-shimmer::after {
          animation: none !important;
          transition: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  );
}

function PublicHeader({
  active,
  language,
  setLanguage,
  isUrdu,
  mobileMenuOpen,
  setMobileMenuOpen,
  nav,
  subtitle,
}: {
  active: 'families' | 'bureaus';
  language: Language;
  setLanguage: (value: Language) => void;
  isUrdu: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  nav: NavContent;
  subtitle: string;
}) {
  const items = [
    [nav.home, '/'],
    [nav.how, '/how-it-works'],
    [nav.families, '/for-families'],
    [nav.bureaus, '/for-bureaus'],
    [nav.about, '/about'],
    [nav.contact, '/contact'],
  ] as const;

  return (
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
          {items.map(([label, href]) => {
            const selected = (active === 'families' && href === '/for-families') || (active === 'bureaus' && href === '/for-bureaus');
            return <Link key={href} href={href} className={selected ? 'text-[#0a6a3f]' : 'transition hover:text-[#0a6a3f]'}>{label}</Link>;
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle language={language} setLanguage={setLanguage} />
          <Link href="/login" className="hidden rounded-full border border-[#0a6a3f]/18 bg-white px-5 py-2.5 text-xs font-extrabold text-[#073b24] transition hover:border-[#0a6a3f]/35 hover:bg-[#edf7f0] lg:inline-flex">{nav.login}</Link>
          <Link href="/submit-profile" className="hidden rounded-full bg-[#0a6a3f] px-5 py-2.5 text-xs font-extrabold text-white shadow-[0_10px_28px_rgba(10,106,63,0.18)] transition hover:bg-[#075632] sm:inline-flex">{nav.submit}</Link>
          <button type="button" onClick={() => setMobileMenuOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-950/10 bg-white text-[#073b24] xl:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
        </div>
      </div>

      <div className={`fixed inset-0 z-[60] transition xl:hidden ${mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <button type="button" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-[#031b12]/45 backdrop-blur-sm" />
        <div className={`absolute inset-y-0 w-[min(88vw,380px)] bg-[#fbfcf8] p-5 shadow-2xl transition-transform duration-300 ${isUrdu ? 'left-0' : 'right-0'} ${mobileMenuOpen ? 'translate-x-0' : isUrdu ? '-translate-x-full' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/mbn-logo.png" alt="MBN Pakistan" width={42} height={42} className="rounded-xl bg-white p-1 shadow-sm" />
              <div><p className="font-heading font-bold text-[#073b24]">MBN Pakistan</p><p className="text-[10px] text-slate-500">{subtitle}</p></div>
            </div>
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#073b24] shadow-sm"><X className="h-5 w-5" /></button>
          </div>
          <nav className="mt-8 grid gap-2">
            {items.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-4 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-[#edf7f0] hover:text-[#0a6a3f]">{label}</Link>
            ))}
          </nav>
          <div className="mt-6 grid gap-3 border-t border-emerald-950/[0.07] pt-6">
            <Link href="/submit-profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center rounded-full bg-[#0a6a3f] px-5 py-3.5 text-sm font-extrabold text-white">{nav.submit}</Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center rounded-full border border-[#0a6a3f]/18 bg-white px-5 py-3.5 text-sm font-extrabold text-[#073b24]">{nav.login}</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div data-reveal className="mbn-reveal mx-auto max-w-4xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-[#edf7f0] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f]">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[#073b24] sm:text-5xl lg:text-[3.5rem]">{title}</h2>
      {text && <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{text}</p>}
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

function ChecklistRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white/80 px-4 py-3.5 text-sm leading-6 text-slate-700 shadow-sm">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#e3f3e8] text-[#0a6a3f]"><Check className="h-3 w-3" strokeWidth={3} /></span>
      {children}
    </div>
  );
}

function PublicFooter({ isUrdu, subtitle, footer }: { isUrdu: boolean; subtitle: string; footer: FooterContent }) {
  return (
    <footer dir={isUrdu ? 'rtl' : 'ltr'} className="bg-[#052f20] pb-24 text-white sm:pb-0">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.6fr_0.7fr_0.7fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1"><Image src="/mbn-logo.png" alt="MBN Pakistan" width={46} height={46} className="h-full w-full object-contain" /></span>
              <div><p className="font-heading text-lg font-bold">MBN Pakistan</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a9d6b6]">{subtitle}</p></div>
            </div>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/58">{footer.text}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold text-white/65"><HeartHandshake className="h-4 w-4 text-[#bce5c8]" />{footer.note}</div>
          </div>
          <FooterLinks title={footer.explore} links={[[footer.families, '/for-families'], [footer.bureaus, '/for-bureaus'], [footer.how, '/how-it-works']]} />
          <FooterLinks title={footer.company} links={[[footer.about, '/about'], [footer.contact, '/contact'], [footer.login, '/login']]} />
        </div>
        <div className="flex flex-col gap-4 pt-6 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MBN Pakistan. {footer.rights}</p>
          <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-[#9fd1ad]" /><span>Private • Family-first • Professional</span></div>
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
        {links.map(([label, href]) => <Link key={href} href={href} className="w-fit transition hover:text-white">{label}</Link>)}
      </div>
    </div>
  );
}
