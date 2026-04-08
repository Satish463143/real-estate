'use client'
import { useState } from 'react'
import AdminTitle from '../AdminTitle/AdminTitle'
import { useRouter } from 'next/navigation'
import TestimonalForm from './TestimonalForm'
import { useCreateTestimonialsMutation } from '@/components/api/testimonal.api'
import Swal from 'sweetalert2'

const TestimonalAdd = () => {
  const [loading, setLoading] = useState(false)
  const [createTestimonials] = useCreateTestimonialsMutation()
  const router = useRouter()

  const submitEvent = async (data: any) => {
    setLoading(true)
    try {
      const formData = new FormData()

      formData.append('name', data.name)
      formData.append('rating', data.rating)
      formData.append('review', data.review)
      formData.append('image', data.image)



      await createTestimonials(formData).unwrap()
      Swal.fire({
        title: 'Success',
        text: 'Testimonal created successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      router.push('/admin/testimonal')

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Error creating testimonal',
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
        <AdminTitle label1="Testimonal List" label2="/Add Testimonal" url="/admin/testimonal" />
        <div className='Dashboard_title'>
          <h1>Add Testimonal</h1>
        </div>
      </div>
      <div className="banner_form">
        <TestimonalForm
          submitEvent={submitEvent}
          loading={loading}
          value='Add testimonal'
          detail={null}
        />
      </div>
    </div>
  )
}

export default TestimonalAdd