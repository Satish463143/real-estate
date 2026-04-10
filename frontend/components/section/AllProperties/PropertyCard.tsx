import React from 'react';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Star } from 'lucide-react';

interface Location {
  city: string;
  country: string;
}

interface Image {
  image: string;
  isPrimary: boolean;
}

interface Agent {
  firstName: string;
  lastName: string;
}

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    areaSize: number;
    areaSizeUnit: string;
    isFeatured: boolean;
    propertyType: string;
    listingType: string;
    location: Location;
    images: Image[];
    agent?: Agent;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const primaryImage = property.images?.find(img => img.isPrimary)?.image || property.images?.[0]?.image || '/property-placeholder.jpg';
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  const formatType = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <Link href={`/property-details?id=${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
        {/* Image Box */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={primaryImage} 
            alt={property.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlays */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm capitalize tracking-wide">
              {formatType(property.listingType)}
            </span>
          </div>
          
          {property.isFeatured && (
            <div className="absolute top-4 right-4">
              <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 tracking-wide">
                <Star className="w-3 h-3 fill-current" /> Featured
              </span>
            </div>
          )}
          
          <div className="absolute bottom-4 left-4">
            <span className="bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> 
              {property.location?.city}, {property.location?.country}
            </span>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h3>
          </div>
          
          <p className="text-sm font-medium text-blue-600 mb-4 uppercase tracking-wider">
            {formatType(property.propertyType)}
          </p>

          <div className="text-2xl font-extrabold text-gray-900 mb-5">
            {formatPrice(property.price)}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-gray-600 text-sm">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700">{property.bedrooms} <span className="hidden sm:inline">Beds</span></span>
            </div>
            <div className="w-px h-4 bg-gray-200"></div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700">{property.bathrooms} <span className="hidden sm:inline">Baths</span></span>
            </div>
            <div className="w-px h-4 bg-gray-200"></div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700">{property.areaSize} <span className="uppercase text-xs">{property.areaSizeUnit}</span></span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
