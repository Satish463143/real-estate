'use client'
import { useState } from 'react'
import AdminTitle from '../AdminTitle/AdminTitle'
import { useRouter } from 'next/navigation'
import TeamForm from './AgentForm'
import { useCreateAgentMutation } from '@/components/api/agent.api'
import Swal from 'sweetalert2'

const AgentAdd = () => {
  const [loading, setLoading] = useState(false)
  const [createAgent] = useCreateAgentMutation()
  const router = useRouter()

  const submitEvent = async (data: any) => {
    setLoading(true)
    try {
      const formData = new FormData()

      formData.append('firstName', data.firstName)
      formData.append('lastName', data.lastName)
      formData.append('phone', data.phone)
      formData.append('email', data.email)
      formData.append('avatarUrl', data.avatarUrl)
      
      await createAgent(formData).unwrap()
      Swal.fire({
        title: 'Success',
        text: 'Agent created successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      router.push('/admin/agent')

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Error creating agent',
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
        <AdminTitle label1="Agent List" label2="/Add Agent" url="/admin/agent" />
        <div className='Dashboard_title'>
          <h1>Add Agent</h1>
        </div>
      </div>
      <div className="banner_form">
        <TeamForm
          submitEvent={submitEvent}
          loading={loading}
          value='Add team'
          detail={null}
        />
      </div>
    </div>
  )
}

export default AgentAdd