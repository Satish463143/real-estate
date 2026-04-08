'use client'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { TextInputComponent, TextAreaInput } from '../../common/InputBox/InputBox'

// ── Constants (mirror backend constant.config.js) ─────────────────────────────
const PROPERTY_TYPES = ['house', 'apartment', 'townhouse', 'villa', 'studio', 'office', 'shop', 'warehouse', 'industrial', 'land', 'plot', 'farm']
const LISTING_TYPES  = ['for_sale', 'for_rent', 'short_term', 'vacation']
const STATUSES       = ['active', 'pending', 'sold', 'rented', 'inactive']
const FURNISHING     = ['furnished', 'semi_furnished', 'unfurnished']
const AREA_UNITS     = ['sqft', 'sqm']

const toOptions = (arr: string[]) => arr.map(v => ({ label: v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value: v }))

// ── Yup Schema ────────────────────────────────────────────────────────────────
const propertySchema = Yup.object().shape({
    // Core
    title:         Yup.string().required('Title is required'),
    description:   Yup.string().required('Description is required'),
    internalNotes: Yup.string().optional(),
    propertyType:  Yup.string().oneOf(PROPERTY_TYPES).required('Property type is required'),
    listingType:   Yup.string().oneOf(LISTING_TYPES).required('Listing type is required'),
    status:        Yup.string().oneOf(STATUSES).default('active'),
    agentId:       Yup.string().required('Agent is required'),
    publishedAt:   Yup.string().optional(),

    // Pricing
    price:        Yup.number().positive('Must be positive').required('Price is required').typeError('Price must be a number'),
    pricePerSqft: Yup.number().positive().optional().nullable().typeError('Must be a number'),
    isNegotiable: Yup.boolean().default(false),

    // Size & Structure
    areaSize:     Yup.number().positive('Must be positive').required('Area size is required').typeError('Area must be a number'),
    areaSizeUnit: Yup.string().oneOf(AREA_UNITS).default('sqft'),
    bedrooms:     Yup.number().integer().min(0).optional().nullable().typeError('Must be a number'),
    bathrooms:    Yup.number().integer().min(0).optional().nullable().typeError('Must be a number'),
    floorNumber:  Yup.number().integer().min(0).optional().nullable().typeError('Must be a number'),
    totalFloors:  Yup.number().integer().min(1).optional().nullable().typeError('Must be a number'),
    parkingSpaces:Yup.number().integer().min(0).optional().nullable().typeError('Must be a number'),
    yearBuilt:    Yup.number().integer().min(1800).max(new Date().getFullYear()).optional().nullable().typeError('Must be a number'),

    // Condition / Style
    furnishingStatus:  Yup.string().oneOf([...FURNISHING, '']).optional(),
    isNewConstruction: Yup.boolean().optional().nullable(),

    // Booleans
    isFeatured:  Yup.boolean().default(false),
    isVerified:  Yup.boolean().default(false),
    hasGarden:   Yup.boolean().optional().nullable(),
    hasPool:     Yup.boolean().optional().nullable(),
    hasBasement: Yup.boolean().optional().nullable(),
    hasElevator: Yup.boolean().optional().nullable(),
    hasBalcony:  Yup.boolean().optional().nullable(),

    // Short-term
    maxGuests:    Yup.number().integer().min(1).optional().nullable().typeError('Must be a number'),
    minStayNights:Yup.number().integer().min(1).optional().nullable().typeError('Must be a number'),

    // Location
    location: Yup.object().shape({
        address: Yup.string().required('Address is required'),
        city:    Yup.string().required('City is required'),
        state:   Yup.string().optional(),
        country: Yup.string().required('Country is required'),
        zipCode: Yup.string().optional(),
    }).required(),

    // Features (key-value pairs)
    features: Yup.array().of(
        Yup.object().shape({
            key:   Yup.string().required('Key is required'),
            value: Yup.string().required('Value is required'),
        })
    ).optional(),
})

type PropertyFormValues = Yup.InferType<typeof propertySchema>

// ── Form Component ────────────────────────────────────────────────────────────
interface PropertyFormProps {
    submitEvent: (data: any, images: File[]) => void
    loading: boolean
    btnLabel: string
    defaultValues?: any
    agentOptions: { id: string; firstName: string; lastName: string }[]
    existingImages?: { id: string; image: string; isPrimary: boolean; altText?: string }[]
}

