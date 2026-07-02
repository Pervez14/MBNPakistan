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
  Building2,
  HeartHandshake,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
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

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <Link href="/about" className="hover:text-green-700">
              About Us
            </Link>

            <Link href="/how-it-works" className="hover:text-green-700">
              How It Works
            </Link>

            <Link href="/contact" className="hover:text-green-700">
              Contact Us
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

        {/* Mobile nav */}
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3">
          <div className="flex items-center justify-center gap-5 text-xs font-semibold text-slate-600">
            <Link href="/about" className="hover:text-green-700">
              About
            </Link>

            <Link href="/how-it-works" className="hover:text-green-700">
              How It Works
            </Link>

            <Link href="/contact" className="hover:text-green-700">
              Contact
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
              Verified Marriage Bureau Network
            </span>

            <h1 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 mt-6 leading-tight">
              Every Bureau Connected. Every Match Possible.
            </h1>

            <p className="text-lg text-slate-600 mt-6 leading-relaxed">
              MBN Pakistan is a professional digital platform for verified
              marriage bureaus to upload profiles, search suitable matches,
              protect privacy, and manage contact activity in one secure system.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800"
              >
                Apply for Membership
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-white"
              >
                See How It Works
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="w-5 h-5 text-green-700" />
                Verified bureaus
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="w-5 h-5 text-green-700" />
                Privacy controls
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="w-5 h-5 text-green-700" />
                Contact logs
              </div>
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
                  MBN Pakistan
                </h2>
                <p className="text-sm text-slate-500">
                  Marriage Bureau Network
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-green-50 border border-green-100">
                <Users className="w-8 h-8 text-green-700 mb-4" />
                <p className="font-bold text-slate-900">Bureau Profiles</p>
                <p className="text-sm text-slate-600 mt-2">
                  Upload bride and groom profiles with complete details.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                <Search className="w-8 h-8 text-blue-700 mb-4" />
                <p className="font-bold text-slate-900">Smart Search</p>
                <p className="text-sm text-slate-600 mt-2">
                  Search profiles by city, caste, education, profession, and
                  more.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                <Lock className="w-8 h-8 text-amber-700 mb-4" />
                <p className="font-bold text-slate-900">Privacy First</p>
                <p className="text-sm text-slate-600 mt-2">
                  Blur or hide profile photos when privacy is required.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100">
                <Eye className="w-8 h-8 text-purple-700 mb-4" />
                <p className="font-bold text-slate-900">Contact Tracking</p>
                <p className="text-sm text-slate-600 mt-2">
                  Track which bureau viewed which profile contact details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900">
              How It Works
            </h2>

            <p className="text-slate-600 mt-4">
              A simple professional system for verified marriage bureaus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
                <ShieldCheck className="w-7 h-7 text-green-700" />
              </div>

              <h3 className="font-heading text-xl font-bold text-slate-900">
                1. Apply & Get Approved
              </h3>

              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Marriage bureaus apply for membership. Admin reviews and
                approves serious bureaus.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
                <Upload className="w-7 h-7 text-green-700" />
              </div>

              <h3 className="font-heading text-xl font-bold text-slate-900">
                2. Upload Profiles
              </h3>

              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Approved bureaus upload bride and groom profiles with privacy
                settings.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
                <Search className="w-7 h-7 text-green-700" />
              </div>

              <h3 className="font-heading text-xl font-bold text-slate-900">
                3. Search & Connect
              </h3>

              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Search network profiles and reveal contact details when needed.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800"
            >
              Learn More
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
              Built for professional marriage bureaus
            </h2>

            <p className="text-slate-600 mt-4 leading-relaxed">
              Instead of managing profiles through WhatsApp, notebooks, or
              scattered files, MBN Pakistan gives bureaus one organized platform
              to upload, search, and manage profiles professionally.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/about"
                className="inline-flex justify-center px-6 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50"
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className="inline-flex justify-center px-6 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              'Verified bureau access only',
              'Profile photo privacy: public, blurred, or hidden',
              'Hidden contact details until View Contact is clicked',
              'Admin can track contact view history',
              'Search by province, city, caste, education, and employment',
              'Uploader can edit, remove, or reactivate profiles',
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
            Ready to join MBN Pakistan?
          </h2>

          <p className="text-green-50 mt-4 max-w-2xl mx-auto">
            Apply as a verified marriage bureau and start using a professional
            matchmaking dashboard.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex justify-center px-6 py-3 rounded-lg bg-white text-green-700 font-bold hover:bg-green-50"
            >
              Apply for Membership
            </Link>

            <Link
              href="/contact"
              className="inline-flex justify-center px-6 py-3 rounded-lg border border-green-300 text-white font-bold hover:bg-green-600"
            >
              Contact Us
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
                  <p className="text-xs text-slate-400">
                    Marriage Bureau Network
                  </p>
                </div>
              </div>

              <p className="text-slate-400 text-sm mt-5 max-w-md leading-relaxed">
                A professional platform for verified marriage bureaus to manage
                profiles, search suitable matches, and protect candidate
                privacy.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Website</h3>

              <div className="space-y-3 text-sm text-slate-400">
                <Link href="/about" className="block hover:text-white">
                  About Us
                </Link>

                <Link href="/how-it-works" className="block hover:text-white">
                  How It Works
                </Link>

                <Link href="/contact" className="block hover:text-white">
                  Contact Us
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Bureau Access</h3>

              <div className="space-y-3 text-sm text-slate-400">
                <Link href="/login" className="block hover:text-white">
                  Login
                </Link>

                <Link href="/register" className="block hover:text-white">
                  Apply for Membership
                </Link>

                <Link href="/dashboard" className="block hover:text-white">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} MBN Pakistan. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <HeartHandshake className="w-4 h-4" />
              Built for verified marriage bureaus
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
