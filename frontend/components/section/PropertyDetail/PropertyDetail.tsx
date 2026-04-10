'use client';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShowByIdQuery } from '@/components/api/properties.api';
import { useCreateInquiryMutation } from '@/components/api/inquiry.api';
import { MapPin, Bed, Bath, Square, Calendar, CheckCircle, Phone, Mail, User, ShieldCheck, ChevronLeft, X } from 'lucide-react';

const PropertyDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  const { data, isLoading, isError } = useShowByIdQuery(id, {
    skip: !id,
  });

  const [createInquiry, { isLoading: isSubmitting }] = useCreateInquiryMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await createInquiry({ ...inquiryForm, propertyId: id as string }).unwrap();
      setSuccessMsg('Your inquiry has been sent successfully!');
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.data?.message || 'Failed to send inquiry. Please try again.');
    }
  };

  if (isLoading || !id) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading property details...</p>
      </div>
    );
  }

  if (isError || !data?.result) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-500 mb-6">The property you are looking for does not exist or has been removed.</p>
          <button onClick={() => router.back()} className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const property = data.result;
  const isRent = property.listingType === 'for_rent';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  const formatLabel = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Split images into primary (hero) and gallery
  let images = Array.isArray(property.images) && property.images.length > 0 ? property.images : [{ image: '/property-placeholder.jpg', isPrimary: true }];
  const primaryImg = images.find((img:any) => img.isPrimary) || images[0];
  const galleryImgs = images.filter((img:any) => img.id !== primaryImg.id).slice(0, 4);

  return (
    <div className="bg-[#F8F6F1] min-h-screen pb-24">
      {/* ── Breadcrumb / Back ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-sm">
          <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-blue-600 transition font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <span className="text-gray-400 hidden sm:block">
            Home / {formatLabel(property.propertyType)} / <span className="text-gray-900 font-medium">{property.title}</span>
          </span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* ── Property Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                {formatLabel(property.listingType)}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider ${property.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
                {property.status}
              </span>
              {property.isFeatured && (
                <span className="bg-[#C9A84C] text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                  ⭐ Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#0D1A30] leading-tight mb-2 tracking-tight">
              {property.title}
            </h1>
            <div className="flex items-center text-gray-500 gap-1.5 mt-2">
              <MapPin className="w-5 h-5 text-[#C9A84C]" />
              <p className="text-lg">{property.location?.address}, {property.location?.city}, {property.location?.state} {property.location?.zipCode}, {property.location?.country}</p>
            </div>
          </div>
          
          <div className="lg:text-right shrink-0">
            <div className="text-4xl md:text-5xl font-black text-[#0D1A30] tracking-tight">
              {formatPrice(property.price)}
              {isRent && <span className="text-xl text-gray-400 font-medium ml-1">/mo</span>}
            </div>
            {property.pricePerSqft && (
              <p className="text-gray-500 mt-1 font-medium">{formatPrice(property.pricePerSqft)} / {property.areaSizeUnit}</p>
            )}
          </div>
        </div>

        {/* ── Image Gallery ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[450px] md:h-[600px] rounded-3xl overflow-hidden shadow-xl">
          <div className={`relative ${galleryImgs.length > 0 ? 'md:col-span-3' : 'md:col-span-4'}`}>
            <img src={primaryImg.image} alt="Primary" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
          </div>
          {galleryImgs.length > 0 && (
            <div className="hidden md:grid grid-rows-2 gap-4 col-span-1 h-full">
              {galleryImgs.slice(0, 2).map((img:any, idx:number) => (
                <div key={idx} className="relative w-full h-full">
                  <img src={img.image} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Main Layout ── */}
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-wrap gap-x-8 gap-y-6 items-center shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 min-w-[120px]">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Bed className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Bedrooms</p>
                  <p className="text-2xl font-bold text-[#0D1A30]">{property.bedrooms}</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
              
              <div className="flex items-center gap-4 min-w-[120px]">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Bath className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Bathrooms</p>
                  <p className="text-2xl font-bold text-[#0D1A30]">{property.bathrooms}</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
              
              <div className="flex items-center gap-4 min-w-[120px]">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Square className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Area</p>
                  <p className="text-2xl font-bold text-[#0D1A30]">{property.areaSize} <span className="text-base text-gray-500 uppercase">{property.areaSizeUnit}</span></p>
                </div>
              </div>

              {property.yearBuilt && (
                <>
                  <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
                  <div className="flex items-center gap-4 min-w-[120px]">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Built</p>
                      <p className="text-2xl font-bold text-[#0D1A30]">{property.yearBuilt}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-[#0D1A30] mb-6">Property Description</h3>
              <div className="prose prose-lg text-gray-600 max-w-none">
                {property.description.split('\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Amenities / Features */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-[#0D1A30] mb-6">Amenities & Features</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {property.features.map((feature: any) => (
                    <div key={feature.id} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">{feature.key.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-gray-500 capitalize">{feature.value.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Details / Notes */}
            {property.furnishingStatus && (
              <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-[#0D1A30] mb-6">Additional Information</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Furnishing</span>
                    <span className="font-semibold text-gray-900">{formatLabel(property.furnishingStatus)}</span>
                  </li>
                  <li className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Negotiable</span>
                    <span className="font-semibold text-gray-900">{property.isNegotiable ? 'Yes' : 'No'}</span>
                  </li>
                  {property.maxGuests && (
                    <li className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Max Guests</span>
                      <span className="font-semibold text-gray-900">{property.maxGuests}</span>
                    </li>
                  )}
                  {property.minStayNights && (
                    <li className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Min Stay</span>
                      <span className="font-semibold text-gray-900">{property.minStayNights} Nights</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

          </div>

          {/* Right Column (Sidebar) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              
              <div className="text-center mb-8 border-b border-gray-100 pb-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg relative">
                  {property.agent?.avatarUrl ? (
                    <img src={property.agent.avatarUrl} alt="Agent" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <h4 className="text-xl font-bold text-[#0D1A30] hover:text-blue-600 transition cursor-pointer">
                  {property.agent?.firstName} {property.agent?.lastName}
                </h4>
                <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Verified Agent
                </p>
              </div>

              <div className="space-y-4 mb-8 text-sm">
                <a href={`tel:${property.agent?.phone}`} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition text-[#0D1A30] font-medium group">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Phone className="w-5 h-5" />
                  </div>
                  {property.agent?.phone}
                </a>
              </div>

              <div className="space-y-3">
                <button onClick={() => setIsModalOpen(true)} className="w-full bg-[#0D1A30] hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition duration-300 shadow-md">
                  Send Inquiry
                </button>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* Inquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-[#0D1A30] mb-2">Send Inquiry</h3>
            <p className="text-gray-500 mb-6 text-sm">Fill out the form below to inquire about this property.</p>
            
            {successMsg && (
              <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                {successMsg}
              </div>
            )}
            
            {errorMsg && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="I am interested in this property..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !!successMsg}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ${(isSubmitting || successMsg) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;