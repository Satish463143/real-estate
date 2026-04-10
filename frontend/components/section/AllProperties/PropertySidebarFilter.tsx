'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, Home, Bed, Bath, Filter, X } from 'lucide-react';

export interface PropertyFilterParams {
  search?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  minArea?: string;
  maxArea?: string;
  yearBuilt?: string;
  isFeatured?: string;
  furnishingStatus?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface PropertySidebarFilterProps {
  onApplyFilters: (filters: PropertyFilterParams) => void;
  isLoading?: boolean;
}

const PROPERTY_TYPES = ['house', 'apartment', 'townhouse', 'villa', 'studio', 'office', 'shop', 'warehouse', 'industrial', 'land', 'plot', 'farm'];
const LISTING_TYPES = ['for_sale', 'for_rent', 'short_term', 'vacation'];
const FURNISHING_TYPES = ['furnished', 'semi_furnished', 'unfurnished'];

const formatLabel = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const PropertySidebarFilter: React.FC<PropertySidebarFilterProps> = ({ onApplyFilters, isLoading }) => {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<PropertyFilterParams>(() => {
    const initial: PropertyFilterParams = { sortBy: 'createdAt', sortOrder: 'desc' };
    if (searchParams?.get('search')) initial.search = searchParams.get('search') as string;
    if (searchParams?.get('propertyType')) initial.propertyType = searchParams.get('propertyType') as string;
    if (searchParams?.get('listingType')) initial.listingType = searchParams.get('listingType') as string;
    return initial;
  });

  const [isOpen, setIsOpen] = useState(false); // Mobile drawer state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters(prev => ({ ...prev, [name]: checked ? 'true' : '' }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultState = { sortBy: 'createdAt', sortOrder: 'desc' };
    setFilters(defaultState);
    onApplyFilters(defaultState);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition-colors"
        >
          <Filter className="h-5 w-5" />
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`
        bg-white rounded-xl shadow-sm border border-gray-100 p-6
        lg:block ${isOpen ? 'block' : 'hidden'}
      `}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Advanced Filters
          </h2>
          {isOpen && (
            <button type="button" onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleApply}>
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Keyword</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  value={filters.search || ''}
                  onChange={handleChange}
                  placeholder="Title, City or Country..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Property Type & Listing Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="propertyType" value={filters.propertyType || ''} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>{formatLabel(type)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="listingType" value={filters.listingType || ''} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Any Status</option>
                  {LISTING_TYPES.map(type => (
                    <option key={type} value={type}>{formatLabel(type)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (USD)</label>
              <div className="flex items-center gap-2">
                <input type="number" name="minPrice" value={filters.minPrice || ''} onChange={handleChange} placeholder="Min" className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
                <span className="text-gray-400">-</span>
                <input type="number" name="maxPrice" value={filters.maxPrice || ''} onChange={handleChange} placeholder="Max" className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            {/* Beds & Baths */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bed className="h-4 w-4 text-gray-400" />
                  </div>
                  <select name="bedrooms" value={filters.bedrooms || ''} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Any</option>
                    {['1', '2', '3', '4', '5'].map(num => <option key={num} value={num}>{num}+ Beds</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bath className="h-4 w-4 text-gray-400" />
                  </div>
                  <select name="bathrooms" value={filters.bathrooms || ''} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Any</option>
                    {['1', '2', '3', '4'].map(num => <option key={num} value={num}>{num}+ Baths</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Area Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area Size (Sq Ft)</label>
              <div className="flex items-center gap-2">
                <input type="number" name="minArea" value={filters.minArea || ''} onChange={handleChange} placeholder="Min Area" className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
                <span className="text-gray-400">-</span>
                <input type="number" name="maxArea" value={filters.maxArea || ''} onChange={handleChange} placeholder="Max Area" className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing Status</label>
              <select name="furnishingStatus" value={filters.furnishingStatus || ''} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Any</option>
                {FURNISHING_TYPES.map(type => (
                  <option key={type} value={type}>{formatLabel(type)}</option>
                ))}
              </select>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={filters.isFeatured === 'true'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                Must be Featured Property
              </label>
            </div>

            {/* Sort By */}
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="flex gap-2">
                <select name="sortBy" value={filters.sortBy || ''} onChange={handleChange} className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="createdAt">Date Listed</option>
                  <option value="price">Price</option>
                  <option value="areaSize">Area Size</option>
                  <option value="bedrooms">Bedrooms</option>
                </select>
                <select name="sortOrder" value={filters.sortOrder || ''} onChange={handleChange} className="w-24 border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="desc">DESC</option>
                  <option value="asc">ASC</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleApply}
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Loading...' : 'Apply Filters'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset All
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PropertySidebarFilter;
