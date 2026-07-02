import Link from 'next/link';
import {
  ClipboardCheck,
  ShieldCheck,
  Upload,
  Search,
  Eye,
  Lock,
  UserCheck,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    title: 'Apply for Membership',
    description:
      'A marriage bureau submits an application with business details, contact information, city, province, and references.',
    icon: ClipboardCheck,
  },
  {
    title: 'Admin Reviews Application',
    description:
      'MBN Pakistan reviews the bureau application and approves only serious and verified bureaus.',
    icon: ShieldCheck,
  },
  {
    title: 'Bureau Uploads Profiles',
    description:
      'Approved bureaus can upload bride and groom profiles with education, profession, family details, requirements, and privacy settings.',
    icon: Upload,
  },
  {
    title: 'Search the Network',
    description:
      'Bureaus can search active profiles by gender, city, province, caste, marital status, education, employment, and keywords.',
    icon: Search,
  },
  {
    title: 'View Contact Details',
    description:
      'Contact details stay hidden. When an approved bureau clicks View Contact, the uploader contact details are shown.',
    icon: Eye,
  },
  {
    title: 'Admin Tracks Contact Views',
    description:
      'The platform records who viewed which profile contact details, helping the owner monitor activity and misuse.',
    icon: UserCheck,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
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
              <p className="text-xs text-slate-500">
                Marriage Bureau Network
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/about" className="hover:text-green-700">
              About
            </Link>
            <Link href="/how-it-works" className="text-green-700">
              How It Works
            </Link>
            <Link href="/contact" className="hover:text-green-700">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="inline-flex px-4 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
            >
              Apply
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold border border-green-100">
          <CheckCircle className="w-4 h-4" />
          Simple, secure, professional
        </span>

        <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-6">
          How MBN Pakistan Works
        </h1>

        <p className="text-lg text-slate-600 mt-5 max-w-3xl mx-auto leading-relaxed">
          MBN Pakistan helps verified marriage bureaus upload profiles, search
          suitable matches, protect privacy, and track contact activity through
          one organized digital system.
        </p>
      </section>

      {/* Steps */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-green-700" />
                  </div>

                  <span className="text-4xl font-bold text-slate-100">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h2 className="font-heading text-xl font-bold text-slate-900">
                  {step.title}
                </h2>

                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Privacy Section */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-heading text-3xl font-bold text-slate-900">
                Privacy is built into the platform
              </h2>

              <p className="text-slate-600 mt-4 leading-relaxed">
                Marriage profiles are sensitive. That is why MBN Pakistan gives
                bureaus control over photo visibility and keeps contact details
                hidden until someone intentionally requests them.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-green-50 border border-green-100 flex gap-4">
                <Eye className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-green-900">Public Photo</p>
                  <p className="text-sm text-green-800 mt-1">
                    Photo appears clearly in profile search.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
                <Lock className="w-6 h-6 text-amber-700 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-amber-900">Blurred Photo</p>
                  <p className="text-sm text-amber-800 mt-1">
                    Photo appears blurred for privacy.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
                <ShieldCheck className="w-6 h-6 text-slate-700 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-slate-900">Hidden Photo</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Photo is hidden from search results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bureau Flow */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold">
                Built for professional marriage bureaus
              </h2>

              <p className="text-slate-300 mt-4 leading-relaxed">
                Instead of manually sharing profiles through WhatsApp and
                spreadsheets, bureaus can manage everything in one secure
                dashboard.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Upload bride and groom profiles',
                'Edit profile details anytime',
                'Choose photo privacy',
                'Remove or reactivate profiles',
                'Search profiles from the network',
                'Track contact view activity',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-slate-100">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-500"
            >
              Apply for Membership
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
