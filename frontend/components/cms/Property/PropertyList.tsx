'use client'
import { useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { Pagination } from 'flowbite-react'
import AdminTitle from '../AdminTitle/AdminTitle'
import LoadingComponent from '../../common/Loading/Loading.component'
import EditButton from '../EditButton/EditButton'
import DeleteButton from '../DeleteButton/DeleteButton'
import { useListAllQuery, useDeletePropertyMutation } from '../../api/properties.api'

// ── helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)

const badge = (label: string, color: string) => (
    <span
        style={{
            background: color,
            color: '#fff',
            borderRadius: 4,
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        }}
    >
        {label}
    </span>
)

const STATUS_COLOR: Record<string, string> = {
    active: '#16a34a',
    pending: '#d97706',
    sold: '#dc2626',
    rented: '#7c3aed',
    inactive: '#6b7280',
}

const TYPE_COLOR: Record<string, string> = {
    for_sale: '#0ea5e9',
    for_rent: '#f59e0b',
    short_term: '#8b5cf6',
    vacation: '#ec4899',
}

// ─────────────────────────────────────────────────────────────────────────────
const PropertyList = () => {
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [page, setPage] = useState(1)
    const limit = 10

    // Debounce search so we don't fire a request on every keystroke
    let debounceTimer: ReturnType<typeof setTimeout>
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setSearch(val)
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            setDebouncedSearch(val)
            setPage(1)
        }, 400)
    }

    const { data, error, isLoading } = useListAllQuery({ page, limit, search: debouncedSearch })
    const [deleteProperty] = useDeletePropertyMutation()

    const properties: any[] = data?.result ?? []
    const meta = data?.meta ?? null

    const handleDelete = async (id: string) => {
        const confirm = await Swal.fire({
            title: 'Delete property?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Yes, delete',
        })
        if (!confirm.isConfirmed) return

        try {
            await deleteProperty(id).unwrap()
            Swal.fire({ title: 'Deleted!', text: 'Property deleted successfully.', icon: 'success', timer: 1800, showConfirmButton: false })
        } catch {
            Swal.fire({ title: 'Error', text: 'Could not delete property. Please try again.', icon: 'error' })
        }
    }

    return (
        <div className="admin_margin_box">
            <div className="admin_titles">
                <AdminTitle url="/admin/property" label1="Property List" label2="" />
                <div className="Dashboard_title">
                    <h1>Property List</h1>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                            type="search"
                            className="search_btn"
                            placeholder="Search title, city, description…"
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <Link href="/admin/add_property">
                            <button className="edit_btn">+ Add Property</button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="blog_table">
                <table border={2}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Type / Listing</th>
                            <th>Price</th>
                            <th>Beds / Baths</th>
                            <th>Area</th>
                            <th>Location</th>
                            <th>Agent</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={11}><LoadingComponent /></td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={11} className="error-message">
                                    {(error as any)?.data?.message || 'Failed to load properties.'}
                                </td>
                            </tr>
                        ) : properties.length > 0 ? (
                            properties.map((p: any, idx: number) => {
                                const primaryImg = p.images?.find((i: any) => i.isPrimary) ?? p.images?.[0]
                                return (
                                    <tr key={p.id}>
                                        <td className="table_sn">{(page - 1) * limit + idx + 1}</td>
                                        <td>
                                            {primaryImg?.image ? (
                                                <img
                                                    src={primaryImg.image}
                                                    alt={primaryImg.altText || p.title}
                                                    width={70}
                                                    height={50}
                                                    style={{ objectFit: 'cover', borderRadius: 4 }}
                                                />
                                            ) : (
                                                <div style={{ width: 70, height: 50, background: '#e5e7eb', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#9ca3af' }}>
                                                    No img
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ maxWidth: 200 }}>
                                            <div style={{ fontWeight: 600, fontSize: 13 }}>{p.title}</div>
                                            <div style={{ fontSize: 11, color: '#6b7280' }}>{p.slug}</div>
                                        </td>
                                        <td>
                                            <div style={{ marginBottom: 4 }}>{badge(p.propertyType, '#374151')}</div>
                                            <div>{badge(p.listingType, TYPE_COLOR[p.listingType] ?? '#6b7280')}</div>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {formatPrice(p.price)}
                                            {p.isNegotiable && <div style={{ fontSize: 10, color: '#16a34a' }}>Negotiable</div>}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {p.bedrooms != null ? `${p.bedrooms} bd` : '—'} / {p.bathrooms != null ? `${p.bathrooms} ba` : '—'}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {p.areaSize} <span style={{ fontSize: 11 }}>{p.areaSizeUnit}</span>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: 13 }}>{p.location?.city}</div>
                                            <div style={{ fontSize: 11, color: '#6b7280' }}>{p.location?.country}</div>
                                        </td>
                                        <td style={{ fontSize: 12 }}>
                                            {p.agent ? `${p.agent.firstName} ${p.agent.lastName}` : '—'}
                                        </td>
                                        <td>{badge(p.status, STATUS_COLOR[p.status] ?? '#6b7280')}</td>
                                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                            <EditButton editUrl={`/admin/edit_property?id=${p.id}`} />
                                            <DeleteButton deleteAction={handleDelete} rowId={p.id} />
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={11} style={{ textAlign: 'center', padding: '24px 0', color: '#6b7280' }}>
                                    No properties found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {meta && meta.totalPages > 1 && (
                    <div className="flex overflow-x-auto sm:justify-center" style={{ marginTop: 16 }}>
                        <Pagination
                            currentPage={meta.currentPage ?? 1}
                            totalPages={meta.totalPages}
                            onPageChange={(p) => setPage(p)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PropertyList