'use client'
import { useEffect } from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {TextInputComponent,DescriptionInput,OptionsComponent} from '../../common/InputBox/InputBox'


const BlogForm = ({submitEvent,loading,value,detail}:{submitEvent: (data: any) => void,loading: boolean,value: any,detail: any}) => {

    
    const blogDTO = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        subtitle: Yup.string().required('Subtitle is required'),
        thumbnail: Yup.mixed().required('Thumbnail is required'),
        heroImage: Yup.mixed().required('Hero Image is required'),
        category: Yup.string().required('Category is required'),
        content: Yup.string().required('Content is required'),
        date: Yup.date().required('Date is required'),
        authorName: Yup.string().required('Author Name is required'),
        authorBio: Yup.string().required('Author Bio is required'),
        authorAvatar: Yup.mixed().optional().nullable(),
        readTime: Yup.string().required('Read Time is required'),
        isFeatured: Yup.object({
            value: Yup.string().matches(/^(true|false)$/, 'Is Featured must be either true or false'),
            label: Yup.string().matches(/^(True|False)$/, 'Is Featured must be either true or false'),
        }).required('Is Featured is required'),
    })
    const { control, handleSubmit, setValue,  formState: { errors } } = useForm({
        resolver: yupResolver(blogDTO)
    })

    useEffect(() => {
        if (detail) {
            setValue('title', detail.title )
            setValue('subtitle', detail.subtitle )
            setValue('category', detail.category )
            setValue('content', detail.content )
            setValue('isFeatured', detail.isFeatured)
            setValue('thumbnail', detail.thumbnail)
            setValue('heroImage', detail.heroImage)
            setValue('readTime', detail.readTime)
            setValue('date', detail.date)
            setValue('authorName', detail.authorName)
            setValue('authorBio', detail.authorBio)
            setValue('authorAvatar', detail.authorAvatar)
        }
    }, [detail])

  return (
    <form onSubmit={handleSubmit(submitEvent)}>
        <div className="from_grid">
            <div>
                <label htmlFor="name">Blog Title</label><br />
                <TextInputComponent
                    name="title"
                    placeholder='Enter Title'
                    className=''
                    style={{}}
                    control={control}
                    type='text'
                    defaultValue=''
                    errMsg={errors?.title?.message as string}
                    required={true}
                />
            </div>
            <div>
                <label htmlFor="name">Blog Subtitle</label><br />
                <TextInputComponent
                    name="subtitle"
                    placeholder='Enter Subtitle'
                    className=''
                    style={{}}
                    control={control}
                    type='text'
                    defaultValue=''
                    errMsg={errors?.subtitle?.message as string}
                    required={true}
                />
            </div>
            <div>
                <label htmlFor="name">Blog Category</label><br />
                <TextInputComponent
                    name="category"
                    placeholder='Business, Technology, etc.'
                    className=''
                    style={{}}
                    control={control}
                    type='text'
                    defaultValue=''
                    errMsg={errors?.category?.message as string}
                    required={true}
                />
            </div>
            <div>
                <label htmlFor="name">Blog Date</label><br />
                <TextInputComponent
                    name="date"
                    placeholder='Business, Technology, etc.'
                    className=''
                    style={{}}
                    control={control}
                    type='date'
                    defaultValue=''
                    errMsg={errors?.date?.message as string}
                    required={true}
                />
            </div>
            <div>
                <label htmlFor="name">Read Time</label><br />
                <TextInputComponent
                    name="readTime"
                    placeholder='e.g., "5 min read"'
                    className=''
                    style={{}}
                    control={control}
                    type='text'
                    defaultValue=''
                    errMsg={errors?.readTime?.message as string}
                    required={true}
                />
            </div>
            <div>
                <label htmlFor="name">Blog Content</label><br />
                <DescriptionInput
                    name="content"
                    type="text"
                    control={control}
                    defaultValue=""
                    errMsg={errors?.content?.message as string}
                    required={true}
                />
            </div>
            <div>
                <label htmlFor="name">Is Featured</label><br />
                <OptionsComponent
                    name="isFeatured"
                    control={control}
                    defaultValue=""
                    errMsg={errors?.isFeatured?.message as string}
                    required={true}
                />
            </div>
            
            </div>
            <h3 style={{marginTop:'30px',fontSize:'20px', fontWeight:'bold'}}>Images</h3>
            <div className="from_grid">
                <div>                
                    <label htmlFor="thumbnail"> Thumbnail Image</label><br />
                    <input
                        type='file'
                        onChange={(e) => {
                            const image = (e.target as HTMLInputElement).files?.[0] as File
                            setValue('thumbnail' as any, image)
                        }}
                    /><br />
                </div>
                <div>                
                    <label htmlFor="heroImage"> Hero Image</label><br />
                    <input
                        type='file'
                        onChange={(e) => {
                            const image = (e.target as HTMLInputElement).files?.[0] as File
                            setValue('heroImage' as any, image)
                        }}
                    /><br />
                </div>            
            </div>
            <h3 style={{marginTop:'30px',fontSize:'20px', fontWeight:'bold'}}>Author Details</h3>
            <div className="from_grid">
                <div>
                    <label htmlFor="name">Author Name</label><br />
                    <TextInputComponent
                        name={`authorName`}
                        placeholder='Enter Author Name'
                        className=''
                        style={{}}
                        control={control}
                        type='text'
                        defaultValue=''
                        errMsg={errors?.authorName?.message as string}
                        required={true}
                    />
                </div>
                <div>
                    <label htmlFor="name">Author Bio</label><br />
                    <TextInputComponent
                        name={`authorBio`}
                        placeholder='Enter Author Bio'
                        className=''
                        style={{}}
                        control={control}
                        type='text'
                        defaultValue=''
                        errMsg={errors?.authorBio?.message as string}
                        required={true}
                    />
                </div>
                <div>
                <label htmlFor="name">Author Image</label><br />
                <input
                    type='file'
                    onChange={(e) => {
                        const image = (e.target as HTMLInputElement).files?.[0] as File
                        setValue('authorAvatar' as any, image)
                    }}
                /><br />
                </div>
            </div>
        <div style={{ display: 'flex', justifyContent: 'center',  }}>            
            <input className='submit_btn' type="submit" value={value} disabled={loading} style={{cursor:'pointer'}}/>
        </div>
    </form>
  )
}

export default BlogForm