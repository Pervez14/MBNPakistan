'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Database,
  Eye,
  FileCheck2,
  FileText,
  History,
  LayoutDashboard,
  Lock,
  Menu,
  MessageCircle,
  Network,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Upload,
  UserCheck,
  UserPlus,
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
      eyebrow: 'For professional marriage bureaus',
      titleStart: 'Turn your matchmaking experience into a',
      titleAccent: 'structured digital workflow.',
      text:
        'Move beyond scattered spreadsheets, biodata files and WhatsApp threads. MBN gives approved bureaus one professional workspace for profile creation, search, assignments and follow-up records.',
      primary: 'Apply to Join MBN',
      secondary: 'Open Bureau Login',
      note: 'Access is considered after application review',
      points: ['Structured profiles', 'Searchable information', 'Recorded follow-up'],
      dashboardTitle: 'MBN Bureau Workspace',
      dashboardStatus: 'Professional workflow',
      dashboardRows: [
        ['Profile intake', 'Guided'],
        ['Network search', 'Organised'],
        ['Assigned cases', 'Trackable'],
      ],
      dashboardFooter: 'Your judgement stays central. The platform improves the system around it.',
    },
    trust: [
      { title: 'Approval-based access', text: 'Bureau applications and professional details are reviewed before access is considered.' },
      { title: 'Structured profile data', text: 'Bride and groom information is captured in consistent searchable fields.' },
      { title: 'Purpose-limited contact', text: 'Contact access remains separate from open profile information and can be recorded.' },
      { title: 'Professional accountability', text: 'Assignments, notes and follow-ups can stay connected to each case.' },
    ],
    problem: {
      eyebrow: 'Built around real bureau work',
      title: 'Your expertise deserves a better operating system',
      text:
        'Experienced matchmakers already understand families and compatibility. The problem is often the fragmented system around that work. MBN is designed to organise the process without replacing professional judgement.',
      oldTitle: 'The scattered way',
      oldItems: [
        'Profiles buried across WhatsApp chats',
        'Different biodata formats and missing fields',
        'Repeated manual searching through spreadsheets',
        'Follow-up history dependent on memory',
        'Contact sharing with little accountability',
      ],
      newTitle: 'The MBN workflow',
      newItems: [
        'One consistent profile questionnaire',
        'Searchable candidate and preference information',
        'Assigned profiles and case notes in one place',
        'Clearer contact-view and follow-up records',
        'A professional network beyond one local list',
      ],
    },
    capabilities: {
      eyebrow: 'One workspace, essential bureau workflows',
      title: 'Designed for the work you do every day',
      text:
        'The dashboard supports the operational side of matchmaking so your time can remain focused on assessment, communication and family coordination.',
      cards: [
        {
          title: 'Premium profile intake',
          text: 'Add profiles through the same section-by-section questionnaire used across MBN, with consistent personal, family, career and preference fields.',
        },
        {
          title: 'Organised profile library',
          text: 'Keep the bureau’s own bride and groom profiles in one structured workspace instead of disconnected files and messages.',
        },
        {
          title: 'Relevant profile search',
          text: 'Use available filters such as gender, age, city, education, profession and keywords to identify potentially relevant profiles.',
        },
        {
          title: 'Assigned public cases',
          text: 'Work on reviewed profiles assigned through the MBN process and keep their status connected to the relevant case.',
        },
        {
          title: 'Contact accountability',
          text: 'Keep phone and WhatsApp information separate from general profile browsing while contact-view activity can be logged.',
        },
        {
          title: 'Follow-up history',
          text: 'Record notes, work status and next actions so important progress is not lost across staff members or conversations.',
        },
      ],
    },
    workflow: {
      eyebrow: 'From application to daily operations',
      title: 'A professional journey with clear access stages',
      text: 'Submitting an application does not create immediate dashboard access. The bureau first provides verification information for review.',
      steps: [
        {
          title: 'Complete the bureau questionnaire',
          text: 'Provide applicant identity, bureau background, service reach, professional practices, references and relevant online presence.',
          note: 'The form is divided into focused sections and saves draft progress in the browser.',
        },
        {
          title: 'Upload private verification documents',
          text: 'Submit identity document images and, where available, business proof, office evidence, business card or letterhead.',
          note: 'Verification documents are intended for private administrative review, not public profile display.',
        },
        {
          title: 'Application enters review',
          text: 'MBN reviews the submitted information and may request clarification, additional evidence or a professional discussion.',
          note: 'Approval is discretionary and access should only be activated after the review is complete.',
        },
        {
          title: 'Receive account activation instructions',
          text: 'An approved bureau can be invited to activate its account and open the professional dashboard.',
          note: 'Application and login are separate stages so unapproved users do not receive misleading access expectations.',
        },
        {
          title: 'Create, search and manage profiles',
          text: 'Use structured forms, available filters and organised profile views for the bureau’s day-to-day work.',
          note: 'Search results support professional judgement; they do not replace verification or family consent.',
        },
        {
          title: 'Record responsible follow-up',
          text: 'Manage assignments, notes, work status and next actions while respecting privacy and purpose-limited use of information.',
          note: 'Final suitability and marriage decisions always remain with candidates and families.',
        },
      ],
      apply: 'Start Bureau Application',
    },
    dashboard: {
      eyebrow: 'A closer look at the workspace',
      title: 'Structure the full profile lifecycle',
      text:
        'A professional bureau needs more than a contact directory. MBN connects profile creation, discovery and case activity so the bureau can understand what happened and what should happen next.',
      modules: [
        {
          title: 'Profile management',
          text: 'Add, review, edit and organise the bureau’s own profiles using consistent information fields.',
          items: ['Guided profile form', 'Candidate and family context', 'Photo preference and notes'],
        },
        {
          title: 'Search and assessment',
          text: 'Narrow the available information before applying the matchmaker’s own experience and family knowledge.',
          items: ['Practical filters', 'Keyword search', 'Profile detail review'],
        },
        {
          title: 'Case workflow',
          text: 'Keep assigned profiles, contact activity and follow-up information connected to the case.',
          items: ['Assignment status', 'Internal notes', 'Next follow-up action'],
        },
      ],
      mockTitle: 'Case workflow snapshot',
      mockStatus: 'In progress',
      mockRows: [
        ['Profile information', 'Reviewed'],
        ['Potential search', 'Saved'],
        ['Contact access', 'Recorded'],
        ['Next follow-up', 'Scheduled'],
      ],
      mockFooter: 'A clearer process for bureau owners, staff and administrators.',
    },
    verification: {
      eyebrow: 'Professional entry standards',
      title: 'What a bureau should be prepared to demonstrate',
      text:
        'The network is intended for serious matrimonial professionals. Verification should consider identity, genuine operations, professional conduct and the way personal information is handled.',
      groups: [
        {
          title: 'Applicant identity',
          text: 'Legal name, role, phone, professional email and CNIC, NICOP or passport details.',
          items: ['Identity document front and back', 'Applicant relationship to the bureau', 'Current contact information'],
        },
        {
          title: 'Bureau credibility',
          text: 'Business history, office arrangement, service areas, profile volume and any available registration evidence.',
          items: ['Business or tax proof where available', 'Office photo or business material', 'Website and professional social presence'],
        },
        {
          title: 'Professional practices',
          text: 'How the bureau obtains consent, verifies profiles, handles photos, responds to complaints and explains fees.',
          items: ['Candidate and family consent process', 'Privacy and misuse procedure', 'Fee and refund transparency'],
        },
        {
          title: 'References and conduct',
          text: 'Relevant references, memberships or other evidence that helps the review team understand the bureau’s standing.',
          items: ['Professional references', 'Community or industry standing', 'Agreement to MBN standards'],
        },
      ],
    },
    standards: {
      eyebrow: 'The professional standard',
      title: 'Network access comes with responsibility',
      text:
        'Profile information belongs to real people and families. Every approved bureau should use it only for legitimate matrimonial work and within the platform’s permissions.',
      items: [
        'Never copy, download or share profiles for unrelated use',
        'Do not reveal contact details without an authorised matrimonial purpose',
        'Obtain candidate or family consent before submitting their information',
        'Keep fees, services and refund terms clear before accepting payment',
        'Report suspected fake information, misuse or safety concerns',
        'Allow administrators to review relevant access and follow-up records',
      ],
      note: 'MBN can organise accountability, but each bureau remains responsible for its own conduct, verification and legal obligations.',
    },
    fit: {
      eyebrow: 'Is MBN right for your bureau?',
      title: 'Best suited to serious, process-minded professionals',
      goodTitle: 'A strong fit if you',
      good: [
        'Run an active marriage bureau or professional matchmaking service',
        'Work with candidate and family consent',
        'Value structured information and documented follow-up',
        'Are willing to provide identity and business verification information',
        'Treat privacy, dignity and accurate representation as essential',
      ],
      notTitle: 'Not intended for',
      not: [
        'Casual dating, entertainment or social discovery',
        'Bulk collection or resale of personal information',
        'Unverified operators unwilling to provide real identity details',
        'Businesses that hide fees or make guaranteed-marriage claims',
        'Any use outside legitimate matrimonial services',
      ],
    },
    faq: {
      eyebrow: 'Questions bureau owners ask',
      title: 'Understand the membership process before applying',
      items: [
        {
          q: 'Does submitting an application create immediate dashboard access?',
          a: 'No. The application is reviewed first. Account activation should only be offered after approval and any required verification steps are complete.',
        },
        {
          q: 'Which verification documents may be requested?',
          a: 'The form supports identity document front and back, business registration or tax proof, office photo, business card or letterhead. Requirements may vary according to the bureau’s structure and available evidence.',
        },
        {
          q: 'Can our bureau add its existing bride and groom profiles?',
          a: 'Yes. Approved bureaus can add profiles through the structured questionnaire. The bureau should have permission from the candidate or family before submitting personal information and photos.',
        },
        {
          q: 'Does MBN replace the judgement of a matchmaker?',
          a: 'No. The platform organises profiles, search and follow-up. Suitability assessment, respectful communication and professional judgement remain the responsibility of the bureau and families.',
        },
        {
          q: 'Can a bureau freely share profiles and contact details?',
          a: 'No. Information should only be used for legitimate matrimonial work, according to platform permissions, candidate consent and applicable privacy obligations.',
        },
      ],
    },
    final: {
      eyebrow: 'Build a more professional bureau operation',
      title: 'Bring your experience into a structured network.',
      text: 'Complete the verification questionnaire and show the MBN team how your bureau works, serves families and protects personal information.',
      primary: 'Apply as a Marriage Bureau',
      secondary: 'Already Approved? Login',
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
      eyebrow: 'پیشہ ور میرج بیوروز کے لیے',
      titleStart: 'اپنے matchmaking تجربے کو ایک',
      titleAccent: 'منظم digital workflow میں بدلیں۔',
      text:
        'منتشر spreadsheets، biodata files اور WhatsApp chats سے آگے بڑھیں۔ MBN منظور شدہ بیوروز کو profile creation، search، assignments اور follow-up records کے لیے ایک professional workspace فراہم کرتا ہے۔',
      primary: 'MBN میں شمولیت کے لیے درخواست دیں',
      secondary: 'بیورو لاگ اِن کھولیں',
      note: 'رسائی application review کے بعد زیرِ غور آتی ہے',
      points: ['منظم پروفائلز', 'قابلِ تلاش معلومات', 'ریکارڈ شدہ follow-up'],
      dashboardTitle: 'MBN بیورو ورک اسپیس',
      dashboardStatus: 'پیشہ ورانہ workflow',
      dashboardRows: [
        ['پروفائل intake', 'رہنمائی کے ساتھ'],
        ['نیٹ ورک search', 'منظم'],
        ['Assigned cases', 'قابلِ نگرانی'],
      ],
      dashboardFooter: 'آپ کا پیشہ ورانہ فیصلہ مرکزی حیثیت رکھتا ہے؛ platform اس کے اردگرد نظام کو بہتر بناتا ہے۔',
    },
    trust: [
      { title: 'منظوری پر مبنی رسائی', text: 'رسائی سے پہلے بیورو کی درخواست اور professional details کا جائزہ لیا جاتا ہے۔' },
      { title: 'منظم profile data', text: 'دلہن اور دلہا کی معلومات یکساں اور searchable fields میں محفوظ ہوتی ہیں۔' },
      { title: 'محدود مقصد کے لیے رابطہ', text: 'رابطہ معلومات عام profile information سے الگ رہتی ہیں اور access ریکارڈ ہو سکتا ہے۔' },
      { title: 'پیشہ ورانہ accountability', text: 'Assignments، notes اور follow-ups ہر case کے ساتھ منسلک رہ سکتے ہیں۔' },
    ],
    problem: {
      eyebrow: 'حقیقی بیورو operations کے مطابق',
      title: 'آپ کے تجربے کو بہتر operating system کی ضرورت ہے',
      text:
        'تجربہ کار matchmakers خاندانوں اور compatibility کو سمجھتے ہیں۔ مشکل اکثر ان کے کام کے اردگرد موجود منتشر نظام ہوتا ہے۔ MBN professional judgement کو تبدیل کیے بغیر اس عمل کو منظم کرنے کے لیے بنایا گیا ہے۔',
      oldTitle: 'منتشر پرانا طریقہ',
      oldItems: [
        'WhatsApp chats میں گم پروفائلز',
        'مختلف biodata formats اور نامکمل معلومات',
        'Spreadsheets میں بار بار manual search',
        'Follow-up history کا صرف یادداشت پر انحصار',
        'رابطہ معلومات share کرنے کا غیر واضح record',
      ],
      newTitle: 'MBN workflow',
      newItems: [
        'ایک یکساں اور جامع profile questionnaire',
        'Searchable candidate اور preference information',
        'Assigned profiles اور case notes ایک جگہ',
        'Contact-view اور follow-up کا زیادہ واضح record',
        'ایک مقامی list سے وسیع professional network',
      ],
    },
    capabilities: {
      eyebrow: 'ایک workspace، بیورو کے بنیادی workflows',
      title: 'آپ کے روزمرہ کام کے لیے تیار کردہ',
      text:
        'Dashboard matchmaking کے operational حصے کو support کرتا ہے تاکہ آپ کی توجہ assessment، communication اور family coordination پر برقرار رہے۔',
      cards: [
        {
          title: 'Premium profile intake',
          text: 'MBN کے یکساں section-by-section questionnaire کے ذریعے ذاتی، خاندانی، پیشہ ورانہ اور preference fields کے ساتھ profiles شامل کریں۔',
        },
        {
          title: 'منظم profile library',
          text: 'بیورو کی اپنی دلہن اور دلہا profiles کو disconnected files اور messages کے بجائے ایک structured workspace میں رکھیں۔',
        },
        {
          title: 'متعلقہ profile search',
          text: 'Gender، age، city، education، profession اور keywords جیسے available filters سے ممکنہ متعلقہ profiles تلاش کریں۔',
        },
        {
          title: 'Assigned public cases',
          text: 'MBN process کے ذریعے assigned reviewed profiles پر کام کریں اور ان کا status متعلقہ case کے ساتھ محفوظ رکھیں۔',
        },
        {
          title: 'Contact accountability',
          text: 'Phone اور WhatsApp information عام profile browsing سے الگ رکھیں جبکہ contact-view activity ریکارڈ ہو سکے۔',
        },
        {
          title: 'Follow-up history',
          text: 'Notes، work status اور next actions محفوظ کریں تاکہ staff یا conversations کے درمیان اہم progress ضائع نہ ہو۔',
        },
      ],
    },
    workflow: {
      eyebrow: 'Application سے روزمرہ operations تک',
      title: 'واضح access stages کے ساتھ professional journey',
      text: 'Application جمع کروانے سے فوری dashboard access نہیں ملتی۔ پہلے verification information جائزے کے لیے فراہم کی جاتی ہے۔',
      steps: [
        {
          title: 'بیورو questionnaire مکمل کریں',
          text: 'Applicant identity، bureau background، service reach، professional practices، references اور relevant online presence شامل کریں۔',
          note: 'فارم focused sections میں تقسیم ہے اور browser میں draft progress محفوظ کرتا ہے۔',
        },
        {
          title: 'نجی verification documents upload کریں',
          text: 'Identity document images اور جہاں دستیاب ہوں business proof، office evidence، business card یا letterhead جمع کروائیں۔',
          note: 'Verification documents نجی administrative review کے لیے ہیں، public profile display کے لیے نہیں۔',
        },
        {
          title: 'Application جائزے میں داخل ہوتی ہے',
          text: 'MBN جمع کروائی گئی معلومات کا جائزہ لیتا ہے اور وضاحت، اضافی evidence یا professional discussion کی درخواست کر سکتا ہے۔',
          note: 'Approval اختیاری ہے اور review مکمل ہونے کے بعد ہی access activate ہونی چاہیے۔',
        },
        {
          title: 'Account activation instructions حاصل کریں',
          text: 'منظور شدہ bureau کو account activate کرنے اور professional dashboard کھولنے کی دعوت دی جا سکتی ہے۔',
          note: 'Application اور login الگ stages ہیں تاکہ unapproved users کو غلط access expectation نہ ملے۔',
        },
        {
          title: 'Profiles create، search اور manage کریں',
          text: 'روزمرہ bureau work کے لیے structured forms، available filters اور organised profile views استعمال کریں۔',
          note: 'Search results professional judgement کو support کرتے ہیں؛ verification یا family consent کی جگہ نہیں لیتے۔',
        },
        {
          title: 'Responsible follow-up ریکارڈ کریں',
          text: 'Privacy اور purpose-limited use کا احترام کرتے ہوئے assignments، notes، work status اور next actions manage کریں۔',
          note: 'حتمی suitability اور marriage decisions ہمیشہ candidates اور families کے پاس رہتے ہیں۔',
        },
      ],
      apply: 'بیورو application شروع کریں',
    },
    dashboard: {
      eyebrow: 'Workspace کا تفصیلی جائزہ',
      title: 'مکمل profile lifecycle کو منظم کریں',
      text:
        'پیشہ ور bureau کو صرف contact directory نہیں چاہیے۔ MBN profile creation، discovery اور case activity کو جوڑتا ہے تاکہ واضح ہو کہ کیا ہو چکا ہے اور اگلا قدم کیا ہے۔',
      modules: [
        {
          title: 'Profile management',
          text: 'یکساں information fields کے ساتھ bureau کی اپنی profiles add، review، edit اور organise کریں۔',
          items: ['Guided profile form', 'Candidate اور family context', 'Photo preference اور notes'],
        },
        {
          title: 'Search اور assessment',
          text: 'Matchmaker کے experience اور family knowledge کے استعمال سے پہلے available information کو relevant filters سے محدود کریں۔',
          items: ['Practical filters', 'Keyword search', 'Profile detail review'],
        },
        {
          title: 'Case workflow',
          text: 'Assigned profiles، contact activity اور follow-up information کو متعلقہ case کے ساتھ منسلک رکھیں۔',
          items: ['Assignment status', 'Internal notes', 'Next follow-up action'],
        },
      ],
      mockTitle: 'Case workflow snapshot',
      mockStatus: 'کام جاری ہے',
      mockRows: [
        ['پروفائل معلومات', 'Reviewed'],
        ['Potential search', 'Saved'],
        ['Contact access', 'Recorded'],
        ['اگلا follow-up', 'Scheduled'],
      ],
      mockFooter: 'Bureau owners، staff اور administrators کے لیے زیادہ واضح process۔',
    },
    verification: {
      eyebrow: 'پیشہ ورانہ شمولیت کے معیار',
      title: 'بیورو کو کن چیزوں کا ثبوت دینے کے لیے تیار ہونا چاہیے',
      text:
        'Network سنجیدہ matrimonial professionals کے لیے ہے۔ Verification میں identity، حقیقی operations، professional conduct اور personal information handling شامل ہونی چاہیے۔',
      groups: [
        {
          title: 'Applicant identity',
          text: 'قانونی نام، کردار، phone، professional email اور CNIC، NICOP یا passport details۔',
          items: ['Identity document front اور back', 'Applicant کا bureau سے تعلق', 'موجودہ contact information'],
        },
        {
          title: 'Bureau credibility',
          text: 'Business history، office arrangement، service areas، profile volume اور دستیاب registration evidence۔',
          items: ['Business یا tax proof جہاں دستیاب ہو', 'Office photo یا business material', 'Website اور professional social presence'],
        },
        {
          title: 'Professional practices',
          text: 'Bureau consent کیسے لیتا، profiles verify کرتا، photos handle کرتا، complaints resolve کرتا اور fees explain کرتا ہے۔',
          items: ['Candidate اور family consent process', 'Privacy اور misuse procedure', 'Fee اور refund transparency'],
        },
        {
          title: 'References اور conduct',
          text: 'Relevant references، memberships یا دوسرے evidence جن سے review team bureau کی standing سمجھ سکے۔',
          items: ['Professional references', 'Community یا industry standing', 'MBN standards سے agreement'],
        },
      ],
    },
    standards: {
      eyebrow: 'پیشہ ورانہ معیار',
      title: 'Network access کے ساتھ ذمہ داری بھی آتی ہے',
      text:
        'Profile information حقیقی افراد اور خاندانوں سے متعلق ہوتی ہے۔ ہر approved bureau کو اسے صرف جائز matrimonial work اور platform permissions کے مطابق استعمال کرنا چاہیے۔',
      items: [
        'Profiles کو غیر متعلقہ استعمال کے لیے copy، download یا share نہ کریں',
        'مجاز matrimonial مقصد کے بغیر contact details ظاہر نہ کریں',
        'Candidate یا family کی معلومات submit کرنے سے پہلے consent حاصل کریں',
        'Payment لینے سے پہلے fees، services اور refund terms واضح کریں',
        'مشکوک fake information، misuse یا safety concern report کریں',
        'Administrators کو relevant access اور follow-up records review کرنے دیں',
      ],
      note: 'MBN accountability کو organise کر سکتا ہے، لیکن ہر bureau اپنے conduct، verification اور قانونی ذمہ داریوں کا خود ذمہ دار ہے۔',
    },
    fit: {
      eyebrow: 'کیا MBN آپ کے بیورو کے لیے مناسب ہے؟',
      title: 'سنجیدہ اور process-minded professionals کے لیے بہترین',
      goodTitle: 'آپ کے لیے موزوں اگر آپ',
      good: [
        'فعال marriage bureau یا professional matchmaking service چلاتے ہیں',
        'Candidate اور family consent کے ساتھ کام کرتے ہیں',
        'Structured information اور documented follow-up کو اہم سمجھتے ہیں',
        'Identity اور business verification information فراہم کرنے کے لیے تیار ہیں',
        'Privacy، dignity اور accurate representation کو بنیادی اصول سمجھتے ہیں',
      ],
      notTitle: 'ان مقاصد کے لیے نہیں',
      not: [
        'Casual dating، entertainment یا social discovery',
        'Personal information کی bulk collection یا resale',
        'اپنی حقیقی identity فراہم نہ کرنے والے unverified operators',
        'Fees چھپانے یا guaranteed-marriage claims کرنے والے businesses',
        'جائز matrimonial services سے باہر کوئی استعمال',
      ],
    },
    faq: {
      eyebrow: 'بیورو owners کے عام سوالات',
      title: 'درخواست دینے سے پہلے membership process سمجھیں',
      items: [
        {
          q: 'کیا application جمع کروانے سے فوری dashboard access مل جاتی ہے؟',
          a: 'نہیں۔ پہلے application کا جائزہ لیا جاتا ہے۔ Account activation صرف approval اور ضروری verification steps مکمل ہونے کے بعد دینی چاہیے۔',
        },
        {
          q: 'کون سے verification documents مانگے جا سکتے ہیں؟',
          a: 'فارم identity document front اور back، business registration یا tax proof، office photo، business card یا letterhead support کرتا ہے۔ Requirements bureau structure اور available evidence کے مطابق مختلف ہو سکتی ہیں۔',
        },
        {
          q: 'کیا ہمارا bureau اپنی موجودہ bride اور groom profiles شامل کر سکتا ہے؟',
          a: 'جی ہاں۔ Approved bureaus structured questionnaire کے ذریعے profiles add کر سکتے ہیں۔ Personal information اور photos submit کرنے سے پہلے candidate یا family کی اجازت ضروری ہے۔',
        },
        {
          q: 'کیا MBN matchmaker کے professional judgement کی جگہ لیتا ہے؟',
          a: 'نہیں۔ Platform profiles، search اور follow-up کو organise کرتا ہے۔ Suitability assessment، respectful communication اور professional judgement bureau اور families کی ذمہ داری رہتے ہیں۔',
        },
        {
          q: 'کیا bureau profiles اور contact details آزادانہ share کر سکتا ہے؟',
          a: 'نہیں۔ Information صرف legitimate matrimonial work، platform permissions، candidate consent اور applicable privacy obligations کے مطابق استعمال ہونی چاہیے۔',
        },
      ],
    },
    final: {
      eyebrow: 'اپنے bureau operation کو زیادہ professional بنائیں',
      title: 'اپنے تجربے کو ایک منظم network میں لائیں۔',
      text: 'Verification questionnaire مکمل کریں اور MBN team کو بتائیں کہ آپ کا bureau کیسے کام کرتا، families کو serve کرتا اور personal information کی حفاظت کرتا ہے۔',
      primary: 'Marriage Bureau کے طور پر apply کریں',
      secondary: 'پہلے سے approved ہیں؟ Login کریں',
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

const trustIcons = [BadgeCheck, Database, Lock, ClipboardCheck];
const capabilityIcons = [Upload, Database, Search, UserPlus, Eye, History];
const moduleIcons = [FileText, SlidersHorizontal, BarChart3];
const verificationIcons = [UserCheck, Building2, ShieldCheck, FileCheck2];

export default function ForBureausPage() {
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
        active="bureaus"
        language={language}
        setLanguage={setLanguage}
        isUrdu={isUrdu}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        nav={t.nav}
        subtitle={t.subtitle}
      />

      <main className="pt-[76px]">
        <section className="relative overflow-hidden border-b border-emerald-950/[0.06] bg-[#052f20] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(30,154,92,0.25),transparent_32%),radial-gradient(circle_at_92%_12%,rgba(211,174,108,0.14),transparent_28%),linear-gradient(135deg,#052f20_0%,#073b24_52%,#0b5a38_100%)]" />
          <div className="pointer-events-none absolute -left-36 top-24 h-96 w-96 rounded-full border border-white/[0.06]" />
          <div className="pointer-events-none absolute -right-24 bottom-5 h-[430px] w-[430px] rounded-full border border-[#d1ad6e]/12" />

          <div className="relative mx-auto grid min-h-[740px] max-w-[1440px] items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-10 lg:py-24">
            <div className="max-w-3xl">
              <div className="mbn-hero-rise inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#bce5c8] backdrop-blur">
                <Building2 className="h-3.5 w-3.5" />
                {t.hero.eyebrow}
              </div>

              <h1 className="mbn-hero-rise-2 mt-7 max-w-4xl font-heading text-[2.75rem] font-bold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.55rem]">
                {t.hero.titleStart}{' '}
                <span className="relative inline-block text-[#bce5c8]">
                  {t.hero.titleAccent}
                  <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#d1ad6e]/22" />
                </span>
              </h1>

              <p className="mbn-hero-rise-3 mt-7 max-w-2xl text-base leading-8 text-white/68 sm:text-lg sm:leading-9">{t.hero.text}</p>

              <div className="mbn-hero-rise-3 mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-[#073b24] shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#edf7f0]">
                  {t.hero.primary}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${arrowClass}`} />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/18 bg-white/[0.07] px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.12]">{t.hero.secondary}</Link>
              </div>

              <div className="mbn-hero-rise-3 mt-8 flex flex-wrap gap-3">
                {t.hero.points.map((point) => (
                  <span key={point} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3.5 py-2 text-[11px] font-bold text-white/72 backdrop-blur">
                    <Check className="h-3.5 w-3.5 text-[#bce5c8]" strokeWidth={3} />
                    {point}
                  </span>
                ))}
              </div>

              <div className="mbn-hero-rise-3 mt-6 inline-flex items-center gap-2 text-xs font-semibold text-white/48">
                <ShieldCheck className="h-4 w-4 text-[#bce5c8]" />
                {t.hero.note}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[700px] lg:mx-0">
              <div className="mbn-float-a absolute -left-3 top-9 z-20 hidden rounded-2xl border border-white/15 bg-[#073b24]/90 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur sm:block lg:-left-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#bce5c8] text-[#073b24]"><Search className="h-5 w-5" /></span>
                  <div><p className="text-xs font-extrabold">{t.capabilities.cards[2].title}</p><p className="mt-1 max-w-[185px] text-[10px] leading-4 text-white/48">{t.capabilities.cards[2].text}</p></div>
                </div>
              </div>

              <div className="relative rounded-[2.7rem] border border-white/15 bg-white/[0.08] p-3 shadow-[0_40px_110px_rgba(0,0,0,0.34)] backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-[2.15rem] bg-[#f7faf7] p-3">
                  <Image
                    src="/mbn-bureau-dashboard.png"
                    alt="MBN Pakistan bureau dashboard"
                    width={1280}
                    height={820}
                    className="min-h-[390px] w-full rounded-[1.65rem] object-cover object-top shadow-sm sm:min-h-[470px]"
                    priority
                  />
                  <div className="absolute inset-x-6 bottom-6 rounded-[1.75rem] border border-white/70 bg-white/94 p-5 text-slate-950 shadow-[0_20px_60px_rgba(5,61,37,0.18)] backdrop-blur-md sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div><div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0a6a3f]"><LayoutDashboard className="h-3.5 w-3.5" />{t.hero.dashboardTitle}</div><p className="mt-2 font-heading text-xl font-bold text-[#073b24]">{t.hero.dashboardStatus}</p></div>
                      <span className="rounded-full bg-[#edf7f0] px-3 py-1.5 text-[10px] font-extrabold text-[#0a6a3f]">MBN</span>
                    </div>
                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      {t.hero.dashboardRows.map(([label, value]) => (
                        <div key={label} className="rounded-2xl bg-[#f7faf7] px-3.5 py-3">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
                          <p className="mt-1 text-[11px] font-extrabold text-[#073b24]">{value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-[10px] leading-5 text-slate-500">{t.hero.dashboardFooter}</p>
                  </div>
                </div>
              </div>

              <div className="mbn-float-b absolute -bottom-6 right-3 z-20 rounded-2xl border border-[#d8e9dc] bg-white p-4 text-slate-950 shadow-[0_18px_55px_rgba(0,0,0,0.18)] sm:right-10 lg:-right-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf7f0] text-[#0a6a3f]"><History className="h-5 w-5" /></span>
                  <div><p className="text-xs font-extrabold text-[#073b24]">{t.capabilities.cards[5].title}</p><p className="mt-1 max-w-[185px] text-[10px] leading-4 text-slate-500">{t.capabilities.cards[5].text}</p></div>
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
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#edf7f0] text-[#0a6a3f] transition group-hover:-translate-y-1 group-hover:bg-[#0a6a3f] group-hover:text-white"><Icon className="h-5 w-5" /></span>
                    <div><h2 className="text-sm font-extrabold text-[#073b24]">{item.title}</h2><p className="mt-2 text-xs leading-5 text-slate-500">{item.text}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <SectionHeading eyebrow={t.problem.eyebrow} title={t.problem.title} text={t.problem.text} />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <ComparisonCard title={t.problem.oldTitle} items={t.problem.oldItems} theme="old" icon={<MessageCircle className="h-6 w-6" />} />
            <ComparisonCard title={t.problem.newTitle} items={t.problem.newItems} theme="new" icon={<Network className="h-6 w-6" />} />
          </div>
        </section>

        <section className="border-y border-emerald-950/[0.06] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
            <SectionHeading eyebrow={t.capabilities.eyebrow} title={t.capabilities.title} text={t.capabilities.text} />
            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {t.capabilities.cards.map((card, index) => {
                const Icon = capabilityIcons[index];
                return (
                  <div key={card.title} data-reveal className={`mbn-reveal mbn-reveal-delay-${Math.min(index % 3, 2)} group relative overflow-hidden rounded-[2rem] border border-emerald-950/[0.07] bg-[#fbfcf8] p-7 transition duration-500 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_70px_rgba(5,61,37,0.10)]`}>
                    <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#e9f5ec] transition duration-500 group-hover:scale-125" />
                    <div className="relative">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf7f0] text-[#0a6a3f] transition group-hover:bg-[#0a6a3f] group-hover:text-white"><Icon className="h-6 w-6" /></span>
                      <h3 className="mt-7 font-heading text-2xl font-bold leading-tight text-[#073b24]">{card.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-slate-600">{card.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-16 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-32">
          <div data-reveal className="mbn-reveal lg:sticky lg:top-28 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#edf7f0] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f]"><Sparkles className="h-3.5 w-3.5" />{t.workflow.eyebrow}</div>
            <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[#073b24] sm:text-5xl">{t.workflow.title}</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{t.workflow.text}</p>
            <Link href="/register" className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#0a6a3f] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(10,106,63,0.18)] transition hover:-translate-y-0.5 hover:bg-[#075632]">
              {t.workflow.apply}
              <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${arrowClass}`} />
            </Link>
          </div>

          <div className="relative">
            <div className={`absolute bottom-10 top-10 w-px bg-gradient-to-b from-[#0a6a3f]/10 via-[#0a6a3f]/35 to-[#0a6a3f]/10 ${isUrdu ? 'right-6 sm:right-8' : 'left-6 sm:left-8'}`} />
            <div className="space-y-5">
              {t.workflow.steps.map((step, index) => (
                <div key={step.title} data-reveal className={`mbn-reveal mbn-reveal-delay-${Math.min(index % 4, 3)} relative flex gap-5 sm:gap-7`}>
                  <span className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border-4 border-[#fbfcf8] bg-[#0a6a3f] text-xs font-black text-white shadow-[0_10px_28px_rgba(10,106,63,0.20)] sm:h-16 sm:w-16 sm:text-sm">{String(index + 1).padStart(2, '0')}</span>
                  <div className="flex-1 rounded-[2rem] border border-emerald-950/[0.07] bg-white p-6 shadow-[0_16px_48px_rgba(5,61,37,0.05)] transition duration-300 hover:border-[#0a6a3f]/20 hover:shadow-[0_20px_60px_rgba(5,61,37,0.09)] sm:p-7">
                    <h3 className="font-heading text-xl font-bold text-[#073b24] sm:text-2xl">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p>
                    <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#f7faf6] px-4 py-3 text-xs leading-5 text-slate-500"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0a6a3f]" /><span>{step.note}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#063b27] text-white">
          <div className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#168151]/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[480px] w-[480px] rounded-full bg-[#d1ad6e]/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-[1440px] gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:px-10 lg:py-32">
            <div>
              <div data-reveal className="mbn-reveal inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#bce5c8]"><LayoutDashboard className="h-3.5 w-3.5" />{t.dashboard.eyebrow}</div>
              <h2 data-reveal className="mbn-reveal mt-6 max-w-3xl font-heading text-4xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl">{t.dashboard.title}</h2>
              <p data-reveal className="mbn-reveal mt-5 max-w-2xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">{t.dashboard.text}</p>

              <div className="mt-10 grid gap-4">
                {t.dashboard.modules.map((module, index) => {
                  const Icon = moduleIcons[index];
                  return (
                    <div key={module.title} data-reveal className={`mbn-reveal mbn-reveal-delay-${index} rounded-[1.8rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur sm:p-6`}>
                      <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#bce5c8] text-[#073b24]"><Icon className="h-5 w-5" /></span>
                        <div><h3 className="font-heading text-xl font-bold">{module.title}</h3><p className="mt-2 text-xs leading-6 text-white/58">{module.text}</p></div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {module.items.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-[10px] font-bold text-white/65">{item}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div data-reveal className="mbn-reveal self-center">
              <div className="rounded-[2.6rem] border border-white/12 bg-white/[0.07] p-3 shadow-[0_35px_90px_rgba(0,0,0,0.20)] backdrop-blur-xl">
                <div className="rounded-[2.1rem] bg-[#f8faf7] p-6 text-slate-950 sm:p-8">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
                    <div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f]">{t.dashboard.mockTitle}</p><h3 className="mt-2 font-heading text-2xl font-bold text-[#073b24]">MBN-CASE-••••</h3></div>
                    <span className="rounded-full bg-[#fff1d5] px-3 py-2 text-[10px] font-extrabold text-[#8a641e]">{t.dashboard.mockStatus}</span>
                  </div>
                  <div className="mt-6 space-y-3">
                    {t.dashboard.mockRows.map(([label, value], index) => <StatusRow key={label} icon={index === 0 ? <FileCheck2 className="h-4 w-4" /> : index === 1 ? <Search className="h-4 w-4" /> : index === 2 ? <Eye className="h-4 w-4" /> : <History className="h-4 w-4" />} label={label} value={value} />)}
                  </div>
                  <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#edf7f0] p-4 text-xs leading-6 text-[#315c46]"><ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0a6a3f]" />{t.dashboard.mockFooter}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <SectionHeading eyebrow={t.verification.eyebrow} title={t.verification.title} text={t.verification.text} />
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {t.verification.groups.map((group, index) => {
              const Icon = verificationIcons[index];
              return (
                <div key={group.title} data-reveal className={`mbn-reveal mbn-reveal-delay-${Math.min(index, 3)} group rounded-[2.2rem] border border-emerald-950/[0.07] bg-white p-7 shadow-[0_18px_55px_rgba(5,61,37,0.055)] transition duration-500 hover:-translate-y-1 sm:p-8`}>
                  <div className="flex items-start gap-5">
                    <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#edf7f0] text-[#0a6a3f] transition group-hover:bg-[#0a6a3f] group-hover:text-white"><Icon className="h-6 w-6" /></span>
                    <div><h3 className="font-heading text-2xl font-bold text-[#073b24]">{group.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{group.text}</p></div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {group.items.map((item) => <div key={item} className="flex items-start gap-2 rounded-2xl bg-[#f7faf6] px-4 py-3 text-xs font-bold leading-5 text-slate-600"><Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#0a6a3f]" strokeWidth={3} />{item}</div>)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-y border-emerald-950/[0.06] bg-white">
          <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-24 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-32">
            <div data-reveal className="mbn-reveal relative overflow-hidden rounded-[2.5rem] bg-[#073b24] p-7 text-white shadow-[0_24px_70px_rgba(5,61,37,0.18)] sm:p-10">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#168151]/25 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#bce5c8]"><ShieldCheck className="h-3.5 w-3.5" />{t.standards.eyebrow}</div>
                <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08]">{t.standards.title}</h2>
                <p className="mt-5 text-sm leading-7 text-white/62">{t.standards.text}</p>
                <div className="mt-8 grid gap-3">
                  {t.standards.items.map((item) => <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-4 text-sm leading-7 text-white/72"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#bce5c8]" />{item}</div>)}
                </div>
                <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#bce5c8] p-5 text-sm leading-7 text-[#073b24]"><BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0" /><span className="font-semibold">{t.standards.note}</span></div>
              </div>
            </div>

            <div data-reveal className="mbn-reveal mbn-reveal-delay-1 overflow-hidden rounded-[2.5rem] border border-[#eadbc4] bg-gradient-to-br from-[#fbf3e7] to-[#fffdf9] p-7 shadow-[0_24px_70px_rgba(94,69,34,0.10)] sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f] shadow-sm"><Sparkles className="h-3.5 w-3.5" />{t.fit.eyebrow}</div>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] text-[#073b24]">{t.fit.title}</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <FitList title={t.fit.goodTitle} items={t.fit.good} positive />
                <FitList title={t.fit.notTitle} items={t.fit.not} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
          <div data-reveal className="mbn-reveal mt-12 overflow-hidden rounded-[2.2rem] border border-emerald-950/[0.07] bg-white p-2 shadow-[0_20px_65px_rgba(5,61,37,0.07)]">
            {t.faq.items.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.q} className={`rounded-[1.7rem] transition ${isOpen ? 'bg-[#fbfcf8] shadow-sm' : ''}`}>
                  <button type="button" aria-expanded={isOpen} aria-controls={`bureau-faq-${index}`} onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-5 px-5 py-5 text-start sm:px-7 sm:py-6">
                    <span className="flex items-start gap-4"><span className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-[10px] font-black ${isOpen ? 'bg-[#0a6a3f] text-white' : 'bg-[#edf7f0] text-[#0a6a3f]'}`}>{String(index + 1).padStart(2, '0')}</span><span className="font-heading text-base font-bold leading-6 text-[#073b24] sm:text-lg">{item.q}</span></span>
                    <ChevronDown className={`h-5 w-5 flex-shrink-0 text-[#0a6a3f] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div id={`bureau-faq-${index}`} role="region" className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><p className="px-5 pb-6 text-sm leading-7 text-slate-600 sm:px-[5.25rem] sm:pb-7">{item.a}</p></div></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-10 lg:pb-28">
          <div data-reveal className="mbn-reveal mbn-shimmer relative mx-auto max-w-[1320px] overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#063b27] via-[#0a6a3f] to-[#168151] px-6 py-14 text-center text-white shadow-[0_32px_90px_rgba(5,61,37,0.23)] sm:px-10 sm:py-20">
            <div className="pointer-events-none absolute -left-28 -top-36 h-80 w-80 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full border border-white/10" />
            <div className="relative mx-auto max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#d4eedb]"><Sparkles className="h-3.5 w-3.5" />{t.final.eyebrow}</div>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">{t.final.title}</h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/68 sm:text-base sm:leading-8">{t.final.text}</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/register" className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-[#073b24] transition hover:-translate-y-0.5 hover:bg-[#edf7f0]">{t.final.primary}<ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${arrowClass}`} /></Link>
                <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.07] px-7 py-4 text-sm font-extrabold text-white transition hover:bg-white/[0.12]">{t.final.secondary}</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter isUrdu={isUrdu} subtitle={t.subtitle} footer={t.footer} />

      <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden">
        <Link href="/register" className="mbn-shimmer flex items-center justify-center gap-2 rounded-full bg-[#0a6a3f] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_40px_rgba(4,47,32,0.35)]">{t.hero.primary}<ArrowRight className={`h-4 w-4 ${arrowClass}`} /></Link>
      </div>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      .mbn-reveal { opacity: 0; transform: translateY(28px); transition: opacity 760ms cubic-bezier(0.22,1,0.36,1), transform 760ms cubic-bezier(0.22,1,0.36,1); }
      .mbn-reveal.is-visible { opacity: 1; transform: translateY(0); }
      .mbn-reveal-delay-0 { transition-delay: 0ms; }
      .mbn-reveal-delay-1 { transition-delay: 90ms; }
      .mbn-reveal-delay-2 { transition-delay: 180ms; }
      .mbn-reveal-delay-3 { transition-delay: 270ms; }
      .mbn-hero-rise { animation: mbnHeroRise 820ms cubic-bezier(0.22,1,0.36,1) both; }
      .mbn-hero-rise-2 { animation: mbnHeroRise 820ms 120ms cubic-bezier(0.22,1,0.36,1) both; }
      .mbn-hero-rise-3 { animation: mbnHeroRise 820ms 240ms cubic-bezier(0.22,1,0.36,1) both; }
      .mbn-float-a { animation: mbnFloatA 5.6s ease-in-out infinite; }
      .mbn-float-b { animation: mbnFloatB 6.4s ease-in-out infinite; }
      .mbn-shimmer { position: relative; overflow: hidden; }
      .mbn-shimmer::after { content: ''; position: absolute; inset: 0; transform: translateX(-120%); background: linear-gradient(100deg,transparent 35%,rgba(255,255,255,.25) 50%,transparent 65%); animation: mbnShimmer 5.5s ease-in-out infinite; pointer-events: none; }
      @keyframes mbnHeroRise { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      @keyframes mbnFloatA { 0%,100% { transform:translate3d(0,0,0) rotate(-1deg); } 50% { transform:translate3d(0,-10px,0) rotate(1deg); } }
      @keyframes mbnFloatB { 0%,100% { transform:translate3d(0,0,0) rotate(1deg); } 50% { transform:translate3d(0,9px,0) rotate(-1deg); } }
      @keyframes mbnShimmer { 0%,55% { transform:translateX(-120%); } 82%,100% { transform:translateX(120%); } }
      @media (prefers-reduced-motion: reduce) { .mbn-reveal,.mbn-hero-rise,.mbn-hero-rise-2,.mbn-hero-rise-3,.mbn-float-a,.mbn-float-b,.mbn-shimmer::after { animation:none !important; transition:none !important; opacity:1 !important; transform:none !important; } }
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
  const items = [[nav.home, '/'], [nav.how, '/how-it-works'], [nav.families, '/for-families'], [nav.bureaus, '/for-bureaus'], [nav.about, '/about'], [nav.contact, '/contact']] as const;
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-[#fbfcf8]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="MBN Pakistan home">
          <span className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(5,61,37,0.10)] ring-1 ring-emerald-950/5 transition-transform duration-300 group-hover:-translate-y-0.5"><Image src="/mbn-logo.png" alt="MBN Pakistan" width={44} height={44} className="h-full w-full object-contain p-1" priority /></span>
          <span className="hidden leading-none min-[390px]:block"><span className="block font-heading text-lg font-bold tracking-[0.13em] text-[#073b24]">MBN</span><span className="mt-1 block text-[10px] font-extrabold tracking-[0.22em] text-[#0d6f43]">PAKISTAN</span><span className="mt-1 hidden text-[9px] font-medium tracking-wide text-slate-500 sm:block">{subtitle}</span></span>
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
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Image src="/mbn-logo.png" alt="MBN Pakistan" width={42} height={42} className="rounded-xl bg-white p-1 shadow-sm" /><div><p className="font-heading font-bold text-[#073b24]">MBN Pakistan</p><p className="text-[10px] text-slate-500">{subtitle}</p></div></div><button type="button" onClick={() => setMobileMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#073b24] shadow-sm"><X className="h-5 w-5" /></button></div>
          <nav className="mt-8 grid gap-2">{items.map(([label, href]) => <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-4 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-[#edf7f0] hover:text-[#0a6a3f]">{label}</Link>)}</nav>
          <div className="mt-6 grid gap-3 border-t border-emerald-950/[0.07] pt-6"><Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center rounded-full bg-[#0a6a3f] px-5 py-3.5 text-sm font-extrabold text-white">{isUrdu ? 'بیورو کے طور پر apply کریں' : 'Apply as a Bureau'}</Link><Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center rounded-full border border-[#0a6a3f]/18 bg-white px-5 py-3.5 text-sm font-extrabold text-[#073b24]">{nav.login}</Link></div>
        </div>
      </div>
    </header>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div data-reveal className="mbn-reveal mx-auto max-w-4xl text-center"><div className="inline-flex items-center gap-2 rounded-full bg-[#edf7f0] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#0a6a3f]"><Sparkles className="h-3.5 w-3.5" />{eyebrow}</div><h2 className="mt-6 font-heading text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[#073b24] sm:text-5xl lg:text-[3.5rem]">{title}</h2>{text && <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{text}</p>}</div>;
}

function ComparisonCard({ title, items, theme, icon }: { title: string; items: readonly string[]; theme: 'old' | 'new'; icon: ReactNode }) {
  const good = theme === 'new';
  return (
    <div data-reveal className={`mbn-reveal relative overflow-hidden rounded-[2.5rem] border p-7 shadow-[0_22px_65px_rgba(5,61,37,0.07)] sm:p-9 ${good ? 'border-emerald-950/[0.07] bg-[#073b24] text-white' : 'border-[#eadbc4] bg-gradient-to-br from-[#fbf3e7] to-[#fffdf9]'}`}>
      <div className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${good ? 'bg-[#168151]/25' : 'bg-[#d1ad6e]/24'}`} />
      <div className="relative"><div className="flex items-center gap-4"><span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${good ? 'bg-[#bce5c8] text-[#073b24]' : 'bg-white text-[#0a6a3f] shadow-sm'}`}>{icon}</span><h3 className={`font-heading text-3xl font-bold ${good ? 'text-white' : 'text-[#073b24]'}`}>{title}</h3></div><div className="mt-8 grid gap-3">{items.map((item) => <div key={item} className={`flex items-start gap-3 rounded-2xl px-4 py-4 text-sm leading-6 ${good ? 'border border-white/10 bg-white/[0.055] text-white/72' : 'bg-white/80 text-slate-700 shadow-sm'}`}><span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${good ? 'bg-[#bce5c8] text-[#073b24]' : 'bg-[#f6e7df] text-[#a34f34]'}`}>{good ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}</span>{item}</div>)}</div></div>
    </div>
  );
}

function StatusRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5"><div className="flex items-center gap-3 text-xs font-bold text-slate-600"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#edf7f0] text-[#0a6a3f]">{icon}</span>{label}</div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-[#073b24]">{value}</span></div>;
}

function FitList({ title, items, positive = false }: { title: string; items: readonly string[]; positive?: boolean }) {
  return <div><h3 className={`text-xs font-extrabold uppercase tracking-[0.14em] ${positive ? 'text-[#0a6a3f]' : 'text-[#a06b48]'}`}>{title}</h3><div className="mt-5 grid gap-3">{items.map((item) => <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/80 px-4 py-3.5 text-xs font-bold leading-5 text-slate-700 shadow-sm"><span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${positive ? 'bg-[#e3f3e8] text-[#0a6a3f]' : 'bg-[#f6e7df] text-[#9a543d]'}`}>{positive ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}</span>{item}</div>)}</div></div>;
}

function PublicFooter({ isUrdu, subtitle, footer }: { isUrdu: boolean; subtitle: string; footer: FooterContent }) {
  return (
    <footer dir={isUrdu ? 'rtl' : 'ltr'} className="bg-[#052f20] pb-24 text-white sm:pb-0"><div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10"><div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.6fr_0.7fr_0.7fr]"><div><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1"><Image src="/mbn-logo.png" alt="MBN Pakistan" width={46} height={46} className="h-full w-full object-contain" /></span><div><p className="font-heading text-lg font-bold">MBN Pakistan</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a9d6b6]">{subtitle}</p></div></div><p className="mt-5 max-w-lg text-sm leading-7 text-white/58">{footer.text}</p><div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold text-white/65"><Network className="h-4 w-4 text-[#bce5c8]" />{footer.note}</div></div><FooterLinks title={footer.explore} links={[[footer.families, '/for-families'], [footer.bureaus, '/for-bureaus'], [footer.how, '/how-it-works']]} /><FooterLinks title={footer.company} links={[[footer.about, '/about'], [footer.contact, '/contact'], [footer.login, '/login']]} /></div><div className="flex flex-col gap-4 pt-6 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} MBN Pakistan. {footer.rights}</p><div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-[#9fd1ad]" /><span>Private • Family-first • Professional</span></div></div></div></footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return <div><h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#a9d6b6]">{title}</h3><div className="mt-5 grid gap-3 text-sm font-semibold text-white/68">{links.map(([label, href]) => <Link key={href} href={href} className="w-fit transition hover:text-white">{label}</Link>)}</div></div>;
}
