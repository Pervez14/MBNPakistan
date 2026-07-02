'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  User,
  Building2,
  Phone,
  MapPin,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type SettingsForm = {
  fullName: string;
  businessName: string;
  roleInBureau: string;
  mobileNumber: string;
  whatsappNumber: string;
  officePhone: string;
  province: string;
  city: string;
  officeAddress: string;
};

const citiesByProvince: Record<string, string[]> = {
  Punjab: [
    'Lahore',
    'Faisalabad',
    'Rawalpindi',
    'Multan',
    'Gujranwala',
    'Sialkot',
    'Bahawalpur',
    'Sargodha',
    'Sheikhupura',
    'Rahim Yar Khan',
    'Jhang',
    'Gujrat',
    'Sahiwal',
    'Okara',
    'Kasur',
    'Dera Ghazi Khan',
    'Jhelum',
    'Chakwal',
    'Mianwali',
    'Vehari',
  ],
  Sindh: [
    'Karachi',
    'Hyderabad',
    'Sukkur',
    'Larkana',
    'Nawabshah',
    'Mirpur Khas',
    'Jacobabad',
    'Shikarpur',
    'Khairpur',
    'Dadu',
    'Thatta',
    'Badin',
  ],
  KPK: [
    'Peshawar',
    'Mardan',
    'Abbottabad',
    'Mingora',
    'Kohat',
    'Bannu',
    'Dera Ismail Khan',
    'Swabi',
    'Charsadda',
    'Nowshera',
    'Mansehra',
  ],
  Balochistan: [
    'Quetta',
    'Gwadar',
    'Turbat',
    'Khuzdar',
    'Chaman',
    'Sibi',
    'Zhob',
    'Loralai',
    'Dera Murad Jamali',
  ],
  Islamabad: ['Islamabad'],
  AJK: ['Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot', 'Bagh', 'Bhimber'],
  'Gilgit-Baltistan': [
    'Gilgit',
    'Skardu',
    'Hunza',
    'Chilas',
    'Ghizer',
    'Astore',
  ],
  Overseas: [
    'United Kingdom',
    'United Arab Emirates',
    'Saudi Arabia',
    'United States',
    'Canada',
    'Australia',
    'Other Overseas',
  ],
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [accountStatus, setAccountStatus] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<SettingsForm>({
    fullName: '',
    businessName: '',
    roleInBureau: '',
    mobileNumber: '',
    whatsappNumber: '',
    officePhone: '',
    province: '',
    city: '',
    officeAddress: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const updateField = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'province' ? { city: '' } : {}),
    }));
  };

  const updatePasswordField = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('Please login again to view account settings.');
      }

      setEmail(user.email);

      const { data, error } = await supabase
        .from('bureau_applications')
        .select(
          `
          full_name,
          business_name,
          role_in_bureau,
          mobile_number,
          whatsapp_number,
          office_phone,
          province,
          city,
          office_address,
          status
        `
        )
        .eq('email', user.email)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No bureau account found for this email.');
      }

      setAccountStatus(data.status || 'pending');

      setFormData({
        fullName: data.full_name || '',
        businessName: data.business_name || '',
        roleInBureau: data.role_in_bureau || '',
        mobileNumber: data.mobile_number || '',
        whatsappNumber: data.whatsapp_number || '',
        officePhone: data.office_phone || '',
        province: data.province || '',
        city: data.city || '',
        officeAddress: data.office_address || '',
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Settings could not be loaded. Please try again.';

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const saveProfileSettings = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSavingProfile(true);
      setErrorMessage('');
      setSuccessMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('Please login again before saving changes.');
      }

      if (!formData.fullName.trim()) {
        throw new Error('Full name is required.');
      }

      if (!formData.businessName.trim()) {
        throw new Error('Business / bureau name is required.');
      }

      if (!formData.mobileNumber.trim()) {
        throw new Error('Mobile number is required.');
      }

      const { error } = await supabase
        .from('bureau_applications')
        .update({
          full_name: formData.fullName.trim(),
          business_name: formData.businessName.trim(),
          role_in_bureau: formData.roleInBureau.trim() || null,
          mobile_number: formData.mobileNumber.trim(),
          whatsapp_number: formData.whatsappNumber.trim() || null,
          office_phone: formData.officePhone.trim() || null,
          province: formData.province || null,
          city: formData.city || null,
          office_address: formData.officeAddress.trim() || null,
        })
        .eq('email', user.email);

      if (error) {
        throw error;
      }

      const existingAuth = localStorage.getItem('mbn-auth');

      if (existingAuth) {
        try {
          const parsed = JSON.parse(existingAuth);

          parsed.state.user.fullName = formData.fullName.trim();
          parsed.state.user.businessName = formData.businessName.trim();

          localStorage.setItem('mbn-auth', JSON.stringify(parsed));
        } catch {
          // Ignore localStorage parse issues.
        }
      }

      setSuccessMessage('Account settings updated successfully.');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Account settings could not be saved. Please try again.';

      setErrorMessage(message);
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSavingPassword(true);
      setErrorMessage('');
      setSuccessMessage('');

      if (passwordData.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters.');
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New password and confirm password do not match.');
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        throw error;
      }

      setPasswordData({
        newPassword: '',
        confirmPassword: '',
      });

      setSuccessMessage('Password changed successfully.');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Password could not be changed. Please try again.';

      setErrorMessage(message);
    } finally {
      setSavingPassword(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const cityOptions = formData.province
    ? citiesByProvince[formData.province] || []
    : [];

  const statusBadge =
    accountStatus === 'approved'
      ? 'bg-green-100 text-green-700'
      : accountStatus === 'rejected'
        ? 'bg-red-100 text-red-700'
        : 'bg-amber-100 text-amber-700';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-72 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-72 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">
          Account Settings
        </h1>

        <p className="text-slate-500 mt-1">
          Manage your bureau account information and password.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Account Status */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-green-700 mt-0.5" />
          <div>
            <h2 className="font-semibold text-slate-900">Account Status</h2>
            <p className="text-sm text-slate-500 mt-1">
              Your bureau account status controls access to profile uploads and
              search.
            </p>
          </div>
        </div>

        <span
          className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusBadge}`}
        >
          {accountStatus || 'pending'}
        </span>
      </div>

      {/* Email Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-start gap-3 mb-5">
          <Mail className="w-6 h-6 text-green-700 mt-0.5" />
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Login Email
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Email is connected with your approval status and uploaded
              profiles.
            </p>
          </div>
        </div>

        <div>
          <label className="label">Email Address</label>
          <input
            value={email}
            readOnly
            className="input-field bg-slate-100 text-slate-500 cursor-not-allowed"
          />

          <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            Email change is disabled for safety. If a bureau needs to change
            email, admin should update Supabase Auth, bureau application email,
            and profile bureau email together.
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <form
        onSubmit={saveProfileSettings}
        className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6"
      >
        <div className="flex items-start gap-3">
          <User className="w-6 h-6 text-green-700 mt-0.5" />
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Bureau Profile Information
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Update your personal and bureau details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name *</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={updateField}
              placeholder="Your full name"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label">Role in Bureau</label>
            <input
              name="roleInBureau"
              value={formData.roleInBureau}
              onChange={updateField}
              placeholder="Owner, Manager, Agent"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Business / Bureau Name *</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name="businessName"
                value={formData.businessName}
                onChange={updateField}
                placeholder="Your bureau name"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Mobile Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={updateField}
                placeholder="+92..."
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">WhatsApp Number</label>
            <input
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={updateField}
              placeholder="+92..."
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Office Phone</label>
            <input
              name="officePhone"
              value={formData.officePhone}
              onChange={updateField}
              placeholder="Office phone number"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Province / Region</label>
            <select
              name="province"
              value={formData.province}
              onChange={updateField}
              className="input-field"
            >
              <option value="">Select Province</option>
              {Object.keys(citiesByProvince).map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                name="city"
                value={formData.city}
                onChange={updateField}
                disabled={!formData.province}
                className="input-field pl-10 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {formData.province ? 'Select City' : 'Select Province First'}
                </option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="label">Office Address</label>
            <textarea
              name="officeAddress"
              value={formData.officeAddress}
              onChange={updateField}
              rows={3}
              placeholder="Office address"
              className="input-field resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {savingProfile ? 'Saving...' : 'Save Account Settings'}
        </button>
      </form>

      {/* Password */}
      <form
        onSubmit={changePassword}
        className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6"
      >
        <div className="flex items-start gap-3">
          <Lock className="w-6 h-6 text-green-700 mt-0.5" />
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Change Password
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Use a strong password with at least 8 characters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">New Password</label>
            <input
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={updatePasswordField}
              placeholder="Enter new password"
              className="input-field"
              minLength={8}
            />
          </div>

          <div>
            <label className="label">Confirm New Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={updatePasswordField}
              placeholder="Confirm new password"
              className="input-field"
              minLength={8}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingPassword}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          {savingPassword ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
