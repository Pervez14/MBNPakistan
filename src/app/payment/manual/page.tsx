'use client';

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Copy,
  CreditCard,
  Upload,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const paymentAccounts = [
  {
    method: 'JazzCash',
    title: 'JazzCash Payment',
    accountName: 'MUHAMMAD PERVEEZ',
    number: '03036684534',
    accountNumber: '',
    iban: '',
  },
  {
    method: 'Easypaisa',
    title: 'Easypaisa Payment',
    accountName: 'MUHAMMAD PERVEZ',
    number: '03336612404',
    accountNumber: '',
    iban: '',
  },
  {
    method: 'Meezan Bank',
    title: 'Meezan Bank Limited',
    accountName: 'MUHAMMAD PERVEZ',
    number: '',
    accountNumber: '05140112475320',
    iban: 'PK66MEZN0005140112475320',
  },
];

const planAmounts: Record<string, number> = {
  'Premium Match Access': 799,
  'Verified Premium': 1499,
  'Personal Matchmaking': 4999,
};

function getParam(searchParams: URLSearchParams, key: string) {
  return searchParams.get(key) || '';
}

export default function ManualPaymentPage() {
  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const planFromUrl = getParam(params, 'plan') || 'Verified Premium';

  const amountFromUrl =
    Number(getParam(params, 'amount')) ||
    planAmounts[planFromUrl] ||
    1499;

  const referenceFromUrl =
    getParam(params, 'reference');

  const [formData, setFormData] = useState({
    planType: planFromUrl,
    amountPkr: String(amountFromUrl),
    profileReference: referenceFromUrl,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    paymentMethod: 'JazzCash',
    transactionId: '',
    notes: '',
  });

  const [selectedScreenshot, setSelectedScreenshot] =
    useState<File | null>(null);

  const [screenshotPreview, setScreenshotPreview] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const selectedAccount = useMemo(
    () =>
      paymentAccounts.find(
        (account) =>
          account.method === formData.paymentMethod
      ) || paymentAccounts[0],
    [formData.paymentMethod]
  );

  const updateField = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'planType'
        ? {
            amountPkr: String(planAmounts[value] || prev.amountPkr),
          }
        : {}),
    }));
  };

  const copyPaymentDetails = async () => {
    const details = [
      selectedAccount.title,
      `Account Title: ${selectedAccount.accountName}`,
      selectedAccount.number
        ? `Number: ${selectedAccount.number}`
        : '',
      selectedAccount.accountNumber
        ? `Account Number: ${selectedAccount.accountNumber}`
        : '',
      selectedAccount.iban
        ? `IBAN: ${selectedAccount.iban}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(details);
    } catch {
      setErrorMessage(
        'Payment details could not be copied automatically. Please copy manually.'
      );
    }
  };

  const handleScreenshotChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        'Please upload JPG, PNG, or WEBP screenshot only.'
      );
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        'Payment screenshot must be smaller than 5MB.'
      );
      e.target.value = '';
      return;
    }

    setErrorMessage('');
    setSelectedScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const uploadScreenshot = async () => {
    if (!selectedScreenshot) return null;

    const safeFileName =
      selectedScreenshot.name
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.-]/g, '')
        .toLowerCase();

    const randomFolder =
      typeof crypto !== 'undefined' &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    const filePath =
      `${randomFolder}/${Date.now()}-${safeFileName}`;

    const { error } = await supabase.storage
      .from('payment-screenshots')
      .upload(filePath, selectedScreenshot, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from('payment-screenshots')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const submitPayment = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      if (!formData.customerName.trim()) {
        throw new Error('Please enter customer name.');
      }

      if (!formData.customerPhone.trim()) {
        throw new Error('Please enter phone / WhatsApp number.');
      }

      if (!formData.profileReference.trim()) {
        throw new Error('Please enter profile reference number.');
      }

      if (!formData.transactionId.trim()) {
        throw new Error('Please enter transaction ID.');
      }

      if (!selectedScreenshot) {
        throw new Error('Please upload payment screenshot.');
      }

      const screenshotUrl =
        await uploadScreenshot();

      const { error } = await supabase
        .from('premium_orders')
        .insert({
          profile_reference:
            formData.profileReference.trim(),
          customer_name:
            formData.customerName.trim(),
          customer_phone:
            formData.customerPhone.trim(),
          customer_email:
            formData.customerEmail.trim() || null,
          user_type: 'public_user',
          plan_type: formData.planType,
          amount_pkr: Number(formData.amountPkr) || 0,
          payment_method: formData.paymentMethod,
          payment_status: 'pending',
          payment_screenshot_url: screenshotUrl,
          transaction_id:
            formData.transactionId.trim(),
          admin_notes:
            formData.notes.trim() || null,
        });

      if (error) {
        throw error;
      }

      setSuccessMessage(
        'Payment proof submitted successfully. MBN Pakistan will verify and activate your premium plan after approval.'
      );

      setSelectedScreenshot(null);
      setScreenshotPreview('');
      setFormData((prev) => ({
        ...prev,
        transactionId: '',
        notes: '',
      }));

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Payment proof could not be submitted. Please try again.';

      setErrorMessage(message);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f8f4] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/submit-profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-green-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Submit Profile
        </Link>

        <div className="mt-6 rounded-[2rem] bg-[#0b5f38] p-8 text-white md:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <CreditCard className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-green-100">
                MBN Pakistan Premium
              </p>
              <h1 className="font-heading text-3xl font-black md:text-5xl">
                Manual Payment Verification
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-green-50/90 leading-7">
            Pay through JazzCash, Easypaisa, or Meezan Bank, then upload your transaction ID
            and payment screenshot. Super Admin will verify the payment and
            activate your premium plan.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">

          <aside className="space-y-5">
            {paymentAccounts.map((account) => (
              <div
                key={account.method}
                className={`rounded-3xl border p-6 ${
                  formData.paymentMethod === account.method
                    ? 'border-green-300 bg-white shadow-sm'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-green-700">
                  {account.title}
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Account Title
                    </p>
                    <p className="text-lg font-black text-slate-950">
                      {account.accountName}
                    </p>
                  </div>

                  {account.number && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Mobile Number
                      </p>
                      <p className="font-heading text-2xl font-black text-slate-950">
                        {account.number}
                      </p>
                    </div>
                  )}

                  {account.accountNumber && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Account Number
                      </p>
                      <p className="font-mono text-lg font-black text-slate-950 break-all">
                        {account.accountNumber}
                      </p>
                    </div>
                  )}

                  {account.iban && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        IBAN
                      </p>
                      <p className="font-mono text-sm font-black text-slate-950 break-all">
                        {account.iban}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: account.method,
                    }));
                    copyPaymentDetails();
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white hover:bg-green-800"
                >
                  <Copy className="w-4 h-4" />
                  Copy Details
                </button>
              </div>
            ))}

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />

                <p className="text-sm leading-6 text-amber-800">
                  Your premium plan will activate only after admin verifies
                  the transaction ID and screenshot.
                </p>
              </div>
            </div>
          </aside>

          <form
            onSubmit={submitPayment}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-6"
          >
            <div>
              <h2 className="font-heading text-2xl font-black text-slate-950">
                Submit Payment Proof
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Complete this form after sending payment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="label">Plan *</label>
                <select
                  name="planType"
                  value={formData.planType}
                  onChange={updateField}
                  className="input-field"
                  required
                >
                  {Object.keys(planAmounts).map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Amount PKR *</label>
                <input
                  name="amountPkr"
                  value={formData.amountPkr}
                  onChange={updateField}
                  className="input-field bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="label">Profile Reference *</label>
                <input
                  name="profileReference"
                  value={formData.profileReference}
                  onChange={updateField}
                  placeholder="MBN-MTN-G-10001"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={updateField}
                  className="input-field"
                  required
                >
                  <option value="JazzCash">JazzCash</option>
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="Meezan Bank">Meezan Bank</option>
                </select>
              </div>

              <div>
                <label className="label">Customer Name *</label>
                <input
                  name="customerName"
                  value={formData.customerName}
                  onChange={updateField}
                  placeholder="Your full name"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Phone / WhatsApp *</label>
                <input
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={updateField}
                  placeholder="+92 300 1234567"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={updateField}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Transaction ID *</label>
                <input
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={updateField}
                  placeholder="JazzCash / Easypaisa transaction ID"
                  className="input-field"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Payment Screenshot *</label>

                <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center hover:bg-slate-100">
                  {screenshotPreview ? (
                    <img
                      src={screenshotPreview}
                      alt="Payment screenshot preview"
                      className="max-h-56 rounded-xl object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="w-9 h-9 text-slate-400" />
                      <p className="mt-3 text-sm font-bold text-slate-700">
                        Upload payment screenshot
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        JPG, PNG, WEBP. Max 5MB.
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={updateField}
                  rows={3}
                  placeholder="Optional message for MBN Pakistan admin..."
                  className="input-field resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-green-700 px-6 py-4 text-lg font-black text-white hover:bg-green-800 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Submitting Payment Proof...'
                : 'Submit Payment Proof'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
