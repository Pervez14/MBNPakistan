'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  EyeOff,
  FileCheck2,
  HeartHandshake,
  Lightbulb,
  LockKeyhole,
  Menu,
  MessageCircleMore,
  Network,
  Scale,
  SearchCheck,
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
      eyebrow: 'About MBN Pakistan',
      titleStart: 'Where family values meet a more',
      titleAccent: 'responsible matrimonial system.',
      text:
        'MBN Pakistan is being built to help serious individuals, families and professional marriage bureaus manage the rishta journey with greater privacy, structure and accountability — without turning marriage into an endless public browsing experience.',
      primary: 'Submit a Private Profile',
      secondary: 'Explore How It Works',
      note: 'Built for serious marriage enquiries, not casual dating',
      cardTitle: 'Our purpose',
      cardText:
        'To give traditional, family-aware matchmaking a clearer and more professional digital workflow.',
      cardBadge: 'Family-first by design',
    },
    intro: {
      eyebrow: 'Why MBN exists',
      title: 'The rishta process deserves better tools — without losing its human judgement.',
      text:
        'In Pakistan, many sincere matrimonial enquiries still move through scattered WhatsApp chats, handwritten notes, spreadsheets and informal referrals. Valuable information becomes difficult to search, sensitive details may be shared without a clear trail, and families often do not know what happens after submitting a profile.',
      second:
        'MBN Pakistan brings these moving parts into one organised network. The platform supports guided profile intake, review, controlled information handling, professional search and recorded follow-up while keeping families and experienced matchmakers at the centre of the process.',
      problems: [
        'Profiles scattered across chats and files',
        'Unclear photo and contact sharing',
        'Repeated manual data entry',
        'Follow-ups that are difficult to track',
      ],
      approachTitle: 'The MBN approach',
      approachText:
        'One thoughtful profile, a review-first journey and a more accountable professional workflow.',
    },
    mission: {
      eyebrow: 'Our mission',
      title: 'Make serious matchmaking more dignified, organised and privacy-aware.',
      text:
        'Technology should support the care and judgement involved in marriage decisions — not replace them. MBN is designed to help families participate meaningfully, help bureaus work professionally, and help sensitive information move through a clearer process.',
      cards: [
        {
          title: 'Protect dignity',
          text: 'Profiles should represent real people and families with care, context and respectful presentation.',
        },
        {
          title: 'Support family involvement',
          text: 'Parents, siblings and guardians can participate while keeping the candidate’s consent and preferences central.',
        },
        {
          title: 'Improve professional practice',
          text: 'Bureaus need structured profiles, searchable records, assignments and follow-up history — not more scattered chats.',
        },
        {
          title: 'Create accountability',
          text: 'Access, contact handling and case progress should be clearer and easier to review responsibly.',
        },
      ],
    },
    serve: {
      eyebrow: 'One network, two important journeys',
      title: 'Designed for families and the professionals who support them',
      text:
        'MBN does not ask families and marriage bureaus to use the same experience. Each journey is designed around its own responsibilities and needs.',
      familyTag: 'Individuals & families',
      familyTitle: 'A guided and private way to begin',
      familyText:
        'Families can prepare a detailed candidate profile, choose photo preferences, receive a reference number and remain involved as the profile moves through review and follow-up.',
      familyPoints: [
        'Enjoyable step-by-step questionnaire',
        'Candidate and family context in one profile',
        'Privacy preferences for submitted photos',
        'Clearer status and professional follow-up',
      ],
      familyCta: 'For Families',
      bureauTag: 'Professional marriage bureaus',
      bureauTitle: 'A better operating system for matchmaking work',
      bureauText:
        'Approved bureaus can organise their own profiles, search relevant network records, manage assigned cases and maintain follow-up activity from one workspace.',
      bureauPoints: [
        'Structured profile management',
        'Searchable matrimonial network',
        'Assigned-case workflow',
        'Contact and follow-up accountability',
      ],
      bureauCta: 'For Bureaus',
    },
    values: {
      eyebrow: 'The principles behind the platform',
      title: 'What we believe responsible matchmaking should look like',
      items: [
        {
          title: 'Privacy should be visible',
          text: 'Families should understand how photos, phone numbers and personal details are expected to be handled — not just see a generic privacy claim.',
        },
        {
          title: 'Consent should remain central',
          text: 'A family member may help submit a profile, but the candidate’s dignity, awareness and preferences should remain part of the process.',
        },
        {
          title: 'Professional access should be earned',
          text: 'Marriage bureau applications should be reviewed against identity, credibility and responsible-practice information before network access is considered.',
        },
        {
          title: 'Human judgement still matters',
          text: 'Filters and organised data can support a search, but suitability cannot be reduced to a random percentage or automated promise.',
        },
        {
          title: 'Progress should not disappear in chats',
          text: 'Assignments, contact activity and follow-ups are more useful when they can be recorded and reviewed in a structured workflow.',
        },
        {
          title: 'Marriage is not a swipe product',
          text: 'The experience should encourage deliberate profiles, serious intent and respectful family-aware communication.',
        },
      ],
    },
    system: {
      eyebrow: 'How the model comes together',
      title: 'A human-led network supported by better digital structure',
      text:
        'MBN combines a guided family experience with a professional bureau workspace. The goal is not to remove the matchmaker or the family — it is to give both a clearer system.',
      steps: [
        {
          number: '01',
          title: 'Thoughtful profile intake',
          text: 'Relevant personal, family, career and preference information is collected through a guided questionnaire.',
        },
        {
          number: '02',
          title: 'Review before action',
          text: 'A submission can be checked for completeness and handled according to the intended workflow before moving forward.',
        },
        {
          number: '03',
          title: 'Professional search and support',
          text: 'Approved bureaus can use structured information and filters rather than relying only on memory or scattered records.',
        },
        {
          number: '04',
          title: 'Recorded follow-up',
          text: 'Case activity can remain organised so the next step is clearer for the professionals and families involved.',
        },
      ],
      dashboardTitle: 'A workspace built around real bureau work',
      dashboardText:
        'Profiles, network search, assignments, contact accountability and follow-ups can be handled from one professional dashboard.',
      dashboardCta: 'See the Bureau Experience',
    },
    standards: {
      eyebrow: 'Our responsibility',
      title: 'Clear expectations matter in matrimonial decisions',
      goodTitle: 'What MBN is designed to support',
      good: [
        'Structured and detailed matrimonial profiles',
        'Review-first handling of public submissions',
        'Privacy-aware photo and contact workflows',
        'Professional bureau verification information',
        'Organised search, assignment and follow-up tools',
      ],
      limitsTitle: 'What MBN does not promise',
      limits: [
        'A guaranteed marriage or fixed result',
        'Automatic proof that every statement is accurate',
        'A replacement for family due diligence',
        'Legal, financial or background investigation',
        'Suitability based only on a generated match score',
      ],
      note:
        'Families and bureaus should independently verify identity, education, employment, marital status, family information and any other material claim before making a decision.',
    },
    vision: {
      eyebrow: 'Our vision',
      title: 'A more trusted professional ecosystem for matrimonial services in Pakistan.',
      text:
        'We envision a network where families can begin with confidence, responsible marriage bureaus can work with better systems, and sensitive profile information is treated with the seriousness it deserves.',
      points: [
        'More organised bureau operations',
        'Clearer family participation',
        'Stronger privacy awareness',
        'Better professional accountability',
      ],
    },
    final: {
      eyebrow: 'Choose your next step',
      title: 'Begin with a thoughtful profile or join as a professional bureau.',
      text:
        'Whether you are representing yourself, supporting a family member or running a marriage bureau, MBN gives you a clearer place to begin.',
      primary: 'Submit Private Profile',
      secondary: 'Apply as a Bureau',
      contact: 'Talk to Our Team',
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
      eyebrow: 'MBN Pakistan کے بارے میں',
      titleStart: 'جہاں خاندانی اقدار ایک زیادہ',
      titleAccent: 'ذمہ دار matrimonial نظام سے ملتی ہیں۔',
      text:
        'MBN Pakistan سنجیدہ افراد، خاندانوں اور پیشہ ور میرج بیوروز کو رشتے کے سفر میں زیادہ پرائیویسی، ترتیب اور جواب دہی دینے کے لیے بنایا جا رہا ہے — شادی کو لامحدود پبلک براؤزنگ کا تجربہ بنائے بغیر۔',
      primary: 'نجی پروفائل جمع کروائیں',
      secondary: 'طریقۂ کار دیکھیں',
      note: 'صرف سنجیدہ رشتے کی تلاش کے لیے، casual dating کے لیے نہیں',
      cardTitle: 'ہمارا مقصد',
      cardText:
        'روایتی اور family-aware matchmaking کو زیادہ واضح اور پیشہ ور ڈیجیٹل ورک فلو فراہم کرنا۔',
      cardBadge: 'خاندان کو مرکز میں رکھ کر',
    },
    intro: {
      eyebrow: 'MBN کی ضرورت کیوں ہے',
      title: 'رشتے کے عمل کو بہتر tools کی ضرورت ہے — انسانی سمجھ بوجھ کھوئے بغیر۔',
      text:
        'پاکستان میں بہت سی سنجیدہ matrimonial enquiries آج بھی بکھری WhatsApp چیٹس، ہاتھ سے لکھی فائلوں، spreadsheets اور غیر رسمی حوالوں کے ذریعے چلتی ہیں۔ اہم معلومات تلاش کرنا مشکل ہو جاتا ہے، حساس تفصیلات واضح ریکارڈ کے بغیر شیئر ہو سکتی ہیں اور خاندان اکثر نہیں جانتے کہ پروفائل جمع کروانے کے بعد کیا ہوا۔',
      second:
        'MBN Pakistan ان تمام حصوں کو ایک منظم نیٹ ورک میں لاتا ہے۔ پلیٹ فارم guided profile intake، جائزہ، محدود information handling، professional search اور recorded follow-up کو support کرتا ہے جبکہ خاندان اور تجربہ کار matchmakers عمل کے مرکز میں رہتے ہیں۔',
      problems: [
        'چیٹس اور فائلوں میں بکھری پروفائلز',
        'تصویر اور رابطہ معلومات کی غیر واضح sharing',
        'بار بار manual data entry',
        'ایسے follow-ups جنہیں track کرنا مشکل ہو',
      ],
      approachTitle: 'MBN کا طریقہ',
      approachText:
        'ایک مکمل پروفائل، review-first journey اور زیادہ جواب دہ professional workflow۔',
    },
    mission: {
      eyebrow: 'ہمارا مشن',
      title: 'سنجیدہ matchmaking کو زیادہ باوقار، منظم اور privacy-aware بنانا۔',
      text:
        'ٹیکنالوجی کو شادی کے فیصلوں میں شامل توجہ اور انسانی سمجھ بوجھ کو support کرنا چاہیے، اس کی جگہ نہیں لینی چاہیے۔ MBN خاندانوں کو بامعنی شمولیت، بیوروز کو پیشہ ور ورک فلو اور حساس معلومات کو زیادہ واضح طریقے سے سنبھالنے میں مدد دینے کے لیے بنایا گیا ہے۔',
      cards: [
        {
          title: 'وقار کی حفاظت',
          text: 'پروفائل حقیقی افراد اور خاندانوں کو مکمل context اور احترام کے ساتھ پیش کرے۔',
        },
        {
          title: 'خاندان کی شمولیت',
          text: 'والدین، بہن بھائی اور سرپرست امیدوار کی رضامندی اور ترجیحات کو مرکز میں رکھتے ہوئے حصہ لے سکیں۔',
        },
        {
          title: 'پیشہ ورانہ معیار بہتر بنانا',
          text: 'بیوروز کو بکھری چیٹس کے بجائے structured profiles، searchable records، assignments اور follow-up history درکار ہے۔',
        },
        {
          title: 'جواب دہی پیدا کرنا',
          text: 'رسائی، رابطہ معلومات اور کیس کی پیش رفت واضح اور ذمہ داری کے ساتھ review ہونے کے قابل ہونی چاہیے۔',
        },
      ],
    },
    serve: {
      eyebrow: 'ایک نیٹ ورک، دو اہم سفر',
      title: 'خاندانوں اور ان کی مدد کرنے والے پیشہ ور افراد دونوں کے لیے',
      text:
        'MBN خاندانوں اور میرج بیوروز کو ایک ہی تجربہ استعمال کرنے پر مجبور نہیں کرتا۔ ہر journey اس کی اپنی ذمہ داریوں اور ضروریات کے مطابق بنائی گئی ہے۔',
      familyTag: 'افراد اور خاندان',
      familyTitle: 'آغاز کا guided اور نجی طریقہ',
      familyText:
        'خاندان امیدوار کی تفصیلی پروفائل تیار کر سکتے ہیں، تصاویر کی ترجیح منتخب کر سکتے ہیں، reference number حاصل کر سکتے ہیں اور review و follow-up کے دوران عمل میں شامل رہ سکتے ہیں۔',
      familyPoints: [
        'دلچسپ مرحلہ وار سوالنامہ',
        'امیدوار اور خاندان کا مکمل context',
        'جمع کروائی گئی تصاویر کی privacy preference',
        'زیادہ واضح status اور professional follow-up',
      ],
      familyCta: 'خاندانوں کے لیے',
      bureauTag: 'پیشہ ور میرج بیوروز',
      bureauTitle: 'matchmaking کام کے لیے بہتر operating system',
      bureauText:
        'منظور شدہ بیوروز اپنی پروفائلز منظم کر سکتے ہیں، متعلقہ network records تلاش کر سکتے ہیں، assigned cases سنبھال سکتے ہیں اور ایک workspace میں follow-up activity محفوظ رکھ سکتے ہیں۔',
      bureauPoints: [
        'منظم پروفائل مینجمنٹ',
        'قابلِ تلاش matrimonial network',
        'assigned-case workflow',
        'contact اور follow-up accountability',
      ],
      bureauCta: 'بیوروز کے لیے',
    },
    values: {
      eyebrow: 'پلیٹ فارم کے بنیادی اصول',
      title: 'ذمہ دار matchmaking کیسی ہونی چاہیے',
      items: [
        {
          title: 'پرائیویسی واضح ہونی چاہیے',
          text: 'خاندانوں کو معلوم ہونا چاہیے کہ تصاویر، فون نمبرز اور ذاتی معلومات کیسے سنبھالی جائیں گی — صرف عام privacy claim کافی نہیں۔',
        },
        {
          title: 'رضامندی مرکز میں ہونی چاہیے',
          text: 'خاندان کا کوئی فرد پروفائل جمع کروا سکتا ہے، لیکن امیدوار کا وقار، آگاہی اور ترجیحات عمل کا حصہ رہنی چاہئیں۔',
        },
        {
          title: 'پیشہ ور رسائی ذمہ داری سے ملنی چاہیے',
          text: 'نیٹ ورک access پر غور سے پہلے میرج بیورو کی شناخت، credibility اور responsible-practice information کا جائزہ ہونا چاہیے۔',
        },
        {
          title: 'انسانی judgement اب بھی اہم ہے',
          text: 'Filters اور منظم data تلاش میں مدد دے سکتے ہیں، مگر suitability کو random percentage یا automatic promise تک محدود نہیں کیا جا سکتا۔',
        },
        {
          title: 'پیش رفت چیٹس میں گم نہیں ہونی چاہیے',
          text: 'Assignments، contact activity اور follow-ups structured workflow میں record ہوں تو زیادہ مفید رہتے ہیں۔',
        },
        {
          title: 'شادی swipe product نہیں',
          text: 'تجربہ deliberate profiles، سنجیدہ نیت اور بااحترام family-aware communication کی حوصلہ افزائی کرے۔',
        },
      ],
    },
    system: {
      eyebrow: 'یہ ماڈل کیسے مل کر کام کرتا ہے',
      title: 'بہتر digital structure کے ساتھ human-led network',
      text:
        'MBN guided family experience کو professional bureau workspace کے ساتھ جوڑتا ہے۔ مقصد matchmaker یا خاندان کو ہٹانا نہیں، بلکہ دونوں کو زیادہ واضح نظام دینا ہے۔',
      steps: [
        {
          number: '01',
          title: 'مکمل پروفائل intake',
          text: 'ذاتی، خاندانی، تعلیمی، career اور preferences کی متعلقہ معلومات guided questionnaire سے لی جاتی ہیں۔',
        },
        {
          number: '02',
          title: 'کارروائی سے پہلے جائزہ',
          text: 'آگے بڑھنے سے پہلے سبمیشن کی تکمیل دیکھی اور intended workflow کے مطابق handle کی جا سکتی ہے۔',
        },
        {
          number: '03',
          title: 'professional search اور support',
          text: 'منظور شدہ بیوروز صرف memory یا بکھرے records کے بجائے structured information اور filters استعمال کر سکتے ہیں۔',
        },
        {
          number: '04',
          title: 'ریکارڈ شدہ follow-up',
          text: 'Case activity منظم رہ سکتی ہے تاکہ professionals اور خاندانوں کے لیے اگلا قدم زیادہ واضح ہو۔',
        },
      ],
      dashboardTitle: 'حقیقی bureau work کے مطابق workspace',
      dashboardText:
        'Profiles، network search، assignments، contact accountability اور follow-ups ایک professional dashboard سے manage کیے جا سکتے ہیں۔',
      dashboardCta: 'بیورو تجربہ دیکھیں',
    },
    standards: {
      eyebrow: 'ہماری ذمہ داری',
      title: 'matrimonial فیصلوں میں واضح توقعات ضروری ہیں',
      goodTitle: 'MBN کن چیزوں کو support کرنے کے لیے بنایا گیا ہے',
      good: [
        'منظم اور تفصیلی matrimonial profiles',
        'public submissions کا review-first handling',
        'privacy-aware photo اور contact workflows',
        'professional bureau verification information',
        'منظم search، assignment اور follow-up tools',
      ],
      limitsTitle: 'MBN کن چیزوں کا وعدہ نہیں کرتا',
      limits: [
        'شادی یا کسی مقررہ نتیجے کی guarantee',
        'ہر بیان کے درست ہونے کا automatic proof',
        'خاندانی due diligence کا متبادل',
        'قانونی، مالی یا background investigation',
        'صرف generated match score کی بنیاد پر suitability',
      ],
      note:
        'فیصلے سے پہلے خاندانوں اور بیوروز کو شناخت، تعلیم، ملازمت، ازدواجی حیثیت، خاندانی معلومات اور ہر اہم دعوے کی آزادانہ تصدیق کرنی چاہیے۔',
    },
    vision: {
      eyebrow: 'ہمارا وژن',
      title: 'پاکستان میں matrimonial services کے لیے زیادہ قابلِ اعتماد professional ecosystem۔',
      text:
        'ہم ایسا نیٹ ورک دیکھنا چاہتے ہیں جہاں خاندان اعتماد کے ساتھ آغاز کر سکیں، ذمہ دار میرج بیوروز بہتر systems کے ساتھ کام کریں اور حساس پروفائل معلومات کو وہ سنجیدگی ملے جس کی وہ مستحق ہیں۔',
      points: [
        'زیادہ منظم bureau operations',
        'خاندان کی زیادہ واضح شمولیت',
        'مضبوط privacy awareness',
        'بہتر professional accountability',
      ],
    },
    final: {
      eyebrow: 'اپنا اگلا قدم منتخب کریں',
      title: 'ایک مکمل پروفائل سے آغاز کریں یا professional bureau کے طور پر شامل ہوں۔',
      text:
        'چاہے آپ اپنی نمائندگی کر رہے ہوں، کسی خاندانی فرد کی مدد کر رہے ہوں یا میرج بیورو چلا رہے ہوں، MBN آپ کو آغاز کے لیے زیادہ واضح جگہ دیتا ہے۔',
      primary: 'نجی پروفائل جمع کروائیں',
      secondary: 'بیورو کے طور پر درخواست دیں',
      contact: 'ہماری ٹیم سے رابطہ کریں',
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

const missionIcons = [HeartHandshake, Users, Building2, Scale];
const valueIcons = [EyeOff, UserCheck, BadgeCheck, Lightbulb, ClipboardCheck, HeartHandshake];
const systemIcons = [FileCheck2, SearchCheck, Network, MessageCircleMore];

export default function AboutPage() {
  const { language, setLanguage, isUrdu } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      { threshold: 0.12, rootMargin: '0px 0px -42px' },
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
      <style jsx global>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .mbn-about-rise {
          animation: mbnAboutRise 760ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .mbn-about-rise-2 {
          animation: mbnAboutRise 760ms 110ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .mbn-about-rise-3 {
          animation: mbnAboutRise 760ms 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .mbn-about-float {
          animation: mbnAboutFloat 6.5s ease-in-out infinite;
        }
        .mbn-about-float-delayed {
          animation: mbnAboutFloat 7.2s 1.1s ease-in-out infinite;
        }
        .mbn-about-grid {
          background-image: linear-gradient(rgba(7, 59, 36, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(7, 59, 36, 0.045) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        @keyframes mbnAboutRise {
          from { opacity: 0; transform: translateY(26px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mbnAboutFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal],
          .mbn-about-rise,
          .mbn-about-rise-2,
          .mbn-about-rise-3,
          .mbn-about-float,
          .mbn-about-float-delayed {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-emerald-950/[0.06] bg-[#fbfcf8]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/mbn-logo.png"
              alt="MBN Pakistan"
              width={48}
              height={48}
              className="h-11 w-11 rounded-xl bg-white object-contain p-1 shadow-sm ring-1 ring-emerald-950/[0.06]"
            />
            <div className="hidden min-[390px]:block">
              <p className="font-heading text-[15px] font-black tracking-[0.15em] text-[#073b24]">MBN PAKISTAN</p>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-500">{t.subtitle}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] font-bold text-slate-700 xl:flex">
            <Link href="/" className="transition hover:text-[#0a6a3f]">{t.nav.home}</Link>
            <Link href="/how-it-works" className="transition hover:text-[#0a6a3f]">{t.nav.how}</Link>
            <Link href="/for-families" className="transition hover:text-[#0a6a3f]">{t.nav.families}</Link>
            <Link href="/for-bureaus" className="transition hover:text-[#0a6a3f]">{t.nav.bureaus}</Link>
            <Link href="/about" className="relative text-[#0a6a3f] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#0a6a3f]">{t.nav.about}</Link>
            <Link href="/contact" className="transition hover:text-[#0a6a3f]">{t.nav.contact}</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageToggle language={language} setLanguage={setLanguage} />
            </div>
            <Link
              href="/login"
              className="hidden rounded-full border border-emerald-900/15 bg-white px-4 py-2.5 text-xs font-extrabold text-[#073b24] shadow-sm transition hover:bg-emerald-50 lg:inline-flex"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/submit-profile"
              className="inline-flex items-center gap-2 rounded-full bg-[#0a6a3f] px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_12px_30px_rgba(10,106,63,0.22)] transition hover:-translate-y-0.5 hover:bg-[#075632] sm:px-5"
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
                  className={`flex items-center justify-between rounded-2xl px-4 py-3.5 transition ${href === '/about' ? 'bg-emerald-50 text-[#0a6a3f]' : 'hover:bg-emerald-50 hover:text-[#0a6a3f]'}`}
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
            <div className="absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-[#dff2e6] blur-3xl" />
            <div className="absolute right-[-10rem] top-[-8rem] h-[38rem] w-[38rem] rounded-full bg-[#f2dfbe]/60 blur-3xl" />
            <div className="absolute bottom-[-14rem] left-[42%] h-[28rem] w-[28rem] rounded-full bg-[#e6f1d7] blur-3xl" />
          </div>

          <div className="relative mx-auto grid min-h-[720px] max-w-[1440px] items-center gap-14 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-24">
            <div className="relative z-10 max-w-2xl">
              <div className="mbn-about-rise inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0a6a3f] shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {t.hero.eyebrow}
              </div>

              <h1 className="mbn-about-rise-2 mt-7 font-heading text-[2.75rem] font-bold leading-[0.99] tracking-[-0.035em] text-[#073b24] sm:text-6xl lg:text-[4.5rem]">
                {t.hero.titleStart}{' '}
                <span className="relative inline-block text-[#0b7a48]">
                  {t.hero.titleAccent}
                  <span className="absolute -bottom-2 left-0 h-2 w-full rounded-full bg-[#d7b66b]/35" />
                </span>
              </h1>

              <p className="mbn-about-rise-3 mt-7 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {t.hero.text}
              </p>

              <div className="mbn-about-rise-3 mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/submit-profile"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#0a6a3f] px-7 py-4 text-sm font-extrabold text-white shadow-[0_18px_44px_rgba(10,106,63,0.24)] transition duration-300 hover:-translate-y-1 hover:bg-[#075632]"
                >
                  {t.hero.primary}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${arrowClass}`} />
                </Link>
                <Link
                  href="/how-it-works"
                  className="group inline-flex items-center justify-center gap-3 rounded-full border border-emerald-950/10 bg-white/80 px-7 py-4 text-sm font-extrabold text-[#073b24] shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  <BookOpenCheck className="h-4 w-4 text-[#0a6a3f]" />
                  {t.hero.secondary}
                </Link>
              </div>

              <div className="mbn-about-rise-3 mt-8 flex items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="h-px w-10 bg-emerald-900/20" />
                <HeartHandshake className="h-4 w-4 text-[#b28a36]" />
                {t.hero.note}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[690px]">
              <div className="absolute -inset-8 rounded-[3.5rem] bg-gradient-to-br from-[#f4e4cc]/80 via-[#dff0e4]/70 to-white blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.4rem] border border-white/80 bg-white p-2.5 shadow-[0_35px_90px_rgba(4,55,34,0.16)] sm:rounded-[3rem] sm:p-3">
                <div className="relative min-h-[520px] overflow-hidden rounded-[1.9rem] bg-[#eee4d8] sm:min-h-[600px] sm:rounded-[2.4rem]">
                  <Image
                    src="/mbn-family-hero.png"
                    alt="A family-first matrimonial platform"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    className="object-cover object-[59%_center]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#052e20]/70 via-transparent to-white/10" />
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#f0e5d7]/55 to-transparent" />

                  <div className={`mbn-about-float absolute top-7 max-w-[270px] rounded-3xl border border-white/75 bg-white/92 p-5 shadow-[0_22px_55px_rgba(5,48,31,0.18)] backdrop-blur-md ${isUrdu ? 'right-5 sm:right-8' : 'left-5 sm:left-8'}`}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#0a6a3f]">
                        <HeartHandshake className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#0a6a3f]">{t.hero.cardBadge}</p>
                        <p className="mt-1 font-heading text-lg font-bold text-[#073b24]">{t.hero.cardTitle}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-6 text-slate-600">{t.hero.cardText}</p>
                  </div>

                  <div className={`mbn-about-float-delayed absolute bottom-7 max-w-[275px] rounded-3xl border border-white/20 bg-[#073b24]/92 p-5 text-white shadow-[0_25px_60px_rgba(2,35,22,0.28)] backdrop-blur-md ${isUrdu ? 'left-5 sm:left-8' : 'right-5 sm:right-8'}`}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-[#f0d28b]">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-extrabold">Privacy · Structure · Accountability</p>
                        <p className="mt-1 text-[11px] text-white/65">MBN Pakistan</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[LockKeyhole, FileCheck2, Users].map((Icon, index) => (
                        <div key={index} className="flex h-10 items-center justify-center rounded-xl bg-white/[0.08]">
                          <Icon className="h-4 w-4 text-white/80" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-10">
            <div data-reveal>
              <SectionLabel icon={Lightbulb}>{t.intro.eyebrow}</SectionLabel>
              <h2 className="mt-5 max-w-xl font-heading text-3xl font-bold leading-tight tracking-[-0.025em] text-[#073b24] sm:text-5xl">
                {t.intro.title}
              </h2>
              <p className="mt-6 text-[15px] leading-8 text-slate-600">{t.intro.text}</p>
              <p className="mt-4 text-[15px] leading-8 text-slate-600">{t.intro.second}</p>
            </div>

            <div data-reveal className="relative rounded-[2rem] border border-emerald-950/[0.08] bg-[#f7faf5] p-5 shadow-[0_28px_70px_rgba(6,62,37,0.08)] sm:p-7">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#eeddbb]/50 blur-2xl" />
              <div className="relative grid gap-3 sm:grid-cols-2">
                {t.intro.problems.map((problem, index) => (
                  <div key={problem} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-xs font-black text-rose-600">{index + 1}</span>
                      <p className="text-sm font-bold leading-6 text-slate-700">{problem}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative mt-4 rounded-3xl bg-gradient-to-br from-[#073b24] to-[#0b7044] p-6 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <Sparkles className="h-5 w-5 text-[#f0d28b]" />
                  </span>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-100/70">{t.intro.approachTitle}</p>
                    <p className="mt-1 text-sm font-bold leading-6 text-white/90">{t.intro.approachText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-950/[0.06] bg-[#f6f9f3] py-20 sm:py-24">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
            <div data-reveal className="mx-auto max-w-3xl text-center">
              <SectionLabel icon={HeartHandshake} centred>{t.mission.eyebrow}</SectionLabel>
              <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-[-0.025em] text-[#073b24] sm:text-5xl">
                {t.mission.title}
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">{t.mission.text}</p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {t.mission.cards.map((item, index) => {
                const Icon = missionIcons[index];
                return (
                  <article key={item.title} data-reveal className="group rounded-[1.7rem] border border-emerald-950/[0.07] bg-white p-6 shadow-[0_16px_45px_rgba(6,62,37,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_65px_rgba(6,62,37,0.11)]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f3ea] text-[#0a6a3f] transition group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-heading text-xl font-bold text-[#073b24]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
            <div data-reveal className="max-w-3xl">
              <SectionLabel icon={Network}>{t.serve.eyebrow}</SectionLabel>
              <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-[-0.025em] text-[#073b24] sm:text-5xl">
                {t.serve.title}
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-slate-600">{t.serve.text}</p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <JourneyCard
                tag={t.serve.familyTag}
                title={t.serve.familyTitle}
                text={t.serve.familyText}
                points={t.serve.familyPoints}
                cta={t.serve.familyCta}
                href="/for-families"
                icon={Users}
                image="/mbn-family-hero.png"
                arrowClass={arrowClass}
              />
              <JourneyCard
                tag={t.serve.bureauTag}
                title={t.serve.bureauTitle}
                text={t.serve.bureauText}
                points={t.serve.bureauPoints}
                cta={t.serve.bureauCta}
                href="/for-bureaus"
                icon={Building2}
                image="/mbn-bureau-dashboard.png"
                arrowClass={arrowClass}
                dark
              />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#073b24] py-20 text-white sm:py-24">
          <div className="pointer-events-none absolute inset-0 mbn-about-grid opacity-40" />
          <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#0d8752]/35 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-10rem] right-[-5rem] h-96 w-96 rounded-full bg-[#d5b264]/15 blur-3xl" />

          <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
            <div data-reveal className="mx-auto max-w-3xl text-center">
              <SectionLabel icon={ShieldCheck} centred dark>{t.values.eyebrow}</SectionLabel>
              <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-[-0.025em] sm:text-5xl">
                {t.values.title}
              </h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {t.values.items.map((item, index) => {
                const Icon = valueIcons[index];
                return (
                  <article key={item.title} data-reveal className="rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.09]">
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f0d28b]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-heading text-lg font-bold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-white/68">{item.text}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#fbfcf8] py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10">
            <div data-reveal>
              <SectionLabel icon={Network}>{t.system.eyebrow}</SectionLabel>
              <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-[-0.025em] text-[#073b24] sm:text-5xl">
                {t.system.title}
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-slate-600">{t.system.text}</p>

              <div className="mt-8 space-y-4">
                {t.system.steps.map((step, index) => {
                  const Icon = systemIcons[index];
                  return (
                    <div key={step.number} className="group flex gap-4 rounded-2xl border border-transparent p-2 transition hover:border-emerald-950/[0.06] hover:bg-white">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5f2e8] text-[#0a6a3f]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#b28a36]">{step.number}</span>
                          <h3 className="font-heading text-lg font-bold text-[#073b24]">{step.title}</h3>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{step.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div data-reveal className="relative">
              <div className="absolute -inset-7 rounded-[3rem] bg-gradient-to-br from-[#e6f3e9] via-[#f1e4cf]/60 to-white blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.2rem] border border-white bg-white p-3 shadow-[0_32px_85px_rgba(6,62,37,0.14)]">
                <div className="overflow-hidden rounded-[1.7rem] border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#0a6a3f]">
                        <Building2 className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-[#073b24]">MBN Bureau Workspace</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">Profiles · Search · Follow-ups</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold text-[#0a6a3f]">Professional</span>
                  </div>
                  <div className="relative aspect-[16/10] bg-white">
                    <Image
                      src="/mbn-bureau-dashboard.png"
                      alt="MBN Pakistan bureau dashboard"
                      fill
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                  </div>
                </div>

                <div className="grid gap-4 px-3 pb-3 pt-6 sm:grid-cols-[1fr_auto] sm:items-center sm:px-5 sm:pb-5">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[#073b24]">{t.system.dashboardTitle}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{t.system.dashboardText}</p>
                  </div>
                  <Link href="/for-bureaus" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a6a3f] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#075632]">
                    {t.system.dashboardCta}
                    <ArrowRight className={`h-3.5 w-3.5 ${arrowClass}`} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-950/[0.06] bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
            <div data-reveal className="mx-auto max-w-3xl text-center">
              <SectionLabel icon={Scale} centred>{t.standards.eyebrow}</SectionLabel>
              <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-[-0.025em] text-[#073b24] sm:text-5xl">
                {t.standards.title}
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <ExpectationCard title={t.standards.goodTitle} items={t.standards.good} positive />
              <ExpectationCard title={t.standards.limitsTitle} items={t.standards.limits} />
            </div>

            <div data-reveal className="mt-6 flex items-start gap-4 rounded-[1.5rem] border border-amber-200/70 bg-amber-50 p-5 text-amber-950">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <SearchCheck className="h-5 w-5 text-amber-700" />
              </span>
              <p className="text-sm font-semibold leading-7">{t.standards.note}</p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#f2f7ef] py-20 sm:py-24">
          <div className="pointer-events-none absolute -left-24 bottom-[-8rem] h-72 w-72 rounded-full bg-[#dcebd3] blur-3xl" />
          <div className="pointer-events-none absolute right-[-8rem] top-[-6rem] h-80 w-80 rounded-full bg-[#f1debd]/65 blur-3xl" />
          <div className="relative mx-auto grid max-w-[1240px] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-10">
            <div data-reveal>
              <SectionLabel icon={Sparkles}>{t.vision.eyebrow}</SectionLabel>
              <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-[-0.025em] text-[#073b24] sm:text-5xl">
                {t.vision.title}
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-600">{t.vision.text}</p>
            </div>
            <div data-reveal className="grid gap-3 sm:grid-cols-2">
              {t.vision.points.map((point, index) => (
                <div key={point} className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-xs font-black text-[#0a6a3f]">0{index + 1}</span>
                    <p className="text-sm font-extrabold leading-6 text-[#073b24]">{point}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
          <div data-reveal className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[2.4rem] bg-gradient-to-br from-[#073b24] via-[#095b39] to-[#0d7b49] px-6 py-12 text-center text-white shadow-[0_35px_90px_rgba(4,55,34,0.22)] sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute inset-0 mbn-about-grid opacity-25" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#f0d28b]/15 blur-3xl" />
            <div className="relative mx-auto max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-100">
                <HeartHandshake className="h-3.5 w-3.5" />
                {t.final.eyebrow}
              </div>
              <h2 className="mt-6 font-heading text-3xl font-bold leading-tight tracking-[-0.025em] sm:text-5xl">{t.final.title}</h2>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-white/72">{t.final.text}</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/submit-profile" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-[#073b24] transition hover:-translate-y-1 hover:bg-emerald-50">
                  {t.final.primary}
                  <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-1 hover:bg-white/[0.13]">
                  {t.final.secondary}
                  <Building2 className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-extrabold text-emerald-100 transition hover:text-white">
                  {t.final.contact}
                  <ChevronRight className={`h-4 w-4 ${arrowClass}`} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#062f20] text-white">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_0.7fr_0.7fr] lg:px-10">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image src="/mbn-logo.png" alt="MBN Pakistan" width={48} height={48} className="h-12 w-12 rounded-xl bg-white p-1 object-contain" />
              <div>
                <p className="font-heading text-lg font-bold">MBN Pakistan</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-100/55">{t.subtitle}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-emerald-50/65">{t.footer.text}</p>
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
        <div className="border-t border-white/[0.08]">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-4 py-5 text-[11px] text-emerald-50/45 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
            <p>{t.footer.note}</p>
            <p>© {new Date().getFullYear()} MBN Pakistan. {t.footer.rights}</p>
          </div>
        </div>
      </footer>

      <Link
        href="/submit-profile"
        className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-center gap-2 rounded-2xl bg-[#0a6a3f] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_20px_45px_rgba(5,65,38,0.3)] sm:hidden"
      >
        {t.nav.submit}
        <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
      </Link>
    </div>
  );
}

function SectionLabel({
  children,
  icon: Icon,
  centred = false,
  dark = false,
}: {
  children: ReactNode;
  icon: ComponentType<{ className?: string }>;
  centred?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] ${centred ? 'mx-auto' : ''} ${dark ? 'border-white/15 bg-white/[0.07] text-emerald-100' : 'border-emerald-900/10 bg-emerald-50/70 text-[#0a6a3f]'}`}>
      <Icon className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

function JourneyCard({
  tag,
  title,
  text,
  points,
  cta,
  href,
  icon: Icon,
  image,
  arrowClass,
  dark = false,
}: {
  tag: string;
  title: string;
  text: string;
  points: readonly string[];
  cta: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  image: string;
  arrowClass: string;
  dark?: boolean;
}) {
  return (
    <article data-reveal className={`group overflow-hidden rounded-[2rem] border shadow-[0_22px_65px_rgba(6,62,37,0.09)] ${dark ? 'border-emerald-900/10 bg-[#073b24] text-white' : 'border-emerald-950/[0.07] bg-[#f8faf6]'}`}>
      <div className="relative h-56 overflow-hidden sm:h-64">
        <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className={`transition duration-700 group-hover:scale-[1.03] ${dark ? 'object-cover object-top' : 'object-cover object-[55%_center]'}`} />
        <div className={`absolute inset-0 ${dark ? 'bg-gradient-to-t from-[#073b24] via-[#073b24]/15 to-transparent' : 'bg-gradient-to-t from-[#f8faf6] via-transparent to-transparent'}`} />
        <span className={`absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] backdrop-blur ${dark ? 'border-white/15 bg-[#073b24]/70 text-emerald-100' : 'border-white/80 bg-white/85 text-[#0a6a3f]'}`}>
          <Icon className="h-3.5 w-3.5" />
          {tag}
        </span>
      </div>
      <div className="p-6 sm:p-8">
        <h3 className={`font-heading text-2xl font-bold ${dark ? 'text-white' : 'text-[#073b24]'}`}>{title}</h3>
        <p className={`mt-3 text-sm leading-7 ${dark ? 'text-white/65' : 'text-slate-600'}`}>{text}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {points.map((point) => (
            <div key={point} className={`flex items-start gap-2 text-xs font-bold leading-5 ${dark ? 'text-white/78' : 'text-slate-700'}`}>
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-white/10 text-[#f0d28b]' : 'bg-emerald-50 text-[#0a6a3f]'}`}>
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {point}
            </div>
          ))}
        </div>
        <Link href={href} className={`mt-7 inline-flex items-center gap-2 text-sm font-extrabold transition hover:gap-3 ${dark ? 'text-[#f0d28b]' : 'text-[#0a6a3f]'}`}>
          {cta}
          <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
        </Link>
      </div>
    </article>
  );
}

function ExpectationCard({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: readonly string[];
  positive?: boolean;
}) {
  return (
    <article data-reveal className={`rounded-[1.8rem] border p-6 sm:p-8 ${positive ? 'border-emerald-200/70 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${positive ? 'bg-white text-[#0a6a3f]' : 'bg-white text-slate-600'} shadow-sm`}>
          {positive ? <ShieldCheck className="h-5 w-5" /> : <Scale className="h-5 w-5" />}
        </span>
        <h3 className="font-heading text-xl font-bold text-[#073b24]">{title}</h3>
      </div>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${positive ? 'bg-[#0a6a3f] text-white' : 'bg-slate-200 text-slate-600'}`}>
              {positive ? <Check className="h-3 w-3" strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
            <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function FooterLinks({ title, links }: { title: string; links: ReadonlyArray<readonly [string, string]> }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-100/55">{title}</p>
      <div className="mt-4 grid gap-3 text-sm font-semibold text-white/72">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="transition hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
