'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  FileCheck2,
  HelpCircle,
  Loader2,
  LockKeyhole,
  Mail,
  Network,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

function UrduText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span dir="rtl" lang="ur" className={`block font-normal leading-7 ${className}`}>
      {children}
    </span>
  );
}

function friendlyLoginError(message: string) {
  const normalised = message.toLowerCase();

  if (normalised.includes('invalid login credentials')) {
    return {
      en: 'The email or password is incorrect. Please check your details and try again.',
      ur: 'ای میل یا پاس ورڈ درست نہیں۔ براہِ کرم اپنی معلومات دوبارہ چیک کریں۔',
    };
  }

  if (normalised.includes('email not confirmed')) {
    return {
      en: 'Please verify your email address before signing in.',
      ur: 'لاگ اِن کرنے سے پہلے براہِ کرم اپنی ای میل کی تصدیق مکمل کریں۔',
    };
  }

  if (normalised.includes('no bureau application')) {
    return {
      en: 'No bureau application was found for this email. Please apply for network membership first.',
      ur: 'اس ای میل کے ساتھ کوئی بیورو درخواست موجود نہیں۔ پہلے نیٹ ورک رکنیت کے لیے درخواست جمع کریں۔',
    };
  }

  if (normalised.includes('pending approval')) {
    return {
      en: 'Your bureau application is still under review. Login will become available after approval.',
      ur: 'آپ کی بیورو درخواست ابھی زیرِ جائزہ ہے۔ منظوری کے بعد لاگ اِن دستیاب ہوگا۔',
    };
  }

  if (normalised.includes('not approved') || normalised.includes('rejected')) {
    return {
      en: 'This bureau application is not approved for workspace access. Please contact MBN Pakistan support.',
      ur: 'اس بیورو درخواست کو ورک اسپیس تک رسائی کی منظوری حاصل نہیں۔ براہِ کرم ایم بی این پاکستان سپورٹ سے رابطہ کریں۔',
    };
  }

  return {
    en: message || 'Login failed. Please try again.',
    ur: 'لاگ اِن مکمل نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔',
  };
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ en: string; ur: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Login failed. Please try again.');
      }

      const applicationEmail = authData.user.email?.trim().toLowerCase() || cleanEmail;

      const { data: application, error: applicationError } = await supabase
        .from('bureau_applications')
        .select('*')
        .ilike('email', applicationEmail)
        .maybeSingle();

      if (applicationError || !application) {
        await supabase.auth.signOut();
        throw new Error(
          'No bureau application found for this email. Please apply for membership first.'
        );
      }

      if (application.status !== 'approved') {
        await supabase.auth.signOut();

        if (application.status === 'pending') {
          throw new Error(
            'Your application is still pending approval. Please wait for admin approval.'
          );
        }

        if (application.status === 'rejected') {
          throw new Error(
            'Your application was not approved. Please contact MBN Pakistan support.'
          );
        }

        throw new Error('Your account is not approved yet.');
      }

      localStorage.setItem(
        'mbn-auth',
        JSON.stringify({
          state: {
            user: {
              id: authData.user.id,
              fullName: application.full_name,
              businessName: application.business_name,
              email: application.email,
              role: 'BUREAU_OWNER',
              accountStatus: 'APPROVED',
              subscriptionStatus: 'ACTIVE',
              badges: ['VERIFIED'],
            },
            accessToken: authData.session?.access_token,
            isAuthenticated: true,
            isAdmin: false,
          },
          version: 0,
        })
      );

      router.replace('/dashboard');
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setErrorMessage(friendlyLoginError(message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#f6f5ef] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-16 h-96 w-96 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute -right-36 bottom-0 h-[28rem] w-[28rem] rounded-full bg-amber-100/70 blur-3xl" />
        <div className="login-grid absolute inset-0 opacity-[0.28]" />
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-[1480px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
          aria-label="Go to MBN Pakistan homepage"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-[0_12px_30px_rgba(15,76,53,0.10)] transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-14 sm:w-14">
            <Image
              src="/mbn-logo.png"
              alt="MBN Pakistan"
              width={56}
              height={56}
              priority
              className="h-10 w-10 object-contain sm:h-12 sm:w-12"
            />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-black tracking-tight text-[#0c5139]">
              MBN Pakistan
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Marriage Bureau Network
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/how-it-works"
            className="hidden rounded-full px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-white hover:text-[#0c5139] md:inline-flex"
          >
            How it works
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-4 py-2.5 text-sm font-extrabold text-[#0c5139] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:px-5"
          >
            Apply as a Bureau
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-[1480px] gap-5 px-4 pb-8 pt-2 sm:px-8 sm:pb-12 lg:min-h-[calc(100svh-96px)] lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch lg:gap-6 lg:px-12 lg:pb-10">
        <aside className="login-enter-left relative hidden min-h-[720px] overflow-hidden rounded-[2.2rem] bg-[#073f2e] p-8 text-white shadow-[0_30px_80px_rgba(7,63,46,0.22)] lg:flex lg:flex-col xl:p-11">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-amber-200/10 blur-3xl" />
            <div className="login-dark-grid absolute inset-0 opacity-20" />
          </div>

          <div className="relative z-10 flex h-full flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-50 backdrop-blur-xl">
              <BadgeCheck className="h-4 w-4 text-emerald-300" />
              Approved bureau workspace
            </div>

            <div className="mt-8 max-w-2xl">
              <h1 className="font-heading text-4xl font-black leading-[1.04] tracking-[-0.035em] text-white xl:text-[3.35rem]">
                Welcome back to a more organised way of matchmaking.
              </h1>
              <UrduText className="mt-5 max-w-xl text-xl text-emerald-50/85">
                ایک منظم، محفوظ اور پیشہ ورانہ رشتہ مینجمنٹ ورک اسپیس میں خوش آمدید۔
              </UrduText>
              <p className="mt-5 max-w-xl text-base leading-8 text-emerald-50/70">
                Access structured profiles, relevant searches, assigned cases and follow-up records from one private professional dashboard.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Private access',
                  urdu: 'محفوظ رسائی',
                },
                {
                  icon: FileCheck2,
                  title: 'Structured records',
                  urdu: 'منظم ریکارڈ',
                },
                {
                  icon: Network,
                  title: 'Professional network',
                  urdu: 'پیشہ ور نیٹ ورک',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.075] p-4 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-300/15 text-emerald-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-sm font-extrabold text-white">{item.title}</p>
                    <UrduText className="mt-1 text-xs text-emerald-50/65">{item.urdu}</UrduText>
                  </div>
                );
              })}
            </div>

            <div className="relative mt-auto pt-8">
              <div className="login-dashboard-glow absolute inset-x-10 bottom-8 h-32 rounded-full bg-emerald-300/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.65rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between px-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                    <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/75">
                      MBN Bureau Workspace
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-200">
                    Secure
                  </span>
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
                  <Image
                    src="/mbn-bureau-dashboard.png"
                    alt="MBN Pakistan bureau dashboard preview"
                    width={1200}
                    height={760}
                    className="h-auto w-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="login-enter-right flex items-center justify-center py-2 lg:py-0">
          <div className="w-full max-w-[650px]">
            <div className="mb-5 rounded-[1.7rem] border border-emerald-900/10 bg-[#0b5039] px-5 py-5 text-white shadow-[0_20px_55px_rgba(12,81,57,0.18)] lg:hidden">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
                  <Building2 className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-black">Approved Bureau Workspace</p>
                  <UrduText className="mt-1 text-sm text-emerald-50/75">
                    منظور شدہ میرج بیوروز کے لیے محفوظ ورک اسپیس
                  </UrduText>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_28px_80px_rgba(33,60,48,0.13)] backdrop-blur-2xl sm:p-8 xl:p-10">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-800">
                  <LockKeyhole className="h-4 w-4" />
                  Secure bureau login
                </div>
                <h2 className="mt-5 font-heading text-3xl font-black leading-tight tracking-[-0.03em] text-[#073f2e] sm:text-4xl">
                  Access your verified workspace
                </h2>
                <UrduText className="mt-3 text-lg text-slate-600">
                  اپنے منظور شدہ میرج بیورو ورک اسپیس میں لاگ اِن کریں
                </UrduText>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                  This login is available only to approved bureau members with an activated account.
                </p>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                      <AlertCircle className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold leading-6 text-rose-800">{errorMessage.en}</p>
                      <UrduText className="mt-1 text-sm text-rose-700">{errorMessage.ur}</UrduText>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="bureau-email" className="mb-2.5 block">
                    <span className="block text-sm font-extrabold text-slate-800">Email address</span>
                    <UrduText className="mt-0.5 text-xs text-slate-500">ای میل ایڈریس</UrduText>
                  </label>
                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-700" />
                    <input
                      id="bureau-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-4 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-emerald-900/20 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                      placeholder="you@bureau.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2.5 flex items-end justify-between gap-4">
                    <label htmlFor="bureau-password" className="block">
                      <span className="block text-sm font-extrabold text-slate-800">Password</span>
                      <UrduText className="mt-0.5 text-xs text-slate-500">پاس ورڈ</UrduText>
                    </label>
                    <Link
                      href="/contact"
                      className="text-xs font-extrabold text-emerald-800 transition-colors hover:text-emerald-950 hover:underline"
                    >
                      Need password help?
                    </Link>
                  </div>
                  <div className="group relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-700" />
                    <input
                      id="bureau-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-14 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-emerald-900/20 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 disabled:cursor-not-allowed"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.trim() || !password}
                  className="login-submit group relative mt-2 flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#0b5039] px-6 text-base font-black text-white shadow-[0_16px_35px_rgba(11,80,57,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#073f2e] hover:shadow-[0_20px_42px_rgba(11,80,57,0.30)] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
                >
                  <span className="login-button-shine absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/20" />
                  <span className="relative flex items-center gap-2.5">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verifying access…
                      </>
                    ) : (
                      <>
                        Login to Bureau Workspace
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </button>

                <UrduText className="-mt-1 text-center text-sm text-slate-500">
                  بیورو ورک اسپیس میں محفوظ لاگ اِن
                </UrduText>
              </form>

              <div className="my-7 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <Clock3 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-amber-950">Application pending?</p>
                      <p className="mt-1 text-xs leading-5 text-amber-800/80">
                        Access opens only after approval and account activation.
                      </p>
                      <UrduText className="mt-1 text-xs text-amber-800/80">
                        منظوری اور اکاؤنٹ فعال ہونے کے بعد رسائی ملے گی۔
                      </UrduText>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-emerald-950">New professional bureau?</p>
                      <Link
                        href="/register"
                        className="mt-1 inline-flex items-center gap-1 text-xs font-black text-emerald-800 hover:underline"
                      >
                        Start verification application
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <UrduText className="mt-1 text-xs text-emerald-800/80">
                        تصدیقی درخواست جمع کرائیں۔
                      </UrduText>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3.5 text-center sm:flex-row sm:text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  Your session is handled through secure authentication.
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0c5139] hover:underline"
                >
                  <HelpCircle className="h-4 w-4" />
                  Contact support
                </Link>
              </div>
            </div>

            <Link
              href="/"
              className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-white hover:text-[#0c5139]"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to MBN Pakistan
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .login-grid {
          background-image:
            linear-gradient(rgba(12, 81, 57, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(12, 81, 57, 0.045) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .login-dark-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: linear-gradient(to bottom right, black, transparent 85%);
        }

        .login-enter-left {
          animation: loginEnterLeft 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .login-enter-right {
          animation: loginEnterRight 760ms 90ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .login-dashboard-glow {
          animation: loginPulse 4.8s ease-in-out infinite;
        }

        .login-submit:hover .login-button-shine {
          animation: loginShine 900ms ease forwards;
        }

        @keyframes loginEnterLeft {
          from {
            opacity: 0;
            transform: translate3d(-24px, 16px, 0) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes loginEnterRight {
          from {
            opacity: 0;
            transform: translate3d(24px, 18px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes loginPulse {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.04);
          }
        }

        @keyframes loginShine {
          from {
            left: -35%;
          }
          to {
            left: 125%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-enter-left,
          .login-enter-right,
          .login-dashboard-glow,
          .login-button-shine {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
