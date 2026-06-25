// src/app/page.tsx
import Link from 'next/link';
import { Shield, Users, Search, CheckCircle, Star, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <span className="font-display font-bold text-green-700 text-lg leading-none block">MBN Pakistan</span>
              <span className="text-xs text-slate-500 leading-none">Marriage Bureau Network</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"
              className="text-slate-600 hover:text-green-700 font-medium text-sm transition-colors">
              Login
            </Link>
            <Link href="/register"
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Join Network
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-950 via-green-800 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-sm font-medium text-white/90">Pakistan's First B2B Marriage Bureau Network</span>
            </div>
            <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Every Bureau Connected.<br />
              <span className="text-gold-400">Every Match Possible.</span>
            </h1>
            <p className="text-lg text-green-100 leading-relaxed mb-8 max-w-2xl">
              Join 10,000+ verified Marriage Bureau operators on one secure platform.
              Share profiles, search Pakistan's largest database, and connect with trusted
              bureaus — with full privacy protection and professional accountability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register"
                className="bg-gold-500 hover:bg-gold-400 text-green-950 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 text-center">
                Register Your Bureau
              </Link>
              <Link href="/login"
                className="border-2 border-white/30 hover:border-white/60 text-white font-medium px-8 py-4 rounded-xl text-lg transition-all text-center">
                Login to Platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '100,000+', label: 'Marriage Profiles' },
            { value: '10,000+', label: 'Bureau Partners' },
            { value: '50+', label: 'Cities Covered' },
            { value: '100%', label: 'Verified Platform' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold text-green-700">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">
            Built for Professional Bureau Operators
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Everything your bureau needs to work smarter, access more profiles, and grow your business.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'Privacy First',
              desc: 'Client photos and contact details are protected. You control who sees what. Every access is logged and tracked.',
              color: 'text-green-700',
              bg: 'bg-green-50',
            },
            {
              icon: Search,
              title: 'Powerful Search',
              desc: 'Filter by city, caste, education, income, sect, and 20+ other criteria across 100,000+ profiles instantly.',
              color: 'text-blue-700',
              bg: 'bg-blue-50',
            },
            {
              icon: Users,
              title: 'Bureau Verification',
              desc: 'Build trust with Verified, Trusted, and Premium badges. Stand out to clients and partner bureaus.',
              color: 'text-gold-600',
              bg: 'bg-amber-50',
            },
            {
              icon: Globe,
              title: 'Pakistan-Wide Network',
              desc: 'Connect profiles from Karachi to Peshawar, overseas Pakistanis in UK, Canada, UAE, and beyond.',
              color: 'text-purple-700',
              bg: 'bg-purple-50',
            },
            {
              icon: CheckCircle,
              title: 'Accountable System',
              desc: 'Every contact reveal is logged. No anonymous sharing. Every bureau is accountable for their activity.',
              color: 'text-green-700',
              bg: 'bg-green-50',
            },
            {
              icon: Star,
              title: 'Free to Start',
              desc: 'Register and explore for free during our launch phase. No credit card required.',
              color: 'text-gold-600',
              bg: 'bg-amber-50',
            },
          ].map(feature => (
            <div key={feature.title}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow">
              <div className={`${feature.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className={`${feature.color} w-6 h-6`} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Ready to Expand Your Bureau's Reach?
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Join Pakistan's most trusted marriage bureau network. Registration is free.
          </p>
          <Link href="/register"
            className="bg-gold-500 hover:bg-gold-400 text-green-950 font-bold px-10 py-4 rounded-xl text-lg transition-all inline-block hover:scale-105">
            Register Your Bureau Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-green-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
                  <span className="text-green-950 font-bold text-sm">M</span>
                </div>
                <span className="font-display font-bold text-white text-xl">MBN Pakistan</span>
              </div>
              <p className="text-green-300 text-sm leading-relaxed">
                Pakistan's first B2B network exclusively for licensed marriage bureau operators.
                Professional, verified, and trusted.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="hover:text-white transition-colors">Register Bureau</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Bureau Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@mbnpakistan.com" className="hover:text-white transition-colors">support@mbnpakistan.com</a></li>
                <li><span>Lahore, Pakistan</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-800 pt-8 text-center text-sm text-green-400">
            © {new Date().getFullYear()} Marriage Bureau Network Pakistan. All rights reserved.
            <span className="mx-2">·</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="mx-2">·</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