const PropertyForm = ({ submitEvent, loading, btnLabel, defaultValues, agentOptions, existingImages = [] }: PropertyFormProps) => {
    const [newImages, setNewImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<PropertyFormValues>({
        resolver: yupResolver(propertySchema) as any,
        defaultValues: {
            title: '', description: '', internalNotes: '', propertyType: '', listingType: '',
            status: 'active' as const, agentId: '', publishedAt: '',
            price: undefined, pricePerSqft: undefined, isNegotiable: false,
            areaSize: undefined, areaSizeUnit: 'sqft' as const, bedrooms: undefined, bathrooms: undefined,
            floorNumber: undefined, totalFloors: undefined, parkingSpaces: undefined, yearBuilt: undefined,
            furnishingStatus: '' as any, isNewConstruction: false,
            isFeatured: false, isVerified: false,
            hasGarden: false, hasPool: false, hasBasement: false, hasElevator: false, hasBalcony: false,
            maxGuests: undefined, minStayNights: undefined,
            location: { address: '', city: '', state: '', country: '', zipCode: '' },
            features: [] as { key: string; value: string }[],
        },
    })

    // Features dynamic array
    const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
        control,
        name : 'features',
    })

    // Pre-fill on edit
    useEffect(() => {
        if (!defaultValues) return
        const fields = [
            'title', 'description', 'internalNotes', 'propertyType', 'listingType', 'status', 'agentId',
            'price', 'pricePerSqft', 'isNegotiable', 'areaSize', 'areaSizeUnit', 'bedrooms', 'bathrooms',
            'floorNumber', 'totalFloors', 'parkingSpaces', 'yearBuilt', 'furnishingStatus',
            'isNewConstruction', 'isFeatured', 'isVerified', 'hasGarden', 'hasPool', 'hasBasement',
            'hasElevator', 'hasBalcony', 'maxGuests', 'minStayNights', 'features',
        ]
        fields.forEach((key) => {
            if (defaultValues[key] !== undefined && defaultValues[key] !== null) {
                setValue(key as any, defaultValues[key])
            }
        })
        if (defaultValues.location) {
            ['address', 'city', 'state', 'country', 'zipCode'].forEach((k) => {
                setValue(`location.${k}` as any, defaultValues.location[k] ?? '')
            })
        }
        if (defaultValues.publishedAt) {
            setValue('publishedAt', defaultValues.publishedAt?.substring(0, 10) ?? '')
        }
    }, [defaultValues, setValue])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        const valid = files.filter(f => f.type.startsWith('image/')).slice(0, 10)
        setNewImages(valid)
        setImagePreviews(valid.map(f => URL.createObjectURL(f)))
    }

    const onSubmit = (formData: any) => {
        submitEvent(formData, newImages)
    }

    // ── UI helpers ──────────────────────────────────────────────────────────
    const SectionTitle = ({ label }: { label: string }) => (
        <div style={{ gridColumn: '1 / -1', borderBottom: '2px solid #e5e7eb', paddingBottom: 6, marginTop: 12, marginBottom: 4 }}>
            <strong style={{ color: '#1f2937', fontSize: 14 }}>{label}</strong>
        </div>
    )

    const FieldWrap = ({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) => (
        <div>
            <label style={{ fontWeight: 500, fontSize: 13, color: '#374151', display: 'block', marginBottom: 4 }}>{label}</label>
            {children}
            {error && <span style={{ color: 'red', fontSize: 11, fontStyle: 'italic' }}>{error}</span>}
        </div>
    )

    const NativeSelect = ({ name, options, placeholder }: { name: string; options: { label: string; value: string }[]; placeholder?: string }) => (
        <Controller
            control={control}
            name={name as any}
            render={({ field }) => (
                <select {...field} style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, background: '#fff' }}>
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            )}
        />
    )

    const CheckboxField = ({ name, label }: { name: string; label: string }) => (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <Controller
                control={control}
                name={name as any}
                render={({ field }) => (
                    <input type="checkbox" checked={!!field.value} onChange={e => field.onChange(e.target.checked)} style={{ width: 16, height: 16 }} />
                )}
            />
            {label}
        </label>
    )

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px 20px' }}>

                {/* ── Core ── */}
                <SectionTitle label="Core Information" />

                <FieldWrap label="Title *" error={errors.title?.message as string}>
                    <TextInputComponent name="title" control={control} placeholder="e.g. Modern 3BHK Apartment in Manhattan" type="text" defaultValue="" required className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="Agent *" error={(errors.agentId as any)?.message}>
                    <NativeSelect name="agentId" placeholder="— Select Agent —" options={agentOptions.map(a => ({ label: `${a.firstName} ${a.lastName}`, value: a.id }))} />
                </FieldWrap>

                <FieldWrap label="Property Type *" error={(errors.propertyType as any)?.message}>
                    <NativeSelect name="propertyType" placeholder="— Select Type —" options={toOptions(PROPERTY_TYPES)} />
                </FieldWrap>

                <FieldWrap label="Listing Type *" error={(errors.listingType as any)?.message}>
                    <NativeSelect name="listingType" placeholder="— Select Listing —" options={toOptions(LISTING_TYPES)} />
                </FieldWrap>

                <FieldWrap label="Status" error={(errors.status as any)?.message}>
                    <NativeSelect name="status" options={toOptions(STATUSES)} />
                </FieldWrap>

                <FieldWrap label="Published At">
                    <TextInputComponent name="publishedAt" control={control} type="date" defaultValue="" required={false} className="" style={{}} errMsg={null} placeholder="" />
                </FieldWrap>

                <div style={{ gridColumn: '1 / -1' }}>
                    <FieldWrap label="Description *" error={errors.description?.message as string}>
                        <TextAreaInput name="description" control={control} placeholder="Detailed description of the property…" row={4} defaultValue="" required className="" style={{}} errMsg={null} />
                    </FieldWrap>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <FieldWrap label="Internal Notes (admin only)">
                        <TextAreaInput name="internalNotes" control={control} placeholder="Private notes for admin use…" row={2} defaultValue="" required={false} className="" style={{}} errMsg={null} />
                    </FieldWrap>
                </div>

                {/* ── Pricing ── */}
                <SectionTitle label="Pricing" />

                <FieldWrap label="Price (USD) *" error={errors.price?.message as string}>
                    <TextInputComponent name="price" control={control} type="number" placeholder="e.g. 450000" defaultValue="" required className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="Price per Sqft">
                    <TextInputComponent name="pricePerSqft" control={control} type="number" placeholder="Optional" defaultValue="" required={false} className="" style={{}} errMsg={null} />
                </FieldWrap>

                <div style={{ display: 'flex', alignItems: 'center', paddingTop: 24 }}>
                    <CheckboxField name="isNegotiable" label="Price is Negotiable" />
                </div>

                {/* ── Size & Structure ── */}
                <SectionTitle label="Size & Structure" />

                <FieldWrap label="Area Size *" error={errors.areaSize?.message as string}>
                    <TextInputComponent name="areaSize" control={control} type="number" placeholder="e.g. 1500" defaultValue="" required className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="Area Unit">
                    <NativeSelect name="areaSizeUnit" options={AREA_UNITS.map(u => ({ label: u, value: u }))} />
                </FieldWrap>

                <FieldWrap label="Bedrooms">
                    <TextInputComponent name="bedrooms" control={control} type="number" placeholder="0" defaultValue="" required={false} className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="Bathrooms">
                    <TextInputComponent name="bathrooms" control={control} type="number" placeholder="0" defaultValue="" required={false} className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="Parking Spaces">
                    <TextInputComponent name="parkingSpaces" control={control} type="number" placeholder="0" defaultValue="" required={false} className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="Year Built">
                    <TextInputComponent name="yearBuilt" control={control} type="number" placeholder="e.g. 2015" defaultValue="" required={false} className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="Total Floors">
                    <TextInputComponent name="totalFloors" control={control} type="number" placeholder="" defaultValue="" required={false} className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="Floor Number (unit on which floor)">
                    <TextInputComponent name="floorNumber" control={control} type="number" placeholder="" defaultValue="" required={false} className="" style={{}} errMsg={null} />
                </FieldWrap>

                {/* ── Condition / Style ── */}
                <SectionTitle label="Condition & Style" />

                <FieldWrap label="Furnishing Status">
                    <NativeSelect name="furnishingStatus" placeholder="— Not specified —" options={toOptions(FURNISHING)} />
                </FieldWrap>

                <div style={{ display: 'flex', alignItems: 'center', paddingTop: 24 }}>
                    <CheckboxField name="isNewConstruction" label="New Construction" />
                </div>

                {/* ── Amenities booleans ── */}
                <SectionTitle label="Amenities" />

                {(['isFeatured', 'isVerified', 'hasGarden', 'hasPool', 'hasBasement', 'hasElevator', 'hasBalcony'] as const).map(key => (
                    <CheckboxField key={key} name={key} label={key.replace(/^has|^is/, '').replace(/([A-Z])/g, ' $1').trim()} />
                ))}

                {/* ── Short-term / Vacation ── */}
                <SectionTitle label="Short-Term / Vacation" />

                <FieldWrap label="Max Guests">
                    <TextInputComponent name="maxGuests" control={control} type="number" placeholder="" defaultValue="" required={false} className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="Min Stay Nights">
                    <TextInputComponent name="minStayNights" control={control} type="number" placeholder="" defaultValue="" required={false} className="" style={{}} errMsg={null} />
                </FieldWrap>

                {/* ── Location ── */}
                <SectionTitle label="Location" />

                <FieldWrap label="Address *" error={(errors.location as any)?.address?.message}>
                    <TextInputComponent name="location.address" control={control} type="text" placeholder="Street address" defaultValue="" required className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="City *" error={(errors.location as any)?.city?.message}>
                    <TextInputComponent name="location.city" control={control} type="text" placeholder="City" defaultValue="" required className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="State / Province">
                    <TextInputComponent name="location.state" control={control} type="text" placeholder="State" defaultValue="" required={false} className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="Country *" error={(errors.location as any)?.country?.message}>
                    <TextInputComponent name="location.country" control={control} type="text" placeholder="Country" defaultValue="" required className="" style={{}} errMsg={null} />
                </FieldWrap>

                <FieldWrap label="Zip / Postal Code">
                    <TextInputComponent name="location.zipCode" control={control} type="text" placeholder="Zip" defaultValue="" required={false} className="" style={{}} errMsg={null} />
                </FieldWrap>

            </div>

            {/* ── Features (key-value) ── */}
            <div style={{ marginTop: 20, borderTop: '2px solid #e5e7eb', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <strong style={{ color: '#1f2937', fontSize: 14 }}>Features</strong>
                    <button
                        type="button"
                        onClick={() => appendFeature({ key: '', value: '' })}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                    >
                        + Add Feature
                    </button>
                </div>
                {featureFields.length === 0 && (
                    <div style={{ color: '#9ca3af', fontSize: 13, marginBottom: 8 }}>No features added. Click "Add Feature" to add amenities like view, flooring, heating, etc.</div>
                )}
                {featureFields.map((field, index) => (
                    <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, marginBottom: 8, alignItems: 'start' }}>
                        <div>
                            <TextInputComponent
                                name={`features.${index}.key`}
                                control={control}
                                type="text"
                                placeholder="Key (e.g. view)"
                                defaultValue=""
                                required={false}
                                className=""
                                style={{}}
                                errMsg={(errors.features as any)?.[index]?.key?.message ?? null}
                            />
                        </div>
                        <div>
                            <TextInputComponent
                                name={`features.${index}.value`}
                                control={control}
                                type="text"
                                placeholder="Value (e.g. ocean)"
                                defaultValue=""
                                required={false}
                                className=""
                                style={{}}
                                errMsg={(errors.features as any)?.[index]?.value?.message ?? null}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', fontWeight: 700, marginTop: 2 }}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* ── Images ── */}
            <div style={{ marginTop: 20, borderTop: '2px solid #e5e7eb', paddingTop: 16 }}>
                <strong style={{ color: '#1f2937', fontSize: 14 }}>Images</strong>

                {/* Existing images on edit */}
                {existingImages.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10, marginBottom: 10 }}>
                        {existingImages.map((img) => (
                            <div key={img.id} style={{ position: 'relative' }}>
                                <img
                                    src={img.image}
                                    alt={img.altText || 'property image'}
                                    style={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 6, border: img.isPrimary ? '2px solid #2563eb' : '1px solid #d1d5db' }}
                                />
                                {img.isPrimary && (
                                    <span style={{ position: 'absolute', top: 2, left: 2, background: '#2563eb', color: '#fff', fontSize: 9, borderRadius: 3, padding: '1px 4px' }}>Primary</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginTop: existingImages.length ? 8 : 12, marginBottom: 6 }}>
                    {existingImages.length > 0 ? 'Upload additional images' : 'Upload images (first becomes primary)'}
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ fontSize: 13 }}
                />

                {imagePreviews.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                        {imagePreviews.map((src, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <img src={src} alt={`preview-${i}`} style={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 6, border: i === 0 && existingImages.length === 0 ? '2px solid #16a34a' : '1px solid #d1d5db' }} />
                                {i === 0 && existingImages.length === 0 && (
                                    <span style={{ position: 'absolute', top: 2, left: 2, background: '#16a34a', color: '#fff', fontSize: 9, borderRadius: 3, padding: '1px 4px' }}>Primary</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Submit ── */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
                <input
                    className="submit_btn"
                    type="submit"
                    value={loading ? 'Saving…' : btnLabel}
                    disabled={loading}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer', minWidth: 160, padding: '10px 28px' }}
                />
            </div>
        </form>
    )
}

export default PropertyForm