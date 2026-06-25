// src/app/(dashboard)/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { profileAPI } from '@/lib/api';
import ProfileCard from '@/components/profiles/ProfileCard';
import SearchFilters from '@/components/profiles/SearchFilters';
import Pagination from '@/components/shared/Pagination';
import { Search, Filter, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    gender: searchParams.get('gender') || '',
    country: searchParams.get('country') || 'Pakistan',
    province: searchParams.get('province') || '',
    city: searchParams.get('city') || '',
    religion: searchParams.get('religion') || '',
    sect: searchParams.get('sect') || '',
    caste: searchParams.get('caste') || '',
    ageMin: searchParams.get('ageMin') || '',
    ageMax: searchParams.get('ageMax') || '',
    qualification: searchParams.get('qualification') || '',
    employmentType: searchParams.get('employmentType') || '',
    maritalStatus: searchParams.get('maritalStatus') || '',
    isOverseas: searchParams.get('isOverseas') || '',
    verifiedBureauOnly: searchParams.get('verifiedBureauOnly') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 20,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['profiles', 'search', filters],
    queryFn: () => profileAPI.search(filters).then(r => r.data.data),
    staleTime: 30 * 1000,
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => !['page', 'limit', 'country'].includes(k) && v
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Search Profiles</h1>
            {data && (
              <p className="text-slate-500 text-sm mt-1">
                {data.pagination.total.toLocaleString()} profiles found
              </p>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors lg:hidden"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-green-700 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-72 flex-shrink-0`}>
            <SearchFilters
              filters={filters}
              onChange={handleFilterChange}
              activeCount={activeFilterCount}
            />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-green-700 animate-spin" />
              </div>
            ) : !data?.profiles?.length ? (
              <div className="bg-white rounded-xl border border-slate-100 p-16 text-center">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Profiles Found</h3>
                <p className="text-slate-500 text-sm">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              <>
                {isFetching && (
                  <div className="flex items-center gap-2 text-green-700 text-sm mb-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating results...
                  </div>
                )}

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                  {data.profiles.map((profile: any) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>

                <Pagination
                  currentPage={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
