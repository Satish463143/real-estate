'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Swal from 'sweetalert2'
import AdminTitle from '../AdminTitle/AdminTitle'
import PropertyForm from './PropertyForm'
import { useShowByIdQuery, useUpdatePropertyMutation } from '../../api/properties.api'
import { useListAllQuery as useAgentListQuery } from '../../api/agent.api'
import LoadingComponent from '../../common/Loading/Loading.component'

const PropertyEdit = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams?.get('id') as string

    const [loading, setLoading] = useState(false)
    const [updateProperty] = useUpdatePropertyMutation()

    const { data: propertyData, isLoading: propertyLoading, error: propertyError } = useShowByIdQuery(id, { skip: !id })
    const { data: agentData } = useAgentListQuery({ page: 1, limit: 200, search: '' })

    const property = propertyData?.result
    const agentOptions: { id: string; firstName: string; lastName: string }[] =
        (agentData?.result ?? agentData?.details ?? []).map((a: any) => ({
            id: a.id,
            firstName: a.firstName,
            lastName: a.lastName,
        }))

    // Build default values from the fetched property
    const defaultValues = property
        ? {
            title:            property.title,
            description:      property.description,
            internalNotes:    property.internalNotes ?? '',
            propertyType:     property.propertyType,
            listingType:      property.listingType,
            status:           property.status,
            agentId:          property.agentId ?? property.agent?.id ?? '',
            publishedAt:      property.publishedAt?.substring(0, 10) ?? '',
            price:            property.price,
            pricePerSqft:     property.pricePerSqft ?? '',
            isNegotiable:     property.isNegotiable ?? false,
            areaSize:         property.areaSize,
            areaSizeUnit:     property.areaSizeUnit ?? 'sqft',
            bedrooms:         property.bedrooms ?? '',
            bathrooms:        property.bathrooms ?? '',
            floorNumber:      property.floorNumber ?? '',
            totalFloors:      property.totalFloors ?? '',
            parkingSpaces:    property.parkingSpaces ?? '',
            yearBuilt:        property.yearBuilt ?? '',
            furnishingStatus: property.furnishingStatus ?? '',
            isNewConstruction:property.isNewConstruction ?? false,
            isFeatured:       property.isFeatured ?? false,
            isVerified:       property.isVerified ?? false,
            hasGarden:        property.hasGarden ?? false,
            hasPool:          property.hasPool ?? false,
            hasBasement:      property.hasBasement ?? false,
            hasElevator:      property.hasElevator ?? false,
            hasBalcony:       property.hasBalcony ?? false,
            maxGuests:        property.maxGuests ?? '',
            minStayNights:    property.minStayNights ?? '',
            location: {
                address: property.location?.address ?? '',
                city:    property.location?.city ?? '',
                state:   property.location?.state ?? '',
                country: property.location?.country ?? '',
                zipCode: property.location?.zipCode ?? '',
            },
            features: property.features ?? [],
          }
        : undefined

    const submitEvent = async (formData: any, images: File[]) => {
        setLoading(true)
        try {
            const body = new FormData()

            const scalars = [
                'title', 'description', 'internalNotes', 'propertyType', 'listingType', 'status',
                'agentId', 'publishedAt', 'price', 'pricePerSqft', 'areaSize', 'areaSizeUnit',
                'bedrooms', 'bathrooms',  'floorNumber', 'totalFloors', 'parkingSpaces',
                'yearBuilt', 'furnishingStatus',
            ]
            scalars.forEach(key => {
                const v = formData[key]
                if (v !== '' && v !== null && v !== undefined) body.append(key, String(v))
            })

            const booleans = [
                'isNegotiable', 'isNewConstruction', 'isFeatured', 'isVerified',
                'hasGarden', 'hasPool', 'hasBasement', 'hasElevator', 'hasBalcony',
            ]
            booleans.forEach(key => {
                if (formData[key] !== undefined && formData[key] !== null)
                    body.append(key, String(formData[key]))
            })

            if (formData.maxGuests)     body.append('maxGuests',     String(formData.maxGuests))
            if (formData.minStayNights) body.append('minStayNights', String(formData.minStayNights))

            if (formData.location) body.append('location', JSON.stringify(formData.location))
            if (formData.features?.length) body.append('features', JSON.stringify(formData.features))

            // Append only newly selected images (existing ones remain on server)
            images.forEach(file => body.append('images', file))

            await updateProperty({ id, payload: body }).unwrap()
            Swal.fire({ title: 'Updated!', text: 'Property updated successfully.', icon: 'success', timer: 2000, showConfirmButton: false })
            router.push('/admin/property')
        } catch (err: any) {
            Swal.fire({
                title: 'Error',
                text: err?.data?.message || 'Could not update property. Please try again.',
                icon: 'error',
            })
        } finally {
            setLoading(false)
        }
    }

    if (!id) return <div className="admin_margin_box"><p style={{ color: 'red' }}>No property ID provided.</p></div>
    if (propertyLoading) return <div className="admin_margin_box"><LoadingComponent /></div>
    if (propertyError) return <div className="admin_margin_box"><p style={{ color: 'red' }}>Failed to load property.</p></div>

    return (
        <div className="admin_margin_box">
            <div className="admin_titles">
                <AdminTitle label1="Property List" label2="/Edit Property" url="/admin/property" />
                <div className="Dashboard_title">
                    <h1>Edit Property</h1>
                </div>
            </div>
            <div className="banner_form">
                <PropertyForm
                    submitEvent={submitEvent}
                    loading={loading}
                    btnLabel="Update Property"
                    defaultValues={defaultValues}
                    agentOptions={agentOptions}
                    existingImages={property?.images ?? []}
                />
            </div>
        </div>
    )
}

export default PropertyEdit