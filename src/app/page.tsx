import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Users,
  MapPin,
  Lock,
  BadgeCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const stats = [
  { value: '100,000+', label: 'Marriage Profiles' },
  { value: '10,000+', label: 'Bureau Partners' },
  { value: '50+', label: 'Cities Covered' },
  { value: '100%', label: 'Verified Platform' },
];

const features = [
  {
    icon: Lock,
    title: 'Privacy First',
    text: 'Client photos and contact details are protected. You control who sees what.',
  },
  {
    icon: Search,
    title: 'Powerful Search',
    text: 'Filter by city, caste, education, income, sect, profession, and more.',
  },
  {
    icon: BadgeCheck,
    title: 'Bureau Verification',
    text: 'Build trust with verified, trusted, and premium bureau badges.',
  },
  {
    icon: MapPin,
    title: 'Pakistan-Wide Network',
    text: 'Connect across Karachi, Lahore, Islamabad, Peshawar, Multan, Faisalabad, and beyond.',
  },
  {
    icon: Users,
    title: 'Profile Management',
    text: 'Upload, manage, organize, and share profiles from one secure dashboard.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Access Logs',
    text: 'Every contact reveal and profile access can be tracked for better accountability.',
  },
];

const steps = [
  'Register your marriage bureau',
  'Get verified by MBN Pakistan',
  'Upload and manage profiles',
  'Search and connect with trusted bureaus',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/mbn-logo.png"
              alt="MBN Pakistan"
              className="h-16 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-green-700">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-green-700">
              How It Works
            </a>
            <a href="#network" className="hover:text-green-700">
              Network
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-green-800 hover:text-green-900"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition"
            >
              Join Network
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-green-700">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white,_transparent_35%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm mb-6">
              <Building2 className="w-4 h-4 text-amber-300" />
              Pakistan&apos;s First B2B Marriage Bureau Network
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Every Bureau Connected.
              <span className="block text-amber-300">Every Match Possible.</span>
            </h1>

            <p className="mt-6 text-lg text-green-50 max-w-xl leading-relaxed">
              Join a secure professional platform built for marriage bureau
              operators in Pakistan. Upload profiles, search verified bureaus,
              protect client privacy, and grow your network.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-amber-400 text-green-950 font-bold hover:bg-amber-300 transition"
              >
                Register Your Bureau
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition"
              >
                Login to Platform
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
            <img
              src="/mbn-logo.png"
              alt="MBN Pakistan Logo"
              className="w-full max-w-md mx-auto object-contain"
            />

            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-slate-50 border border-slate-100 p-5 text-center"
                >
                  <p className="text-2xl font-bold text-green-800">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-green-700 font-semibold uppercase tracking-wide text-sm">
              Built for Professional Bureau Operators
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Everything your bureau needs to work smarter
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              A secure, organized, and professional system for managing marriage
              profiles and connecting with verified partners.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-slate-600 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-green-700 font-semibold uppercase tracking-wide text-sm">
              Simple Process
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Start connecting with trusted bureaus in minutes
            </h2>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              MBN Pakistan is designed to help professional bureaus create a
              trusted digital network without losing control of private client
              information.
            </p>

            <div className="mt-8 space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-slate-800 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-green-950 p-8 lg:p-10 text-white">
            <h3 className="font-serif text-2xl font-bold">
              Why marriage bureaus need MBN Pakistan
            </h3>

            <div className="mt-7 space-y-5">
              {[
                'Reduce manual profile sharing',
                'Protect client contact details',
                'Access a wider verified bureau network',
                'Organize profiles in one professional dashboard',
                'Build trust with verification badges',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-300 flex-shrink-0" />
                  <span className="text-green-50">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Network */}
      <section id="network" className="py-20 bg-gradient-to-br from-slate-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-green-700 font-semibold uppercase tracking-wide text-sm">
            Pakistan-Wide Network
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Connect bureaus across Pakistan and overseas communities
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
            From Karachi to Lahore, Islamabad to Peshawar, and overseas
            Pakistanis in the UK, Canada, UAE, and beyond — MBN Pakistan helps
            bureaus build trusted connections.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              'Karachi',
              'Lahore',
              'Islamabad',
              'Rawalpindi',
              'Peshawar',
              'Faisalabad',
              'Multan',
              'Quetta',
              'Hyderabad',
              'Overseas Pakistanis',
            ].map((city) => (
              <span
                key={city}
                className="px-5 py-2 rounded-full bg-white border border-green-100 text-green-800 font-medium shadow-sm"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Ready to grow your marriage bureau network?
          </h2>
          <p className="mt-4 text-green-50 text-lg">
            Join MBN Pakistan and bring your bureau into a secure, professional,
            digital matchmaking network.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-400 text-green-950 font-bold hover:bg-amber-300 transition"
            >
              Join MBN Pakistan
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/mbn-logo.png"
              alt="MBN Pakistan"
              className="h-12 w-auto object-contain"
            />
          </div>

          <p className="text-sm text-slate-500">
            © 2026 MBN Pakistan. Marriage Bureau Network.
          </p>
        </div>
      </footer>
    </main>
  );
}
