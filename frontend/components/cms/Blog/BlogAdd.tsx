'use client'
import React, { useState } from 'react'
import AdminTitle from '../AdminTitle/AdminTitle'
import BlogForm from './BlogForm'
import { useCreateBlogMutation } from '../../api/blog.api'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

const BlogAdd = () => {
  const [loading, setLoading] = useState(false)
  const [createBlog] = useCreateBlogMutation()
  const router = useRouter()

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

    await createBlog(formData).unwrap()
      Swal.fire({
        title: 'Success',
        text: 'Blog created successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      router.push('/admin/blog')
      
    }catch(error){
      Swal.fire({
        title: 'Error',
        text: 'Error creating blog',
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
            <AdminTitle label1=" Blog List" label2="/Add Blog" url="/admin/blog" />
            <div className='Dashboard_title'>
                <h1>Add Blog</h1>
            </div>
        </div>
        <div className="banner_form">
            <BlogForm
                submitEvent={submitEvent}
                loading={loading}
                value='Add blog'
                detail={null}
            />
        </div>
    </div>
  )
}

export default BlogAdd