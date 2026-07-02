import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  HeartHandshake,
  Search,
  Building2,
  Lock,
  CheckCircle,
} from 'lucide-react';

export default function AboutPage() {
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
            <Link href="/about" className="text-green-700">
              About
            </Link>
            <Link href="/how-it-works" className="hover:text-green-700">
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
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold border border-green-100">
              <ShieldCheck className="w-4 h-4" />
              Trusted Bureau Network
            </span>

            <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-6 leading-tight">
              About MBN Pakistan
            </h1>

            <p className="text-lg text-slate-600 mt-5 leading-relaxed">
              MBN Pakistan is a professional digital platform created to connect
              verified marriage bureaus across Pakistan. Our goal is to make
              matchmaking more organized, secure, and transparent for bureaus
              and families.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex justify-center px-6 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
              >
                Join as Bureau
              </Link>

              <Link
                href="/how-it-works"
                className="inline-flex justify-center px-6 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-white"
              >
                How It Works
              </Link>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-green-50">
                <Users className="w-8 h-8 text-green-700 mb-4" />
                <p className="font-bold text-slate-900">Verified Bureaus</p>
                <p className="text-sm text-slate-600 mt-2">
                  Only approved bureaus can upload and search profiles.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50">
                <Search className="w-8 h-8 text-blue-700 mb-4" />
                <p className="font-bold text-slate-900">Smart Search</p>
                <p className="text-sm text-slate-600 mt-2">
                  Search by city, caste, gender, education, and more.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50">
                <Lock className="w-8 h-8 text-amber-700 mb-4" />
                <p className="font-bold text-slate-900">Privacy Options</p>
                <p className="text-sm text-slate-600 mt-2">
                  Photos and contact details can be controlled safely.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50">
                <Building2 className="w-8 h-8 text-purple-700 mb-4" />
                <p className="font-bold text-slate-900">Bureau Dashboard</p>
                <p className="text-sm text-slate-600 mt-2">
                  Manage uploaded profiles and contact view activity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="max-w-3xl">
            <h2 className="font-heading text-3xl font-bold text-slate-900">
              Our Mission
            </h2>

            <p className="text-slate-600 mt-4 leading-relaxed">
              Marriage bureaus often manage profiles through WhatsApp, notebooks,
              spreadsheets, or scattered contacts. MBN Pakistan brings those
              workflows into one professional system where bureaus can upload,
              organize, search, and connect more efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
              <HeartHandshake className="w-8 h-8 text-green-700 mb-4" />
              <h3 className="font-bold text-slate-900">Build Trust</h3>
              <p className="text-sm text-slate-600 mt-2">
                Help bureaus work with verified members and reduce random,
                unorganized profile sharing.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
              <Lock className="w-8 h-8 text-green-700 mb-4" />
              <h3 className="font-bold text-slate-900">Protect Privacy</h3>
              <p className="text-sm text-slate-600 mt-2">
                Contact details stay hidden until an approved user chooses to
                view them.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
              <CheckCircle className="w-8 h-8 text-green-700 mb-4" />
              <h3 className="font-bold text-slate-900">Improve Matching</h3>
              <p className="text-sm text-slate-600 mt-2">
                Make it easier to find suitable matches by profile details,
                location, education, and family requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-slate-900">
            Why MBN Pakistan?
          </h2>

          <p className="text-slate-600 mt-4">
            We are building a modern platform for serious marriage bureaus who
            want a more professional way to serve families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {[
            'Verified bureau access',
            'Profile privacy controls',
            'Hidden contact details until requested',
            'Admin contact-view tracking',
            'City and province based search',
            'Professional bureau dashboard',
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
      </section>

      {/* CTA */}
      <section className="bg-green-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">
            Join the MBN Pakistan network
          </h2>

          <p className="text-green-50 mt-3 max-w-2xl mx-auto">
            Apply as a marriage bureau and start managing profiles through a
            professional digital dashboard.
          </p>

          <Link
            href="/register"
            className="inline-flex mt-6 px-6 py-3 rounded-lg bg-white text-green-700 font-bold hover:bg-green-50"
          >
            Apply for Membership
          </Link>
        </div>
      </section>
    </div>
  );
}
