'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminTitle from '../AdminTitle/AdminTitle'
import TestimonalForm from './TestimonalForm'
import { useRouter } from 'next/navigation'
import { useShowByIdQuery, useUpdateTestimonialsMutation } from '@/components/api/testimonal.api'
import Swal from 'sweetalert2'

const TestimonalEdit = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const id = searchParams?.get('id') as string
  const { data, isLoading, error } = useShowByIdQuery(id)
  const [updateTestimonials] = useUpdateTestimonialsMutation()

  const testimonalDetails = data?.details

  const submitEvent = async (data: any) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('rating', data.rating)
      formData.append('review', data.review)
      formData.append('image', data.image)

      await updateTestimonials({ id: id, payload: formData }).unwrap()
      Swal.fire({
        title: 'Success',
        text: 'Agent updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      router.push('/admin/testimonal')
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Error updating testimonal',
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
        <AdminTitle label1=" Testimonal List" label2="/Edit Testimonal" url="/admin/testimonal" />
        <div className='Dashboard_title'>
          <h1>Edit Testimonal</h1>
        </div>
      </div>
      <div className="banner_form">
        <TestimonalForm
          detail={
            {
              name: testimonalDetails?.name,
              rating: testimonalDetails?.rating,
              review: testimonalDetails?.review,
              image: testimonalDetails?.image,
            }
          }
          submitEvent={submitEvent}
          loading={loading}
          value='Update Testimonal'
        />
      </div>

    </div>
  )
}

export default TestimonalEdit