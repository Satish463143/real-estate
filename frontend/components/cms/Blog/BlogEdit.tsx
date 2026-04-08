'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useShowByIdQuery,useUpdateBlogMutation } from '@/components/api/blog.api'
import AdminTitle from '../AdminTitle/AdminTitle'
import BlogForm from './BlogForm'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

const BlogEdit = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const id = searchParams?.get('id') as string
  const {data, isLoading, error} = useShowByIdQuery(id)
  const [updateBlog] = useUpdateBlogMutation()

  const blogDetails = data?.details

  const submitEvent = async(data: any) => {
    setLoading(true)
    try{
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('subtitle', data.subtitle)
      formData.append('thumbnail', data.thumbnail)
      formData.append('heroImage', data.heroImage)
      formData.append('category', data.category)
      formData.append('content', data.content)
      formData.append('date', data.date)
      formData.append('isFeatured', data.isFeatured.value)
      formData.append('readTime', data.readTime)
      formData.append('authorName', data.authorName)
      formData.append('authorBio', data.authorBio)
      formData.append('authorAvatar', data.authorAvatar)

      await updateBlog({id: id, payload: formData}).unwrap()
      Swal.fire({
        title: 'Success',
        text: 'Blog updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      router.push('/admin/blog')
    }catch(error){
      Swal.fire({
        title: 'Error',
        text: 'Error updating blog',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      console.log(error)
    }finally{
      setLoading(false)

    }
  }

  return (
    <div className='admin_margin_box'>
      <div className="admin_titles">
        <AdminTitle label1=" Blog List" label2="/Edit Blog" url="/admin/blog" />
        <div className='Dashboard_title'>
          <h1>Edit Blog</h1>
        </div>
      </div>
      <div className="banner_form">
        <BlogForm 
          detail={
            {
              title: blogDetails?.title,
              subtitle: blogDetails?.subtitle,
              thumbnail: blogDetails?.thumbnail,
              heroImage: blogDetails?.heroImage,
              category: blogDetails?.category,
              content: blogDetails?.content,
              date: blogDetails?.date,
              isFeatured: {
                label: blogDetails?.isFeatured === "true" && "True" || blogDetails?.isFeatured === "false" && "False",
                value: blogDetails?.isFeatured,
              },
              readTime: blogDetails?.readTime,
              authorName: blogDetails?.authorName,
              authorBio: blogDetails?.authorBio,
              authorAvatar: blogDetails?.authorAvatar,
            }
          }
          submitEvent={submitEvent}
          loading={loading}
          value='Update blog'
        />
      </div>

    </div>
  )
}

export default BlogEdit