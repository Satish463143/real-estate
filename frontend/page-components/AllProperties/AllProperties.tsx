'use client';
import React, { useState, useEffect } from 'react';
import { Pagination } from 'flowbite-react';
import PropertySidebarFilter, { PropertyFilterParams } from '@/components/section/AllProperties/PropertySidebarFilter';
import PropertyList from '@/components/section/AllProperties/PropertyList';
import { useListForHomeQuery } from '@/components/api/properties.api';

const AllProperties = () => {
  const [page, setPage] = useState(1);
  const limit = 9;
  
  const [filters, setFilters] = useState<PropertyFilterParams>({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data, isLoading, isFetching } = useListForHomeQuery({
    page,
    limit,
    ...filters
  });
  console.log('data',data)

  const properties = data?.result || [];
  const meta = data?.meta;

  const handleApplyFilters = (newFilters: PropertyFilterParams) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const onPageChange = (pageNo: number) => {
    setPage(pageNo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Explore Properties
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto lg:mx-0">
            Find your perfect home, investment, or commercial space from our curated premium listings.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] shrink-0 sticky top-24 z-10 transition-all">
            <PropertySidebarFilter 
              onApplyFilters={handleApplyFilters} 
              isLoading={isFetching}
            />
          </aside>

          {/* Main Content Area */}
          <main className="w-full flex-grow min-w-0 flex flex-col gap-8">
            {/* Header info */}
            {!isLoading && (
              <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <span className="text-gray-700 font-medium">
                  Showing <span className="text-blue-600 font-bold">{properties.length}</span> of <span className="font-bold">{meta?.total || 0}</span> result{meta?.total !== 1 ? 's' : ''}
                </span>
                {filters.sortBy && (
                  <span className="text-sm text-gray-500">
                    Sorted by: <span className="font-medium text-gray-800 capitalize">{filters.sortBy}</span>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            <PropertyList 
              properties={properties} 
              isLoading={isLoading} 
              isFetching={isFetching} 
            />

            {/* Pagination Controls */}
            {meta?.totalPages > 1 && (
              <div className="mt-8 flex justify-center pb-8">
                <Pagination
                  currentPage={page}
                  totalPages={meta.totalPages}
                  onPageChange={onPageChange}
                  showIcons={true}
                  className="shadow-sm"
                />
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
};

export default AllProperties;