// src/components/profiles/SearchFilters.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const PROVINCES = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan',
  'Azad Kashmir', 'Gilgit-Baltistan', 'Islamabad Capital Territory',
];

const QUALIFICATIONS = [
  'Below Matric', 'Matric', 'Intermediate / FSc / FA', 'Bachelor',
  'Master', 'PhD', 'Hafiz-e-Quran', 'Religious Education',
];

const EMPLOYMENT_TYPES = [
  { value: 'JOB_HOLDER', label: 'Job Holder' },
  { value: 'BUSINESS_OWNER', label: 'Business Owner' },
  { value: 'NOT_WORKING', label: 'Not Working' },
  { value: 'STUDENT', label: 'Student' },
];

const SECTS = ['SUNNI', 'SHIA', 'BARELVI', 'DEOBANDI', 'AHL_E_HADITH'];

interface SearchFiltersProps {
  filters: any;
  onChange: (filters: any) => void;
  activeCount: number;
}

export default function SearchFilters({ filters, onChange, activeCount }: SearchFiltersProps) {
  const [local, setLocal] = useState(filters);

  const update = (key: string, value: any) => {
    const updated = { ...local, [key]: value, page: 1 };
    setLocal(updated);
    onChange(updated);
  };

  const clearAll = () => {
    const reset = {
      gender: '', country: 'Pakistan', province: '', city: '',
      religion: '', sect: '', caste: '', ageMin: '', ageMax: '',
      qualification: '', employmentType: '', maritalStatus: '',
      isOverseas: '', verifiedBureauOnly: '', page: 1, limit: 20,
    };
    setLocal(reset);
    onChange(reset);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900 text-sm">Filters</h3>
        {activeCount > 0 && (
          <button onClick={clearAll}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors">
            <X className="w-3 h-3" />
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <div className="p-4 space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto">

        {/* Gender */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Looking For
          </label>
          <div className="flex gap-2">
            {['', 'MALE', 'FEMALE'].map(g => (
              <button key={g}
                onClick={() => update('gender', g)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
                  ${local.gender === g
                    ? 'bg-green-700 border-green-700 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-green-300'
                  }`}>
                {g === '' ? 'Both' : g === 'MALE' ? 'Male' : 'Female'}
              </button>
            ))}
          </div>
        </div>

        {/* Age Range */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Age Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number" placeholder="Min" min="18" max="70"
              value={local.ageMin}
              onChange={e => update('ageMin', e.target.value)}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="text-slate-400 text-sm">—</span>
            <input
              type="number" placeholder="Max" min="18" max="70"
              value={local.ageMax}
              onChange={e => update('ageMax', e.target.value)}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Province */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Province
          </label>
          <select
            value={local.province}
            onChange={e => update('province', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
            <option value="">All Provinces</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            City
          </label>
          <input
            type="text" placeholder="Search city..."
            value={local.city}
            onChange={e => update('city', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Sect */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Sect
          </label>
          <select
            value={local.sect}
            onChange={e => update('sect', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
            <option value="">All Sects</option>
            {SECTS.map(s => <option key={s} value={s}>{s.replace('_', '-')}</option>)}
          </select>
        </div>

        {/* Caste */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Caste / Biradari
          </label>
          <input
            type="text" placeholder="e.g. Rajput, Syed..."
            value={local.caste}
            onChange={e => update('caste', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Education */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Education
          </label>
          <select
            value={local.qualification}
            onChange={e => update('qualification', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
            <option value="">Any Education</option>
            {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>

        {/* Employment */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Employment
          </label>
          <select
            value={local.employmentType}
            onChange={e => update('employmentType', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
            <option value="">Any Employment</option>
            {EMPLOYMENT_TYPES.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Marital Status
          </label>
          <select
            value={local.maritalStatus}
            onChange={e => update('maritalStatus', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
            <option value="">Any Status</option>
            <option value="SINGLE">Single</option>
            <option value="DIVORCED">Divorced</option>
            <option value="WIDOWED">Widowed</option>
            <option value="SEPARATED">Separated</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-slate-700">Overseas Pakistanis Only</span>
            <div
              onClick={() => update('isOverseas', local.isOverseas === 'true' ? '' : 'true')}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer
                ${local.isOverseas === 'true' ? 'bg-green-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform
                ${local.isOverseas === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-slate-700">Verified Bureaus Only</span>
            <div
              onClick={() => update('verifiedBureauOnly', local.verifiedBureauOnly === 'true' ? '' : 'true')}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer
                ${local.verifiedBureauOnly === 'true' ? 'bg-green-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform
                ${local.verifiedBureauOnly === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
        </div>

      </div>
    </div>
  );
}
