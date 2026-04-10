import React from 'react';
import PropertyCard from './PropertyCard';

interface PropertyListProps {
  properties: any[];
  isLoading: boolean;
  isFetching: boolean;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, isLoading, isFetching }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[400px]">
            <div className="bg-gray-200 h-64 w-full" />
            <div className="p-5 flex flex-col flex-grow">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-5" />
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          We couldn't find any properties matching your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyList;