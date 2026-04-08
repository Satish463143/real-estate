'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import AdminTitle from '../AdminTitle/AdminTitle'
import LoadingComponent from '../../common/Loading/Loading.component'
import { useShowByIdQuery, useUpdateInquiryMutation } from '@/components/api/inquiry.api'

// ── Status options matching   the Prisma InquiryStatus enum ────────────────────
const STATUS_OPTIONS = ['new', 'in_progress', 'closed']

const statusColor: Record<string, string> = {
    new:         '#2563eb',
    in_progress: '#d97706',
    closed:      '#6b7280', 
}

// ── Small helper components ───────────────────────────────────────────────────
const Badge = ({ status }: { status: string }) => (
    <span style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        background: statusColor[status] ?? '#9ca3af',
        color: '#fff',
        letterSpacing: 0.5,
    }}>
        {status.replace('_', ' ')}
    </span>
)

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
        <span style={{ minWidth: 140, fontWeight: 600, fontSize: 13, color: '#6b7280' }}>{label}</span>
        <span style={{ fontSize: 14, color: '#111827', flex: 1, wordBreak: 'break-word' }}>{value || '—'}</span>
    </div>
)

// ── Main component ────────────────────────────────────────────────────────────
const InqueryDetails = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams?.get('id') as string

    const { data, isLoading, error } = useShowByIdQuery(id, { skip: !id })
    const [updateInquiry, { isLoading: updating }] = useUpdateInquiryMutation()

    const inquiry = data?.result ?? data?.details ?? data?.inquiry ?? data

    const [selectedStatus, setSelectedStatus] = useState<string>('')

    // Once inquiry loads, seed the select if not already set
    const currentStatus = selectedStatus || inquiry?.status || 'NEW'

    const handleUpdateStatus = async () => {
        if (!selectedStatus || selectedStatus === inquiry?.status) {
            Swal.fire({ title: 'No change', text: 'Please select a different status.', icon: 'info' })
            return
        }
        try {
            await updateInquiry({ id, payload: { status: selectedStatus } }).unwrap()
            Swal.fire({ title: 'Updated!', text: 'Inquiry status updated.', icon: 'success', timer: 2000, showConfirmButton: false })
        } catch (err: any) {
            Swal.fire({ title: 'Error', text: err?.data?.message || 'Could not update status.', icon: 'error' })
        }
    }

    // ── Guard states ──────────────────────────────────────────────────────────
    if (!id) return (
        <div className="admin_margin_box">
            <p style={{ color: 'red' }}>No inquiry ID provided.</p>
        </div>
    )
    if (isLoading) return <div className="admin_margin_box"><LoadingComponent /></div>
    if (error || !inquiry) return (
        <div className="admin_margin_box">
            <p style={{ color: 'red' }}>Failed to load inquiry details.</p>
        </div>
    )

    return (
        <div className="admin_margin_box">
            {/* ── Header ── */}
            <div className="admin_titles">
                <AdminTitle label1="Inquiry List" label2="/Inquiry Details" url="/admin/inquery" />
                <div className="Dashboard_title">
                    <h1>Inquiry Details</h1>
                </div>
            </div>

            {/* ── Card ── */}
            <div style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                padding: '28px 32px',
                maxWidth: 760,
                margin: '24px auto',
            }}>
                {/* Status badge top-right */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', margin: 0 }}>
                        Inquiry #{id.slice(-8).toUpperCase()}
                    </h2>
                    <Badge status={inquiry.status} />
                </div>

                {/* ── Inquiry Fields ── */}
                <DetailRow label="Name"       value={inquiry.name} />
                <DetailRow label="Email"      value={inquiry.email} />
                <DetailRow label="Phone"      value={inquiry.phone} />
                <DetailRow label="Property"   value={inquiry.property?.title ?? inquiry.propertyId} />
                <DetailRow label="User"       value={inquiry.user ? `${inquiry.user.name ?? ''}  (${inquiry.user.email ?? ''})` : 'Guest / Unauthenticated'} />
                <DetailRow label="Status"     value={inquiry.status} />
                <DetailRow label="Created At" value={inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : undefined} />
                <DetailRow label="Updated At" value={inquiry.updatedAt ? new Date(inquiry.updatedAt).toLocaleString() : undefined} />

                {/* Message */}
                <div style={{ padding: '14px 0' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Message</div>
                    <div style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        padding: '12px 16px',
                        fontSize: 14,
                        color: '#111827',
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                    }}>
                        {inquiry.message}
                    </div>
                </div>

                {/* ── Update Status ── */}
                <div style={{
                    marginTop: 28,
                    paddingTop: 20,
                    borderTop: '2px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                }}>
                    <label style={{ fontWeight: 600, fontSize: 13, color: '#374151' }}>Update Status:</label>
                    <select
                        value={currentStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{
                            padding: '8px 14px',
                            border: '1px solid #d1d5db',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            background: '#fff',
                            color: statusColor[currentStatus] ?? '#374151',
                            cursor: 'pointer',
                            minWidth: 160,
                        }}
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleUpdateStatus}
                        disabled={updating}
                        style={{
                            background: updating ? '#9ca3af' : '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '9px 22px',
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: updating ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                        }}
                    >
                        {updating ? 'Saving…' : 'Save Status'}
                    </button>
                    <button
                        onClick={() => router.push('/admin/inquery')}
                        style={{
                            background: 'transparent',
                            color: '#6b7280',
                            border: '1px solid #d1d5db',
                            borderRadius: 8,
                            padding: '9px 20px',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        ← Back to List
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InqueryDetails