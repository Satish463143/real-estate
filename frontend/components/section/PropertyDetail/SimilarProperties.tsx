'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetSimilarPropertiesQuery } from '@/components/api/properties.api';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

interface SimilarPropertiesProps {
  propertyId: string;
}

const SimilarProperties = ({ propertyId }: SimilarPropertiesProps) => {
  const router = useRouter();

  const { data, isLoading, isError } = useGetSimilarPropertiesQuery(
    { id: propertyId, k: 4 },
    { skip: !propertyId }
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);

  const formatLabel = (str: string) =>
    str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  if (isLoading) {
    return (
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-[#0D1A30] mb-6">Similar Properties</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.result || data.result.length === 0) return null;

  const similar = data.result;

  return (
    <div className="mt-16">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gray-200" />
        <div className="flex items-center gap-2 px-4">
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
          <h3 className="text-2xl font-bold text-[#0D1A30] whitespace-nowrap">
            Similar Properties
          </h3>
          <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full ml-2">
            KNN
          </span>
        </div>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <p className="text-gray-400 text-sm text-center -mt-4 mb-8">
        Recommended based on price, size, bedrooms &amp; location
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similar.map((property: any) => {
          const primaryImg =
            Array.isArray(property.images) && property.images.length > 0
              ? property.images.find((img: any) => img.isPrimary) || property.images[0]
              : null;

          return (
            <div
              key={property.id}
              onClick={() =>
                router.push(`/property-details?id=${property.id}`)
              }
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {primaryImg?.image ? (
                  <img
                    src={primaryImg.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Square className="w-10 h-10 text-gray-300" />
                  </div>
                )}

                {/* Listing Type Badge */}
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                  {formatLabel(property.listingType)}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {/* Price */}
                <div className="text-xl font-extrabold text-[#0D1A30] mb-1">
                  {formatPrice(property.price)}
                  {property.listingType === 'for_rent' && (
                    <span className="text-sm text-gray-400 font-medium ml-1">/mo</span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-gray-800 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {property.title}
                </h4>

                {/* Location */}
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span className="truncate">
                    {property.location?.city}, {property.location?.country}
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs font-medium">
                  {property.bedrooms != null && (
                    <div className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-blue-500" />
                      <span>{property.bedrooms} Bed</span>
                    </div>
                  )}
                  {property.bathrooms != null && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-blue-500" />
                      <span>{property.bathrooms} Bath</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <Square className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      {property.areaSize} {property.areaSizeUnit?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimilarProperties;
