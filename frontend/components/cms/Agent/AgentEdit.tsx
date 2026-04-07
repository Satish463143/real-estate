'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminTitle from '../AdminTitle/AdminTitle'
import TeamForm from './AgentForm'
import { useRouter } from 'next/navigation'
import { useShowByIdQuery, useUpdateAgentMutation } from '@/components/api/agent.api'
import Swal from 'sweetalert2'

const AgentEdit = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const id = searchParams?.get('id') as string
  const { data, isLoading, error } = useShowByIdQuery(id)
  const [updateAgent] = useUpdateAgentMutation()

  const agentDetails = data?.details

  const submitEvent = async (data: any) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('firstName', data.firstName)
      formData.append('lastName', data.lastName)
      formData.append('phone', data.phone)
      formData.append('email', data.email)
      formData.append('avatarUrl', data.avatarUrl)

      await updateAgent({ id: id, payload: formData }).unwrap()
      Swal.fire({
        title: 'Success',
        text: 'Agent updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      router.push('/admin/team')
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Error updating agent',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } finally {
      setLoading(false)

    }
  }
  return (
    <div className='admin_margin_box'>
      <div className="admin_titles">
        <AdminTitle label1=" Service List" label2="/Edit Service" url="/admin/service" />
        <div className='Dashboard_title'>
          <h1>Edit Service</h1>
        </div>
      </div>
      <div className="banner_form">
        <TeamForm
          detail={
            {
              firstName: agentDetails?.firstName,
              lastName: agentDetails?.lastName,
              phone: agentDetails?.phone,
              email: agentDetails?.email,
              avatarUrl: agentDetails?.avatarUrl,
            }
          }
          submitEvent={submitEvent}
          loading={loading}
          value='Update Agent'
        />
      </div>

    </div>
  )
}

export default AgentEdit