// src/app/(admin)/admin/analytics/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import {
  Users, FileText, Eye, TrendingUp, UserCheck, Clock,
  BarChart2, PieChart
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart as RechartsPie, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#166e46', '#c8a84b', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316'];

function MetricCard({ label, value, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminAPI.getAnalytics().then(r => r.data.data),
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: growth } = useQuery({
    queryKey: ['admin', 'analytics', 'growth'],
    queryFn: () => adminAPI.getGrowthData(6).then(r => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const religionData = data?.religiousDistribution?.map((r: any) => ({
    name: r.religion,
    value: r.count,
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
        <p className="text-slate-500 mt-1">Real-time platform statistics and growth metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Bureaus" value={data?.users?.total} icon={Users} color="bg-green-50 text-green-700" />
        <MetricCard label="Approved Bureaus" value={data?.users?.approved} icon={UserCheck} color="bg-blue-50 text-blue-700" />
        <MetricCard label="Pending Approval" value={data?.users?.pending} icon={Clock} color="bg-amber-50 text-amber-700" />
        <MetricCard label="Total Profiles" value={data?.profiles?.total} icon={FileText} color="bg-purple-50 text-purple-700" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Male Profiles" value={data?.profiles?.male} icon={Users} color="bg-blue-50 text-blue-700" />
        <MetricCard label="Female Profiles" value={data?.profiles?.female} icon={Users} color="bg-pink-50 text-pink-700" />
        <MetricCard label="Reveals Today" value={data?.contactReveals?.today} icon={Eye} color="bg-green-50 text-green-700" />
        <MetricCard label="Reveals This Month" value={data?.contactReveals?.thisMonth} icon={TrendingUp} color="bg-gold-50 text-gold-600" />
      </div>

      {/* Growth Charts */}
      {growth && (
        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Monthly Growth</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="newUsers" name="New Bureaus" fill="#166e46" radius={[4, 4, 0, 0]} />
                <Bar dataKey="newProfiles" name="New Profiles" fill="#c8a84b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Contact Reveals Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="contactReveals"
                  name="Contact Reveals"
                  stroke="#166e46"
                  strokeWidth={2}
                  dot={{ fill: '#166e46' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Distribution Charts */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Top Cities */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Top Cities by Profiles</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data?.topCities || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="city" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" name="Profiles" fill="#166e46" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Religion Distribution */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Religion Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RechartsPie>
              <Pie
                data={religionData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {religionData.map((_: any, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
