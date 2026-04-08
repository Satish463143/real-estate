'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import AdminTitle from '../AdminTitle/AdminTitle'
import PropertyForm from './PropertyForm'
import { useCreatePropertyMutation } from '../../api/properties.api'
import { useListAllQuery as useAgentListQuery } from '../../api/agent.api'

const PropertyAdd = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [createProperty] = useCreatePropertyMutation()

    // Fetch all agents for the dropdown (high limit, no pagination)
    const { data: agentData } = useAgentListQuery({ page: 1, limit: 200, search: '' })
    const agentOptions: { id: string; firstName: string; lastName: string }[] =
        (agentData?.result ?? agentData?.details ?? []).map((a: any) => ({
            id: a.id,
            firstName: a.firstName,
            lastName: a.lastName,
        }))

    const submitEvent = async (formData: any, images: File[]) => {
        setLoading(true)
        try {
            const body = new FormData()

            // ── Scalar fields ────────────────────────────────────────────
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

            // ── Booleans ─────────────────────────────────────────────────
            const booleans = [
                'isNegotiable', 'isNewConstruction', 'isFeatured', 'isVerified',
                'hasGarden', 'hasPool', 'hasBasement', 'hasElevator', 'hasBalcony',
            ]
            booleans.forEach(key => {
                if (formData[key] !== undefined && formData[key] !== null)
                    body.append(key, String(formData[key]))
            })

            // ── Short-term ────────────────────────────────────────────────
            if (formData.maxGuests)     body.append('maxGuests',     String(formData.maxGuests))
            if (formData.minStayNights) body.append('minStayNights', String(formData.minStayNights))

            // ── Location (nested object as JSON string) ───────────────────
            if (formData.location) body.append('location', JSON.stringify(formData.location))

            // ── Features (array of { key, value }) ───────────────────────
            if (formData.features?.length) body.append('features', JSON.stringify(formData.features))

            // ── Images ───────────────────────────────────────────────────
            images.forEach(file => body.append('images', file))

            await createProperty(body).unwrap()
            Swal.fire({ title: 'Success!', text: 'Property created successfully.', icon: 'success', timer: 2000, showConfirmButton: false })
            router.push('/admin/property')
        } catch (err: any) {
            Swal.fire({
                title: 'Error',
                text: err?.data?.message || 'Could not create property. Please try again.',
                icon: 'error',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin_margin_box">
            <div className="admin_titles">
                <AdminTitle label1="Property List" label2="/Add Property" url="/admin/property" />
                <div className="Dashboard_title">
                    <h1>Add Property</h1>
                </div>
            </div>
            <div className="banner_form">
                <PropertyForm
                    submitEvent={submitEvent}
                    loading={loading}
                    btnLabel="Create Property"
                    agentOptions={agentOptions}
                />
            </div>
        </div>
    )
}

export default PropertyAdd